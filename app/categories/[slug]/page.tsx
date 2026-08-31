import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard } from "@/components/store/ProductCard";
import { getActiveCategories, getCategoryBySlug, getShopProducts, getSiteContent } from "@/lib/queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Category" };
  return {
    title: cat.seo_title || cat.name,
    description: cat.seo_description || cat.description || undefined,
  };
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

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Collection</p>
        <h1 className="font-display mt-2 text-5xl">{category.name}</h1>
        {category.description ? <p className="mt-4 max-w-2xl text-mute">{category.description}</p> : null}
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {shop.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </StoreShell>
  );
}
