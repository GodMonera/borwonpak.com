import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, JetBrains_Mono, Kanit } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { site } from "@/content/site";
import { isLocale, locales, t, type Locale } from "@/lib/i18n";
import type { Skin } from "@/lib/skins";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeScript } from "@/components/theme-script";
import { SiteBackdrop } from "@/components/site-backdrop";
import { getSkin } from "@/lib/settings";
import { AnalyticsBeacon } from "@/components/analytics-beacon";

// Kanit covers Thai and Latin from one family and goes genuinely heavy, which
// is what the wordmark needs — it should read like the badge on an amp.
const display = Kanit({
  variable: "--font-display",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
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

/**
 * The browser chrome should match whichever skin is live, so this reads the
 * setting rather than hard-coding one skin's ground colour.
 */
const CHROME: Record<Skin, { light: string; dark: string }> = {
  neck: { light: "#efe8da", dark: "#191310" },
  hud: { light: "#f4f3ef", dark: "#08090b" },
  palm: { light: "#f2ece0", dark: "#16130f" },
};

export async function generateViewport(): Promise<Viewport> {
  const { light, dark } = CHROME[await getSkin()];
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: light },
      { media: "(prefers-color-scheme: dark)", color: dark },
    ],
  };
}

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
  const skin = await getSkin();

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
      data-skin={skin}
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
          sound={skin === "neck"}
        />
        <AnalyticsBeacon locale={locale} />
        <SiteBackdrop skin={skin} />
        <main id="main" className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
