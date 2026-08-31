import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  const { data: customer } = await admin.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!customer) notFound();
  const { data: orders } = await admin.from("orders").select("*").eq("user_id", id).order("created_at", { ascending: false });
  return (
    <div>
      <h1 className="font-display text-4xl">{customer.full_name || customer.email}</h1>
      <p className="mt-2 text-sm text-mute">{customer.email} · {customer.phone}</p>
      <h2 className="font-display mt-10 text-2xl">Order history</h2>
      <ul className="mt-4 grid gap-2 text-sm">
        {(orders || []).map((o) => (
          <li key={o.id} className="flex justify-between border-b border-ink/10 py-2">
            <Link href={`/admin/orders/${o.id}`}>{o.order_number}</Link>
            <span>{formatMoney(o.total)} · {o.order_status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
