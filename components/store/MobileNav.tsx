"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import type { BrandContent, Category } from "@/types";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/track", label: "Track order" },
];

export function MobileNav({
  open,
  onClose,
  brand,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  brand: BrandContent;
  categories: Category[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        className={`fixed inset-0 z-[80] bg-ink/55 backdrop-blur-[2px] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 left-0 z-[81] flex h-[100dvh] w-[min(88vw,22rem)] flex-col border-r border-ivory/10 bg-forest text-ivory shadow-[16px_0_48px_rgba(26,22,18,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none ${
          open ? "translate-x-0" : "pointer-events-none -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-ivory/10 px-5 py-4">
          <Logo brand={brand} light />
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center border border-ivory/20"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-6 py-8">
          <p className="text-[10px] tracking-[0.32em] uppercase text-ivory/50">Navigate</p>
          <ul className="mt-4 grid gap-1">
            {NAV.map((item, index) => (
              <li
                key={item.href}
                className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${90 + index * 50}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block py-2 font-display text-3xl leading-none tracking-wide text-ivory/90 transition hover:text-ivory"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {categories.length ? (
            <div
              className={`mt-10 border-t border-ivory/10 pt-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${90 + NAV.length * 50}ms` : "0ms" }}
            >
              <p className="text-[10px] tracking-[0.32em] uppercase text-ivory/50">Collections</p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    onClick={onClose}
                    className="text-sm tracking-[0.04em] text-ivory/70 transition hover:text-ivory"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </nav>

        <div className="border-t border-ivory/10 px-6 py-5">
          <Link
            href="/account"
            onClick={onClose}
            className="text-[11px] tracking-[0.22em] uppercase text-ivory/70"
          >
            Customer account
          </Link>
        </div>
      </aside>
    </div>,
    document.body
  );
}
