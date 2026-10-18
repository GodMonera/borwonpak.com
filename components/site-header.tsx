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
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-marigold focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-[#08090b]"
      >
        {skipLabel}
      </a>

      <div className="flex h-16 items-stretch">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2 border-r border-line px-5 transition hover:bg-panel"
          aria-label={locale === "th" ? "หน้าแรก" : "Home"}
        >
          <span
            aria-hidden
            className="grid size-6 place-items-center border border-marigold font-display text-[11px] font-bold text-marigold"
          >
            B
          </span>
          <span className="hud hidden text-ink sm:block">borwonpak</span>
        </Link>

        <nav className="hidden items-stretch md:flex">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center border-r border-line px-4 transition hover:bg-panel ${isActive(item.href) ? "bg-panel text-marigold"
                  : "text-muted hover:text-ink"
              }`}
            >
              <span className="hud">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-stretch">
          <Link
            href={`/${locale}/ask`}
            className="hidden items-center border-l border-line px-4 text-marigold transition hover:bg-marigold hover:text-[#08090b] sm:flex"
          >
            <span className="hud">{askLabel}</span>
          </Link>

          <Link
            href={switchLocalePath(pathname, other)}
            hrefLang={other}
            className="flex items-center border-l border-line px-4 text-muted transition hover:bg-panel hover:text-marigold"
          >
            <span className="hud">{other}</span>
          </Link>

          <div className="flex items-center border-l border-line px-3">
            <ThemeToggle label={toggleThemeLabel} />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Menu"
            className="flex items-center border-l border-line px-4 text-muted transition hover:bg-panel hover:text-marigold"
          >
            <span aria-hidden className="text-sm leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div id="site-menu" className="border-t border-line bg-panel">
          <ul className="grid grid-cols-2 sm:grid-cols-4">
            {[...primary, ...secondary].map((item, i) => (
              <li key={item.href} className="border-b border-r border-line">
                <Link
                  href={item.href}
                  className={`flex items-baseline gap-2 px-5 py-4 transition hover:bg-panel-2 ${isActive(item.href) ? "text-marigold" : "text-muted hover:text-ink"
                  }`}
                >
                  <span className="hud text-line-bright">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hud">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
