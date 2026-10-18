"use client";

/**
 * No React state here on purpose: the active theme lives on
 * document.documentElement, and which icon shows is decided in CSS. That keeps
 * the server and client markup identical and avoids a flash on first paint.
 */
export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const root = document.documentElement;
    const current =
      root.dataset.theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing — the toggle still works for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-md border border-line text-muted transition hover:border-marigold hover:text-marigold"
    >
      <span aria-hidden className="icon-when-light text-base leading-none">
        ☾
      </span>
      <span aria-hidden className="icon-when-dark text-base leading-none">
        ☀
      </span>
    </button>
  );
}
