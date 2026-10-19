/**
 * Guitar chord theory, computed rather than catalogued.
 *
 * Listing "every chord" by hand is a losing game — twelve roots times a few
 * dozen qualities times every playable voicing runs to thousands of shapes,
 * and a hand-typed table of that size is wrong somewhere by the second page.
 * So nothing here is a stored shape: a chord is a set of pitch classes, and
 * the voicings come out of a search over the fretboard at request time.
 *
 * Everything is pure and dependency-free, so the search runs in the browser.
 */

/** Standard tuning, low E to high E, as MIDI note numbers. */
export const TUNING = [40, 45, 50, 55, 59, 64];

/** Past this the diagram stops being useful on an acoustic. */
const MAX_FRET = 12;

/** How far apart the lowest and highest fretted notes may sit. */
const MAX_SPAN = 4;

/* ------------------------------------------------------------------ */
/* Notes                                                               */
/* ------------------------------------------------------------------ */

/**
 * Both spellings, because the same pitch is called D♯ in one key and E♭ in
 * the next and guitarists use whichever the chart used.
 */
export const PITCH_NAMES: { sharp: string; flat: string }[] = [
  { sharp: "C", flat: "C" },
  { sharp: "C♯", flat: "D♭" },
  { sharp: "D", flat: "D" },
  { sharp: "D♯", flat: "E♭" },
  { sharp: "E", flat: "E" },
  { sharp: "F", flat: "F" },
  { sharp: "F♯", flat: "G♭" },
  { sharp: "G", flat: "G" },
  { sharp: "G♯", flat: "A♭" },
  { sharp: "A", flat: "A" },
  { sharp: "A♯", flat: "B♭" },
  { sharp: "B", flat: "B" },
];

/** The twelve roots, spelled the way a chord chart usually spells them. */
export const ROOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export function rootName(pc: number) {
  // Flats read better for the three roots a chart almost always writes flat.
  const preferFlat = pc === 3 || pc === 8 || pc === 10;
  return preferFlat ? PITCH_NAMES[pc].flat : PITCH_NAMES[pc].sharp;
}

