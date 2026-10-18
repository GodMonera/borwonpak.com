import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PageHeader } from "@/components/ui";
import { Fretboard } from "@/components/lab/fretboard";
import { PayrollCalculator } from "@/components/lab/payroll";
import { SmartBin } from "@/components/lab/smart-bin";

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

  return (
    <>
      <PageHeader index="03" title={copy.lab.title} sub={copy.lab.sub} />

      <div className="space-y-16">
        <Experiment
          n="01"
          title={th ? "แผนผังคอร์ดกีตาร์" : "Guitar chord explorer"}
          blurb={
            th
              ? "คอร์ดที่ผมใช้บ่อยตอนเล่น fingerstyle กดฟังเสียงได้ เสียงสังเคราะห์สดในเบราว์เซอร์"
              : "The chords I reach for most in fingerstyle. Tap to hear them — synthesised live in your browser."
          }
        >
          <Fretboard locale={locale} />
        </Experiment>

        <Experiment
          n="02"
          title={th ? "เครื่องคิดค่าสอนติวเตอร์" : "Tutor payroll calculator"}
          blurb={
            th
              ? "ตัวอย่างของปัญหาที่ผมเจอจริงใน IQ Tutor: กฎการจ่ายเงินที่ซ้อนกันหลายชั้น ลองปรับดูว่ากฎไหนชนะกฎไหน"
              : "A stand-in for the real problem in IQ Tutor: payroll rules stacked on top of each other. Change the inputs and watch which rule wins."
          }
        >
          <PayrollCalculator locale={locale} />
        </Experiment>

        <Experiment
          n="03"
          title={th ? "ถังขยะ ESP32 จำลอง" : "ESP32 smart bin simulator"}
          blurb={
            th
              ? "ถังขยะที่ผมประกอบตอนเรียน ย้ายมาอยู่ในเบราว์เซอร์ พร้อม serial output จำลอง"
              : "The bin I built at university, moved into the browser — with a stand-in serial log."
          }
        >
          <SmartBin locale={locale} />
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
          <p className="mt-1 max-w-2xl text-sm text-muted">{blurb}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
