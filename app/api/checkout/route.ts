import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth";
import { attachPayment, createOrderRecord } from "@/lib/orders";
import { initializePayunitPayment, payunitConfigured } from "@/lib/payunit";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/utils";
import { mergeContent } from "@/lib/content";

const itemSchema = z.object({
  productId: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  stock: z.number().int(),
  sku: z.string().nullish(),
  variant: z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    design: z.string().optional(),
  }),
});

const schema = z.object({
  customerName: z.string().min(2).max(120),
  customerPhone: z.string().min(6).max(40),
  customerEmail: z.string().email(),
  deliveryAddress: z.string().min(4).max(400),
  city: z.string().min(2).max(80),
  region: z.string().min(2).max(80),
  deliveryInstructions: z.string().max(400).optional().nullable(),
  items: z.array(itemSchema).min(1),
});

export async function POST(request: Request) {
  const limited = rateLimit(`checkout:${clientIp(request)}`, 6, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many checkout attempts. Please wait a moment." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the delivery details carefully." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const profile = await getCurrentProfile();

  const ids = parsed.data.items.map((i) => i.productId);
  const { data: products } = await admin
    .from("products")
    .select("id, name, slug, price, discount_price, stock, sku, status, deleted_at, product_images(image_url, position)")
    .in("id", ids);

  const byId = new Map((products || []).map((p) => [p.id, p]));
  const sanitized = [];
  for (const item of parsed.data.items) {
    const product = byId.get(item.productId);
    if (!product || product.status !== "published" || product.deleted_at) {
      return NextResponse.json({ error: `${item.name} is no longer available.` }, { status: 400 });
    }
    if (Number(product.stock) < item.quantity) {
      return NextResponse.json({ error: `${product.name} does not have enough stock.` }, { status: 400 });
    }
    const disc = product.discount_price ? Number(product.discount_price) : 0;
    const unit = disc > 0 && disc < Number(product.price) ? disc : Number(product.price);
    const images = [...(product.product_images || [])].sort((a, b) => a.position - b.position);
    sanitized.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0]?.image_url || item.image,
      price: unit,
      quantity: item.quantity,
      stock: Number(product.stock),
      sku: product.sku,
      variant: item.variant,
    });
  }

  const { data: settings } = await admin.from("site_settings").select("key, value");
  const map: Record<string, unknown> = {};
  for (const row of settings || []) map[row.key] = row.value;
  const content = mergeContent(map);
  const subtotal = sanitized.reduce((n, i) => n + i.price * i.quantity, 0);
  const deliveryFee = content.delivery.free_over > 0 && subtotal >= content.delivery.free_over ? 0 : content.delivery.fee;

  const { order, total } = await createOrderRecord({
    userId: profile?.id,
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    customerEmail: parsed.data.customerEmail,
    deliveryAddress: parsed.data.deliveryAddress,
    city: parsed.data.city,
    region: parsed.data.region,
    deliveryInstructions: parsed.data.deliveryInstructions || undefined,
    items: sanitized,
    deliveryFee,
  });

  const origin = siteUrl();
  const returnUrl = `${origin}/order/confirmation/${order.order_number}`;
  const notifyUrl = `${origin}/api/payments/payunit/webhook`;
  const transactionId = `JHT${order.order_number.replace(/[^A-Za-z0-9]/g, "")}${Date.now().toString().slice(-4)}`.slice(0, 40);

  if (payunitConfigured()) {
    try {
      const payment = await initializePayunitPayment({
        amount: total,
        transactionId,
        returnUrl,
        notifyUrl,
      });
      await attachPayment(order.id, payment.transaction_id || transactionId, total);
      await admin
        .from("orders")
        .update({ order_status: "payment_processing", payment_status: "processing" })
        .eq("id", order.id);
      return NextResponse.json({
        orderNumber: order.order_number,
        paymentUrl: payment.transaction_url,
      });
    } catch (err) {
      await attachPayment(order.id, transactionId, total);
      return NextResponse.json({
        orderNumber: order.order_number,
        redirect: `/order/confirmation/${order.order_number}`,
        error: err instanceof Error ? err.message : "PayUnit initialization failed",
      });
    }
  }

  await attachPayment(order.id, transactionId, total);
  return NextResponse.json({
    orderNumber: order.order_number,
    redirect: `/order/confirmation/${order.order_number}`,
  });
}
