"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.product_images?.length
    ? product.product_images
    : [{ image_url: "/placeholder-linen.svg", alt_text: product.name }];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const current = images[active];
  const src = current.image_url;
  const alt = current.alt_text || product.name;

  return (
    <div>
      <button
        type="button"
        className="relative aspect-[4/5] w-full overflow-hidden bg-sand"
        onClick={() => setZoom(true)}
      >
        <Image src={src} alt={alt} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
        <span className="absolute bottom-4 right-4 bg-ivory/90 px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
          Click to view
        </span>
      </button>
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
        {images.map((img, i) => (
          <button
            key={img.image_url + i}
            type="button"
            onClick={() => setActive(i)}
            className={`relative h-20 w-16 shrink-0 overflow-hidden ${i === active ? "ring-1 ring-ink" : "opacity-70"}`}
          >
            <Image src={img.image_url} alt={img.alt_text || `${product.name} ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
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
