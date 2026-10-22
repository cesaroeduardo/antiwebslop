'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'li'>, 'children' | 'className'>;

/**
 * One gallery example row: hover anywhere on the row runs the skill-scan.
 * On coarse/narrow viewports, entering the viewport does the same.
 */
export function SlopTellRow({ children, className = '', ...rest }: Props) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('is-inview', entry.isIntersecting);
      },
      { threshold: 0.4, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li ref={ref} className={`slop-row group/tell ${className}`.trim()} {...rest}>
      {children}
    </li>
  );
}
