import { redirect } from "next/navigation";
import { getCurrentProfile, isStaff } from "@/lib/auth";
import { AdminShell } from "./AdminShell";

export async function AdminFrame({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile || !isStaff(profile.role)) {
    redirect("/admin/login");
  }
  return <AdminShell profile={profile}>{children}</AdminShell>;
}
