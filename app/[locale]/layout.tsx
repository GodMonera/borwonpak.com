import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { site } from "@/content/site";
import { isLocale, locales, t, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeScript } from "@/components/theme-script";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const thai = IBM_Plex_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1116" },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = t(locale);

  const title = `${site.name} — ${copy.home.tagline}`;
  const description =
    locale === "th"
      ? "บวรภัค ดวงจันทร์ (ปาล์ม) — วิศวกรคอมพิวเตอร์จากเชียงใหม่ ผลงาน บันทึกการทำงาน และของเล่นที่เล่นได้จริง"
      : "Borwonpak Duangjun (Palm) — computer engineer in Chiang Mai. Projects, build logs, and things you can actually play with.";

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s · ${site.name}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { th: "/th", en: "/en" },
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      type: "website",
      url: `${site.url}/${locale}`,
      siteName: site.name,
      title,
      description,
      locale: locale === "th" ? "th_TH" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = t(locale);

  const primary = [
    { href: `/${locale}/work`, label: copy.nav.work },
    { href: `/${locale}/blog`, label: copy.nav.blog },
    { href: `/${locale}/lab`, label: copy.nav.lab },
    { href: `/${locale}/now`, label: copy.nav.now },
  ];

  const secondary = [
    { href: `/${locale}/music`, label: copy.nav.music },
    { href: `/${locale}/gallery`, label: copy.nav.gallery },
    { href: `/${locale}/gaming`, label: copy.nav.gaming },
    { href: `/${locale}/uses`, label: copy.nav.uses },
    { href: `/${locale}/guestbook`, label: copy.nav.guestbook },
    { href: `/${locale}/cv`, label: copy.nav.cv },
    { href: `/${locale}/ask`, label: copy.nav.ask },
  ];

  return (
    <html
      lang={locale}
      className={`${display.variable} ${thai.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader
          locale={locale}
          primary={primary}
          secondary={secondary}
          askLabel={copy.nav.ask}
          toggleThemeLabel={copy.common.toggleTheme}
          skipLabel={copy.common.skipToContent}
        />
        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-5 py-12">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
