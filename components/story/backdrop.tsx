import Image from "next/image";

/**
 * The portraits behind the page, one per stretch of the scroll.
 *
 * Decoration, not content — the hero names him in type and every chapter is
 * readable without these — so the whole stack is hidden from assistive tech
 * and carries empty alt text. Which layer is showing, and how faded, is
 * decided entirely in CSS by a scroll-progress timeline; the order here is
 * the order of the story.
 */
const FRAMES = [
  { src: "/img/palm.webp", width: "min(52vw, 360px)" },
  { src: "/img/story-2.webp", width: "min(44vw, 300px)" },
  { src: "/img/story-3.webp", width: "min(46vw, 315px)" },
];

export function StoryBackdrop() {
  return (
    <div className="story-face" aria-hidden>
      {FRAMES.map((frame, i) => (
        <div key={frame.src}>
          {/* Two nested elements on purpose: the outer one is driven by
              scroll progress, this one breathes on its own clock. One
              element cannot do both — they would overwrite each other's
              transform. */}
          <div className="story-float relative" style={{ width: frame.width }}>
            <Image
              src={frame.src}
              alt=""
              fill
              sizes="(max-width: 640px) 52vw, 360px"
              // Only the first is above the fold; the rest can wait until the
              // reader is actually on their way down.
              priority={i === 0}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
