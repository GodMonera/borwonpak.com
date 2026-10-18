import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { learning, tracks, type LearningTrack } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PageHeader } from "@/components/ui";
import { AudioPlayer } from "@/components/audio-player";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.music.title, description: copy.music.sub };
}

export default async function MusicPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);
  const hasAudio = tracks.some((track) => track.src);

  const pieces = learning.filter((row) => row.kind !== "technique");
  const technique = learning.filter((row) => row.kind === "technique");

  return (
    <>
      <PageHeader index="06" title={copy.music.title} sub={copy.music.sub} />

      <div className="max-w-2xl">
        <p className="leading-relaxed text-muted">
          {locale === "th"
            ? "ผมเล่นกีตาร์แบบ fingerstyle มาหลายปี เป็นงานอดิเรกที่สอนเรื่องเดียวกับการเขียนโค้ด — ซ้อมช้า ๆ ทีละท่อน แล้ววันหนึ่งมันก็ไหลไปเองทั้งเพลง ส่วนขลุ่ยเป็นของที่เริ่มทีหลัง และยังเป่าได้ไม่กี่เพลง"
            : "I've played fingerstyle guitar for years. It teaches the same thing programming does — practise one bar slowly, over and over, and one day the whole piece just flows. The flute came later and I can still only play a handful of songs on it."}
        </p>
      </div>

      {/* ---- His own playing ---------------------------------------- */}
      <section className="mt-16">
        <h2 className="font-display text-xl font-semibold">
          {locale === "th" ? "ที่ผมเล่นเอง" : "Me playing"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {locale === "th"
            ? "อัดเองทีละเพลง ยังไม่ครบ เดี๋ยวทะยอยลงเรื่อย ๆ"
            : "Recorded one at a time. Not many yet — more as they go up."}
        </p>

        <ul className="mt-8 max-w-2xl">
          {tracks.map((track) => (
            <AudioPlayer
              key={track.title}
              src={track.src}
              title={track.title}
              note={track.note[locale]}
              instrument={track.instrument}
              unavailableLabel={
                locale === "th" ? "ยังไม่มีไฟล์เสียง" : "No recording yet"
              }
            />
          ))}
        </ul>

        {!hasAudio && (
          <p className="mt-8 max-w-2xl border border-dashed border-line p-4 text-sm text-muted">
            {copy.music.note}
          </p>
        )}
      </section>

      {/* ---- The practice list -------------------------------------- */}
      <section className="mt-20">
        <h2 className="font-display text-xl font-semibold">
          {locale === "th" ? "เพลงที่กำลังหัด" : "Pieces I'm learning"}
        </h2>

        {/*
          This is the honest framing and it has to stay honest: every link
          below is somebody else's video. Without saying so plainly, a list of
          73 songs on a page titled "Music" reads as 73 songs he can play.
        */}
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {locale === "th"
            ? "เพลย์ลิสต์ซ้อมของผม — คลิปทั้งหมดเป็นของคนอื่น ไม่ใช่ผมเล่น ผมเก็บไว้แกะแท็บและฟังวิธีวางมือ ชื่อข้างหลังคือช่องที่ทำคลิปนั้น กดแล้วไปที่ต้นฉบับบน YouTube"
            : "My practice playlist. Every clip here belongs to someone else — none of it is me playing. I keep them to work out the tab and listen to how the hands move. The name after each title is the channel that made it; the link goes to the original on YouTube."}
        </p>

        <p className="hud mt-6 text-muted">
          {pieces.length}
          {locale === "th" ? " เพลง" : " pieces"}
        </p>

        <ol className="mt-3 grid gap-px border-y border-line bg-line sm:grid-cols-2">
          {pieces.map((row, i) => (
            <Row key={row.id} row={row} n={i + 1} />
          ))}
        </ol>

        {technique.length > 0 && (
          <>
            <p className="hud mt-12 text-muted">
              {locale === "th"
                ? "ไม่ใช่เพลง — คลิปเทคนิค"
                : "Not pieces — technique"}
            </p>
            <ol className="mt-3 grid gap-px border-y border-line bg-line sm:grid-cols-2">
              {technique.map((row, i) => (
                <Row key={row.id} row={row} n={i + 1} />
              ))}
            </ol>
          </>
        )}
      </section>
    </>
  );
}

function Row({ row, n }: { row: LearningTrack; n: number }) {
  return (
    <li className="bg-paper">
      <a
        href={`https://www.youtube.com/watch?v=${row.id}`}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-baseline gap-3 px-3 py-3 transition hover:bg-panel"
      >
        <span className="hud w-6 shrink-0 tabular-nums text-line-bright">
          {String(n).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <span className="block text-sm leading-snug">{row.title}</span>
          <span className="hud mt-1 block text-muted">{row.by}</span>
        </span>
      </a>
    </li>
  );
}
