import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const admin = createSupabaseAdminClient();
  const { data: categories } = await admin.from("categories").select("id, name").order("name");
  return (
    <div>
      <h1 className="font-display text-4xl">Add product</h1>
      <ProductForm categories={categories || []} />
    </div>
  );
}
