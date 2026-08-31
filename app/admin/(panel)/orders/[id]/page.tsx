import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES = [
  "pending_payment",
  "payment_processing",
  "paid",
  "processing",
  "ready_for_delivery",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*, order_items(*), payments(*)")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl">{order.order_number}</h1>
      <p className="mt-2 text-sm text-mute">{order.customer_name} · {order.customer_phone} · {order.customer_email}</p>
      <p className="mt-1 text-sm">{order.delivery_address}, {order.city}, {order.region}</p>
      <ul className="mt-8 grid gap-2 text-sm">
        {(order.order_items || []).map((item: { id: string; product_name: string; quantity: number; unit_price: number; variant: Record<string, string> }) => (
          <li key={item.id} className="flex justify-between border-b border-ink/10 py-2">
            <span>
              {item.product_name} × {item.quantity}
              <span className="block text-xs text-mute">{Object.values(item.variant || {}).filter(Boolean).join(" · ")}</span>
            </span>
            <span>{formatMoney(Number(item.unit_price) * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 grid gap-1 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(order.subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Delivery</dt><dd>{formatMoney(order.delivery_fee)}</dd></div>
        <div className="flex justify-between"><dt>Total</dt><dd>{formatMoney(order.total)}</dd></div>
        <div className="flex justify-between"><dt>Payment</dt><dd className="capitalize">{order.payment_status}</dd></div>
      </dl>
      <form action="/api/admin/manage" method="post" className="mt-8 flex gap-3">
        <input type="hidden" name="action" value="order-status" />
        <input type="hidden" name="id" value={order.id} />
        <select name="order_status" defaultValue={order.order_status}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
          ))}
        </select>
        <button className="btn-primary">Update status</button>
      </form>
    </div>
  );
}
