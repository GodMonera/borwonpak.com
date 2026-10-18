import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PageHeader } from "@/components/ui";
import { Chat } from "@/components/chat";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.ask.title, description: copy.ask.sub };
}

export default async function AskPage({
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
      <PageHeader title={copy.ask.title} sub={copy.ask.sub} />
      <Chat
        locale={locale}
        copy={{
          ...copy.ask,
          send: copy.common.send,
          error: copy.common.error,
        }}
      />
    </>
  );
}
