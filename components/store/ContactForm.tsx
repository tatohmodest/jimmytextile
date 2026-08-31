"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="grid gap-4 bg-linen p-6 md:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        const fd = new FormData(e.currentTarget);
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fd.get("name"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            message: fd.get("message"),
          }),
        });
        const json = await res.json();
        setLoading(false);
        setStatus(json.error || "Thank you. We will be in touch shortly.");
        if (res.ok) e.currentTarget.reset();
      }}
    >
      <label className="field">
        Name
        <input name="name" required />
      </label>
      <label className="field">
        Email
        <input name="email" type="email" required />
      </label>
      <label className="field">
        Phone
        <input name="phone" />
      </label>
      <label className="field">
        Message
        <textarea name="message" rows={5} required />
      </label>
      <button className="btn-primary" disabled={loading}>
        {loading ? "Sending..." : "Send message"}
      </button>
      {status ? <p className="text-sm text-mute">{status}</p> : null}
    </form>
  );
}
