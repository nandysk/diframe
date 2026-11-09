import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/routes";

// Sends any address without a language to the visitor's saved language,
// or to English on a first visit.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
  const locale = isLocale(saved) ? saved : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next.js internals and any file with an extension (images, icons).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
