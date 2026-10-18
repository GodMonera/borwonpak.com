import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/site";
import { isLocale, locales, t, type Locale } from "@/lib/i18n";
import { AccentBar, ArrowLink, Tag } from "@/components/ui";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project || !isLocale(locale)) return {};
  return {
    title: project.title,
    description: project.tagline[locale],
    alternates: { canonical: `/${locale}/work/${slug}` },
    openGraph: { title: project.title, description: project.tagline[locale] },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const project = getProject(slug);
  if (!project) notFound();
  const copy = t(locale);

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <Link
        href={`/${locale}/work`}
        className="font-mono text-xs text-muted hover:text-brass"
      >
        ← {copy.work.title}
      </Link>

      <header className="mt-6 border-b border-line pb-8">
        <AccentBar accent={project.accent} />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          {project.tagline[locale]}
        </p>
      </header>

      <dl className="mt-8 grid gap-6 border-b border-line pb-8 sm:grid-cols-3">
        <div>
          <dt className="hud text-abalone">
            {copy.common.year}
          </dt>
          <dd className="mt-1 text-sm">{project.year}</dd>
        </div>
        <div>
          <dt className="hud text-abalone">
            {copy.common.role}
          </dt>
          <dd className="mt-1 text-sm">{project.role[locale]}</dd>
        </div>
        <div>
          <dt className="hud text-abalone">
            {copy.common.status}
          </dt>
          <dd className="mt-1 text-sm">{project.status[locale]}</dd>
        </div>
        <div className="sm:col-span-3">
          <dt className="hud text-abalone">
            {copy.common.stack}
          </dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </dd>
        </div>
      </dl>

      <div className="prose mt-10 max-w-2xl">
        {project.body[locale].map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-10 max-w-2xl border border-line bg-panel p-6">
        <h2 className="hud text-abalone">
          {copy.common.highlights}
        </h2>
        <ul className="mt-3 space-y-2">
          {project.highlights[locale].map((item, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="text-brass">
                ▸
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        {project.links?.map((link) => (
          <ArrowLink key={link.href} href={link.href} external>
            {link.label[locale]}
          </ArrowLink>
        ))}
        {project.privateRepo && (
          <p className="text-sm text-muted">{copy.common.private}</p>
        )}
      </div>

      <nav className="mt-16 border-t border-line pt-6">
        <ArrowLink href={`/${locale}/work/${next.slug}`}>
          {next.title}
        </ArrowLink>
      </nav>
    </article>
  );
}
