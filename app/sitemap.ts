import type { MetadataRoute } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = ["", "/shop", "/categories", "/gallery", "/about", "/contact", "/cart", "/track"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  try {
    const admin = createSupabaseAdminClient();
    const [{ data: products }, { data: categories }] = await Promise.all([
      admin.from("products").select("slug, updated_at").eq("status", "published").is("deleted_at", null),
      admin.from("categories").select("slug, updated_at").eq("is_active", true),
    ]);
    return [
      ...staticRoutes,
      ...(products || []).map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: new Date(p.updated_at) })),
      ...(categories || []).map((c) => ({ url: `${base}/categories/${c.slug}`, lastModified: new Date(c.updated_at) })),
    ];
  } catch {
    return staticRoutes;
  }
}
