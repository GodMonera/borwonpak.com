import Link from "next/link";
import { notFound } from "next/navigation";
import { gaming, nowItems, projects, tracks } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { listPosts } from "@/lib/posts";
import { ArrowLink } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { PostCard } from "@/components/post-card";
import { Fret } from "@/components/neck/fret";
import { Hero } from "@/components/neck/hero";
import type { Chord } from "@/components/neck/chord-nav";
import { Reveal } from "@/components/hud/reveal";

/**
 * Every destination is a chord in standard tuning, low string first. Open
 * shapes were chosen deliberately: they ring longer and sound better on a
 * synthesised pluck than anything barred.
 */
function navChords(locale: Locale, copy: ReturnType<typeof t>): Chord[] {
  return [
    { name: "Em7", label: copy.nav.work, href: `/${locale}/work`, notes: [40, 47, 52, 55, 59, 64] },
    { name: "Am", label: copy.nav.blog, href: `/${locale}/blog`, notes: [45, 52, 57, 60, 64] },
    { name: "G", label: copy.nav.lab, href: `/${locale}/lab`, notes: [43, 47, 50, 55, 59, 67] },
    { name: "D", label: copy.nav.now, href: `/${locale}/now`, notes: [50, 57, 62, 66] },
    { name: "C", label: copy.nav.ask, href: `/${locale}/ask`, notes: [48, 52, 55, 60, 64] },
  ];
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);
  const th = locale === "th";

  const featured = projects.filter((p) => p.featured);
  const posts = listPosts(locale).slice(0, 3);

  return (
    <>
      <Hero
        locale={locale}
        kicker={copy.home.kicker}
        tagline={copy.home.tagline}
        intro={copy.home.intro}
        chords={navChords(locale, copy)}
        playHint={
          th
            ? "กดคอร์ดไหนก็ได้ — มีเสียงจริง ไม่มีไฟล์เสียงสักไฟล์"
            : "Press any chord — it really sounds, with no audio files"
        }
      />

      <Fret position={3} title={copy.home.featured} meta={copy.home.featuredSub} id="work">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              index={i + 1}
              delay={i * 90}
            />
          ))}
        </div>
        <div className="mt-8">
          <ArrowLink href={`/${locale}/work`}>{copy.common.allWork}</ArrowLink>
        </div>
      </Fret>

      {posts.length > 0 && (
        <Fret position={5} title={copy.home.latestPosts} meta={copy.home.latestPostsSub} id="writing">
          <div className="border-t border-line">
            {posts.map((post, i) => (
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                index={i + 1}
                delay={i * 90}
              />
            ))}
          </div>
          <div className="mt-8">
            <ArrowLink href={`/${locale}/blog`}>{copy.common.allPosts}</ArrowLink>
          </div>
        </Fret>
      )}

      <Fret
        position={7}
        title={copy.home.nowTitle}
        meta={th ? "สถานะปัจจุบัน" : "Current status"}
        id="now"
      >
        <dl className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {nowItems.map((item, i) => (
            <Reveal key={item.heading.en} delay={i * 80} className="bg-panel p-6">
              <dt className="hud flex items-center gap-2 text-abalone">
                <span aria-hidden className="inlay" />
                {item.heading[locale]}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted">
                {item.body[locale]}
              </dd>
            </Reveal>
          ))}
        </dl>
        <div className="mt-8">
          <ArrowLink href={`/${locale}/now`}>{copy.nav.now}</ArrowLink>
        </div>
      </Fret>

      <Fret
        position={12}
        title={copy.home.beyondCode}
        meta={copy.home.beyondCodeSub}
        id="beyond"
      >
        <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
          {[
            { href: `/${locale}/lab`, glyph: "⚗", title: copy.nav.lab, body: copy.lab.sub },
            {
              href: `/${locale}/music`,
              glyph: "♪",
              title: copy.nav.music,
              body: `${tracks.length} ${th ? "เพลง" : "pieces"} · ${copy.music.sub}`,
            },
            {
              href: `/${locale}/gaming`,
              glyph: "⌘",
              title: copy.nav.gaming,
              body: gaming.map((g) => g.game).join(" · "),
            },
          ].map((card, i) => (
            <Reveal key={card.href} delay={i * 80}>
              <Link
                href={card.href}
                className="group flex h-full flex-col bg-panel p-6 transition hover:bg-panel-2"
              >
                <span aria-hidden className="text-2xl text-brass">
                  {card.glyph}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold transition group-hover:text-brass">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Fret>
    </>
  );
}
