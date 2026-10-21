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
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { REPO, blob, tree } from '@/lib/site';
import { canvasSites } from '@/lib/canvas-sites';

const INSTALL_ANY = 'npx skills add cesaroeduardo/antiwebslop';

type T = Awaited<ReturnType<typeof getTranslations>>;
const rich = {
  code: (c: React.ReactNode) => <code>{c}</code>,
};

const installRows = (t: T): { agent: string; command: string; note: React.ReactNode }[] => [
  { agent: t('install.anyAgent'), command: INSTALL_ANY, note: t.rich('install.noteAny', { ...rich, link: (c) => <a className="link" href="https://github.com/vercel-labs/skills">{c}</a> }) },
  { agent: 'Cursor', command: 'npx skills add cesaroeduardo/antiwebslop -a cursor', note: t('install.noteCursor') },
  { agent: 'Codex', command: 'codex plugin marketplace add cesaroeduardo/antiwebslop && codex plugin add antiwebslop@antiwebslop', note: t('install.noteCodex') },
  { agent: 'Claude Code', command: 'claude plugin marketplace add cesaroeduardo/antiwebslop && claude plugin install antiwebslop@antiwebslop', note: t.rich('install.noteClaude', rich) },
  { agent: 'Grok Bot', command: 'Save the antiwebslop skill from https://github.com/cesaroeduardo/antiwebslop (folder skills/antiwebslop)', note: t.rich('install.noteGrok', rich) },
];

const tokensBlock = `\`\`\`design-tokens
fonts: DM Mono, DM Sans
colors: #121212, #F7EDDB, #D1A8FF
radii: 0, 6px, 10px, 9999px
\`\`\``;

const rubricKeys: [string, string][] = [['A', '20'], ['B', '12'], ['C', '10'], ['D', '']];

const protocolSteps: { key: 'setup' | 'run' | 'blind' | 'decide'; source: string }[] = [
  { key: 'setup', source: 'ab-protocol.md' },
  { key: 'run', source: 'ab-protocol.md' },
  { key: 'blind', source: 'ab-protocol.md' },
  { key: 'decide', source: 'rubric.md' },
];

const scorecard: { key: 'A' | 'B' | 'C' | 'D'; pts?: number }[] = [{ key: 'A', pts: 20 }, { key: 'B', pts: 12 }, { key: 'C', pts: 10 }, { key: 'D' }];

const validationLines = [
  '### YYYY-MM-DD — <brief> — skill @ <sha>',
  '- Baseline:   A · B · C · total /42 · D · lint',
  '- With skill: A · B · C · total /42 · D · lint',
  '- Blind pick: with-skill | baseline | tie',
  ' ',
  '## Runs',
  '_None yet._',
];

