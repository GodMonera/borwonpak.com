import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

/** Send "/" to the visitor's best-matching locale; everything else passes through. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname !== "/") return NextResponse.next();

  const accept = req.headers.get("accept-language") ?? "";
  const preferred = accept
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())
    .find((code) => isLocale(code));

  const url = req.nextUrl.clone();
  url.pathname = `/${preferred ?? defaultLocale}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};

export const supportedLocales = locales;
