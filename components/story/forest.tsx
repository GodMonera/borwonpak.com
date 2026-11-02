import { Mascot } from "@/components/story/mascot";

/** Trunks per depth band: x position, width, how far up the canopy it goes. */
const FAR = [6, 19, 31, 44, 57, 69, 82, 94];
const MID = [12, 30, 48, 66, 84, 97];
/* Kept to the very edges: a near trunk anywhere else lands on top of him. */
const NEAR = [1, 14, 90];

/**
 * The forest he is standing in.
 *
 * Four depth bands, each on its own scroll-driven parallax so the near trunks
 * slide past faster than the far ones. Built from plain shapes rather than
 * artwork: trees at this level of abstraction are rectangles and blobs, which
 * is exactly what can be hand-authored without looking hand-authored.
 *
 * Fixed behind the page and hidden from assistive tech — the chapters read
 * perfectly well with none of it.
 */
export function Forest() {
  return (
    <div className="story-forest" aria-hidden>
      <div className="story-sky" />

      <div className="story-layer story-layer-far">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {FAR.map((x, i) => (
            <rect
              key={x}
              x={x}
              y={14 + (i % 3) * 5}
              width={2.2}
              height={100}
              fill="var(--forest-far)"
            />
          ))}
        </svg>
      </div>

      <div className="story-layer story-layer-mid">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {MID.map((x, i) => (
            <rect
              key={x}
              x={x}
              y={8 + (i % 2) * 6}
              width={3.6}
              height={100}
              fill="var(--forest-mid)"
            />
          ))}
        </svg>
      </div>

      {/* Light coming down through the canopy. Two soft wedges, no more — any
          more and it stops reading as light and starts reading as a texture. */}
      <div className="story-shaft story-shaft-a" />
      <div className="story-shaft story-shaft-b" />

      <div className="story-fireflies">
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            style={
              {
                left: `${(i * 7.3 + 4) % 96}%`,
                top: `${(i * 11.7 + 12) % 78}%`,
                "--fly-dur": `${5 + (i % 5) * 1.6}s`,
                "--fly-delay": `${-(i % 7) * 1.3}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="story-layer story-layer-near">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {NEAR.map((x, i) => (
            <rect
              key={x}
              x={x}
              y={-10}
              width={7 + (i % 2) * 2}
              height={120}
              fill="var(--forest-near)"
            />
          ))}
        </svg>
      </div>

      <div className="story-mascot">
        <Mascot className="h-full w-full" />
      </div>

      {/* Undergrowth across the bottom, which also hides where the trunks end. */}
      <div className="story-ground" />
    </div>
  );
}
