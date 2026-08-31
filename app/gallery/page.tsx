import { StoreShell } from "@/components/store/StoreShell";
import { VideoCard } from "@/components/store/VideoCard";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Atelier films | Jimmy Home Textile gallery",
  description:
    "Short films of linens, rooms and making from Jimmy Home Textile in Douala — the house, in motion.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  const films = [...content.gallery.items].filter((item) => item.published).sort((a, b) => a.position - b.position);
  const [hero, ...rest] = films;

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <section className="bg-forest px-4 pb-16 pt-32 text-ivory md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] tracking-[0.32em] uppercase text-sand">Atelier films</p>
          <h1 className="font-display mt-3 max-w-3xl text-5xl md:text-7xl">{content.gallery.heading}</h1>
          <p className="mt-6 max-w-xl text-ivory/75 leading-7">{content.gallery.intro}</p>
        </div>
      </section>

      {hero ? (
        <section className="bg-ink">
          <VideoCard item={hero} featured />
        </section>
      ) : (
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="font-display text-3xl">Films are being prepared</p>
          <p className="mt-3 text-mute">The house will post short films of rooms, linens, and making here.</p>
        </section>
      )}

      {rest.length ? (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((item) => (
              <VideoCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </StoreShell>
  );
}
