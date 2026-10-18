import Link from "next/link";
import type { Project } from "@/content/site";
import { t, type Locale } from "@/lib/i18n";
import { Tag } from "@/components/ui";
import { Reveal } from "@/components/hud/reveal";

export function ProjectCard({
  project,
  locale,
  index,
  delay = 0,
}: {
  project: Project;
  locale: Locale;
  index: number;
  delay?: number;
}) {
  const copy = t(locale);
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/${locale}/work/${project.slug}`}
        className="ticked group flex h-full flex-col gap-3 border border-line bg-panel p-5 transition hover:border-marigold hover:bg-panel-2"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="hud text-marigold">
            {String(index).padStart(2, "0")}
          </span>
          <span className="hud text-muted">{project.year}</span>
        </div>

        <h3 className="font-display text-xl font-semibold leading-tight transition group-hover:text-marigold">
          {project.title}
        </h3>

        <p className="text-sm leading-relaxed text-muted">
          {project.tagline[locale]}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {project.stack.slice(0, 4).map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
          {project.stack.length > 4 && <Tag>+{project.stack.length - 4}</Tag>}
        </div>

        <p className="hud flex items-center gap-2 border-t border-line pt-3 text-teal">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-full bg-teal"
          />
          {project.status[locale]}
        </p>
        <span className="sr-only">{copy.common.readMore}</span>
      </Link>
    </Reveal>
  );
}
