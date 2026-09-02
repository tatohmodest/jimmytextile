import { MAX_UPLOAD_BYTES, pickCompressedAsset, type CloudinaryUploadResult } from "@/lib/media";

export async function uploadMediaFile(
  file: File,
  folder: string,
  resourceType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image"
): Promise<CloudinaryUploadResult> {
  if (file.size >= MAX_UPLOAD_BYTES) {
    throw new Error("Each file must be under 10MB.");
  }
  const signRes = await fetch("/api/admin/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, resourceType }),
  });
  const sign = await signRes.json();
  if (!signRes.ok) throw new Error(sign.error || "Could not start upload");

  const body = new FormData();
  body.set("file", file);
  body.set("api_key", sign.apiKey);
  body.set("timestamp", String(sign.timestamp));
  body.set("signature", sign.signature);
  body.set("folder", sign.folder);
  body.set("eager", sign.eager);
  body.set("eager_async", "false");
  body.set("use_filename", "true");
  body.set("unique_filename", "true");

  const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/${resourceType}/upload`, {
    method: "POST",
    body,
  });
  const cloud = await cloudRes.json();
  if (!cloudRes.ok) throw new Error(cloud.error?.message || "Cloudinary rejected the file");

  const asset = pickCompressedAsset(cloud);
  await fetch("/api/admin/upload/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: asset.url,
      publicId: asset.publicId,
      folder,
      width: asset.width,
      height: asset.height,
      bytes: asset.bytes,
      resourceType: asset.resourceType,
      posterUrl: asset.posterUrl,
      altText: file.name,
    }),
  });
  return asset;
}
