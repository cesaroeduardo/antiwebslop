'use client';

import { useEffect } from 'react';

/**
 * M5 motion (DESIGN.md §8): Lenis smooth scroll on fine pointers, and one entrance per section
 * for elements marked [data-reveal] (their direct children, staggered, at most 3 at a time).
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

      const ctx = gsap.context(() => {
        const fold = window.innerHeight;
        document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((group) => {
          if (group.getBoundingClientRect().top < fold * 0.9) return; // already on screen: leave it
          const items = Array.from(group.children) as HTMLElement[];
          gsap.from(items, {
            opacity: 0,
            y: 12,
            duration: 0.3,
            ease: 'power2.out',
            stagger: { each: 0.06, amount: Math.min(0.12, 0.06 * (items.length - 1)) },
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          });
        });
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
