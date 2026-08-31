import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = z.object({ full_name: z.string().max(120), phone: z.string().max(40) }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("profiles").update(parsed.data).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
