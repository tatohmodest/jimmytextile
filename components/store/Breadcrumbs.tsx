import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export function Breadcrumbs({
  items,
  tone = "dark",
}: {
  items: { name: string; path: string }[];
  tone?: "dark" | "light";
}) {
  const color = tone === "light" ? "text-ivory/70" : "text-mute";
  const current = tone === "light" ? "text-ivory" : "text-ink";
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className={`text-[11px] tracking-[0.18em] uppercase ${color}`}>
        <ol className="flex flex-wrap gap-x-2 gap-y-1">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === items.length - 1 ? (
                <span className={current}>{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:opacity-100">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
