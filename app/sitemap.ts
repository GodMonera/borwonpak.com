import type { MetadataRoute } from "next";
import { projects, site } from "@/content/site";
import { locales } from "@/lib/i18n";
import { listPosts } from "@/lib/posts";

const STATIC_PATHS = [
  "",
  "/work",
  "/blog",
  "/lab",
  "/now",
  "/uses",
  "/music",
  "/gallery",
  "/gaming",
  "/guestbook",
  "/cv",
  "/ask",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${site.url}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${site.url}/${locale}/work/${project.slug}`,
        lastModified: now,
        priority: 0.8,
      });
    }

    for (const post of listPosts(locale)) {
      entries.push({
        url: `${site.url}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        priority: 0.6,
      });
    }
  }

  return entries;
}
