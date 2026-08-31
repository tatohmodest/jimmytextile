import Link from "next/link";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { JsonLd } from "@/components/store/JsonLd";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { CAMEROON_CITIES } from "@/lib/seo-data";
import { formatMoney } from "@/lib/utils";
import { itemListSchema, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Delivery across Cameroon | Douala, Yaoundé and nationwide",
  description:
    "Jimmy Home Textile delivers bedsheets, curtains and towels from Douala to Yaoundé, Buea, Limbe, Kribi, Bafoussam, Bamenda, Garoua and more. Packed in the atelier, priced in XAF.",
  path: "/delivery",
});

export default async function DeliveryIndexPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <JsonLd
        data={itemListSchema(
          "Home textile delivery in Cameroon",
          "/delivery",
          CAMEROON_CITIES.map((city) => ({ name: `${city.name} delivery`, path: `/delivery/${city.slug}` }))
        )}
      />
      <section className="bg-forest px-4 pb-16 pt-32 text-ivory md:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            tone="light"
            items={[
              { name: "Home", path: "/" },
              { name: "Delivery", path: "/delivery" },
            ]}
          />
          <p className="mt-8 text-[11px] tracking-[0.32em] uppercase text-sand">From the Douala atelier</p>
          <h1 className="font-display mt-3 max-w-3xl text-5xl md:text-7xl">Delivery across Cameroon</h1>
          <p className="mt-6 max-w-xl text-ivory/75 leading-7">
            Linens leave the house packed against humidity and dust. Douala is fastest; Yaoundé and the regions follow on scheduled runs.
            Delivery is {formatMoney(content.delivery.fee)}, free over {formatMoney(content.delivery.free_over)}.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="max-w-2xl leading-7 text-mute">{content.delivery.info}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAMEROON_CITIES.map((city) => (
            <Link key={city.slug} href={`/delivery/${city.slug}`} className="border-t border-ink/10 pt-5">
              <p className="text-[11px] tracking-[0.2em] uppercase text-bronze">{city.region}</p>
              <h2 className="font-display mt-2 text-2xl">{city.name}</h2>
              <p className="mt-2 text-sm leading-6 text-mute">{city.blurb}</p>
            </Link>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">
            Shop linens
          </Link>
          <Link href="/faq" className="btn-outline">
            Delivery FAQ
          </Link>
        </div>
      </div>
    </StoreShell>
  );
}
