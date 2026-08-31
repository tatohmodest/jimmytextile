import { Suspense } from "react";
import { StoreShell } from "@/components/store/StoreShell";
import { TrackForm } from "@/components/store/TrackForm";
import { getActiveCategories, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Track order", robots: { index: false, follow: false } };

export default async function TrackPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-32 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Follow your linens</p>
        <h1 className="font-display mt-2 text-5xl">Order tracking</h1>
        <p className="mt-4 text-mute">Enter your order number, and optionally the phone or email used at checkout.</p>
        <Suspense>
          <TrackForm />
        </Suspense>
      </div>
    </StoreShell>
  );
}
