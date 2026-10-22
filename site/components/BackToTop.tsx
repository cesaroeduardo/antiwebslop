'use client';

import { useEffect, useState } from 'react';

/**
 * Back-to-top button. Shows once the top of the third section (#gallery) has entered the viewport and hides again
 * above it (IntersectionObserver, no scroll threshold). Scrolls with Lenis when it runs, else natively; instant
 * under prefers-reduced-motion. Keyboard use sends focus to the skip link, pointer use to the wordmark link.
 * Styled like the header GitHub button.
 */
export function BackToTop({ label, targetId = 'gallery' }: { label: string; targetId?: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    // The root reaches far above the viewport, so the target "intersects" exactly while its top is above the viewport's
    // bottom edge, and a jump straight past it (Home/End, a long fling) still flips the state.
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { rootMargin: '1000000px 0px 0px 0px' });
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);

  const toTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: reduce });
    else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    const keyboard = e.detail === 0;
    const focusTarget = document.querySelector<HTMLElement>(keyboard ? 'a[href="#main"]' : 'header a[href="#top"]');
    focusTarget?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={label}
      aria-hidden={!shown || undefined}
      tabIndex={shown ? 0 : -1}
      inert={!shown}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 inline-flex size-10 items-center justify-center rounded-control border border-border bg-bg font-mono text-sm text-fg transition-[opacity,transform,background-color,border-color] duration-150 ease-out hover:border-border-strong hover:bg-surface motion-reduce:transition-none sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-[max(1.5rem,env(safe-area-inset-right))] ${shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
    >
      <svg aria-hidden viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
      </svg>
    </button>
  );
}
