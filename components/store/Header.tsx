"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import type { BrandContent } from "@/types";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Collections" },
  { href: "/guides", label: "Guides" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  brand,
  transparent = false,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
}: {
  brand: BrandContent;
  transparent?: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}) {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) onCloseMenu();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onCloseMenu]);

  const solid = !transparent || scrolled || menuOpen;
  const light = transparent && !solid;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-ivory/95 shadow-[0_1px_0_rgba(26,22,18,0.08)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className={`hidden border-b text-center text-[11px] tracking-[0.22em] uppercase lg:block ${light ? "border-white/15 text-ivory/80" : "border-ink/10 text-mute"}`}>
        <p className="py-2">Complimentary care packing · Delivery across Cameroon · Chat with us on WhatsApp</p>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <button
          type="button"
          className={`inline-flex h-11 min-w-11 items-center justify-center lg:hidden ${light ? "text-ivory" : "text-ink"}`}
          onClick={onToggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Logo brand={brand} light={light} />
        <nav className={`desktop-nav hidden items-center gap-8 text-[12px] tracking-[0.22em] uppercase lg:flex ${light ? "text-ivory" : "text-ink"}`}>
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
          <button type="button" onClick={() => setOpen(true)} className="relative" aria-label="Cart">
            <ShoppingBag size={18} />
            {count > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center bg-bronze px-1 text-[10px] text-ivory">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
