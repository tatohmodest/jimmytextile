import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const admin = createSupabaseAdminClient();
  const { data: customers } = await admin
    .from("profiles")
    .select("id, full_name, email, phone, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  const ids = (customers || []).map((c) => c.id);
  const { data: orders } = ids.length
    ? await admin.from("orders").select("user_id, total, payment_status").in("user_id", ids)
    : { data: [] };

  const stats = new Map<string, { count: number; spent: number }>();
  for (const o of orders || []) {
    const cur = stats.get(o.user_id) || { count: 0, spent: 0 };
    cur.count += 1;
    if (o.payment_status === "success") cur.spent += Number(o.total);
    stats.set(o.user_id, cur);
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Customers</h1>
      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.16em] text-mute">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Total spent</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {(customers || []).map((c) => (
              <tr key={c.id} className="border-t border-ink/10">
                <td className="p-3"><Link href={`/admin/customers/${c.id}`}>{c.full_name || "—"}</Link></td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{stats.get(c.id)?.count || 0}</td>
                <td>{formatMoney(stats.get(c.id)?.spent || 0)}</td>
                <td>{String(c.created_at).slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
