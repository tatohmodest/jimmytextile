import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminEmails, normalizeEmail } from "@/lib/admins";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const adminUser = await requireAdmin();
  if (!adminUser) redirect("/admin");
  const admin = createSupabaseAdminClient();
  const [{ data: users }, adminEmails] = await Promise.all([
    admin.from("profiles").select("id, full_name, email, role, created_at").order("created_at", { ascending: false }),
    getAdminEmails(),
  ]);
  const registered = new Set((users || []).map((u) => normalizeEmail(u.email)));
  const pending = adminEmails.filter((email) => !registered.has(email));

  return (
    <div>
      <h1 className="font-display text-4xl">Users & roles</h1>
      <p className="mt-2 max-w-xl text-sm text-mute">
        Modest Wilton is the house admin. Add any email below — if they already have an account they become admin immediately; otherwise they become admin the next time they register or log in.
      </p>

      <form action="/api/admin/manage" method="post" className="mt-8 grid max-w-xl gap-3 bg-ivory p-5">
        <input type="hidden" name="action" value="grant-admin-email" />
        <label className="field">
          Make this email an admin
          <input name="email" type="email" placeholder="name@example.com" required />
        </label>
        <button className="btn-primary w-fit">Grant admin</button>
      </form>

      {pending.length ? (
        <div className="mt-8">
          <h2 className="font-display text-2xl">Admin emails waiting to sign in</h2>
          <ul className="mt-3 grid gap-1 text-sm">
            {pending.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 overflow-x-auto bg-ivory">
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
