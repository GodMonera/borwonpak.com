import type { TabNote } from "@/lib/tab";

/**
 * A small book of classical pieces, as tab.
 *
 * Everything here is public domain, and every entry links to a free
 * authoritative score so nobody has to take this file's word for anything.
 *
 * Notes are pitches, not frets. lib/tab.ts decides where on the neck each one
 * goes, which is the part a person gets wrong by hand.
 *
 * `scope` is not decoration. Some of these are complete; some are the main
 * section of a longer work. Writing "Für Elise" over fourteen bars when the
 * piece has a hundred is the kind of small lie that makes a tab book
 * untrustworthy, so each entry says exactly what it contains.
 */

export type Piece = {
  slug: string;
  title: string;
  composer: string;
  /** Year of composition, or the century for the anonymous ones. */
  year: string;
  key: { th: string; en: string };
  meter: string;
  /** Quarter notes per minute, at a comfortable practice speed. */
  tempo: number;
  /** Semitones to shift, where the written register does not suit a guitar. */
  transpose?: number;
  level: 1 | 2 | 3;
  /** Exactly how much of the work is here, and in how many voices. */
  scope: { th: string; en: string };
  about: { th: string; en: string };
  /** Where to get the real score. */
  source: { label: string; url: string };
  bars: TabNote[][];
};

/** A single note: n("C4") is a crotchet, n("C4", 0.5) a quaver. */
const n = (pitch: string, beats = 1): TabNote => ({ pitches: [pitch], beats });

/** Notes struck together — melody over a bass, or a chord. */
const c = (pitches: string[], beats = 1): TabNote => ({ pitches, beats });

/** A rest. */
const r = (beats = 1): TabNote => ({ pitches: [], beats });

/** A triplet quaver: three of them fill one crotchet. */
const T = 1 / 3;

/**
 * One bar of the C major prelude: Bach keeps the same eight-semiquaver figure
 * all the way through and changes only the harmony under it, so the bar is
 * written as its five notes and the figure is applied here.
 */
function preludeBar([a, b, d, e, f]: string[]): TabNote[] {
  const figure = [a, b, d, e, f, d, e, f];
  return [...figure, ...figure].map((pitch) => n(pitch, 0.25));
}

