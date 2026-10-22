import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import content from '@/content/generated.json';
import { Catalog, type CatalogGroup } from '@/components/Catalog';
import { CopyCommand } from '@/components/CopyCommand';
import { SiteCanvas } from '@/components/SiteCanvas';
import { SlopDemo } from '@/components/SlopDemo';
import { SlopTellRow } from '@/components/SlopTellRow';
import { Inline } from '@/components/Inline';
import { Motion } from '@/components/Motion';
import { BackToTop } from '@/components/BackToTop';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { localePath } from '@/i18n/routing';
import { canvasSites } from '@/lib/canvas-sites';

const INSTALL_ANY = 'npx skills add cesaroeduardo/antiwebslop';

type T = Awaited<ReturnType<typeof getTranslations>>;

/** One row per agent: logo (public/logos/, see SOURCES.md), name, command. No side notes. */
const installRows = (t: T): { agent: string; logo?: string; logoSize?: string; command: string }[] => [
  { agent: 'Cursor', logo: 'cursor', command: 'npx skills add cesaroeduardo/antiwebslop -a cursor' },
  { agent: 'Codex', logo: 'openai', command: 'codex plugin marketplace add cesaroeduardo/antiwebslop && codex plugin add antiwebslop@antiwebslop' },
  { agent: 'Code', logo: 'claude', command: 'claude plugin marketplace add cesaroeduardo/antiwebslop && claude plugin install antiwebslop@antiwebslop' },
  // Grok’s line mark reads smaller than solid marks at the same box — bump optical size.
  { agent: 'Grok', logo: 'grok', logoSize: 'size-6', command: 'Save the antiwebslop skill from https://github.com/cesaroeduardo/antiwebslop (folder skills/antiwebslop)' },
  { agent: t('install.anyAgent'), command: INSTALL_ANY },
];

/** Usage prompts with `/antiwebslop`. */
const commandRows = (t: T): string[] => [
  t('commands.exReview'),
  t('commands.exBuild'),
  t('commands.exGeneric'),
  t('commands.exRestyle'),
  t('commands.exPlaywright'),
  t('commands.exGuidelines'),
  t('commands.exImageToCode'),
  t('commands.exReference'),
];

/** The newer tells: HTML cutouts (not photos). Each row shows a focused slop mock that the skill tags on scroll. */
const tellRows: { key: 'words' | 'icons' | 'loops' | 'placeholders'; rules: string[] }[] = [
  { key: 'loops', rules: ['attention-loop', 'bounce-easing', 'period-logo'] },
  { key: 'placeholders', rules: ['svg-placeholder', 'blur-blob'] },
  { key: 'words', rules: ['eyebrow-kicker', 'em-dash-overuse', 'not-x-a-y'] },
  { key: 'icons', rules: ['icon-soup', 'generic-cta', 'side-tab-border'] },
];

