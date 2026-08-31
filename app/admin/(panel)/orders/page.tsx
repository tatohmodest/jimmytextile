import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = createSupabaseAdminClient();
  const { data: orders } = await admin
    .from("orders")
    .select("id, order_number, customer_name, customer_phone, created_at, total, payment_status, order_status")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>
      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.16em] text-mute">
            <tr>
              <th className="p-3">Order</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map((o) => (
              <tr key={o.id} className="border-t border-ink/10">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`}>{o.order_number}</Link></td>
                <td>{o.customer_name}</td>
                <td>{o.customer_phone}</td>
                <td>{String(o.created_at).slice(0, 10)}</td>
                <td>{formatMoney(o.total)}</td>
                <td className="capitalize">{o.payment_status}</td>
                <td className="capitalize">{String(o.order_status).replaceAll("_", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
