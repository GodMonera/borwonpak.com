import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tracks } from "@/content/site";
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

  return (
    <>
      <PageHeader title={copy.music.title} sub={copy.music.sub} />

      <div className="max-w-2xl">
        <p className="leading-relaxed text-muted">
          {locale === "th"
            ? "ผมเล่นกีตาร์แบบ fingerstyle มาหลายปี เป็นงานอดิเรกที่สอนเรื่องเดียวกับการเขียนโค้ด — ซ้อมช้า ๆ ทีละท่อน แล้ววันหนึ่งมันก็ไหลไปเองทั้งเพลง ส่วนขลุ่ยเป็นของที่เริ่มทีหลัง และยังเป่าได้ไม่กี่เพลง"
            : "I've played fingerstyle guitar for years. It teaches the same thing programming does — practise one bar slowly, over and over, and one day the whole piece just flows. The flute came later and I can still only play a handful of songs on it."}
        </p>

        <ul className="mt-10">
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
          <p className="mt-8 rounded-lg border border-dashed border-line p-4 text-sm text-muted">
            {copy.music.note}
          </p>
        )}
      </div>
    </>
  );
}
