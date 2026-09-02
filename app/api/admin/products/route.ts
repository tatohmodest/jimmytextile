import { NextResponse } from "next/server";
import { requireAdmin, requireStaff } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { destroyImage } from "@/lib/cloudinary";

function parseColors(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, hex] = line.split("|").map((s) => s.trim());
      return { name, hex: hex || "#C4A484" };
    });
}

function parseList(raw: string) {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseTiers(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [range, price] = line.split(":").map((s) => s.trim());
      const unit = Number(String(price || "").replace(/,/g, ""));
      if (!range || !Number.isFinite(unit)) return null;
      if (range.includes("+")) {
        return { min_qty: Number(range.replace("+", "")), max_qty: null, unit_price: unit };
      }
      const [min, max] = range.split("-").map((s) => Number(s.trim()));
      if (!Number.isFinite(min)) return null;
      return { min_qty: min, max_qty: Number.isFinite(max) ? max : null, unit_price: unit };
    })
    .filter(Boolean);
}

export async function POST(request: Request) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await request.formData();
  const action = String(fd.get("action") || "create");
  const admin = createSupabaseAdminClient();

  if (action === "delete") {
    const id = String(fd.get("id"));
    const { data: used } = await admin.from("order_items").select("id").eq("product_id", id).limit(1);
    if (used?.length) {
      await admin.from("products").update({ deleted_at: new Date().toISOString(), status: "archived" }).eq("id", id);
    } else {
      await admin.from("products").delete().eq("id", id);
    }
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  const name = String(fd.get("name") || "");
  const payload = {
    name,
    name_fr: String(fd.get("name_fr") || "") || null,
    slug: slugify(String(fd.get("slug") || name)),
    description: String(fd.get("description") || ""),
    description_fr: String(fd.get("description_fr") || "") || null,
    category_id: String(fd.get("category_id") || "") || null,
    price: Number(fd.get("price") || 0),
    discount_price: fd.get("discount_price") ? Number(fd.get("discount_price")) : null,
    sku: String(fd.get("sku") || "") || null,
    stock: Number(fd.get("stock") || 0),
    sizes: parseList(String(fd.get("sizes") || "")),
    colors: parseColors(String(fd.get("colors") || "")),
    designs: parseList(String(fd.get("designs") || "")),
    material: String(fd.get("material") || "") || null,
    dimensions: String(fd.get("dimensions") || "") || null,
    care_instructions: String(fd.get("care_instructions") || "") || null,
    whats_included: String(fd.get("whats_included") || "") || null,
    whats_included_fr: String(fd.get("whats_included_fr") || "") || null,
    delivery_information: String(fd.get("delivery_information") || "") || null,
    featured: fd.get("featured") === "on",
    status: String(fd.get("status") || "draft"),
    seo_title: String(fd.get("seo_title") || "") || null,
    seo_description: String(fd.get("seo_description") || "") || null,
    price_tiers: parseTiers(String(fd.get("price_tiers") || "")),
    image_alts: fd.getAll("image_alts").map((item) => String(item).trim()).filter(Boolean),
  };

  let productId = String(fd.get("id") || "");
  if (action === "update" && productId) {
    let { error } = await admin.from("products").update(payload).eq("id", productId);
    if (error && /column|schema cache/i.test(error.message)) {
      const { name_fr, description_fr, whats_included_fr, price_tiers, image_alts, ...basic } = payload;
      ({ error } = await admin.from("products").update(basic).eq("id", productId));
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    let { data, error } = await admin.from("products").insert(payload).select("id").single();
    if ((error || !data) && error && /column|schema cache/i.test(error.message)) {
      const { name_fr, description_fr, whats_included_fr, price_tiers, image_alts, ...basic } = payload;
      ({ data, error } = await admin.from("products").insert(basic).select("id").single());
    }
    if (error || !data) return NextResponse.json({ error: error?.message || "Create failed" }, { status: 400 });
    productId = data.id;
  }

  const { data: saved } = await admin.from("products").select("slug").eq("id", productId).maybeSingle();
  if (saved?.slug) {
    const { data: extrasRow } = await admin.from("site_settings").select("value").eq("key", "catalog_extras").maybeSingle();
    const extras = (extrasRow?.value && typeof extrasRow.value === "object" ? { ...(extrasRow.value as Record<string, unknown>) } : {}) as Record<string, unknown>;
    extras[saved.slug] = {
      name_fr: payload.name_fr,
      description_fr: payload.description_fr,
      whats_included_fr: payload.whats_included_fr,
      price_tiers: payload.price_tiers,
      image_alts: payload.image_alts,
    };
    await admin.from("site_settings").upsert({ key: "catalog_extras", value: extras, updated_at: new Date().toISOString() });
  }

  const imageUrls = fd.getAll("image_urls").map((item) => String(item).trim());
  const imageAlts = fd.getAll("image_alts").map((item) => String(item).trim());
  const rows = imageUrls
    .map((image_url, position) => ({
      product_id: productId,
      image_url,
      alt_text: imageAlts[position] || name,
      position,
    }))
    .filter((row) => row.image_url);
  await admin.from("product_images").delete().eq("product_id", productId);
  if (rows.length) {
    await admin.from("product_images").insert(rows);
  }

  return NextResponse.redirect(new URL(`/admin/products/${productId}`, request.url));
}

export async function DELETE(request: Request) {
  const adminUser = await requireAdmin();
  if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const publicId = searchParams.get("publicId");
  if (publicId) await destroyImage(publicId);
  return NextResponse.json({ ok: true });
}
