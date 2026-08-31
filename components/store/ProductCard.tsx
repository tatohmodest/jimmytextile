"use client";

import Image from "next/image";
import Link from "next/link";
import { formatMoney, effectivePrice, discountPercent } from "@/lib/utils";
import type { Product } from "@/types";
import { useCart } from "./CartProvider";

export function productImage(product: Product) {
  return product.product_images?.[0]?.image_url || "/placeholder-linen.svg";
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const price = effectivePrice(Number(product.price), product.discount_price ? Number(product.discount_price) : null);
  const percent = discountPercent(Number(product.price), product.discount_price ? Number(product.discount_price) : null);
  const image = productImage(product);
  const inStock = product.stock > 0;

  return (
    <article className="product-card group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-sand/40">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
          {percent > 0 ? (
            <span className="absolute left-3 top-3 bg-wine px-2 py-1 text-[10px] tracking-[0.18em] text-ivory uppercase">
              -{percent}%
            </span>
          ) : null}
          {product.stock <= 0 ? (
            <span className="absolute right-3 top-3 bg-ink/80 px-2 py-1 text-[10px] tracking-[0.18em] text-ivory uppercase">
              Sold out
            </span>
          ) : null}
        </div>
      </Link>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-mute">
          {product.categories?.name || "Collection"}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display mt-1 text-xl leading-tight text-ink">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm tracking-wide">{formatMoney(price)}</span>
          {percent > 0 ? (
            <span className="text-xs text-mute line-through">{formatMoney(product.price)}</span>
          ) : null}
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
                image,
                price,
                quantity: 1,
                stock: product.stock,
                sku: product.sku,
                variant: {
                  color: product.colors?.[0]?.name,
                  size: product.sizes?.[0],
                  design: product.designs?.[0],
                },
              })
            }
            className="btn-primary py-2 disabled:opacity-40"
          >
            Add to cart
          </button>
          <Link href={`/products/${product.slug}`} className="btn-outline py-2 text-center">
            View product
          </Link>
        </div>
      </div>
    </article>
  );
}
