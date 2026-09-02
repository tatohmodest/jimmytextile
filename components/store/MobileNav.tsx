"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import { useI18n } from "./LocaleProvider";
import { LanguageSwitch } from "./LanguageSwitch";
import type { BrandContent, Category } from "@/types";

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
  const { t, pick } = useI18n();
  const NAV = [
    { href: "/shop", label: t("nav.shop") },
    { href: "/categories", label: t("nav.collections") },
    { href: "/guides", label: t("nav.guides") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

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

  return (
    <div className="mobile-nav-root lg:hidden">
      <button
        type="button"
        aria-label={t("nav.close")}
        tabIndex={open ? 0 : -1}
        className={`mobile-nav-backdrop ${open ? "is-open" : ""}`}
        onClick={onClose}
      />
      <aside
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu")}
        className={`mobile-nav-drawer border-r border-ivory/10 bg-forest text-ivory shadow-[16px_0_48px_rgba(26,22,18,0.35)] ${
          open ? "is-open" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-ivory/10 px-5 py-4">
          <Logo brand={{ ...brand, tagline: pick(brand.tagline, brand.tagline_fr) }} light />
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center border border-ivory/20"
            aria-label={t("nav.close")}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-6 py-8">
          <div className="mb-6">
            <LanguageSwitch light />
          </div>
          <p className="text-[10px] tracking-[0.32em] uppercase text-ivory/50">{t("nav.navigate")}</p>
          <ul className="mt-4 grid gap-1">
            {NAV.map((item, index) => (
              <li
                key={item.href}
                className="mobile-nav-link"
                style={{ transitionDelay: open ? `${90 + index * 55}ms` : "0ms" }}
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
              className="mobile-nav-link mt-10 border-t border-ivory/10 pt-8"
              style={{ transitionDelay: open ? `${90 + NAV.length * 55}ms` : "0ms" }}
            >
              <p className="text-[10px] tracking-[0.32em] uppercase text-ivory/50">{t("footer.collections")}</p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    onClick={onClose}
                    className="text-sm tracking-[0.04em] text-ivory/70 transition hover:text-ivory"
                  >
                    {pick(category.name, category.name_fr)}
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
            {t("nav.account")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
