import { strict as assert } from "node:assert";
import test from "node:test";
import { QUALITIES, ROOTS, chordName, findVoicings, rootName } from "./chords.ts";

const shape = (frets: number[]) =>
  frets.map((f) => (f < 0 ? "x" : f)).join("");

function best(root: string, qualityId: string) {
  const pc = ROOTS.find((p) => rootName(p) === root);
  assert.ok(pc !== undefined, `no root ${root}`);
  const quality = QUALITIES.find((q) => q.id === qualityId);
  assert.ok(quality, `no quality ${qualityId}`);
  const voicings = findVoicings(pc, quality);
  assert.ok(voicings.length > 0, `no voicings for ${root}${qualityId}`);
  return voicings;
}

/*
  The search is scored, not catalogued, so the open chords every guitarist
  already knows are the regression test: if a weight drifts far enough that
  the top result for C stops being x32010, the ranking has stopped describing
  how people actually play and the whole tool is quietly wrong.
*/
const CANONICAL: [root: string, quality: string, shape: string][] = [
  ["C", "maj", "x32010"],
  ["G", "maj", "320003"],
  ["D", "maj", "xx0232"],
  ["A", "maj", "x02220"],
  ["E", "maj", "022100"],
  ["F", "maj", "133211"],
  ["A", "m", "x02210"],
  ["E", "m", "022000"],
  ["D", "m", "xx0231"],
  ["C", "maj7", "x32000"],
  ["A", "m7", "x02010"],
  ["E", "m7", "020000"],
  ["G", "7", "320001"],
  ["B", "7", "x21202"],
  ["D", "sus4", "xx0233"],
  ["D", "sus2", "xx0230"],
];

for (const [root, quality, expected] of CANONICAL) {
  test(`${root}${quality === "maj" ? "" : quality} is ${expected}`, () => {
    assert.equal(shape(best(root, quality)[0].frets), expected);
  });
}

test("every root and quality yields at least one playable shape", () => {
  for (const pc of ROOTS) {
    for (const quality of QUALITIES) {
      const voicings = findVoicings(pc, quality);
      assert.ok(
        voicings.length > 0,
        `${chordName(pc, quality)} has no voicing`,
      );
    }
  }
});

test("a voicing only ever states notes that belong to the chord", () => {
  const tuning = [40, 45, 50, 55, 59, 64];
  for (const pc of ROOTS) {
    for (const quality of QUALITIES) {
      const allowed = new Set(quality.intervals.map((i) => (pc + i) % 12));
      for (const v of findVoicings(pc, quality)) {
        v.frets.forEach((fret, string) => {
          if (fret < 0) return;
          const note = (tuning[string] + fret) % 12;
          assert.ok(
            allowed.has(note),
            `${chordName(pc, quality)} ${shape(v.frets)} plays a foreign note`,
          );
        });
      }
    }
  }
});

test("a voicing never asks for more than four fingers", () => {
  for (const pc of ROOTS) {
    for (const quality of QUALITIES) {
      for (const v of findVoicings(pc, quality)) {
        const used = new Set(v.fingers.filter((f) => f > 0));
        assert.ok(
          used.size <= 4,
          `${chordName(pc, quality)} ${shape(v.frets)} needs ${used.size} fingers`,
        );
        // Every fretted string needs a finger, and no open string has one.
        v.frets.forEach((fret, string) => {
          assert.equal(
            v.fingers[string] > 0,
            fret > 0,
            `${chordName(pc, quality)} ${shape(v.frets)} string ${string}`,
          );
        });
      }
    }
  }
});

test("the root is always in the bass", () => {
  const tuning = [40, 45, 50, 55, 59, 64];
  for (const pc of ROOTS) {
    for (const quality of QUALITIES) {
      for (const v of findVoicings(pc, quality)) {
        const low = v.frets.findIndex((f) => f >= 0);
        assert.equal(
          (tuning[low] + v.frets[low]) % 12,
          pc,
          `${chordName(pc, quality)} ${shape(v.frets)} is an inversion`,
        );
      }
    }
  }
});
