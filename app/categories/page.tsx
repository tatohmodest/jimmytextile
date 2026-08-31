import Image from "next/image";
import Link from "next/link";
import { StoreShell } from "@/components/store/StoreShell";
import { getActiveCategories, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Collections</p>
        <h1 className="font-display mt-2 text-5xl md:text-6xl">Shop by category</h1>
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
