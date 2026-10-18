"use client";

import { useEffect, useRef } from "react";

const TICKS = Array.from({ length: 21 }, (_, i) => i * 5);

/**
 * A measuring rule pinned to the right gutter: tick marks every 5%, a live
 * readout, and a marker tracking scroll depth. Decorative, so it is hidden
 * from assistive tech and from narrow screens where the gutter does not exist.
 *
 * Updates go straight to the DOM inside a rAF — this fires on every scroll
 * frame, and routing it through React state would re-render the tree ~60
 * times a second for a number nobody else reads.
 */
export function ScrollRuler() {
  const markerRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      const pct = Math.round(Math.min(Math.max(ratio, 0), 1) * 100);

      if (markerRef.current) markerRef.current.style.top = `${pct}%`;
      if (readoutRef.current) readoutRef.current.textContent = String(pct).padStart(2, "0");
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-16 bottom-0 z-30 hidden w-14 select-none border-l border-line xl:block"
    >
      <div className="relative h-full">
        {TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute left-0 flex items-center gap-1.5"
            style={{ top: `${tick}%` }}
          >
            <span
              className={tick % 25 === 0 ? "block h-px w-4 bg-line-bright" : "block h-px w-2 bg-line"}
            />
            {tick % 25 === 0 && (
              <span className="hud text-[9px] text-muted">{tick}</span>
            )}
          </div>
        ))}

        <div
          ref={markerRef}
          className="absolute left-0 flex -translate-y-1/2 items-center gap-1 transition-[top] duration-100 ease-out"
          style={{ top: "0%" }}
        >
          <span className="block h-px w-5 bg-marigold" />
          <span className="hud text-[9px] text-marigold">
            <span ref={readoutRef}>00</span>%
          </span>
        </div>
      </div>
    </div>
  );
}
