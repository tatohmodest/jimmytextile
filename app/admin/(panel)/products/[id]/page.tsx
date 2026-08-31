import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    admin.from("products").select("*, product_images(*)").eq("id", id).maybeSingle(),
    admin.from("categories").select("id, name").order("name"),
  ]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="font-display text-4xl">Edit product</h1>
      <ProductForm categories={categories || []} product={product} />
    </div>
  );
}
