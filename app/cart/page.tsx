import { StoreShell } from "@/components/store/StoreShell";
import { CartPageClient } from "@/components/store/CartPageClient";
import { getActiveCategories, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cart" };

export default async function CartPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Selection</p>
        <h1 className="font-display mt-2 mb-10 text-5xl">Cart</h1>
        <CartPageClient deliveryFee={content.delivery.fee} freeOver={content.delivery.free_over} />
      </div>
    </StoreShell>
  );
}
