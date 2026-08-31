import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = createSupabaseAdminClient();
  const { data: products } = await admin
    .from("products")
    .select("id, name, sku, price, stock, status, featured, deleted_at, categories:category_id(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">Add product</Link>
      </div>
      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.16em] text-mute">
            <tr>
              <th className="p-3">Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <tr key={p.id} className="border-t border-ink/10">
                <td className="p-3">
                  {p.name} {p.featured ? <span className="text-bronze">★</span> : null}
                  {p.deleted_at ? <span className="ml-2 text-xs text-wine">archived</span> : null}
                </td>
                <td>{p.sku}</td>
                <td>{(p.categories as { name?: string } | null)?.name}</td>
                <td>{formatMoney(p.price)}</td>
                <td>{p.stock}</td>
                <td className="capitalize">{p.status}</td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="text-xs uppercase tracking-widest">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
