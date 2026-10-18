import type { ReactNode } from "react";

/**
 * A section as a manuscript leaf: vermilion rubric number in the margin,
 * heading beside it, double rule under both.
 */
export function Leaf({
  index,
  title,
  meta,
  children,
  id,
}: {
  index: string;
  title: string;
  meta?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="relative">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-10">
        <h2 className="palm-display flex items-baseline gap-3 text-2xl">
          <span className="rubric text-lg">{index}</span>
          {title}
        </h2>
        {meta && <p className="hud text-muted">{meta}</p>}
      </div>
      <hr className="palm-rule mt-3" />
      <div className="relative pb-16 pt-8">{children}</div>
    </section>
  );
}
