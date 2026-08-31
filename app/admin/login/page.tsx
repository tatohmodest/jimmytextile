"use client";

import { OtpSignIn } from "@/components/auth/OtpSignIn";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-forest px-4 text-ivory">
      <div className="w-full max-w-md bg-ivory p-8 text-ink">
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">Jimmy Home Textile</p>
        <h1 className="font-display mt-2 text-4xl">Atelier login</h1>
        <p className="mt-2 text-sm text-mute">
          Passwordless access. Enter your email and we will send a one-time sign-in code.
        </p>
        <OtpSignIn mode="login" next="/admin" hideAltLink />
      </div>
    </div>
  );
}
