import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const adminUser = await requireAdmin();
  if (!adminUser) redirect("/admin");
  const admin = createSupabaseAdminClient();
  const { data: users } = await admin.from("profiles").select("id, full_name, email, role, created_at").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-4xl">Users & roles</h1>
      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.16em] text-mute">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u) => (
              <tr key={u.id} className="border-t border-ink/10">
                <td className="p-3">{u.full_name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="p-3">
                  <form action="/api/admin/manage" method="post" className="flex gap-2">
                    <input type="hidden" name="action" value="role" />
                    <input type="hidden" name="id" value={u.id} />
                    <select name="role" defaultValue={u.role}>
                      <option value="customer">customer</option>
                      <option value="staff">staff</option>
                      <option value="admin">admin</option>
                    </select>
                    <button className="btn-outline px-3">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
