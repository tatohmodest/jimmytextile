import { StoreShell } from "@/components/store/StoreShell";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";
import { payunitConfigured } from "@/lib/payunit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const [content, categories, profile] = await Promise.all([
    getSiteContent(),
    getActiveCategories(),
    getCurrentProfile(),
  ]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Secure checkout</p>
        <h1 className="font-display mt-2 mb-10 text-5xl">Checkout</h1>
        <CheckoutForm
          deliveryFee={content.delivery.fee}
          freeOver={content.delivery.free_over}
          profile={profile}
          payunitReady={payunitConfigured()}
        />
      </div>
    </StoreShell>
  );
}
