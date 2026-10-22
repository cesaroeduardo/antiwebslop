'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export type SlopDemoKind = 'words' | 'metrics' | 'numbering' | 'loops';

type Props = {
  kind: SlopDemoKind;
  /** Accessible name for the figure; the mock itself is decorative. */
  label: string;
};

/**
 * HTML cutout of a generic AI landing page. On scroll-in, dashed outlines and rule tags
 * snap on quickly — as if the skill is tagging the slop. Reduced-motion shows the final state.
 */
export function SlopDemo({ kind, label }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      el.dataset.scanned = 'true';
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.scanned = 'true';
        io.disconnect();
      },
      { threshold: 0.4, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [kind]);

  return (
    <div
      ref={root}
      className="slop-demo relative aspect-[4/3] w-full overflow-hidden rounded-media border border-border bg-[#f4f5f7]"
      role="img"
      aria-label={label}
      data-scanned="false"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        {kind === 'words' && <WordsMock />}
        {kind === 'metrics' && <MetricsMock />}
        {kind === 'numbering' && <NumberingMock />}
        {kind === 'loops' && <LoopsMock />}
      </div>
    </div>
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

function WordsMock() {
  return (
    <div className="flex h-full flex-col bg-[#f7f8fa] p-5 sm:p-7">
      <div className="mb-4 flex items-center justify-between text-[10px] font-medium tracking-wide text-[#64748b]">
        <span className="font-semibold text-[#0f172a]">Acme AI</span>
        <span className="flex gap-3"><span>Product</span><span>Pricing</span><span className="rounded-full bg-[#0f172a] px-2 py-0.5 text-white">Start free</span></span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3">
        <Mark tag="eyebrow-kicker" delay={0} className="w-fit">
          <span className="inline-block rounded-full border border-[#e2e8f0] bg-white px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#6366f1]">New · AI workspace</span>
        </Mark>
        <Mark tag="em-dash-overuse" delay={1} className="max-w-[18rem]">
          <p className="text-[clamp(1.1rem,2.8vw,1.65rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[#0f172a]">
            Turn ideas into impact — faster, smarter, together.
          </p>
        </Mark>
        <Mark tag="not-x-a-y" delay={2} className="max-w-[16rem]">
          <p className="text-[11px] leading-snug text-[#64748b]">
            Not another dashboard. A workspace that ships.
          </p>
        </Mark>
        <div className="mt-1 flex gap-2">
          <span className="rounded-md bg-[#0f172a] px-3 py-1.5 text-[10px] font-medium text-white">Get started</span>
          <span className="rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-[10px] text-[#0f172a]">Watch demo</span>
        </div>
      </div>
    </div>
  );
}

function MetricsMock() {
  const cells = [
    { n: '10x', t: 'Faster execution', d: 'Turn weeks into days with AI.' },
    { n: '99%', t: 'Higher productivity', d: 'More output, less busywork.' },
    { n: '24/7', t: 'AI that never stops', d: 'Insights around the clock.' },
  ];
  return (
    <div className="flex h-full flex-col justify-center bg-[#eef0f4] p-4 sm:p-6">
      <p className="mb-3 text-center text-[10px] font-medium text-[#94a3b8]">Trusted by teams everywhere</p>
      <Mark tag="hero-metric" delay={0} className="rounded-xl bg-white p-3 shadow-[0_1px_0_#e2e8f0] sm:p-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {cells.map((c) => (
            <div key={c.n} className="text-center">
              <p className="text-[clamp(1.35rem,4vw,2rem)] font-bold tracking-[-0.04em] text-[#0f172a]">{c.n}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[#0f172a]">{c.t}</p>
              <p className="mt-0.5 hidden text-[9px] leading-snug text-[#94a3b8] sm:block">{c.d}</p>
            </div>
          ))}
        </div>
      </Mark>
    </div>
  );
}

function NumberingMock() {
  const steps = [
    { n: '01', t: 'Capture', d: 'Drop in briefs, notes, links.' },
    { n: '02', t: 'Plan', d: 'AI drafts the roadmap.' },
    { n: '03', t: 'Ship', d: 'Export and go live.' },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 bg-[#f7f8fa] p-4 sm:p-6">
      <p className="text-[11px] font-semibold text-[#0f172a]">From idea to impact — in three simple steps.</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {steps.map((s, i) => (
          <Mark key={s.n} tag={i === 0 ? 'section-number' : i === 1 ? 'side-tab-border' : 'section-number'} delay={i} className="rounded-lg bg-white">
            <div className={`flex h-full flex-col gap-1.5 p-2.5 sm:p-3 ${i === 1 ? 'border-l-[3px] border-l-[#6366f1]' : ''}`}>
              <span className="font-mono text-[10px] font-semibold text-[#6366f1]">{s.n}</span>
              <span className="text-[11px] font-semibold text-[#0f172a]">{s.t}</span>
              <span className="text-[9px] leading-snug text-[#94a3b8]">{s.d}</span>
            </div>
          </Mark>
        ))}
      </div>
    </div>
  );
}

function LoopsMock() {
  return (
    <div className="flex h-full flex-col bg-[#0b0d12] p-4 text-white sm:p-6">
      <div className="mb-4 flex items-center justify-between text-[10px]">
        <span className="font-semibold tracking-wide text-[#67e8f9]">&lt;CYBER/&gt;</span>
        <Mark tag="attention-loop" delay={0} className="w-fit">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] text-[#a7f3d0]">
            <span className="slop-pulse size-1.5 rounded-full bg-[#34d399]" />
            All systems online
          </span>
        </Mark>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3">
        <p className="text-[clamp(1.1rem,2.6vw,1.5rem)] font-semibold leading-tight tracking-[-0.02em]">
          Build the Future with <span className="text-[#67e8f9]">Cyber Tech</span>
        </p>
        <p className="font-mono text-[9px] text-white/45">const future = await buildWithAI();</p>
        <Mark tag="bounce-easing" delay={1} className="w-fit">
          <span className="slop-bounce inline-flex rounded-md bg-[#67e8f9] px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#0b0d12]">
            INITIALIZE_
          </span>
        </Mark>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {['LIGHTNING', 'POWERED', 'READY'].map((t) => (
            <div key={t} className="rounded-md border border-white/10 bg-white/[0.03] p-2">
              <p className="text-[9px] font-semibold text-white/90">{t}</p>
              <p className="mt-1 text-[8px] leading-snug text-white/35">Neural networks do the work.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
