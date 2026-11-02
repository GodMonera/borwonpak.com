import type { ReactNode } from "react";

/**
 * A section as a chapter: number, title, then the rule under both.
 *
 * `index` is the same string the other skins use for their numbering, so the
 * chapters stay in step with the frets and the rubrics without the homepage
 * having to know which skin is live.
 */
export function Chapter({
  index,
  label,
  title,
  meta,
  children,
  id,
}: {
  index: string;
  /** The word for "chapter" in the page's language. */
  label: string;
  title: string;
  meta?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="relative pt-20">
      <p className="story-chapter">
        {label} {index}
      </p>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {meta && <p className="hud text-muted">{meta}</p>}
      </div>

      <hr className="story-rule mt-4" />

      <div className="relative pb-20 pt-8">{children}</div>
    </section>
  );
}