export function midiToFreq(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/* ------------------------------------------------------------------ */
/* Qualities                                                           */
/* ------------------------------------------------------------------ */

export type QualityGroup = "triad" | "seventh" | "extended" | "altered";

export type Quality = {
  id: string;
  /** What gets written after the root: the "m7" of "Am7". */
  symbol: string;
  group: QualityGroup;
  name: { th: string; en: string };
  note: { th: string; en: string };
  /** Semitones above the root. */
  intervals: number[];
  /**
   * Intervals a voicing is allowed to drop. Six strings and four fingers
   * cannot state a thirteenth chord in full, and players never try — the
   * fifth goes first, then the root once the bass has it covered.
   */
  omit?: number[];
};

export const QUALITIES: Quality[] = [
  {
    id: "maj",
    symbol: "",
    group: "triad",
    name: { th: "เมเจอร์", en: "Major" },
    note: { th: "คอร์ดสว่าง ตรงไปตรงมา", en: "Bright and plain-spoken" },
    intervals: [0, 4, 7],
  },
  {
    id: "m",
    symbol: "m",
    group: "triad",
    name: { th: "ไมเนอร์", en: "Minor" },
    note: { th: "ลดเสียงที่สามลงครึ่งเสียง เศร้าขึ้นทันที", en: "Drop the third a semitone and it turns sad" },
    intervals: [0, 3, 7],
  },
  {
    id: "5",
    symbol: "5",
    group: "triad",
    name: { th: "พาวเวอร์คอร์ด", en: "Power chord" },
    note: { th: "ไม่มีเสียงที่สาม เลยไม่สุขไม่เศร้า ใช้กับเสียงแตกได้ดี", en: "No third at all, so it is neither — which is why it survives distortion" },
    intervals: [0, 7],
  },
  {
    id: "sus2",
    symbol: "sus2",
    group: "triad",
    name: { th: "ซัสสอง", en: "Suspended 2nd" },
    note: { th: "เอาเสียงที่สามออก ใส่ที่สองแทน ฟังลอย ๆ ค้างไว้", en: "The third swapped for a second — it hangs, unresolved" },
    intervals: [0, 2, 7],
  },
  {
    id: "sus4",
    symbol: "sus4",
    group: "triad",
    name: { th: "ซัสสี่", en: "Suspended 4th" },
    note: { th: "ตึงกว่า sus2 อยากคลายกลับไปหาเมเจอร์", en: "Tenser than sus2, and it wants to fall back to the major" },
    intervals: [0, 5, 7],
  },
  {
    id: "dim",
    symbol: "dim",
    group: "triad",
    name: { th: "ดิมินิช", en: "Diminished" },
    note: { th: "อึดอัด ใช้เป็นสะพานผ่าน ไม่ค่อยใช้จบเพลง", en: "Uneasy — a bridge between chords, rarely a destination" },
    intervals: [0, 3, 6],
  },
  {
    id: "aug",
    symbol: "aug",
    group: "triad",
    name: { th: "ออกเมนท์", en: "Augmented" },
    note: { th: "ยืดเสียงที่ห้าขึ้น ฟังเหมือนกำลังจะเกิดอะไรขึ้น", en: "The fifth stretched upward — it sounds like something is about to happen" },
    intervals: [0, 4, 8],
  },
  {
    id: "6",
    symbol: "6",
    group: "seventh",
    name: { th: "ซิกซ์", en: "Sixth" },
    note: { th: "เมเจอร์ที่นุ่มขึ้น ติดกลิ่นเพลงเก่า", en: "A softened major with an old-recording warmth" },
    intervals: [0, 4, 7, 9],
    omit: [7],
  },
  {
    id: "m6",
    symbol: "m6",
    group: "seventh",
    name: { th: "ไมเนอร์ซิกซ์", en: "Minor sixth" },
    note: { th: "เศร้าแต่ไม่หม่น มีความเท่แบบบอสซาโนวา", en: "Sad without the gloom — the bossa nova flavour" },
    intervals: [0, 3, 7, 9],
    omit: [7],
  },
  {
    id: "7",
    symbol: "7",
    group: "seventh",
    name: { th: "โดมินันต์เซเวนท์", en: "Dominant 7th" },
    note: { th: "คอร์ดบลูส์ ดึงให้อยากไปต่อ", en: "The blues chord. It pulls, hard, toward somewhere else" },
    intervals: [0, 4, 7, 10],
    omit: [7],
  },
  {
    id: "maj7",
    symbol: "maj7",
    group: "seventh",
    name: { th: "เมเจอร์เซเวนท์", en: "Major 7th" },
    note: { th: "หวานและนิ่ง ใช้เยอะมากใน fingerstyle", en: "Sweet and settled — a fingerstyle favourite" },
    intervals: [0, 4, 7, 11],
    omit: [7],
  },
  {
    id: "m7",
    symbol: "m7",
    group: "seventh",
    name: { th: "ไมเนอร์เซเวนท์", en: "Minor 7th" },
    note: { th: "เศร้าแบบนุ่ม ๆ ไม่ดราม่า", en: "Melancholy with the drama taken out" },
    intervals: [0, 3, 7, 10],
    omit: [7],
  },
  {
    id: "mMaj7",
    symbol: "mMaj7",
    group: "seventh",
    name: { th: "ไมเนอร์เมเจอร์เซเวนท์", en: "Minor-major 7th" },
    note: { th: "ไมเนอร์ที่มีเสียงบนแหลมค้าง ฟังเหมือนหนังสายลับ", en: "A minor with a sharp top note — pure spy film" },
    intervals: [0, 3, 7, 11],
    omit: [7],
  },
  {
    id: "m7b5",
    symbol: "m7♭5",
    group: "seventh",
    name: { th: "ฮาล์ฟดิมินิช", en: "Half-diminished" },
    note: { th: "ทางผ่านเข้าหาไมเนอร์ เจอบ่อยในแจ๊ส", en: "The way into a minor key. Jazz runs on it" },
    intervals: [0, 3, 6, 10],
  },
  {
    id: "dim7",
    symbol: "dim7",
    group: "seventh",
    name: { th: "ดิมินิชเซเวนท์", en: "Diminished 7th" },
    note: { th: "สมมาตรทุกสามเฟร็ต เลื่อนรูปเดิมได้ทั้งคอ", en: "Symmetrical every three frets — the same shape slides anywhere" },
    intervals: [0, 3, 6, 9],
  },
  {
    id: "7sus4",
    symbol: "7sus4",
    group: "seventh",
    name: { th: "เซเวนท์ซัสสี่", en: "7sus4" },
    note: { th: "ค้างไว้ก่อนลงคอร์ดจริง ใช้เปิดเพลงได้ดี", en: "Held back before the real chord lands — a good way to open" },
    intervals: [0, 5, 7, 10],
    omit: [7],
  },
  {
    id: "add9",
    symbol: "add9",
    group: "extended",
    name: { th: "แอดไนน์", en: "Add 9" },
    note: { th: "เมเจอร์บวกเสียงที่เก้า เปิดโปร่งขึ้นโดยไม่เปลี่ยนอารมณ์", en: "A major with a ninth stacked on — roomier, same mood" },
    intervals: [0, 2, 4, 7],
    omit: [7],
  },
  {
    id: "madd9",
    symbol: "m(add9)",
    group: "extended",
    name: { th: "ไมเนอร์แอดไนน์", en: "Minor add 9" },
    note: { th: "ไมเนอร์ที่ฟังกว้างขึ้น ไม่อึดอัด", en: "A minor that breathes" },
    intervals: [0, 2, 3, 7],
    omit: [7],
  },
  {
    id: "9",
    symbol: "9",
    group: "extended",
    name: { th: "ไนน์", en: "Dominant 9th" },
    note: { th: "เซเวนท์ที่ใส่สีเพิ่ม กลิ่นฟังก์", en: "A seventh with colour added. Funk lives here" },
    intervals: [0, 2, 4, 7, 10],
    omit: [7],
  },
  {
    id: "maj9",
    symbol: "maj9",
    group: "extended",
    name: { th: "เมเจอร์ไนน์", en: "Major 9th" },
    note: { th: "กว้างและใส เหมาะกับคอร์ดจบแบบไม่ฟันธง", en: "Wide and clear — a last chord that does not insist" },
    intervals: [0, 2, 4, 7, 11],
    omit: [7],
  },
  {
    id: "m9",
    symbol: "m9",
    group: "extended",
    name: { th: "ไมเนอร์ไนน์", en: "Minor 9th" },
    note: { th: "ไมเนอร์เซเวนท์แบบหรูขึ้น นีโอโซลชอบใช้", en: "A minor 7th dressed up. Neo-soul leans on it" },
    intervals: [0, 2, 3, 7, 10],
    omit: [7],
  },
  {
    id: "11",
    symbol: "11",
    group: "extended",
    name: { th: "อีเลเวน", en: "Dominant 11th" },
    note: { th: "เสียงที่สามมักถูกตัดทิ้ง เพราะชนกับที่สิบเอ็ด", en: "The third usually goes, because it fights the eleventh" },
    intervals: [0, 5, 7, 10, 2],
    omit: [7, 2],
  },
  {
    id: "13",
    symbol: "13",
    group: "extended",
    name: { th: "เธอร์ทีน", en: "Dominant 13th" },
    note: { th: "หกสายบอกครบไม่ได้ ต้องเลือกตัดบางเสียงทิ้ง", en: "Six strings cannot say all of it — something has to go" },
    intervals: [0, 4, 7, 10, 9],
    omit: [7],
  },
  {
    id: "7b9",
    symbol: "7♭9",
    group: "altered",
    name: { th: "เซเวนท์แฟลตไนน์", en: "7♭9" },
    note: { th: "ตึงมาก ใช้ดึงกลับเข้าคอร์ดไมเนอร์", en: "Very tense — it drags you back to a minor" },
    intervals: [0, 1, 4, 7, 10],
    omit: [7],
  },
  {
    id: "7s9",
    symbol: "7♯9",
    group: "altered",
    name: { th: "เซเวนท์ชาร์ปไนน์", en: "7♯9" },
    note: { th: "มีทั้งเสียงเมเจอร์และไมเนอร์พร้อมกัน คอร์ดของจิมิ เฮนดริกซ์", en: "Major and minor at once — the Hendrix chord" },
    intervals: [0, 3, 4, 7, 10],
    omit: [7],
  },
  {
    id: "7s5",
    symbol: "7♯5",
    group: "altered",
    name: { th: "เซเวนท์ชาร์ปไฟว์", en: "7♯5" },
    note: { th: "เซเวนท์ที่ห้ายืดขึ้น เอนเอียงไปทางโฮลโทน", en: "A seventh with the fifth stretched — it tips into whole-tone" },
    intervals: [0, 4, 8, 10],
  },
  {
    id: "7b5",
    symbol: "7♭5",
    group: "altered",
    name: { th: "เซเวนท์แฟลตไฟว์", en: "7♭5" },
    note: { th: "ห้าลดลง ฟังเบี้ยวกำลังดี", en: "The fifth flattened — crooked in a useful way" },
    intervals: [0, 4, 6, 10],
  },
];

export const QUALITY_GROUPS: { id: QualityGroup; label: { th: string; en: string } }[] = [
  { id: "triad", label: { th: "สามเสียง", en: "Triads" } },
  { id: "seventh", label: { th: "เซเวนท์", en: "Sevenths" } },
  { id: "extended", label: { th: "ขยายเสียง", en: "Extended" } },
  { id: "altered", label: { th: "แปลงเสียง", en: "Altered" } },
];

export function chordName(rootPc: number, quality: Quality) {
  return rootName(rootPc) + quality.symbol;
}

/** The chord spelled out as note names, root first. */
export function chordTones(rootPc: number, quality: Quality) {
  return quality.intervals.map((i) => rootName((rootPc + i) % 12));
}

/* ------------------------------------------------------------------ */
/* Voicing search                                                      */
/* ------------------------------------------------------------------ */

export type Voicing = {
  /** Per string, low E first. -1 muted, 0 open, n fretted at fret n. */
  frets: number[];
  /** Per string, 0 where no finger is needed, else 1 (index) to 4 (little). */
  fingers: number[];
  /** A barre, if the shape has one. Strings are indexes into `frets`. */
  barre: { fret: number; from: number; to: number } | null;
  /** Lowest fret the diagram should start at. 1 means "at the nut". */
  baseFret: number;
  /** Lowest fretted fret — the hand position, 0 for an all-open shape. */
  position: number;
  /** How many strings actually sound. */
  voices: number;
  /** Lower is easier to hold. Only meaningful for ordering. */
  difficulty: number;
};

/**
 * Every shape on the neck that states the chord and that a hand can hold.
 *
 * Returned root-position only — the lowest sounding string is always the
 * root. Slash chords and inversions are a different question and would
 * double the result count for every chord, most of which nobody asked for.
 */
export function findVoicings(rootPc: number, quality: Quality): Voicing[] {
  const pcs = quality.intervals.map((i) => (rootPc + i) % 12);
  const omit = new Set(quality.omit ?? []);
  const required = quality.intervals
    .filter((i) => !omit.has(i))
    .map((i) => (rootPc + i) % 12);
  const minVoices = Math.min(pcs.length, quality.intervals.length >= 4 ? 4 : 3);

  const seen = new Set<string>();
  const found: Voicing[] = [];

  // Search one hand position at a time. Scanning the whole neck at once would
  // be 13^6 combinations; a window is at most four options per string.
  for (let window = 0; window + MAX_SPAN <= MAX_FRET + 1; window++) {
    const options: number[][] = TUNING.map((open) => {
      const choices = [-1];
      if (pcs.includes(open % 12)) choices.push(0);
      for (let f = Math.max(window, 1); f <= window + MAX_SPAN; f++) {
        if (f <= MAX_FRET && pcs.includes((open + f) % 12)) choices.push(f);
      }
      return choices;
    });

    const frets = new Array<number>(6);

    const walk = (s: number) => {
      if (s === 6) {
        const voicing = evaluate(frets, required, minVoices, window);
        if (voicing) {
          const key = voicing.frets.join(",");
          if (!seen.has(key)) {
            seen.add(key);
            found.push(voicing);
          }
        }
        return;
      }
      for (const f of options[s]) {
        frets[s] = f;
        walk(s + 1);
      }
    };

    walk(0);
  }

  // Group by hand position so the list reads as "your options up the neck"
  // rather than six near-identical fingerings of the same spot. Two shapes
  // per position, and the second only if it sounds just as full — otherwise
  // it is the thin version of the one already shown.
  const byPosition = new Map<number, Voicing[]>();
  for (const v of found.sort((a, b) => a.difficulty - b.difficulty)) {
    const at = byPosition.get(v.position) ?? [];
    if (at.length === 0 || (at.length === 1 && at[0].voices === v.voices)) {
      at.push(v);
      byPosition.set(v.position, at);
    }
  }

  // Easiest first rather than lowest position first. Each diagram carries its
  // own fret marker, so the up-the-neck story survives, and the shape people
  // came for is the one at the front.
  return [...byPosition.values()]
    .flat()
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, 6);
}

