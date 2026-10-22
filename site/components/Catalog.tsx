'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Inline } from './Inline';

export type CatalogItem = {
  n: number;
  title: string;
  lints: { id: string; severity: string }[];
  review: string | null;
  detect: string;
  instead: string;
};
export type CatalogGroup = { title: string; items: CatalogItem[] };

const INITIAL = 14;

const btnClass =
  'inline-flex h-11 items-center justify-center gap-2 rounded-control border border-border px-5 font-mono text-sm text-fg transition-[color,border-color,background-color] duration-150 hover:border-border-strong hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-60';

/** Same blur reveal as Motion.tsx / DESIGN.md §8 (M5). */
const REVEAL_TO = {
  opacity: 1,
  y: 0,
  filter: 'blur(0px)',
  duration: 0.7,
  ease: 'expo.out',
  stagger: 0.06,
  overwrite: 'auto' as const,
  clearProps: 'filter',
};

function takeGroups(groups: CatalogGroup[], limit: number): CatalogGroup[] {
  let left = limit;
  const out: CatalogGroup[] = [];
  for (const g of groups) {
    if (left <= 0) break;
    const items = g.items.slice(0, left);
    left -= items.length;
    if (items.length) out.push({ title: g.title, items });
  }
  return out;
}

/** Keep `el` at the same viewport Y by correcting scroll as the document shortens (Lenis-aware). */
function pinScrollTo(el: HTMLElement, pinY: number) {
  const delta = el.getBoundingClientRect().top - pinY;
  if (Math.abs(delta) < 0.5) return;
  if (window.__lenis) window.__lenis.scrollTo(window.scrollY + delta, { immediate: true });
  else window.scrollBy(0, delta);
}

