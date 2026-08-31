import { NextResponse } from "next/server";
import { requireStaff, requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await request.formData();
  const action = String(fd.get("action"));
  const admin = createSupabaseAdminClient();

  if (action === "category") {
    const payload = {
      name: String(fd.get("name")),
      slug: slugify(String(fd.get("slug") || fd.get("name"))),
      description: String(fd.get("description") || ""),
      image_url: String(fd.get("image_url") || "") || null,
      position: Number(fd.get("position") || 0),
      is_featured: fd.get("is_featured") === "on",
      is_active: fd.get("is_active") === "on",
    };
    const id = String(fd.get("id") || "");
    if (id) await admin.from("categories").update(payload).eq("id", id);
    else await admin.from("categories").insert(payload);
    return NextResponse.redirect(new URL("/admin/categories", request.url));
  }

  if (action === "delete-category") {
    await admin.from("categories").delete().eq("id", String(fd.get("id")));
    return NextResponse.redirect(new URL("/admin/categories", request.url));
  }

  if (action === "order-status") {
    await admin
      .from("orders")
      .update({ order_status: String(fd.get("order_status")) })
      .eq("id", String(fd.get("id")));
    return NextResponse.redirect(new URL(`/admin/orders/${fd.get("id")}`, request.url));
  }

  if (action === "inventory") {
    await admin.from("products").update({ stock: Number(fd.get("stock") || 0) }).eq("id", String(fd.get("id")));
    return NextResponse.redirect(new URL("/admin/inventory", request.url));
  }

  if (action === "promotion") {
    const payload = {
      heading: String(fd.get("heading")),
      description: String(fd.get("description") || ""),
      image_url: String(fd.get("image_url") || "") || null,
      button_text: String(fd.get("button_text") || ""),
      button_link: String(fd.get("button_link") || ""),
      is_active: fd.get("is_active") === "on",
      position: Number(fd.get("position") || 0),
    };
    const id = String(fd.get("id") || "");
    if (id) await admin.from("promotions").update(payload).eq("id", id);
    else await admin.from("promotions").insert(payload);
    return NextResponse.redirect(new URL("/admin/promotions", request.url));
  }

  if (action === "delete-promo") {
    await admin.from("promotions").delete().eq("id", String(fd.get("id")));
    return NextResponse.redirect(new URL("/admin/promotions", request.url));
  }

  if (action === "homepage") {
    const adminOnly = await requireAdmin();
    if (!adminOnly && staff.role !== "admin") {
      // staff can still edit homepage content per spec for promotions; settings stay admin.
    }
    const hero = {
      image_url: String(fd.get("hero_image_url") || ""),
      heading: String(fd.get("hero_heading") || ""),
      description: String(fd.get("hero_description") || ""),
      primary_button_text: String(fd.get("hero_primary_button_text") || ""),
      primary_button_link: String(fd.get("hero_primary_button_link") || ""),
      secondary_button_text: String(fd.get("hero_secondary_button_text") || ""),
      secondary_button_link: String(fd.get("hero_secondary_button_link") || ""),
    };
    const promo = {
      image_url: String(fd.get("promo_image_url") || ""),
      heading: String(fd.get("promo_heading") || ""),
      description: String(fd.get("promo_description") || ""),
      button_text: String(fd.get("promo_button_text") || ""),
      button_link: String(fd.get("promo_button_link") || ""),
      enabled: fd.get("promo_enabled") === "on",
    };
    const features = [0, 1, 2, 3].map((i) => ({
      title: String(fd.get(`feature_title_${i}`) || ""),
      description: String(fd.get(`feature_description_${i}`) || ""),
      icon: String(fd.get(`feature_icon_${i}`) || "sparkles"),
    }));
    const sections = String(fd.get("section_order") || "hero,categories,featured,promo,why,about-tease")
      .split(",")
      .map((id, position) => ({ id: id.trim(), enabled: fd.get(`section_${id.trim()}`) === "on", position }));
    await admin.from("site_settings").upsert([
      { key: "hero", value: hero },
      { key: "promo", value: promo },
      { key: "features", value: features },
      { key: "homepage_sections", value: sections },
    ]);
    return NextResponse.redirect(new URL("/admin/homepage", request.url));
  }

  if (action === "settings") {
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Admin only" }, { status: 403 });
    const brand = {
      name: String(fd.get("brand_name") || "Jimmy Home Textile"),
      tagline: String(fd.get("brand_tagline") || ""),
      logo_url: String(fd.get("logo_url") || ""),
    };
    const contact = {
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      address: String(fd.get("address") || ""),
      city: String(fd.get("city") || ""),
      region: String(fd.get("region") || ""),
      whatsapp: String(fd.get("whatsapp") || ""),
      facebook: String(fd.get("facebook") || ""),
      instagram: String(fd.get("instagram") || ""),
      hours: String(fd.get("hours") || ""),
    };
    const about = {
      heading: String(fd.get("about_heading") || ""),
      body: String(fd.get("about_body") || ""),
      story: String(fd.get("about_story") || ""),
      mission: String(fd.get("about_mission") || ""),
      image_url: String(fd.get("about_image_url") || ""),
      extra_images: String(fd.get("about_extra_images") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const delivery = {
      fee: Number(fd.get("delivery_fee") || 0),
      free_over: Number(fd.get("free_over") || 0),
      info: String(fd.get("delivery_info") || ""),
    };
    const seo = {
      title: String(fd.get("seo_title") || ""),
      description: String(fd.get("seo_description") || ""),
      og_image: String(fd.get("og_image") || ""),
    };
    await admin.from("site_settings").upsert([
      { key: "brand", value: brand },
      { key: "contact", value: contact },
      { key: "about", value: about },
      { key: "delivery", value: delivery },
      { key: "seo", value: seo },
    ]);
    return NextResponse.redirect(new URL("/admin/settings", request.url));
  }

  if (action === "role") {
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Admin only" }, { status: 403 });
    await admin.from("profiles").update({ role: String(fd.get("role")) }).eq("id", String(fd.get("id")));
    return NextResponse.redirect(new URL("/admin/users", request.url));
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
