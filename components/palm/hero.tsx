import Link from "next/link";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/hud/reveal";
import { Hand } from "@/components/palm/hand";

/**
 * One line of the hand, and where it goes. `line` matches the `data-line` on
 * the matching path in <Hand/>, which is how hovering here lights it there.
 */
export type PalmLine = {
  line: "life" | "head" | "heart" | "fate" | "sun";
  /** The palmistry name, e.g. "เส้นชีวิต". */
  name: string;
  /** What that line actually points at on this site. */
  label: string;
  href: string;
};

export function Hero({
  locale,
  kicker,
  tagline,
  intro,
  lines,
  playHint,
}: {
  locale: Locale;
  kicker: string;
  tagline: string;
  intro: string;
  lines: PalmLine[];
  playHint: string;
}) {
  return (
    <section className="relative">
      <hr className="palm-rule" />

      <div className="py-16 sm:py-20">
        <Reveal as="p" className="hud text-brass">
          {kicker}
        </Reveal>

        <h1 className="mt-5">
          <span className="sr-only">{site.name}</span>
          <span
            aria-hidden
            className="palm-display block text-[15vw] font-bold leading-[0.9] sm:text-[clamp(3.5rem,10vw,7rem)]"
          >
            Borwonpak
          </span>
        </h1>

        <Reveal
          as="p"
          delay={120}
          className="palm-display mt-6 max-w-2xl text-2xl leading-snug sm:text-3xl"
        >
          {tagline}
        </Reveal>

        <Reveal as="p" delay={200} className="mt-5 max-w-xl leading-relaxed text-muted">
          {intro}
        </Reveal>

        {/* The chart. :has() in the stylesheet links the list to the drawing. */}
        <div className="palm-chart mt-14 grid items-center gap-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Reveal className="mx-auto w-full max-w-[260px] sm:mx-0">
            <Hand className="h-auto w-full" />
          </Reveal>

          <Reveal delay={160}>
            <ol className="border-t border-line">
              {lines.map((item) => (
                <li key={item.line} className="border-b border-line">
                  <Link
                    href={item.href}
                    data-line={item.line}
                    className="group flex items-baseline gap-4 py-3.5 transition hover:text-brass"
                  >
                    <span className="hud w-24 shrink-0 text-muted transition group-hover:text-brass">
                      {item.name}
                    </span>
                    <span className="palm-display text-xl">{item.label}</span>
                    <span
                      aria-hidden
                      className="ml-auto text-line-bright transition group-hover:translate-x-1 group-hover:text-brass"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="hud mt-4 text-muted">{playHint}</p>
          </Reveal>
        </div>

        <Reveal
          as="p"
          delay={300}
          className="hud mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted"
        >
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="transition hover:text-brass"
          >
            @{site.githubHandle}
          </a>
          <span className="text-line-bright">·</span>
          <span>{site.location[locale]}</span>
          <span className="text-line-bright">·</span>
          <a href={`mailto:${site.email}`} className="transition hover:text-brass">
            {site.email}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
