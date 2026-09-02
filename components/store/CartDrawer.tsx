"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart, variantKey } from "./CartProvider";
import { formatMoney } from "@/lib/utils";
import { useI18n } from "./LocaleProvider";

export function CartDrawer() {
  const { items, subtotal, open, setOpen, updateQty, removeItem } = useCart();
  const { t, pick } = useI18n();

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-ink/40 transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase text-mute">{t("cart.selection")}</p>
            <h2 className="font-display text-3xl">{t("cart.title")}</h2>
          </div>
          <button onClick={() => setOpen(false)} aria-label={t("nav.close")}>
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="pt-10 text-center text-mute">{t("cart.empty")}</p>
          ) : (
            <ul className="grid gap-5">
              {items.map((item) => {
                const key = variantKey(item.variant);
                return (
                  <li key={item.productId + key} className="flex gap-3">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{pick(item.name, item.name_fr)}</p>
                      <p className="text-xs text-mute">
                        {[item.variant.color, item.variant.size, item.variant.design].filter(Boolean).join(" · ") || t("cart.standard")}
                      </p>
                      <p className="mt-1 text-sm">{formatMoney(item.price)}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <button onClick={() => updateQty(item.productId, key, item.quantity - 1)} className="h-7 w-7 border border-ink/15">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId, key, item.quantity + 1)} className="h-7 w-7 border border-ink/15">+</button>
                        <button onClick={() => removeItem(item.productId, key)} className="ml-auto text-xs uppercase tracking-widest text-mute">
                          {t("cart.remove")}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-ink/10 px-5 py-5">
          <div className="mb-4 flex justify-between text-sm">
            <span>{t("cart.subtotal")}</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <Link href="/cart" onClick={() => setOpen(false)} className="btn-outline mb-3 w-full">
            {t("cart.view")}
          </Link>
          <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full">
            {t("cart.checkout")}
          </Link>
        </div>
      </aside>
    </>
  );
}
