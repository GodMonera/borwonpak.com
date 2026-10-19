import { strict as assert } from "node:assert";
import test from "node:test";
import { pieces } from "../content/tabs.ts";
import { place, render, toMidi, totalBeats } from "./tab.ts";
import { TUNING } from "./chords.ts";

test("every pitch parses", () => {
  for (const piece of pieces) {
    for (const note of piece.bars.flat()) {
      if (note.pitch === null) continue;
      assert.ok(
        Number.isFinite(toMidi(note.pitch)),
        `${piece.slug}: ${note.pitch}`,
      );
    }
  }
});

/*
  The placer silently leaves a note off the grid when it cannot reach it, so
  a pitch below the open low E — or above the top of the neck — would vanish
  from the tab without anyone noticing. This is the guard against that.
*/
test("every note is reachable on a guitar in standard tuning", () => {
  for (const piece of pieces) {
    for (const bar of place(piece.bars)) {
      for (const placed of bar) {
        if (placed.note.pitch === null) continue;
        assert.ok(
          placed.string !== null && placed.fret !== null,
          `${piece.slug}: ${placed.note.pitch} cannot be played`,
        );
        assert.equal(
          TUNING[placed.string] + placed.fret,
          placed.midi,
          `${piece.slug}: ${placed.note.pitch} placed on the wrong note`,
        );
      }
    }
  }
});

test("bars hold the number of beats their meter promises", () => {
  for (const piece of pieces) {
    const [count, unit] = piece.meter.split("/").map(Number);
    // Durations are in quarter notes, so a 3/8 bar is 1.5 of them.
    const expected = count * (4 / unit);
    piece.bars.forEach((bar, i) => {
      const got = bar.reduce((sum, note) => sum + note.beats, 0);
      // A pickup bar is allowed to be short; nothing may be long.
      assert.ok(
        got <= expected + 1e-6,
        `${piece.slug} bar ${i + 1}: ${got} quarter notes in a ${piece.meter} bar (max ${expected})`,
      );
    });
  }
});

test("the rendered grid has six aligned lines", () => {
  for (const piece of pieces) {
    const lines = render(place(piece.bars));
    assert.equal(lines.length, 6, piece.slug);
    const width = lines[0].length;
    for (const line of lines) assert.equal(line.length, width, piece.slug);
    assert.ok(totalBeats(piece.bars) > 0, piece.slug);
  }
});
