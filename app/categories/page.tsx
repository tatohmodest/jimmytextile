import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { JsonLd } from "@/components/store/JsonLd";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { itemListSchema, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Home textile collections in Cameroon",
  description:
    "Shop by collection: bedsheets, bed covers, curtains, blankets, pillowcases and towels from Jimmy Home Textile in Douala, delivered nationwide.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <JsonLd
        data={itemListSchema(
          "Jimmy Home Textile collections",
          "/categories",
          categories.map((cat) => ({ name: cat.name, path: `/categories/${cat.slug}` }))
        )}
      />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Collections", path: "/categories" },
          ]}
        />
        <p className="mt-8 text-[11px] tracking-[0.32em] uppercase text-mute">Collections</p>
        <h1 className="font-display mt-2 text-5xl md:text-6xl">Shop by category</h1>
        <p className="mt-4 max-w-2xl text-mute">
          Cotton bedsheets, curtains, towels and the rest of the cupboard — chosen for Cameroon homes and packed in Douala.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className="group relative min-h-[340px] overflow-hidden">
              {cat.image_url ? (
                <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-sand" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
              <div className="absolute bottom-6 left-6 text-ivory">
                <h2 className="font-display text-3xl">{cat.name}</h2>
                <p className="mt-2 max-w-sm text-sm text-ivory/80">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </StoreShell>
  );
}
