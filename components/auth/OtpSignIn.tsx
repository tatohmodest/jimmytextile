"use client";

import Link from "next/link";
import { useState } from "react";

export function OtpSignIn({
  mode = "login",
  next,
  defaultEmail = "",
  initialStep,
  showRegisterFields = false,
  hideAltLink = false,
}: {
  mode?: "login" | "register";
  next: string;
  defaultEmail?: string;
  initialStep?: "email" | "code";
  showRegisterFields?: boolean;
  hideAltLink?: boolean;
}) {
  const [step, setStep] = useState<"email" | "code">(initialStep || (defaultEmail ? "code" : "email"));
  const [email, setEmail] = useState(defaultEmail);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(
    initialStep === "code" || (defaultEmail && initialStep !== "email")
      ? `Enter the one-time code sent to ${defaultEmail}. Request a new one if it has expired.`
      : null
  );
  const [loading, setLoading] = useState(false);

  async function requestCode() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        full_name: fullName || undefined,
        phone: phone || undefined,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(json.error || "Could not send the code.");
      setLoading(false);
      return;
    }
    setStep("code");
    setInfo(`We sent a sign-in code to ${email}. Check spam if it is not in your inbox.`);
    setLoading(false);
  }

  async function verifyCode() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token: code }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(json.error || "That code did not work.");
      setLoading(false);
      return;
    }
    window.location.href = next;
  }

  return (
    <form
      className="mt-8 grid gap-4"
      method="post"
      action="/api/auth/otp/request"
      onSubmit={async (event) => {
        event.preventDefault();
        if (step === "email") await requestCode();
        else await verifyCode();
      }}
    >
      {showRegisterFields && step === "email" ? (
        <>
          <label className="field">
            Full name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} name="full_name" required={mode === "register"} />
          </label>
          <label className="field">
            Phone
            <input value={phone} onChange={(e) => setPhone(e.target.value)} name="phone" />
          </label>
        </>
      ) : null}

      <label className="field">
        Email
        <input
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={step === "code"}
        />
      </label>

      {step === "code" ? (
        <label className="field">
          One-time code
          <input
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={4}
            maxLength={12}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Enter the code from your email"
          />
        </label>
      ) : null}

      {info ? <p className="text-sm text-moss">{info}</p> : null}
      {error ? <p className="text-sm text-wine">{error}</p> : null}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading
          ? "Please wait..."
          : step === "email"
            ? "Email me a code"
            : "Confirm and sign in"}
      </button>

      {step === "code" ? (
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="text-xs uppercase tracking-[0.2em] text-mute"
            disabled={loading}
            onClick={() => requestCode()}
          >
            Resend code
          </button>
          <button
            type="button"
            className="text-xs uppercase tracking-[0.2em] text-mute"
            disabled={loading}
            onClick={() => {
              setStep("email");
              setCode("");
              setInfo(null);
              setError(null);
            }}
          >
            Use a different email
          </button>
        </div>
      ) : null}

      {hideAltLink ? null : (
        <p className="text-sm text-mute">
          {mode === "login" ? (
            <>Need an account? <Link href="/register">Register</Link></>
          ) : (
            <>Already with us? <Link href="/login">Log in</Link></>
          )}
        </p>
      )}
    </form>
  );
}