export const pieces: Piece[] = [
  {
    slug: "fur-elise",
    title: "Für Elise",
    composer: "Ludwig van Beethoven",
    year: "1810",
    key: { th: "เอ ไมเนอร์", en: "A minor" },
    meter: "3/8",
    tempo: 76,
    level: 2,
    scope: {
      th: "ท่อนหลัก (A) ครบทั้งท่อน สองแนวเสียง — ทำนองกับเบส",
      en: "The main section in full, in two voices — melody and bass",
    },
    about: {
      th: "ท่อนที่ทุกคนหมายถึงเวลาพูดถึงเพลงนี้ เล่นสองรอบแล้วจบลงที่ A minor — ตรงกับที่โน้ตเขียนไว้ ส่วนท่อน B (F เมเจอร์) กับท่อน C ที่ดุ ๆ ยังไม่ได้ใส่ เพราะผมไม่ได้จำมันแม่นพอที่จะเขียนโดยไม่เดา",
      en: "The section everyone means when they say Für Elise: the motif, its answer, both stated twice, resolving to A minor. The F major episode and the stormy one after it are not here — I do not remember them precisely enough to write them down without guessing.",
    },
    source: {
      label: "IMSLP — Bagatelle WoO 59",
      url: "https://imslp.org/wiki/Bagatelle_in_A_minor,_WoO_59_(Beethoven,_Ludwig_van)",
    },
    bars: [
      // Anacrusis — two semiquavers before the first full bar.
      [n("E5", 0.25), n("D#5", 0.25)],
      [n("E5", 0.25), n("D#5", 0.25), n("E5", 0.25), n("B4", 0.25), n("D5", 0.25), n("C5", 0.25)],
      [c(["A2", "A4"], 0.5), n("E3", 0.5), n("A3", 0.5)],
      [n("C4", 0.5), n("E4", 0.5), n("A4", 0.5)],
      [c(["E2", "B4"], 0.5), n("E3", 0.5), n("G#3", 0.5)],
      [n("E4", 0.5), n("G#4", 0.5), n("B4", 0.5)],
      [c(["A2", "C5"], 0.5), n("E3", 0.5), n("A3", 0.5)],
      [n("E4", 0.5), r(0.5), n("E5", 0.25), n("D#5", 0.25)],
      // Second time through.
      [n("E5", 0.25), n("D#5", 0.25), n("E5", 0.25), n("B4", 0.25), n("D5", 0.25), n("C5", 0.25)],
      [c(["A2", "A4"], 0.5), n("E3", 0.5), n("A3", 0.5)],
      [n("C4", 0.5), n("E4", 0.5), n("A4", 0.5)],
      [c(["E2", "B4"], 0.5), n("E3", 0.5), n("G#3", 0.5)],
      [n("E4", 0.5), n("G#4", 0.5), n("B4", 0.5)],
      [c(["A2", "C5"], 0.5), n("E3", 0.5), n("A3", 0.5)],
      [c(["A2", "A4"], 1.5)],
    ],
  },
  {
    slug: "ode-to-joy",
    title: "Ode to Joy",
    composer: "Ludwig van Beethoven",
    year: "1824",
    key: { th: "ซี เมเจอร์", en: "C major" },
    meter: "4/4",
    tempo: 100,
    level: 1,
    scope: {
      th: "ทำนองครบทั้งเพลง 16 ห้อง แนวเดียว",
      en: "The complete sixteen-bar theme, single voice",
    },
    about: {
      th: "ท่อนร้องจากซิมโฟนีหมายเลข 9 ทั้งท่อน — ประโยคหลักสองรอบ ท่อนกลางที่ไต่ขึ้น แล้วกลับมาประโยคหลักอีกครั้ง เล่นได้ด้วยสามสายบนล้วน ๆ",
      en: "The choral theme from the Ninth, all of it — the tune twice, the climbing middle phrase, then the tune again. It sits on the top three strings.",
    },
    source: {
      label: "IMSLP — Symphony No. 9",
      url: "https://imslp.org/wiki/Symphony_No.9,_Op.125_(Beethoven,_Ludwig_van)",
    },
    bars: [
      [n("E4"), n("E4"), n("F4"), n("G4")],
      [n("G4"), n("F4"), n("E4"), n("D4")],
      [n("C4"), n("C4"), n("D4"), n("E4")],
      [n("E4", 1.5), n("D4", 0.5), n("D4", 2)],
      [n("E4"), n("E4"), n("F4"), n("G4")],
      [n("G4"), n("F4"), n("E4"), n("D4")],
      [n("C4"), n("C4"), n("D4"), n("E4")],
      [n("D4", 1.5), n("C4", 0.5), n("C4", 2)],
      [n("D4"), n("D4"), n("E4"), n("C4")],
      [n("D4"), n("E4", 0.5), n("F4", 0.5), n("E4"), n("C4")],
      [n("D4"), n("E4", 0.5), n("F4", 0.5), n("E4"), n("D4")],
      [n("C4"), n("D4"), n("G3", 2)],
      [n("E4"), n("E4"), n("F4"), n("G4")],
      [n("G4"), n("F4"), n("E4"), n("D4")],
      [n("C4"), n("C4"), n("D4"), n("E4")],
      [n("D4", 1.5), n("C4", 0.5), n("C4", 2)],
    ],
  },
  {
    slug: "canon-in-d",
    title: "Canon in D",
    composer: "Johann Pachelbel",
    year: "c. 1680",
    key: { th: "ดี เมเจอร์", en: "D major" },
    meter: "4/4",
    tempo: 64,
    level: 2,
    scope: {
      th: "ท่อนเปิด สองแนวเสียง — เบสที่วนซ้ำทั้งเพลง กับทำนองแนวแรกที่วางทับ",
      en: "The opening, in two voices — the ground bass and the first melody over it",
    },
    about: {
      th: "แปดโน้ตเบสนี้วนซ้ำยี่สิบแปดรอบตลอดทั้งเพลง ทุกอย่างที่เหลือสร้างทับบนนี้ จำได้แล้วจะเริ่มได้ยินมันในเพลงป๊อปเต็มไปหมด",
      en: "The eight bass notes repeat twenty-eight times, and everything else in the piece is built on top of them. Learn it and you start hearing it in pop songs everywhere.",
    },
    source: {
      label: "IMSLP — Canon and Gigue in D",
      url: "https://imslp.org/wiki/Canon_and_Gigue_in_D_major,_P.37_(Pachelbel,_Johann)",
    },
    bars: [
      [c(["D3", "F#4"], 2), c(["A2", "E4"], 2)],
      [c(["B2", "D4"], 2), c(["F#2", "C#4"], 2)],
      [c(["G2", "B3"], 2), c(["D3", "A3"], 2)],
      [c(["G2", "B3"], 2), c(["A2", "C#4"], 2)],
    ],
  },
  {
    slug: "prelude-in-c",
    title: "Prelude in C, BWV 846",
    composer: "Johann Sebastian Bach",
    year: "1722",
    key: { th: "ซี เมเจอร์", en: "C major" },
    meter: "4/4",
    tempo: 72,
    level: 2,
    scope: {
      th: "สิบเอ็ดห้องแรก จากทั้งหมดสามสิบห้าห้อง",
      en: "The first eleven bars of thirty-five",
    },
    about: {
      th: "เปิด The Well-Tempered Clavier ทั้งเพลงเป็นอาร์เพจจิโอรูปเดียวซ้ำไปเรื่อย เปลี่ยนแค่คอร์ดข้างใต้ ที่นี่เลยเก็บแต่ละห้องเป็นโน้ตห้าตัว แล้วให้โปรแกรมกางเป็นรูปเดิมให้",
      en: "The piece that opens The Well-Tempered Clavier. One figure, repeated, with only the harmony underneath changing — so each bar is stored as its five notes and the figure is unfolded in code.",
    },
    source: {
      label: "IMSLP — Well-Tempered Clavier I",
      url: "https://imslp.org/wiki/Das_wohltemperierte_Klavier_I,_BWV_846-869_(Bach,_Johann_Sebastian)",
    },
    bars: [
      preludeBar(["C3", "E3", "G3", "C4", "E4"]),
      preludeBar(["C3", "D3", "A3", "D4", "F4"]),
      preludeBar(["B2", "D3", "G3", "D4", "F4"]),
      preludeBar(["C3", "E3", "G3", "C4", "E4"]),
      preludeBar(["C3", "E3", "A3", "E4", "A4"]),
      preludeBar(["C3", "D3", "F#3", "A3", "D4"]),
      preludeBar(["B2", "D3", "G3", "D4", "G4"]),
      preludeBar(["B2", "C3", "E3", "G3", "C4"]),
      preludeBar(["A2", "C3", "E3", "G3", "C4"]),
      preludeBar(["D3", "F#3", "A3", "C4", "F#4"]),
      preludeBar(["G2", "B2", "D3", "G3", "B3"]),
    ],
  },
  {
    slug: "minuet-in-g",
    title: "Minuet in G, BWV Anh. 114",
    composer: "Christian Petzold",
    year: "c. 1725",
    key: { th: "จี เมเจอร์", en: "G major" },
    meter: "3/4",
    tempo: 120,
    // Written for keyboard, where it runs up to G5 — the fifteenth fret of
    // the top string. An octave down puts the whole thing in open position.
    transpose: -12,
    level: 2,
    scope: {
      th: "ทำนองหกห้องแรก แนวเดียว",
      en: "The melody of the first six bars, single voice",
    },
    about: {
      th: "อยู่ในสมุดโน้ตของอันนา มักดาเลนา บาค คนเลยเข้าใจกันมาสองร้อยปีว่าบาคแต่ง ที่จริงเป็นของเพ็ตโซลด์",
      en: "It sat in Anna Magdalena Bach's notebook, so for two centuries everyone credited Bach. It is Petzold's.",
    },
    source: {
      label: "IMSLP — Notebook for Anna Magdalena Bach",
      url: "https://imslp.org/wiki/Notebook_for_Anna_Magdalena_Bach_(Bach,_Johann_Sebastian)",
    },
    bars: [
      [n("D5"), n("G4", 0.5), n("A4", 0.5), n("B4", 0.5), n("C5", 0.5)],
      [n("D5"), n("G4"), n("G4")],
      [n("E5"), n("C5", 0.5), n("D5", 0.5), n("E5", 0.5), n("F#5", 0.5)],
      [n("G5"), n("G4"), n("G4")],
      [n("C5"), n("D5", 0.5), n("C5", 0.5), n("B4", 0.5), n("A4", 0.5)],
      [n("B4"), n("C5", 0.5), n("B4", 0.5), n("A4", 0.5), n("G4", 0.5)],
    ],
  },
  {
    slug: "moonlight-sonata",
    title: "Moonlight Sonata, first movement",
    composer: "Ludwig van Beethoven",
    year: "1801",
    key: { th: "ซี♯ ไมเนอร์", en: "C♯ minor" },
    meter: "4/4",
    tempo: 54,
    level: 3,
    scope: {
      th: "สี่ห้องแรก แนวอาร์เพจจิโออย่างเดียว",
      en: "The first four bars, the arpeggio figure only",
    },
    about: {
      th: "เบโธเฟนไม่ได้ตั้งชื่อนี้ นักวิจารณ์ตั้งให้ทีหลัง สามเสียงวนไปเรื่อยแบบนี้ บนกีตาร์ต้องปล่อยให้เสียงค้างทับกัน",
      en: "Beethoven never called it that — a critic did, after he died. Three notes going round and round; on a guitar the trick is letting them ring into each other.",
    },
    source: {
      label: "IMSLP — Piano Sonata No. 14",
      url: "https://imslp.org/wiki/Piano_Sonata_No.14,_Op.27_No.2_(Beethoven,_Ludwig_van)",
    },
    bars: [
      [
        n("G#3", T), n("C#4", T), n("E4", T), n("G#3", T), n("C#4", T), n("E4", T),
        n("G#3", T), n("C#4", T), n("E4", T), n("G#3", T), n("C#4", T), n("E4", T),
      ],
      [
        n("G#3", T), n("C#4", T), n("E4", T), n("G#3", T), n("C#4", T), n("E4", T),
        n("G#3", T), n("C#4", T), n("E4", T), n("G#3", T), n("C#4", T), n("E4", T),
      ],
      [
        n("A3", T), n("C#4", T), n("E4", T), n("A3", T), n("C#4", T), n("E4", T),
        n("A3", T), n("D4", T), n("F#4", T), n("A3", T), n("D4", T), n("F#4", T),
      ],
      [
        n("G#3", T), n("B#3", T), n("F#4", T), n("G#3", T), n("B#3", T), n("F#4", T),
        n("G#3", T), n("C#4", T), n("E4", T), n("G#3", T), n("C#4", T), n("E4", T),
      ],
    ],
  },
];
