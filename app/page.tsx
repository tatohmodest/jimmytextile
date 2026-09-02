import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductCard } from "@/components/store/ProductCard";
import { VideoCard } from "@/components/store/VideoCard";
import { DiscoverLinks } from "@/components/store/DiscoverLinks";
import {
  getActiveCategories,
  getFeaturedCategories,
  getFeaturedProducts,
  getSiteContent,
} from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { Sparkles, Palette, Tag, Truck } from "lucide-react";
import type { FeatureItem } from "@/types";
import { getTranslator } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    ...pageMetadata({
      title: content.seo.title,
      description: content.seo.description,
      path: "/",
      image: content.seo.og_image,
    }),
    title: { absolute: content.seo.title },
  };
}

const ICONS: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  palette: Palette,
  tag: Tag,
  truck: Truck,
};

export default async function HomePage() {
  const [{ t, pick }, content, categories, featuredCategories, featured] = await Promise.all([
    getTranslator(),
    getSiteContent(),
    getActiveCategories(),
    getFeaturedCategories(),
    getFeaturedProducts(),
  ]);

  const sections = [...content.homepage_sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.position - b.position);

  const render = (id: string) => {
    if (id === "hero") {
      return (
        <section key="hero" className="relative h-[92vh] min-h-[640px] overflow-hidden">
          <Image
            src={content.hero.image_url}
            alt={pick(content.hero.heading, content.hero.heading_fr)}
            fill
            priority
            className="kenburns object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/35 to-transparent" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-20 pt-36 md:items-center md:px-8 md:pb-0">
            <div className="reveal max-w-xl text-ivory">
              <p className="text-[11px] tracking-[0.38em] uppercase text-sand">Jimmy Home Textile</p>
              <h1 className="font-display mt-4 text-5xl leading-[0.95] md:text-7xl">{pick(content.hero.heading, content.hero.heading_fr)}</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-ivory/80">{pick(content.hero.description, content.hero.description_fr)}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={content.hero.primary_button_link} className="btn-light">
                  {pick(content.hero.primary_button_text, content.hero.primary_button_text_fr)}
                </Link>
                <Link href={content.hero.secondary_button_link} className="btn-ghost">
                  {pick(content.hero.secondary_button_text, content.hero.secondary_button_text_fr)}
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    }
    if (id === "categories") {
      const list = featuredCategories.length ? featuredCategories : categories;
      return (
        <section key="categories" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[0.32em] uppercase text-mute">{t("home.collectionsKicker")}</p>
              <h2 className="font-display mt-2 text-4xl md:text-5xl">{t("home.featuredCategories")}</h2>
            </div>
            <Link href="/categories" className="hidden text-xs tracking-[0.22em] uppercase md:inline">
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {list.slice(0, 7).map((cat, i) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={`group relative overflow-hidden ${i === 0 ? "col-span-2 row-span-2 min-h-[340px] md:min-h-[520px]" : "min-h-[180px] md:min-h-[250px]"}`}
              >
                {cat.image_url ? (
                  <Image src={cat.image_url} alt={pick(cat.name, cat.name_fr)} fill className="object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-sand" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute bottom-4 left-4 text-ivory">
                  <p className="font-display text-2xl md:text-3xl">{pick(cat.name, cat.name_fr)}</p>
                  <p className="mt-1 max-w-xs text-xs text-ivory/80">{pick(cat.description, cat.description_fr)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      );
    }
    if (id === "featured") {
      return (
        <section key="featured" className="bg-linen/60 py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-[11px] tracking-[0.32em] uppercase text-mute">{t("home.chosen")}</p>
                <h2 className="font-display mt-2 text-4xl md:text-5xl">{t("home.featuredProducts")}</h2>
              </div>
              <Link href="/shop" className="text-xs tracking-[0.22em] uppercase">
                {t("home.shopAll")}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      );
    }
    if (id === "promo" && content.promo.enabled) {
      return (
        <section key="promo" className="relative min-h-[520px] overflow-hidden">
          <Image src={content.promo.image_url} alt={pick(content.promo.heading, content.promo.heading_fr)} fill className="object-cover" />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-20 md:px-8">
            <div className="max-w-lg text-ivory">
              <p className="text-[11px] tracking-[0.32em] uppercase text-sand">{t("home.season")}</p>
              <h2 className="font-display mt-3 text-5xl md:text-6xl">{pick(content.promo.heading, content.promo.heading_fr)}</h2>
              <p className="mt-5 text-ivory/80">{pick(content.promo.description, content.promo.description_fr)}</p>
              <Link href={content.promo.button_link} className="btn-light mt-8">
                {pick(content.promo.button_text, content.promo.button_text_fr)}
              </Link>
            </div>
          </div>
        </section>
      );
    }
    if (id === "why") {
      return (
        <section key="why" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <p className="text-[11px] tracking-[0.32em] uppercase text-mute">{t("home.why")}</p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl md:text-5xl">{t("home.whyHeading")}</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-4">
            {content.features.map((feature: FeatureItem, i) => {
              const Icon = ICONS[feature.icon] || Sparkles;
              return (
                <div key={feature.title} className="border-t border-ink/10 pt-6">
                  <p className="text-[11px] tracking-[0.22em] uppercase text-bronze">0{i + 1}</p>
                  <Icon className="mt-4 text-forest" size={22} />
                  <h3 className="font-display mt-4 text-2xl">{pick(feature.title, feature.title_fr)}</h3>
                  <p className="mt-3 text-sm leading-6 text-mute">{pick(feature.description, feature.description_fr)}</p>
                </div>
              );
            })}
          </div>
        </section>
      );
    }
    if (id === "about-tease") {
      return (
        <section key="about-tease" className="grid md:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image src={content.about.image_url} alt={pick(content.about.heading, content.about.heading_fr)} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center bg-forest px-8 py-16 text-ivory md:px-16">
            <p className="text-[11px] tracking-[0.32em] uppercase text-sand">{t("home.house")}</p>
            <h2 className="font-display mt-4 text-4xl md:text-5xl">{pick(content.about.heading, content.about.heading_fr)}</h2>
            <p className="mt-6 max-w-lg text-ivory/75 leading-7">{pick(content.about.body, content.about.body_fr)}</p>
            <Link href="/about" className="btn-ghost mt-8 w-fit">
              {t("home.story")}
            </Link>
          </div>
        </section>
      );
    }
    if (id === "gallery") {
      const films = [...content.gallery.items]
        .filter((item) => item.published)
        .sort((a, b) => a.position - b.position)
        .slice(0, 3);
      if (!films.length) return null;
      return (
        <section key="gallery" className="bg-forest py-20 text-ivory">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] tracking-[0.32em] uppercase text-sand">{t("home.films")}</p>
                <h2 className="font-display mt-2 text-4xl md:text-5xl">{pick(content.gallery.heading, content.gallery.heading_fr)}</h2>
                <p className="mt-4 max-w-xl text-ivory/70">{pick(content.gallery.intro, content.gallery.intro_fr)}</p>
              </div>
              <Link href="/gallery" className="hidden text-xs tracking-[0.22em] uppercase text-ivory/80 md:inline">
                {t("home.viewGallery")}
              </Link>
            </div>
            <div className={`grid gap-4 ${films.length === 1 ? "" : "md:grid-cols-2"}`}>
              {films.map((item, index) => (
                <div key={item.id} className={index === 0 && films.length > 1 ? "md:col-span-2" : ""}>
                  <VideoCard item={item} featured={index === 0} />
                </div>
              ))}
            </div>
            <Link href="/gallery" className="btn-ghost mt-8 inline-flex md:hidden">
              {t("home.viewGallery")}
            </Link>
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories} transparentHeader>
      {sections.map((s) => render(s.id))}
      <DiscoverLinks title={t("home.discover")} />
      <div className="overflow-hidden border-y border-ink/10 bg-linen py-4">
        <div className="marquee flex w-max gap-16 text-[12px] tracking-[0.35em] uppercase text-mute">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16 px-8">
              {categories.map((c) => (
                <span key={c.slug + i}>{pick(c.name, c.name_fr)}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </StoreShell>
  );
}
