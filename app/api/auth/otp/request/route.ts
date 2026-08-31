import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { mailerConfigured, sendSignInOtpEmail } from "@/lib/mailer";
import { ensureAuthUser, issueEmailOtp } from "@/lib/otp";
import { normalizeEmail } from "@/lib/admins";

const schema = z.object({
  email: z.string().email(),
  full_name: z.string().max(120).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
});

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json().catch(() => null);
  }
  const form = await request.formData().catch(() => null);
  if (!form) return null;
  return {
    email: form.get("email"),
    full_name: form.get("full_name"),
    phone: form.get("phone"),
  };
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`otp-ip:${ip}`, 8, 10 * 60_000).ok) {
    return NextResponse.json({ error: "Too many sign-in attempts. Please wait a few minutes." }, { status: 429 });
  }

  const parsed = schema.safeParse(await readPayload(request));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = normalizeEmail(parsed.data.email);
  if (!rateLimit(`otp-email:${email}`, 5, 10 * 60_000).ok) {
    return NextResponse.json({ error: "A code was already sent. Check your inbox, or wait before requesting another." }, { status: 429 });
  }

  if (!mailerConfigured()) {
    return NextResponse.json({ error: "Email delivery is not configured on the server." }, { status: 500 });
  }

  try {
    await ensureAuthUser(email, {
      full_name: parsed.data.full_name?.trim() || undefined,
      phone: parsed.data.phone?.trim() || undefined,
    });
    const code = await issueEmailOtp(email);
    await sendSignInOtpEmail(email, code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send a sign-in code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
