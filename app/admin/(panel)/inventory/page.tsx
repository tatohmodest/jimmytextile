import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const admin = createSupabaseAdminClient();
  const { data: products } = await admin
    .from("products")
    .select("id, name, sku, stock, status")
    .is("deleted_at", null)
    .order("stock", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-4xl">Inventory</h1>
      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.16em] text-mute">
            <tr>
              <th className="p-3">Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <tr key={p.id} className="border-t border-ink/10">
                <td className="p-3">{p.name}</td>
                <td>{p.sku}</td>
                <td className={p.stock < 5 ? "text-wine" : ""}>{p.stock}</td>
                <td className="p-3">
                  <form action="/api/admin/manage" method="post" className="flex max-w-xs gap-2">
                    <input type="hidden" name="action" value="inventory" />
                    <input type="hidden" name="id" value={p.id} />
                    <input name="stock" type="number" min={0} defaultValue={p.stock} />
                    <button className="btn-outline px-3">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
