import type { CSSProperties, ReactNode } from 'react';
import { Bot, Layers, Rocket, Shield, Sparkles, Zap } from 'lucide-react';

export type SlopDemoKind = 'words' | 'icons' | 'numbering' | 'loops' | 'placeholders';

/**
 * Site primary (`--color-accent`), stepped down a tone so the cutouts
 * feel like the product palette without matching the live UI 1:1.
 */
const ACCENT = 'color-mix(in oklab, var(--color-accent) 72%, #1a1224)';
const ACCENT_SOFT = 'color-mix(in oklab, var(--color-accent) 22%, transparent)';
const accentBg = { backgroundColor: ACCENT, color: 'var(--color-accent-fg)' } satisfies CSSProperties;
const accentText = { color: ACCENT } satisfies CSSProperties;

type Props = {
  kind: SlopDemoKind;
  /** Accessible name for the figure; the mock itself is decorative. */
  label: string;
};

/**
 * Cropped HTML fragment of a generic AI landing page — not a full mini-site.
 * Hover / focus runs the skill-scan outlines + rule tags.
 */
export function SlopDemo({ kind, label }: Props) {
  return (
    <div
      className="slop-demo relative aspect-[4/3] w-full cursor-default overflow-hidden rounded-2xl border border-border bg-[#0e1014] outline-none"
      role="img"
      aria-label={label}
      tabIndex={0}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        {kind === 'words' && <WordsMock />}
        {kind === 'icons' && <IconsMock />}
        {kind === 'numbering' && <NumberingMock />}
        {kind === 'loops' && <LoopsMock />}
        {kind === 'placeholders' && <PlaceholdersMock />}
      </div>
    </div>
  );
}

/** Classic “photo” that is just an inline SVG landscape. */
function SvgPhoto({ variant }: { variant: 0 | 1 | 2 }) {
  const skies = ['#252830', '#2a2438', '#1e2a32'] as const;
  const hills = ['#3a3f4c', '#4a3d5c', '#2f4550'] as const;
  const suns = ['#5a5f6e', ACCENT, '#4a6570'] as const;
  return (
    <svg viewBox="0 0 320 200" className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="320" height="200" fill={skies[variant]} />
      <circle cx={variant === 1 ? 240 : 70} cy={variant === 2 ? 56 : 48} r={variant === 0 ? 28 : 22} fill={suns[variant]} />
      <path
        d={
          variant === 0
            ? 'M0 140 L80 90 L140 130 L200 70 L320 150 V200 H0Z'
            : variant === 1
              ? 'M0 160 L60 110 L130 145 L190 85 L260 130 L320 100 V200 H0Z'
              : 'M0 150 L100 100 L180 140 L250 80 L320 140 V200 H0Z'
        }
        fill={hills[variant]}
      />
    </svg>
  );
}

function Mark({ tag, delay = 0, className = '', children }: { tag: string; delay?: number; className?: string; children: ReactNode }) {
  return (
    <div className={`slop-mark relative ${className}`} data-slop-delay={delay}>
      {children}
      <span className="slop-box" />
      <span className="slop-tag">{tag}</span>
    </div>
  );
}

/** Close crop of a hero: eyebrow + headline + slogan — scaled so it fills the frame. */
function WordsMock() {
  return (
    <div className="absolute inset-0 bg-[#0e1014]">
      {/* Centered block with room from the frame edges. */}
      <div className="absolute left-0 top-1/2 flex w-[92%] -translate-y-1/2 flex-col gap-4 px-6 py-2 sm:gap-5 sm:px-8">
        <Mark tag="eyebrow-kicker" delay={0} className="w-fit">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-normal uppercase tracking-[0.14em] text-white/90">
            New · AI workspace
          </span>
        </Mark>
        <Mark tag="em-dash-overuse" delay={1} className="max-w-[20rem] sm:max-w-[24rem]">
          <p className="text-[clamp(1.55rem,4.2vw,2.35rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
            Turn ideas into impact — faster, smarter, together.
          </p>
        </Mark>
        <Mark tag="not-x-a-y" delay={2} className="max-w-[17rem]">
          <p className="text-[clamp(0.85rem,2vw,1.05rem)] leading-snug text-white/50">
            Not another dashboard. A workspace that ships.
          </p>
        </Mark>
        <div className="mt-1 flex gap-2.5">
          <span className="rounded-md px-3.5 py-2 text-[12px] font-medium" style={accentBg}>Get started</span>
          <span className="rounded-md border border-white/12 bg-white/5 px-3.5 py-2 text-[12px] text-white/85">Watch demo</span>
        </div>
      </div>
    </div>
  );
}

