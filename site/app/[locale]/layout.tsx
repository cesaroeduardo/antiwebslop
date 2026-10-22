import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { DM_Mono, DM_Sans } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/JsonLd';
import content from '@/content/generated.json';
import { routing, localePath } from '@/i18n/routing';
import { AUTHOR_URL, SITE_URL } from '@/lib/site';
import '../globals.css';

const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' });
const sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-sans', display: 'swap' });

const ogLocale: Record<string, string> = { en: 'en_US', pt: 'pt_BR', fr: 'fr_FR', es: 'es_ES' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t('title');
  const description = t('description', { entries: content.catalogCount, rules: content.ruleCount });
  const canonical = localePath(locale);
  const pageUrl = `${SITE_URL}${canonical === '/' ? '' : canonical}`;
  const ogImage = {
    url: '/og.png',
    width: 1200,
    height: 630,
    alt: t('ogAlt'),
    type: 'image/png' as const,
  };
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    applicationName: 'antiwebslop',
    authors: [{ name: 'Eduardo de Cesaro', url: AUTHOR_URL }],
    creator: 'Eduardo de Cesaro',
    publisher: 'Eduardo de Cesaro',
    category: 'technology',
    keywords: ['antiwebslop', 'AI design', 'agent skill', 'Cursor', 'Claude Code', 'Codex', 'web design', 'slop lint', 'DESIGN.md'],
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l === 'pt' ? 'pt-BR' : l, localePath(l)])),
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      url: pageUrl,
      siteName: 'antiwebslop',
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
    { media: '(prefers-color-scheme: light)', color: '#121212' },
  ],
  colorScheme: 'dark',
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  const description = t('description', { entries: content.catalogCount, rules: content.ruleCount });
  return (
    <html lang={locale === 'pt' ? 'pt-BR' : locale} className={`${mono.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <JsonLd locale={locale} title={t('title')} description={description} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
