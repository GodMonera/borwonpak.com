import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PageHeader } from "@/components/ui";
import { Guestbook } from "@/components/guestbook";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.guestbook.title, description: copy.guestbook.sub };
}

export default async function GuestbookPage({
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
      <PageHeader title={copy.guestbook.title} sub={copy.guestbook.sub} />
      <Guestbook
        locale={locale}
        copy={{
          ...copy.guestbook,
          error: copy.common.error,
          loading: copy.common.loading,
        }}
      />
    </>
  );
}
