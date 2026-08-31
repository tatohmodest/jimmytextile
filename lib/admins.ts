import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const OWNER_EMAILS = [
  "littlething237@gmail.com",
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
  return normalized.startsWith("modestwilton@");
}

export async function getAdminEmails(): Promise<string[]> {
  const fromSettings = await readStoredAdminEmails();
  return [...new Set([...OWNER_EMAILS, ...fromSettings])];
}

async function readStoredAdminEmails(): Promise<string[]> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin.from("site_settings").select("value").eq("key", "admin_emails").maybeSingle();
    const value = data?.value;
    if (Array.isArray(value)) {
      return value.map((item) => normalizeEmail(String(item))).filter(Boolean);
    }
  } catch {
    // Database may not be ready yet.
  }
  return [];
}

export async function isAdminEmail(email?: string | null) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  if (isOwnerEmail(normalized)) return true;
  const list = await getAdminEmails();
  return list.includes(normalized);
}

export async function addAdminEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Enter a valid email address");
  }
  const admin = createSupabaseAdminClient();
  const current = await getAdminEmails();
  const next = [...new Set([...current, normalized])];
  const { error } = await admin.from("site_settings").upsert({
    key: "admin_emails",
    value: next,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;

  const { data: users } = await admin.auth.admin.listUsers({ perPage: 200 });
  const user = users.users.find((u) => normalizeEmail(u.email) === normalized);
  if (user) {
    await admin.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: (user.user_metadata?.full_name as string) || "",
      role: "admin",
    });
  }
  return { email: normalized, existingUser: Boolean(user) };
}
