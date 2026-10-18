import { site } from "@/content/site";
import { locales } from "@/lib/i18n";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });
}

export function GET() {
  // One feed carrying both languages, each item tagged with its own locale,
  // so a reader following the feed isn't forced to pick a side.
  const items = locales
    .flatMap((locale) =>
      listPosts(locale).map((post) => ({ ...post, locale })),
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>Build logs and notes from ${escapeXml(site.name)}</description>
    <language>th</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${site.url}/${post.locale}/blog/${post.slug}</link>
      <guid isPermaLink="true">${site.url}/${post.locale}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:language>${post.locale}</dc:language>
      <description>${escapeXml(post.summary)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
