import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import content from '@/content/generated.json';
import { Catalog, type CatalogGroup } from '@/components/Catalog';
import { CopyCommand } from '@/components/CopyCommand';
import { Inline } from '@/components/Inline';
import { Motion } from '@/components/Motion';
import { Wordmark } from '@/components/Wordmark';
import { REPO, blob, tree } from '@/lib/site';

const INSTALL_ANY = 'npx skills add cesaroeduardo/antiwebslop';

const install: { agent: string; command: string; note: React.ReactNode }[] = [
  { agent: 'Any agent', command: INSTALL_ANY, note: <>Cursor, Codex, Claude Code, Grok Build, Gemini CLI, Copilot, OpenCode and more, via <a className="link" href="https://github.com/vercel-labs/skills">vercel-labs/skills</a> (Node 22.20+). Add <code>-g</code> for every project.</> },
  { agent: 'Cursor', command: 'npx skills add cesaroeduardo/antiwebslop -a cursor', note: <>Or import the repo as a plugin: Customize, then From GitHub Repository.</> },
  { agent: 'Codex', command: 'codex plugin marketplace add cesaroeduardo/antiwebslop && codex plugin add antiwebslop@antiwebslop', note: <>CLI, IDE extension and the ChatGPT desktop app.</> },
  { agent: 'Claude Code', command: 'claude plugin marketplace add cesaroeduardo/antiwebslop && claude plugin install antiwebslop@antiwebslop', note: <>Inside a session: <code>/plugin marketplace add cesaroeduardo/antiwebslop</code>. The skill runs as <code>/antiwebslop:antiwebslop</code>.</> },
  { agent: 'claude.ai', command: 'npm run pack', note: <>Run in a clone, then Customize, Skills, Upload a skill, and pick <code>dist/antiwebslop.zip</code>.</> },
  { agent: 'Grok Bot', command: 'Save the antiwebslop skill from https://github.com/cesaroeduardo/antiwebslop (folder skills/antiwebslop)', note: <>Send this to your bot as a message. Grok Build users: <code>grok plugin install cesaroeduardo/antiwebslop --trust</code>.</> },
];

const tokensBlock = `\`\`\`design-tokens
fonts: DM Mono, DM Sans
colors: #121212, #F7EDDB, #D1A8FF
radii: 0, 6px, 10px, 9999px
\`\`\``;

const rubric: [string, string, string][] = [
  ['A', 'Slop absence', '20'],
  ['B', 'Craft', '12'],
  ['C', 'Process', '10'],
  ['D', 'Scope safety', 'gate'],
];

const protocol: { phase: string; source: string; title: string; rules: string[] }[] = [
  {
    phase: 'Setup',
    source: 'ab-protocol.md',
    title: 'Fix everything but the skill',
    rules: [
      '3 to 5 briefs: at least one landing page, one help/docs page, and one product UI task.',
      'Two clean checkouts per brief at the same commit, `run-a/` and `run-b/`.',
      'The skill is installed in one run only. The baseline has no copy of it, or of any other design skill.',
      'Same agent, model, settings and brief text, in a fresh chat each time.',
    ],
  },
  {
    phase: 'Run',
    source: 'ab-protocol.md',
    title: 'Let each run finish on its own',
    rules: [
      'The brief is pasted verbatim; clarifying questions get the same scripted answers in both runs.',
      'No steering. One follow-up allowed: “Finish and make it production-ready.”',
      'Both runs are captured at 3 viewports, and `slop-lint --json` is saved for each.',
    ],
  },
  {
    phase: 'Blind review',
    source: 'ab-protocol.md',
    title: 'Pick first, score after',
    rules: [
      'Left and right are assigned at random; someone other than the reviewer keeps the key.',
      'The reviewer answers one question: which looks designed by a person for this product? Left, right or tie, and one sentence why.',
      'Then both outputs are scored on the 42-point card.',
    ],
  },
  {
    phase: 'Decide',
    source: 'rubric.md',
    title: 'Ship only past the bar',
    rules: [
      'With-skill total at least 1.3× the baseline, across the brief set.',
      'Zero lint errors in the with-skill outputs, and the scope-safety gate passes on every run.',
      'Wins or ties the blind pick in at least 2 of 3 briefs. A regression on any brief is logged before anything else changes.',
    ],
  },
];

