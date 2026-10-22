'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { type ChangelogEntry, changelogMonths } from '@/content/changelog';

function monthLabel(month: string, locale: string) {
  const [y, m] = month.split('-').map(Number);
  const loc = locale === 'pt' ? 'pt-BR' : locale;
  const abbr = new Intl.DateTimeFormat(loc, { month: 'short' })
    .format(new Date(y, m - 1, 1))
    // Drop trailing period some locales add (e.g. "out.")
    .replace(/\.$/, '')
    .toLocaleUpperCase(loc);
  return `${abbr}/${y}`;
}

function formatDate(date: string, locale: string) {
  const [y, m, d] = date.split('-').map(Number);
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));
}

export function Changelog({ entries }: { entries: ChangelogEntry[] }) {
  const t = useTranslations('changelog');
  const locale = useLocale();
  const months = useMemo(() => changelogMonths(), []);
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (month && e.date.slice(0, 7) !== month) return false;
      if (!q) return true;
      const hay = [e.title, e.version ?? '', ...e.items].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [entries, query, month]);

  const toggleMonth = (m: string) => setMonth((cur) => (cur === m ? null : m));

  const monthBtn = (active: boolean) =>
    `block w-full rounded-control px-2 py-1.5 text-left font-mono text-sm transition-colors duration-150 ${
      active ? 'bg-surface-2 text-accent' : 'text-muted hover:bg-surface hover:text-fg'
    }`;

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-x-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-x-16">
      <aside className="md:sticky md:top-6 md:self-start">
        <nav aria-label={t('monthLabel')}>
          <ul className="flex flex-col gap-0.5">
            {months.map((m) => (
              <li key={m}>
                <button type="button" aria-pressed={month === m} onClick={() => toggleMonth(m)} className={monthBtn(month === m)}>
                  {monthLabel(m, locale)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div id="entries" className="flex min-w-0 flex-col gap-8">
        <label className="relative block max-w-md">
          <span className="sr-only">{t('searchLabel')}</span>
          <Search
            aria-hidden
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            autoComplete="off"
            className="h-11 w-full rounded-control border border-border bg-surface pl-10 pr-3 font-mono text-sm text-fg placeholder:text-muted transition-colors duration-150 hover:border-border-strong focus:border-border-strong focus:outline-none"
          />
        </label>

        {filtered.length === 0 ? (
          <p className="font-mono text-sm text-muted">{t('empty')}</p>
        ) : (
          <ol className="flex flex-col">
            {filtered.map((e, i) => (
              <li
                key={e.id}
                id={e.id}
                className={`scroll-mt-8 py-10 ${i === 0 ? 'pt-0' : 'fade-rule-t'}`}
              >
                <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-cap text-muted">
                  <time dateTime={e.date}>{formatDate(e.date, locale)}</time>
                  {e.version ? (
                    <span className="rounded-control bg-accent px-1.5 py-0.5 text-accent-fg">v{e.version}</span>
                  ) : null}
                </div>
                <h2 className="mb-4 text-lg font-medium text-fg">{e.title}</h2>
                <ul lang="en" className="flex max-w-[65ch] flex-col gap-2 text-body text-muted">
                  {e.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-accent" />
                      <span className="text-fg">{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
