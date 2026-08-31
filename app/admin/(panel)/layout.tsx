import { AdminFrame } from "@/components/admin/AdminFrame";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminFrame>{children}</AdminFrame>;
}