function evaluate(
  frets: number[],
  required: number[],
  minVoices: number,
  window: number,
): Voicing | null {
  const sounding: number[] = [];
  for (let s = 0; s < 6; s++) if (frets[s] >= 0) sounding.push(s);
  if (sounding.length < minVoices) return null;

  // A muted string in the middle of sounding ones is playable but ugly to
  // read and to mute cleanly, so shapes are kept contiguous.
  if (sounding[sounding.length - 1] - sounding[0] !== sounding.length - 1) {
    return null;
  }

  // Root in the bass.
  const bass = sounding[0];
  if ((TUNING[bass] + frets[bass]) % 12 !== required[0]) return null;

  const present = new Set(sounding.map((s) => (TUNING[s] + frets[s]) % 12));
  for (const pc of required) if (!present.has(pc)) return null;

  const fretted = sounding.filter((s) => frets[s] > 0);
  let span = 0;
  let lowest = 0;
  if (fretted.length > 0) {
    const values = fretted.map((s) => frets[s]);
    lowest = Math.min(...values);
    span = Math.max(...values) - lowest;
    if (span > MAX_SPAN) return null;
    // Keep each shape to the window that found it, so the same shape is not
    // rediscovered and re-scored once per window it happens to fit inside.
    if (lowest !== Math.max(window, 1)) return null;
  } else if (window > 0) {
    // An all-open shape belongs to the first window only.
    return null;
  }

  const barre = findBarre(frets, fretted, lowest);
  const fingerCount = barre
    ? 1 + fretted.filter((s) => frets[s] !== lowest).length
    : fretted.length;
  if (fingerCount > 4) return null;

  /*
    Ring, weighed against effort.

    The search turns up plenty of three-string shapes that spell the chord
    correctly and are trivially easy to hold — x320xx is a real C major — but
    nobody plays them, because a chord is meant to sound like one. Sounding
    strings therefore carry the heaviest term.

    Not heavy enough to win at any price, though. Left unbounded it starts
    preferring six strings at the tenth fret with two open ones underneath
    over the four-string D everyone plays. So position is priced in, and
    steeply: a guitarist plays at the nut unless there is a reason not to,
    and climbing the neck is always a deliberate choice.

    Between those two terms the familiar open shapes come out on top on their
    own — there is no table of "approved" fingerings anywhere in this file.
    lib/chords.test.ts pins the ones everybody already knows, so a later
    tweak to these weights cannot quietly stop describing how people play.
  */
  const open = sounding.filter((s) => frets[s] === 0).length;
  const difficulty =
    fingerCount * 2 +
    span * 1.5 +
    (barre ? 1.2 : 0) +
    lowest * 1.6 -
    open * 0.8 -
    sounding.length * 2.2;

  return {
    frets: [...frets],
    fingers: assignFingers(frets, fretted, barre, lowest),
    barre,
    baseFret: fretted.length === 0 ? 1 : lowest + span <= 4 ? 1 : lowest,
    position: fretted.length === 0 ? 0 : lowest,
    voices: sounding.length,
    difficulty,
  };
}

