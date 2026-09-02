"use client";

import Image from "next/image";
import Link from "next/link";
import { formatMoney, discountPercent } from "@/lib/utils";
import { startingPrice, parsePriceTiers, unitPriceForQty } from "@/lib/pricing";
import type { Product } from "@/types";
import { useCart } from "./CartProvider";
import { useI18n } from "./LocaleProvider";

export function productImage(product: Product) {
  return product.product_images?.[0]?.image_url || "/placeholder-linen.svg";
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { t, pick } = useI18n();
  const name = pick(product.name, product.name_fr);
  const categoryName = pick(product.categories?.name, product.categories?.name_fr);
  const tiers = parsePriceTiers(product.price_tiers);
  const price = startingPrice(product);
  const percent = discountPercent(Number(product.price), product.discount_price ? Number(product.discount_price) : null);
  const image = productImage(product);
  const inStock = product.stock > 0;
  const mainAlt =
    product.product_images?.[0]?.alt_text ||
    (Array.isArray(product.image_alts) ? product.image_alts[0] : "") ||
    `${name} — main product photo`;

  return (
    <article className="product-card group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-sand/40">
          <Image
            src={image}
            alt={mainAlt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
          {percent > 0 && !tiers.length ? (
            <span className="absolute left-3 top-3 bg-wine px-2 py-1 text-[10px] tracking-[0.18em] text-ivory uppercase">
              -{percent}%
            </span>
          ) : null}
          {product.stock <= 0 ? (
            <span className="absolute right-3 top-3 bg-ink/80 px-2 py-1 text-[10px] tracking-[0.18em] text-ivory uppercase">
              {t("product.soldOut")}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-mute">
          {categoryName || t("product.collection")}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display mt-1 text-xl leading-tight text-ink">{name}</h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          {tiers.length ? (
            <span className="text-sm tracking-wide">
              {t("product.from")} {formatMoney(price)}
            </span>
          ) : (
            <>
              <span className="text-sm tracking-wide">{formatMoney(price)}</span>
              {percent > 0 ? (
                <span className="text-xs text-mute line-through">{formatMoney(product.price)}</span>
              ) : null}
            </>
          )}
        </div>
        {product.colors?.length ? (
          <div className="mt-3 flex gap-1.5">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-ink/10"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        ) : null}
        <div className="mt-4 flex flex-col gap-2">
          <button
            disabled={!inStock}
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                name_fr: product.name_fr,
                image,
                price: unitPriceForQty(product, 1),
                quantity: 1,
                stock: product.stock,
                sku: product.sku,
                price_tiers: product.price_tiers,
                discount_price: product.discount_price,
                base_price: Number(product.price),
                variant: {
                  color: product.colors?.[0]?.name,
                  size: product.sizes?.[0],
                  design: product.designs?.[0],
                },
              })
            }
            className="btn-primary py-2 disabled:opacity-40"
          >
            {t("product.add")}
          </button>
          <Link href={`/products/${product.slug}`} className="btn-outline py-2 text-center">
            {t("product.view")}
          </Link>
        </div>
      </div>
    </article>
  );
}
