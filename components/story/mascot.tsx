/**
 * Palm, drawn, losing it.
 *
 * Not a likeness and not trying to be — he chose a mascot over a portrait,
 * then asked for the unhinged version. It reads as him through three borrowed
 * details rather than a face: the long dark hair, the moustache, and the red
 * cap out of his own photograph.
 *
 * Chibi proportions on purpose. A head this size on a body this small is the
 * difference between a mascot and a mugshot, and flat shapes are what survive
 * being hand-authored — anything shaded would not.
 *
 * Limbs are round-capped strokes rather than rotated rectangles. A stroke
 * runs from joint to joint by construction, so arms meet hands and hands meet
 * the guitar without four numbers having to agree; rotated rects drift apart
 * the moment anything moves.
 *
 * Every moving part is its own <g> with a transform-origin, so the whole rig
 * is CSS: see the `.m-*` rules in globals.css. No JavaScript anywhere.
 */
export function Mascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 300"
      className={className}
      role="img"
      aria-label="Palm, as a cartoon, going at a guitar in the middle of a forest"
    >
      <defs>
        <linearGradient id="m-skin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f6cfa6" />
          <stop offset="100%" stopColor="#e3ab7e" />
        </linearGradient>
        <linearGradient id="m-shirt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7a6f4b" />
          <stop offset="100%" stopColor="#4b4330" />
        </linearGradient>
        <linearGradient id="m-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e2521" />
          <stop offset="100%" stopColor="#120e0c" />
        </linearGradient>
      </defs>

      <ellipse cx="130" cy="288" rx="64" ry="8" fill="#000" opacity="0.32" />

      <g className="m-zip" stroke="#f0a07a" strokeWidth="3" strokeLinecap="round">
        <line x1="22" y1="92" x2="46" y2="92" />
        <line x1="14" y1="116" x2="42" y2="116" />
        <line x1="214" y1="100" x2="238" y2="100" />
        <line x1="218" y1="124" x2="246" y2="124" />
      </g>

      <g className="m-bounce">
        {/* legs, kicked wide — the stance from his own photograph */}
        <g stroke="#2b2b33" strokeWidth="22" strokeLinecap="round" fill="none">
          <line x1="116" y1="196" x2="88" y2="268" />
          <line x1="146" y1="196" x2="174" y2="268" />
        </g>
        <ellipse cx="86" cy="274" rx="20" ry="11" fill="#efe9dc" />
        <ellipse cx="176" cy="274" rx="20" ry="11" fill="#e4ddce" />

        {/* torso */}
        <path
          d="M100 138 C100 128 112 124 131 124 C150 124 162 128 162 138 L166 200 C146 208 116 208 96 200 Z"
          fill="url(#m-shirt)"
        />

        {/* hair falling in front of the shoulders, drawn over the torso so the
            length actually shows from the front */}
        <path d="M92 104 C84 142 86 172 94 190 L112 182 C102 160 100 130 104 108 Z" fill="url(#m-hair)" />
        <path d="M170 104 C178 142 176 172 168 190 L150 182 C160 160 162 130 158 108 Z" fill="url(#m-hair)" />

        {/* guitar: body low and right, neck running up to the left */}
        <g className="m-guitar">
          <line
            x1="92"
            y1="152"
            x2="158"
            y2="182"
            stroke="#6b4a2a"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <rect x="78" y="142" width="18" height="15" rx="4" fill="#593d22" />
          <ellipse cx="172" cy="190" rx="37" ry="32" fill="#d4913f" />
          <ellipse cx="172" cy="190" rx="11" ry="10" fill="#3b2a18" />
          <g stroke="#f7ead0" strokeWidth="0.9" opacity="0.85">
            <line x1="94" y1="148" x2="186" y2="192" />
            <line x1="96" y1="152" x2="188" y2="196" />
            <line x1="98" y1="156" x2="190" y2="200" />
          </g>
        </g>

        {/* fretting arm — shoulder to a hand that lands on the neck */}
        <g className="m-arm-neck">
          <line
            x1="104"
            y1="140"
            x2="106"
            y2="158"
            stroke="url(#m-shirt)"
            strokeWidth="19"
            strokeLinecap="round"
          />
          <circle cx="107" cy="163" r="12" fill="url(#m-skin)" />
        </g>

        {/* strumming arm — over the sound hole */}
        <g className="m-arm-strum">
          <line
            x1="158"
            y1="138"
            x2="174"
            y2="176"
            stroke="url(#m-shirt)"
            strokeWidth="19"
            strokeLinecap="round"
          />
          <circle cx="176" cy="182" r="12" fill="url(#m-skin)" />
        </g>

        {/* head */}
        <g className="m-head">
          <rect x="121" y="108" width="20" height="20" rx="9" fill="#d79c73" />

          <path
            d="M78 76 C78 30 100 10 131 10 C162 10 184 30 184 76 L184 126 C172 106 164 96 152 94 L110 94 C98 96 90 106 78 126 Z"
            fill="url(#m-hair)"
          />

          <ellipse cx="131" cy="74" rx="47" ry="45" fill="url(#m-skin)" />

          <path
            d="M88 52 C100 28 117 20 131 20 C145 20 162 28 174 52 C156 40 143 36 131 36 C119 36 106 40 88 52 Z"
            fill="url(#m-hair)"
          />

          <g className="m-brow" fill="#1a1411">
            <rect x="100" y="54" width="24" height="6" rx="3" transform="rotate(-10 112 57)" />
            <rect x="138" y="54" width="24" height="6" rx="3" transform="rotate(10 150 57)" />
          </g>

          {/* Two eye states stacked; the CSS swaps between them so one is
              always showing. */}
          <g className="m-eye-open" fill="#1a1411">
            <ellipse cx="113" cy="74" rx="6" ry="7" />
            <ellipse cx="149" cy="74" rx="6" ry="7" />
            <circle cx="115" cy="72" r="1.8" fill="#fff" />
            <circle cx="151" cy="72" r="1.8" fill="#fff" />
          </g>
          <g
            className="m-eye-shut"
            fill="none"
            stroke="#1a1411"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M105 75 C110 68 118 68 122 75" />
            <path d="M141 75 C146 68 154 68 158 75" />
          </g>

          <path d="M115 93 C122 89 140 89 147 93 C140 97 122 97 115 93 Z" fill="#241c18" />

          <g className="m-mouth">
            <ellipse cx="131" cy="105" rx="13" ry="10" fill="#6d2b24" />
            <ellipse cx="131" cy="110" rx="8" ry="4.5" fill="#d9705f" />
          </g>

          <g className="m-cap">
            <path d="M90 44 C90 13 110 2 131 2 C152 2 172 13 172 44 Z" fill="#cf3a30" />
            <path d="M172 42 C196 42 210 47 212 54 L172 54 Z" fill="#a82a23" />
            <circle cx="131" cy="6" r="5" fill="#8f231d" />
          </g>
        </g>

        <ellipse className="m-sweat" cx="184" cy="48" rx="4" ry="6" fill="#8ad4e0" />
      </g>

      <g className="m-notes" fill="#f0a07a">
        <text className="m-note m-note-1" x="200" y="150" fontSize="22">
          ♪
        </text>
        <text className="m-note m-note-2" x="218" y="176" fontSize="17">
          ♫
        </text>
        <text className="m-note m-note-3" x="206" y="118" fontSize="14">
          ♪
        </text>
      </g>
    </svg>
  );
}
