import Link from "next/link";
import { notFound } from "next/navigation";
import { gaming, nowItems, projects, tracks } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { listPosts } from "@/lib/posts";
import { ArrowLink } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { PostCard } from "@/components/post-card";
import { SiteHero } from "@/components/site-hero";
import { SectionDivider } from "@/components/section-divider";
import type { Chord } from "@/components/neck/chord-nav";
import type { Chip } from "@/components/hud/hero";
import type { PalmLine } from "@/components/palm/hero";
import { Reveal } from "@/components/hud/reveal";
import { TechStack } from "@/components/tech-stack";
import { getSkin } from "@/lib/settings";

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

/** Facts pulled from the actual work — these float around the HUD wordmark. */
function navChips(locale: Locale, projectCount: number): Chip[] {
  const th = locale === "th";
  return [
    { value: "1st", label: th ? "เกียรตินิยม มช." : "class honours, CMU" },
    { value: `${projectCount}`, label: th ? "โปรเจกต์" : "projects shipped" },
    { value: "95+", label: th ? "หัวข้อใน README" : "README sections" },
    { value: "11", label: th ? "บั๊กที่ audit เจอ" : "bugs found in audit" },
    { value: "10K", label: th ? "แถว Excel ที่ล้าง" : "rows cleansed" },
    { value: "3", label: th ? "แอปบน LINE" : "apps on LINE" },
  ];
}

/**
 * The palm skin reads the hand instead of listing a menu. Each palmistry line
 * is matched to the part of the site it honestly describes — the life line to
 * the work, the head line to the writing — so the conceit stays a joke the
 * visitor is in on rather than a riddle they have to solve.
 */
function navLines(locale: Locale, copy: ReturnType<typeof t>): PalmLine[] {
  const th = locale === "th";
  return [
    { line: "life", name: th ? "เส้นชีวิต" : "Life line", label: copy.nav.work, href: `/${locale}/work` },
    { line: "head", name: th ? "เส้นสมอง" : "Head line", label: copy.nav.blog, href: `/${locale}/blog` },
    { line: "heart", name: th ? "เส้นใจ" : "Heart line", label: copy.nav.music, href: `/${locale}/music` },
    { line: "fate", name: th ? "เส้นวาสนา" : "Fate line", label: copy.nav.lab, href: `/${locale}/lab` },
    { line: "sun", name: th ? "เส้นสุริยะ" : "Sun line", label: copy.nav.ask, href: `/${locale}/ask` },
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

  const skin = await getSkin();

  const featured = projects.filter((p) => p.featured);
  const posts = listPosts(locale).slice(0, 3);

  return (
    <>
      <SiteHero
        skin={skin}
        locale={locale}
        kicker={copy.home.kicker}
        tagline={copy.home.tagline}
        intro={copy.home.intro}
        ctaWork={copy.home.ctaWork}
        ctaAsk={copy.home.ctaAsk}
        chords={navChords(locale, copy)}
        chips={navChips(locale, projects.length)}
        lines={navLines(locale, copy)}
        playHint={
          skin === "palm"
            ? th
              ? "ชื่อเล่นผมแปลว่าฝ่ามือ เลยขอดูลายมือให้เสียเลย"
              : "My nickname means palm of the hand, so the menu is a reading"
            : th
              ? "กดคอร์ดไหนก็ได้ — มีเสียงจริง ไม่มีไฟล์เสียงสักไฟล์"
              : "Press any chord — it really sounds, with no audio files"
        }
      />

      <SectionDivider
        skin={skin}
        position={3}
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
      </SectionDivider>

      {posts.length > 0 && (
        <SectionDivider
          skin={skin}
          position={5}
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
        </SectionDivider>
      )}

      <SectionDivider
        skin={skin}
        position={7}
        index="03"
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
      </SectionDivider>

      <SectionDivider
        skin={skin}
        position={9}
        index="04"
        title={th ? "เคยเขียนอะไรมาบ้าง" : "What I've worked with"}
        meta={
          th
            ? "แยกตามว่าเคยใช้จริงแค่ไหน ไม่ใช่กองรวมกัน"
            : "Split by how far each one actually got"
        }
        id="stack"
      >
        <TechStack locale={locale} compact />
      </SectionDivider>

      <SectionDivider
        skin={skin}
        position={12}
        index="05"
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
      </SectionDivider>
    </>
  );
}
