import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PageHeader } from "@/components/ui";
import { ChordExplorer } from "@/components/lab/chord-explorer";
import { TabBook } from "@/components/lab/tab-book";
import { QUALITIES, ROOTS } from "@/lib/chords";
import { pieces } from "@/content/tabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.lab.title, description: copy.lab.sub };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);
  const th = locale === "th";

  const chordCount = ROOTS.length * QUALITIES.length;

  return (
    <>
      <PageHeader index="03" title={copy.lab.title} sub={copy.lab.sub} />

      <div className="space-y-16">
        <Experiment
          n="01"
          title={th ? "ค้นคอร์ดกีตาร์" : "Guitar chord finder"}
          blurb={
            th
              ? `${chordCount} คอร์ด จาก ${ROOTS.length} รากเสียง × ${QUALITIES.length} ชนิด — ไม่ได้พิมพ์เก็บไว้สักอัน รูปคอร์ดทุกอันมาจากการให้โปรแกรมไล่หาตำแหน่งบนคอกีตาร์ตอนที่คุณกด แล้วเรียงจากกดง่ายไปยาก กดที่รูปไหนก็ได้เพื่อฟัง`
              : `${chordCount} chords — ${ROOTS.length} roots across ${QUALITIES.length} qualities, and not one of them is stored anywhere. Every shape comes out of a search over the neck the moment you pick a chord, ranked by how hard it is to hold. Tap any diagram to hear it.`
          }
        >
          <ChordExplorer locale={locale} />
        </Experiment>

        <Experiment
          n="02"
          title={th ? "สมุดแท็บกีตาร์คลาสสิก" : "Classical tab book"}
          blurb={
            th
              ? `${pieces.length} เพลงที่ทุกคนเคยได้ยิน ทุกเพลงหมดลิขสิทธิ์แล้ว เก็บไว้เป็น “โน้ต” ไม่ใช่เลขเฟร็ต แล้วให้โปรแกรมหาตำแหน่งที่มือขยับน้อยที่สุดให้ กดเล่นฟังได้ ปรับความเร็วได้ คัดลอกเป็นข้อความไปใช้ต่อได้`
              : `${pieces.length} pieces everyone has heard, all of them out of copyright. Each is stored as notes rather than fret numbers, and the frets are worked out to keep the hand still. Play it, slow it down, or copy it out as plain text.`
          }
        >
          <TabBook locale={locale} />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {th
              ? "ที่นี่เป็นทำนองหลักอย่างเดียว ไม่ใช่ฉบับเรียบเรียงเต็มสำหรับกีตาร์คลาสสิก — ฉบับเต็มของเพลงอย่าง Recuerdos de la Alhambra เป็นงานเรียบเรียงของคนอื่นที่ยังมีลิขสิทธิ์ และยาวเกินกว่าจะใส่ในบรรทัดเดียวได้ ทุกเพลงมีลิงก์ไปโน้ตต้นฉบับฟรีกำกับไว้"
              : "These are melody lines, not concert arrangements. A full transcription of something like Recuerdos de la Alhambra is somebody's copyrighted editorial work, and more than a single stave can hold anyway — so every piece links out to a free authoritative score."}
          </p>
        </Experiment>
      </div>
    </>
  );
}

function Experiment({
  n,
  title,
  blurb,
  children,
}: {
  n: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex gap-4">
        <span className="font-mono text-sm text-brass">{n}</span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            {blurb}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