const scorecard: { key: string; name: string; note: string; pts?: number }[] = [
  { key: 'A', name: 'Slop absence', note: '10 items, 8 with lint evidence', pts: 20 },
  { key: 'B', name: 'Craft', note: '6 items: type, spacing, color, hierarchy, real content', pts: 12 },
  { key: 'C', name: 'Process', note: '5 items: Design Read, dials, DESIGN.md, visual QA, a11y', pts: 10 },
  { key: 'D', name: 'Scope safety', note: 'Product UI untouched unless asked. A fail fails the run.' },
];

const validationLines = [
  '### YYYY-MM-DD — <brief> — skill @ <sha>',
  '- Baseline:   A · B · C · total /42 · D · lint',
  '- With skill: A · B · C · total /42 · D · lint',
  '- Blind pick: with-skill | baseline | tie',
  ' ',
  '## Runs',
  '_None yet._',
];

const nav: [string, string][] = [
  ['#catalog', 'Catalog'],
  ['#gallery', 'Gallery'],
  ['#install', 'Install'],
  ['#eval', 'Eval'],
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

export default function Home() {
  const { lintSamples: ls, catalog, comparison, priorArt, ruleCount, catalogCount, version } = content;
  const total = (x: { errors: number; warnings: number }) => `${x.errors} errors, ${x.warnings} warnings`;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-accent-fg">
        Skip to content
      </a>
      <Motion />
      {/* Top light and flickering grain, ported from figma-dominate: a soft light image behind the hero and a looping noise tile fixed over the whole page (overlay, no pointer events). */}
      <div aria-hidden className="top-light pointer-events-none absolute inset-x-0 top-0 h-[800px]" />
      <div aria-hidden className="site-noise pointer-events-none fixed inset-0 z-40 opacity-10 mix-blend-overlay motion-reduce:hidden" />

      <header className="relative mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-4 py-5 sm:gap-6 sm:px-6">
        <a href="#top" aria-label="antiwebslop, back to top" className="shrink-0 text-lg"><Wordmark /></a>
        <nav aria-label="Sections" className="flex min-w-0 items-center gap-0 font-mono text-sm sm:gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {nav.map(([href, label]) => (
              <li key={href}><a href={href} className="rounded-control px-3 py-2 text-muted transition-colors duration-150 hover:text-fg">{label}</a></li>
            ))}
          </ul>
          <a href="#install" className="hidden rounded-control px-2 py-2 text-muted transition-colors duration-150 hover:text-fg min-[360px]:inline-block sm:px-3 md:hidden">Install</a>
          <a href={REPO} className="inline-flex items-center gap-1 rounded-control px-2 py-2 text-fg sm:px-3 transition-colors duration-150 hover:text-accent">
            GitHub <ArrowUpRight aria-hidden size={14} />
          </a>
        </nav>
      </header>

      <main id="main" className="relative overflow-x-clip">
        {/* Hero: fills the first screen; headline, copy and install action sit on its bottom edge. */}
        <Section id="top" className="flex min-h-[calc(100svh-76px)] flex-col justify-end pb-16 pt-12 md:pt-28">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-6">
            <h1 className="text-[clamp(2.5rem,4.6vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em] md:col-span-7 lg:col-span-8">
              Agent-built web pages that don&rsquo;t look agent-built.
            </h1>
            <div className="flex flex-col gap-6 md:col-span-5 lg:col-span-4">
              <p className="text-body text-muted">
                antiwebslop is a skill for Cursor, Codex, Claude Code and Grok. It names {catalogCount} tells of generated UI, gives the
                fix for each, and ships a {ruleCount}-rule lint that checks your code against the project&rsquo;s own design tokens.
              </p>
              <CopyCommand variant="primary" command={INSTALL_ANY} label="Install command" />
            </div>
          </div>
        </Section>

        {/* What it does: unequal cards with real artifacts. */}
        <Section id="what" className="pt-24 md:pt-32">
          <h2 className="mb-10 max-w-[22ch] text-2xl font-medium tracking-[-0.02em] md:text-3xl">Four parts, all plain files you can read</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12" data-reveal>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-7 md:p-8">
              <div className="max-w-[52ch]">
                <h3 className="mb-2 text-lg font-medium">A catalog of what not to ship</h3>
                <p className="text-base text-muted">
                  {catalogCount} anti-patterns, each with how to spot it and what to do instead. Most have a lint rule, so the agent
                  hears about them as <code className="font-mono text-fg">file:line</code> findings, not as taste.
                </p>
              </div>
              <ImageSlot name="catalog-findings" ratio="16:9" alt="" className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-5 md:p-8">
              <div>
                <h3 className="mb-2 text-lg font-medium">A brief per project</h3>
                <p className="text-base text-muted">
                  Each project gets a <code className="font-mono text-fg">DESIGN.md</code>: who it is for, the surface type, dials, and a
                  token block. Fonts, colors and radii outside it come back as warnings. This is this site&rsquo;s own block.
                </p>
              </div>
              <Terminal title="site/DESIGN.md" lines={tokensBlock.split('\n')} className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-5 md:p-8">
              <div>
                <h3 className="mb-2 text-lg font-medium">Feedback after every write</h3>
                <p className="text-base text-muted">
                  An optional Cursor hook lints each UI file the agent writes and hands the findings back before it moves on. It never
                  blocks a write.
                </p>
              </div>
              <ImageSlot name="hook-feedback" ratio="4:3" alt="" className="mt-auto" />
            </article>
            <article className="flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:col-span-7 md:p-8">
              <div className="max-w-[52ch]">
                <h3 className="mb-2 text-lg font-medium">A way to prove it helped</h3>
                <p className="text-base text-muted">
                  A 0&ndash;2 scorecard over 42 points and a blind A/B protocol. A change to the skill ships only when it beats the
                  baseline.
                </p>
              </div>
              <table className="mt-auto w-full border-collapse font-mono text-sm">
                <caption className="sr-only">Scorecard sections</caption>
                <tbody>
                  {rubric.map(([k, name, pts]) => (
                    <tr key={k} className="border-t border-border">
                      <th scope="row" className="w-10 py-2 text-left font-normal text-muted">{k}</th>
                      <td className="py-2 text-fg">{name}</td>
                      <td className="py-2 text-right tabular-nums text-muted">{pts}</td>
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
                <h2 className="mb-4 text-2xl font-medium tracking-[-0.02em] md:text-3xl">{catalogCount} tells, each with a fix</h2>
                <p className="mb-4 max-w-[40ch] text-base text-muted">
                  The full catalog, read straight from the skill at build time. An entry is allowed only when the project&rsquo;s
                  DESIGN.md documents it as the brand.
                </p>
                <a className="link font-mono text-sm" href={blob('skills/antiwebslop/references/anti-patterns.md')}>anti-patterns.md on GitHub</a>
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
              <h2 className="mb-4 text-2xl font-medium tracking-[-0.02em] md:text-3xl">The newer tells</h2>
              <p className="mb-6 max-w-[48ch] text-base text-muted">
                A label above the headline, 01/02 section numbers, a row of big numbers, side stripes, bouncy easing, a pulsing dot,
                and em dashes on every line. The lint finds {ls.b.warnings} of them as warnings; the clean fixture has {ls.clean.errors + ls.clean.warnings}.
              </p>
              <ImageSlot name="newer-tells" ratio="4:3" alt="" />
              <p className="mt-4 font-mono text-cap text-muted">
                More in <a className="link" href={tree('gallery')}>gallery/</a>, rebuilt from the fixtures with <code>npm run gallery</code>.
              </p>
            </div>
            <GalleryImage
              src="/gallery/b-before.webp" w={2200} h={1664} sizes="(min-width: 768px) 58vw, 100vw"
              alt="A generated page with an INTRODUCING label, 01 and 02 section numbers, three big unsourced numbers and gray text on a blue panel; each flagged element is outlined with its rule name."
              label={`before · ${total(ls.b)}`}
              className="-mx-4 h-[420px] sm:-mx-6 md:col-span-7 md:mx-0 md:-mr-6 md:h-auto md:self-start lg:-mr-[max(24px,calc((100vw-1280px)/2+24px))]"
            />
          </div>
        </Section>

        {/* Install: dense rows, one per agent. */}
        <Section id="install" className="pt-32 md:pt-40">
          <h2 className="mb-3 text-2xl font-medium tracking-[-0.02em] md:text-3xl">Install it in one line</h2>
          <p className="mb-8 max-w-[60ch] text-base text-muted">Every route installs the same folder, <code className="font-mono text-fg">skills/antiwebslop/</code>. Pick your agent.</p>
          <ul className="border-t border-border" data-reveal>
            {install.map((row) => (
              <li key={row.agent} className="grid grid-cols-1 gap-2 border-b border-border py-4 md:grid-cols-12 md:items-center md:gap-6">
                <span className="font-mono text-sm text-fg md:col-span-2">{row.agent}</span>
                <div className="flex min-w-0 items-center gap-2 md:col-span-6">
                  <code className="min-w-0 flex-1 whitespace-pre-wrap rounded-control bg-surface px-3 py-2 font-mono text-cap leading-relaxed text-fg [overflow-wrap:anywhere] sm:text-sm">{row.command}</code>
                  <CopyCommand command={row.command} label={`${row.agent} install command`} />
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
            <h2 className="text-2xl font-medium tracking-[-0.02em] md:col-span-6 md:text-3xl">How we measure it</h2>
            <p className="max-w-[46ch] text-base text-muted md:col-span-5 md:col-start-8">
              Opinions about taste are cheap, so the skill comes with its own test: same agent, same model, same brief, run with and
              without the skill, picked blind, then scored.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16 pt-12 md:grid-cols-12 md:gap-6 md:pt-16">
            <ol className="relative md:col-span-7 md:pr-12" data-reveal aria-label="A/B protocol">
              {protocol.map((step) => (
                <li key={step.phase} className="relative grid grid-cols-1 gap-3 border-l border-border-strong pb-14 pl-6 last:border-l-transparent last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:pl-8">
                  <span aria-hidden className="absolute -left-[5px] top-[0.4rem] size-[9px] bg-fg" />
                  <p className="font-mono text-cap text-muted">
                    <span className="block text-sm text-fg">{step.phase}</span>
                    <span className="block">{step.source}</span>
                  </p>
                  <div>
                    <h3 className="mb-4 text-lg font-medium">{step.title}</h3>
                    <ul className="border-t border-border">
                      {step.rules.map((r) => (
                        <li key={r} className="prose-inline border-b border-border py-3 text-base text-muted"><Inline text={r} /></li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="md:col-span-5" aria-label="Scorecard and results">
              <div className="flex flex-col gap-6 md:sticky md:top-8">
                <figure className="rounded-card border border-border bg-surface p-5 sm:p-6">
                  <figcaption className="mb-5 flex items-baseline justify-between gap-4 font-mono text-cap text-muted">
                    <span>Scorecard, drawn to scale</span>
                    <span className="tabular-nums text-fg">42 pts + gate</span>
                  </figcaption>
                  <div className="flex h-16 gap-1 font-mono text-cap" aria-hidden>
                    {scorecard.filter((s) => s.pts).map((s) => (
                      <span key={s.key} className="flex items-end justify-between gap-1 bg-surface-2 p-2 text-fg" style={{ flexGrow: s.pts ?? 0, flexBasis: 0 }}><span>{s.key}</span><span className="hidden tabular-nums text-muted sm:inline">{s.pts}</span></span>
                    ))}
                    <span className="flex w-12 shrink-0 items-end border border-dashed border-border-strong p-2 text-muted">D</span>
                  </div>
                  <table className="mt-5 w-full border-collapse text-left text-sm">
                    <caption className="sr-only">Scorecard sections, from eval/rubric.md</caption>
                    <tbody>
                      {scorecard.map((s) => (
                        <tr key={s.key} className="border-t border-border align-top">
                          <th scope="row" className="w-8 py-3 font-mono text-cap font-normal text-muted">{s.key}</th>
                          <td className="py-3">
                            <span className="block text-fg">{s.name}</span>
                            <span className="block text-cap text-muted">{s.note}</span>
                          </td>
                          <td className="whitespace-nowrap py-3 pl-3 text-right font-mono text-cap tabular-nums text-fg">{s.pts ? `${s.pts} pts` : 'pass / fail'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-4 border-t border-border pt-4 font-mono text-cap text-muted">Each item 0 fails · 1 partly · 2 clearly passes</p>
                </figure>

                <Terminal title="eval/VALIDATION.md · runs logged: 0" wrap lines={validationLines} />
                <p className="font-mono text-cap text-muted">
                  No scores are shown until a run is logged. <a className="link" href={blob('eval/rubric.md')}>rubric.md</a> · <a className="link" href={blob('eval/ab-protocol.md')}>ab-protocol.md</a> · <a className="link" href={blob('eval/VALIDATION.md')}>VALIDATION.md</a>
                </p>
              </div>
            </aside>
          </div>
        </Section>

        {/* Trade-offs and prior art. */}
        <Section id="compare" className="pb-32 pt-32 md:pb-40 md:pt-40">
          <h2 className="mb-4 text-2xl font-medium tracking-[-0.02em] md:text-3xl">Trade-offs</h2>
          <p className="mb-8 max-w-[64ch] text-base text-muted">
            antiwebslop stays small enough to read in one sitting. Larger design tools add more commands, checks on rendered pages, browser
            extensions and installers for many agents. If you want the most coverage and automation, pair it with one of those.
          </p>
          <div className="overflow-x-auto">
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

          <h3 className="mb-4 mt-16 text-lg font-medium">Prior art</h3>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {priorArt.map((p) => (
              <li key={p.name} className="prose-inline text-sm text-muted">
                <a className="link text-fg" href={p.url}>{p.name}</a>
                {p.by ? ` by ${p.by}` : ''}{p.license ? ` (${p.license})` : ''}: <Inline text={p.note} />
              </li>
            ))}
          </ul>
        </Section>
      </main>

      <footer className="relative overflow-hidden border-t border-border">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-8 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Wordmark className="text-lg" />
            <p className="mt-4 max-w-[36ch] text-sm text-muted">A design skill, a lint, and an eval kit for web pages built by AI coding agents.</p>
          </div>
          {[
            ['Project', [['GitHub', REPO], ['Issues', `${REPO}/issues`], ['MIT License', blob('LICENSE')]]],
            ['Read', [['SKILL.md', blob('skills/antiwebslop/SKILL.md')], ['Anti-patterns', blob('skills/antiwebslop/references/anti-patterns.md')], ['Eval kit', tree('eval')], ['This site’s DESIGN.md', blob('site/DESIGN.md')]]],
            ['Install', [['npx skills', '#install'], ['Claude Code', '#install'], ['Codex', '#install'], ['claude.ai zip', '#install']]],
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
          <span>© 2026 Eduardo de Cesaro · MIT License · no telemetry</span>
          <span>v{version} · {ruleCount} lint rules · {catalogCount} catalog entries · <a className="link text-fg" href={REPO}>read every file on GitHub</a></span>
        </div>
        <p aria-hidden className="pointer-events-none -mb-[0.32em] select-none whitespace-nowrap px-2 text-center font-mono text-[clamp(3rem,15vw,16rem)] font-medium leading-none tracking-[-0.04em] text-surface-2">
          antiwebslop
        </p>
      </footer>
    </>
  );
}
