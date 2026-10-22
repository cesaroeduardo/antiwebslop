// slop-lint-disable-file  (intentional AI-slop cutouts for the newer-tells demos)
import type { CSSProperties, ReactNode } from 'react';
import { Bot, Layers, Rocket, Shield, Sparkles, Zap } from 'lucide-react';

export type SlopDemoKind = 'words' | 'icons' | 'loops' | 'placeholders';

/**
 * Site primary (`--color-accent`), stepped down a tone so the cutouts
 * feel like the product palette without matching the live UI 1:1.
 */
const ACCENT = 'color-mix(in oklab, var(--color-accent) 72%, #1a1224)';
const ACCENT_SOFT = 'color-mix(in oklab, var(--color-accent) 22%, transparent)';
/** Site bg stepped darker so demos sit below the page plane. */
const DEMO_BG = 'color-mix(in oklab, var(--color-bg) 72%, black)';
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
  // Opacity lives on an inner shell: the reveal animation (GSAP on [data-reveal] children)
  // writes inline opacity:1 on this root, which would otherwise kill hover fade.
  return (
    <div
      className="slop-demo group relative aspect-[4/3] w-full cursor-default outline-none"
      role="img"
      aria-label={label}
      tabIndex={0}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-border opacity-50 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{ backgroundColor: DEMO_BG }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
          {kind === 'words' && <WordsMock />}
          {kind === 'icons' && <IconsMock />}
          {kind === 'loops' && <LoopsMock />}
          {kind === 'placeholders' && <PlaceholdersMock />}
        </div>
      </div>
    </div>
  );
}

/**
 * Intentionally bad flat “illustration” SVGs — undraw-adjacent blobs.
 * Palette is only accent + skin + mute gray + ink (no rainbow accents).
 */
