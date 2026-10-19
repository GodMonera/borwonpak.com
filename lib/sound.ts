/**
 * Plucked-string synthesis, shared by the chord navigation and the lab.
 *
 * A triangle wave through a lowpass with a fast attack and a long exponential
 * decay reads convincingly as a plucked string, and costs nothing to ship —
 * no samples, no audio files, no extra request.
 */

const STORAGE_KEY = "bwp_sound";

let ctx: AudioContext | null = null;

export function soundEnabled() {
  if (typeof window === "undefined") return false;
  try {
    // Default on. Sound only ever follows a click, so this is never autoplay.
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Private browsing — the preference just will not persist.
  }
}

export function midiToFreq(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Must be created inside a user gesture or the browser keeps it suspended. */
function audio() {
  ctx ??= new AudioContext();
  void ctx.resume();
  return ctx;
}

/** Stop everything currently ringing — used when a playback is cancelled. */
export function silence() {
  if (!ctx) return;
  void ctx.close();
  ctx = null;
}

export type Pluck = {
  midi: number;
  /** Seconds from now. */
  at: number;
  /** How long before the string is damped. Defaults to a full ring. */
  hold?: number;
  gain?: number;
};

/** Returns the AudioContext time the last note finishes, for scheduling. */
export function play(notes: Pluck[]): number {
  if (!soundEnabled() || notes.length === 0) return 0;
  const context = audio();
  let end = context.currentTime;

  for (const { midi, at, hold, gain: peak = 0.14 } of notes) {
    const start = context.currentTime + at;
    const ring = hold ?? 2.1;

    const osc = context.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = midiToFreq(midi);

    const gain = context.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + ring);

    const tone = context.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2600;

    osc.connect(tone).connect(gain).connect(context.destination);
    osc.start(start);
    osc.stop(start + ring + 0.1);
    end = Math.max(end, start + ring);
  }

  return end;
}

/**
 * Strum a chord, low string first. `notes` are MIDI numbers.
 *
 * This is the ambient one, attached to hovering and navigating, so it stays
 * quiet for anyone who asked the OS for less motion. The lab uses `pluck`
 * instead: there, hearing the chord is the whole point of the control, and
 * silencing it would remove the feature rather than tone it down.
 */
export function strum(notes: number[]) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  pluck(notes);
}

/** Strum a chord in response to an explicit request to hear it. */
export function pluck(notes: number[], spread = 0.042) {
  play(notes.map((midi, i) => ({ midi, at: i * spread })));
}
