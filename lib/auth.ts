import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types";

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (data) return data as Profile;
  if (error) {
    return {
      id: user.id,
      email: user.email || null,
      full_name: (user.user_metadata?.full_name as string) || null,
      phone: (user.user_metadata?.phone as string) || null,
      role: "customer",
      avatar_url: null,
      created_at: user.created_at,
    };
  }

  const admin = createSupabaseAdminClient();
  const { data: created } = await admin
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      full_name: (user.user_metadata?.full_name as string) || "",
      phone: (user.user_metadata?.phone as string) || "",
      role: "customer",
    })
    .select("*")
    .single();
  return (created as Profile) || null;
}

export function isStaff(role?: UserRole | null) {
  return role === "admin" || role === "staff";
}

export function isAdmin(role?: UserRole | null) {
  return role === "admin";
}

export async function requireStaff() {
  const profile = await getCurrentProfile();
  if (!profile || !isStaff(profile.role)) {
    return null;
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || !isAdmin(profile.role)) {
    return null;
  }
  return profile;
}
