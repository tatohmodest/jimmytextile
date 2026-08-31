"use client";

import Link from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mt-8 grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email"));
        const password = String(fd.get("password"));
        const supabase = createSupabaseBrowserClient();
        if (mode === "register") {
          const { error: err } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: String(fd.get("full_name") || ""),
                phone: String(fd.get("phone") || ""),
              },
            },
          });
          if (err) {
            setError(err.message);
            setLoading(false);
            return;
          }
        } else {
          const { error: err } = await supabase.auth.signInWithPassword({ email, password });
          if (err) {
            setError(err.message);
            setLoading(false);
            return;
          }
        }
        window.location.href = next;
      }}
    >
      {mode === "register" ? (
        <>
          <label className="field">Full name<input name="full_name" required /></label>
          <label className="field">Phone<input name="phone" /></label>
        </>
      ) : null}
      <label className="field">Email<input name="email" type="email" required /></label>
      <label className="field">Password<input name="password" type="password" minLength={6} required /></label>
      {error ? <p className="text-sm text-wine">{error}</p> : null}
      <button className="btn-primary" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
      </button>
      <p className="text-sm text-mute">
        {mode === "login" ? (
          <>Need an account? <Link href="/register">Register</Link></>
        ) : (
          <>Already with us? <Link href="/login">Log in</Link></>
        )}
      </p>
    </form>
  );
}
