import Link from "next/link";
import { DISCOVER_LINKS } from "@/lib/seo-data";

export function DiscoverLinks({
  title = "Popular in Cameroon",
  links = DISCOVER_LINKS,
}: {
  title?: string;
  links?: { href: string; label: string }[];
}) {
  return (
    <section className="border-t border-ink/10 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Search the house</p>
        <h2 className="font-display mt-2 text-3xl">{title}</h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block border border-ink/15 px-3 py-2 text-sm text-mute transition hover:border-ink/40 hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
