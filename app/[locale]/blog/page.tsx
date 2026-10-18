import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { listPosts } from "@/lib/posts";
import { PageHeader } from "@/components/ui";
import { PostCard } from "@/components/post-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.blog.title, description: copy.blog.sub };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);
  const posts = listPosts(locale);

  return (
    <>
      <PageHeader title={copy.blog.title} sub={copy.blog.sub} />
      {posts.length === 0 ? (
        <p className="text-muted">{copy.blog.empty}</p>
      ) : (
        <div className="max-w-3xl">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      )}
    </>
  );
}
