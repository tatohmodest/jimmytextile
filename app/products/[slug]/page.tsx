import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductBuyBox } from "@/components/store/ProductBuy";
import { getActiveCategories, getProductBySlug, getRelatedProducts, getSiteContent } from "@/lib/queries";
import { formatMoney, siteUrl } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { JsonLd } from "@/components/store/JsonLd";
import { getTranslator } from "@/lib/i18n/server";
import { startingPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const image = product.product_images?.[0]?.image_url;
  return pageMetadata({
    title: product.seo_title || `${product.name} | Buy in Cameroon`,
    description:
      product.seo_description ||
      product.description ||
      `Buy ${product.name} from Jimmy Home Textile in Douala. Home textiles delivered across Cameroon, priced in XAF.`,
    path: `/products/${product.slug}`,
    image,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ t, pick }, content, categories, product] = await Promise.all([
    getTranslator(),
    getSiteContent(),
    getActiveCategories(),
    getProductBySlug(slug),
  ]);
  if (!product) notFound();
  const related = await getRelatedProducts(product.category_id, product.id);
  const name = pick(product.name, product.name_fr);
  const description = pick(product.description, product.description_fr);
  const categoryName = pick(product.categories?.name, product.categories?.name_fr);
  const price = startingPrice(product);
  const image = product.product_images?.[0]?.image_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: product.sku,
    image: product.product_images?.map((i) => i.image_url) || [],
    brand: { "@type": "Brand", name: "Jimmy Home Textile" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl()}/products/${product.slug}`,
      priceCurrency: "XAF",
      price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Jimmy Home Textile" },
      areaServed: { "@type": "Country", name: "Cameroon" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "CM" },
      },
    },
    ...(product.review_count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.average_rating).toFixed(1),
            reviewCount: product.review_count,
          },
        }
      : {}),
  };

  const details = [
    [t("product.material"), product.material],
    [t("product.dimensions"), product.dimensions],
    [t("product.care"), product.care_instructions],
    [t("product.included"), pick(product.whats_included, product.whats_included_fr)],
    [t("product.delivery"), product.delivery_information],
  ].filter(([, v]) => Boolean(v));

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <JsonLd data={jsonLd} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-32 md:grid-cols-2 md:px-8">
        <div className="md:col-span-2">
          <Breadcrumbs
            items={[
              { name: t("common.home"), path: "/" },
              { name: t("nav.shop"), path: "/shop" },
              ...(product.categories ? [{ name: categoryName, path: `/categories/${product.categories.slug}` }] : []),
              { name, path: `/products/${product.slug}` },
            ]}
          />
        </div>
        <ProductGallery product={product} />
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-mute">
            {categoryName} {product.sku ? `· ${product.sku}` : ""}
          </p>
          <h1 className="font-display mt-2 text-4xl md:text-5xl">{name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl">{formatMoney(price)}</span>
          </div>
          {product.review_count > 0 ? (
            <p className="mt-2 text-sm text-mute">
              {t("product.reviews", { rating: Number(product.average_rating).toFixed(1), n: product.review_count })}
            </p>
          ) : null}
          {description ? <p className="mt-6 leading-7 text-mute">{description}</p> : null}
          <p className="mt-4 text-sm text-mute">
            {t("product.packed")}{" "}
            <Link href="/delivery" className="underline-offset-4 hover:underline">
              {t("product.deliveryCities")}
            </Link>
            .
          </p>
          <ProductBuyBox product={product} />
          <dl className="mt-12 grid gap-5 border-t border-ink/10 pt-8">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] tracking-[0.2em] uppercase text-mute">{label}</dt>
                <dd className="mt-1 text-sm leading-6">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {related.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
          <h2 className="font-display text-3xl">{t("product.related")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </StoreShell>
  );
}
