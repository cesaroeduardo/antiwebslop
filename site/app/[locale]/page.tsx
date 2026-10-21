import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import content from '@/content/generated.json';
import { Catalog, type CatalogGroup } from '@/components/Catalog';
import { CopyCommand } from '@/components/CopyCommand';
import { GitHubStars } from '@/components/GitHubStars';
import { SiteCanvas } from '@/components/SiteCanvas';
import { Inline } from '@/components/Inline';
import { Motion } from '@/components/Motion';
import { Wordmark } from '@/components/Wordmark';
import { LanguageSelect, type LanguageOption } from '@/components/LanguageSelect';
import { localePath } from '@/i18n/routing';
import { REPO, blob, tree } from '@/lib/site';
import { canvasSites } from '@/lib/canvas-sites';

const INSTALL_ANY = 'npx skills add cesaroeduardo/antiwebslop';

type T = Awaited<ReturnType<typeof getTranslations>>;
const rich = {
  code: (c: React.ReactNode) => <code>{c}</code>,
};

/** One row per agent: logo (public/logos/, see SOURCES.md), name, command. No side notes. */
const installRows = (t: T): { agent: string; logo?: string; command: string }[] => [
  { agent: t('install.anyAgent'), command: INSTALL_ANY },
  { agent: 'Cursor', logo: 'cursor', command: 'npx skills add cesaroeduardo/antiwebslop -a cursor' },
  { agent: 'Codex', logo: 'openai', command: 'codex plugin marketplace add cesaroeduardo/antiwebslop && codex plugin add antiwebslop@antiwebslop' },
  { agent: 'Claude Code', logo: 'claude', command: 'claude plugin marketplace add cesaroeduardo/antiwebslop && claude plugin install antiwebslop@antiwebslop' },
  { agent: 'Grok Bot', logo: 'grok', command: 'Save the antiwebslop skill from https://github.com/cesaroeduardo/antiwebslop (folder skills/antiwebslop)' },
];

const tokensBlock = `\`\`\`design-tokens
fonts: DM Mono, DM Sans
colors: #121212, #F7EDDB, #D1A8FF
radii: 0, 6px, 10px, 38px, 57px, 9999px
\`\`\``;

const rubricKeys: [string, string][] = [['A', '20'], ['B', '12'], ['C', '10'], ['D', '']];

const protocolSteps: { key: 'setup' | 'run' | 'blind' | 'decide'; source: string }[] = [
  { key: 'setup', source: 'ab-protocol.md' },
  { key: 'run', source: 'ab-protocol.md' },
  { key: 'blind', source: 'ab-protocol.md' },
  { key: 'decide', source: 'rubric.md' },
];

const scorecard: { key: 'A' | 'B' | 'C' | 'D'; pts?: number }[] = [{ key: 'A', pts: 20 }, { key: 'B', pts: 12 }, { key: 'C', pts: 10 }, { key: 'D' }];

/** The newer tells, stacked image-beside-topic rows after america.gov. Each row zooms into one
    region of the annotated newer-tells capture; `zoom` and `origin` frame the tagged elements. */
const tellRows: { key: 'words' | 'metrics' | 'numbering' | 'loops'; rules: string[]; zoom?: number; origin?: string }[] = [
  { key: 'words', rules: ['eyebrow-kicker', 'em-dash-overuse', 'not-x-a-y'] },
  { key: 'metrics', rules: ['hero-metric'], zoom: 1.35, origin: '50% 72%' },
  { key: 'numbering', rules: ['section-number', 'side-tab-border'], zoom: 2.1, origin: '0% 100%' },
  { key: 'loops', rules: ['attention-loop', 'bounce-easing'], zoom: 2.4, origin: '100% 0%' },
];

const nav: [string, 'references' | 'install'][] = [
  ['#references', 'references'],
  ['#install', 'install'],
];

