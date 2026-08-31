import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { v2 as cloudinary } from "cloudinary";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=80",
  bed1: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80",
  bed2: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
  bed3: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80",
  bed4: "https://images.unsplash.com/photo-1584100936595-c0654d54a2b3?auto=format&fit=crop&w=1600&q=80",
  bed5: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80",
  curtain: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
  curtain2: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=80",
  towel: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
  towel2: "https://images.unsplash.com/photo-1631889993959-41b2ae204f84?auto=format&fit=crop&w=1600&q=80",
  living: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
  linen: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=80",
  cream: "https://images.unsplash.com/photo-1616628188524-343f1e8035c0?auto=format&fit=crop&w=1600&q=80",
  hotel: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
};

async function maybeUpload(src, folder) {
  try {
    const result = await cloudinary.uploader.upload(src, {
      folder: `jimmy-home-textile/${folder}`,
      overwrite: false,
    });
    return result.secure_url;
  } catch (err) {
    console.warn("Cloudinary upload skipped:", err.message);
    return src;
  }
}

async function upsertSettings(key, value) {
  const { error } = await admin.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

async function main() {
  const { error: probe } = await admin.from("site_settings").select("key").limit(1);
  if (probe) {
    console.error("Database is not ready:", probe.message);
    console.error("Run supabase/schema.sql in the Supabase SQL editor, then retry npm run db:seed");
    process.exit(1);
  }

  console.log("Uploading hero and category photography to Cloudinary...");
  const hero = await maybeUpload(IMAGES.hero, "cms");
  const promo = await maybeUpload(IMAGES.bed1, "cms");
  const about = await maybeUpload(IMAGES.bed3, "cms");

  const cats = [
    { name: "Bedsheets", slug: "bedsheets", description: "Soft, breathable bedsheets cut for restful nights.", image: IMAGES.bed2 },
    { name: "Bed Covers", slug: "bed-covers", description: "Layered bed covers that finish a bedroom with quiet luxury.", image: IMAGES.hotel },
    { name: "Curtains", slug: "curtains", description: "Drapery that filters light and frames the room.", image: IMAGES.curtain },
    { name: "Blankets", slug: "blankets", description: "Warmth with a tailored, contemporary hand.", image: IMAGES.bed5 },
    { name: "Pillowcases", slug: "pillowcases", description: "Crisp pillowcases in considered colours and weaves.", image: IMAGES.bed4 },
    { name: "Towels", slug: "towels", description: "Absorbent towels for bathrooms that feel like a hotel.", image: IMAGES.towel },
    { name: "Other Home Textiles", slug: "other-home-textiles", description: "Throws, table linens and finishing pieces for the home.", image: IMAGES.living },
  ];

  const categoryIds = {};
  for (let i = 0; i < cats.length; i++) {
    const image = await maybeUpload(cats[i].image, "categories");
    const { data, error } = await admin
      .from("categories")
      .upsert(
        {
          name: cats[i].name,
          slug: cats[i].slug,
          description: cats[i].description,
          image_url: image,
          position: i,
          is_featured: true,
          is_active: true,
          seo_title: `${cats[i].name} | Jimmy Home Textile`,
          seo_description: cats[i].description,
        },
        { onConflict: "slug" }
      )
      .select("id, slug")
      .single();
    if (error) throw error;
    categoryIds[data.slug] = data.id;
  }

  await upsertSettings("brand", {
    name: "Jimmy Home Textile",
    tagline: "Comfort, elegance and beauty for everyday living.",
    logo_url: "",
  });
  await upsertSettings("hero", {
    image_url: hero,
    heading: "Transform Your Home With Comfort & Style",
    description:
      "Discover quality home textiles designed to bring comfort, elegance and beauty into your everyday living space.",
    primary_button_text: "Shop Now",
    primary_button_link: "/shop",
    secondary_button_text: "Explore Collection",
    secondary_button_link: "/categories",
  });
  await upsertSettings("promo", {
    image_url: promo,
    heading: "Make Your Bedroom Beautiful",
    description: "Discover our latest collection of premium home textiles.",
    button_text: "Shop Collection",
    button_link: "/shop",
    enabled: true,
  });
  await upsertSettings("features", [
    { title: "Quality Products", description: "Carefully selected textile products made to last through everyday living.", icon: "sparkles" },
    { title: "Beautiful Designs", description: "Modern designs suitable for different home styles, from calm neutrals to rich patterns.", icon: "palette" },
    { title: "Affordable Prices", description: "Quality products at competitive prices, so comfort never feels out of reach.", icon: "tag" },
    { title: "Reliable Delivery", description: "Convenient delivery across Cameroon, with careful packing for every order.", icon: "truck" },
  ]);
  await upsertSettings("about", {
    heading: "A home textile house built on care",
    body: "Jimmy Home Textile is a Cameroonian home textile house devoted to the quiet luxury of everyday living. We source and design bedsheets, bed covers, curtains, blankets, pillowcases and towels that feel as considered as they look.",
    story: "What began as a love for well-made linens has grown into a collection for bedrooms and homes that deserve better than ordinary. We believe comfort should look beautiful, and that quality should be within reach.",
    mission: "To bring premium, trustworthy home textiles to families who want their spaces to feel warm, elegant and lived-in — without compromising on craft or care.",
    image_url: about,
    extra_images: [IMAGES.bed4, IMAGES.bed5],
  });
  await upsertSettings("contact", {
    phone: "+237 6 00 00 00 00",
    email: "hello@jimmyhometextile.com",
    address: "Douala, Cameroon",
    city: "Douala",
    region: "Littoral",
    whatsapp: "237600000000",
    facebook: "https://web.facebook.com/jimmyhometextile1/",
    instagram: "",
    hours: "Monday — Saturday, 8:00am – 6:00pm",
  });
  await upsertSettings("delivery", {
    fee: 2000,
    free_over: 50000,
    info: "Orders are carefully packed and delivered across Cameroon. Delivery times vary by city.",
  });
  await upsertSettings("homepage_sections", [
    { id: "hero", enabled: true, position: 0 },
    { id: "categories", enabled: true, position: 1 },
    { id: "featured", enabled: true, position: 2 },
    { id: "promo", enabled: true, position: 3 },
    { id: "why", enabled: true, position: 4 },
    { id: "about-tease", enabled: true, position: 5 },
    { id: "gallery", enabled: true, position: 6 },
  ]);
  await upsertSettings("gallery", {
    heading: "The house, in motion",
    intro: "Short films from the atelier — linens, rooms, and the quiet work of making a home feel finished.",
    items: [],
  });
  await upsertSettings("seo", {
    title: "Jimmy Home Textile — Premium Home Textiles",
    description: "Shop quality bedsheets, bed covers, curtains, blankets, pillowcases and towels from Jimmy Home Textile.",
    og_image: hero,
  });

  const products = [
    {
      name: "Ivory Cotton Bedsheet Set",
      slug: "ivory-cotton-bedsheet-set",
      category: "bedsheets",
      price: 28500,
      discount: 24900,
      sku: "JHT-BS-001",
      stock: 24,
      featured: true,
      sizes: ["Queen", "King", "Super King"],
      colors: [
        { name: "Ivory", hex: "#F4EFE6" },
        { name: "Sand", hex: "#D9C7A8" },
        { name: "Sage", hex: "#8A9A86" },
      ],
      designs: ["Plain", "Subtle stripe"],
      material: "100% cotton percale, 200 thread count",
      dimensions: "Fitted sheet + flat sheet + 2 pillowcases",
      care: "Machine wash cold. Tumble dry low. Warm iron.",
      included: "1 fitted sheet, 1 flat sheet, 2 pillowcases",
      description: "A quietly luxurious cotton set in warm ivory. Smooth to the touch, breathable through humid nights, and tailored to sit neatly on the bed.",
      images: [IMAGES.bed2, IMAGES.bed3, IMAGES.cream],
    },
    {
      name: "Forest Stripe Percale Sheets",
      slug: "forest-stripe-percale-sheets",
      category: "bedsheets",
      price: 32000,
      discount: null,
      sku: "JHT-BS-002",
      stock: 18,
      featured: true,
      sizes: ["Double", "Queen", "King"],
      colors: [
        { name: "Forest", hex: "#2C3A32" },
        { name: "Clay", hex: "#9C6B4A" },
      ],
      designs: ["Classic stripe"],
      material: "Cotton percale",
      dimensions: "Fitted + flat + 2 pillowcases",
      care: "Machine wash gentle. Do not bleach.",
      included: "Complete sheet set",
      description: "Graphic forest stripes on cool percale. A modern bedroom essential with a hotel-crisp handfeel.",
      images: [IMAGES.bed1, IMAGES.hotel],
    },
    {
      name: "Atelier Quilted Bed Cover",
      slug: "atelier-quilted-bed-cover",
      category: "bed-covers",
      price: 45500,
      discount: 39900,
      sku: "JHT-BC-001",
      stock: 12,
      featured: true,
      sizes: ["Queen", "King"],
      colors: [
        { name: "Linen", hex: "#E6D7C3" },
        { name: "Charcoal", hex: "#3A3530" },
      ],
      designs: ["Diamond quilt"],
      material: "Cotton face with light fill",
      dimensions: "240 × 260 cm (King)",
      care: "Gentle machine wash. Reshape while damp.",
      included: "1 quilted bed cover",
      description: "A diamond-quilted cover that adds depth without heaviness. Drape it, fold it at the foot, or use it as the main layer.",
      images: [IMAGES.hotel, IMAGES.bed5],
    },
    {
      name: "Sunlit Linen Duvet Cover",
      slug: "sunlit-linen-duvet-cover",
      category: "bed-covers",
      price: 52000,
      discount: null,
      sku: "JHT-BC-002",
      stock: 9,
      featured: false,
      sizes: ["Queen", "King"],
      colors: [
        { name: "Sunlit", hex: "#E8D9B8" },
        { name: "Stone", hex: "#C9C1B4" },
      ],
      designs: ["Washed linen"],
      material: "Washed cotton-linen blend",
      dimensions: "Fits standard duvet inserts",
      care: "Wash separately. Line dry recommended.",
      included: "1 duvet cover with hidden buttons",
      description: "A sun-washed cover with a lived-in drape. Softens with every wash and photographs beautifully in morning light.",
      images: [IMAGES.bed3, IMAGES.cream],
    },
    {
      name: "Gallery Sheer Curtain Pair",
      slug: "gallery-sheer-curtain-pair",
      category: "curtains",
      price: 24500,
      discount: 21500,
      sku: "JHT-CU-001",
      stock: 20,
      featured: true,
      sizes: ["240cm", "270cm", "300cm"],
      colors: [
        { name: "Cloud", hex: "#F2EEE8" },
        { name: "Warm white", hex: "#F7F1E6" },
      ],
      designs: ["Sheer", "Light filter"],
      material: "Voile polyester-cotton",
      dimensions: "Sold as a pair. Width 140cm each panel.",
      care: "Gentle wash. Hang to dry.",
      included: "2 curtain panels",
      description: "Airy sheers that soften daylight and give rooms a gallery-like calm. Pair with heavier drapes or let them stand alone.",
      images: [IMAGES.curtain, IMAGES.curtain2],
    },
    {
      name: "Velvet Room Drapes",
      slug: "velvet-room-drapes",
      category: "curtains",
      price: 48500,
      discount: null,
      sku: "JHT-CU-002",
      stock: 8,
      featured: false,
      sizes: ["270cm", "300cm"],
      colors: [
        { name: "Wine", hex: "#6B3A32" },
        { name: "Ink", hex: "#1A1612" },
        { name: "Moss", hex: "#4F5D4E" },
      ],
      designs: ["Full drape"],
      material: "Soft-touch velvet",
      dimensions: "Pair of panels, 140cm width",
      care: "Dry clean or gentle steam.",
      included: "2 velvet panels",
      description: "Weighty velvet drapes that hold a beautiful fold and deepen a room after dusk.",
      images: [IMAGES.curtain2, IMAGES.living],
    },
    {
      name: "Highland Knit Blanket",
      slug: "highland-knit-blanket",
      category: "blankets",
      price: 29500,
      discount: 25900,
      sku: "JHT-BL-001",
      stock: 16,
      featured: true,
      sizes: ["Throw", "Queen"],
      colors: [
        { name: "Camel", hex: "#C4A484" },
        { name: "Ecru", hex: "#EDE6D9" },
      ],
      designs: ["Chunky knit"],
      material: "Acrylic-wool blend knit",
      dimensions: "Throw 130 × 170 cm",
      care: "Hand wash or gentle cycle. Lay flat to dry.",
      included: "1 knit blanket",
      description: "A tactile knit for the end of the bed or the arm of a sofa. Warm, generous, and quietly decorative.",
      images: [IMAGES.bed5, IMAGES.linen],
    },
    {
      name: "Midnight Fleece Throw",
      slug: "midnight-fleece-throw",
      category: "blankets",
      price: 18500,
      discount: null,
      sku: "JHT-BL-002",
      stock: 22,
      featured: false,
      sizes: ["Throw"],
      colors: [
        { name: "Midnight", hex: "#2A2E38" },
        { name: "Taupe", hex: "#8A7E70" },
      ],
      designs: ["Solid"],
      material: "Double-sided fleece",
      dimensions: "150 × 200 cm",
      care: "Machine wash cold.",
      included: "1 throw",
      description: "An everyday throw with a plush hand — for film nights, cool mornings, and guest rooms.",
      images: [IMAGES.linen, IMAGES.living],
    },
    {
      name: "Hemstitch Pillowcase Pair",
      slug: "hemstitch-pillowcase-pair",
      category: "pillowcases",
      price: 9500,
      discount: 7900,
      sku: "JHT-PC-001",
      stock: 40,
      featured: true,
      sizes: ["Standard", "King"],
      colors: [
        { name: "Ivory", hex: "#F4EFE6" },
        { name: "Blush", hex: "#E8C9C0" },
        { name: "Sky", hex: "#C9D6D8" },
      ],
      designs: ["Hemstitch"],
      material: "Cotton sateen",
      dimensions: "Standard 50 × 75 cm",
      care: "Machine wash. Iron slightly damp.",
      included: "2 pillowcases",
      description: "A refined hemstitch edge on smooth sateen. The smallest change that makes a made bed look considered.",
      images: [IMAGES.bed4, IMAGES.cream],
    },
    {
      name: "Printed Botanical Pillowcases",
      slug: "printed-botanical-pillowcases",
      category: "pillowcases",
      price: 12000,
      discount: null,
      sku: "JHT-PC-002",
      stock: 14,
      featured: false,
      sizes: ["Standard"],
      colors: [
        { name: "Botanical", hex: "#6B7F6A" },
      ],
      designs: ["Botanical print"],
      material: "Cotton print",
      dimensions: "Pair of standard cases",
      care: "Wash inside out.",
      included: "2 pillowcases",
      description: "Soft botanical print for beds that want a little more personality without losing elegance.",
      images: [IMAGES.cream, IMAGES.bed4],
    },
    {
      name: "Hotel Rib Bath Towel Set",
      slug: "hotel-rib-bath-towel-set",
      category: "towels",
      price: 16500,
      discount: 14500,
      sku: "JHT-TW-001",
      stock: 30,
      featured: true,
      sizes: ["Set of 4"],
      colors: [
        { name: "White", hex: "#F7F7F4" },
        { name: "Stone", hex: "#C9C1B4" },
        { name: "Forest", hex: "#3D4A3E" },
      ],
      designs: ["Ribbed hotel"],
      material: "100% cotton terry, 550 GSM",
      dimensions: "2 bath + 2 hand towels",
      care: "Wash before first use. Avoid fabric softener.",
      included: "4 towels",
      description: "Dense, absorbent terry with a hotel rib. The set that makes a bathroom feel finished.",
      images: [IMAGES.towel, IMAGES.towel2],
    },
    {
      name: "Spa Face Cloth Bundle",
      slug: "spa-face-cloth-bundle",
      category: "towels",
      price: 6500,
      discount: null,
      sku: "JHT-TW-002",
      stock: 36,
      featured: false,
      sizes: ["Set of 6"],
      colors: [
        { name: "Assorted neutrals", hex: "#D8CFC2" },
      ],
      designs: ["Waffle"],
      material: "Waffle cotton",
      dimensions: "30 × 30 cm",
      care: "Machine wash hot.",
      included: "6 face cloths",
      description: "Quick-dry waffle cloths in a bundle — practical, pretty, and endlessly useful.",
      images: [IMAGES.towel2, IMAGES.towel],
    },
    {
      name: "Maison Table Runner",
      slug: "maison-table-runner",
      category: "other-home-textiles",
      price: 14500,
      discount: null,
      sku: "JHT-OT-001",
      stock: 11,
      featured: false,
      sizes: ["180cm", "220cm"],
      colors: [
        { name: "Natural", hex: "#E4D5B7" },
        { name: "Terracotta", hex: "#C27A5A" },
      ],
      designs: ["Woven stripe"],
      material: "Cotton-linen weave",
      dimensions: "40 cm width",
      care: "Gentle wash. Iron on linen setting.",
      included: "1 table runner",
      description: "A woven runner that dresses the table for weekday dinners and weekend gatherings alike.",
      images: [IMAGES.living, IMAGES.linen],
    },
    {
      name: "Sunday Throw Cushion Cover",
      slug: "sunday-throw-cushion-cover",
      category: "other-home-textiles",
      price: 8500,
      discount: 7500,
      sku: "JHT-OT-002",
      stock: 28,
      featured: true,
      sizes: ["45 × 45 cm", "50 × 50 cm"],
      colors: [
        { name: "Oat", hex: "#D7C4A3" },
        { name: "Olive", hex: "#6E7A55" },
        { name: "Rust", hex: "#A65A3A" },
      ],
      designs: ["Textured weave"],
      material: "Heavy cotton",
      dimensions: "Hidden zip cover, insert not included",
      care: "Remove cover. Cold wash.",
      included: "1 cushion cover",
      description: "A textured cushion cover that instantly warms a sofa, bench or bedscape.",
      images: [IMAGES.living, IMAGES.cream],
    },
  ];

  for (const p of products) {
    const uploaded = [];
    for (const img of p.images) {
      uploaded.push(await maybeUpload(img, "products"));
    }
    const { data: product, error } = await admin
      .from("products")
      .upsert(
        {
          name: p.name,
          slug: p.slug,
          description: p.description,
          category_id: categoryIds[p.category],
          price: p.price,
          discount_price: p.discount,
          sku: p.sku,
          stock: p.stock,
          sizes: p.sizes,
          colors: p.colors,
          designs: p.designs,
          material: p.material,
          dimensions: p.dimensions,
          care_instructions: p.care,
          whats_included: p.included,
          delivery_information: "Packed with care and delivered across Cameroon. Tracking available after dispatch.",
          featured: p.featured,
          status: "published",
          average_rating: 4.6 + Math.random() * 0.3,
          review_count: 8 + Math.floor(Math.random() * 20),
          seo_title: `${p.name} | Jimmy Home Textile`,
          seo_description: p.description,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();
    if (error) throw error;

    await admin.from("product_images").delete().eq("product_id", product.id);
    const { error: imgErr } = await admin.from("product_images").insert(
      uploaded.map((image_url, position) => ({
        product_id: product.id,
        image_url,
        alt_text: p.name,
        position,
      }))
    );
    if (imgErr) throw imgErr;
  }

  await admin.from("promotions").upsert(
    {
      heading: "New season linens",
      description: "Fresh cottons and layered textures for a calmer bedroom.",
      image_url: promo,
      button_text: "Explore bedsheets",
      button_link: "/categories/bedsheets",
      is_active: true,
      position: 0,
    },
    { onConflict: "id" }
  );

  const email = process.env.OWNER_ADMIN_EMAIL || process.env.ADMIN_SEED_EMAIL || "modestwilton@gmail.com";
  const { data: existing } = await admin.auth.admin.listUsers();
  const found = existing.users.find((u) => (u.email || "").toLowerCase() === email.toLowerCase());
  let userId = found?.id;
  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: "Modest Wilton" },
    });
    if (error) throw error;
    userId = data.user.id;
  } else {
    await admin.auth.admin.updateUserById(userId, { email_confirm: true });
  }
  await admin.from("profiles").upsert({
    id: userId,
    email,
    full_name: "Modest Wilton",
    phone: "+237 6 00 00 00 00",
    role: "admin",
  });

  console.log("Seed complete.");
  console.log("Admin login (OTP, no password):", email);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
