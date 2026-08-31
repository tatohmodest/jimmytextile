"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types";
import { useToast } from "./ToastProvider";

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
          return prev.map((p) =>
            p.productId === item.productId && variantKey(p.variant) === key ? { ...p, quantity: nextQty } : p
          );
        }
        return [...prev, item];
      });
      setOpen(true);
      toast.show("Added to your selection");
    },
    [toast]
  );

  const updateQty = useCallback((productId: string, key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) =>
          p.productId === productId && variantKey(p.variant) === key
            ? { ...p, quantity: Math.max(1, Math.min(p.stock, quantity)) }
            : p
        )
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
