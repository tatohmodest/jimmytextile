import Link from "next/link";
import Image from "next/image";
import type { BrandContent } from "@/types";

export function Logo({ brand, light = false }: { brand: BrandContent; light?: boolean }) {
  const color = light ? "text-ivory" : "text-ink";
  return (
    <Link href="/" className={`flex items-center gap-3 ${color}`}>
      {brand.logo_url ? (
        <span className="relative h-10 w-10 overflow-hidden">
          <Image src={brand.logo_url} alt={brand.name} fill className="object-contain" />
        </span>
      ) : (
        <span className={`grid h-10 w-10 place-items-center border ${light ? "border-ivory/40" : "border-ink/20"} font-display text-xl`}>
          J
        </span>
      )}
      <span className="leading-none">
        <span className="font-display block text-[1.35rem] tracking-wide">Jimmy</span>
        <span className="block text-[10px] uppercase tracking-[0.32em] opacity-70">Home Textile</span>
      </span>
    </Link>
  );
}
