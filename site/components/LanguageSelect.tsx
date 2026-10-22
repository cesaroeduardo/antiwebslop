'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export type LanguageOption = { locale: string; code: string; name: string; href: string; hrefLang: string };

/** Cookie next-intl's proxy reads. Writing it on a manual pick means the choice always wins over geo detection. */
const COOKIE = 'NEXT_LOCALE';
const YEAR = 60 * 60 * 24 * 365;

/**
 * Language select styled like the header GitHub button. Listbox pattern (WAI-ARIA APG, select-only):
 * the button opens a popup listbox; arrows, Home/End and type-ahead move, Enter/Space picks, Esc or a click
 * outside closes and returns focus. Picking writes NEXT_LOCALE for a year and switches to the same path in that
 * locale on the client (Next router to the locale's real URL, `/` for English, in a transition; the other locales
 * are prefetched on hover/focus/open), so only the RSC payload of the prerendered page is fetched, not a full reload.
 * next-intl's router is not used on purpose: with localePrefix as-needed it routes English through /en and the
 * client kept /en in the address bar.
 */
export function LanguageSelect({ current, options, label }: { current: string; options: LanguageOption[]; label: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.locale === current)));
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const selected = options.find((o) => o.locale === current) ?? options[0];
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const prefetched = useRef(false);
  const prefetch = () => {
    if (prefetched.current) return;
    prefetched.current = true;
    options.forEach((o) => { if (o.locale !== current) router.prefetch(o.href); });
  };

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const show = (index?: number) => {
    setActive(index ?? Math.max(0, options.findIndex((o) => o.locale === current)));
    setOpen(true);
    prefetch();
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };
  const pick = (o: LanguageOption) => {
    document.cookie = `${COOKIE}=${o.locale}; path=/; max-age=${YEAR}; samesite=lax`;
    if (o.locale === current) return close();
    setOpen(false);
    button.current?.focus();
    startTransition(() => router.replace(o.href, { scroll: false }));
  };

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      show(e.key === 'ArrowUp' ? options.length - 1 : undefined);
    }
  };
  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive((i) => Math.min(last, i + 1)); break;
      case 'ArrowUp': e.preventDefault(); setActive((i) => Math.max(0, i - 1)); break;
      case 'Home': e.preventDefault(); setActive(0); break;
      case 'End': e.preventDefault(); setActive(last); break;
      case 'Enter': case ' ': e.preventDefault(); pick(options[active]); break;
      case 'Escape': e.preventDefault(); close(); break;
      case 'Tab': close(false); break;
      default: {
        const k = e.key.toLowerCase();
        const i = options.findIndex((o) => o.code.toLowerCase().startsWith(k) || o.name.toLowerCase().startsWith(k));
        if (k.length === 1 && i >= 0) setActive(i);
      }
    }
  };

  return (
    <div ref={root} className="relative shrink-0">
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${selected.name}`}
        onClick={() => (open ? close() : show())}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-busy={pending || undefined}
        onKeyDown={onButtonKey}
        className="inline-flex items-center gap-1.5 rounded-control border border-border bg-surface/50 px-2 py-1.5 font-mono text-sm text-fg transition-colors duration-150 hover:border-border-strong hover:bg-surface aria-expanded:border-border-strong aria-expanded:bg-surface sm:px-3"
      >
        {selected.code}
        <ChevronDown aria-hidden size={14} className={`text-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      <ul
        ref={list}
        id={`${id}-list`}
        role="listbox"
        tabIndex={-1}
        hidden={!open}
        aria-label={label}
        aria-activedescendant={open ? `${id}-${options[active].locale}` : undefined}
        onKeyDown={onListKey}
        className="absolute right-0 top-full z-50 mt-1 min-w-[11rem] rounded-control border border-border-strong bg-bg py-1 font-mono text-sm text-fg"
      >
        {options.map((o, i) => (
          <li
            key={o.locale}
            id={`${id}-${o.locale}`}
            role="option"
            aria-selected={o.locale === current}
            lang={o.hrefLang}
            onPointerEnter={() => setActive(i)}
            onClick={() => pick(o)}
            className={`flex cursor-pointer items-baseline justify-between gap-4 px-3 py-1.5 ${i === active ? 'bg-surface-2' : ''}`}
          >
            <span className={o.locale === current ? 'text-accent' : 'text-fg'}>{o.code}</span>
            <span className="text-cap text-muted">{o.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
