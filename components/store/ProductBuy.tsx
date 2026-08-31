"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { useCart } from "./CartProvider";

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const designs = product.designs || [];
  const [color, setColor] = useState(colors[0]?.name || "");
  const [size, setSize] = useState(sizes[0] || "");
  const [design, setDesign] = useState(designs[0] || "");
  const [qty, setQty] = useState(1);
  const price = useMemo(() => {
    const d = product.discount_price ? Number(product.discount_price) : 0;
    const p = Number(product.price);
    return d > 0 && d < p ? d : p;
  }, [product]);
  const inStock = product.stock > 0;

  function toItem() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.product_images?.[0]?.image_url || "/placeholder-linen.svg",
      price,
      quantity: qty,
      stock: product.stock,
      sku: product.sku,
      variant: { color, size, design },
    };
  }

  return (
    <div>
      {colors.length ? (
        <div className="mt-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-mute">Colour — {color}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                className={`h-8 w-8 rounded-full border ${color === c.name ? "ring-2 ring-ink ring-offset-2" : "border-ink/15"}`}
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      ) : null}
      {sizes.length ? (
        <div className="mt-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-mute">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`border px-3 py-2 text-sm ${size === s ? "bg-ink text-ivory" : "border-ink/15"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {designs.length ? (
        <div className="mt-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-mute">Design</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {designs.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDesign(d)}
                className={`border px-3 py-2 text-sm ${design === d ? "bg-ink text-ivory" : "border-ink/15"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center border border-ink/15">
          <button type="button" className="h-12 w-10" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            -
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button type="button" className="h-12 w-10" onClick={() => setQty((q) => Math.min(Math.max(product.stock, 1), q + 1))}>
            +
          </button>
        </div>
        <p className="text-sm text-mute">{inStock ? `${product.stock} in stock` : "Currently unavailable"}</p>
      </div>
      <div className="sticky bottom-0 z-20 mt-8 grid gap-3 bg-ivory/95 py-3 md:static md:bg-transparent">
        <button disabled={!inStock} onClick={() => addItem(toItem())} className="btn-primary disabled:opacity-40">
          Add to cart
        </button>
        <button
          disabled={!inStock}
          onClick={() => {
            addItem(toItem());
            router.push("/checkout");
          }}
          className="btn-outline"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
