# Jimmy Home Textile

Premium Next.js e-commerce + CMS for **Jimmy Home Textile**.

The storefront is editorial and photography-led. The `/admin` atelier lets the owner publish products, swap hero images, reorder homepage sections, process orders and manage inventory without touching code.

## Stack

- Next.js 16 App Router
- Supabase (Postgres, Auth, RLS)
- Cloudinary (image uploads)
- PayUnit (Cameroon payments, server-side verification)

## First-time setup

1. Copy `.env.example` to `.env.local` and fill in keys.
2. In the [Supabase SQL editor](https://supabase.com/dashboard/project/wyfvtctaaknfzzsjrxvw/sql), paste and run `supabase/schema.sql`.
3. Seed catalog, CMS copy and the admin user:

```bash
npm install
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

### Admin login (after seed)

- URL: `/admin/login`
- Email: `admin@jimmyhometextile.com`
- Password: the `ADMIN_SEED_PASSWORD` you set in `.env.local`

Change this password after first login.

### PayUnit

Add these **server-only** variables. Never expose them in the browser.

```
PAYUNIT_API_KEY=
PAYUNIT_API_USER=
PAYUNIT_API_PASSWORD=
PAYUNIT_MODE=test
```

Orders are created as `pending_payment`. They become `paid` only after PayUnit webhook/status verification.

Set `NEXT_PUBLIC_SITE_URL` to your public HTTPS domain so PayUnit `return_url` and `notify_url` work.

Webhook path: `/api/payments/payunit/webhook`

## CMS

From `/admin` the owner can:

- Upload / reorder product photography
- Create categories and featured collections
- Edit homepage hero, promo banner, why-choose cards and section order
- Change logo, WhatsApp, Facebook, address and delivery fees
- Process orders and inventory

## Scripts

- `npm run dev` — local server
- `npm run build` — production build
- `npm run db:seed` — catalog + admin user
