import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/store/CartProvider";
import { ToastProvider } from "@/components/store/ToastProvider";
import { JsonLd } from "@/components/store/JsonLd";
import { getSiteContent } from "@/lib/queries";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { PRIMARY_KEYWORDS } from "@/lib/seo-data";
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
    const url = siteUrl();
    return {
      metadataBase: new URL(url),
      title: {
        default: content.seo.title,
        template: `%s | ${content.brand.name}`,
      },
      description: content.seo.description,
      keywords: PRIMARY_KEYWORDS,
      applicationName: "Jimmy Home Textile",
      authors: [{ name: "Jimmy Home Textile", url }],
      creator: "Jimmy Home Textile",
      publisher: "Jimmy Home Textile",
      category: "Home & Garden",
      alternates: { canonical: url },
      openGraph: {
        title: content.seo.title,
        description: content.seo.description,
        url,
        siteName: content.brand.name,
        images: content.seo.og_image ? [{ url: content.seo.og_image, alt: content.brand.name }] : undefined,
        type: "website",
        locale: "en_CM",
        countryName: "Cameroon",
      },
      twitter: {
        card: "summary_large_image",
        title: content.seo.title,
        description: content.seo.description,
        images: content.seo.og_image ? [content.seo.og_image] : undefined,
      },
      robots: { index: true, follow: true },
      icons: {
        icon: content.brand.logo_url || "/favicon.svg",
      },
    };
  } catch {
    return {
      title: "Jimmy Home Textile | Home textiles in Cameroon",
      description: "Bedsheets, curtains and towels from Douala, delivered across Cameroon.",
    };
  }
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  let schemaContact = null;
  let logo = "";
  try {
    const content = await getSiteContent();
    schemaContact = content.contact;
    logo = content.brand.logo_url;
  } catch {
    schemaContact = null;
  }

  return (
    <html lang="en-CM" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full texture">
        {schemaContact ? (
          <>
            <JsonLd data={organizationSchema(schemaContact, logo)} />
            <JsonLd data={websiteSchema()} />
          </>
        ) : null}
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
