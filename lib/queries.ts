import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mergeContent } from "@/lib/content";
import type { Category, Product, Promotion, SiteContent } from "@/types";

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Record<string, unknown> = {};
    for (const row of data || []) {
      map[row.key] = row.value;
    }
    return mergeContent(map);
  } catch {
    return mergeContent({});
  }
}

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });
  return (data || []) as Category[];
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("position", { ascending: true });
  return (data || []) as Category[];
}

const productSelect = `
  *,
  categories:category_id (id, name, slug),
  product_images (id, product_id, image_url, public_id, alt_text, position)
`;

export async function getPublishedProducts(limit = 24): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(productSelect)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  return sortImages((data || []) as Product[]);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(productSelect)
    .eq("status", "published")
    .eq("featured", true)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(8);
  return sortImages((data || []) as Product[]);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  if (!data) return null;
  return sortImages([data as Product])[0];
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(productSelect)
    .in("id", ids)
    .eq("status", "published")
    .is("deleted_at", null);
  return sortImages((data || []) as Product[]);
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("status", "published")
    .is("deleted_at", null)
    .neq("id", excludeId)
    .limit(4);
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data } = await query;
  return sortImages((data || []) as Product[]);
}

export type ShopFilters = {
  q?: string;
  category?: string;
  min?: number;
  max?: number;
  availability?: "in_stock" | "all";
  sort?: "newest" | "price_asc" | "price_desc" | "popularity" | "name";
  page?: number;
};

export async function getShopProducts(filters: ShopFilters) {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(1, filters.page || 1);
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(productSelect, { count: "exact" })
    .eq("status", "published")
    .is("deleted_at", null);

  if (filters.q) {
    query = query.or(`name.ilike.%${filters.q}%,description.ilike.%${filters.q}%,sku.ilike.%${filters.q}%`);
  }
  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .maybeSingle();
    if (cat?.id) query = query.eq("category_id", cat.id);
    else query = query.eq("category_id", "00000000-0000-0000-0000-000000000000");
  }
  if (typeof filters.min === "number") query = query.gte("price", filters.min);
  if (typeof filters.max === "number") query = query.lte("price", filters.max);
  if (filters.availability === "in_stock") query = query.gt("stock", 0);

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    case "popularity":
      query = query.order("review_count", { ascending: false }).order("average_rating", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count } = await query.range(from, to);
  return {
    products: sortImages((data || []) as Product[]),
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });
  return (data || []) as Promotion[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return (data as Category) || null;
}

function sortImages(products: Product[]) {
  return products.map((p) => ({
    ...p,
    product_images: [...(p.product_images || [])].sort((a, b) => a.position - b.position),
  }));
}

export async function getOrderByNumber(orderNumber: string, emailOrPhone?: string) {
  const admin = createSupabaseAdminClient();
  let query = admin
    .from("orders")
    .select("*, order_items(*), payments(*)")
    .eq("order_number", orderNumber);
  const { data } = await query.maybeSingle();
  if (!data) return null;
  if (emailOrPhone) {
    const needle = emailOrPhone.trim().toLowerCase();
    const email = (data.customer_email || "").toLowerCase();
    const phone = (data.customer_phone || "").replace(/\s/g, "");
    if (email !== needle && phone !== needle.replace(/\s/g, "") && !phone.endsWith(needle.replace(/\D/g, "").slice(-9))) {
      return null;
    }
  }
  return data;
}
