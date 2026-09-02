"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types";
import { useI18n } from "./LocaleProvider";

export function ProductGallery({ product }: { product: Product }) {
  const { t, pick } = useI18n();
  const name = pick(product.name, product.name_fr);
  const plannedAlts = Array.isArray(product.image_alts) ? product.image_alts.filter(Boolean) : [];
  const uploaded = [...(product.product_images || [])].sort((a, b) => a.position - b.position);
  const images = uploaded.length
    ? uploaded.map((img, i) => ({
        image_url: img.image_url,
        alt_text: img.alt_text || plannedAlts[i] || (i === 0 ? `${name} — main product photo` : `${name} — related photo ${i + 1}`),
        related: i > 0,
      }))
    : [
        {
          image_url: "/placeholder-linen.svg",
          alt_text: plannedAlts[0] || `${name} — main product photo`,
          related: false,
        },
        ...plannedAlts.slice(1).map((alt, i) => ({
          image_url: "/placeholder-linen.svg",
          alt_text: alt || `${name} — related photo ${i + 2}`,
          related: true,
        })),
      ];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const current = images[active] || images[0];
  const src = current.image_url;
  const alt = current.alt_text || name;
  const hasRealPhotos = uploaded.length > 0;

  return (
    <div>
      <p className="mb-2 text-[11px] tracking-[0.2em] uppercase text-mute">
        {active === 0 ? t("product.mainPhoto") : t("product.relatedPhotos")}
      </p>
      <button
        type="button"
        className="relative aspect-[4/5] w-full overflow-hidden bg-sand"
        onClick={() => setZoom(true)}
      >
        <Image src={src} alt={alt} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
        <span className="absolute bottom-4 right-4 bg-ivory/90 px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
          {t("product.clickToView")}
        </span>
      </button>
      {!hasRealPhotos ? <p className="mt-2 text-xs text-mute">{t("product.photoSoon")}</p> : null}
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={`${img.image_url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden ${i === active ? "ring-1 ring-ink" : "opacity-70"}`}
              aria-label={i === 0 ? t("product.mainPhoto") : `${t("product.relatedPhotos")} ${i}`}
            >
              <Image src={img.image_url} alt={img.alt_text} fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      {zoom ? (
        <div className="fixed inset-0 z-[80] bg-ink/90 p-4" onClick={() => setZoom(false)}>
          <div className="relative mx-auto h-full max-w-5xl">
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
