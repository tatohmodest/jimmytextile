-- Jimmy Home Textile — production schema
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'staff', 'customer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.product_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum (
    'pending_payment',
    'payment_processing',
    'paid',
    'processing',
    'ready_for_delivery',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum (
    'pending',
    'processing',
    'success',
    'failed',
    'cancelled',
    'refunded'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Addresses
-- ---------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  region text not null,
  instructions text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  position integer not null default 0,
  is_featured boolean not null default true,
  is_active boolean not null default true,
  seo_title text,
  seo_description text,
  name_fr text,
  description_fr text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(12,2) not null,
  discount_price numeric(12,2),
  sku text unique,
  stock integer not null default 0,
  sizes text[] not null default '{}',
  colors jsonb not null default '[]'::jsonb,
  designs text[] not null default '{}',
  material text,
  dimensions text,
  care_instructions text,
  whats_included text,
  delivery_information text,
  featured boolean not null default false,
  status public.product_status not null default 'draft',
  average_rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  seo_title text,
  seo_description text,
  name_fr text,
  description_fr text,
  whats_included_fr text,
  price_tiers jsonb not null default '[]'::jsonb,
  image_alts jsonb not null default '[]'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_positive check (price >= 0),
  constraint products_discount_positive check (discount_price is null or discount_price >= 0)
);

alter table public.products add column if not exists name_fr text;
alter table public.products add column if not exists description_fr text;
alter table public.products add column if not exists whats_included_fr text;
alter table public.products add column if not exists price_tiers jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists image_alts jsonb not null default '[]'::jsonb;
alter table public.categories add column if not exists name_fr text;
alter table public.categories add column if not exists description_fr text;

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_featured_idx on public.products(featured) where deleted_at is null;
create index if not exists products_name_idx on public.products using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')));

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  public_id text,
  alt_text text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images(product_id, position);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  guest_email text,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  delivery_address text not null,
  city text not null,
  region text not null,
  delivery_instructions text,
  subtotal numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_status public.payment_status not null default 'pending',
  order_status public.order_status not null default 'pending_payment',
  notes text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_number_idx on public.orders(order_number);
create index if not exists orders_status_idx on public.orders(order_status);
create index if not exists orders_created_idx on public.orders(created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  variant jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  transaction_reference text not null unique,
  provider text not null default 'payunit',
  amount numeric(12,2) not null,
  currency text not null default 'XAF',
  status public.payment_status not null default 'pending',
  gateway_response jsonb,
  raw_webhook jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_order_idx on public.payments(order_id);
create index if not exists payments_ref_idx on public.payments(transaction_reference);

-- ---------------------------------------------------------------------------
-- CMS / content
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  description text,
  image_url text,
  button_text text,
  button_link text,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  public_id text,
  alt_text text,
  folder text,
  width integer,
  height integer,
  bytes integer,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.media_library add column if not exists resource_type text default 'image';
alter table public.media_library add column if not exists poster_url text;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_addresses_updated on public.addresses;
create trigger trg_addresses_updated before update on public.addresses
for each row execute function public.set_updated_at();

drop trigger if exists trg_categories_updated on public.categories;
create trigger trg_categories_updated before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists trg_payments_updated on public.payments;
create trigger trg_payments_updated before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists trg_promotions_updated on public.promotions;
create trigger trg_promotions_updated before update on public.promotions
for each row execute function public.set_updated_at();

create or replace function public.generate_order_number()
returns text language plpgsql as $$
declare
  n bigint;
begin
  n := nextval('public.order_number_seq');
  return 'JHT-' || to_char(now() at time zone 'utc', 'YYYY') || '-' || lpad(n::text, 6, '0');
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  assigned_role public.user_role := 'customer';
  listed jsonb;
begin
  select value into listed from public.site_settings where key = 'admin_emails';
  if new.email is not null and (
    lower(new.email) = 'modestwilton@gmail.com'
    or lower(new.email) like 'modestwilton@%'
    or (
      jsonb_typeof(listed) = 'array'
      and exists (
        select 1
        from jsonb_array_elements_text(listed) email
        where lower(email) = lower(new.email)
      )
    )
  ) then
    assigned_role := 'admin';
  end if;

  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    assigned_role
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
        phone = coalesce(nullif(excluded.phone, ''), public.profiles.phone),
        role = case
          when excluded.role = 'admin' then 'admin'::public.user_role
          else public.profiles.role
        end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_reviews enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.site_settings enable row level security;
alter table public.promotions enable row level security;
alter table public.media_library enable row level security;
alter table public.inquiries enable row level security;

-- Profiles
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Addresses
drop policy if exists "addresses_own" on public.addresses;
create policy "addresses_own" on public.addresses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "addresses_staff_read" on public.addresses;
create policy "addresses_staff_read" on public.addresses
  for select using (public.is_staff());

-- Public catalog
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (is_active = true or public.is_staff());

drop policy if exists "categories_staff_write" on public.categories;
create policy "categories_staff_write" on public.categories
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (
    (status = 'published' and deleted_at is null) or public.is_staff()
  );

drop policy if exists "products_staff_write" on public.products;
create policy "products_staff_write" on public.products
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and ((p.status = 'published' and p.deleted_at is null) or public.is_staff())
    )
  );

drop policy if exists "product_images_staff_write" on public.product_images;
create policy "product_images_staff_write" on public.product_images
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "reviews_public_read" on public.product_reviews;
create policy "reviews_public_read" on public.product_reviews
  for select using (true);

drop policy if exists "reviews_insert_auth" on public.product_reviews;
create policy "reviews_insert_auth" on public.product_reviews
  for insert with check (auth.uid() = user_id);

-- Orders
drop policy if exists "orders_own_read" on public.orders;
create policy "orders_own_read" on public.orders
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "orders_staff_write" on public.orders;
create policy "orders_staff_write" on public.orders
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "order_items_own_read" on public.order_items;
create policy "order_items_own_read" on public.order_items
  for select using (
    public.is_staff() or exists (
      select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_staff_write" on public.order_items;
create policy "order_items_staff_write" on public.order_items
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "payments_own_read" on public.payments;
create policy "payments_own_read" on public.payments
  for select using (
    public.is_staff() or exists (
      select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "payments_staff_write" on public.payments;
create policy "payments_staff_write" on public.payments
  for all using (public.is_staff()) with check (public.is_staff());

-- CMS public read
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select using (true);

drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "promotions_public_read" on public.promotions;
create policy "promotions_public_read" on public.promotions
  for select using (is_active = true or public.is_staff());

drop policy if exists "promotions_staff_write" on public.promotions;
create policy "promotions_staff_write" on public.promotions
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "media_staff_all" on public.media_library;
create policy "media_staff_all" on public.media_library
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "inquiries_staff_read" on public.inquiries;
create policy "inquiries_staff_read" on public.inquiries
  for select using (public.is_staff());

drop policy if exists "inquiries_insert_public" on public.inquiries;
create policy "inquiries_insert_public" on public.inquiries
  for insert with check (true);

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.product_images, public.product_reviews, public.site_settings, public.promotions to anon, authenticated;
grant insert on public.inquiries to anon, authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role, authenticated;
