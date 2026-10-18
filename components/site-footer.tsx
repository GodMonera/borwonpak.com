import Link from "next/link";
import { site } from "@/content/site";
import { t, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {copy.footer.rights} ·{" "}
          <a className="hover:text-marigold" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
        <nav className="flex flex-wrap items-center gap-4">
          <a
            className="hover:text-marigold"
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          <Link className="hover:text-marigold" href={`/${locale}/cv`}>
            {copy.nav.cv}
          </Link>
          <Link className="hover:text-marigold" href={`/${locale}/guestbook`}>
            {copy.nav.guestbook}
          </Link>
          <a className="hover:text-marigold" href="/feed.xml">
            RSS
          </a>
        </nav>
      </div>
    </footer>
  );
}
