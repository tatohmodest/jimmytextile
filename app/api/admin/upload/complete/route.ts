import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { MAX_UPLOAD_BYTES } from "@/lib/media";

const schema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  folder: z.string().max(80).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  bytes: z.number().optional(),
  resourceType: z.enum(["image", "video"]).optional(),
  posterUrl: z.preprocess((value) => (value === "" || value == null ? undefined : value), z.string().url().optional()),
  altText: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(`upload-complete:${clientIp(request)}`, 30, 60_000).ok) {
    return NextResponse.json({ error: "Upload rate limit reached" }, { status: 429 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upload result" }, { status: 400 });
  }
  if ((parsed.data.bytes || 0) > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
  }
  const admin = createSupabaseAdminClient();
  const row = {
    url: parsed.data.url,
    public_id: parsed.data.publicId,
    folder: parsed.data.folder || "media",
    width: parsed.data.width || null,
    height: parsed.data.height || null,
    bytes: parsed.data.bytes || null,
    uploaded_by: staff.id,
    alt_text: parsed.data.altText || "",
  };
  const { error } = await admin.from("media_library").insert(row);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, ...parsed.data });
}
