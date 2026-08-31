import Link from "next/link";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
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
  return (
    <footer className="mt-auto bg-forest text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <Logo brand={brand} light />
          <p className="mt-5 max-w-xs text-sm leading-7 text-ivory/70">{brand.tagline}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-ivory/50">Collections</p>
          <ul className="mt-4 grid gap-2 text-sm text-ivory/80">
            {categories.slice(0, 7).map((c) => (
              <li key={c.id}>
                <Link href={`/categories/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-ivory/50">House</p>
          <ul className="mt-4 grid gap-2 text-sm text-ivory/80">
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/track">Track an order</Link></li>
            <li><Link href="/account">Customer account</Link></li>
            <li><Link href="/shop">All products</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-ivory/50">Visit & talk</p>
          <ul className="mt-4 grid gap-3 text-sm text-ivory/80">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {contact.address}</li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> {contact.phone}</li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> {contact.email}</li>
            <li>{contact.hours}</li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href={contact.facebook} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center border border-ivory/20">
              <Facebook size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-[11px] tracking-[0.16em] text-ivory/50 uppercase md:px-8">
        © {new Date().getFullYear()} Jimmy Home Textile. All rights reserved.
      </div>
    </footer>
  );
}
