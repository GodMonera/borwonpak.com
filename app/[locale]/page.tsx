import Link from "next/link";
import { notFound } from "next/navigation";
import { gaming, nowItems, projects, site, tracks } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { listPosts } from "@/lib/posts";
import { ArrowLink, Section } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { PostCard } from "@/components/post-card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);

  const featured = projects.filter((p) => p.featured);
  const posts = listPosts(locale).slice(0, 3);

  return (
    <>
      <section className="pb-4">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-marigold">
          {copy.home.kicker}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
          {copy.home.tagline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {copy.home.intro}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/work`}
            className="rounded-md bg-marigold px-5 py-2.5 text-sm font-semibold text-[#0e1116] transition hover:opacity-90"
          >
            {copy.home.ctaWork}
          </Link>
          <Link
            href={`/${locale}/ask`}
            className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-marigold hover:text-marigold"
          >
            {copy.home.ctaAsk}
          </Link>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-marigold hover:text-marigold"
          >
            GitHub
          </a>
        </div>
      </section>

      <Section
        title={copy.home.featured}
        sub={copy.home.featuredSub}
        action={
          <ArrowLink href={`/${locale}/work`}>{copy.common.allWork}</ArrowLink>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </Section>

      {posts.length > 0 && (
        <Section
          title={copy.home.latestPosts}
          sub={copy.home.latestPostsSub}
          action={
            <ArrowLink href={`/${locale}/blog`}>
              {copy.common.allPosts}
            </ArrowLink>
          }
        >
          <div>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </Section>
      )}

      <Section title={copy.home.nowTitle}>
        <dl className="grid gap-5 sm:grid-cols-2">
          {nowItems.map((item) => (
            <div
              key={item.heading.en}
              className="rounded-lg border border-line bg-card p-5"
            >
              <dt className="font-mono text-[11px] uppercase tracking-wider text-teal">
                {item.heading[locale]}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                {item.body[locale]}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-5">
          <ArrowLink href={`/${locale}/now`}>{copy.nav.now}</ArrowLink>
        </div>
      </Section>

      <Section title={copy.home.beyondCode} sub={copy.home.beyondCodeSub}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href={`/${locale}/lab`}
            className="group rounded-lg border border-line bg-card p-5 transition hover:border-marigold"
          >
            <span aria-hidden className="text-2xl">
              ⚗
            </span>
            <h3 className="mt-3 font-semibold group-hover:text-marigold">
              {copy.nav.lab}
            </h3>
            <p className="mt-1.5 text-sm text-muted">{copy.lab.sub}</p>
          </Link>
          <Link
            href={`/${locale}/music`}
            className="group rounded-lg border border-line bg-card p-5 transition hover:border-marigold"
          >
            <span aria-hidden className="text-2xl">
              ♪
            </span>
            <h3 className="mt-3 font-semibold group-hover:text-marigold">
              {copy.nav.music}
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              {tracks.length} {locale === "th" ? "เพลง" : "pieces"} ·{" "}
              {copy.music.sub}
            </p>
          </Link>
          <Link
            href={`/${locale}/gaming`}
            className="group rounded-lg border border-line bg-card p-5 transition hover:border-marigold"
          >
            <span aria-hidden className="text-2xl">
              ⌘
            </span>
            <h3 className="mt-3 font-semibold group-hover:text-marigold">
              {copy.nav.gaming}
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              {gaming.map((g) => g.game).join(" · ")}
            </p>
          </Link>
        </div>
      </Section>
    </>
  );
}
