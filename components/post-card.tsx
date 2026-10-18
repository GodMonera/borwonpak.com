import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { t, type Locale } from "@/lib/i18n";
import { Reveal } from "@/components/hud/reveal";

export function PostCard({
  post,
  locale,
  index,
  delay = 0,
}: {
  post: PostMeta;
  locale: Locale;
  index: number;
  delay?: number;
}) {
  const copy = t(locale);
  return (
    <Reveal delay={delay}>
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="group grid gap-2 border-b border-line py-6 transition hover:bg-panel sm:grid-cols-[4rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-2"
      >
        <span className="hud text-brass">
          {String(index).padStart(2, "0")}
        </span>

        <div>
          <h3 className="font-display text-lg font-semibold leading-snug transition group-hover:text-brass">
            {post.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {post.summary}
          </p>
        </div>

        <span className="hud shrink-0 text-muted">
          {post.date} · {post.readingMinutes}
          {locale === "th" ? " นาที" : " min"}
        </span>
        <span className="sr-only">{copy.common.readMore}</span>
      </Link>
    </Reveal>
  );
}
