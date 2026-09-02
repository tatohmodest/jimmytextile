import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { CATEGORIES, PRODUCTS } from "./catalog-data.mjs";

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

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ALTER_SQL = `
alter table public.products add column if not exists name_fr text;
alter table public.products add column if not exists description_fr text;
alter table public.products add column if not exists whats_included_fr text;
alter table public.products add column if not exists price_tiers jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists image_alts jsonb not null default '[]'::jsonb;
alter table public.categories add column if not exists name_fr text;
alter table public.categories add column if not exists description_fr text;
`;

async function tryAlter() {
  const endpoints = [`${url}/pg/query`, `${url}/pg-meta/default/query`, `${url}/pg-meta/query`];
  for (const endpoint of endpoints) {
    for (const body of [{ query: ALTER_SQL }, { sql: ALTER_SQL }]) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        console.log("migrate", endpoint, res.status, text.slice(0, 180));
        if (res.ok) return true;
      } catch (err) {
        console.log("migrate failed", endpoint, err.message);
      }
    }
  }
  return false;
}

async function upsertSettings(key, value) {
  const { error } = await admin.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

async function main() {
  await tryAlter();

  const { data: existingContact } = await admin.from("site_settings").select("value").eq("key", "contact").maybeSingle();
  const current = existingContact?.value && typeof existingContact.value === "object" ? existingContact.value : {};
  await upsertSettings("contact", {
    ...current,
    phone: "+237 6 81 52 39 15",
    phone_secondary: "+237 6 88 95 00 42",
    address: "Paris Dancing Akwa",
    city: "Douala",
    region: "Littoral",
    whatsapp: "237681523915",
    facebook: current.facebook || "https://web.facebook.com/jimmyhometextile1/",
    email: current.email || "hello@jimmyhometextile.com",
    hours: current.hours || "Monday — Saturday, 8:00am – 6:00pm",
    hours_fr: current.hours_fr || "Lundi — Samedi, 8h – 18h",
  });
  console.log("Updated contact: Paris Dancing Akwa, 681523915 / 688950042");

  const categoryIds = {};
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const payload = {
      name: cat.name,
      name_fr: cat.name_fr,
      slug: cat.slug,
      description: cat.description,
      description_fr: cat.description_fr,
      position: i,
      is_featured: true,
      is_active: true,
      seo_title: `${cat.name} | Jimmy Home Textile`,
      seo_description: cat.description,
    };
    let { data, error } = await admin.from("categories").upsert(payload, { onConflict: "slug" }).select("id, slug").single();
    if (error && /name_fr|description_fr|column/i.test(error.message)) {
      const { name_fr, description_fr, ...basic } = payload;
      ({ data, error } = await admin.from("categories").upsert(basic, { onConflict: "slug" }).select("id, slug").single());
      console.log("categories without FR columns");
    }
    if (error) throw error;
    categoryIds[data.slug] = data.id;
  }

  const catalogSlugs = PRODUCTS.map((p) => p.slug);
  for (const p of PRODUCTS) {
    const payload = {
      name: p.name,
      name_fr: p.name_fr,
      slug: p.slug,
      description: p.description,
      description_fr: p.description_fr,
      category_id: categoryIds[p.category] || null,
      price: p.price,
      sku: p.sku,
      stock: p.stock,
      featured: p.featured,
      status: p.status,
      whats_included: p.whats_included,
      whats_included_fr: p.whats_included_fr,
      delivery_information: p.delivery_information,
      care_instructions: p.care_instructions,
      price_tiers: p.price_tiers,
      image_alts: p.image_alts,
      seo_title: `${p.name} | Jimmy Home Textile`,
      seo_description: p.description,
      deleted_at: null,
    };
    let { data, error } = await admin.from("products").upsert(payload, { onConflict: "slug" }).select("id, slug").single();
    if (error && /column|schema cache|name_fr|price_tiers|image_alts/i.test(error.message)) {
      console.log("product extra columns missing, retrying basic fields for", p.slug, error.message);
      const basic = {
        name: p.name,
        slug: p.slug,
        description: `${p.description}\n\n${p.name_fr}`,
        category_id: payload.category_id,
        price: p.price,
        sku: p.sku,
        stock: p.stock,
        featured: p.featured,
        status: p.status,
        whats_included: p.whats_included,
        delivery_information: p.delivery_information,
        care_instructions: p.care_instructions,
        seo_title: payload.seo_title,
        seo_description: p.description,
        deleted_at: null,
      };
      ({ data, error } = await admin.from("products").upsert(basic, { onConflict: "slug" }).select("id, slug").single());
    }
    if (error) throw error;
    await admin.from("product_images").delete().eq("product_id", data.id);
    console.log("seeded", p.slug);
  }

  const extras = {};
  for (const p of PRODUCTS) {
    extras[p.slug] = {
      name_fr: p.name_fr,
      description_fr: p.description_fr,
      whats_included_fr: p.whats_included_fr,
      price_tiers: p.price_tiers,
      image_alts: p.image_alts,
    };
  }
  await upsertSettings("catalog_extras", extras);
  const categoryExtras = {};
  for (const cat of CATEGORIES) {
    categoryExtras[cat.slug] = { name_fr: cat.name_fr, description_fr: cat.description_fr };
  }
  await upsertSettings("category_extras", categoryExtras);

  const { data: others, error: othersError } = await admin
    .from("products")
    .select("id, slug")
    .is("deleted_at", null);
  if (othersError) console.log("list products:", othersError.message);
  for (const row of others || []) {
    if (catalogSlugs.includes(row.slug)) continue;
    await admin.from("products").update({ deleted_at: new Date().toISOString(), status: "archived" }).eq("id", row.id);
    console.log("archived old product", row.slug);
  }

  console.log("Catalog seed complete:", PRODUCTS.length, "products");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
