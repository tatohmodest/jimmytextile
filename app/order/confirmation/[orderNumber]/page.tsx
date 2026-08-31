import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/StoreShell";
import { getActiveCategories, getOrderByNumber, getSiteContent } from "@/lib/queries";
import { formatMoney } from "@/lib/utils";
import { getPayunitPaymentStatus, payunitConfigured } from "@/lib/payunit";
import { applyPayunitStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata = { title: "Order confirmation", robots: { index: false, follow: false } };

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { orderNumber } = await params;
  const query = await searchParams;
  let order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  if (payunitConfigured() && order.payments?.[0]?.transaction_reference) {
    try {
      const status = await getPayunitPaymentStatus(order.payments[0].transaction_reference);
      await applyPayunitStatus(order.payments[0].transaction_reference, status.transaction_status, status);
      order = await getOrderByNumber(orderNumber);
      if (!order) notFound();
    } catch {
      // keep current status
    }
  }

  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  const paid = order.payment_status === "success";
  const failed = query.status === "failed" || order.payment_status === "failed";
  const cancelled = query.status === "cancelled" || order.payment_status === "cancelled";

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-32 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">
          {paid ? "Payment confirmed" : failed ? "Payment failed" : cancelled ? "Payment cancelled" : "Order received"}
        </p>
        <h1 className="font-display mt-2 text-5xl">
          {paid ? "Thank you" : failed ? "Payment was not completed" : cancelled ? "Payment cancelled" : "We’re holding your order"}
        </h1>
        <p className="mt-4 text-mute">
          Order <strong className="text-ink">{order.order_number}</strong>
          {paid ? " is confirmed. A summary is below." : " will be marked paid only after PayUnit verifies the transaction."}
        </p>
        <dl className="mt-10 grid gap-3 border-t border-ink/10 pt-6 text-sm">
          <div className="flex justify-between"><dt>Status</dt><dd className="capitalize">{String(order.order_status).replaceAll("_", " ")}</dd></div>
          <div className="flex justify-between"><dt>Payment</dt><dd className="capitalize">{order.payment_status}</dd></div>
          <div className="flex justify-between"><dt>Total</dt><dd>{formatMoney(order.total)}</dd></div>
        </dl>
        <ul className="mt-6 grid gap-3">
          {(order.order_items || []).map((item: { id: string; product_name: string; quantity: number; unit_price: number }) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>{item.product_name} × {item.quantity}</span>
              <span>{formatMoney(Number(item.unit_price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <a href={`/track?order=${order.order_number}`} className="btn-primary mt-10 inline-flex">
          Track this order
        </a>
      </div>
    </StoreShell>
  );
}