export function Catalog({ groups }: { groups: CatalogGroup[] }) {
  const t = useTranslations('catalog');
  const [expanded, setExpanded] = useState(false);
  const [collapsing, setCollapsing] = useState(false);
  // Only the expand that just happened should get data-catalog-fresh (avoids re-tagging on every render).
  const [revealTick, setRevealTick] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const toggleWrapRef = useRef<HTMLDivElement>(null);
  /** Sits below the list / above the toggle — pinned in the viewport while extras collapse. */
  const stickRef = useRef<HTMLDivElement>(null);
  const total = useMemo(() => groups.reduce((n, g) => n + g.items.length, 0), [groups]);
  const initial = useMemo(() => takeGroups(groups, INITIAL), [groups]);
  const initialNs = useMemo(() => new Set(initial.flatMap((g) => g.items.map((it) => it.n))), [initial]);
  const initialTitles = useMemo(() => new Set(initial.map((g) => g.title)), [initial]);
  const visible = expanded || total <= INITIAL ? groups : initial;
  const canToggle = total > INITIAL;
  const sevLabel = (s: string) => (s === 'error|warn' ? t('errorOrWarn') : s);

  // After "load more", blur-reveal each new group title and accordion row (M5), before paint to avoid a flash.
  useLayoutEffect(() => {
    if (!expanded || !revealTick) return;
    const root = listRef.current;
    if (!root) return;
    const fresh = Array.from(root.querySelectorAll<HTMLElement>('[data-catalog-fresh]'));
    if (!fresh.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fresh.forEach((el) => el.removeAttribute('data-catalog-fresh'));
      return;
    }

    fresh.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.filter = 'blur(14px)';
    });

    let cancelled = false;
    let tween: { kill: () => void } | undefined;
    (async () => {
      const { gsap } = await import('gsap');
      if (cancelled) return;
      tween = gsap.to(fresh, {
        ...REVEAL_TO,
        onComplete: () => fresh.forEach((el) => el.removeAttribute('data-catalog-fresh')),
      });
    })();

    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, [expanded, revealTick]);

  const showMore = () => {
    setRevealTick((n) => n + 1);
    setExpanded(true);
  };

  const showLess = async () => {
    if (collapsing) return;
    const root = listRef.current;
    const wrap = toggleWrapRef.current;
    const stick = stickRef.current;
    const extras = root
      ? Array.from(root.querySelectorAll<HTMLElement>('[data-catalog-extra]'))
      : [];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = 0.55;

    if (reduce || !extras.length) {
      setExpanded(false);
      setCollapsing(false);
      return;
    }

    setCollapsing(true);
    const { gsap } = await import('gsap');

    // Pin the stick in the viewport: as extras shrink above it, scroll rises with them.
    const pinY = stick?.getBoundingClientRect().top ?? 0;
    const follow = () => {
      if (stick) pinScrollTo(stick, pinY);
    };

    const finish = () => {
      follow();
      if (wrap) gsap.set(wrap, { clearProps: 'all' });
      setExpanded(false);
      setCollapsing(false);
      // One more pin after React drops the extras from the DOM.
      requestAnimationFrame(() => follow());
    };

    // Minimize control vanishes right away (ease-in).
    if (wrap) {
      const h = wrap.getBoundingClientRect().height;
      wrap.style.overflow = 'hidden';
      wrap.style.height = `${h}px`;
      gsap.to(wrap, {
        opacity: 0,
        height: 0,
        marginTop: 0,
        duration: 0.22,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    }

    // Lock pixel heights so layout collapses (opacity-only left the scroll stranded below).
    extras.forEach((el) => {
      el.style.overflow = 'hidden';
      el.style.height = `${el.getBoundingClientRect().height}px`;
      el.style.flexShrink = '0';
    });

    gsap.to(extras, {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      filter: 'blur(8px)',
      duration,
      stagger: { each: 0.015, from: 'end' },
      ease: 'power2.inOut',
      overwrite: 'auto',
      onUpdate: follow,
      onComplete: finish,
    });
  };

  return (
    // Margins (not gap) so collapsing extras can zero their space in the flex layout.
    <div ref={listRef} className="flex flex-col">
      {visible.map((g, i) => {
        const groupFresh = Boolean(revealTick) && expanded && !initialTitles.has(g.title);
        const groupExtra = expanded && !initialTitles.has(g.title);
        const isLast = i === visible.length - 1;
        return (
          <div
            key={g.title}
            className={isLast ? undefined : 'mb-12'}
            data-reveal={groupFresh || groupExtra ? undefined : ''}
            {...(groupExtra ? { 'data-catalog-extra': '' } : {})}
          >
            <h3
              lang="en"
              className="mb-3 font-mono text-sm text-muted"
              {...(groupFresh ? { 'data-catalog-fresh': '' } : {})}
            >
              {g.title}
            </h3>
            <Accordion.Root type="multiple" className="flex flex-col gap-2">
              {g.items.map((it) => {
                const itemFresh = Boolean(revealTick) && expanded && !initialNs.has(it.n);
                // Partial groups: only the newly revealed rows are extras (whole new groups mark the wrapper).
                const itemExtra = expanded && !groupExtra && !initialNs.has(it.n);
                return (
                  <Accordion.Item
                    key={it.n}
                    value={String(it.n)}
                    className="rounded-card border border-border bg-surface data-[state=open]:border-border-strong"
                    {...(itemFresh ? { 'data-catalog-fresh': '' } : {})}
                    {...(itemExtra ? { 'data-catalog-extra': '' } : {})}
                  >
                    <Accordion.Header asChild>
                      <h4>
                        <Accordion.Trigger className="group flex w-full items-center gap-4 rounded-card px-4 data-[state=open]:rounded-b-none py-3 text-left transition-colors duration-150 hover:bg-surface-2 sm:px-5">
                          <span className="w-7 shrink-0 font-mono text-cap text-muted tabular-nums">{it.n}</span>
                          <span lang="en" className="min-w-0 flex-1 text-body leading-snug text-fg">{it.title}</span>
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-[color,border-color,rotate] duration-300 ease-out group-hover:text-fg group-data-[state=open]:rotate-45 group-data-[state=open]:border-accent group-data-[state=open]:text-accent motion-reduce:transition-none">
                            <Plus aria-hidden size={14} strokeWidth={2} />
                          </span>
                        </Accordion.Trigger>
                      </h4>
                    </Accordion.Header>
                    <Accordion.Content className="acc-content">
                      <div className="grid gap-4 border-t border-border px-4 pb-5 pt-4 sm:grid-cols-2 sm:gap-8 sm:px-5 sm:pl-16">
                        <div>
                          <p className="mb-1 font-mono text-cap text-muted">{t('detect')}</p>
                          <p lang="en" className="prose-inline text-base text-fg"><Inline text={it.detect} /></p>
                        </div>
                        <div>
                          <p className="mb-1 font-mono text-cap text-muted">{t('instead')}</p>
                          <p lang="en" className="prose-inline text-base text-fg"><Inline text={it.instead} /></p>
                        </div>
                        {it.lints.length > 0 && (
                          <p className="font-mono text-cap text-muted sm:col-span-2">
                            {it.lints.map((l) => `slop-lint ${l.id}: ${sevLabel(l.severity)}`).join('  ·  ')}
                          </p>
                        )}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                );
              })}
            </Accordion.Root>
          </div>
        );
      })}

      <div ref={stickRef} aria-hidden className="pointer-events-none h-0 w-full overflow-hidden" />

      {canToggle ? (
        <div ref={toggleWrapRef} className="mt-12 flex justify-center">
          <button
            ref={toggleRef}
            type="button"
            disabled={collapsing}
            onClick={expanded ? showLess : showMore}
            className={btnClass}
          >
            {expanded ? t('showLess') : t('loadMore', { count: total - INITIAL })}
            {expanded ? (
              <ArrowUp aria-hidden size={14} strokeWidth={2} className="shrink-0" />
            ) : (
              <ArrowDown aria-hidden size={14} strokeWidth={2} className="shrink-0" />
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
