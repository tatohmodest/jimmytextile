import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export function formatMoney(amount: number | string | null | undefined, currency = "XAF") {
  const n = Number(amount || 0);
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export function effectivePrice(price: number, discount?: number | null) {
  if (discount && discount > 0 && discount < price) return discount;
  return price;
}

export function discountPercent(price: number, discount?: number | null) {
  if (!discount || discount >= price || price <= 0) return 0;
  return Math.round(((price - discount) / price) * 100);
}

export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit && !explicit.includes("localhost")) return explicit;
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  return (explicit || "http://localhost:3000").replace(/\/$/, "");
}

export function whatsappLink(phone: string, message?: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message || "Hello Jimmy Home Textile, I would like to know more about your products.");
  return `https://wa.me/${digits}?text=${text}`;
}

export function facebookUrl(raw?: string | null) {
  return raw || "https://web.facebook.com/jimmyhometextile1/";
}
