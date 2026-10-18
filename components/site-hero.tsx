import type { Locale } from "@/lib/i18n";
import type { Skin } from "@/lib/skins";
import { Hero as NeckHero } from "@/components/neck/hero";
import { Hero as HudHero, type Chip } from "@/components/hud/hero";
import { Hero as PalmHero, type PalmLine } from "@/components/palm/hero";
import type { Chord } from "@/components/neck/chord-nav";

/**
 * The hero is the one place the three skins genuinely disagree — a fretboard
 * opens with chords, an instrument readout with live numbers, a palmistry
 * chart with the lines of a hand. So the caller builds all three navigations
 * and this picks one, rather than every skin reaching for a lowest common
 * denominator that would make them look the same.
 */
export type HeroProps = {
  skin: Skin;
  locale: Locale;
  kicker: string;
  tagline: string;
  intro: string;
  ctaWork: string;
  ctaAsk: string;
  playHint: string;
  chords: Chord[];
  chips: Chip[];
  lines: PalmLine[];
};

export function SiteHero({ skin, ...p }: HeroProps) {
  if (skin === "hud") {
    return (
      <HudHero
        locale={p.locale}
        kicker={p.kicker}
        tagline={p.tagline}
        intro={p.intro}
        ctaWork={p.ctaWork}
        ctaAsk={p.ctaAsk}
        chips={p.chips}
      />
    );
  }

  if (skin === "palm") {
    return (
      <PalmHero
        locale={p.locale}
        kicker={p.kicker}
        tagline={p.tagline}
        intro={p.intro}
        lines={p.lines}
        playHint={p.playHint}
      />
    );
  }

  return (
    <NeckHero
      locale={p.locale}
      kicker={p.kicker}
      tagline={p.tagline}
      intro={p.intro}
      chords={p.chords}
      playHint={p.playHint}
    />
  );
}
