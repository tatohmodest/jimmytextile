import { StoreShell } from "@/components/store/StoreShell";
import { AuthForm } from "@/components/store/AuthForm";
import { getActiveCategories, getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/account";
  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-md px-4 pb-20 pt-32">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Welcome back</p>
        <h1 className="font-display mt-2 text-5xl">Log in</h1>
        <p className="mt-3 text-sm text-mute">No password. We email a one-time confirmation code.</p>
        <AuthForm mode="login" next={next} />
      </div>
    </StoreShell>
  );
}
