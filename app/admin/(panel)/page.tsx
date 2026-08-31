import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";
import { SalesChart } from "@/components/admin/SalesChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const admin = createSupabaseAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let queryError: string | null = null;
  let totalOrders = 0;
  let paidOrders: { total: number; created_at: string; payment_status: string }[] = [];
  let pendingOrders = 0;
  let completedOrders = 0;
  let totalProducts = 0;
  let lowStock = 0;
  let customers = 0;

  try {
    const result = await Promise.all([
      admin.from("orders").select("*", { count: "exact", head: true }),
      admin.from("orders").select("total, created_at, payment_status").eq("payment_status", "success"),
      admin.from("orders").select("*", { count: "exact", head: true }).in("order_status", ["pending_payment", "payment_processing", "paid", "processing"]),
      admin.from("orders").select("*", { count: "exact", head: true }).eq("order_status", "delivered"),
      admin.from("products").select("*", { count: "exact", head: true }).is("deleted_at", null),
      admin.from("products").select("*", { count: "exact", head: true }).is("deleted_at", null).lt("stock", 5),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    ]);
    totalOrders = result[0].count || 0;
    paidOrders = (result[1].data || []) as typeof paidOrders;
    pendingOrders = result[2].count || 0;
    completedOrders = result[3].count || 0;
    totalProducts = result[4].count || 0;
    lowStock = result[5].count || 0;
    customers = result[6].count || 0;
    const firstError = result.find((r) => r.error)?.error;
    if (firstError) queryError = firstError.message;
  } catch (err) {
    queryError = err instanceof Error ? err.message : "Database is not ready";
  }

  const sales = paidOrders.reduce((n, o) => n + Number(o.total), 0);
  const todaySales = paidOrders
    .filter((o) => new Date(o.created_at) >= today)
    .reduce((n, o) => n + Number(o.total), 0);

  const byDay = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of paidOrders) {
    const key = String(o.created_at).slice(0, 10);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + Number(o.total));
  }
  const chart = [...byDay.entries()].map(([date, total]) => ({ date: date.slice(5), total }));

  const cards = [
    { label: "Total sales", value: formatMoney(sales) },
    { label: "Today's sales", value: formatMoney(todaySales) },
    { label: "Total orders", value: String(totalOrders || 0) },
    { label: "Pending orders", value: String(pendingOrders || 0) },
    { label: "Completed orders", value: String(completedOrders || 0) },
    { label: "Total products", value: String(totalProducts || 0) },
    { label: "Low stock", value: String(lowStock || 0) },
    { label: "Customers", value: String(customers || 0) },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl">Dashboard</h1>
      <p className="mt-1 text-sm text-mute">A quiet view of the house.</p>
      {queryError ? (
        <div className="mt-6 bg-wine/10 p-4 text-sm text-wine">
          Database tables are not ready yet. Run <code>supabase/schema.sql</code> in the Supabase SQL editor, then <code>npm run db:seed</code>.
        </div>
      ) : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-ivory p-5 shadow-sm">
            <p className="text-[11px] tracking-[0.18em] uppercase text-mute">{c.label}</p>
            <p className="mt-2 font-display text-3xl">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-ivory p-5">
        <h2 className="font-display text-2xl">Sales · last 14 days</h2>
        <SalesChart data={chart} />
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/admin/products/new" className="btn-primary">Add product</Link>
        <Link href="/admin/orders" className="btn-outline">Review orders</Link>
      </div>
    </div>
  );
}
