import type { TabNote } from "@/lib/tab";

/**
 * A small book of classical melodies, as tab.
 *
 * Two deliberate limits, both stated on the page itself rather than buried
 * here. First, these are melody lines — the tune you would hum — not concert
 * arrangements; a full transcription of Recuerdos or Asturias is somebody's
 * copyrighted editorial work and also far more than a single stave can hold.
 * Second, every piece is old enough to be public domain, and each one links
 * to a free authoritative score so nobody has to trust this file.
 *
 * Notes are pitches, not frets. lib/tab.ts decides where on the neck each one
 * goes, which is the part a person gets wrong by hand.
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
  about: { th: string; en: string };
  /** Where to get the real score. */
  source: { label: string; url: string };
  bars: TabNote[][];
};

/** Shorthand: n("C4") is a crotchet C, n("C4", 0.5) a quaver, n(null) a rest. */
const n = (pitch: string | null, beats = 1): TabNote => ({ pitch, beats });

/** A triplet quaver: three of them fill one crotchet. */
const T = 1 / 3;

export const pieces: Piece[] = [
  {
    slug: "ode-to-joy",
    title: "Ode to Joy",
    composer: "Ludwig van Beethoven",
    year: "1824",
    key: { th: "ซี เมเจอร์", en: "C major" },
    meter: "4/4",
    tempo: 100,
    level: 1,
    about: {
      th: "ท่อนร้องจากซิมโฟนีหมายเลข 9 เล่นได้ด้วยสามสายบนล้วน ๆ เป็นเพลงแรกที่ดีมากสำหรับฝึกให้นิ้วขวาจำสาย",
      en: "The choral theme from the Ninth, and it sits on the top three strings. A good first piece for teaching the right hand which string is which.",
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
    ],
  },
  {
    slug: "fur-elise",
    title: "Für Elise",
    composer: "Ludwig van Beethoven",
    year: "1810",
    key: { th: "เอ ไมเนอร์", en: "A minor" },
    meter: "3/8",
    tempo: 76,
    level: 2,
    about: {
      th: "สี่ห้องแรก — ประโยคที่ทุกคนจำได้ สลับ E กับ D♯ เร็ว ๆ แล้วไหลลงมาหา A",
      en: "The first four bars — the phrase everybody can hum. E and D♯ traded quickly, then a fall to A.",
    },
    source: {
      label: "IMSLP — Bagatelle WoO 59",
      url: "https://imslp.org/wiki/Bagatelle_in_A_minor,_WoO_59_(Beethoven,_Ludwig_van)",
    },
    bars: [
      [n("E5", 0.25), n("D#5", 0.25), n("E5", 0.25), n("D#5", 0.25), n("E5", 0.25), n("B4", 0.25)],
      [n("D5", 0.5), n("C5", 0.5), n("A4", 0.5)],
      [n("C4", 0.5), n("E4", 0.5), n("A4", 0.5)],
      [n("B4", 0.5), n("E4", 0.5), n("G#4", 0.5)],
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
    about: {
      th: "อยู่ในสมุดโน้ตของอันนา มักดาเลนา บาค คนเลยเข้าใจกันมาสองร้อยปีว่าบาคแต่ง ที่จริงเป็นของเพ็ตโซลด์ หกห้องแรกครับ",
      en: "It sat in Anna Magdalena Bach's notebook, so for two centuries everyone credited Bach. It is Petzold's. First six bars here.",
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
    slug: "prelude-in-c",
    title: "Prelude in C, BWV 846",
    composer: "Johann Sebastian Bach",
    year: "1722",
    key: { th: "ซี เมเจอร์", en: "C major" },
    meter: "4/4",
    tempo: 72,
    level: 2,
    about: {
      th: "เปิด The Well-Tempered Clavier ทั้งเพลงเป็นอาร์เพจจิโอรูปเดียวซ้ำไปเรื่อย เปลี่ยนแค่คอร์ด ฝึกมือขวาได้ดีมาก",
      en: "The piece that opens The Well-Tempered Clavier. One arpeggio figure, repeated, with only the chord underneath changing — which makes it a right-hand exercise disguised as music.",
    },
    source: {
      label: "IMSLP — Well-Tempered Clavier I",
      url: "https://imslp.org/wiki/Das_wohltemperierte_Klavier_I,_BWV_846-869_(Bach,_Johann_Sebastian)",
    },
    bars: [
      [
        n("C3", 0.25), n("E3", 0.25), n("G3", 0.25), n("C4", 0.25), n("E4", 0.25), n("G3", 0.25), n("C4", 0.25), n("E4", 0.25),
        n("C3", 0.25), n("E3", 0.25), n("G3", 0.25), n("C4", 0.25), n("E4", 0.25), n("G3", 0.25), n("C4", 0.25), n("E4", 0.25),
      ],
      [
        n("C3", 0.25), n("D3", 0.25), n("A3", 0.25), n("D4", 0.25), n("F4", 0.25), n("A3", 0.25), n("D4", 0.25), n("F4", 0.25),
        n("C3", 0.25), n("D3", 0.25), n("A3", 0.25), n("D4", 0.25), n("F4", 0.25), n("A3", 0.25), n("D4", 0.25), n("F4", 0.25),
      ],
      [
        n("B2", 0.25), n("D3", 0.25), n("G3", 0.25), n("D4", 0.25), n("F4", 0.25), n("G3", 0.25), n("D4", 0.25), n("F4", 0.25),
        n("B2", 0.25), n("D3", 0.25), n("G3", 0.25), n("D4", 0.25), n("F4", 0.25), n("G3", 0.25), n("D4", 0.25), n("F4", 0.25),
      ],
      [
        n("C3", 0.25), n("E3", 0.25), n("G3", 0.25), n("C4", 0.25), n("E4", 0.25), n("G3", 0.25), n("C4", 0.25), n("E4", 0.25),
        n("C3", 0.25), n("E3", 0.25), n("G3", 0.25), n("C4", 0.25), n("E4", 0.25), n("G3", 0.25), n("C4", 0.25), n("E4", 0.25),
      ],
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
    about: {
      th: "เบโธเฟนไม่ได้ตั้งชื่อนี้ นักวิจารณ์ตั้งให้ทีหลัง สามเสียงวนไปเรื่อยแบบนี้ บนกีตาร์ต้องปล่อยให้เสียงค้างทับกัน",
      en: "Beethoven never called it that — a critic did, after he died. Three notes going round and round; on a guitar the trick is letting them ring into each other.",
    },
    source: {
      label: "IMSLP — Piano Sonata No. 14",
      url: "https://imslp.org/wiki/Piano_Sonata_No.14,_Op.27_No.2_(Beethoven,_Ludwig_van)",
    },
    bars: [
      // Triplet quavers: three to a crotchet, so each is a third of one.
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
  {
    slug: "canon-in-d",
    title: "Canon in D — the ground bass",
    composer: "Johann Pachelbel",
    year: "c. 1680",
    key: { th: "ดี เมเจอร์", en: "D major" },
    meter: "4/4",
    tempo: 64,
    level: 1,
    about: {
      th: "แปดโน้ตนี้วนซ้ำยี่สิบแปดรอบตลอดทั้งเพลง ทุกอย่างที่เหลือสร้างทับบนนี้ จำได้แล้วจะเริ่มได้ยินมันในเพลงป๊อปเต็มไปหมด",
      en: "These eight notes repeat twenty-eight times, and everything else in the piece is built on top of them. Learn it and you start hearing it in pop songs everywhere.",
    },
    source: {
      label: "IMSLP — Canon and Gigue in D",
      url: "https://imslp.org/wiki/Canon_and_Gigue_in_D_major,_P.37_(Pachelbel,_Johann)",
    },
    bars: [
      [n("D3", 2), n("A2", 2)],
      [n("B2", 2), n("F#2", 2)],
      [n("G2", 2), n("D3", 2)],
      [n("G2", 2), n("A2", 2)],
    ],
  },
];
