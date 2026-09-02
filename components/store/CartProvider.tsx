"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types";
import { useToast } from "./ToastProvider";
import { useI18n } from "./LocaleProvider";
import { unitPriceForQty } from "@/lib/pricing";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  updateQty: (productId: string, variantKey: string, quantity: number) => void;
  removeItem: (productId: string, variantKey: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "jht-cart";

export function variantKey(variant: CartItem["variant"]) {
  return [variant.color || "", variant.size || "", variant.design || ""].join("|");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const { t } = useI18n();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const key = variantKey(item.variant);
        const existing = prev.find((p) => p.productId === item.productId && variantKey(p.variant) === key);
        if (existing) {
          const nextQty = Math.min(existing.stock, existing.quantity + item.quantity);
          const nextPrice = unitPriceForQty(
            {
              price: item.base_price ?? existing.base_price ?? item.price,
              discount_price: item.discount_price ?? existing.discount_price ?? null,
              price_tiers: item.price_tiers ?? existing.price_tiers,
            },
            nextQty
          );
          return prev.map((p) =>
            p.productId === item.productId && variantKey(p.variant) === key
              ? { ...p, ...item, quantity: nextQty, price: nextPrice }
              : p
          );
        }
        return [
          ...prev,
          {
            ...item,
            price: unitPriceForQty(
              {
                price: item.base_price ?? item.price,
                discount_price: item.discount_price ?? null,
                price_tiers: item.price_tiers,
              },
              item.quantity
            ),
          },
        ];
      });
      setOpen(true);
      toast.show(t("cart.added"));
    },
    [toast, t]
  );

  const updateQty = useCallback((productId: string, key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) => {
          if (!(p.productId === productId && variantKey(p.variant) === key)) return p;
          const nextQty = Math.max(1, Math.min(p.stock, quantity));
          const nextPrice = unitPriceForQty(
            {
              price: p.base_price ?? p.price,
              discount_price: p.discount_price ?? null,
              price_tiers: p.price_tiers,
            },
            nextQty
          );
          return { ...p, quantity: nextQty, price: nextPrice };
        })
        .filter((p) => p.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string, key: string) => {
    setItems((prev) => prev.filter((p) => !(p.productId === productId && variantKey(p.variant) === key)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
      addItem,
      updateQty,
      removeItem,
      clear,
      open,
      setOpen,
    }),
    [items, addItem, updateQty, removeItem, clear, open]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
