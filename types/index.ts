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
  image: string;
  price: number;
  quantity: number;
  stock: number;
  sku?: string | null;
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
  description: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

export type AboutContent = {
  heading: string;
  body: string;
  story: string;
  mission: string;
  image_url: string;
  extra_images: string[];
};

export type ContactContent = {
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  hours: string;
};

export type BrandContent = {
  name: string;
  tagline: string;
  logo_url: string;
};

export type DeliverySettings = {
  fee: number;
  free_over: number;
  info: string;
};

export type HomepageSection = {
  id: string;
  enabled: boolean;
  position: number;
};

export type SiteContent = {
  brand: BrandContent;
  hero: HeroContent;
  promo: {
    image_url: string;
    heading: string;
    description: string;
    button_text: string;
    button_link: string;
    enabled: boolean;
  };
  features: FeatureItem[];
  about: AboutContent;
  contact: ContactContent;
  delivery: DeliverySettings;
  homepage_sections: HomepageSection[];
  seo: {
    title: string;
    description: string;
    og_image: string;
  };
};
