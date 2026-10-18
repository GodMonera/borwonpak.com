/**
 * Plucked-string synthesis for the chord navigation.
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

function midiToFreq(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Strum a chord. `notes` are MIDI numbers, low string first. */
export function strum(notes: number[]) {
  if (!soundEnabled()) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Must be created inside a user gesture or the browser keeps it suspended.
  ctx ??= new AudioContext();
  void ctx.resume();

  notes.forEach((midi, i) => {
    const start = ctx!.currentTime + i * 0.042;

    const osc = ctx!.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = midiToFreq(midi);

    const gain = ctx!.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.14, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.1);

    const tone = ctx!.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2600;

    osc.connect(tone).connect(gain).connect(ctx!.destination);
    osc.start(start);
    osc.stop(start + 2.2);
  });
}
