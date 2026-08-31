import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizeEmail } from "@/lib/admins";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureAuthUser } from "@/lib/otp";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(4).max(12),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`otp-verify:${ip}`, 20, 10 * 60_000).ok) {
    return NextResponse.json({ error: "Too many attempts. Please wait and request a new code." }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the email and the code from your inbox." }, { status: 400 });
  }

  const email = normalizeEmail(parsed.data.email);
  const token = parsed.data.token.replace(/\s+/g, "");
  const supabase = await createSupabaseServerClient();

  const attempts: Array<"email" | "magiclink"> = ["email", "magiclink"];
  let lastMessage = "That code is invalid or has expired.";

  for (const type of attempts) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type });
    if (!error) {
      await ensureAuthUser(email);
      return NextResponse.json({ ok: true });
    }
    lastMessage = error.message;
  }

  return NextResponse.json({ error: lastMessage }, { status: 400 });
}
