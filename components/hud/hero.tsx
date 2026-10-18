import Link from "next/link";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/hud/reveal";

export type Chip = { value: string; label: string };

/**
 * Scatter positions for the floating chips, as percentages of the hero box.
 * Hand-placed to stay clear of the wordmark and the centre column.
 */
/*
 * The centre column is max-w-3xl, so on a wide screen it occupies roughly
 * 22%–78%. Chips stay outside that band, or above/below it, otherwise the
 * wordmark paints straight over them.
 */
const SLOTS = [
  { top: "12%", left: "2%", tilt: "-5deg", dur: "11s", delay: "0s" },
  { top: "18%", left: "83%", tilt: "4deg", dur: "9s", delay: "-2s" },
  { top: "58%", left: "1%", tilt: "3deg", dur: "12s", delay: "-4s" },
  { top: "72%", left: "83%", tilt: "-4deg", dur: "10s", delay: "-1s" },
  { top: "4%", left: "58%", tilt: "6deg", dur: "13s", delay: "-6s" },
  { top: "86%", left: "20%", tilt: "-3deg", dur: "10.5s", delay: "-3s" },
];

export function Hero({
  locale,
  kicker,
  tagline,
  intro,
  ctaWork,
  ctaAsk,
  chips,
}: {
  locale: Locale;
  kicker: string;
  tagline: string;
  intro: string;
  ctaWork: string;
  ctaAsk: string;
  chips: Chip[];
}) {
  return (
    <section className="relative -mx-5 overflow-hidden border-b border-line px-5">
      {/* Graph-paper ground */}
      <div
        aria-hidden
        className="matrix pointer-events-none absolute inset-0 opacity-[0.35]"
      />

      {/* Orbit arcs — a nod to signal paths, kept very low contrast */}
      <svg
        aria-hidden
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="arcA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brass)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--brass)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--brass)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="arcB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--abalone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--abalone)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--abalone)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="600"
          cy="350"
          rx="520"
          ry="300"
          fill="none"
          stroke="url(#arcA)"
          strokeWidth="1"
        />
        <ellipse
          cx="600"
          cy="350"
          rx="380"
          ry="420"
          fill="none"
          stroke="url(#arcB)"
          strokeWidth="1"
        />
        <ellipse
          cx="600"
          cy="350"
          rx="680"
          ry="200"
          fill="none"
          stroke="url(#arcA)"
          strokeWidth="1"
        />
      </svg>

      {/* Floating data chips — real numbers from the work, not stock imagery */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {chips.slice(0, SLOTS.length).map((chip, i) => {
          const slot = SLOTS[i];
          return (
            <div
              key={chip.label}
              className="drift absolute"
              style={
                {
                  top: slot.top,
                  left: slot.left,
                  "--tilt": slot.tilt,
                  "--drift-dur": slot.dur,
                  "--drift-delay": slot.delay,
                } as React.CSSProperties
              }
            >
              <div className="ticked border border-line bg-panel/80 px-3 py-2 backdrop-blur-sm">
                <p className="font-display text-lg font-semibold leading-none text-ink">
                  {chip.value}
                </p>
                <p className="hud mt-1.5 text-muted">{chip.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centre column */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center py-24 text-center sm:py-32">
        <Reveal as="p" className="hud text-brass">
          {kicker}
        </Reveal>

        <h1 className="mt-7 w-full">
          <span className="sr-only">{site.name}</span>
          <span
            aria-hidden
            className="sweep block font-display text-[13vw] font-bold uppercase leading-[0.85] tracking-[-0.02em] sm:text-[clamp(3rem,9vw,7.5rem)]"
          >
            Borwonpak
          </span>
        </h1>

        <Reveal
          as="p"
          delay={120}
          className="mt-7 max-w-2xl font-display text-2xl font-medium leading-snug sm:text-3xl"
        >
          {tagline}
        </Reveal>

        <Reveal as="p" delay={220} className="mt-5 max-w-xl leading-relaxed text-muted">
          {intro}
        </Reveal>

        <Reveal delay={320} className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}/work`}
            className="border border-brass bg-brass px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-[#191310] transition hover:bg-transparent hover:text-brass"
          >
            {ctaWork}
          </Link>
          <Link
            href={`/${locale}/ask`}
            className="border border-line-bright px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider transition hover:border-brass hover:text-brass"
          >
            {ctaAsk}
          </Link>
        </Reveal>

        <Reveal
          as="p"
          delay={420}
          className="hud mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-muted"
        >
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="pointer-events-auto transition hover:text-brass"
          >
            @{site.githubHandle}
          </a>
          <span className="text-line-bright">·</span>
          <span>{site.location[locale]}</span>
          <span className="text-line-bright">·</span>
          <a
            href={`mailto:${site.email}`}
            className="pointer-events-auto transition hover:text-brass"
          >
            {site.email}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
