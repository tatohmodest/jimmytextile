import type { PriceTier, Product } from "@/types";
import { effectivePrice } from "@/lib/utils";

export function parsePriceTiers(value: unknown): PriceTier[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as { min_qty?: unknown; max_qty?: unknown; unit_price?: unknown };
      const min = Number(row.min_qty);
      const unit = Number(row.unit_price);
      if (!Number.isFinite(min) || !Number.isFinite(unit)) return null;
      const maxRaw = row.max_qty;
      const max = maxRaw === null || maxRaw === undefined || maxRaw === "" ? null : Number(maxRaw);
      return {
        min_qty: min,
        max_qty: max === null || !Number.isFinite(max) ? null : max,
        unit_price: unit,
      } satisfies PriceTier;
    })
    .filter((row): row is PriceTier => Boolean(row))
    .sort((a, b) => a.min_qty - b.min_qty);
}

export function unitPriceForQty(
  product: Pick<Product, "price" | "discount_price" | "price_tiers">,
  qty: number
) {
  const quantity = Math.max(1, qty);
  const tiers = parsePriceTiers(product.price_tiers);
  if (tiers.length) {
    const match =
      tiers.find((tier) => quantity >= tier.min_qty && (tier.max_qty == null || quantity <= tier.max_qty)) ||
      tiers[tiers.length - 1];
    if (match) return Number(match.unit_price);
  }
  return effectivePrice(Number(product.price), product.discount_price ? Number(product.discount_price) : null);
}

export function startingPrice(product: Pick<Product, "price" | "discount_price" | "price_tiers">) {
  const tiers = parsePriceTiers(product.price_tiers);
  if (tiers.length) return Math.min(...tiers.map((tier) => Number(tier.unit_price)));
  return unitPriceForQty(product, 1);
}

export function formatTierRange(tier: PriceTier, fromLabel = "from") {
  if (tier.max_qty == null) return `${fromLabel} ${tier.min_qty}`;
  return `${tier.min_qty}–${tier.max_qty}`;
}
