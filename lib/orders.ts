import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapPayunitStatus } from "@/lib/payunit";
import type { CartItem, PaymentStatus } from "@/types";

export function computeTotals(
  items: { price: number; quantity: number }[],
  deliveryFee: number,
  discount = 0
) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + deliveryFee - discount);
  return { subtotal, deliveryFee, discount, total };
}

export async function createOrderRecord(input: {
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  city: string;
  region: string;
  deliveryInstructions?: string;
  items: CartItem[];
  deliveryFee: number;
  discount?: number;
}) {
  const admin = createSupabaseAdminClient();
  const { data: orderNumber } = await admin.rpc("generate_order_number");
  const number =
    (typeof orderNumber === "string" && orderNumber) ||
    `JHT-${new Date().getUTCFullYear()}-${Date.now().toString().slice(-6)}`;

  const { subtotal, deliveryFee, discount, total } = computeTotals(
    input.items.map((i) => ({ price: i.price, quantity: i.quantity })),
    input.deliveryFee,
    input.discount || 0
  );

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      order_number: number,
      user_id: input.userId || null,
      guest_email: input.userId ? null : input.customerEmail,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail,
      delivery_address: input.deliveryAddress,
      city: input.city,
      region: input.region,
      delivery_instructions: input.deliveryInstructions || null,
      subtotal,
      delivery_fee: deliveryFee,
      discount,
      total,
      payment_status: "pending",
      order_status: "pending_payment",
    })
    .select("*")
    .single();

  if (error || !order) {
    throw new Error(error?.message || "Unable to create order");
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      sku: item.sku || null,
      quantity: item.quantity,
      unit_price: item.price,
      variant: item.variant,
    }))
  );
  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    throw new Error(itemsError.message);
  }

  return { order, total };
}

export async function attachPayment(orderId: string, reference: string, amount: number) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("payments")
    .insert({
      order_id: orderId,
      transaction_reference: reference,
      provider: "payunit",
      amount,
      currency: "XAF",
      status: "pending",
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Unable to record payment");
  return data;
}

export async function fulfillSuccessfulPayment(orderId: string, paymentStatus: PaymentStatus, gateway?: unknown) {
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();
  if (!order) return;

  if (order.payment_status === "success") return order;

  if (paymentStatus === "success") {
    const { data: current } = await admin.from("orders").select("payment_status").eq("id", orderId).single();
    if (current?.payment_status === "success") return order;

    await admin
      .from("orders")
      .update({
        payment_status: "success",
        order_status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .neq("payment_status", "success");

    for (const item of order.order_items || []) {
      if (!item.product_id) continue;
      const { data: product } = await admin
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();
      if (!product) continue;
      await admin
        .from("products")
        .update({ stock: Math.max(0, Number(product.stock) - Number(item.quantity)) })
        .eq("id", item.product_id);
    }
  } else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
    await admin
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: paymentStatus === "cancelled" ? "cancelled" : "pending_payment",
      })
      .eq("id", orderId)
      .neq("payment_status", "success");
  } else if (paymentStatus === "processing") {
    await admin
      .from("orders")
      .update({
        payment_status: "processing",
        order_status: "payment_processing",
      })
      .eq("id", orderId)
      .neq("payment_status", "success");
  }

  if (gateway) {
    await admin
      .from("payments")
      .update({ status: paymentStatus, gateway_response: gateway })
      .eq("order_id", orderId);
  }

  return order;
}

export async function applyPayunitStatus(transactionId: string, rawStatus: string, gateway?: unknown) {
  const admin = createSupabaseAdminClient();
  const { data: payment } = await admin
    .from("payments")
    .select("*")
    .eq("transaction_reference", transactionId)
    .maybeSingle();
  if (!payment) return null;

  const mapped = mapPayunitStatus(rawStatus);
  await fulfillSuccessfulPayment(payment.order_id, mapped, gateway || { transaction_status: rawStatus });
  return mapped;
}
