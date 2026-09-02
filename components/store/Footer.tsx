"use client";

import Link from "next/link";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { useI18n } from "./LocaleProvider";
import type { BrandContent, Category, ContactContent } from "@/types";

export function Footer({
  brand,
  contact,
  categories,
}: {
  brand: BrandContent;
  contact: ContactContent;
  categories: Category[];
}) {
  const { t, pick } = useI18n();
  const phones = [contact.phone, contact.phone_secondary].filter(Boolean);

  return (
    <footer className="mt-auto bg-forest text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <Logo brand={{ ...brand, tagline: pick(brand.tagline, brand.tagline_fr) }} light />
          <p className="mt-5 max-w-xs text-sm leading-7 text-ivory/70">{pick(brand.tagline, brand.tagline_fr)}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-ivory/50">{t("footer.collections")}</p>
          <ul className="mt-4 grid gap-2 text-sm text-ivory/80">
            {categories.slice(0, 7).map((c) => (
              <li key={c.id}>
                <Link href={`/categories/${c.slug}`}>{pick(c.name, c.name_fr)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-ivory/50">{t("footer.house")}</p>
          <ul className="mt-4 grid gap-2 text-sm text-ivory/80">
            <li><Link href="/guides">{t("footer.guides")}</Link></li>
            <li><Link href="/delivery">{t("footer.delivery")}</Link></li>
            <li><Link href="/faq">{t("footer.faq")}</Link></li>
            <li><Link href="/gallery">{t("footer.gallery")}</Link></li>
            <li><Link href="/about">{t("footer.about")}</Link></li>
            <li><Link href="/contact">{t("footer.contact")}</Link></li>
            <li><Link href="/track">{t("footer.track")}</Link></li>
            <li><Link href="/shop">{t("footer.shop")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-ivory/50">{t("footer.visit")}</p>
          <ul className="mt-4 grid gap-3 text-sm text-ivory/80">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {contact.address}</li>
            {phones.map((phone) => (
              <li key={phone} className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> {phone}</li>
            ))}
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> {contact.email}</li>
            <li>{pick(contact.hours, contact.hours_fr)}</li>
            <li>
              <Link href="/delivery">{t("footer.cities")}</Link>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href={contact.facebook} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center border border-ivory/20">
              <Facebook size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-[11px] tracking-[0.16em] text-ivory/50 uppercase md:px-8">
        © {new Date().getFullYear()} Jimmy Home Textile. {t("footer.rights")}
      </div>
    </footer>
  );
}
