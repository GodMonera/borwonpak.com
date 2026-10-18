/**
 * Runs before paint so a dark-mode visitor never sees a white flash, and so
 * the sound button renders the correct icon on first paint.
 *
 * Both preferences are stamped on <html> as data attributes, which lets the
 * toggles stay stateless — CSS picks the icon, so server and client markup
 * always agree and no effect is needed to "discover" the stored value.
 */
const script = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){d.dataset.theme=t}if(localStorage.getItem("bwp_sound")==="off"){d.dataset.sound="off"}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
