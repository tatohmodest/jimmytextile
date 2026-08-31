import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { MAX_UPLOAD_BYTES, uploadImageBuffer } from "@/lib/cloudinary";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(`upload:${clientIp(request)}`, 20, 60_000).ok) {
    return NextResponse.json({ error: "Upload rate limit reached" }, { status: 429 });
  }
  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "media");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size >= MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
  }
  if (file.type.startsWith("video/")) {
    return NextResponse.json(
      { error: "Videos upload directly to Cloudinary. Use the gallery or media uploader." },
      { status: 400 }
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadImageBuffer(buffer, `jimmy-home-textile/${folder}`);
  const admin = createSupabaseAdminClient();
  await admin.from("media_library").insert({
    url: uploaded.url,
    public_id: uploaded.publicId,
    folder,
    width: uploaded.width,
    height: uploaded.height,
    bytes: uploaded.bytes,
    uploaded_by: staff.id,
    alt_text: file.name,
  });
  return NextResponse.json(uploaded);
}
