import { strict as assert } from "node:assert";
import test from "node:test";
import { pieces } from "../content/tabs.ts";
import { place, render, toMidi, totalBeats } from "./tab.ts";
import { TUNING } from "./chords.ts";

test("every pitch parses", () => {
  for (const piece of pieces) {
    for (const note of piece.bars.flat()) {
      for (const pitch of note.pitches) {
        assert.ok(Number.isFinite(toMidi(pitch)), `${piece.slug}: ${pitch}`);
      }
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
    const shift = piece.transpose ?? 0;
    for (const bar of place(piece.bars, shift)) {
      for (const placed of bar) {
        assert.equal(
          placed.stops.length,
          placed.note.pitches.length,
          `${piece.slug}: ${placed.note.pitches.join("+")} cannot be played`,
        );
        const wanted = placed.note.pitches
          .map((p) => toMidi(p) + shift)
          .sort((a, b) => a - b);
        placed.stops.forEach((stop, i) => {
          assert.equal(
            TUNING[stop.string] + stop.fret,
            wanted[i],
            `${piece.slug}: ${placed.note.pitches.join("+")} placed wrong`,
          );
        });
      }
    }
  }
});

test("notes struck together each get their own string", () => {
  for (const piece of pieces) {
    for (const bar of place(piece.bars, piece.transpose ?? 0)) {
      for (const placed of bar) {
        const strings = new Set(placed.stops.map((s) => s.string));
        assert.equal(
          strings.size,
          placed.stops.length,
          `${piece.slug}: two notes share a string at beat ${placed.at}`,
        );
      }
    }
  }
});

test("a hand can hold every chord the placer chooses", () => {
  for (const piece of pieces) {
    for (const bar of place(piece.bars, piece.transpose ?? 0)) {
      for (const placed of bar) {
        const frets = placed.stops.map((s) => s.fret).filter((f) => f > 0);
        if (frets.length < 2) continue;
        const span = Math.max(...frets) - Math.min(...frets);
        assert.ok(
          span <= 4,
          `${piece.slug}: a ${span}-fret stretch at beat ${placed.at}`,
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

test("each piece says what it contains", () => {
  for (const piece of pieces) {
    for (const locale of ["th", "en"] as const) {
      assert.ok(piece.scope[locale].length > 0, `${piece.slug} ${locale}`);
    }
  }
});

test("the rendered grid has six aligned lines", () => {
  for (const piece of pieces) {
    const lines = render(place(piece.bars, piece.transpose ?? 0));
    assert.equal(lines.length, 6, piece.slug);
    const width = lines[0].length;
    for (const line of lines) assert.equal(line.length, width, piece.slug);
    assert.ok(totalBeats(piece.bars) > 0, piece.slug);
  }
});
