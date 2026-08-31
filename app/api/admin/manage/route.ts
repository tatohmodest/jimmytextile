import { NextResponse } from "next/server";
import { requireStaff, requireAdmin } from "@/lib/auth";
import { isOwnerEmail } from "@/lib/admins";
import { defaultContent } from "@/lib/content";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

function galleryState(value: unknown) {
  const current = (value as { heading?: string; intro?: string; items?: Array<Record<string, unknown>> } | null) || {};
  return {
    heading: current.heading || defaultContent.gallery.heading,
    intro: current.intro || defaultContent.gallery.intro,
    items: Array.isArray(current.items) ? current.items : [],
  };
}

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
      seo_title: String(fd.get("seo_title") || "") || null,
      seo_description: String(fd.get("seo_description") || "") || null,
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
    const sections = String(fd.get("section_order") || "hero,categories,featured,promo,why,about-tease,gallery")
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
    const id = String(fd.get("id") || "");
    const role = String(fd.get("role") || "customer");
    const { data: target } = await admin.from("profiles").select("email, role").eq("id", id).maybeSingle();
    const targetEmail = String(target?.email || "");
    if (isOwnerEmail(targetEmail) && role !== "admin") {
      const url = new URL("/admin/users", request.url);
      url.searchParams.set("error", "The owner email cannot be removed from admin.");
      return NextResponse.redirect(url);
    }
    await admin.from("profiles").update({ role }).eq("id", id);
    if (role === "admin" && targetEmail && target?.role !== "admin") {
      try {
        const invited = await (await import("@/lib/admin-invite")).inviteAdmin(targetEmail);
        const url = new URL("/admin/users", request.url);
        url.searchParams.set("invited", invited.email);
        if (invited.mailError) url.searchParams.set("mailError", invited.mailError);
        return NextResponse.redirect(url);
      } catch (err) {
        const url = new URL("/admin/users", request.url);
        url.searchParams.set("invited", targetEmail);
        url.searchParams.set("mailError", err instanceof Error ? err.message : "Could not finish the admin invite");
        return NextResponse.redirect(url);
      }
    }
    if (targetEmail && role !== "admin") {
      await (await import("@/lib/admins")).removeAdminEmail(targetEmail);
    }
    return NextResponse.redirect(new URL("/admin/users", request.url));
  }

  if (action === "grant-admin-email") {
    const adminUser = await requireAdmin();
    if (!adminUser) return NextResponse.json({ error: "Admin only" }, { status: 403 });
    try {
      const invited = await (await import("@/lib/admin-invite")).inviteAdmin(String(fd.get("email") || ""));
      const url = new URL("/admin/users", request.url);
      url.searchParams.set("invited", invited.email);
      if (invited.mailError) url.searchParams.set("mailError", invited.mailError);
      return NextResponse.redirect(url);
    } catch (err) {
      const url = new URL("/admin/users", request.url);
      url.searchParams.set("error", err instanceof Error ? err.message : "Could not add admin");
      return NextResponse.redirect(url);
    }
  }

  if (action === "gallery-meta") {
    const { data } = await admin.from("site_settings").select("value").eq("key", "gallery").maybeSingle();
    const current = galleryState(data?.value);
    await admin.from("site_settings").upsert({
      key: "gallery",
      value: {
        heading: String(fd.get("heading") || defaultContent.gallery.heading),
        intro: String(fd.get("intro") || defaultContent.gallery.intro),
        items: current.items,
      },
      updated_at: new Date().toISOString(),
    });
    return NextResponse.redirect(new URL("/admin/gallery", request.url));
  }

  if (action === "gallery-item") {
    const { data } = await admin.from("site_settings").select("value").eq("key", "gallery").maybeSingle();
    const current = galleryState(data?.value);
    const items = [...current.items];
    const item = {
      id: crypto.randomUUID(),
      title: String(fd.get("title") || "Untitled film"),
      description: String(fd.get("description") || ""),
      video_url: String(fd.get("video_url") || ""),
      poster_url: String(fd.get("poster_url") || ""),
      public_id: String(fd.get("public_id") || ""),
      published: fd.get("published") === "on",
      position: items.length,
    };
    if (!item.video_url) {
      return NextResponse.json({ error: "Upload a video first" }, { status: 400 });
    }
    items.push(item);
    await admin.from("site_settings").upsert({
      key: "gallery",
      value: { heading: current.heading, intro: current.intro, items },
      updated_at: new Date().toISOString(),
    });
    return NextResponse.redirect(new URL("/admin/gallery", request.url));
  }

  if (action === "gallery-toggle" || action === "gallery-delete") {
    const { data } = await admin.from("site_settings").select("value").eq("key", "gallery").maybeSingle();
    const current = galleryState(data?.value);
    const id = String(fd.get("id") || "");
    let items = [...current.items];
    if (action === "gallery-delete") {
      const removed = items.find((item) => String(item.id) === id);
      items = items.filter((item) => String(item.id) !== id);
      const publicId = removed?.public_id ? String(removed.public_id) : "";
      if (publicId) {
        const { destroyAsset } = await import("@/lib/cloudinary");
        await destroyAsset(publicId, "video").catch(() => undefined);
      }
    } else {
      items = items.map((item) =>
        String(item.id) === id ? { ...item, published: !item.published } : item
      );
    }
    await admin.from("site_settings").upsert({
      key: "gallery",
      value: { heading: current.heading, intro: current.intro, items },
      updated_at: new Date().toISOString(),
    });
    return NextResponse.redirect(new URL("/admin/gallery", request.url));
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
