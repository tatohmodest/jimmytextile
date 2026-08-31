import { v2 as cloudinary } from "cloudinary";
import { IMAGE_EAGER, pickCompressedAsset, VIDEO_EAGER } from "@/lib/media";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };
export { MAX_UPLOAD_BYTES, cloudinaryUrl, pickCompressedAsset, videoPosterUrl } from "@/lib/media";

export function signDirectUpload(input: { folder: string; resourceType: "image" | "video" }) {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = input.folder.startsWith("jimmy-home-textile/")
    ? input.folder
    : `jimmy-home-textile/${input.folder}`;
  const eager = input.resourceType === "video" ? VIDEO_EAGER : IMAGE_EAGER;
  const params: Record<string, string | number> = {
    timestamp,
    folder,
    eager,
    eager_async: "false",
    use_filename: "true",
    unique_filename: "true",
  };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET || "");
  return {
    timestamp,
    signature,
    folder,
    eager,
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    resourceType: input.resourceType,
  };
}

export async function uploadImageBuffer(
  buffer: Buffer,
  folder = "jimmy-home-textile",
  filename?: string
) {
  const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    public_id: filename,
    resource_type: "image",
    overwrite: false,
    eager: [{ width: 2400, crop: "limit", quality: "auto:good" }],
    eager_async: false,
  });
  return pickCompressedAsset(result);
}

export async function uploadImageFromUrl(url: string, folder = "jimmy-home-textile") {
  const result = await cloudinary.uploader.upload(url, {
    folder,
    resource_type: "image",
    overwrite: false,
    eager: [{ width: 2400, crop: "limit", quality: "auto:good" }],
  });
  return pickCompressedAsset(result);
}

export async function destroyAsset(publicId: string, resourceType: "image" | "video" = "image") {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export async function destroyImage(publicId: string) {
  await destroyAsset(publicId, "image");
}
