"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatMoney } from "@/lib/utils";

const STEPS = ["pending_payment", "paid", "processing", "shipped", "delivered"];

export function TrackForm() {
  const search = useSearchParams();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(orderNumber: string, contact?: string) {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, contact }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setOrder(null);
      setError(json.error || "Order not found");
      return;
    }
    setOrder(json.order);
  }

  useEffect(() => {
    const preset = search.get("order");
    if (preset) lookup(preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = String(order?.order_status || "");
  const stepIndex = Math.max(
    0,
    STEPS.findIndex((s) => status.includes(s) || (status === "payment_processing" && s === "pending_payment") || (status === "ready_for_delivery" && s === "processing"))
  );

  return (
    <div className="mt-10">
      <form
        className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          lookup(String(fd.get("orderNumber")), String(fd.get("contact") || ""));
        }}
      >
        <input name="orderNumber" placeholder="JHT-2026-000001" defaultValue={search.get("order") || ""} required />
        <input name="contact" placeholder="Phone or email (optional)" />
        <button className="btn-primary" disabled={loading}>
          {loading ? "Looking..." : "Track"}
        </button>
      </form>
      {error ? <p className="mt-4 text-wine">{error}</p> : null}
      {order ? (
        <div className="mt-10 border-t border-ink/10 pt-8">
          <p className="text-sm text-mute">{String(order.created_at).slice(0, 10)}</p>
          <h2 className="font-display text-3xl">{String(order.order_number)}</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Placed", "Paid", "Processing", "Shipped", "Delivered"].map((label, i) => (
              <span key={label} className={`px-3 py-1 text-xs tracking-[0.16em] uppercase ${i <= stepIndex && status !== "cancelled" ? "bg-ink text-ivory" : "bg-sand text-mute"}`}>
                {label}
              </span>
            ))}
          </div>
          <dl className="mt-8 grid gap-2 text-sm">
            <div className="flex justify-between"><dt>Current status</dt><dd className="capitalize">{status.replaceAll("_", " ")}</dd></div>
            <div className="flex justify-between"><dt>Payment</dt><dd className="capitalize">{String(order.payment_status)}</dd></div>
            <div className="flex justify-between"><dt>Total</dt><dd>{formatMoney(Number(order.total))}</dd></div>
            <div className="flex justify-between gap-6"><dt>Delivery</dt><dd className="text-right">{String(order.delivery_address)}, {String(order.city)}</dd></div>
          </dl>
          <ul className="mt-6 grid gap-2 text-sm">
            {((order.order_items as Array<{ id: string; product_name: string; quantity: number; unit_price: number }>) || []).map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.product_name} × {item.quantity}</span>
                <span>{formatMoney(Number(item.unit_price) * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
