import { NextResponse } from "next/server";
import { applyPayunitStatus } from "@/lib/orders";
import { getPayunitPaymentStatus, payunitConfigured } from "@/lib/payunit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transaction_id") || searchParams.get("transactionId");
  if (!transactionId) {
    return NextResponse.json({ error: "Missing transaction_id" }, { status: 400 });
  }
  if (!payunitConfigured()) {
    return NextResponse.json({ error: "PayUnit is not configured" }, { status: 400 });
  }
  const verified = await getPayunitPaymentStatus(transactionId);
  const mapped = await applyPayunitStatus(transactionId, verified.transaction_status, verified);
  return NextResponse.json({ status: mapped, gateway: verified });
}
