import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import nodemailer from "nodemailer";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const email = (process.env.OWNER_ADMIN_EMAIL || "modestwilton@gmail.com").trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUser() {
  const maybe = admin.auth.admin;
  if (typeof maybe.getUserByEmail === "function") {
    const { data, error } = await maybe.getUserByEmail(email);
    if (!error && data?.user) return data.user;
  }
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  return data.users.find((u) => (u.email || "").toLowerCase() === email) || null;
}

async function sendViaSmtp(subject, text) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.resend.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_USER || "resend",
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 12000,
  });
  await transporter.sendMail({
    from: `Jimmy Home Textile <${process.env.EMAIL_FROM || process.env.SMTP_FROM}>`,
    to: email,
    subject,
    text,
  });
}

async function sendViaResendApi(subject, text) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SMTP_PASS}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Jimmy Home Textile <${process.env.EMAIL_FROM || process.env.SMTP_FROM}>`,
      to: [email],
      subject,
      text,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || json.error?.message || `Resend HTTP ${res.status}`);
  return json;
}

async function main() {
  let user = await findUser();
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: "Modest Wilton" },
    });
    if (error) throw error;
    user = data.user;
    console.log("Created admin auth user");
  } else {
    await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
    console.log("Admin auth user already exists");
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: user.id,
    email,
    full_name: "Modest Wilton",
    role: "admin",
  });
  if (profileError) console.log("Profile upsert:", profileError.message);
  else console.log("Admin profile upserted");

  const { data: settings } = await admin.from("site_settings").select("value").eq("key", "admin_emails").maybeSingle();
  const current = Array.isArray(settings?.value) ? settings.value.map((v) => String(v).toLowerCase()) : [];
  const next = [...new Set([...current, email])];
  const { error: settingsError } = await admin.from("site_settings").upsert({
    key: "admin_emails",
    value: next,
    updated_at: new Date().toISOString(),
  });
  if (settingsError) console.log("admin_emails upsert:", settingsError.message);
  else console.log("admin_emails:", next.join(", "));

  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError) {
    console.log("generateLink error:", linkError.message);
  } else {
    console.log("OTP generated, length:", (link.properties?.email_otp || "").length);
    const { error: verifyError } = await admin.auth.verifyOtp({
      email,
      token: link.properties.email_otp,
      type: "email",
    });
    console.log("verifyOtp email:", verifyError ? verifyError.message : "ok");
    if (verifyError) {
      const { error: verify2 } = await admin.auth.verifyOtp({
        email,
        token: link.properties.email_otp,
        type: "magiclink",
      });
      console.log("verifyOtp magiclink:", verify2 ? verify2.message : "ok");
    }
  }

  if (process.env.SEND_TEST_EMAIL !== "1") {
    console.log("Skipping test email (set SEND_TEST_EMAIL=1 to send)");
    return;
  }

  const subject = "Jimmy Home Textile — passwordless atelier sign-in is ready";
  const text =
    "Your atelier now signs in with a one-time email code. Go to /admin/login, enter modestwilton@gmail.com, and we will email a confirmation code. No password.";

  try {
    await sendViaSmtp(subject, text);
    console.log("SMTP send: ok");
  } catch (err) {
    console.log("SMTP send failed:", err.message);
    try {
      const json = await sendViaResendApi(subject, text);
      console.log("Resend API send: ok", json.id || "");
    } catch (err2) {
      console.log("Resend API send failed:", err2.message);
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
