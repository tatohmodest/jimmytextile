"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import type { BrandContent, Category } from "@/types";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/track", label: "Track order" },
];

export function Header({
  brand,
  categories,
  transparent = false,
}: {
  brand: BrandContent;
  categories: Category[];
  transparent?: boolean;
}) {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled || menu;
  const light = transparent && !solid;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-ivory/95 shadow-[0_1px_0_rgba(26,22,18,0.08)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className={`hidden border-b text-center text-[11px] tracking-[0.22em] uppercase md:block ${light ? "border-white/15 text-ivory/80" : "border-ink/10 text-mute"}`}>
        <p className="py-2">Complimentary care packing · Delivery across Cameroon · Chat with us on WhatsApp</p>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <button className={`md:hidden ${light ? "text-ivory" : "text-ink"}`} onClick={() => setMenu((v) => !v)} aria-label="Menu">
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Logo brand={brand} light={light} />
        <nav className={`hidden items-center gap-8 text-[12px] tracking-[0.22em] uppercase md:flex ${light ? "text-ivory" : "text-ink"}`}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="opacity-80 transition hover:opacity-100">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={`flex items-center gap-4 ${light ? "text-ivory" : "text-ink"}`}>
          <Link href="/shop" aria-label="Search" className="hidden sm:block">
            <Search size={18} />
          </Link>
          <Link href="/account" aria-label="Account">
            <User size={18} />
          </Link>
          <button onClick={() => setOpen(true)} className="relative" aria-label="Cart">
            <ShoppingBag size={18} />
            {count > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center bg-bronze px-1 text-[10px] text-ivory">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>
      {menu ? (
        <div className="border-t border-ink/10 bg-ivory px-6 py-6 md:hidden">
          <div className="grid gap-4 text-sm tracking-[0.18em] uppercase">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenu(false)}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {categories.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/categories/${c.slug}`} onClick={() => setMenu(false)} className="text-sm text-mute">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
