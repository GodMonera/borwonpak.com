"use client";

import Link from "next/link";
import { strum } from "@/lib/sound";

export type Chord = {
  name: string;
  label: string;
  href: string;
  /** MIDI notes, low string first. */
  notes: number[];
};

/**
 * Navigation where every destination is also a chord. The sound fires on
 * pointer-down so it lands with the press rather than after the route change.
 */
export function ChordNav({ chords }: { chords: Chord[] }) {
  return (
    <nav className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {chords.map((chord) => (
        <Link
          key={chord.href}
          href={chord.href}
          onPointerDown={() => strum(chord.notes)}
          className="group grid min-w-[108px] gap-1 border border-line bg-panel px-4 py-3 text-left transition hover:-translate-y-1 hover:border-brass hover:bg-panel-2 focus-visible:-translate-y-1"
        >
          <span className="font-display text-lg font-bold leading-none text-brass">
            {chord.name}
          </span>
          <span className="hud text-muted">{chord.label}</span>
        </Link>
      ))}
    </nav>
  );
}
