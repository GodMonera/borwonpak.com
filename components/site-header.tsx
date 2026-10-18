"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { switchLocalePath, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = { href: string; label: string };

export function SiteHeader({
  locale,
  primary,
  secondary,
  askLabel,
  toggleThemeLabel,
  skipLabel,
}: {
  locale: Locale;
  primary: NavItem[];
  secondary: NavItem[];
  askLabel: string;
  toggleThemeLabel: string;
  skipLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // A navigation closes the drawer. Adjusting state during render on a changed
  // prop is React's own recommendation here — an effect would double-render.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const other: Locale = locale === "th" ? "en" : "th";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-marigold focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-[#0e1116]"
      >
        {skipLabel}
      </a>

      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-5">
        <Link
          href={`/${locale}`}
          className="group flex items-baseline gap-2 font-mono text-sm tracking-tight"
        >
          <span className="text-marigold">~/</span>
          <span className="font-semibold group-hover:text-marigold">
            borwonpak
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2.5 py-1.5 text-sm transition ${
                isActive(item.href)
                  ? "text-marigold"
                  : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href={`/${locale}/ask`}
            className="hidden rounded-md border border-marigold px-3 py-1.5 text-sm font-medium text-marigold transition hover:bg-marigold hover:text-[#0e1116] sm:inline-block"
          >
            {askLabel}
          </Link>

          <Link
            href={switchLocalePath(pathname, other)}
            hrefLang={other}
            className="rounded-md border border-line px-2.5 py-1.5 font-mono text-xs uppercase text-muted transition hover:border-marigold hover:text-marigold"
          >
            {other}
          </Link>

          <ThemeToggle label={toggleThemeLabel} />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Menu"
            className="grid size-9 place-items-center rounded-md border border-line text-muted transition hover:border-marigold hover:text-marigold"
          >
            <span aria-hidden className="text-base leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="site-menu"
          className="border-t border-line bg-paper px-5 py-4"
        >
          <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {[...primary, ...secondary].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-md py-2 text-sm transition ${
                    isActive(item.href)
                      ? "text-marigold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
