import type { Voicing } from "@/lib/chords";

const FRETS_SHOWN = 5;

/**
 * One chord box, drawn the way a songbook draws it: nut at the top when the
 * shape sits at the first position, a fret number in the margin when it does
 * not, × and ○ above the strings, and the fingering inside each dot.
 */
export function ChordDiagram({
  voicing,
  label,
  onPlay,
  playHint,
}: {
  voicing: Voicing;
  label: string;
  onPlay?: () => void;
  playHint: string;
}) {
  const W = 132;
  const H = 150;
  const left = 22;
  const top = 32;
  const gap = (W - left - 16) / 5;
  const fretGap = (H - top - 12) / FRETS_SHOWN;
  const atNut = voicing.baseFret === 1;

  // Strings are drawn low E on the left, as a player sees the neck held up to
  // look at — which is also how every chord box in every songbook is drawn.
  const x = (string: number) => left + gap * string;
  const y = (fret: number) => top + fretGap * (fret - 0.5);

  const body = (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${label}, ${voicing.frets
        .map((f) => (f < 0 ? "muted" : f))
        .join(" ")}`}
      className="w-full"
    >
      {/* Nut, or the fret number that says where on the neck this sits */}
      {atNut ? (
        <rect x={left - 1} y={top - 5} width={gap * 5 + 2} height={4} fill="var(--ink)" />
      ) : (
        <text
          x={left - 8}
          y={y(1) + 4}
          textAnchor="end"
          fontSize="10"
          fill="var(--muted)"
          fontFamily="var(--font-mono-code), monospace"
        >
          {voicing.baseFret}
        </text>
      )}

      {Array.from({ length: FRETS_SHOWN }, (_, f) => (
        <line
          key={`f${f}`}
          x1={left}
          y1={top + fretGap * (f + 1)}
          x2={left + gap * 5}
          y2={top + fretGap * (f + 1)}
          stroke="var(--line)"
          strokeWidth={1}
        />
      ))}

      {voicing.frets.map((fret, string) => (
        <g key={string}>
          <line
            x1={x(string)}
            y1={top}
            x2={x(string)}
            y2={top + fretGap * FRETS_SHOWN}
            stroke="var(--line-bright)"
            // Thin at the top, thick at the bottom, as the strings really
            // are — but the floor matters: below about a unit the top E
            // disappears entirely against the panel at this size.
            strokeWidth={1 + (5 - string) * 0.22}
          />
          <text
            x={x(string)}
            y={top - 9}
            textAnchor="middle"
            fontSize="10"
            fill={fret < 0 ? "var(--muted)" : "var(--abalone)"}
            fontFamily="var(--font-mono-code), monospace"
          >
            {fret < 0 ? "×" : fret === 0 ? "○" : ""}
          </text>
        </g>
      ))}

      {/* The barre first, so the finger numbers land on top of it */}
      {voicing.barre && (
        <rect
          x={x(voicing.barre.from) - 7}
          y={y(voicing.barre.fret - voicing.baseFret + 1) - 7}
          width={x(voicing.barre.to) - x(voicing.barre.from) + 14}
          height={14}
          rx={7}
          fill="var(--brass)"
        />
      )}

      {voicing.frets.map((fret, string) =>
        fret > 0 ? (
          <g key={`d${string}`}>
            <circle
              cx={x(string)}
              cy={y(fret - voicing.baseFret + 1)}
              r={7}
              fill="var(--brass)"
            />
            <text
              x={x(string)}
              y={y(fret - voicing.baseFret + 1) + 3.5}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="var(--on-accent)"
              fontFamily="var(--font-mono-code), monospace"
            >
              {voicing.fingers[string]}
            </text>
          </g>
        ) : null,
      )}
    </svg>
  );

  if (!onPlay) return body;

  return (
    <button
      type="button"
      onClick={onPlay}
      title={playHint}
      className="border border-line bg-panel p-2 transition hover:border-brass"
    >
      {body}
    </button>
  );
}
