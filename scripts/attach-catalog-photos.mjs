import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { CATALOG_PHOTOS } from "./catalog-photos.mjs";
import { PRODUCTS } from "./catalog-data.mjs";

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
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Missing Cloudinary credentials");
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

function altFor(name, index) {
  return index === 0 ? `${name} — main product photo` : `${name} — related photo ${index + 1}`;
}

async function uploadSource(sourceUrl, publicId) {
  const result = await cloudinary.uploader.upload(sourceUrl, {
    folder: "jimmy-home-textile/products",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    eager: [{ width: 2400, crop: "limit", quality: "auto:good" }],
    eager_async: false,
  });
  const compressed = result.eager?.[0]?.secure_url || result.secure_url;
  return { url: compressed, publicId: result.public_id };
}

async function main() {
  const replaceExisting = process.argv.includes("--replace");
  const { data: products, error } = await admin
    .from("products")
    .select("id, name, slug")
    .is("deleted_at", null);
  if (error) throw error;

  for (const product of products) {
    const sources = CATALOG_PHOTOS[product.slug];
    if (!sources?.length) {
      console.log("skip (no stock map)", product.slug);
      continue;
    }
    const { data: existing } = await admin
      .from("product_images")
      .select("id")
      .eq("product_id", product.id);
    if (existing?.length && !replaceExisting) {
      console.log("keep existing photos", product.slug, existing.length);
      continue;
    }

    const uploaded = [];
    for (let i = 0; i < sources.length; i += 1) {
      const publicId = `${product.slug}-${i + 1}`;
      process.stdout.write(`upload ${product.slug} ${i + 1}/${sources.length}… `);
      const asset = await uploadSource(sources[i], publicId);
      uploaded.push({
        product_id: product.id,
        image_url: asset.url,
        public_id: asset.publicId,
        alt_text: altFor(product.name, i),
        position: i,
      });
      console.log("ok");
    }

    await admin.from("product_images").delete().eq("product_id", product.id);
    const { error: imgErr } = await admin.from("product_images").insert(uploaded);
    if (imgErr) throw imgErr;
    console.log("attached", product.slug, uploaded.length);
  }

  const extras = {};
  const { data: extrasRow } = await admin.from("site_settings").select("value").eq("key", "catalog_extras").maybeSingle();
  Object.assign(extras, extrasRow?.value && typeof extrasRow.value === "object" ? extrasRow.value : {});
  for (const p of PRODUCTS) {
    extras[p.slug] = {
      ...(extras[p.slug] || {}),
      image_alts: (CATALOG_PHOTOS[p.slug] || []).map((_, i) => altFor(p.name, i)),
    };
  }
  await admin.from("site_settings").upsert({
    key: "catalog_extras",
    value: extras,
    updated_at: new Date().toISOString(),
  });
  console.log("Catalog photos attached.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
