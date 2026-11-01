import Image from "next/image";
import { site } from "@/content/site";

/**
 * The cutout portrait at the top of the homepage.
 *
 * Background removed, so there is no white box sitting on the page ground and
 * the same file works on all three skins — rosewood, near-black and paper.
 * The bottom is masked into a fade rather than cropped square, because the
 * original photograph ends mid-shirt and a hard horizontal edge there reads
 * as a mistake. The fade also lets the wordmark tuck underneath it.
 */
export function Portrait({ className = "" }: { className?: string }) {
  return (
    <div
      className={`portrait pointer-events-none relative ${className}`}
      // 1200x1410 source, so the box keeps its ratio while the height is
      // driven by the viewport.
      style={{ aspectRatio: "1200 / 1410" }}
    >
      <Image
        src="/img/palm.webp"
        alt={site.name}
        fill
        // Never wider than the hero column, and the source is 1200px, so this
        // is the honest upper bound rather than a guess at the layout.
        sizes="(max-width: 640px) 60vw, 340px"
        priority
        className="object-contain object-bottom"
      />
    </div>
  );
}
