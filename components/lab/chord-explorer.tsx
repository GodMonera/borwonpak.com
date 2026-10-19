"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { pluck } from "@/lib/sound";
import {
  chordName,
  chordTones,
  findVoicings,
  QUALITIES,
  QUALITY_GROUPS,
  ROOTS,
  rootName,
  TUNING,
  type Quality,
} from "@/lib/chords";
import { ChordDiagram } from "@/components/lab/chord-diagram";

export function ChordExplorer({ locale }: { locale: Locale }) {
  const th = locale === "th";
  const [rootPc, setRootPc] = useState(0);
  const [qualityId, setQualityId] = useState("maj");

  const quality = QUALITIES.find((q) => q.id === qualityId) as Quality;

  // The search is a few hundred microseconds, but it runs on every render
  // without this and there is no reason to repeat it while the user is just
  // moving the mouse around.
  const voicings = useMemo(
    () => findVoicings(rootPc, quality),
    [rootPc, quality],
  );

  const name = chordName(rootPc, quality);

  function hear(frets: number[]) {
    pluck(
      frets
        .map((fret, string) => (fret < 0 ? null : TUNING[string] + fret))
        .filter((n): n is number => n !== null),
    );
  }

  return (
    <div className="border border-line bg-panel p-5">
      {/* Root */}
      <p className="hud text-muted">{th ? "รากเสียง" : "Root"}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ROOTS.map((pc) => (
          <button
            key={pc}
            type="button"
            onClick={() => setRootPc(pc)}
            aria-pressed={pc === rootPc}
            className={`min-w-10 border px-2.5 py-1 font-mono text-xs transition ${
              pc === rootPc
                ? "border-brass bg-brass text-on-accent"
                : "border-line text-muted hover:border-brass hover:text-brass"
            }`}
          >
            {rootName(pc)}
          </button>
        ))}
      </div>

      {/* Quality, grouped so the list of 27 stays navigable */}
      <div className="mt-5 flex flex-col gap-3">
        {QUALITY_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="hud text-muted">{group.label[locale]}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUALITIES.filter((q) => q.group === group.id).map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQualityId(q.id)}
                  aria-pressed={q.id === qualityId}
                  title={q.name[locale]}
                  className={`border px-2.5 py-1 font-mono text-xs transition ${
                    q.id === qualityId
                      ? "border-brass text-brass"
                      : "border-line text-muted hover:border-brass hover:text-brass"
                  }`}
                >
                  {rootName(rootPc)}
                  {q.symbol}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* The chord itself */}
      <div className="mt-7 border-t border-line pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <h3 className="font-display text-3xl font-semibold tracking-tight">
              {name}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {quality.name[locale]} · {chordTones(rootPc, quality).join(" ")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => hear(voicings[0].frets)}
            className="bg-brass px-4 py-2 text-sm font-semibold text-on-accent transition hover:opacity-90"
          >
            {th ? "▶ ดีดฟัง" : "▶ Strum it"}
          </button>
        </div>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {quality.note[locale]}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {voicings.map((voicing) => (
            <ChordDiagram
              key={voicing.frets.join(",")}
              voicing={voicing}
              label={name}
              onPlay={() => hear(voicing.frets)}
              playHint={th ? "กดเพื่อฟัง" : "Tap to hear it"}
            />
          ))}
        </div>

        <p className="hud mt-4 text-muted">
          {th
            ? "เรียงจากกดง่ายไปยาก · ตัวเลขในจุดคือนิ้วที่ใช้ · เลขข้างซ้ายคือเฟร็ตที่เริ่ม"
            : "Easiest first · the number in each dot is the finger · the number at the left is the starting fret"}
        </p>
      </div>
    </div>
  );
}
