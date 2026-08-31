import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StoreShell } from "@/components/store/StoreShell";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { CAMEROON_CITIES } from "@/lib/seo-data";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "A Cameroonian home textile house",
  description:
    "Jimmy Home Textile is a Douala atelier for bedsheets, curtains, towels and bed covers, delivered across Cameroon. Comfort, elegance and beauty for everyday living.",
  path: "/about",
});

export default async function AboutPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="relative h-[48vh] min-h-[360px]">
        <Image src={content.about.image_url} alt="Jimmy Home Textile linens in a Cameroonian bedroom" fill className="object-cover" />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-12 md:px-8">
          <div className="text-ivory">
            <Breadcrumbs
              tone="light"
              items={[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
              ]}
            />
            <p className="mt-6 text-[11px] tracking-[0.32em] uppercase">The house</p>
            <h1 className="font-display mt-2 text-5xl md:text-6xl">{content.about.heading}</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <p className="font-display text-3xl leading-snug">{content.about.body}</p>
        <p className="mt-8 leading-8 text-mute">{content.about.story}</p>
        <p className="mt-6 leading-8 text-mute">{content.about.mission}</p>
        <h2 className="font-display mt-14 text-3xl">We deliver across Cameroon</h2>
        <p className="mt-4 leading-8 text-mute">
          From the Douala house we send bedsheets, curtains and towels to {CAMEROON_CITIES.map((city) => city.name).join(", ")} and other towns. Read the{" "}
          <Link href="/delivery" className="underline-offset-4 hover:underline">
            delivery notes
          </Link>{" "}
          or the{" "}
          <Link href="/guides" className="underline-offset-4 hover:underline">
            atelier guides
          </Link>
          .
        </p>
      </div>
      {content.about.extra_images?.length ? (
        <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-20 md:grid-cols-2 md:px-8">
          {content.about.extra_images.map((src) => (
            <div key={src} className="relative min-h-[320px]">
              <Image src={src} alt="Jimmy Home Textile interior and linens" fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </StoreShell>
  );
}
