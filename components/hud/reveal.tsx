"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Blur-and-lift on entry, driven by IntersectionObserver.
 *
 * The class is toggled directly on the node rather than through React state:
 * this is synchronising with a browser API, which is what effects are for, and
 * it avoids a re-render per element on a page that can hold dozens of them.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
}: {
  as?: ElementType;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Without IntersectionObserver, show everything rather than nothing.
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          // One-shot: content should not fade back out when scrolled past.
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
