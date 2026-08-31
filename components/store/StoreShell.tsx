import { StoreChrome } from "./StoreChrome";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { WhatsAppButton } from "./WhatsAppButton";
import { FloatingCart } from "./FloatingCart";
import type { BrandContent, Category, ContactContent } from "@/types";

export function StoreShell({
  children,
  brand,
  contact,
  categories,
  transparentHeader = false,
}: {
  children: React.ReactNode;
  brand: BrandContent;
  contact: ContactContent;
  categories: Category[];
  transparentHeader?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreChrome brand={brand} categories={categories} transparent={transparentHeader} />
      <main className="flex-1">{children}</main>
      <Footer brand={brand} contact={contact} categories={categories} />
      <CartDrawer />
      <FloatingCart />
      <WhatsAppButton phone={contact.whatsapp} />
    </div>
  );
}
