import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductBuyBox } from "@/components/store/ProductBuy";
import { getActiveCategories, getProductBySlug, getRelatedProducts, getSiteContent } from "@/lib/queries";
import { formatMoney, discountPercent, siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const image = product.product_images?.[0]?.image_url;
  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.description || undefined,
    openGraph: {
      title: product.seo_title || product.name,
      description: product.seo_description || product.description || undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [content, categories, product] = await Promise.all([
    getSiteContent(),
    getActiveCategories(),
    getProductBySlug(slug),
  ]);
  if (!product) notFound();
  const related = await getRelatedProducts(product.category_id, product.id);
  const percent = discountPercent(Number(product.price), product.discount_price ? Number(product.discount_price) : null);
  const price = percent ? Number(product.discount_price) : Number(product.price);
  const image = product.product_images?.[0]?.image_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.product_images?.map((i) => i.image_url) || [],
    brand: { "@type": "Brand", name: "Jimmy Home Textile" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl()}/products/${product.slug}`,
      priceCurrency: "XAF",
      price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
    ["Material", product.material],
    ["Dimensions", product.dimensions],
    ["Care instructions", product.care_instructions],
    ["What's included", product.whats_included],
    ["Delivery information", product.delivery_information],
  ].filter(([, v]) => Boolean(v));

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-32 md:grid-cols-2 md:px-8">
        <ProductGallery product={product} />
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-mute">
            {product.categories?.name} {product.sku ? `· ${product.sku}` : ""}
          </p>
          <h1 className="font-display mt-2 text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl">{formatMoney(price)}</span>
            {percent ? <span className="text-mute line-through">{formatMoney(product.price)}</span> : null}
            {percent ? <span className="text-wine text-sm">Save {percent}%</span> : null}
          </div>
          {product.review_count > 0 ? (
            <p className="mt-2 text-sm text-mute">
              {Number(product.average_rating).toFixed(1)} · {product.review_count} reviews
            </p>
          ) : null}
          {product.description ? <p className="mt-6 leading-7 text-mute">{product.description}</p> : null}
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
          <h2 className="font-display text-3xl">You may also like</h2>
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
