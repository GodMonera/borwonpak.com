import Link from "next/link";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/hud/reveal";

/**
 * Chapter zero.
 *
 * Deliberately tall — the portrait behind it is tied to scroll progress, and
 * it needs somewhere to recede *to*. A short hero would finish the animation
 * before anyone noticed it had started.
 *
 * No navigation here on purpose. The other three skins open with a menu; this
 * one opens with a door and asks you to walk through it, which is the whole
 * difference between a page you pick from and a page you read.
 */
export function Hero({
  locale,
  kicker,
  tagline,
  intro,
  ctaWork,
  ctaAsk,
}: {
  locale: Locale;
  kicker: string;
  tagline: string;
  intro: string;
  ctaWork: string;
  ctaAsk: string;
}) {
  const th = locale === "th";

  return (
    <section className="relative flex min-h-[86vh] flex-col justify-center py-20">
      <Reveal as="p" className="story-chapter">
        {th ? "บทนำ" : "Prologue"}
      </Reveal>

      <Reveal as="p" delay={60} className="hud mt-4 text-muted">
        {kicker}
      </Reveal>

      <h1 className="mt-5">
        <span className="sr-only">{site.name}</span>
        <span
          aria-hidden
          className="block font-display text-[13vw] font-bold uppercase leading-[0.86] tracking-[-0.03em] sm:text-[clamp(3rem,9vw,7rem)]"
        >
          Borwonpak
        </span>
      </h1>

      <Reveal
        as="p"
        delay={140}
        className="mt-7 max-w-2xl text-pretty font-display text-2xl font-medium leading-snug sm:text-3xl"
      >
        {tagline}
      </Reveal>

      <Reveal as="p" delay={220} className="mt-5 max-w-xl text-pretty leading-relaxed text-muted">
        {intro}
      </Reveal>

      <Reveal delay={320} className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/work`}
          className="border border-brass bg-brass px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-on-accent transition hover:bg-transparent hover:text-brass"
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
        className="hud mt-14 flex items-center gap-2 text-muted"
      >
        <span className="story-nudge" aria-hidden>
          ↓
        </span>
        {th ? "เลื่อนลงเพื่ออ่านต่อ" : "Scroll to read on"}
      </Reveal>
    </section>
  );
}
