import Link from "next/link";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { DiscoverLinks } from "@/components/store/DiscoverLinks";
import { JsonLd } from "@/components/store/JsonLd";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { GUIDES } from "@/lib/seo-data";
import { itemListSchema, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Guides to home textiles in Cameroon",
  description:
    "How to choose bedsheets, curtains, towels and hotel linens in Cameroon — from Douala humidity to highland nights. Practical notes from Jimmy Home Textile.",
  path: "/guides",
});

export default async function GuidesPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <JsonLd
        data={itemListSchema(
          "Home textile guides for Cameroon",
          "/guides",
          GUIDES.map((guide) => ({ name: guide.title, path: `/guides/${guide.slug}` }))
        )}
      />
      <section className="bg-forest px-4 pb-16 pt-32 text-ivory md:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            tone="light"
            items={[
              { name: "Home", path: "/" },
              { name: "Guides", path: "/guides" },
            ]}
          />
          <p className="mt-8 text-[11px] tracking-[0.32em] uppercase text-sand">Atelier notes</p>
          <h1 className="font-display mt-3 max-w-3xl text-5xl md:text-7xl">Guides for Cameroon homes</h1>
          <p className="mt-6 max-w-xl text-ivory/75 leading-7">
            How to buy bedsheets, curtains, towels and hotel linens that work in Douala heat, Yaoundé light, and cooler rooms in Buea or Dschang.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group border-t border-ink/10 pt-6">
              <p className="text-[11px] tracking-[0.22em] uppercase text-bronze">{guide.eyebrow}</p>
              <h2 className="font-display mt-2 text-3xl group-hover:opacity-80">{guide.title}</h2>
              <p className="mt-3 text-sm leading-6 text-mute">{guide.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <DiscoverLinks title="Shop and delivery across Cameroon" />
    </StoreShell>
  );
}
