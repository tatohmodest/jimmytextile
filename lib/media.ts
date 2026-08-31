export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const IMAGE_EAGER = "c_limit,w_2400,q_auto:good";
export const VIDEO_EAGER = "c_limit,w_1920,q_auto:good,vc_auto,f_mp4|so_0,c_limit,w_1400,q_auto,f_jpg";

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  resourceType: "image" | "video";
  posterUrl?: string;
  duration?: number;
};

export function cloudinaryUrl(source: string, width = 1200, quality = "auto:good") {
  if (!source) return source;
  if (source.includes("res.cloudinary.com") && source.includes("/upload/")) {
    return source.replace("/upload/", `/upload/f_auto,q_${quality},w_${width},c_limit/`);
  }
  return source;
}

export function videoPosterUrl(source: string, publicId?: string, cloudName?: string) {
  if (source.includes("res.cloudinary.com") && source.includes("/video/upload/")) {
    return source
      .replace("/video/upload/", "/video/upload/so_0,w_1400,q_auto,f_jpg/")
      .replace(/\.(mp4|webm|mov|m4v)(\?.*)?$/i, ".jpg");
  }
  const name = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  if (publicId && name) {
    return `https://res.cloudinary.com/${name}/video/upload/so_0,w_1400,q_auto,f_jpg/${publicId}.jpg`;
  }
  return source;
}

export function pickCompressedAsset(result: {
  secure_url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  bytes?: number;
  resource_type?: string;
  duration?: number;
  eager?: Array<{ secure_url?: string; bytes?: number; width?: number; height?: number; format?: string }>;
}): CloudinaryUploadResult {
  const resourceType = result.resource_type === "video" ? "video" : "image";
  const eager = result.eager || [];
  const compressed =
    resourceType === "video"
      ? eager.find((item) => (item.format || "").toLowerCase().includes("mp4")) || eager[0]
      : eager[0];
  const poster = eager.find((item) => ["jpg", "png", "webp", "jpeg"].includes((item.format || "").toLowerCase()));
  const url = compressed?.secure_url || result.secure_url || "";
  return {
    url,
    publicId: result.public_id || "",
    width: compressed?.width || result.width || 0,
    height: compressed?.height || result.height || 0,
    bytes: compressed?.bytes || result.bytes || 0,
    resourceType,
    posterUrl: poster?.secure_url || (resourceType === "video" ? videoPosterUrl(url, result.public_id) : undefined),
    duration: result.duration,
  };
}
