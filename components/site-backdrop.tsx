import type { Skin } from "@/lib/skins";
import { Strings } from "@/components/neck/strings";

/**
 * Whatever sits behind the content: strings on the neck, a dot matrix on the
 * readout, laid-paper fibre on the manuscript. Fixed, so it stays put while
 * the page scrolls over it.
 */
export function SiteBackdrop({ skin }: { skin: Skin }) {
  if (skin === "neck") return <Strings />;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 ${
        skin === "hud" ? "matrix opacity-30" : "laid opacity-70"
      }`}
    />
  );
}
