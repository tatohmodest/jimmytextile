import { StoreShell } from "@/components/store/StoreShell";
import { AuthForm } from "@/components/store/AuthForm";
import { getActiveCategories, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Register", robots: { index: false, follow: false } };

export default async function RegisterPage() {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-md px-4 pb-20 pt-32">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Create an account</p>
        <h1 className="font-display mt-2 text-5xl">Join the house</h1>
        <p className="mt-3 text-sm text-mute">No password. Confirm your email with a one-time code.</p>
        <AuthForm mode="register" next="/account" />
      </div>
    </StoreShell>
  );
}
