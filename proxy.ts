import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

const ADMIN_PREFIX = "admin.";

/**
 * Two jobs:
 *   1. admin.<domain> serves the private dashboard that lives at /admin.
 *   2. "/" sends the visitor to whichever locale their browser asked for.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  if (host.startsWith(ADMIN_PREFIX)) {
    // The dashboard's own redirects point at /admin/..., which on this host
    // would surface as admin.borwonpak.com/admin/login. Normalise the visible
    // URL by stripping the prefix, then rewrite it back internally below.
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      const clean = req.nextUrl.clone();
      clean.pathname = pathname.slice("/admin".length) || "/";
      return NextResponse.redirect(clean);
    }
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/admin" : `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

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
  // Everything except Next's own assets and the files served from /public.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)"],
};

export const supportedLocales = locales;
