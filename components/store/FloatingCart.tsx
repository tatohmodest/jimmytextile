"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function FloatingCart() {
  const { count, setOpen } = useCart();
  if (count === 0) return null;
  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-5 left-5 z-40 flex h-12 items-center gap-2 bg-ink px-4 text-ivory md:hidden"
    >
      <ShoppingBag size={16} />
      <span className="text-xs tracking-[0.16em] uppercase">{count}</span>
    </button>
  );
}

export function EmptyState({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="py-24 text-center">
      <h1 className="font-display text-4xl">{title}</h1>
      <Link href={href} className="btn-primary mt-8">
        {label}
      </Link>
    </div>
  );
}
