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
  /** null is a rest. */
  pitch: string | null;
  /**
   * Length in quarter notes — 1 is a crotchet, 0.5 a quaver, 2 a minim.
   * Always quarter notes, never "one beat of whatever the meter says", so a
   * 3/8 bar and a 3/4 bar cannot quietly mean the same number here.
   */
  beats: number;
};

export type Placed = {
  note: TabNote;
  midi: number | null;
  /** Index into TUNING, 0 being the low E. null for a rest. */
  string: number | null;
  fret: number | null;
  /** Quarter notes elapsed since the start of the piece. */
  at: number;
};

/**
 * Place a melody on the neck so the hand moves as little as possible.
 *
 * `transpose` shifts the whole piece in semitones. Keyboard music often sits
 * in a register that is technically reachable on a guitar and horrible to
 * play there; dropping an octave is what a guitarist does, and recording it
 * as a shift keeps the stored pitches matching the published score.
 *
 * Done with a full pass rather than note by note, because a greedy choice
 * early on strands the hand: the open position is the obvious home for the
 * first phrase of many pieces and the wrong one for the piece as a whole.
 */
export function place(bars: TabNote[][], transpose = 0): Placed[][] {
  const flat = bars.flat();

  const options = flat.map((note) => {
    if (note.pitch === null) return [];
    const midi = toMidi(note.pitch) + transpose;
    const choices: { string: number; fret: number }[] = [];
    TUNING.forEach((open, string) => {
      const fret = midi - open;
      if (fret >= 0 && fret <= MAX_FRET) choices.push({ string, fret });
    });
    return choices;
  });

  // Shortest path: cost of a note is how high up the neck it sits, cost of a
  // transition is how far the hand and the picking finger have to travel.
  const cost: number[][] = [];
  const from: number[][] = [];

  for (let i = 0; i < flat.length; i++) {
    cost[i] = options[i].map((o) => o.fret * 0.3 + (o.fret === 0 ? -1.5 : 0));
    from[i] = options[i].map(() => -1);
  }

  let previous = -1;
  for (let i = 0; i < flat.length; i++) {
    if (options[i].length === 0) continue;
    if (previous >= 0) {
      options[i].forEach((option, k) => {
        let bestCost = Infinity;
        let bestIndex = -1;
        options[previous].forEach((prior, j) => {
          const move =
            Math.abs(option.fret - prior.fret) * 1.0 +
            Math.abs(option.string - prior.string) * 0.4;
          const total = cost[previous][j] + move;
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
      const pick = chosen[i] >= 0 ? options[i][chosen[i]] : null;
      const placed: Placed = {
        note,
        midi: note.pitch === null ? null : toMidi(note.pitch) + transpose,
        string: pick ? pick.string : null,
        fret: pick ? pick.fret : null,
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
      const width = Math.max(3, Math.round(placed.note.beats * 4));
      for (let row = 0; row < 6; row++) {
        const string = 5 - row;
        const mark =
          placed.string === string && placed.fret !== null
            ? String(placed.fret)
            : "";
        lines[row] += (mark + "-".repeat(width)).slice(0, width);
      }
    }
    for (let row = 0; row < 6; row++) lines[row] += "|";
  }

  return lines;
}

export function totalBeats(bars: TabNote[][]) {
  return bars.flat().reduce((sum, n) => sum + n.beats, 0);
}
