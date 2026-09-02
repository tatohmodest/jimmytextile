import type { SiteContent } from "@/types";

export const defaultContent: SiteContent = {
  brand: {
    name: "Jimmy Home Textile",
    tagline: "Comfort, elegance and beauty for everyday living.",
    tagline_fr: "Confort, élégance et beauté pour le quotidien.",
    logo_url: "",
  },
  hero: {
    image_url:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=80",
    heading: "Transform Your Home With Comfort & Style",
    heading_fr: "Transformez votre maison avec confort et style",
    description:
      "Discover quality home textiles designed to bring comfort, elegance and beauty into your everyday living space.",
    description_fr:
      "Découvrez un linge de maison de qualité, pensé pour le confort, l’élégance et la beauté du quotidien.",
    primary_button_text: "Shop Now",
    primary_button_text_fr: "Acheter",
    primary_button_link: "/shop",
    secondary_button_text: "Explore Collection",
    secondary_button_text_fr: "Voir les collections",
    secondary_button_link: "/categories",
  },
  promo: {
    image_url:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=2000&q=80",
    heading: "Make Your Bedroom Beautiful",
    heading_fr: "Embellissez votre chambre",
    description: "Discover our latest collection of premium home textiles.",
    description_fr: "Découvrez notre collection de linge de maison.",
    button_text: "Shop Collection",
    button_text_fr: "Voir la collection",
    button_link: "/shop",
    enabled: true,
  },
  features: [
    {
      title: "Quality Products",
      title_fr: "Produits de qualité",
      description: "Carefully selected textile products made to last through everyday living.",
      description_fr: "Des textiles choisis avec soin, faits pour durer au quotidien.",
      icon: "sparkles",
    },
    {
      title: "Beautiful Designs",
      title_fr: "Beaux motifs",
      description: "Modern designs suitable for different home styles, from calm neutrals to rich patterns.",
      description_fr: "Des motifs modernes pour tous les intérieurs, du neutre au plus riche.",
      icon: "palette",
    },
    {
      title: "Affordable Prices",
      title_fr: "Prix accessibles",
      description: "Quality products at competitive prices, so comfort never feels out of reach.",
      description_fr: "Une belle qualité à des prix justes, pour un confort à portée de main.",
      icon: "tag",
    },
    {
      title: "Reliable Delivery",
      title_fr: "Livraison fiable",
      description: "Convenient delivery across Cameroon, with careful packing for every order.",
      description_fr: "Livraison partout au Cameroun, avec un emballage soigné pour chaque commande.",
      icon: "truck",
    },
  ],
  about: {
    heading: "A home textile house built on care",
    heading_fr: "Une maison de linge bâtie avec soin",
    body: "Jimmy Home Textile is a Cameroonian home textile house for bedsheets, pillows, pillowcases, duvets, mattresses, mattress covers, chair covers, curtains and more.",
    body_fr:
      "Jimmy Home Textile est une maison camerounaise de linge de maison : draps, oreillers, taies, couettes, matelas, protège-matelas, housses de chaise, rideaux et bien plus.",
    story:
      "What began as a love for well-made linens has grown into a collection for bedrooms and homes that deserve better than ordinary. We believe comfort should look beautiful, and that quality should be within reach.",
    story_fr:
      "L’amour du linge bien fait est devenu une collection pour les chambres et les maisons qui méritent mieux que l’ordinaire. Le confort doit aussi être beau, et la qualité accessible.",
    mission:
      "To bring premium, trustworthy home textiles to families who want their spaces to feel warm, elegant and lived-in — without compromising on craft or care.",
    mission_fr:
      "Offrir un linge de maison fiable aux familles qui veulent des espaces chauds, élégants et habités — sans jamais relâcher le soin ni la qualité.",
    image_url:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80",
    extra_images: [
      "https://images.unsplash.com/photo-1584100936595-c0654d54a2b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  contact: {
    phone: "+237 6 81 52 39 15",
    phone_secondary: "+237 6 88 95 00 42",
    email: "hello@jimmyhometextile.com",
    address: "Paris Dancing Akwa",
    city: "Douala",
    region: "Littoral",
    whatsapp: "237681523915",
    facebook: "https://web.facebook.com/jimmyhometextile1/",
    instagram: "",
    hours: "Monday — Saturday, 8:00am – 6:00pm",
    hours_fr: "Lundi — Samedi, 8h – 18h",
  },
  delivery: {
    fee: 2000,
    free_over: 50000,
    info: "Orders are carefully packed and delivered across Cameroon. Delivery times vary by city.",
    info_fr: "Les commandes sont emballées avec soin et livrées partout au Cameroun. Les délais varient selon la ville.",
  },
  homepage_sections: [
    { id: "hero", enabled: true, position: 0 },
    { id: "categories", enabled: true, position: 1 },
    { id: "featured", enabled: true, position: 2 },
    { id: "promo", enabled: true, position: 3 },
    { id: "why", enabled: true, position: 4 },
    { id: "about-tease", enabled: true, position: 5 },
    { id: "gallery", enabled: true, position: 6 },
  ],
  gallery: {
    heading: "The house, in motion",
    heading_fr: "La maison, en mouvement",
    intro: "Short films from the atelier — linens, rooms, and the quiet work of making a home feel finished.",
    intro_fr: "Courts films de l’atelier — le linge, les pièces, et le geste qui termine une maison.",
    items: [],
  },
  seo: {
    title: "Jimmy Home Textile | Bedsheets, Curtains & Towels in Cameroon",
    description:
      "Shop cotton bedsheets, bed covers, curtains, blankets, pillowcases and towels in Douala and across Cameroon. Quality linge de maison in XAF, packed in the atelier and delivered nationwide.",
    og_image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
  },
};

export function mergeContent(raw: Record<string, unknown> | null | undefined): SiteContent {
  const source = raw || {};
  const storedSections = Array.isArray(source.homepage_sections)
    ? (source.homepage_sections as SiteContent["homepage_sections"])
    : null;
  const have = new Set((storedSections || []).map((s) => s.id));
  const homepage_sections = storedSections
    ? [
        ...storedSections,
        ...defaultContent.homepage_sections
          .filter((section) => !have.has(section.id))
          .map((section, index) => ({ ...section, position: storedSections.length + index })),
      ]
    : defaultContent.homepage_sections;
  const galleryRaw = (source.gallery as SiteContent["gallery"] | undefined) || defaultContent.gallery;
  return {
    brand: { ...defaultContent.brand, ...(source.brand as object) },
    hero: { ...defaultContent.hero, ...(source.hero as object) },
    promo: { ...defaultContent.promo, ...(source.promo as object) },
    features: Array.isArray(source.features) ? (source.features as SiteContent["features"]) : defaultContent.features,
    about: { ...defaultContent.about, ...(source.about as object) },
    contact: { ...defaultContent.contact, ...(source.contact as object) },
    delivery: { ...defaultContent.delivery, ...(source.delivery as object) },
    homepage_sections,
    gallery: {
      heading: galleryRaw.heading || defaultContent.gallery.heading,
      intro: galleryRaw.intro || defaultContent.gallery.intro,
      items: Array.isArray(galleryRaw.items) ? galleryRaw.items : [],
    },
    seo: { ...defaultContent.seo, ...(source.seo as object) },
  };
}
