import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PageHeader } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.work.title, description: copy.work.sub };
}

export default async function WorkPage({
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
      <PageHeader index="01" title={copy.work.title} sub={copy.work.sub} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            index={i + 1}
            delay={(i % 2) * 90}
          />
        ))}
      </div>
    </>
  );
}
