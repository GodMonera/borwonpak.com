import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, t, type Locale } from "@/lib/i18n";
import { allSlugs, getPost } from "@/lib/posts";
import { Tag } from "@/components/ui";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    allSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPost(slug, locale);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/${locale}/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const copy = t(locale);

  return (
    <article className="max-w-2xl">
      <Link
        href={`/${locale}/blog`}
        className="font-mono text-xs text-muted hover:text-marigold"
      >
        ← {copy.blog.title}
      </Link>

      <header className="mt-6 border-b border-line pb-6">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-xs text-muted">
          {post.date} · {post.readingMinutes} {copy.common.minRead}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose mt-8"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
