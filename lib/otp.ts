import type { User } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail, normalizeEmail } from "@/lib/admins";

type AdminAuth = ReturnType<typeof createSupabaseAdminClient>["auth"]["admin"] & {
  getUserByEmail?: (email: string) => Promise<{
    data: { user: User | null };
    error: { message: string } | null;
  }>;
};

export async function findAuthUserByEmail(email: string): Promise<User | null> {
  const admin = createSupabaseAdminClient();
  const normalized = normalizeEmail(email);
  const maybe = admin.auth.admin as AdminAuth;

  if (typeof maybe.getUserByEmail === "function") {
    const { data, error } = await maybe.getUserByEmail(normalized);
    if (!error && data?.user) return data.user;
  }

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((user) => normalizeEmail(user.email) === normalized);
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

export async function ensureAuthUser(
  email: string,
  metadata?: { full_name?: string; phone?: string }
) {
  const admin = createSupabaseAdminClient();
  const normalized = normalizeEmail(email);
  let user = await findAuthUserByEmail(normalized);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: normalized,
      email_confirm: true,
      user_metadata: {
        full_name: metadata?.full_name || "",
        phone: metadata?.phone || "",
      },
    });
    if (error) {
      user = await findAuthUserByEmail(normalized);
      if (!user) throw error;
    } else {
      user = data.user;
    }
  } else if (metadata?.full_name || metadata?.phone) {
    await admin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
      user_metadata: {
        ...user.user_metadata,
        full_name: metadata.full_name || user.user_metadata?.full_name,
        phone: metadata.phone || user.user_metadata?.phone,
      },
    });
  }

  const role = (await isAdminEmail(normalized)) ? "admin" : "customer";
  await admin.from("profiles").upsert({
    id: user.id,
    email: normalized,
    full_name: metadata?.full_name || (user.user_metadata?.full_name as string) || "",
    phone: metadata?.phone || (user.user_metadata?.phone as string) || "",
    role,
  });

  return user;
}

export async function issueEmailOtp(email: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: normalizeEmail(email),
  });
  const otp = data?.properties?.email_otp;
  if (error || !otp) {
    throw new Error(error?.message || "Unable to create a sign-in code");
  }
  return otp;
}
