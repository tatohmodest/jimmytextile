import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  CreditCard,
  Warehouse,
  Home,
  Megaphone,
  ImageIcon,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { getCurrentProfile, isStaff } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/promotions", label: "Promotions", icon: Megaphone },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users & Roles", icon: Shield },
];

export async function AdminFrame({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile || !isStaff(profile.role)) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-[#f3eee6] text-ink md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-forest text-ivory">
        <div className="border-b border-white/10 px-5 py-6">
          <p className="font-display text-2xl">Jimmy</p>
          <p className="text-[10px] tracking-[0.28em] uppercase text-ivory/60">Atelier CMS</p>
        </div>
        <nav className="grid gap-1 p-3 text-sm">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2 text-ivory/80 hover:bg-white/10 hover:text-ivory">
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <form action="/api/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-3 py-2 text-left text-ivory/60">
              <LogOut size={16} /> Logout
            </button>
          </form>
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <p className="text-sm text-mute">Signed in as {profile.full_name || profile.email} · {profile.role}</p>
          <Link href="/" className="text-xs uppercase tracking-[0.18em]">
            View store
          </Link>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
