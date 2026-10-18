import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Locale } from "@/lib/i18n";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

function readFile(slug: string, locale: Locale) {
  const file = path.join(POSTS_DIR, `${slug}.${locale}.md`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

/**
 * Thai has no spaces between words, so a word count badly under-reports Thai
 * posts. Characters-per-minute is the closer approximation for both scripts.
 */
function readingMinutes(body: string) {
  const chars = body.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 900));
}

function parse(slug: string, locale: Locale, raw: string) {
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      locale,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      summary: String(data.summary ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readingMinutes: readingMinutes(content),
    } satisfies PostMeta,
    content,
  };
}

/** Every slug that has a file in at least one language. */
export function allSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const slugs = new Set<string>();
  for (const file of fs.readdirSync(POSTS_DIR)) {
    const match = file.match(/^(.+)\.(th|en)\.md$/);
    if (match) slugs.add(match[1]);
  }
  return [...slugs];
}

export function listPosts(locale: Locale): PostMeta[] {
  return allSlugs()
    .map((slug) => {
      const raw = readFile(slug, locale);
      return raw ? parse(slug, locale, raw).meta : null;
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  const raw = readFile(slug, locale);
  if (!raw) return null;
  const { meta, content } = parse(slug, locale, raw);
  const html = await marked.parse(content, { async: true });
  return { ...meta, html };
}

/** Plain text of a post, for feeding the assistant's context. */
export function getPostText(slug: string, locale: Locale): string | null {
  const raw = readFile(slug, locale);
  if (!raw) return null;
  const { meta, content } = parse(slug, locale, raw);
  return `# ${meta.title} (${meta.date})\n${meta.summary}\n\n${content}`;
}