const nav: [string, 'references' | 'catalog' | 'gallery' | 'install' | 'eval'][] = [
  ['#references', 'references'],
  ['#catalog', 'catalog'],
  ['#gallery', 'gallery'],
  ['#install', 'install'],
  ['#eval', 'eval'],
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

function GalleryImage({ src, alt, label, w, h, className = '', priority = false, sizes }: { src: string; alt: string; label: string; w: number; h: number; className?: string; priority?: boolean; sizes: string }) {
  return (
    <figure className={`relative overflow-hidden bg-surface ${className}`}>
      <Image src={src} alt={alt} width={w} height={h} sizes={sizes} priority={priority} className="h-full w-full object-cover object-left-top" />
      <figcaption className="absolute bottom-3 left-3 rounded-control bg-bg px-2 py-1 font-mono text-cap text-fg">{label}</figcaption>
    </figure>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { lintSamples: ls, catalog, comparison, priorArt, ruleCount, catalogCount, version } = content;
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
        <a href="#top" aria-label={t('common.backToTop')} className="shrink-0 text-lg"><Wordmark /></a>
        <nav aria-label={t('common.sections')} className="flex min-w-0 items-center gap-0 font-mono text-sm sm:gap-1">
          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map(([href, key]) => (
              <li key={href}><a href={href} className="rounded-control px-3 py-2 text-muted transition-colors duration-150 hover:text-fg">{t(`nav.${key}`)}</a></li>
            ))}
          </ul>
          <a href="#install" className="hidden rounded-control px-2 py-2 text-muted transition-colors duration-150 hover:text-fg min-[360px]:inline-block sm:px-3 lg:hidden">{t('nav.install')}</a>
          <LanguageSwitcher locale={locale} className="hidden sm:flex" />
          <GitHubStars />
        </nav>
      </header>

      <main id="main" className="relative overflow-x-clip">
        {/* Hero: fills the first screen; on its bottom edge the headline takes the left 7 columns and the line plus
            the install command sit to its right, top-aligned with the headline's first line (after noone.is). */}
        <Section id="top" className="flex min-h-[calc(100svh-76px)] flex-col justify-end pb-16 pt-12 md:pt-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start md:gap-6">
            <h1 className="text-[clamp(1.75rem,0.9rem+2vw,2.375rem)] font-medium leading-[1.08] tracking-[-0.03em] [text-wrap:wrap] md:col-span-7">
              {t('hero.title')}
            </h1>
            <div className="flex flex-col gap-6 md:col-span-5 md:pt-[0.35rem]">
              <p className="max-w-[44ch] font-mono text-sm text-muted md:text-base">{t('hero.line')}</p>
              <CopyCommand variant="primary" command={INSTALL_ANY} label={t('hero.installLabel')} />
            </div>
          </div>
        </Section>

        {/* Canvas: real sites from the galleries the skill points to, on a surface with no edge. */}
        <section id="references" aria-labelledby="references-title" className="scroll-mt-6 pt-24 md:pt-32">
          <div className="mx-auto mb-10 grid w-full max-w-[1280px] grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-12 md:items-end">
            <h2 id="references-title" className="text-2xl font-medium tracking-[-0.02em] md:col-span-6 md:text-3xl">{t('references.title')}</h2>
            <div className="md:col-span-5 md:col-start-8">
              <p className="mb-3 max-w-[48ch] text-base text-muted">
                {t('references.body', { count: canvasSites.length })}
              </p>
              <p className="font-mono text-cap text-muted">{t('references.captured')}</p>
            </div>
          </div>
          <SiteCanvas sites={canvasSites} />
        </section>

        {/* What it does: unequal cards with real artifacts. */}
        <Section id="what" className="pt-32 md:pt-40">
          <h2 className="mb-10 max-w-[22ch] text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('what.title')}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12" data-reveal>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-7 md:p-8">
              <div className="max-w-[52ch]">
                <h3 className="mb-2 text-lg font-medium">{t('what.catalogTitle')}</h3>
                <p className="text-base text-muted">
                  {t.rich('what.catalogBody', { count: catalogCount, code: (c) => <code className="font-mono text-fg">{c}</code> })}
                </p>
              </div>
              <ImageSlot name="catalog-findings" ratio="16:9" src="/slots/catalog-findings.webp" alt={t('what.catalogAlt')} className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-5 md:p-8">
              <div>
                <h3 className="mb-2 text-lg font-medium">{t('what.briefTitle')}</h3>
                <p className="text-base text-muted">
                  {t.rich('what.briefBody', { code: (c) => <code className="font-mono text-fg">{c}</code> })}
                </p>
              </div>
              <Terminal title="site/DESIGN.md" lines={tokensBlock.split('\n')} className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-5 md:p-8">
              <div>
                <h3 className="mb-2 text-lg font-medium">{t('what.hookTitle')}</h3>
                <p className="text-base text-muted">{t('what.hookBody')}</p>
              </div>
              <ImageSlot name="hook-feedback" ratio="4:3" src="/slots/hook-feedback.webp" alt={t('what.hookAlt')} className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-7 md:p-8">
              <div className="max-w-[52ch]">
                <h3 className="mb-2 text-lg font-medium">{t('what.proveTitle')}</h3>
                <p className="text-base text-muted">{t('what.proveBody')}</p>
              </div>
              <table className="mt-auto w-full border-collapse font-mono text-sm">
                <caption className="sr-only">{t('what.scorecardCaption')}</caption>
                <tbody>
                  {rubricKeys.map(([k, pts]) => (
                    <tr key={k} className="border-t border-border">
                      <th scope="row" className="w-10 py-2 text-left font-normal text-muted">{k}</th>
                      <td className="py-2 text-fg">{t(`rubric.${k as 'A'}`)}</td>
                      <td className="py-2 text-right tabular-nums text-muted">{pts || t('what.gate')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </div>
        </Section>

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

        {/* Gallery: exhibit B, image large, findings listed beside it. */}
        <Section id="gallery" className="pt-32 md:pt-40">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="md:col-span-5" data-reveal>
              <h2 className="mb-4 text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('gallery.title')}</h2>
              <p className="mb-6 max-w-[48ch] text-base text-muted">
                {t('gallery.body', { warnings: ls.b.warnings, clean: ls.clean.errors + ls.clean.warnings })}
              </p>
              <ImageSlot name="newer-tells" ratio="4:3" src="/slots/newer-tells.webp" alt={t('gallery.slotAlt')} />
              <p className="mt-4 font-mono text-cap text-muted">
                {t.rich('gallery.more', { ...rich, link: (c) => <a className="link" href={tree('gallery')}>{c}</a> })}
              </p>
            </div>
            <GalleryImage
              src="/gallery/b-before.webp" w={2200} h={1664} sizes="(min-width: 768px) 58vw, 100vw"
              alt={t('gallery.imageAlt')}
              label={t('gallery.before', { errors: ls.b.errors, warnings: ls.b.warnings })}
              className="-mx-4 h-[420px] sm:-mx-6 md:col-span-7 md:mx-0 md:-mr-6 md:h-auto md:self-start lg:-mr-[max(24px,calc((100vw-1280px)/2+24px))]"
            />
          </div>
        </Section>

        {/* Install: dense rows, one per agent. */}
        <Section id="install" className="pt-32 md:pt-40">
          <h2 className="mb-3 text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('install.title')}</h2>
          <p className="mb-8 max-w-[60ch] text-base text-muted">{t('install.intro')}</p>
          <ul className="border-t border-border" data-reveal>
            {install.map((row) => (
              <li key={row.agent} className="grid grid-cols-1 gap-2 border-b border-border py-4 md:grid-cols-12 md:items-center md:gap-6">
                <span className="font-mono text-sm text-fg md:col-span-2">{row.agent}</span>
                <div className="flex min-w-0 items-center gap-2 md:col-span-6">
                  <code className="min-w-0 flex-1 whitespace-pre-wrap rounded-control bg-surface px-3 py-2 font-mono text-cap leading-relaxed text-fg [overflow-wrap:anywhere] sm:text-sm">{row.command}</code>
                  <CopyCommand command={row.command} label={t('install.rowLabel', { agent: row.agent })} />
                </div>
                <p className="prose-inline text-sm text-muted md:col-span-4">{row.note}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* Eval: asymmetric ledger. Left, the A/B protocol as a vertical timeline of its four phases;
            right (sticky on desktop), the 42-point scorecard drawn to scale and the validation log as it stands: empty. */}
        <Section id="eval" className="pt-32 md:pt-40">
          <div className="grid grid-cols-1 gap-6 border-b border-border pb-10 md:grid-cols-12 md:items-end">
            <h2 className="text-2xl font-medium tracking-[-0.02em] md:col-span-6 md:text-3xl">{t('eval.title')}</h2>
            <p className="max-w-[46ch] text-base text-muted md:col-span-5 md:col-start-8">{t('eval.intro')}</p>
          </div>

          <div className="grid grid-cols-1 gap-16 pt-12 md:grid-cols-12 md:gap-6 md:pt-16">
            <ol className="relative md:col-span-7 md:pr-12" data-reveal aria-label={t('eval.protocolAria')}>
              {protocolSteps.map((step) => (
                <li key={step.key} className="relative grid grid-cols-1 gap-3 border-l border-border-strong pb-14 pl-6 last:border-l-transparent last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:pl-8">
                  <span aria-hidden className="absolute -left-[5px] top-[0.4rem] size-[9px] bg-fg" />
                  <p className="font-mono text-cap text-muted">
                    <span className="block text-sm text-fg">{t(`eval.${step.key}Phase`)}</span>
                    <span className="block">{step.source}</span>
                  </p>
                  <div>
                    <h3 className="mb-4 text-lg font-medium">{t(`eval.${step.key}Title`)}</h3>
                    <ul className="border-t border-border">
                      {(t.raw(`eval.${step.key}Rules`) as string[]).map((r) => (
                        <li key={r} className="prose-inline border-b border-border py-3 text-base text-muted"><Inline text={r} /></li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="md:col-span-5" aria-label={t('eval.asideAria')}>
              <div className="flex flex-col gap-6 md:sticky md:top-8">
                <figure className="rounded-card border border-border bg-surface p-5 sm:p-6">
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
                          <td className="py-3">
                            <span className="block text-fg">{t(`rubric.${s.key}`)}</span>
                            <span className="block text-cap text-muted">{t(`eval.note${s.key}`)}</span>
                          </td>
                          <td className="whitespace-nowrap py-3 pl-3 text-right font-mono text-cap tabular-nums text-fg">{s.pts ? t('eval.pts', { count: s.pts }) : t('eval.passFail')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-4 border-t border-border pt-4 font-mono text-cap text-muted">{t('eval.scale')}</p>
                </figure>

                <Terminal title={t('eval.logTitle')} wrap lines={validationLines} />
                <p className="font-mono text-cap text-muted">
                  {t('eval.noScores')} <a className="link" href={blob('eval/rubric.md')}>rubric.md</a> · <a className="link" href={blob('eval/ab-protocol.md')}>ab-protocol.md</a> · <a className="link" href={blob('eval/VALIDATION.md')}>VALIDATION.md</a>
                </p>
              </div>
            </aside>
          </div>
        </Section>

        {/* Trade-offs and prior art. */}
        <Section id="compare" className="pb-32 pt-32 md:pb-40 md:pt-40">
          <h2 className="mb-4 text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t('compare.title')}</h2>
          <p className="mb-8 max-w-[64ch] text-base text-muted">{t('compare.body')}</p>
          <div className="overflow-x-auto" lang="en">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <tbody>
                {comparison.map(([k, ours]) => (
                  <tr key={k} className="border-b border-border align-top">
                    <th scope="row" className="w-40 py-3 pr-6 font-mono text-cap font-normal text-muted">{k}</th>
                    <td className="prose-inline py-3 text-fg"><Inline text={ours} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mb-4 mt-16 text-lg font-medium">{t('compare.priorArt')}</h3>
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
          <LanguageSwitcher locale={locale} className="sm:hidden" />
          <span>{t('footer.stats', { version, rules: ruleCount, entries: catalogCount })} · <a className="link text-fg" href={REPO}>{t('footer.readAll')}</a></span>
        </div>
        <p aria-hidden className="pointer-events-none -mb-[0.32em] select-none whitespace-nowrap px-2 text-center font-mono text-[clamp(3rem,15vw,16rem)] font-medium leading-none tracking-[-0.04em] text-surface-2">
          antiwebslop
        </p>
      </footer>
    </>
  );
}
