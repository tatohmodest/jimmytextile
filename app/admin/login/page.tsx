"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-forest px-4 text-ivory">
      <form
        className="w-full max-w-md bg-ivory p-8 text-ink"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          const fd = new FormData(e.currentTarget);
          const supabase = createSupabaseBrowserClient();
          const { error: err } = await supabase.auth.signInWithPassword({
            email: String(fd.get("email")),
            password: String(fd.get("password")),
          });
          if (err) {
            setError(err.message);
            setLoading(false);
            return;
          }
          window.location.href = "/admin";
        }}
      >
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Jimmy Home Textile</p>
        <h1 className="font-display mt-2 text-4xl">Atelier login</h1>
        <p className="mt-2 text-sm text-mute">Staff and admin access only. Modest Wilton is the owner admin.</p>
        <label className="field mt-8">Email<input name="email" type="email" defaultValue="littlething237@gmail.com" required /></label>
        <label className="field mt-4">Password<input name="password" type="password" required /></label>
        {error ? <p className="mt-3 text-sm text-wine">{error}</p> : null}
        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? "Signing in..." : "Enter dashboard"}
        </button>
        <p className="mt-4 text-sm text-mute">
          First time? <a href="/register">Create an account</a> with your email, then sign in here.
        </p>
      </form>
    </div>
  );
}
