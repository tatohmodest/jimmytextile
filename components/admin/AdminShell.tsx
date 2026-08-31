"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  Film,
  ImageIcon,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { Profile } from "@/types";

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
  { href: "/admin/gallery", label: "Gallery", icon: Film },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users & Roles", icon: Shield },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2 ${
              active ? "bg-white/10 text-ivory" : "text-ivory/80 hover:bg-white/10 hover:text-ivory"
            }`}
          >
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
    </>
  );
}

function Brand() {
  return (
    <div className="border-b border-white/10 px-5 py-6">
      <p className="font-display text-2xl">Jimmy</p>
      <p className="text-[10px] tracking-[0.28em] uppercase text-ivory/60">Atelier CMS</p>
    </div>
  );
}

export function AdminShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) close();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [close]);

  return (
    <div className="min-h-screen bg-[#f3eee6] text-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden h-screen flex-col bg-forest text-ivory lg:flex">
        <Brand />
        <nav className="grid gap-1 overflow-y-auto p-3 text-sm">
          <NavLinks />
        </nav>
      </aside>

      <div className="mobile-nav-root lg:hidden">
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          className={`mobile-nav-backdrop ${open ? "is-open" : ""}`}
          onClick={close}
        />
        <aside
          id="admin-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
          className={`mobile-nav-drawer border-r border-white/10 bg-forest text-ivory ${open ? "is-open" : ""}`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="font-display text-2xl">Jimmy</p>
              <p className="text-[10px] tracking-[0.28em] uppercase text-ivory/60">Atelier CMS</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="grid h-11 w-11 place-items-center border border-ivory/20"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="grid flex-1 gap-1 overflow-y-auto p-3 text-sm">
            <NavLinks onNavigate={close} />
          </nav>
        </aside>
      </div>

      <div className="min-w-0">
        <header className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="admin-nav"
            >
              <Menu size={22} />
            </button>
            <p className="truncate text-sm text-mute">
              Signed in as {profile.full_name || profile.email} · {profile.role}
            </p>
          </div>
          <Link href="/" className="shrink-0 text-xs uppercase tracking-[0.18em]">
            View store
          </Link>
        </header>
        <div className="p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
