export type UserRole = "admin" | "staff" | "customer";
export type ProductStatus = "draft" | "published" | "archived";
export type OrderStatus =
  | "pending_payment"
  | "payment_processing"
  | "paid"
  | "processing"
  | "ready_for_delivery"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentStatus = "pending" | "processing" | "success" | "failed" | "cancelled" | "refunded";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  instructions: string | null;
  is_default: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  position: number;
  is_featured: boolean;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  name_fr?: string | null;
  description_fr?: string | null;
};

export type PriceTier = {
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
};

export type ProductColor = { name: string; hex: string };

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  public_id: string | null;
  alt_text: string | null;
  position: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price: number;
  discount_price: number | null;
  sku: string | null;
  stock: number;
  sizes: string[];
  colors: ProductColor[];
  designs: string[];
  material: string | null;
  dimensions: string | null;
  care_instructions: string | null;
  whats_included: string | null;
  delivery_information: string | null;
  featured: boolean;
  status: ProductStatus;
  average_rating: number;
  review_count: number;
  seo_title: string | null;
  seo_description: string | null;
  name_fr?: string | null;
  description_fr?: string | null;
  whats_included_fr?: string | null;
  price_tiers?: PriceTier[];
  image_alts?: string[];
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
  product_images?: ProductImage[];
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  name_fr?: string | null;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  sku?: string | null;
  price_tiers?: PriceTier[];
  discount_price?: number | null;
  base_price?: number;
  variant: {
    size?: string;
    color?: string;
    design?: string;
  };
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  sku: string | null;
  quantity: number;
  unit_price: number;
  variant: CartItem["variant"];
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  city: string;
  region: string;
  delivery_instructions: string | null;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  order_items?: OrderItem[];
  payments?: Payment[];
};

export type Payment = {
  id: string;
  order_id: string;
  transaction_reference: string;
  provider: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway_response: Record<string, unknown> | null;
  created_at: string;
};

export type Promotion = {
  id: string;
  heading: string;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
  position: number;
};

export type HeroContent = {
  image_url: string;
  heading: string;
  heading_fr?: string;
  description: string;
  description_fr?: string;
  primary_button_text: string;
  primary_button_text_fr?: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_text_fr?: string;
  secondary_button_link: string;
};

export type FeatureItem = {
  title: string;
  title_fr?: string;
  description: string;
  description_fr?: string;
  icon: string;
};

export type AboutContent = {
  heading: string;
  heading_fr?: string;
  body: string;
  body_fr?: string;
  story: string;
  story_fr?: string;
  mission: string;
  mission_fr?: string;
  image_url: string;
  extra_images: string[];
};

export type ContactContent = {
  phone: string;
  phone_secondary?: string;
  email: string;
  address: string;
  city: string;
  region: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  hours: string;
  hours_fr?: string;
};

export type BrandContent = {
  name: string;
  tagline: string;
  tagline_fr?: string;
  logo_url: string;
};

export type DeliverySettings = {
  fee: number;
  free_over: number;
  info: string;
  info_fr?: string;
};

export type HomepageSection = {
  id: string;
  enabled: boolean;
  position: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  poster_url: string;
  public_id: string;
  published: boolean;
  position: number;
};

export type GalleryContent = {
  heading: string;
  heading_fr?: string;
  intro: string;
  intro_fr?: string;
  items: GalleryItem[];
};

export type SiteContent = {
  brand: BrandContent;
  hero: HeroContent;
  promo: {
    image_url: string;
    heading: string;
    heading_fr?: string;
    description: string;
    description_fr?: string;
    button_text: string;
    button_text_fr?: string;
    button_link: string;
    enabled: boolean;
  };
  features: FeatureItem[];
  about: AboutContent;
  contact: ContactContent;
  delivery: DeliverySettings;
  homepage_sections: HomepageSection[];
  gallery: GalleryContent;
  seo: {
    title: string;
    description: string;
    og_image: string;
  };
};
