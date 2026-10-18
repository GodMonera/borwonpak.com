import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  sub,
}: {
  kicker?: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="mb-12 border-b border-line pb-8">
      {kicker && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-marigold">
          {kicker}
        </p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {sub && <p className="mt-3 max-w-2xl text-muted">{sub}</p>}
    </header>
  );
}

export function Section({
  title,
  sub,
  action,
  children,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
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
    "group inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-marigold";
  const inner = (
    <>
      {children}
      <span
        aria-hidden
        className="transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </>
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
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

/** Small marigold/teal rule used to mark the start of a card. */
export function AccentBar({ accent }: { accent: "marigold" | "teal" }) {
  return (
    <span
      aria-hidden
      className={`block h-0.5 w-10 ${
        accent === "marigold" ? "bg-marigold" : "bg-teal"
      }`}
    />
  );
}
