"use client";

import { setSoundEnabled, soundEnabled, strum } from "@/lib/sound";

/**
 * Silences the chord navigation. Stateless on purpose: the preference lives on
 * <html data-sound> (stamped before paint by ThemeScript) and CSS decides which
 * glyph shows, so there is nothing for React to hold and nothing to flash.
 */
export function SoundToggle({ label }: { label: string }) {
  function toggle() {
    const next = !soundEnabled();
    setSoundEnabled(next);

    const root = document.documentElement;
    if (next) delete root.dataset.sound;
    else root.dataset.sound = "off";

    // Turning sound on should make a sound.
    if (next) strum([52, 59, 64]);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center text-muted transition hover:text-brass"
    >
      <span aria-hidden className="icon-sound-on text-sm leading-none">
        ♪
      </span>
      <span aria-hidden className="icon-sound-off text-sm leading-none">
        ⃠
      </span>
    </button>
  );
}
