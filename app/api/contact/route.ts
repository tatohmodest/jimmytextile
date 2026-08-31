import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().nullable(),
  message: z.string().min(4).max(2000),
});

export async function POST(request: Request) {
  if (!rateLimit(`contact:${clientIp(request)}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Please wait before sending another message." }, { status: 429 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("inquiries").insert(parsed.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
