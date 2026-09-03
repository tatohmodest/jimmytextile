import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { CATEGORY_PHOTOS } from "./catalog-photos.mjs";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function productMainPhoto(slug) {
  const { data: product } = await admin.from("products").select("id").eq("slug", slug).is("deleted_at", null).maybeSingle();
  if (!product) return null;
  const { data: image } = await admin
    .from("product_images")
    .select("image_url")
    .eq("product_id", product.id)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();
  return image?.image_url || null;
}

async function uploadCategorySource(sourceUrl, slug) {
  const result = await cloudinary.uploader.upload(sourceUrl, {
    folder: "jimmy-home-textile/categories",
    public_id: slug,
    overwrite: true,
    resource_type: "image",
    eager: [{ width: 1800, crop: "limit", quality: "auto:good" }],
    eager_async: false,
  });
  return result.eager?.[0]?.secure_url || result.secure_url;
}

async function main() {
  const replaceExisting = process.argv.includes("--replace");
  const { data: categories, error } = await admin.from("categories").select("id, name, slug, image_url").eq("is_active", true);
  if (error) throw error;

  for (const category of categories) {
    const spec = CATEGORY_PHOTOS[category.slug];
    if (!spec) {
      console.log("skip (no map)", category.slug);
      continue;
    }
    if (category.image_url && !replaceExisting) {
      console.log("keep", category.slug);
      continue;
    }
    let imageUrl = null;
    if (spec.fromProduct) {
      imageUrl = await productMainPhoto(spec.fromProduct);
    }
    if (!imageUrl && spec.source) {
      process.stdout.write(`upload ${category.slug}… `);
      imageUrl = await uploadCategorySource(spec.source, category.slug);
      console.log("ok");
    }
    if (!imageUrl) {
      console.log("no photo found", category.slug);
      continue;
    }
    const { error: updateError } = await admin.from("categories").update({ image_url: imageUrl }).eq("id", category.id);
    if (updateError) throw updateError;
    console.log("set", category.slug);
  }
  console.log("Featured category photos attached.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