/** Crop of a feature grid: icon soup + generic marketing lines on every card. */
function IconsMock() {
  const cards = [
    { Icon: Zap, t: 'Lightning fast', d: 'Seamless performance out of the box.' },
    { Icon: Sparkles, t: 'AI powered', d: 'Unlock the power of every click.' },
    { Icon: Shield, t: 'Enterprise ready', d: 'Next-level security built in.' },
    { Icon: Rocket, t: 'Ship faster', d: 'Supercharge your roadmap today.' },
    { Icon: Bot, t: 'Autonomous agents', d: 'Effortless work while you sleep.' },
    { Icon: Layers, t: 'Infinite scale', d: 'Revolutionize every workflow.' },
  ];
  return (
    <div className="absolute inset-0 bg-[#0e1014]">
      {/* Wider grid so the right column clips; centered with padding. */}
      <div className="absolute left-0 top-1/2 w-[118%] -translate-y-1/2 pl-6 sm:pl-8">
        <p className="mb-4 text-[13px] font-normal text-white/55 sm:text-[14px]">Everything you need</p>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {cards.map(({ Icon, t, d }, i) => (
            <div key={t} className="rounded-lg border border-white/10 bg-[#161920] p-3 sm:p-3.5">
              <Mark tag="icon-soup" delay={i} className="mb-2.5 w-fit">
                <span
                  className="inline-flex size-8 items-center justify-center rounded-md sm:size-9"
                  style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
                >
                  <Icon className="size-4 sm:size-[1.125rem]" strokeWidth={1.75} aria-hidden />
                </span>
              </Mark>
              <Mark tag="slop-copy" delay={i} className="block">
                <p className="text-[12px] font-semibold text-white/90 sm:text-[13px]">{t}</p>
                <p className="mt-1 text-[10px] leading-snug text-white/40 sm:text-[11px]">{d}</p>
              </Mark>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Crop of six numbered feature cards with side stripes — no real sequence. */
function NumberingMock() {
  const steps = [
    { n: '01', t: 'Capture', d: 'Drop in briefs, notes, links.' },
    { n: '02', t: 'Plan', d: 'AI drafts the roadmap.' },
    { n: '03', t: 'Ship', d: 'Export and go live.' },
    { n: '04', t: 'Measure', d: 'Track every signal.' },
    { n: '05', t: 'Iterate', d: 'Tune the model weekly.' },
    { n: '06', t: 'Scale', d: 'Roll out to every team.' },
  ];
  return (
    <div className="absolute inset-0 bg-[#0e1014]">
      {/* Extra left padding; wider grid so the right column clips. Marks sit above cards (no overflow clip). */}
      <div className="absolute left-0 top-1/2 w-[118%] -translate-y-1/2 pl-7 pr-0 sm:pl-9">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative flex min-h-[6.5rem] rounded-lg border border-white/10 bg-[#161920] sm:min-h-[7.5rem]">
              {/* Stripe clipped to the card radius; Mark outlines it without being clipped. */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg" aria-hidden>
                <span className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: ACCENT }} />
              </div>
              <Mark tag="side-tab-border" delay={i} className="absolute left-0 top-0 z-20 h-full w-[3px]">
                <span className="block h-full w-full opacity-0" />
              </Mark>
              <div className="relative flex flex-1 flex-col gap-1.5 p-3 sm:p-3.5">
                <Mark tag="section-number" delay={i} className="relative z-20 w-fit">
                  <span className="font-mono text-[11px] font-semibold sm:text-[12px]" style={accentText}>{s.n}</span>
                </Mark>
                <span className="text-[12px] font-semibold text-white/90 sm:text-[13px]">{s.t}</span>
                <span className="text-[9px] leading-snug text-white/40 sm:text-[10px]">{s.d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Crop of a “blog / case study” row where every photo is an inline SVG
 * landscape pretending to be a real image.
 */
function PlaceholdersMock() {
  const posts = [
    { t: 'Shipping with agents', d: 'How we cut cycle time in half.' },
    { t: 'Design that scales', d: 'Tokens, not one-off screens.' },
    { t: 'Launch playbook', d: 'From prototype to prod.' },
  ] as const;
  return (
    <div className="absolute inset-0 bg-[#0e1014]">
      <div className="absolute left-0 top-1/2 w-[118%] -translate-y-1/2 pl-6 sm:pl-8">
        <p className="mb-3 text-[13px] font-normal text-white/55 sm:text-[14px]">Latest from the team</p>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {posts.map((p, i) => (
            <div key={p.t} className="overflow-hidden rounded-lg border border-white/10 bg-[#161920]">
              <Mark tag="svg-placeholder" delay={i} className="block">
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <SvgPhoto variant={i as 0 | 1 | 2} />
                </div>
              </Mark>
              <div className="p-2.5 sm:p-3">
                <p className="text-[11px] font-semibold text-white/90 sm:text-[12px]">{p.t}</p>
                <p className="mt-1 text-[9px] leading-snug text-white/40 sm:text-[10px]">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Crop of cyber hero + status + CTA; feature cards peek and clip at the bottom. */
function LoopsMock() {
  return (
    <div className="absolute inset-0 bg-[#0b0d12]">
      <div className="absolute inset-x-0 top-0 flex flex-col gap-4 px-7 pt-8 sm:gap-5 sm:px-9 sm:pt-10">
        <div className="flex items-center justify-between gap-3 pr-1">
          <span className="text-[12px] font-semibold tracking-wide sm:text-[13px]" style={accentText}>&lt;CYBER/&gt;</span>
          <Mark tag="attention-loop" delay={0} className="w-fit shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-[#a7f3d0]">
              <span className="slop-pulse size-2 rounded-full bg-[#34d399]" />
              All systems online
            </span>
          </Mark>
        </div>
        <p className="max-w-[20rem] text-[clamp(1.25rem,3.5vw,1.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
          Build the Future with <span style={accentText}>Cyber Tech</span>
        </p>
        <p className="max-w-[18rem] text-[11px] leading-snug text-white/45 sm:text-[12px]">
          Deploy neural agents that ship product while you sleep.
        </p>
        <Mark tag="bounce-easing" delay={1} className="w-fit">
          <span className="slop-bounce inline-flex rounded-md px-4 py-2.5 text-[12px] font-bold tracking-wide" style={accentBg}>
            INITIALIZE_
          </span>
        </Mark>
      </div>
      {/* Cards sit low so the bottom edge still clips, but titles + first line stay in frame. */}
      <div className="absolute bottom-[-6%] left-[-4%] grid w-[112%] grid-cols-3 gap-2.5 px-7 sm:gap-3 sm:px-9">
        {['LIGHTNING', 'POWERED', 'READY'].map((t) => (
          <div key={t} className="rounded-md border border-white/10 bg-white/[0.04] p-3 sm:p-3.5">
            <p className="text-[10px] font-semibold text-white/90 sm:text-[11px]">{t}</p>
            <p className="mt-1.5 text-[9px] leading-snug text-white/35 sm:text-[10px]">Neural networks do the work.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
