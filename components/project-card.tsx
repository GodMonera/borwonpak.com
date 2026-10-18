import Link from "next/link";
import type { Project } from "@/content/site";
import { t, type Locale } from "@/lib/i18n";
import { AccentBar, Tag } from "@/components/ui";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const copy = t(locale);
  return (
    <Link
      href={`/${locale}/work/${project.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-line bg-card p-5 transition hover:border-marigold"
    >
      <AccentBar accent={project.accent} />
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight group-hover:text-marigold">
          {project.title}
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">
          {project.year}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted">
        {project.tagline[locale]}
      </p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {project.stack.slice(0, 5).map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
        {project.stack.length > 5 && (
          <Tag>+{project.stack.length - 5}</Tag>
        )}
      </div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-teal">
        {project.status[locale]}
      </p>
      <span className="sr-only">{copy.common.readMore}</span>
    </Link>
  );
}
