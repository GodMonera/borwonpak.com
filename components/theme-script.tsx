/**
 * Runs before paint so a dark-mode visitor never sees a white flash.
 * Kept as a raw string: it must execute synchronously in <head>.
 */
const script = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
