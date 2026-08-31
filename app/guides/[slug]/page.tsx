import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { JsonLd } from "@/components/store/JsonLd";
import { getActiveCategories, getShopProducts, getSiteContent } from "@/lib/queries";
import { GUIDES, getGuide, relatedGuides } from "@/lib/seo-data";
import { pageMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide" };
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: "article",
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const [content, categories, relatedProducts] = await Promise.all([
    getSiteContent(),
    getActiveCategories(),
    guide.categorySlug ? getShopProducts({ category: guide.categorySlug, sort: "newest" }) : Promise.resolve({ products: [] }),
  ]);
  const more = relatedGuides(guide.slug);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    author: { "@type": "Organization", name: "Jimmy Home Textile" },
    publisher: { "@type": "Organization", name: "Jimmy Home Textile" },
    datePublished: "2026-01-15",
    inLanguage: "en-CM",
    about: "Home textiles in Cameroon",
  };

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <JsonLd data={articleLd} />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-32 md:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]}
        />
        <p className="mt-8 text-[11px] tracking-[0.32em] uppercase text-mute">{guide.eyebrow}</p>
        <h1 className="font-display mt-3 text-4xl md:text-6xl">{guide.title}</h1>
        <p className="mt-5 text-lg leading-8 text-mute">{guide.description}</p>
        {guide.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="font-display text-3xl">{section.heading}</h2>
            <p className="mt-4 leading-8 text-mute">{section.body}</p>
          </section>
        ))}
        <p className="mt-12">
          <Link href="/shop" className="btn-primary">
            Shop the collection
          </Link>
        </p>
      </article>
      {relatedProducts.products.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <h2 className="font-display text-3xl">From the collection</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
      <section className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
        <h2 className="font-display text-3xl">More notes</h2>
        <ul className="mt-6 grid gap-3">
          {more.map((item) => (
            <li key={item.slug}>
              <Link href={`/guides/${item.slug}`} className="text-sm underline-offset-4 hover:underline">
                {item.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/delivery" className="text-sm underline-offset-4 hover:underline">
              Delivery across Cameroon
            </Link>
          </li>
        </ul>
      </section>
    </StoreShell>
  );
}
