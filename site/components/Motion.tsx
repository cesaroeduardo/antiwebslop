'use client';

import { useEffect } from 'react';

/**
 * M5 motion (DESIGN.md §8): Lenis smooth scroll on fine pointers, and a blur reveal for the
 * direct children of elements marked [data-reveal], batched as they scroll in.
 * Nothing runs under prefers-reduced-motion: content is visible from the first paint either way,
 * because elements are only hidden by GSAP once they are below the fold.
 */
export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    let cleanup = () => {};
    let cancelled = false;

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
        lenis = new Lenis({ anchors: true, lerp: 0.12 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      // Blur reveal ported from falcaobatidos' RevealGroup: 14px blur, opacity 0, 28px lower,
      // eased out to sharp with expo.out, 0.06s between items. Items already on screen at load stay put.
      const from = { opacity: 0, y: 28, filter: 'blur(14px)' };
      const to = { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', stagger: 0.06, overwrite: 'auto' as const };
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

      const onChange = () => { if (reduce.matches) cleanup(); };
      reduce.addEventListener('change', onChange);

      cleanup = () => {
        reduce.removeEventListener('change', onChange);
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis?.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => { cancelled = true; cleanup(); };
  }, []);

  return null;
}
