import type { Metadata } from "next";
import { siteUrl } from "@/lib/utils";
import type { ContactContent } from "@/types";
import { PRIMARY_KEYWORDS } from "@/lib/seo-data";

export function absoluteUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${clean === "/" ? "/" : clean}`.replace(/([^:]\/)\/+/g, "$1");
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  keywords,
  index = true,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  index?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image || undefined;
  return {
    title,
    description,
    keywords: keywords?.length ? keywords : PRIMARY_KEYWORDS,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url,
      siteName: "Jimmy Home Textile",
      locale: "en_CM",
      type,
      images: ogImage ? [{ url: ogImage, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export function organizationSchema(contact: ContactContent, logoUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "HomeGoodsStore"],
    name: "Jimmy Home Textile",
    alternateName: ["Jimmy Home Textile Cameroon", "Jimmy Textile"],
    url: siteUrl(),
    logo: logoUrl || `${siteUrl()}/favicon.svg`,
    image: logoUrl || undefined,
    description:
      "Cameroonian home textile house selling bedsheets, bed covers, curtains, blankets, pillowcases and towels, delivered across Cameroon from Douala.",
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: contact.city || "Douala",
      addressRegion: contact.region || "Littoral",
      addressCountry: "CM",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 4.0511,
      longitude: 9.7679,
    },
    areaServed: {
      "@type": "Country",
      name: "Cameroon",
    },
    sameAs: [contact.facebook, contact.instagram].filter(Boolean),
    priceRange: "FF",
    currenciesAccepted: "XAF",
    paymentAccepted: "PayUnit, MTN Mobile Money, Orange Money, card",
    openingHours: "Mo-Sa 08:00-18:00",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jimmy Home Textile",
    url: siteUrl(),
    inLanguage: "en-CM",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl()}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function itemListSchema(name: string, path: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}
