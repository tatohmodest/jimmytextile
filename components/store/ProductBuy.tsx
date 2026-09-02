"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatMoney } from "@/lib/utils";
import { formatTierRange, parsePriceTiers, unitPriceForQty } from "@/lib/pricing";
import { useCart } from "./CartProvider";
import { useI18n } from "./LocaleProvider";
import { productImage } from "./ProductCard";

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const router = useRouter();
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const designs = product.designs || [];
  const tiers = parsePriceTiers(product.price_tiers);
  const [color, setColor] = useState(colors[0]?.name || "");
  const [size, setSize] = useState(sizes[0] || "");
  const [design, setDesign] = useState(designs[0] || "");
  const [qty, setQty] = useState(1);
  const price = useMemo(() => unitPriceForQty(product, qty), [product, qty]);
  const inStock = product.stock > 0;
  const maxQty = Math.max(product.stock, 1);

  function toItem() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      name_fr: product.name_fr,
      image: productImage(product),
      price,
      quantity: qty,
      stock: product.stock,
      sku: product.sku,
      price_tiers: product.price_tiers,
      discount_price: product.discount_price,
      base_price: Number(product.price),
      variant: { color, size, design },
    };
  }

  return (
    <div>
      {colors.length ? (
        <div className="mt-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-mute">
            {t("product.colour")} — {color}
          </p>
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
          <p className="text-[11px] tracking-[0.2em] uppercase text-mute">{t("product.size")}</p>
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
          <p className="text-[11px] tracking-[0.2em] uppercase text-mute">{t("product.design")}</p>
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
      {tiers.length ? (
        <div className="mt-8 border border-ink/10 bg-linen/50 p-4">
          <p className="text-[11px] tracking-[0.2em] uppercase text-mute">{t("product.qtyPrices")}</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {tiers.map((tier) => (
              <li key={`${tier.min_qty}-${tier.max_qty}`} className="flex justify-between gap-4">
                <span>{formatTierRange(tier, t("product.from"))}</span>
                <span>{formatMoney(tier.unit_price)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-ink/15">
          <button type="button" className="h-12 w-10" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            -
          </button>
          <input
            className="h-12 w-16 border-0 bg-transparent text-center"
            type="number"
            min={1}
            max={maxQty}
            value={qty}
            onChange={(event) => setQty(Math.max(1, Math.min(maxQty, Number(event.target.value) || 1)))}
            aria-label={t("product.qty")}
          />
          <button type="button" className="h-12 w-10" onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>
            +
          </button>
        </div>
        <p className="text-sm text-mute">{inStock ? t("product.stock", { n: product.stock }) : t("product.unavailable")}</p>
      </div>
      <p className="mt-3 text-lg">
        {t("product.unit")}: {formatMoney(price)}
      </p>
      <div className="sticky bottom-0 z-20 mt-8 grid gap-3 bg-ivory/95 py-3 md:static md:bg-transparent">
        <button disabled={!inStock} onClick={() => addItem(toItem())} className="btn-primary disabled:opacity-40">
          {t("product.add")}
        </button>
        <button
          disabled={!inStock}
          onClick={() => {
            addItem(toItem());
            router.push("/checkout");
          }}
          className="btn-outline"
        >
          {t("product.buy")}
        </button>
      </div>
    </div>
  );
}
