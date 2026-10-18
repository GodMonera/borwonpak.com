import type { ReactNode } from "react";

/**
 * One fret on the neck: brass wire across the top, an inlay dot marking the
 * position, then the content between this wire and the next.
 *
 * The inlay pattern follows a real fretboard — a single dot at most positions
 * and a double at the twelfth, which is where the octave repeats.
 */
export function Fret({
  position,
  title,
  meta,
  children,
  id,
}: {
  /** Fret number, shown in the margin like a position marker. */
  position: number;
  title: string;
  meta?: string;
  children: ReactNode;
  id?: string;
}) {
  const doubleDot = position % 12 === 0;

  return (
    <section id={id} className="relative">
      <hr className="fret-wire" />

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
        <h2 className="hud flex items-center gap-3 text-ink">
          <span className="flex items-center gap-1" aria-hidden>
            <span className="inlay" />
            {doubleDot && <span className="inlay" />}
          </span>
          <span className="text-brass">{position}</span>
          {title}
        </h2>
        {meta && <p className="hud text-muted">{meta}</p>}
      </div>

      <div className="relative pb-16">{children}</div>
    </section>
  );
}
