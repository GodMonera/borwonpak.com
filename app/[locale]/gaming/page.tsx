import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { gaming } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { AccentBar, PageHeader } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.gaming.title, description: copy.gaming.sub };
}

export default async function GamingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);

  return (
    <>
      <PageHeader title={copy.gaming.title} sub={copy.gaming.sub} />
      <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
        {gaming.map((item) => (
          <article
            key={item.game}
            className="rounded-lg border border-line bg-card p-5"
          >
            <AccentBar accent={item.accent} />
            <h2 className="mt-3 text-lg font-semibold tracking-tight">
              {item.game}
            </h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              {item.role[locale]}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {item.takeaway[locale]}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
