import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(6),
  address: z.string().min(4),
  city: z.string().min(2),
  region: z.string().min(2),
  instructions: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin.from("addresses").select("id").eq("user_id", user.id).eq("is_default", true).maybeSingle();
  if (existing) {
    await admin.from("addresses").update({ ...parsed.data, is_default: true }).eq("id", existing.id);
  } else {
    await admin.from("addresses").insert({ ...parsed.data, user_id: user.id, is_default: true });
  }
  return NextResponse.json({ ok: true });
}
