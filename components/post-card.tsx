import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { t, type Locale } from "@/lib/i18n";

export function PostCard({
  post,
  locale,
}: {
  post: PostMeta;
  locale: Locale;
}) {
  const copy = t(locale);
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block border-b border-line py-5 transition last:border-b-0"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-lg font-semibold tracking-tight group-hover:text-marigold">
          {post.title}
        </h3>
        <span className="font-mono text-xs text-muted">
          {post.date} · {post.readingMinutes} {copy.common.minRead}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {post.summary}
      </p>
    </Link>
  );
}
