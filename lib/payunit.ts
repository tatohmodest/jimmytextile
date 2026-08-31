const BASE_URL = process.env.PAYUNIT_BASE_URL || "https://gateway.payunit.net";

function payunitConfigured() {
  return Boolean(
    process.env.PAYUNIT_API_KEY &&
      process.env.PAYUNIT_API_USER &&
      process.env.PAYUNIT_API_PASSWORD
  );
}

function authHeader() {
  const token = Buffer.from(
    `${process.env.PAYUNIT_API_USER}:${process.env.PAYUNIT_API_PASSWORD}`
  ).toString("base64");
  return `Basic ${token}`;
}

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: authHeader(),
    "x-api-key": process.env.PAYUNIT_API_KEY || "",
    mode: process.env.PAYUNIT_MODE || "test",
  };
}

export type PayunitInitResult = {
  transaction_id: string;
  transaction_url: string;
  providers?: unknown[];
};

export async function initializePayunitPayment(input: {
  amount: number;
  transactionId: string;
  returnUrl: string;
  notifyUrl: string;
}) {
  if (!payunitConfigured()) {
    throw new Error("PayUnit credentials are not configured on the server");
  }

  const res = await fetch(`${BASE_URL}/api/gateway/initialize`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      total_amount: Math.round(input.amount),
      currency: "XAF",
      transaction_id: input.transactionId,
      return_url: input.returnUrl,
      notify_url: input.notifyUrl,
      payment_country: "CM",
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status !== "SUCCESS") {
    throw new Error(json.message || "Unable to initialize PayUnit payment");
  }

  return json.data as PayunitInitResult;
}

export async function getPayunitPaymentStatus(transactionId: string) {
  if (!payunitConfigured()) {
    throw new Error("PayUnit credentials are not configured on the server");
  }

  const res = await fetch(
    `${BASE_URL}/api/gateway/paymentstatus/${encodeURIComponent(transactionId)}`,
    { method: "GET", headers: headers() }
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || "Unable to verify PayUnit payment");
  }
  return json.data as {
    transaction_amount: number;
    transaction_status: "PENDING" | "FAILED" | "CANCELLED" | "SUCCESS" | "INITIATE";
    transaction_id: string;
    transaction_currency: string;
    transaction_gateway: string | null;
    message?: string;
  };
}

export function mapPayunitStatus(
  status?: string
): "pending" | "processing" | "success" | "failed" | "cancelled" {
  switch ((status || "").toUpperCase()) {
    case "SUCCESS":
      return "success";
    case "FAILED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    case "PENDING":
    case "INITIATE":
      return "processing";
    default:
      return "pending";
  }
}

export { payunitConfigured };
