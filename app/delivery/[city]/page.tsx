import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { JsonLd } from "@/components/store/JsonLd";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { CAMEROON_CITIES, getCity, relatedCities } from "@/lib/seo-data";
import { pageMetadata } from "@/lib/seo";
import { formatMoney, whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CAMEROON_CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "Delivery" };
  return pageMetadata({
    title: `Home textiles in ${city.name} | Bedsheets, curtains & towels`,
    description: `Shop bedsheets, curtains, towels and bed covers delivered to ${city.name}, ${city.region}. ${city.blurb}`,
    path: `/delivery/${city.slug}`,
    keywords: [
      `bedsheets ${city.name}`,
      `curtains ${city.name}`,
      `towels ${city.name}`,
      `home textiles ${city.name}`,
      `linge de maison ${city.name}`,
      `Jimmy Home Textile ${city.name}`,
      `delivery ${city.name} Cameroon`,
    ],
  });
}

export default async function CityDeliveryPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  const nearby = relatedCities(city.slug);
  const localLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Home textile delivery to ${city.name}`,
    serviceType: "Parcel delivery of home textiles",
    areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "Country", name: "Cameroon" } },
    provider: { "@type": "Organization", name: "Jimmy Home Textile" },
    description: city.body,
  };

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <JsonLd data={localLd} />
      <section className="bg-forest px-4 pb-16 pt-32 text-ivory md:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            tone="light"
            items={[
              { name: "Home", path: "/" },
              { name: "Delivery", path: "/delivery" },
              { name: city.name, path: `/delivery/${city.slug}` },
            ]}
          />
          <p className="mt-8 text-[11px] tracking-[0.32em] uppercase text-sand">{city.region} · Cameroon</p>
          <h1 className="font-display mt-3 max-w-3xl text-5xl md:text-7xl">Home textiles in {city.name}</h1>
          <p className="mt-6 max-w-xl text-ivory/75 leading-7">{city.blurb}</p>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <p className="font-display text-3xl leading-snug">Bedsheets, curtains and towels packed in Douala, delivered to {city.name}.</p>
        <p className="mt-8 leading-8 text-mute">{city.body}</p>
        <p className="mt-6 leading-8 text-mute">
          Delivery is {formatMoney(content.delivery.fee)}, free over {formatMoney(content.delivery.free_over)}. {content.delivery.info}
        </p>
        <h2 className="font-display mt-14 text-3xl">What we send to {city.name}</h2>
        <ul className="mt-6 grid gap-3 text-sm">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/categories/${category.slug}`} className="underline-offset-4 hover:underline">
                {category.name} delivered to {city.name}
              </Link>
              {category.description ? <span className="block text-mute">{category.description}</span> : null}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">
            Shop for {city.name}
          </Link>
          <a href={whatsappLink(content.contact.whatsapp, `Hello, I would like delivery to ${city.name}.`)} className="btn-outline" target="_blank" rel="noreferrer">
            WhatsApp the house
          </a>
        </div>
        <h2 className="font-display mt-16 text-3xl">Other cities</h2>
        <ul className="mt-4 flex flex-wrap gap-3 text-sm">
          {nearby.map((item) => (
            <li key={item.slug}>
              <Link href={`/delivery/${item.slug}`} className="underline-offset-4 hover:underline">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </StoreShell>
  );
}
