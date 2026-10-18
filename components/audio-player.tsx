"use client";

import { useRef, useState } from "react";

/**
 * One <audio> per track, controlled by a single play/pause button. Deliberately
 * not an <audio controls> grid — the native widget looks different in every
 * browser and swamps the page.
 */
export function AudioPlayer({
  src,
  title,
  note,
  instrument,
  unavailableLabel,
}: {
  src?: string;
  title: string;
  note: string;
  instrument: "guitar" | "flute";
  unavailableLabel: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      // Pause anything else already playing on the page.
      document.querySelectorAll("audio").forEach((other) => {
        if (other !== el) other.pause();
      });
      void el.play();
    } else {
      el.pause();
    }
  }

  return (
    <li className="flex items-center gap-4 border-b border-line py-4 last:border-b-0">
      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-marigold transition enabled:hover:border-marigold disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span aria-hidden className="text-sm leading-none">
          {playing ? "❚❚" : "▶"}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <p className="truncate text-sm text-muted">
          {src ? note : unavailableLabel}
        </p>
        {src && (
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded bg-line">
            <div
              className="h-full bg-marigold transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <span
        aria-hidden
        className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-teal"
      >
        {instrument}
      </span>

      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
          onTimeUpdate={(e) => {
            const el = e.currentTarget;
            if (el.duration) setProgress((el.currentTime / el.duration) * 100);
          }}
        />
      )}
    </li>
  );
}
