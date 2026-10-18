import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/hud/reveal";

/** Page masthead: numbered rule, oversized title, lead. */
export function PageHeader({
  kicker,
  title,
  sub,
  index = "00",
}: {
  kicker?: string;
  title: string;
  sub?: string;
  index?: string;
}) {
  return (
    <header className="border-b border-line pb-10 pt-12">
      <div className="flex items-baseline gap-3 border-b border-line pb-3">
        <span className="hud text-brass">{index}</span>
        <span className="hud text-line-bright">/</span>
        <span className="hud text-muted">{kicker ?? title}</span>
      </div>
      <Reveal
        as="h1"
        className="mt-8 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl"
      >
        {title}
      </Reveal>
      {sub && (
        <Reveal as="p" delay={120} className="mt-5 max-w-2xl leading-relaxed text-muted">
          {sub}
        </Reveal>
      )}
    </header>
  );
}

/** A titled region inside a page. */
export function Section({
  title,
  sub,
  action,
  index,
  children,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  index?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16 border-t border-line">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-3">
        <h2 className="hud text-ink">
          {index && (
            <>
              <span className="text-brass">{index}</span>
              <span className="mx-2 text-line-bright">/</span>
            </>
          )}
          {title}
        </h2>
        {action}
      </div>
      {sub && (
        <p className="border-t border-line pt-3 text-sm text-muted">{sub}</p>
      )}
      <div className="pt-8">{children}</div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="hud border border-line px-2 py-1 text-muted">
      {children}
    </span>
  );
}

export function ArrowLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "hud group inline-flex items-center gap-2 text-abalone transition hover:text-brass";
  const inner = (
    <>
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export function AccentBar({ accent }: { accent: "brass" | "abalone" }) {
  return (
    <span
      aria-hidden
      className={`block h-px w-10 ${accent ==="brass" ? "bg-brass" : "bg-abalone"}`}
    />
  );
}
