import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/store/CartProvider";
import { ToastProvider } from "@/components/store/ToastProvider";
import { getSiteContent } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

const body = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getSiteContent();
    return {
      metadataBase: new URL(siteUrl()),
      title: {
        default: content.seo.title,
        template: `%s | ${content.brand.name}`,
      },
      description: content.seo.description,
      openGraph: {
        title: content.seo.title,
        description: content.seo.description,
        images: content.seo.og_image ? [{ url: content.seo.og_image }] : undefined,
        type: "website",
        locale: "en_CM",
      },
      icons: {
        icon: content.brand.logo_url || "/favicon.svg",
      },
    };
  } catch {
    return {
      title: "Jimmy Home Textile",
      description: "Premium home textiles for bedrooms and living spaces.",
    };
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full texture">
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
