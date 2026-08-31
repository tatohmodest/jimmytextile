import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminEmails, normalizeEmail } from "@/lib/admins";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const adminUser = await requireAdmin();
  if (!adminUser) redirect("/admin");
  const params = await searchParams;
  const invited = typeof params.invited === "string" ? params.invited : "";
  const mailError = typeof params.mailError === "string" ? params.mailError : "";
  const error = typeof params.error === "string" ? params.error : "";
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
        Grant admin to any email. They receive a message that they are an admin, with a one-time code to sign in at /admin/login. After that, the whole atelier is open to them.
      </p>

      {invited ? (
        <p className="mt-6 max-w-xl bg-ivory p-4 text-sm text-moss">
          {invited} is an admin.
          {mailError
            ? ` The invitation email could not be sent (${mailError}). Ask them to request a code on /admin/login.`
            : " We emailed them a sign-in code and a link to the atelier login."}
        </p>
      ) : null}
      {error ? <p className="mt-6 max-w-xl text-sm text-wine">{error}</p> : null}

      <form action="/api/admin/manage" method="post" className="mt-8 grid max-w-xl gap-3 bg-ivory p-5">
        <input type="hidden" name="action" value="grant-admin-email" />
        <label className="field">
          Make this email an admin
          <input name="email" type="email" placeholder="name@example.com" required />
        </label>
        <button className="btn-primary w-fit">Grant admin and send login email</button>
      </form>

      {pending.length ? (
        <div className="mt-8">
          <h2 className="font-display text-2xl">Admin emails waiting to sign in</h2>
          <ul className="mt-3 grid gap-3 text-sm">
            {pending.map((email) => (
              <li key={email} className="flex flex-wrap items-center gap-3">
                <span>{email}</span>
                <form action="/api/admin/manage" method="post">
                  <input type="hidden" name="action" value="grant-admin-email" />
                  <input type="hidden" name="email" value={email} />
                  <button className="text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline">
                    Send login email
                  </button>
                </form>
              </li>
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
                  <div className="flex flex-wrap items-center gap-3">
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
                    {u.role === "admin" && u.email ? (
                      <form action="/api/admin/manage" method="post">
                        <input type="hidden" name="action" value="grant-admin-email" />
                        <input type="hidden" name="email" value={u.email} />
                        <button className="text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline">
                          Send login email
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
