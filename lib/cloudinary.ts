import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function cloudinaryUrl(source: string, width = 1200, quality = "auto") {
  if (!source) return source;
  if (source.includes("res.cloudinary.com") && source.includes("/upload/")) {
    return source.replace("/upload/", `/upload/f_auto,q_${quality},w_${width},c_limit/`);
  }
  return source;
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
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return {
    url: result.secure_url as string,
    publicId: result.public_id as string,
    width: result.width as number,
    height: result.height as number,
    bytes: result.bytes as number,
  };
}

export async function uploadImageFromUrl(url: string, folder = "jimmy-home-textile") {
  const result = await cloudinary.uploader.upload(url, {
    folder,
    resource_type: "image",
    overwrite: false,
  });
  return {
    url: result.secure_url as string,
    publicId: result.public_id as string,
    width: result.width as number,
    height: result.height as number,
    bytes: result.bytes as number,
  };
}

export async function destroyImage(publicId: string) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
