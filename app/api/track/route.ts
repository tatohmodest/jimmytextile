import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/queries";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  orderNumber: z.string().min(6).max(40),
  contact: z.string().max(120).optional().nullable(),
});

export async function POST(request: Request) {
  if (!rateLimit(`track:${clientIp(request)}`, 10, 60_000).ok) {
    return NextResponse.json({ error: "Too many lookups." }, { status: 429 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid order number." }, { status: 400 });
  }
  const order = await getOrderByNumber(parsed.data.orderNumber.trim().toUpperCase(), parsed.data.contact || undefined);
  if (!order) return NextResponse.json({ error: "We could not find that order." }, { status: 404 });
  return NextResponse.json({ order });
}
