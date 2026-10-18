/**
 * The six strings, fixed behind the content.
 *
 * They are constrained to the same centred column as the nut and the fret
 * wire, because the neck *is* that column — strings spilling to the viewport
 * edges read as a background grid rather than an instrument.
 *
 * Gauges run thin to thick left-to-right, as on a neck seen face-on.
 */
const GAUGES = [1, 1.2, 1.5, 1.9, 2.4, 3];

export function Strings() {
  return (
    <div className="strings" aria-hidden>
      <div className="mx-auto h-full w-full max-w-5xl px-5">
        <div className="relative h-full">
          {GAUGES.map((w, i) => (
            <i
              key={i}
              style={{
                width: `${w}px`,
                // Inset from the fretboard edges, evenly spaced between.
                left: `${7 + (i * 86) / (GAUGES.length - 1)}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
