import Link from "next/link";
import { site } from "@/content/site";
import { t, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const year = new Date().getFullYear();

  const links = [
    { label: "GitHub", href: site.github, external: true },
    { label: copy.nav.cv, href: `/${locale}/cv` },
    { label: copy.nav.guestbook, href: `/${locale}/guestbook` },
    { label: "RSS", href: "/feed.xml" },
  ];

  return (
    <footer className="mt-24 border-t border-line">
      <div className="grid sm:grid-cols-4">
        {links.map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="border-b border-r border-line px-5 py-5 text-muted transition hover:bg-panel hover:text-marigold"
            >
              <span className="hud">{link.label} ↗</span>
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="border-b border-r border-line px-5 py-5 text-muted transition hover:bg-panel hover:text-marigold"
            >
              <span className="hud">{link.label}</span>
            </Link>
          ),
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6">
        <p className="hud text-muted">
          © {year} {copy.footer.rights}
        </p>
        <a
          href={`mailto:${site.email}`}
          className="hud text-muted transition hover:text-marigold"
        >
          {site.email}
        </a>
      </div>
    </footer>
  );
}
