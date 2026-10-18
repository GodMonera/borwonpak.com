import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/hud/reveal";
import { ChordNav, type Chord } from "@/components/neck/chord-nav";

export function Hero({
  locale,
  kicker,
  tagline,
  intro,
  chords,
  playHint,
}: {
  locale: Locale;
  kicker: string;
  tagline: string;
  intro: string;
  chords: Chord[];
  playHint: string;
}) {
  return (
    <section className="relative">
      {/* The nut: bone bar where the fretboard begins, under the headstock. */}
      <div
        aria-hidden
        className="h-2 w-full bg-gradient-to-b from-[#f3ead6] via-[#ddd0b4] to-[#9d8f74]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:py-28">
        <Reveal as="p" className="hud text-brass">
          {kicker}
        </Reveal>

        <h1 className="mt-6 w-full">
          <span className="sr-only">{site.name}</span>
          <span
            aria-hidden
            className="sweep block font-display text-[13vw] font-bold uppercase leading-[0.86] tracking-[-0.02em] sm:text-[clamp(3rem,9vw,7rem)]"
          >
            Borwonpak
          </span>
        </h1>

        <Reveal
          as="p"
          delay={120}
          className="mt-6 max-w-2xl font-display text-2xl font-semibold leading-snug sm:text-3xl"
        >
          {tagline}
        </Reveal>

        <Reveal as="p" delay={200} className="mt-5 max-w-xl leading-relaxed text-muted">
          {intro}
        </Reveal>

        <Reveal delay={300} className="mt-10 w-full">
          <ChordNav chords={chords} />
        </Reveal>

        <Reveal as="p" delay={380} className="hud mt-5 text-muted">
          {playHint}
        </Reveal>

        <Reveal
          as="p"
          delay={440}
          className="hud mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-muted"
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
