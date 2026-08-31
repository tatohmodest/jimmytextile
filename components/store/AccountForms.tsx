"use client";

import { useState } from "react";
import type { Address, Profile } from "@/types";

export function AccountForms({ profile, addresses }: { profile: Profile; addresses: Address[] }) {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mt-10 grid gap-10 md:grid-cols-2">
      <form
        className="grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const res = await fetch("/api/account/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: fd.get("full_name"),
              phone: fd.get("phone"),
            }),
          });
          setMsg(res.ok ? "Profile updated" : "Could not update profile");
        }}
      >
        <h2 className="font-display text-3xl">Profile</h2>
        <label className="field">Full name<input name="full_name" defaultValue={profile.full_name || ""} /></label>
        <label className="field">Phone<input name="phone" defaultValue={profile.phone || ""} /></label>
        <label className="field">Email<input defaultValue={profile.email || ""} disabled /></label>
        <button className="btn-primary w-fit">Save profile</button>
      </form>
      <form
        className="grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const res = await fetch("/api/account/address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: fd.get("full_name"),
              phone: fd.get("phone"),
              address: fd.get("address"),
              city: fd.get("city"),
              region: fd.get("region"),
              instructions: fd.get("instructions"),
            }),
          });
          setMsg(res.ok ? "Delivery information saved" : "Could not save address");
        }}
      >
        <h2 className="font-display text-3xl">Delivery information</h2>
        <label className="field">Name<input name="full_name" defaultValue={addresses[0]?.full_name || profile.full_name || ""} required /></label>
        <label className="field">Phone<input name="phone" defaultValue={addresses[0]?.phone || profile.phone || ""} required /></label>
        <label className="field">Address<textarea name="address" defaultValue={addresses[0]?.address || ""} required /></label>
        <label className="field">City<input name="city" defaultValue={addresses[0]?.city || ""} required /></label>
        <label className="field">Region<input name="region" defaultValue={addresses[0]?.region || ""} required /></label>
        <label className="field">Instructions<textarea name="instructions" defaultValue={addresses[0]?.instructions || ""} /></label>
        <button className="btn-outline w-fit">Save address</button>
      </form>
      {msg ? <p className="text-sm text-mute md:col-span-2">{msg}</p> : null}
      <form action="/api/auth/signout" method="post">
        <button className="text-xs uppercase tracking-[0.2em] text-mute">Log out</button>
      </form>
    </div>
  );
}
