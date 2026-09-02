"use client";

import { useState } from "react";
import { useCart } from "@/components/store/CartProvider";
import { formatMoney } from "@/lib/utils";
import type { Profile } from "@/types";
import { useI18n } from "@/components/store/LocaleProvider";

export function CheckoutForm({
  deliveryFee,
  freeOver,
  profile,
  payunitReady,
}: {
  deliveryFee: number;
  freeOver: number;
  profile: Profile | null;
  payunitReady: boolean;
}) {
  const { items, subtotal, clear } = useCart();
  const { t, pick } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fee = subtotal >= freeOver && freeOver > 0 ? 0 : deliveryFee;
  const total = subtotal + fee;

  if (!items.length) {
    return <p className="text-mute">{t("cart.emptyCheckout")}</p>;
  }

  return (
    <form
      className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const fd = new FormData(e.currentTarget);
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: fd.get("customerName"),
            customerPhone: fd.get("customerPhone"),
            customerEmail: fd.get("customerEmail"),
            deliveryAddress: fd.get("deliveryAddress"),
            city: fd.get("city"),
            region: fd.get("region"),
            deliveryInstructions: fd.get("deliveryInstructions"),
            items,
          }),
        });
        const json = await res.json();
        setLoading(false);
        if (!res.ok) {
          setError(json.error || "Checkout failed");
          return;
        }
        clear();
        if (json.paymentUrl) {
          window.location.href = json.paymentUrl;
        } else {
          window.location.href = json.redirect || `/order/confirmation/${json.orderNumber}`;
        }
      }}
    >
      <div className="grid gap-4">
        <h2 className="font-display text-3xl">{t("checkout.delivery")}</h2>
        <label className="field">{t("checkout.name")}<input name="customerName" required defaultValue={profile?.full_name || ""} /></label>
        <label className="field">{t("checkout.phone")}<input name="customerPhone" required defaultValue={profile?.phone || ""} /></label>
        <label className="field">{t("checkout.email")}<input name="customerEmail" type="email" required defaultValue={profile?.email || ""} /></label>
        <label className="field">{t("checkout.address")}<textarea name="deliveryAddress" rows={3} required /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field">{t("checkout.city")}<input name="city" required defaultValue="Douala" /></label>
          <label className="field">{t("checkout.region")}<input name="region" required defaultValue="Littoral" /></label>
        </div>
        <label className="field">{t("checkout.notes")}<textarea name="deliveryInstructions" rows={3} /></label>
        {!payunitReady ? (
          <p className="text-sm text-wine">
            PayUnit credentials are not configured yet. You can still place the order; payment will stay pending until the gateway is connected.
          </p>
        ) : null}
        {error ? <p className="text-sm text-wine">{error}</p> : null}
      </div>
      <aside className="h-fit bg-linen p-6">
        <h2 className="font-display text-3xl">Order summary</h2>
        <ul className="mt-4 grid gap-3 text-sm">
          {items.map((item) => (
            <li key={item.productId + JSON.stringify(item.variant)} className="flex justify-between gap-3">
              <span>
                {pick(item.name, item.name_fr)} × {item.quantity}
                <span className="block text-xs text-mute">
                  {[item.variant.color, item.variant.size, item.variant.design].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span>{formatMoney(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 grid gap-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between"><dt>{t("cart.subtotal")}</dt><dd>{formatMoney(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>{t("product.delivery")}</dt><dd>{formatMoney(fee)}</dd></div>
          <div className="flex justify-between text-base"><dt>Total</dt><dd>{formatMoney(total)}</dd></div>
        </dl>
        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? "Placing order..." : payunitReady ? "Pay with PayUnit" : "Place order"}
        </button>
        <p className="mt-3 text-xs leading-5 text-mute">
          Orders are only marked paid after PayUnit confirms the transaction. Reaching this page does not complete payment.
        </p>
      </aside>
    </form>
  );
}
