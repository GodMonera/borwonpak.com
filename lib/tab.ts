/**
 * Turning a melody into guitar tab.
 *
 * Pieces are stored as pitches — "C4", "F#5" — and never as fret numbers.
 * The same note lives in up to five places on a guitar, so choosing between
 * them is a decision about fingering, not about the music, and a decision a
 * program makes more reliably than a person typing a grid of digits by hand.
 */

// Relative, with the extension, rather than the "@/" alias used elsewhere:
// `node --test` runs this file straight from TypeScript and resolves neither
// tsconfig paths nor extensionless specifiers. Bundlers accept it either way.
import { TUNING } from "./chords.ts";

const LETTERS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/**
 * Highest fret the placer will use. A classical guitar has more, but the body
 * joins the neck around here and a melody that climbs past it stops being
 * something you would hand a learner.
 */
const MAX_FRET = 15;

/**
 * Scientific pitch notation to MIDI. A4 is 69, and the guitar's open high E
 * is written E4 here — guitar music is normally written an octave up, but
 * sounding pitch is what the synthesiser needs and what avoids off-by-twelve
 * mistakes in the fret placement.
 */
export function toMidi(pitch: string): number {
  const match = /^([A-G])([#b]?)(-?\d+)$/.exec(pitch);
  if (!match) throw new Error(`bad pitch: ${pitch}`);
  const [, letter, accidental, octave] = match;
  const semitone =
    LETTERS[letter] + (accidental === "#" ? 1 : accidental === "b" ? -1 : 0);
  return (Number(octave) + 1) * 12 + semitone;
}

export type TabNote = {
  /** Notes struck together. Empty is a rest. */
  pitches: string[];
  /**
   * Length in quarter notes — 1 is a crotchet, 0.5 a quaver, 2 a minim.
   * Always quarter notes, never "one beat of whatever the meter says", so a
   * 3/8 bar and a 3/4 bar cannot quietly mean the same number here.
   */
  beats: number;
};

export type Stop = {
  /** Index into TUNING, 0 being the low E. */
  string: number;
  fret: number;
  midi: number;
};

export type Placed = {
  note: TabNote;
  /** One stop per pitch, low string first. Empty for a rest. */
  stops: Stop[];
  /** Quarter notes elapsed since the start of the piece. */
  at: number;
};

/** Every way to put one event's pitches on the neck at once. */
function shapesFor(midis: number[]): Stop[][] {
  if (midis.length === 0) return [];
  const sorted = [...midis].sort((a, b) => a - b);
  const shapes: Stop[][] = [];

  /*
    Strings are assigned in ascending order alongside the pitches. On a guitar
    a lower-pitched note almost always sits on a lower string, and the rare
    voicings that cross are not worth the combinatorial blowup of allowing
    every permutation of six strings against five notes.
  */
  const walk = (noteIndex: number, fromString: number, chosen: Stop[]) => {
    if (noteIndex === sorted.length) {
      const fretted = chosen.filter((c) => c.fret > 0).map((c) => c.fret);
      if (fretted.length > 1) {
        const span = Math.max(...fretted) - Math.min(...fretted);
        if (span > 4) return;
      }
      shapes.push([...chosen]);
      return;
    }
    for (let string = fromString; string < TUNING.length; string++) {
      const fret = sorted[noteIndex] - TUNING[string];
      if (fret < 0 || fret > MAX_FRET) continue;
      chosen.push({ string, fret, midi: sorted[noteIndex] });
      walk(noteIndex + 1, string + 1, chosen);
      chosen.pop();
    }
  };

  walk(0, 0, []);
  return shapes;
}

/**
 * Where the left hand is, as a fret number.
 *
 * Open strings are deliberately excluded. They cost the hand nothing and sit
 * nowhere, so averaging them in drags the number toward the nut and makes a
 * shape look closer than it is: with a bass on the open A, a melody note at
 * the fourteenth fret averages out to seven, and the placer happily sends
 * the hand there. null means "this event does not move the hand at all".
 */
function position(stops: Stop[]): number | null {
  const fretted = stops.filter((s) => s.fret > 0);
  if (fretted.length === 0) return null;
  return fretted.reduce((sum, s) => sum + s.fret, 0) / fretted.length;
}

/** What the hand has to travel between two shapes. */
function travel(a: Stop[], b: Stop[]) {
  const from = position(a);
  const to = position(b);
  const hand = from === null || to === null ? 0 : Math.abs(to - from);
  return hand + Math.abs(b[0].string - a[0].string) * 0.4;
}

/**
 * Place a piece on the neck so the hand moves as little as possible.
 *
 * Done with a full pass rather than note by note, because a greedy choice
 * early on strands the hand: the open position is the obvious home for the
 * first phrase of many pieces and the wrong one for the piece as a whole.
 *
 * `transpose` shifts everything in semitones. Keyboard music often sits in a
 * register that is technically reachable on a guitar and horrible to play
 * there; dropping an octave is what a guitarist does, and recording it as a
 * shift keeps the stored pitches matching the published score.
 */
export function place(bars: TabNote[][], transpose = 0): Placed[][] {
  const flat = bars.flat();
  const options = flat.map((note) =>
    shapesFor(note.pitches.map((p) => toMidi(p) + transpose)),
  );

  // Shortest path: a shape costs what it asks of the hand where it sits, a
  // transition costs how far the hand has to travel to get there.
  const cost = options.map((shapes) =>
    shapes.map((stops) => {
      const open = stops.filter((s) => s.fret === 0).length;
      const fretted = stops.filter((s) => s.fret > 0).map((s) => s.fret);
      const span =
        fretted.length > 1 ? Math.max(...fretted) - Math.min(...fretted) : 0;
      return (position(stops) ?? 0) * 0.45 - open * 1.5 + span * 0.6;
    }),
  );
  const from = options.map((shapes) => shapes.map(() => -1));

  let previous = -1;
  for (let i = 0; i < flat.length; i++) {
    if (options[i].length === 0) continue;
    if (previous >= 0) {
      options[i].forEach((shape, k) => {
        let bestCost = Infinity;
        let bestIndex = -1;
        options[previous].forEach((prior, j) => {
          const total = cost[previous][j] + travel(prior, shape);
          if (total < bestCost) {
            bestCost = total;
            bestIndex = j;
          }
        });
        cost[i][k] += bestCost;
        from[i][k] = bestIndex;
      });
    }
    previous = i;
  }

  // Walk the cheapest path back to the start.
  const chosen = new Array<number>(flat.length).fill(-1);
  if (previous >= 0) {
    let k = cost[previous].indexOf(Math.min(...cost[previous]));
    for (let i = previous; i >= 0; i--) {
      if (options[i].length === 0) continue;
      chosen[i] = k;
      k = from[i][k];
      if (k < 0) break;
    }
  }

  let beat = 0;
  let cursor = 0;
  return bars.map((bar) =>
    bar.map((note) => {
      const i = cursor++;
      const placed: Placed = {
        note,
        stops: chosen[i] >= 0 ? options[i][chosen[i]] : [],
        at: beat,
      };
      beat += note.beats;
      return placed;
    }),
  );
}

/**
 * Render placed notes as the six-line grid everyone already knows how to
 * read. Column width follows the note length, so the rhythm is visible in
 * the spacing — plain tab notation carries no rhythm at all otherwise.
 */
export function render(bars: Placed[][]): string[] {
  // High E on top, as tab is always written.
  const lines = ["e", "B", "G", "D", "A", "E"].map((n) => `${n}|`);

  for (const bar of bars) {
    for (const placed of bar) {
      const width = columnWidth(placed);
      for (let row = 0; row < 6; row++) {
        const stop = placed.stops.find((s) => s.string === 5 - row);
        const mark = stop ? String(stop.fret) : "";
        lines[row] += (mark + "-".repeat(width)).slice(0, width);
      }
    }
    for (let row = 0; row < 6; row++) lines[row] += "|";
  }

  return lines;
}

/**
 * How many characters one event occupies. Wide enough for its longest fret
 * number, and otherwise proportional to how long the note is held.
 */
export function columnWidth(placed: Placed) {
  const digits = Math.max(
    1,
    ...placed.stops.map((s) => String(s.fret).length),
  );
  return Math.max(digits + 2, Math.round(placed.note.beats * 4));
}

export function totalBeats(bars: TabNote[][]) {
  return bars.flat().reduce((sum, n) => sum + n.beats, 0);
}
