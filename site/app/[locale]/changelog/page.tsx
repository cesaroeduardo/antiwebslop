import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import content from '@/content/generated.json';
import { changelog } from '@/content/changelog';
import { Changelog } from '@/components/Changelog';
import { CopyCommand } from '@/components/CopyCommand';
import { Motion } from '@/components/Motion';
import { BackToTop } from '@/components/BackToTop';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { routing, localePath } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

const UPDATE_CMD = 'npx skills update antiwebslop';

const ogLocale: Record<string, string> = { en: 'en_US', pt: 'pt_BR', fr: 'fr_FR', es: 'es_ES' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'changelog' });
  const title = t('metaTitle');
  const description = t('metaDescription');
  const canonical = localePath(locale, '/changelog');
  const pageUrl = `${SITE_URL}${canonical}`;
  const ogImage = {
    url: '/og-new.png',
    width: 1200,
    height: 630,
    alt: t('ogAlt'),
    type: 'image/png' as const,
  };
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l === 'pt' ? 'pt-BR' : l, localePath(l, '/changelog')])),
        'x-default': localePath('en', '/changelog'),
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
  };
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-accent-fg"
      >
        {t('common.skip')}
      </a>
      <Motion />
      <div aria-hidden className="site-noise pointer-events-none fixed inset-0 z-40 opacity-10 mix-blend-overlay motion-reduce:hidden" />

      <div id="top">
        <SiteHeader locale={locale} t={t} path="/changelog" />
      </div>

      <main id="main" className="relative overflow-x-clip">
        <section className="mx-auto w-full max-w-wide scroll-mt-6 px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16">
          <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-center md:justify-between md:gap-8">
            <h1 className="text-[clamp(2rem,0.2rem+8.5vw,2.375rem)] font-medium leading-[1.02] tracking-[-0.04em] [text-wrap:balance] md:text-[2.5rem] lg:text-[clamp(2.5rem,0.5rem+2.5vw,3.15rem)]">
              {t('changelog.title')}
            </h1>
            <CopyCommand command={UPDATE_CMD} label={t('changelog.updateLabel')} compact />
          </div>
          <div aria-hidden className="fade-rule-t mb-10 h-px md:mb-12" />
          <Changelog entries={changelog} />
        </section>
      </main>

      <BackToTop label={t('common.toTop')} targetId="entries" />
      <SiteFooter locale={locale} t={t} version={content.version} />
    </>
  );
}
