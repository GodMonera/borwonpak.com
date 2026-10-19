"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pieces } from "@/content/tabs";
import type { Locale } from "@/lib/i18n";
import { columnWidth, place, render, totalBeats } from "@/lib/tab";
import { play, silence } from "@/lib/sound";

const STRING_LABELS = ["e", "B", "G", "D", "A", "E"];

export function TabBook({ locale }: { locale: Locale }) {
  const th = locale === "th";
  const [slug, setSlug] = useState(pieces[0].slug);
  const [tempoScale, setTempoScale] = useState(1);
  const [playingAt, setPlayingAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const frame = useRef<number | null>(null);

  const piece = pieces.find((p) => p.slug === slug) ?? pieces[0];
  const bars = useMemo(
    () => place(piece.bars, piece.transpose ?? 0),
    [piece],
  );
  const tempo = Math.round(piece.tempo * tempoScale);

  function stop() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setPlayingAt(null);
    silence();
  }

  // Stop the clock on unmount, and when the piece changes under a playback.
  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      silence();
    };
  }, [piece]);

  /*
    Leaving the tab stops the piece.

    The cursor is driven by requestAnimationFrame, which a hidden tab does not
    run, but the notes are already scheduled inside the Web Audio context and
    carry on regardless. Without this you come back to music playing under a
    frozen cursor and a Stop button that will never clear itself.
  */
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  });

  function start() {
    stop();
    const secondsPerBeat = 60 / tempo;
    const notes = bars.flat().flatMap((p) =>
      p.stops.map((stop) => ({
        midi: stop.midi,
        at: p.at * secondsPerBeat,
        hold: Math.max(0.5, p.note.beats * secondsPerBeat * 2.5),
      })),
    );
    if (notes.length === 0) return;

    play(notes);

    // The highlight runs off the wall clock rather than the audio clock —
    // they can drift a few milliseconds apart over a phrase, which nobody
    // can see, and this way the cursor still moves when sound is muted.
    const began = performance.now();
    const length = totalBeats(piece.bars) * secondsPerBeat * 1000;
    const tick = () => {
      const elapsed = performance.now() - began;
      if (elapsed > length) return stop();
      setPlayingAt(elapsed / 1000 / secondsPerBeat);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  async function copy() {
    const text = [
      `${piece.title} — ${piece.composer} (${piece.year})`,
      `${piece.meter}  ♩=${piece.tempo}`,
      "",
      ...render(bars),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard permission denied — the tab is on screen to copy by hand.
    }
  }

  return (
    <div className="border border-line bg-panel p-5">
      <div className="flex flex-wrap gap-1.5">
        {pieces.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => {
              stop();
              setSlug(p.slug);
            }}
            aria-pressed={p.slug === slug}
            className={`border px-2.5 py-1 text-xs transition ${
              p.slug === slug
                ? "border-brass text-brass"
                : "border-line text-muted hover:border-brass hover:text-brass"
            }`}
          >
            {p.title.split(",")[0].split(" — ")[0]}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight">
            {piece.title}
          </h3>
          <p className="hud mt-1.5 text-muted">
            {piece.composer} · {piece.year} · {piece.key[locale]} · {piece.meter}
            {piece.transpose ? (th ? " · ลดลงหนึ่งคู่แปด" : " · down an octave") : ""}
          </p>
        </div>
        <span className="hud text-abalone">
          {"●".repeat(piece.level)}
          <span className="text-line-bright">{"●".repeat(3 - piece.level)}</span>
        </span>
      </div>

      <p className="hud mt-3 text-abalone">{piece.scope[locale]}</p>

      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {piece.about[locale]}
      </p>

      {/* The grid. One column per note, width following its length, so the
          rhythm is visible in the spacing the way it is on real tab. */}
      <div className="mt-6 overflow-x-auto border border-line bg-paper p-4">
        <div className="flex min-w-max font-mono text-xs leading-6">
          <div className="pr-1 text-muted">
            {STRING_LABELS.map((label) => (
              <div key={label}>{label}|</div>
            ))}
          </div>

          {bars.map((bar, barIndex) => (
            <div key={barIndex} className="flex">
              {bar.map((placed) => {
                const active =
                  playingAt !== null &&
                  playingAt >= placed.at &&
                  playingAt < placed.at + placed.note.beats;
                const width = columnWidth(placed);
                return (
                  <div
                    key={placed.at}
                    style={{ width: `${width}ch` }}
                    className={active ? "bg-brass/25" : undefined}
                  >
                    {STRING_LABELS.map((label, row) => {
                      const stop = placed.stops.find((s) => s.string === 5 - row);
                      const mark = stop ? String(stop.fret) : "";
                      return (
                        <div key={label} className="whitespace-pre">
                          <span className="text-brass">{mark}</span>
                          <span className="text-line-bright">
                            {"–".repeat(width - mark.length)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div className="pl-px text-muted">
                {STRING_LABELS.map((label) => (
                  <div key={label}>|</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={playingAt === null ? start : stop}
          className="bg-brass px-4 py-2 text-sm font-semibold text-on-accent transition hover:opacity-90"
        >
          {playingAt === null
            ? th
              ? "▶ เล่น"
              : "▶ Play"
            : th
              ? "■ หยุด"
              : "■ Stop"}
        </button>

        <label className="flex items-center gap-2">
          <span className="hud text-muted">{th ? "ความเร็ว" : "Tempo"}</span>
          <input
            type="range"
            min={0.5}
            max={1.25}
            step={0.05}
            value={tempoScale}
            onChange={(e) => setTempoScale(Number(e.target.value))}
            className="w-32 accent-[var(--brass)]"
          />
          <span className="font-mono text-xs tabular-nums text-muted">
            ♩={tempo}
          </span>
        </label>

        <button
          type="button"
          onClick={copy}
          className="hud border border-line px-3 py-2 text-muted transition hover:border-brass hover:text-brass"
        >
          {copied
            ? th
              ? "คัดลอกแล้ว"
              : "Copied"
            : th
              ? "คัดลอกเป็นข้อความ"
              : "Copy as text"}
        </button>

        <a
          href={piece.source.url}
          target="_blank"
          rel="noreferrer noopener"
          className="hud text-muted underline underline-offset-4 transition hover:text-brass"
        >
          {piece.source.label} ↗
        </a>
      </div>
    </div>
  );
}
