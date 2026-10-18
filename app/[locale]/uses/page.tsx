import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { uses } from "@/content/site";
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
  return { title: copy.uses.title, description: copy.uses.sub };
}

export default async function UsesPage({
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
      <PageHeader index="05" title={copy.uses.title} sub={copy.uses.sub} />
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {uses.map((group) => (
          <section key={group.group.en}>
            <h2 className="hud text-teal">
              {group.group[locale]}
            </h2>
            <dl className="mt-3 space-y-3">
              {group.items.map((item) => (
                <div key={item.name}>
                  <dt className="text-sm font-medium">{item.name}</dt>
                  <dd className="text-sm text-muted">{item.note[locale]}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
