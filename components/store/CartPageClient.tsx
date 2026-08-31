"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, variantKey } from "@/components/store/CartProvider";
import { formatMoney } from "@/lib/utils";

export function CartPageClient({ deliveryFee, freeOver }: { deliveryFee: number; freeOver: number }) {
  const { items, subtotal, updateQty, removeItem } = useCart();
  const fee = subtotal >= freeOver && freeOver > 0 ? 0 : deliveryFee;
  const total = subtotal + fee;

  if (!items.length) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-display text-5xl">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr]">
      <ul className="grid gap-6">
        {items.map((item) => {
          const key = variantKey(item.variant);
          return (
            <li key={item.productId + key} className="flex gap-4 border-b border-ink/10 pb-6">
              <div className="relative h-28 w-24 overflow-hidden bg-sand">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="font-display text-2xl">
                  {item.name}
                </Link>
                <p className="text-sm text-mute">
                  {[item.variant.color, item.variant.size, item.variant.design].filter(Boolean).join(" · ") || "Standard"}
                </p>
                <p className="mt-1">{formatMoney(item.price)}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button className="h-8 w-8 border" onClick={() => updateQty(item.productId, key, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="h-8 w-8 border" onClick={() => updateQty(item.productId, key, item.quantity + 1)}>+</button>
                  <button className="ml-auto text-xs uppercase tracking-widest text-mute" onClick={() => removeItem(item.productId, key)}>
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-sm">{formatMoney(item.price * item.quantity)}</p>
            </li>
          );
        })}
      </ul>
      <aside className="h-fit bg-linen p-6">
        <h2 className="font-display text-3xl">Summary</h2>
        <dl className="mt-6 grid gap-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{fee === 0 ? "Complimentary" : formatMoney(fee)}</dd></div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-base"><dt>Total</dt><dd>{formatMoney(total)}</dd></div>
        </dl>
        <Link href="/checkout" className="btn-primary mt-6 w-full">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