/**
 * A barre is one finger lying flat across several strings at the same fret.
 * It only works if nothing under it is open or muted — a finger cannot hover
 * over a string it is lying across.
 *
 * Three strings is the floor. Two adjacent notes at the same fret are what
 * the index and middle finger are for: calling the second fret of an open Em
 * a barre would be true geometrically and wrong as advice.
 */
function findBarre(frets: number[], fretted: number[], lowest: number) {
  const at = fretted.filter((s) => frets[s] === lowest);
  if (at.length < 2) return null;
  const from = at[0];
  const to = at[at.length - 1];
  if (to - from < 2) return null;
  for (let s = from; s <= to; s++) {
    if (frets[s] < lowest) return null;
  }
  return { fret: lowest, from, to };
}

/**
 * Which finger goes where.
 *
 * The rule is the one a teacher gives: the barre takes the index, then work
 * upward through the frets, and within a fret from the thickest string to
 * the thinnest. That reproduces the textbook fingering for the open shapes
 * and for both movable barre forms.
 */
function assignFingers(
  frets: number[],
  fretted: number[],
  barre: { fret: number } | null,
  lowest: number,
): number[] {
  const fingers = new Array(6).fill(0);
  let next = 1;

  if (barre) {
    for (const s of fretted) if (frets[s] === lowest) fingers[s] = 1;
    next = 2;
  }

  const rest = fretted
    .filter((s) => !(barre && frets[s] === lowest))
    .sort((a, b) => frets[a] - frets[b] || a - b);

  for (const s of rest) {
    fingers[s] = next;
    next += 1;
  }

  return fingers;
}
