import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const admin = createSupabaseAdminClient();
  const { data: payments } = await admin
    .from("payments")
    .select("*, orders(order_number, customer_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-4xl">Payments</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">
        Status is verified with PayUnit. An order is never marked paid just because checkout was opened.
      </p>
      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.16em] text-mute">
            <tr>
              <th className="p-3">Reference</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {(payments || []).map((p) => (
              <tr key={p.id} className="border-t border-ink/10">
                <td className="p-3">{p.transaction_reference}</td>
                <td>{(p.orders as { order_number?: string } | null)?.order_number}</td>
                <td>{(p.orders as { customer_name?: string } | null)?.customer_name}</td>
                <td>{formatMoney(p.amount)}</td>
                <td className="capitalize">{p.status}</td>
                <td>{String(p.created_at).slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