function Section({ id, children, className = '', 'aria-label': ariaLabel }: { id?: string; children: React.ReactNode; className?: string; 'aria-label'?: string }) {
  // Callers may pass max-w-[…] to override the default page width.
  const maxW = /\bmax-w-/.test(className) ? '' : 'max-w-wide';
  return (
    <section id={id} aria-label={ariaLabel} className={`mx-auto w-full ${maxW} scroll-mt-6 px-4 sm:px-6 ${className}`.replace(/\s+/g, ' ').trim()}>
      {children}
    </section>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { catalog, priorArt, version } = content;
  const install = installRows(t);
  const commands = commandRows(t);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-accent-fg">
        {t('common.skip')}
      </a>
      <Motion />
      {/* Hero photo, full bleed behind the header and the hero (first screen), after noone.is. Decorative.
          Scrims in the bg color keep the headline, line and install command AA readable on the bottom edge.
          The flickering grain (from figma-dominate) stays fixed over the whole page. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[64svh] min-h-[420px] overflow-hidden md:h-[100svh] md:min-h-[560px]">
        <Image
          src="/hero/portrait.webp"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRtoAAABXRUJQVlA4IM4AAAAQBgCdASoYABgAPu1sq1EppaOiqAqpMB2JQBOmYxDdq1Ac2BufaZKsvobR8TNRaibHOIAdiFwKHwAAyjRhup25dUrnD71y2a/11ORFW9bLvTwviRyc6uczR5eEWLCdsI8updqP7hzCPojWY3/t8T+/aytfKI2mOLwxtGPwdVhbRoOiKJI/hkjvFkgAQ+8HG29WO244la88esWGtBG3J7evrDEFsrWL58rZDh2XqtV+IHYAV1klWWy8ue0uYiz2XpT+SXYjQc8xgTei9ZgAAA=="
          className="object-cover object-[28%_38%] md:object-[32%_42%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg from-12% via-bg/85 via-40% to-transparent to-80%" />
        <div className="absolute inset-0 bg-linear-to-r from-bg/70 to-transparent to-55%" />
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg/70 to-transparent" />
      </div>
      <div aria-hidden className="site-noise pointer-events-none fixed inset-0 z-40 opacity-10 mix-blend-overlay motion-reduce:hidden" />

      <SiteHeader locale={locale} t={t} />

      <main id="main" className="relative overflow-x-clip">
        {/* Hero: fills the first screen; on its bottom edge the headline (one sentence) takes the left 7 columns (2-4 lines) and the
            line plus the install command sit to its right, top-aligned with the headline's first line (after noone.is). */}
        <Section id="top" className="flex min-h-[calc(100svh-76px)] flex-col justify-end pb-16 pt-12 md:pt-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start md:gap-6">
            <h1 className="text-[clamp(2rem,0.2rem+8.5vw,2.375rem)] font-medium leading-[1.02] tracking-[-0.04em] [text-wrap:balance] md:col-span-7 md:text-[2.5rem] lg:text-[clamp(3rem,0.5rem+3.9vw,4rem)]">
              {t('hero.title')}
            </h1>
            <div className="flex flex-col gap-4 md:col-span-5 md:pt-[0.4rem] lg:pt-[0.55rem]">
              <p className="max-w-[44ch] font-mono text-sm text-muted md:text-base">{t('hero.line')}</p>
              <CopyCommand command={INSTALL_ANY} label={t('hero.installLabel')} />
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#commands"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-control bg-accent px-4 font-mono text-sm font-medium text-accent-fg transition-opacity duration-150 hover:opacity-90 active:opacity-80"
                >
                  {t('hero.seeUseCases')}
                  <ArrowDown aria-hidden size={14} strokeWidth={2} className="shrink-0" />
                </a>
                <a
                  href={localePath(locale, '/changelog')}
                  className="inline-flex h-11 items-center justify-center rounded-control border border-border px-4 font-mono text-sm text-fg transition-[color,border-color,background-color] duration-150 hover:border-border-strong hover:bg-surface-2"
                >
                  {t('nav.changelog')}
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* Canvas: real sites from the galleries the skill points to, on a surface with no edge. No intro text:
            the hero leads straight into it, 192px below the hero copy on phones, 256px from md (64 hero + 128/192 here). */}
        <section id="references" aria-label={t('references.sectionLabel')} className="scroll-mt-6 pt-32 md:pt-48">
          <SiteCanvas sites={canvasSites} />
        </section>

        {/* Newer tells: HTML cutouts + topic. Row hover (desktop) or in-view (mobile) runs the skill-scan. */}
        <section id="gallery" aria-label={t('gallery.title')} className="mx-auto w-full max-w-[1100px] scroll-mt-6 px-4 pt-32 sm:px-6 md:pt-40">
          <ul className="flex flex-col gap-20 md:gap-[120px]">
            {tellRows.map((row) => (
              <SlopTellRow key={row.key} className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-x-12" data-reveal>
                <SlopDemo kind={row.key} label={t(`gallery.${row.key}Alt`)} />
                <div className="mx-4 flex flex-col gap-8 md:mx-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-medium tracking-[-0.02em] md:text-2xl">{t(`gallery.${row.key}Title`)}</h2>
                    <p className="max-w-[34ch] text-body text-muted">{t(`gallery.${row.key}Body`)}</p>
                  </div>
                  <ul className="flex flex-wrap gap-2" aria-label={t('gallery.rulesAria')}>
                    {row.rules.map((r) => (
                      <li key={r}><code className="inline-block rounded-control bg-surface-2 px-3 py-1.5 font-mono text-sm text-fg">{r}</code></li>
                    ))}
                  </ul>
                </div>
              </SlopTellRow>
            ))}
          </ul>
        </section>

        {/* Commands: prompts only, above the catalog accordion. */}
        <Section id="commands" className="max-w-[1100px] pt-32 md:pt-40">
          <h2 className="mx-auto mb-8 max-w-[40rem] text-center text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('commands.title')}</h2>
          <ul
            className="install-rules relative grid grid-cols-1 md:grid-cols-[1fr_minmax(0,40rem)_1fr]"
            data-reveal
          >
            {commands.map((command) => (
              <li
                key={command}
                className="group relative grid grid-cols-1 px-5 py-6 sm:px-6 md:col-span-3 md:grid-cols-subgrid md:items-center md:px-8 md:py-7"
              >
                <span className="hidden md:block" aria-hidden />
                <div className="min-w-0">
                  <CopyCommand command={command} label={command} />
                </div>
                <span className="hidden md:block" aria-hidden />
              </li>
            ))}
          </ul>
        </Section>

        {/* Catalog: accordion rows only (section title stays in aria-label). */}
        <Section id="catalog" className="max-w-[740px] pt-32 md:pt-40" aria-label={t('catalog.title')}>
          <Catalog groups={catalog as CatalogGroup[]} />
        </Section>

        {/* Install: full-width hairlines; equal 1fr side tracks center the logo + 640px prompt columns. */}
        <Section id="install" className="max-w-[1100px] pt-32 md:pt-40">
          <h2 className="mb-8 text-center text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('install.title')}</h2>
          <ul
            className="install-rules relative grid grid-cols-1 md:grid-cols-[1fr_max-content_minmax(0,40rem)_1fr]"
            data-reveal
          >
            {install.map((row) => (
              <li
                key={row.agent}
                className="group relative grid grid-cols-1 gap-3 px-5 py-6 sm:px-6 md:col-span-4 md:grid-cols-subgrid md:items-center md:gap-x-8 md:px-8 md:py-7"
              >
                <span className="hidden md:block" aria-hidden />
                <span className="flex items-center gap-3 font-mono text-sm text-fg">
                  {row.logo ? (
                    <span
                      aria-hidden
                      className={`${row.logoSize ?? 'size-[18px]'} shrink-0 bg-fg transition-colors duration-150 group-hover:bg-accent group-focus-within:bg-accent`}
                      style={{ mask: `url(/logos/${row.logo}.svg) center / contain no-repeat`, WebkitMask: `url(/logos/${row.logo}.svg) center / contain no-repeat` }}
                    />
                  ) : null}
                  {row.agent}
                </span>
                <div className="min-w-0">
                  <CopyCommand command={row.command} label={t('install.rowLabel', { agent: row.agent })} />
                </div>
                <span className="hidden md:block" aria-hidden />
              </li>
            ))}
          </ul>
        </Section>

        {/* Prior art: the references the skill draws on, credited. */}
        <Section id="prior-art" className="max-w-[1100px] pb-32 pt-32 md:pb-40 md:pt-40">
          <h2 className="mb-6 text-lg font-medium">{t('compare.priorArt')}</h2>
          <ul lang="en" className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {priorArt.map((p) => (
              <li key={p.name} className="prose-inline text-sm text-muted">
                <a className="link text-fg" href={p.url}>{p.name}</a>
                {p.by ? ` ${t('compare.by', { name: p.by })}` : ''}{p.license ? ` (${p.license})` : ''}: <Inline text={p.note} />
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <BackToTop label={t('common.toTop')} />
      <SiteFooter locale={locale} t={t} version={version} />
    </>
  );
}