function BadIllustration({ variant }: { variant: 0 | 1 | 2 }) {
  const skin = 'color-mix(in oklab, var(--color-fg) 82%, #c4a090)';
  const mute = 'color-mix(in oklab, var(--color-fg) 22%, var(--color-bg))';
  const ink = 'var(--color-bg)';
  return (
    <svg viewBox="0 0 320 240" className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {variant === 0 && (
        <>
          <ellipse cx="56" cy="48" rx="28" ry="18" fill={ACCENT} opacity="0.4" />
          <circle cx="270" cy="40" r="14" fill={mute} />
          <rect x="248" y="160" width="36" height="36" rx="8" fill={ACCENT} opacity="0.35" transform="rotate(18 266 178)" />
          <ellipse cx="150" cy="210" rx="70" ry="14" fill={ink} opacity="0.35" />
          <rect x="118" y="118" width="64" height="72" rx="20" fill={ACCENT} />
          <circle cx="150" cy="88" r="36" fill={skin} />
          <circle cx="138" cy="84" r="3.5" fill={ink} />
          <circle cx="162" cy="84" r="3.5" fill={ink} />
          <path d="M140 98 Q150 106 160 98" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <rect x="96" y="168" width="108" height="12" rx="3" fill={mute} />
          <rect x="104" y="148" width="92" height="22" rx="3" fill={mute} opacity="0.85" />
          <rect x="112" y="154" width="40" height="6" rx="2" fill={ACCENT} opacity="0.55" />
        </>
      )}
      {variant === 1 && (
        <>
          <circle cx="48" cy="180" r="22" fill={mute} />
          <path d="M260 36 L290 70 L230 70 Z" fill={ACCENT} opacity="0.45" />
          <rect x="40" y="40" width="22" height="22" rx="4" fill={ACCENT} opacity="0.4" />
          <ellipse cx="160" cy="210" rx="90" ry="12" fill={ink} opacity="0.3" />
          <circle cx="110" cy="100" r="28" fill={skin} />
          <rect x="90" y="128" width="40" height="56" rx="16" fill={mute} />
          <circle cx="210" cy="100" r="28" fill={skin} />
          <rect x="190" y="128" width="40" height="56" rx="16" fill={ACCENT} />
          <path d="M130 140 Q160 100 190 140" fill="none" stroke={skin} strokeWidth="10" strokeLinecap="round" />
          <circle cx="102" cy="96" r="3" fill={ink} />
          <circle cx="118" cy="96" r="3" fill={ink} />
          <circle cx="202" cy="96" r="3" fill={ink} />
          <circle cx="218" cy="96" r="3" fill={ink} />
        </>
      )}
      {variant === 2 && (
        <>
          <circle cx="280" cy="50" r="18" fill={ACCENT} opacity="0.4" />
          <rect x="30" y="50" width="18" height="18" rx="9" fill={mute} />
          <rect x="180" y="48" width="100" height="80" rx="10" fill={mute} />
          <rect x="196" y="96" width="14" height="20" rx="2" fill={ACCENT} opacity="0.55" />
          <rect x="218" y="80" width="14" height="36" rx="2" fill={ACCENT} opacity="0.75" />
          <rect x="240" y="68" width="14" height="48" rx="2" fill={ACCENT} />
          <circle cx="100" cy="110" r="32" fill={skin} />
          <rect x="78" y="142" width="44" height="58" rx="18" fill={ACCENT} />
          <path d="M122 160 L170 100" fill="none" stroke={skin} strokeWidth="10" strokeLinecap="round" />
          <circle cx="90" cy="106" r="3" fill={ink} />
          <circle cx="110" cy="106" r="3" fill={ink} />
          <path d="M92 120 Q100 126 108 120" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function Mark({ tag, delay = 0, className = '', children }: { tag: string; delay?: number; className?: string; children: ReactNode }) {
  // Don't force `relative` when the caller already positions the mark (absolute/fixed/sticky);
  // Tailwind's `.relative` can win over `.absolute` in the stylesheet and shove siblings down.
  const positioned = /\b(absolute|fixed|sticky)\b/.test(className);
  return (
    <div className={`slop-mark ${positioned ? '' : 'relative'} ${className}`} data-slop-delay={delay}>
      {children}
      <span className="slop-box" />
      <span className="slop-tag">{tag}</span>
    </div>
  );
}

/** Close crop of a hero: eyebrow + headline + slogan — scaled so the CTAs clip the bottom edge. */
function WordsMock() {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: DEMO_BG }}>
      <div className="absolute left-0 top-[10%] flex w-[98%] origin-top-left scale-[1.16] flex-col gap-4 px-5 py-2 sm:gap-5 sm:px-7 sm:scale-[1.2]">
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

/** Crop of a feature grid: icon soup, empty copy, View more, and decorative side stripes. */
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
    <div className="absolute inset-0" style={{ backgroundColor: DEMO_BG }}>
      {/* Wider grid so the right column clips; extra top pad after dropping the section title. */}
      <div className="absolute left-0 top-0 w-[118%] pt-8 pl-6 sm:pt-10 sm:pl-8">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {cards.map(({ Icon, t, d }, i) => (
            <div key={t} className="relative rounded-lg border border-white/10 bg-[#161920] p-3 pl-3.5 sm:p-3.5 sm:pl-4">
              {/* Stripe clipped to the card radius; Mark outlines it without being clipped. */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg" aria-hidden>
                <span className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: ACCENT }} />
              </div>
              <Mark tag="side-tab-border" delay={i} className="absolute left-0 top-0 z-20 h-full w-[3px]">
                <span className="block h-full w-full opacity-0" />
              </Mark>
              <div className="relative">
                <Mark tag="icon-soup" delay={i} className="mb-2.5 w-fit">
                  <span
                    className="inline-flex size-8 items-center justify-center rounded-md sm:size-9"
                    style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
                  >
                    <Icon className="size-4 sm:size-[1.125rem]" strokeWidth={1.75} aria-hidden />
                  </span>
                </Mark>
                <p className="text-[12px] font-semibold text-white/90 sm:text-[13px]">{t}</p>
                <p className="mt-1 text-[10px] leading-snug text-white/40 sm:text-[11px]">{d}</p>
                <Mark tag="generic-cta" delay={i} className="mt-2.5 w-fit">
                  <span className="text-[10px] font-medium text-violet-300/90 underline underline-offset-2 sm:text-[11px]">View more</span>
                </Mark>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Badly diagrammed “hero”: slogan in the middle, cheap flat SVGs on each side,
 * plus decorative blur orbs — scaled so the crop clips the edges.
 */
function PlaceholdersMock() {
  const left = [
    { v: 0 as const, delay: 0, className: 'w-[95%] -rotate-[7deg]' },
    { v: 2 as const, delay: 1, className: 'w-[95%] rotate-[5deg]' },
  ];
  const right = [
    { v: 1 as const, delay: 2, className: 'w-[95%] rotate-[7deg]' },
    { v: 0 as const, delay: 3, className: 'w-[95%] -rotate-[5deg]' },
  ];
  const shot = (s: { v: 0 | 1 | 2; delay: number; className: string }, key: string) => (
    <Mark key={key} tag="svg-placeholder" delay={s.delay} className={`mx-auto ${s.className}`}>
      <div className="aspect-[5/4] w-full">
        <BadIllustration variant={s.v} />
      </div>
    </Mark>
  );
  return (
    <div className="absolute inset-0" style={{ backgroundColor: DEMO_BG }}>
      <div className="absolute inset-0 origin-center scale-[1.16] sm:scale-[1.2]">
        <Mark tag="blur-blob" delay={4} className="pointer-events-none absolute -left-[8%] top-[12%] size-[42%] rounded-full opacity-70 blur-2xl sm:blur-3xl">
          <span className="block size-full rounded-full" style={{ backgroundColor: ACCENT_SOFT }} />
        </Mark>
        <Mark tag="blur-blob" delay={5} className="pointer-events-none absolute -right-[6%] bottom-[8%] size-[38%] rounded-full opacity-60 blur-2xl sm:blur-3xl">
          <span className="block size-full rounded-full" style={{ background: 'color-mix(in oklab, #7c3aed 28%, transparent)' }} />
        </Mark>
        <div className="absolute inset-0 flex items-center justify-center gap-2 px-3 sm:gap-3 sm:px-5">
          <div className="flex w-[26%] flex-col items-center justify-center gap-2 sm:w-[28%]">
            {left.map((s, i) => shot(s, `L${i}`))}
          </div>
          <div className="relative z-10 w-[42%] shrink-0 text-center sm:w-[38%]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={accentText}>
              Our story
            </p>
            <p className="mt-2 text-[clamp(1.05rem,2.8vw,1.45rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
              Built for teams that ship
            </p>
            <p className="mt-2 text-[10px] leading-snug text-white/45 sm:text-[11px]">
              Custom illustrations. Totally not stock blobs.
            </p>
          </div>
          <div className="flex w-[26%] flex-col items-center justify-center gap-2 sm:w-[28%]">
            {right.map((s, i) => shot(s, `R${i}`))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Crop of cyber hero + status + CTA; scaled so feature cards clip harder at the bottom. */
function LoopsMock() {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: DEMO_BG }}>
      <div className="absolute inset-0 origin-top-left scale-[1.16] sm:scale-[1.2]">
        <div className="absolute inset-x-0 top-0 flex flex-col gap-4 px-5 pt-6 sm:gap-5 sm:px-7 sm:pt-8">
          <div className="flex items-center justify-between gap-3 pr-1">
            <Mark tag="period-logo" delay={2} className="w-fit shrink-0">
              <span className="text-[12px] font-semibold tracking-wide sm:text-[13px]" style={accentText}>&lt;CYBER./&gt;</span>
            </Mark>
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
        <div className="absolute bottom-[-8%] left-[-4%] grid w-[112%] grid-cols-3 gap-2.5 px-5 sm:gap-3 sm:px-7">
          {['LIGHTNING', 'POWERED', 'READY'].map((t) => (
            <div key={t} className="rounded-md border border-white/10 bg-white/[0.04] p-3 sm:p-3.5">
              <p className="text-[10px] font-semibold text-white/90 sm:text-[11px]">{t}</p>
              <p className="mt-1.5 text-[9px] leading-snug text-white/35 sm:text-[10px]">Neural networks do the work.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
