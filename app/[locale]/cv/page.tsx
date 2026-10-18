import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cv, site } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PrintButton } from "@/components/print-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.cv.title, description: copy.cv.sub };
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);

  return (
    <div className="max-w-3xl">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === "th" ? site.nameTh : site.name}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {site.location[locale]} · {site.email} · {site.phone}
          </p>
          <p className="mt-1 text-sm text-muted">
            {site.github} · {site.url}
          </p>
        </div>
        <PrintButton label={copy.cv.print} />
      </header>

      <section className="mt-8">
        <p className="leading-relaxed text-muted">{cv.summary[locale]}</p>
      </section>

      <Block title={locale === "th" ? "ประสบการณ์" : "Experience"}>
        {cv.experience.map((item) => (
          <article key={item.org} className="mb-7 last:mb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">{item.org}</h3>
              <span className="font-mono text-xs text-muted">
                {item.period}
              </span>
            </div>
            <p className="text-sm text-teal">
              {item.title[locale]} · {item.place[locale]}
            </p>
            <ul className="mt-2 space-y-1.5">
              {item.points[locale].map((point, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span aria-hidden className="text-marigold">
                    ▸
                  </span>
                  <span className="text-muted">{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </Block>

      <Block title={locale === "th" ? "การศึกษา" : "Education"}>
        {cv.education.map((item) => (
          <article key={item.org} className="mb-5 last:mb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">{item.org}</h3>
              <span className="font-mono text-xs text-muted">
                {item.period}
              </span>
            </div>
            <p className="text-sm text-teal">{item.title[locale]}</p>
            {item.note[locale] && (
              <p className="mt-1 text-sm text-muted">{item.note[locale]}</p>
            )}
          </article>
        ))}
      </Block>

      <Block title={locale === "th" ? "ทักษะ" : "Skills"}>
        <dl className="space-y-3">
          {cv.skills.map((group) => (
            <div key={group.group.en} className="sm:flex sm:gap-4">
              <dt className="shrink-0 text-sm font-medium sm:w-48">
                {group.group[locale]}
              </dt>
              <dd className="text-sm text-muted">{group.items.join(" · ")}</dd>
            </div>
          ))}
          <div className="sm:flex sm:gap-4">
            <dt className="shrink-0 text-sm font-medium sm:w-48">
              {locale === "th" ? "ภาษา" : "Spoken languages"}
            </dt>
            <dd className="text-sm text-muted">
              {cv.languages
                .map((l) => `${l.name[locale]} — ${l.level[locale]}`)
                .join(" · ")}
            </dd>
          </div>
        </dl>
      </Block>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 border-b border-line pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-marigold">
        {title}
      </h2>
      {children}
    </section>
  );
}
