"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Standard tuning, low E to high E, as MIDI note numbers.
 * Index 0 is the low E string, drawn at the bottom of the diagram.
 */
const OPEN_STRINGS = [40, 45, 50, 55, 59, 64];
const FRETS = 5;

/** -1 means the string is muted; 0 means played open. */
type Shape = [number, number, number, number, number, number];

const CHORDS: { name: string; shape: Shape; note: { th: string; en: string } }[] =
  [
    {
      name: "C",
      shape: [-1, 3, 2, 0, 1, 0],
      note: { th: "คอร์ดแรกที่ทุกคนเจอ", en: "Everyone's first chord" },
    },
    {
      name: "Cadd9",
      shape: [-1, 3, 2, 0, 3, 3],
      note: {
        th: "C ที่เปิดกว้างขึ้น ใช้บ่อยมากใน fingerstyle",
        en: "A roomier C — a fingerstyle staple",
      },
    },
    {
      name: "G",
      shape: [3, 2, 0, 0, 0, 3],
      note: { th: "สายเปล่าสามสายทำให้เสียงกังวาน", en: "Three open strings ring out" },
    },
    {
      name: "G/B",
      shape: [-1, 2, 0, 0, 0, 3],
      note: {
        th: "G ที่ย้ายเบสไปที่ B ใช้เดินเบสลงเป็นขั้น",
        en: "G with B in the bass, for a stepwise walk-down",
      },
    },
    {
      name: "Dsus2",
      shape: [-1, -1, 0, 2, 3, 0],
      note: {
        th: "ไม่มีโน้ตตัวที่สาม เลยฟังลอย ๆ ไม่สุขไม่เศร้า",
        en: "No third, so it sits between happy and sad",
      },
    },
    {
      name: "Em7",
      shape: [0, 2, 0, 0, 0, 0],
      note: { th: "กดนิ้วเดียว ได้ทั้งหกสาย", en: "One finger, all six strings" },
    },
    {
      name: "Am",
      shape: [-1, 0, 2, 2, 1, 0],
      note: { th: "คอร์ดเศร้าประจำบ้าน", en: "The house melancholy chord" },
    },
    {
      name: "Fmaj7",
      shape: [-1, -1, 3, 2, 1, 0],
      note: {
        th: "F แบบไม่ต้องทาบ ชีวิตดีขึ้นมาก",
        en: "F without the barre — life gets much easier",
      },
    },
  ];

function midiToFreq(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function Fretboard({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const chord = CHORDS[index];

  function pluck(midi: number, delay: number) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const start = ctx.currentTime + delay;

    // A triangle wave with a fast attack and a long decay reads as "plucked"
    // far better than a sine, without pulling in a sample library.
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = midiToFreq(midi);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.2);

    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2600;

    osc.connect(tone).connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 2.3);
  }

  function strum() {
    // The context must be created from a user gesture or browsers keep it suspended.
    ctxRef.current ??= new AudioContext();
    void ctxRef.current.resume();

    let step = 0;
    chord.shape.forEach((fret, string) => {
      if (fret < 0) return;
      pluck(OPEN_STRINGS[string] + fret, step * 0.045);
      step += 1;
    });
  }

  // Geometry of the diagram, in SVG units.
  const W = 260;
  const H = 180;
  const left = 34;
  const top = 26;
  const stringGap = (H - top - 20) / 5;
  const fretGap = (W - left - 18) / FRETS;

  return (
    <div className="border border-line bg-panel p-5">
      <div className="flex flex-wrap gap-1.5">
        {CHORDS.map((c, i) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setIndex(i)}
            className={`border px-2.5 py-1 font-mono text-xs transition ${i === index ? "border-marigold text-marigold"
                : "border-line text-muted hover:border-marigold hover:text-marigold"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${chord.name} chord diagram`}
          className="w-full max-w-[280px] shrink-0"
        >
          {/* Nut */}
          <rect
            x={left - 3}
            y={top - 4}
            width={4}
            height={stringGap * 5 + 8}
            fill="var(--ink)"
          />
          {/* Frets */}
          {Array.from({ length: FRETS }, (_, f) => (
            <line
              key={`f${f}`}
              x1={left + fretGap * (f + 1)}
              y1={top - 4}
              x2={left + fretGap * (f + 1)}
              y2={top + stringGap * 5 + 4}
              stroke="var(--line)"
              strokeWidth={1.5}
            />
          ))}
          {/* Strings — drawn high E at the top, matching how a player reads a chart */}
          {OPEN_STRINGS.map((_, s) => {
            const y = top + stringGap * s;
            const stringIndex = 5 - s;
            const fret = chord.shape[stringIndex];
            return (
              <g key={`s${s}`}>
                <line
                  x1={left}
                  y1={y}
                  x2={W - 14}
                  y2={y}
                  stroke="var(--muted)"
                  strokeWidth={0.8 + s * 0.22}
                />
                <text
                  x={left - 14}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fill={fret < 0 ? "var(--muted)" : "var(--teal)"}
                  fontFamily="var(--font-mono-code), monospace"
                >
                  {fret < 0 ? "×" : fret === 0 ? "○" : ""}
                </text>
                {fret > 0 && (
                  <circle
                    cx={left + fretGap * (fret - 0.5)}
                    cy={y}
                    r={8}
                    fill="var(--marigold)"
                  />
                )}
              </g>
            );
          })}
        </svg>

        <div className="min-w-0 flex-1">
          <p className="text-2xl font-semibold tracking-tight">{chord.name}</p>
          <p className="mt-1 text-sm text-muted">{chord.note[locale]}</p>
          <button
            type="button"
            onClick={strum}
            className="mt-4 bg-marigold px-4 py-2 text-sm font-semibold text-[#0e1116] transition hover:opacity-90"
          >
            {locale === "th" ? "▶ ดีดฟัง" : "▶ Strum it"}
          </button>
          <p className="mt-3 hud text-muted">
            {locale === "th"
              ? "สังเคราะห์เสียงสดด้วย Web Audio ไม่มีไฟล์เสียง"
              : "Synthesised live with Web Audio — no audio files"}
          </p>
        </div>
      </div>
    </div>
  );
}
