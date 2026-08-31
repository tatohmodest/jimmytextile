import { redirect } from "next/navigation";
import { StoreShell } from "@/components/store/StoreShell";
import { getActiveCategories, getSiteContent } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";
import { AccountForms } from "@/components/store/AccountForms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/account");
  const [content, categories] = await Promise.all([getSiteContent(), getActiveCategories()]);
  const admin = createSupabaseAdminClient();
  const { data: orders } = await admin
    .from("orders")
    .select("order_number, created_at, total, order_status, payment_status")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });
  const { data: addresses } = await admin.from("addresses").select("*").eq("user_id", profile.id).order("created_at", { ascending: false });

  return (
    <StoreShell brand={content.brand} contact={content.contact} categories={categories}>
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-32 md:px-8">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Customer account</p>
        <h1 className="font-display mt-2 text-5xl">Hello, {profile.full_name || "there"}</h1>
        <AccountForms profile={profile} addresses={addresses || []} />
        <h2 className="font-display mt-16 text-3xl">Orders</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-[0.16em] text-mute">
              <tr>
                <th className="py-2">Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).map((o) => (
                <tr key={o.order_number} className="border-t border-ink/10">
                  <td className="py-3">
                    <Link href={`/track?order=${o.order_number}`}>{o.order_number}</Link>
                  </td>
                  <td>{String(o.created_at).slice(0, 10)}</td>
                  <td className="capitalize">{String(o.order_status).replaceAll("_", " ")}</td>
                  <td className="capitalize">{o.payment_status}</td>
                  <td>{formatMoney(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders?.length ? <p className="py-8 text-mute">No orders yet.</p> : null}
        </div>
      </div>
    </StoreShell>
  );
}
