import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard } from "@/components/store/ProductCard";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { JsonLd } from "@/components/store/JsonLd";
import { getActiveCategories, getCategoryBySlug, getShopProducts, getSiteContent } from "@/lib/queries";
import { CATEGORY_LANDING } from "@/lib/seo-data";
import { itemListSchema, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Category" };
  const landing = CATEGORY_LANDING[slug];
  return pageMetadata({
    title: cat.seo_title || landing?.seoTitle || cat.name,
    description: cat.seo_description || landing?.seoDescription || cat.description || `${cat.name} from Jimmy Home Textile in Cameroon.`,
    path: `/categories/${slug}`,
    image: cat.image_url || undefined,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [content, categories, category] = await Promise.all([
    getSiteContent(),
    getActiveCategories(),
    getCategoryBySlug(slug),
  ]);
  if (!category) notFound();
  const shop = await getShopProducts({ category: slug, sort: "newest" });
  const landing = CATEGORY_LANDING[slug];

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <JsonLd
        data={itemListSchema(
          category.name,
          `/categories/${category.slug}`,
          shop.products.map((p) => ({ name: p.name, path: `/products/${p.slug}` }))
        )}
      />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Collections", path: "/categories" },
            { name: category.name, path: `/categories/${category.slug}` },
          ]}
        />
        <p className="mt-8 text-[11px] tracking-[0.32em] uppercase text-mute">Collection</p>
        <h1 className="font-display mt-2 text-5xl">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-mute">{landing?.intro || category.description}</p>
        {landing?.body ? <p className="mt-4 max-w-2xl leading-7 text-mute">{landing.body}</p> : null}
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {shop.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </StoreShell>
  );
}
