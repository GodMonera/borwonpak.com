import { stackLevels, techStack, type StackLevel } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/hud/reveal";

/** Shipped reads strongest, touched quietest — the ink carries the claim. */
const TONE: Record<StackLevel, string> = {
  shipped: "border-brass/70 text-ink",
  built: "border-line-bright text-muted",
  touched: "border-line text-muted/70",
};

export function TechStack({
  locale,
  compact = false,
}: {
  locale: Locale;
  /** Homepage version: no legend, tighter type. */
  compact?: boolean;
}) {
  return (
    <div>
      {!compact && (
        <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
          {(Object.keys(stackLevels) as StackLevel[]).map((level) => (
            <li key={level} className="flex items-center gap-2">
              <span
                aria-hidden
                className={`inline-block size-3 border ${TONE[level]}`}
              />
              <span className="hud text-muted">{stackLevels[level][locale]}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {techStack.map((group, i) => (
          <Reveal key={group.group.en} delay={i * 50}>
            <h3 className="hud border-b border-line pb-2 text-brass">
              {group.group[locale]}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className={`border px-2 py-1 ${TONE[item.level]} ${
                    compact ? "text-xs" : "text-sm"
                  }`}
                  title={stackLevels[item.level][locale]}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
