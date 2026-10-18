/**
 * A hand, read like a palmistry chart.
 *
 * The silhouette is five capsules and a rounded palm filled as one shape with
 * no stroke — overlapping outlines would show seams where the fingers and the
 * thumb meet the palm, and a single flat fill reads better at this size.
 *
 * The lines carry `data-line`, which is what the stylesheet matches when the
 * corresponding link in the list is hovered. Nothing here is interactive: the
 * hand is decoration for a list that already says the same thing in words.
 */
export function Hand({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 540"
      aria-hidden
      className={className}
      role="presentation"
    >
      <g fill="color-mix(in srgb, var(--ink) 9%, transparent)">
        {/* The thumb is drawn first and pivoted about a point *inside* the
            palm, so its root is buried rather than floating beside it. */}
        <rect
          x="96"
          y="240"
          width="56"
          height="170"
          rx="28"
          transform="rotate(34 124 260)"
        />
        <rect x="100" y="186" width="268" height="286" rx="72" />
        {/* index, middle, ring, little — knuckle heights staggered as on a hand */}
        <rect x="118" y="72" width="58" height="168" rx="29" />
        <rect x="182" y="40" width="58" height="200" rx="29" />
        <rect x="246" y="56" width="58" height="186" rx="29" />
        <rect x="310" y="112" width="58" height="132" rx="29" />
      </g>

      {/* Palmistry geometry on a right hand: the three majors plus two
          verticals rising from the wrist. Everything stays clear of the
          silhouette's edges so no line runs off the hand. */}
      <path
        data-line="heart"
        pathLength="1"
        style={{ "--trace-delay": "0.1s" } as React.CSSProperties}
        d="M 176 250 C 220 222, 304 222, 346 258"
      />
      <path
        data-line="head"
        pathLength="1"
        style={{ "--trace-delay": "0.3s" } as React.CSSProperties}
        d="M 128 282 C 190 276, 256 292, 310 316"
      />
      <path
        data-line="life"
        pathLength="1"
        style={{ "--trace-delay": "0.5s" } as React.CSSProperties}
        d="M 130 272 C 136 346, 170 414, 228 450"
      />
      <path
        data-line="fate"
        pathLength="1"
        style={{ "--trace-delay": "0.7s" } as React.CSSProperties}
        d="M 250 456 C 262 390, 270 318, 276 252"
      />
      <path
        data-line="sun"
        pathLength="1"
        style={{ "--trace-delay": "0.9s" } as React.CSSProperties}
        d="M 316 450 C 324 406, 330 372, 334 332"
      />
    </svg>
  );
}
