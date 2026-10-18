import type { ReactNode } from "react";

/**
 * A numbered content band: "01 / TITLE" on the left rule, optional technical
 * note on the right, content below. The repeating unit of the whole site.
 */
export function Band({
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
    <section id={id} className="border-t border-line">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
        <h2 className="hud text-ink">
          <span className="text-brass">{index}</span>
          <span className="mx-2 text-line-bright">/</span>
          {title}
        </h2>
        {meta && <p className="hud text-muted">{meta}</p>}
      </div>
      <div className="border-t border-line pb-16 pt-8">{children}</div>
    </section>
  );
}
