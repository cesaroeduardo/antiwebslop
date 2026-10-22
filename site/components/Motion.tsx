'use client';

declare global {
  interface Window {
    __lenis?: {
      scrollTo: (
        target: number | string | HTMLElement,
        options?: { immediate?: boolean; offset?: number; duration?: number; onComplete?: () => void },
      ) => void;
    };
  }
}

import { useEffect } from 'react';

const normPath = (pathname: string) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
};

/**
 * Same-page hash: prevent the browser's instant jump, scroll with Lenis (or native smooth),
 * so ScrollTrigger blur-reveals play on the way to the section.
 */
function scrollToHash(
  hash: string,
  opts: { immediate?: boolean; lenis?: Window['__lenis'] | null } = {},
) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const immediate = opts.immediate || reduce;

  if (opts.lenis) {
    opts.lenis.scrollTo(el, { immediate });
  } else {
    el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' });
  }

  // Keep keyboard focus in the destination without a second scroll jump.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/**
 * M5 motion (DESIGN.md §8): Lenis smooth scroll on fine pointers, and a blur reveal for the
 * direct children of elements marked [data-reveal], batched as they scroll in.
 * Nothing runs under prefers-reduced-motion: content is visible from the first paint either way,
 * because elements are only hidden by GSAP once they are below the fold.
 * Same-page menu/footer hash links always smooth-scroll (Lenis or native) so reveals run en route.
 */
export function Motion() {
  useEffect(() => {
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => {};
    let cancelled = false;
    let lenisRef: Window['__lenis'] | null = null;

    const onDocClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.composedPath() as EventTarget[]).find(
        (n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement && Boolean(n.href),
      );
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      const cur = new URL(window.location.href);
      if (url.host !== cur.host || !url.hash) return;
      if (normPath(url.pathname) !== normPath(cur.pathname)) return;
      if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;

      e.preventDefault();
      if (url.hash !== cur.hash) history.pushState(null, '', url.pathname + url.search + url.hash);
      scrollToHash(url.hash, { lenis: lenisRef });
    };

    // Capture so we beat the browser's default jump (and any other hash handlers).
    document.addEventListener('click', onDocClick, true);

    if (reduceMq.matches) {
      return () => {
        cancelled = true;
        document.removeEventListener('click', onDocClick, true);
      };
    }

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('lenis'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      let lenis: InstanceType<typeof Lenis> | null = null;
      const tick = (time: number) => lenis?.raf(time * 1000);
      if (window.matchMedia('(pointer: fine)').matches) {
        // anchors: false — we handle hash clicks ourselves (pathname normalize + preventDefault).
        lenis = new Lenis({ lerp: 0.12 });
        lenis.on('scroll', ScrollTrigger.update);
        lenisRef = lenis;
        window.__lenis = lenis; // read by BackToTop
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      // Blur reveal ported from falcaobatidos' RevealGroup: 14px blur, opacity 0, 28px lower,
      // eased out to sharp with expo.out, 0.06s between items. Items already on screen at load stay put.
      const from = { opacity: 0, y: 28, filter: 'blur(14px)' };
      const to = {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.06,
        overwrite: 'auto' as const,
      };
      const onScreen = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight * 0.88;
      };

      const ctx = gsap.context(() => {
        const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
          .flatMap((group) => Array.from(group.children) as HTMLElement[])
          .filter((el) => !onScreen(el));
        if (!items.length) return;
        const done = new WeakSet<Element>();
        gsap.set(items, from);
        const play = (batch: Element[]) => {
          const fresh = batch.filter((el) => !done.has(el));
          if (!fresh.length) return;
          fresh.forEach((el) => done.add(el));
          gsap.to(fresh, { ...to, clearProps: 'filter' });
        };
        ScrollTrigger.batch(items, { start: 'top 88%', onEnter: play, onEnterBack: play });
        ScrollTrigger.refresh();
      });

      const onChange = () => {
        if (reduceMq.matches) cleanup();
      };
      reduceMq.addEventListener('change', onChange);

      cleanup = () => {
        reduceMq.removeEventListener('change', onChange);
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenisRef = null;
        delete window.__lenis;
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      cancelled = true;
      document.removeEventListener('click', onDocClick, true);
      cleanup();
    };
  }, []);

  return null;
}
