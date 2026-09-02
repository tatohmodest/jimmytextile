import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { signDirectUpload } from "@/lib/cloudinary";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  folder: z.string().max(80).optional(),
  resourceType: z.enum(["image", "video"]),
});

export async function POST(request: Request) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(`upload-sign:${clientIp(request)}`, 80, 60_000).ok) {
    return NextResponse.json({ error: "Upload rate limit reached" }, { status: 429 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
  }
  return NextResponse.json(
    signDirectUpload({
      folder: parsed.data.folder || "media",
      resourceType: parsed.data.resourceType,
    })
  );
}
