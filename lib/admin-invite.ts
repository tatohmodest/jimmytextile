import { addAdminEmail, normalizeEmail } from "@/lib/admins";
import { sendAdminInviteEmail } from "@/lib/mailer";
import { ensureAuthUser, findAuthUserByEmail, issueEmailOtp } from "@/lib/otp";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { publicSiteUrl } from "@/lib/utils";

export async function inviteAdmin(email: string) {
  const { email: normalized } = await addAdminEmail(email);
  const user = await ensureAuthUser(normalized);
  const admin = createSupabaseAdminClient();
  const { error: profileError } = await admin.from("profiles").upsert({
    id: user.id,
    email: normalized,
    full_name: (user.user_metadata?.full_name as string) || "",
    phone: (user.user_metadata?.phone as string) || "",
    role: "admin",
  });
  if (profileError) throw profileError;

  const confirmed = await findAuthUserByEmail(normalized);
  if (confirmed && !confirmed.email_confirmed_at) {
    await admin.auth.admin.updateUserById(confirmed.id, { email_confirm: true });
  }

  const loginUrl = `${publicSiteUrl()}/admin/login?email=${encodeURIComponent(normalized)}`;
  let mailError: string | null = null;
  try {
    const code = await issueEmailOtp(normalized);
    await sendAdminInviteEmail(normalized, { code, loginUrl });
  } catch (error) {
    mailError = error instanceof Error ? error.message : "Could not send the invitation email";
  }

  return { email: normalized, mailError };
}
