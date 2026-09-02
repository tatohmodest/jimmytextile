import { NextResponse, type NextRequest } from "next/server";
import { detectLocale, LOCALE_COOKIE } from "@/lib/i18n/locale";

export function middleware(request: NextRequest) {
  if (request.cookies.get(LOCALE_COOKIE)?.value) {
    return NextResponse.next();
  }
  const locale = detectLocale(request.headers.get("accept-language"));
  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|api/auth|api/admin).*)"],
};