/** Language select order, as Eduardo asked: PT, EN, ES, FR. Names in their own language. */
const languages: LanguageOption[] = [
  { locale: 'pt', code: 'PT', name: 'Português', hrefLang: 'pt-BR', href: localePath('pt') },
  { locale: 'en', code: 'EN', name: 'English', hrefLang: 'en', href: localePath('en') },
  { locale: 'es', code: 'ES', name: 'Español', hrefLang: 'es', href: localePath('es') },
  { locale: 'fr', code: 'FR', name: 'Français', hrefLang: 'fr', href: localePath('fr') },
];

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[1280px] scroll-mt-6 px-4 sm:px-6 ${className}`}>
      {children}
    </section>
  );
}

function Terminal({ title, lines, className = '', wrap = false }: { title: string; lines: React.ReactNode[]; className?: string; wrap?: boolean }) {
  return (
    <figure className={`overflow-hidden rounded-card border border-border bg-bg ${className}`}>
      <figcaption className="border-b border-border px-4 py-2 font-mono text-cap text-muted">{title}</figcaption>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-cap leading-relaxed text-fg sm:text-sm sm:leading-relaxed">
        {lines.map((l, i) => <span key={i} className={wrap ? 'block whitespace-pre-wrap [overflow-wrap:anywhere]' : 'block whitespace-pre'}>{l}</span>)}
      </pre>
    </figure>
  );
}

/** Image slot: a fixed-ratio frame that holds a generated image later. Pass `src` once the image exists. */
function ImageSlot({ name, ratio, alt, src, className = '' }: { name: string; ratio: string; alt: string; src?: string; className?: string }) {
  return (
    <figure data-slot={name} className={`relative w-full overflow-hidden rounded-card border border-border bg-bg ${className}`} style={{ aspectRatio: ratio.replace(':', ' / ') }}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      ) : (
        <figcaption className="absolute left-3 top-3 font-mono text-cap text-muted">{name} · {ratio}</figcaption>
      )}
    </figure>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { catalog, priorArt, ruleCount, catalogCount, version } = content;
  const install = installRows(t);

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
          sizes="100vw"
          className="object-cover object-[47%_22%] md:object-[50%_28%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg from-12% via-bg/85 via-40% to-transparent to-80%" />
        <div className="absolute inset-0 bg-linear-to-r from-bg/70 to-transparent to-55%" />
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg/70 to-transparent" />
      </div>
      <div aria-hidden className="site-noise pointer-events-none fixed inset-0 z-40 opacity-10 mix-blend-overlay motion-reduce:hidden" />

      <header className="relative mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-4 py-5 sm:gap-6 sm:px-6">
        <a href="#top" aria-label={t('common.backToTop')} className="shrink-0 text-base sm:text-lg"><Wordmark /></a>
        <nav aria-label={t('common.sections')} className="flex min-w-0 items-center gap-0 font-mono text-sm sm:gap-1">
          <ul className="flex items-center">
            {nav.map(([href, key]) => (
              <li key={href} className={key === 'references' ? 'hidden sm:block' : 'hidden min-[440px]:block'}><a href={href} className="inline-block rounded-control px-2 py-2 text-muted transition-colors duration-150 hover:text-fg sm:px-3">{t(`nav.${key}`)}</a></li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5 sm:ml-2 sm:gap-2">
            <LanguageSelect current={locale} options={languages} label={t('common.language')} />
            <GitHubStars />
          </div>
        </nav>
      </header>

      <main id="main" className="relative overflow-x-clip">
        {/* Hero: fills the first screen; on its bottom edge the headline takes the left 7 columns (up to 4 lines) and the
            line plus the install command sit to its right, top-aligned with the headline's first line (after noone.is). */}
        <Section id="top" className="flex min-h-[calc(100svh-76px)] flex-col justify-end pb-16 pt-12 md:pt-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start md:gap-6">
            <h1 className="text-[clamp(1.75rem,-0.1rem+9.5vw,2rem)] font-medium leading-[1.05] tracking-[-0.035em] [text-wrap:balance] md:col-span-7 md:text-[2.25rem] lg:text-[clamp(2.5rem,0.5rem+3vw,3.25rem)]">
              {t('hero.title')}
            </h1>
            <div className="flex flex-col gap-6 md:col-span-5 md:pt-[0.4rem] lg:pt-[0.55rem]">
              <p className="max-w-[44ch] font-mono text-sm text-muted md:text-base">{t('hero.line')}</p>
              <CopyCommand variant="primary" command={INSTALL_ANY} label={t('hero.installLabel')} />
            </div>
          </div>
        </Section>

        {/* Canvas: real sites from the galleries the skill points to, on a surface with no edge. No intro text:
            the hero leads straight into it, 192px below the hero copy on phones, 256px from md (64 hero + 128/192 here). */}
        <section id="references" aria-label={t('references.sectionLabel')} className="scroll-mt-6 pt-32 md:pt-48">
          <SiteCanvas sites={canvasSites} />
        </section>

        {/* What it does: unequal cards with real artifacts, no intro text; each card title is the section's h2. */}
        <section id="what" aria-label={t('what.sectionLabel')} className="mx-auto w-full max-w-[1280px] scroll-mt-6 px-4 pt-32 sm:px-6 md:pt-40">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12" data-reveal>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-7 md:p-8">
              <div className="max-w-[52ch]">
                <h2 className="mb-3 text-xl font-medium leading-[1.05] tracking-[-0.03em] md:text-2xl">{t('what.catalogTitle')}</h2>
                <p className="text-base text-muted">
                  {t.rich('what.catalogBody', { count: catalogCount, code: (c) => <code className="font-mono text-fg">{c}</code> })}
                </p>
              </div>
              <ImageSlot name="catalog-findings" ratio="16:9" src="/slots/catalog-findings.webp" alt={t('what.catalogAlt')} className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-5 md:p-8">
              <div>
                <h2 className="mb-3 text-xl font-medium leading-[1.05] tracking-[-0.03em] md:text-2xl">{t('what.briefTitle')}</h2>
                <p className="text-base text-muted">
                  {t.rich('what.briefBody', { code: (c) => <code className="font-mono text-fg">{c}</code> })}
                </p>
              </div>
              <Terminal title="site/DESIGN.md" lines={tokensBlock.split('\n')} className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-5 md:p-8">
              <div>
                <h2 className="mb-3 text-xl font-medium leading-[1.05] tracking-[-0.03em] md:text-2xl">{t('what.hookTitle')}</h2>
                <p className="text-base text-muted">{t('what.hookBody')}</p>
              </div>
              <ImageSlot name="hook-feedback" ratio="4:3" src="/slots/hook-feedback.webp" alt={t('what.hookAlt')} className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-7 md:p-8">
              <div className="max-w-[52ch]">
                <h2 className="mb-3 text-xl font-medium leading-[1.05] tracking-[-0.03em] md:text-2xl">{t('what.proveTitle')}</h2>
                <p className="text-base text-muted">{t('what.proveBody')}</p>
              </div>
              {/* The scorecard by weight: A dominates (20 of 42), B and C stack beside it, D is a dashed gate under all three.
                  Hairlines, not boxes, so there are no cards inside the card. */}
              <dl className="mt-auto grid grid-cols-[1.6fr_1fr] border-y border-border font-mono" aria-label={t('what.scorecardCaption')}>
                <div className="row-span-2 flex flex-col justify-between gap-6 border-r border-border py-5 pr-5 sm:pr-8">
                  <dt className="text-sm text-fg"><span className="mr-2 text-muted">A</span>{t('rubric.A')}</dt>
                  <dd className="text-[clamp(4rem,2.4rem+5vw,7rem)] font-medium leading-[0.85] tracking-[-0.05em] tabular-nums text-fg">
                    20<span className="ml-2 text-sm font-normal tracking-normal text-muted">{t('what.pts')}</span>
                  </dd>
                </div>
                {rubricKeys.filter(([k]) => k === 'B' || k === 'C').map(([k, pts]) => (
                  <div key={k} className="flex flex-col justify-between gap-3 py-5 pl-5 sm:pl-8 [&:nth-child(2)]:border-b [&:nth-child(2)]:border-border">
                    <dt className="text-sm text-fg"><span className="mr-2 text-muted">{k}</span>{t(`rubric.${k as 'B'}`)}</dt>
                    <dd className="text-2xl font-medium leading-none tracking-[-0.04em] tabular-nums text-fg md:text-3xl">
                      {pts}<span className="ml-2 text-cap font-normal tracking-normal text-muted">{t('what.pts')}</span>
                    </dd>
                  </div>
                ))}
                <div className="col-span-2 flex items-baseline justify-between gap-4 border-t border-dashed border-border-strong py-4">
                  <dt className="text-sm text-fg"><span className="mr-2 text-muted">D</span>{t('rubric.D')}</dt>
                  <dd className="text-cap text-muted">{t('what.gate')} · {t('eval.passFail')}</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        {/* Catalog: heading column on the left, accordion rows on the right. */}
        <Section id="catalog" className="pt-32 md:pt-40">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <div className="md:sticky md:top-8">
                <h2 className="mb-4 text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('catalog.title', { count: catalogCount })}</h2>
                <p className="mb-4 max-w-[40ch] text-base text-muted">{t('catalog.body')}</p>
                {locale === 'en' ? null : <p lang={locale} className="mb-4 max-w-[40ch] font-mono text-cap text-muted">{t('catalog.englishNote')}</p>}
                <a className="link font-mono text-sm" href={blob('skills/antiwebslop/references/anti-patterns.md')}>{t('catalog.link')}</a>
              </div>
            </div>
            <div className="md:col-span-8">
              <Catalog groups={catalog as CatalogGroup[]} />
            </div>
          </div>
        </Section>

        {/* Newer tells: america.gov's stacked media rows, no text but the rule chips. 12 columns: image at columns 2-7
            (bigger than america.gov's 4, same proportions), one empty column, chips at 9-12, vertically centered.
            Rows 120px apart (80 under md); image radius 57px (38px under md); 40px image-to-chips on phones. */}
        <section id="gallery" aria-label={t('gallery.title')} className="mx-auto w-full max-w-[1280px] scroll-mt-6 px-4 pt-32 sm:px-6 md:pt-40">
          <ul className="flex flex-col gap-20 md:gap-[120px]">
            {tellRows.map((row) => (
              <li key={row.key} className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-x-6" data-reveal>
                <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-media bg-surface md:col-span-6 md:col-start-2">
                  <Image
                    src="/slots/newer-tells.webp"
                    alt={t(`gallery.${row.key}Alt`)}
                    fill
                    sizes={row.zoom ? '(min-width: 768px) 1448px, 200vw' : '(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw'}
                    priority={false}
                    className="object-cover"
                    style={row.zoom ? { transform: `scale(${row.zoom})`, transformOrigin: row.origin } : undefined}
                  />
                </figure>
                <ul className="flex flex-wrap gap-2 md:col-span-4 md:col-start-9" aria-label={t('gallery.rulesAria')}>
                  {row.rules.map((r) => (
                    <li key={r}><code className="inline-block rounded-control bg-surface-2 px-3 py-1.5 font-mono text-sm text-fg">{r}</code></li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Install: dense rows, one per agent: logo and name, then the command with its copy button top-aligned. */}
        <Section id="install" className="pt-32 md:pt-40">
          <h2 className="mb-8 text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('install.title')}</h2>
          <ul className="border-t border-border" data-reveal>
            {install.map((row) => (
              <li key={row.agent} className="group grid grid-cols-1 gap-3 border-b border-border py-4 md:grid-cols-12 md:items-start md:gap-6">
                <span className="flex items-center gap-3 font-mono text-sm text-fg md:col-span-3 md:pt-2">
                  {/* Monochrome mark as a CSS mask, so it takes the page ink and the accent on row hover. Decorative: the name is the label. */}
                  {row.logo ? (
                    <span
                      aria-hidden
                      className="size-[18px] shrink-0 bg-fg transition-colors duration-150 group-hover:bg-accent group-focus-within:bg-accent"
                      style={{ mask: `url(/logos/${row.logo}.svg) center / contain no-repeat`, WebkitMask: `url(/logos/${row.logo}.svg) center / contain no-repeat` }}
                    />
                  ) : (
                    <span aria-hidden className="size-[18px] shrink-0" />
                  )}
                  {row.agent}
                </span>
                <div className="flex min-w-0 items-start gap-2 md:col-span-9">
                  <code className="min-w-0 flex-1 whitespace-pre-wrap rounded-control bg-surface px-3 py-2 font-mono text-cap leading-relaxed text-fg [overflow-wrap:anywhere] sm:text-sm">{row.command}</code>
                  <CopyCommand command={row.command} label={t('install.rowLabel', { agent: row.agent })} />
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* Eval: the A/B protocol as a short four-phase timeline on the left; the 42-point scorecard drawn to scale on the right. */}
        <Section id="eval" className="pb-32 pt-32 md:pb-40 md:pt-40">
          <h2 className="border-b border-border pb-10 text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('eval.title')}</h2>

          <div className="grid grid-cols-1 gap-16 pt-12 md:grid-cols-12 md:gap-6 md:pt-16">
            <ol className="relative md:col-span-7 md:pr-12" data-reveal aria-label={t('eval.protocolAria')}>
              {protocolSteps.map((step) => (
                <li key={step.key} className="relative grid grid-cols-1 gap-3 border-l border-border-strong pb-12 pl-6 last:border-l-transparent last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:pl-8">
                  <span aria-hidden className="absolute -left-[5px] top-[0.4rem] size-[9px] bg-fg" />
                  <p className="font-mono text-cap text-muted">
                    <span className="block text-sm text-fg">{t(`eval.${step.key}Phase`)}</span>
                    <a className="link block" href={blob(`eval/${step.source}`)}>{step.source}</a>
                  </p>
                  <div>
                    <h3 className="mb-2 text-lg font-medium">{t(`eval.${step.key}Title`)}</h3>
                    <p className="max-w-[48ch] text-base text-muted">{t(`eval.${step.key}Short`)}</p>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="md:col-span-5" aria-label={t('eval.asideAria')}>
              <figure className="rounded-card border border-border bg-surface p-5 sm:p-6 md:sticky md:top-8">
                <figcaption className="mb-5 flex items-baseline justify-between gap-4 font-mono text-cap text-muted">
                  <span>{t('eval.scaleCaption')}</span>
                  <span className="tabular-nums text-fg">{t('eval.scaleTotal')}</span>
                </figcaption>
                <div className="flex h-16 gap-1 font-mono text-cap" aria-hidden>
                  {scorecard.filter((s) => s.pts).map((s) => (
                    <span key={s.key} className="flex items-end justify-between gap-1 bg-surface-2 p-2 text-fg" style={{ flexGrow: s.pts ?? 0, flexBasis: 0 }}><span>{s.key}</span><span className="hidden tabular-nums text-muted sm:inline">{s.pts}</span></span>
                  ))}
                  <span className="flex w-12 shrink-0 items-end border border-dashed border-border-strong p-2 text-muted">D</span>
                </div>
                <table className="mt-5 w-full border-collapse text-left text-sm">
                  <caption className="sr-only">{t('eval.tableCaption')}</caption>
                  <tbody>
                    {scorecard.map((s) => (
                      <tr key={s.key} className="border-t border-border align-top">
                        <th scope="row" className="w-8 py-3 font-mono text-cap font-normal text-muted">{s.key}</th>
                        <td className="py-3 text-fg">{t(`rubric.${s.key}`)}</td>
                        <td className="whitespace-nowrap py-3 pl-3 text-right font-mono text-cap tabular-nums text-fg">{s.pts ? t('eval.pts', { count: s.pts }) : t('eval.passFail')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            </aside>
          </div>
        </Section>

        {/* Prior art: credits for the work this builds on. */}
        <Section id="prior-art" className="pb-32 md:pb-40">
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

      <footer className="relative overflow-hidden border-t border-border">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-8 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Wordmark className="text-lg" />
            <p className="mt-4 max-w-[36ch] text-sm text-muted">{t('footer.tagline')}</p>
          </div>
          {[
            [t('footer.project'), [[t('footer.github'), REPO], [t('footer.issues'), `${REPO}/issues`], [t('footer.license'), blob('LICENSE')]]],
            [t('footer.read'), [['SKILL.md', blob('skills/antiwebslop/SKILL.md')], [t('footer.antiPatterns'), blob('skills/antiwebslop/references/anti-patterns.md')], [t('footer.evalKit'), tree('eval')], [t('footer.designMd'), blob('site/DESIGN.md')]]],
            [t('footer.install'), [['npx skills', '#install'], ['Cursor', '#install'], ['Claude Code', '#install'], ['Codex', '#install']]],
          ].map(([title, links]) => (
            <nav key={title as string} aria-label={title as string} className="md:col-span-2 md:last:col-span-3">
              <h2 className="mb-3 font-mono text-cap text-muted">{title as string}</h2>
              <ul className="flex flex-col gap-2 text-sm">
                {(links as [string, string][]).map(([label, href]) => (
                  <li key={label}><a className="text-fg transition-colors duration-150 hover:text-accent" href={href}>{label}</a></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap justify-between gap-2 border-t border-border px-4 py-6 font-mono text-cap text-muted sm:px-6">
          <span>{t('footer.rights')}</span>
          <span>{t('footer.stats', { version, rules: ruleCount, entries: catalogCount })} · <a className="link text-fg" href={REPO}>{t('footer.readAll')}</a></span>
        </div>
        <p aria-hidden className="pointer-events-none -mb-[0.32em] select-none whitespace-nowrap px-2 text-center font-mono text-[clamp(3rem,15vw,16rem)] font-medium leading-none tracking-[-0.04em] text-surface-2">
          antiwebslop
        </p>
      </footer>
    </>
  );
}
