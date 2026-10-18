import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { photos } from "@/content/site";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PageHeader } from "@/components/ui";
import { GalleryGrid } from "@/components/gallery-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);
  return { title: copy.gallery.title, description: copy.gallery.sub };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);

  const items = photos.map((photo) => ({
    src: photo.src,
    caption: photo.caption[locale],
    w: photo.w,
    h: photo.h,
  }));

  return (
    <>
      <PageHeader index="07" title={copy.gallery.title} sub={copy.gallery.sub} />
      {items.length === 0 ? (
        <p className="max-w-xl border border-dashed border-line p-5 text-sm text-muted">
          {copy.gallery.note}
        </p>
      ) : (
        <GalleryGrid items={items} />
      )}
    </>
  );
}
