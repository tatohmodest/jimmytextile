"use client";

import { OtpSignIn } from "@/components/auth/OtpSignIn";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  return <OtpSignIn mode={mode} next={next} showRegisterFields={mode === "register"} />;
}
