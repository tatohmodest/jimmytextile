import { NextResponse } from "next/server";
import { applyPayunitStatus } from "@/lib/orders";
import { getPayunitPaymentStatus, payunitConfigured } from "@/lib/payunit";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const data = payload.data || payload;
  const transactionId = data.transaction_id || payload.transaction_id;
  const status = data.transaction_status || payload.transaction_status;
  if (!transactionId) {
    return NextResponse.json({ error: "Missing transaction" }, { status: 400 });
  }

  let verifiedStatus = status;
  if (payunitConfigured()) {
    try {
      const verified = await getPayunitPaymentStatus(transactionId);
      verifiedStatus = verified.transaction_status;
      await applyPayunitStatus(transactionId, verifiedStatus, verified);
    } catch {
      if (status) await applyPayunitStatus(transactionId, status, payload);
    }
  } else if (status) {
    await applyPayunitStatus(transactionId, status, payload);
  }

  return NextResponse.json({ ok: true, status: verifiedStatus });
}
