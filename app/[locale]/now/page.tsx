import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nowItems, nowUpdated } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PageHeader } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.now.title, description: copy.now.sub };
}

export default async function NowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);

  return (
    <>
      <PageHeader
        index="04"
        kicker={`${copy.common.updated} ${nowUpdated}`}
        title={copy.now.title}
        sub={copy.now.sub}
      />
      <div className="max-w-2xl space-y-8">
        {nowItems.map((item) => (
          <section key={item.heading.en}>
            <h2 className="hud text-abalone">
              {item.heading[locale]}
            </h2>
            <p className="mt-2 leading-relaxed text-muted">
              {item.body[locale]}
            </p>
          </section>
        ))}
      </div>
      <p className="mt-12 max-w-2xl border-t border-line pt-6 text-sm text-muted">
        {locale === "th"
          ? "หน้านี้ได้แรงบันดาลใจจาก nownownow.com — แนวคิดคือบอกว่ากำลังโฟกัสอะไร ไม่ใช่โชว์ทุกอย่างที่เคยทำ"
          : "This page follows the /now convention from nownownow.com — what I'm focused on, not everything I've ever done."}
      </p>
    </>
  );
}
