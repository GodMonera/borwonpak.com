import Link from "next/link";
import { notFound } from "next/navigation";
import { gaming, nowItems, projects, tracks } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { listPosts } from "@/lib/posts";
import { ArrowLink } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { PostCard } from "@/components/post-card";
import { Band } from "@/components/hud/band";
import { Hero, type Chip } from "@/components/hud/hero";
import { Reveal } from "@/components/hud/reveal";

/** Facts pulled from the actual work — these float around the wordmark. */
function heroChips(locale: Locale): Chip[] {
  const th = locale === "th";
  return [
    { value: "1st", label: th ? "เกียรตินิยม มช." : "class honours, CMU" },
    { value: `${projects.length}`, label: th ? "โปรเจกต์" : "projects shipped" },
    { value: "95+", label: th ? "หัวข้อใน README" : "README sections" },
    { value: "11", label: th ? "บั๊กที่ audit เจอ" : "bugs found in audit" },
    { value: "10K", label: th ? "แถว Excel ที่ล้าง" : "rows cleansed" },
    { value: "3", label: th ? "แอปบน LINE" : "apps on LINE" },
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
        ctaWork={copy.home.ctaWork}
        ctaAsk={copy.home.ctaAsk}
        chips={heroChips(locale)}
      />

      <Band
        index="01"
        title={copy.home.featured}
        meta={copy.home.featuredSub}
        id="work"
      >
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
      </Band>

      {posts.length > 0 && (
        <Band
          index="02"
          title={copy.home.latestPosts}
          meta={copy.home.latestPostsSub}
          id="writing"
        >
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
        </Band>
      )}

      <Band
        index="03"
        title={copy.home.nowTitle}
        meta={th ? "สถานะปัจจุบัน" : "Current status"}
        id="now"
      >
        <dl className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {nowItems.map((item, i) => (
            <Reveal key={item.heading.en} delay={i * 80} className="bg-panel p-6">
              <dt className="hud flex items-center gap-2 text-teal">
                <span aria-hidden className="inline-block size-1.5 bg-teal" />
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
      </Band>

      <Band
        index="04"
        title={copy.home.beyondCode}
        meta={copy.home.beyondCodeSub}
        id="beyond"
      >
        <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
          {[
            {
              href: `/${locale}/lab`,
              glyph: "⚗",
              title: copy.nav.lab,
              body: copy.lab.sub,
            },
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
                <span aria-hidden className="text-2xl text-marigold">
                  {card.glyph}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold transition group-hover:text-marigold">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {card.body}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Band>
    </>
  );
}
