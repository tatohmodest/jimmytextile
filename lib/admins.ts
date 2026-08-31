import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const OWNER_EMAILS = [
  "modestwilton@gmail.com",
  process.env.OWNER_ADMIN_EMAIL || "",
]
  .map(normalizeEmail)
  .filter(Boolean);

export function normalizeEmail(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

export function isOwnerEmail(email?: string | null) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  if (OWNER_EMAILS.includes(normalized)) return true;
  return normalized === "modestwilton@gmail.com" || normalized.startsWith("modestwilton@");
}

export async function getAdminEmails(): Promise<string[]> {
  const fromSettings = await readStoredAdminEmails();
  return [...new Set([...OWNER_EMAILS, ...fromSettings])];
}

function parseEmailList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeEmail(String(item))).filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      return parseEmailList(JSON.parse(value));
    } catch {
      return value
        .split(/[\s,;]+/)
        .map((item) => normalizeEmail(item))
        .filter(Boolean);
    }
  }
  if (value && typeof value === "object") {
    const maybe = value as { emails?: unknown };
    if (Array.isArray(maybe.emails)) return parseEmailList(maybe.emails);
  }
  return [];
}

async function readStoredAdminEmails(): Promise<string[]> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin.from("site_settings").select("value").eq("key", "admin_emails").maybeSingle();
    return parseEmailList(data?.value);
  } catch {
    return [];
  }
}

export async function isAdminEmail(email?: string | null) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  if (isOwnerEmail(normalized)) return true;
  const list = await getAdminEmails();
  return list.includes(normalized);
}

async function writeAdminEmails(emails: string[]) {
  const admin = createSupabaseAdminClient();
  const next = [...new Set([...OWNER_EMAILS, ...emails.map(normalizeEmail).filter(Boolean)])];
  const { error } = await admin.from("site_settings").upsert({
    key: "admin_emails",
    value: next,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  return next;
}

export async function addAdminEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Enter a valid email address");
  }
  const current = await getAdminEmails();
  await writeAdminEmails([...current, normalized]);
  return { email: normalized };
}

export async function removeAdminEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized || isOwnerEmail(normalized)) return;
  const current = await getAdminEmails();
  await writeAdminEmails(current.filter((item) => item !== normalized));
}
