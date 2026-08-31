import type { SiteContent } from "@/types";

export const defaultContent: SiteContent = {
  brand: {
    name: "Jimmy Home Textile",
    tagline: "Comfort, elegance and beauty for everyday living.",
    logo_url: "",
  },
  hero: {
    image_url:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=80",
    heading: "Transform Your Home With Comfort & Style",
    description:
      "Discover quality home textiles designed to bring comfort, elegance and beauty into your everyday living space.",
    primary_button_text: "Shop Now",
    primary_button_link: "/shop",
    secondary_button_text: "Explore Collection",
    secondary_button_link: "/categories",
  },
  promo: {
    image_url:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=2000&q=80",
    heading: "Make Your Bedroom Beautiful",
    description: "Discover our latest collection of premium home textiles.",
    button_text: "Shop Collection",
    button_link: "/shop",
    enabled: true,
  },
  features: [
    {
      title: "Quality Products",
      description: "Carefully selected textile products made to last through everyday living.",
      icon: "sparkles",
    },
    {
      title: "Beautiful Designs",
      description: "Modern designs suitable for different home styles, from calm neutrals to rich patterns.",
      icon: "palette",
    },
    {
      title: "Affordable Prices",
      description: "Quality products at competitive prices, so comfort never feels out of reach.",
      icon: "tag",
    },
    {
      title: "Reliable Delivery",
      description: "Convenient delivery across Cameroon, with careful packing for every order.",
      icon: "truck",
    },
  ],
  about: {
    heading: "A home textile house built on care",
    body: "Jimmy Home Textile is a Cameroonian home textile house devoted to the quiet luxury of everyday living. We source and design bedsheets, bed covers, curtains, blankets, pillowcases and towels that feel as considered as they look.",
    story:
      "What began as a love for well-made linens has grown into a collection for bedrooms and homes that deserve better than ordinary. We believe comfort should look beautiful, and that quality should be within reach.",
    mission:
      "To bring premium, trustworthy home textiles to families who want their spaces to feel warm, elegant and lived-in — without compromising on craft or care.",
    image_url:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80",
    extra_images: [
      "https://images.unsplash.com/photo-1584100936595-c0654d54a2b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  contact: {
    phone: "+237 6 00 00 00 00",
    email: "hello@jimmyhometextile.com",
    address: "Douala, Cameroon",
    city: "Douala",
    region: "Littoral",
    whatsapp: "237600000000",
    facebook: "https://web.facebook.com/jimmyhometextile1/",
    instagram: "",
    hours: "Monday — Saturday, 8:00am – 6:00pm",
  },
  delivery: {
    fee: 2000,
    free_over: 50000,
    info: "Orders are carefully packed and delivered across Cameroon. Delivery times vary by city.",
  },
  homepage_sections: [
    { id: "hero", enabled: true, position: 0 },
    { id: "categories", enabled: true, position: 1 },
    { id: "featured", enabled: true, position: 2 },
    { id: "promo", enabled: true, position: 3 },
    { id: "why", enabled: true, position: 4 },
    { id: "about-tease", enabled: true, position: 5 },
  ],
  seo: {
    title: "Jimmy Home Textile — Premium Home Textiles",
    description:
      "Shop quality bedsheets, bed covers, curtains, blankets, pillowcases and towels from Jimmy Home Textile. Comfort, elegance and beauty for everyday living.",
    og_image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
  },
};

export function mergeContent(raw: Record<string, unknown> | null | undefined): SiteContent {
  const source = raw || {};
  return {
    brand: { ...defaultContent.brand, ...(source.brand as object) },
    hero: { ...defaultContent.hero, ...(source.hero as object) },
    promo: { ...defaultContent.promo, ...(source.promo as object) },
    features: Array.isArray(source.features) ? (source.features as SiteContent["features"]) : defaultContent.features,
    about: { ...defaultContent.about, ...(source.about as object) },
    contact: { ...defaultContent.contact, ...(source.contact as object) },
    delivery: { ...defaultContent.delivery, ...(source.delivery as object) },
    homepage_sections: Array.isArray(source.homepage_sections)
      ? (source.homepage_sections as SiteContent["homepage_sections"])
      : defaultContent.homepage_sections,
    seo: { ...defaultContent.seo, ...(source.seo as object) },
  };
}
