import { getTranslations } from 'next-intl/server';
import { REPO } from '@/lib/site';

const API = 'https://api.github.com/repos/cesaroeduardo/antiwebslop';

/** Live star count, cached for an hour. Returns null on any failure (offline build, rate limit): no fake number. */
async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(API, {
      headers: { 'User-Agent': 'antiwebslop-site', Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: unknown };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

function compact(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)}k`;
}

/** Header link to the repo, in a new tab: GitHub mark, label (hidden on small screens), star and count. */
export async function GitHubStars() {
  const [stars, t] = await Promise.all([getStars(), getTranslations('github')]);
  const label = `${stars === null ? t('aria') : t('ariaStars', { count: stars })} ${t('newTab')}`;
  return (
    <a
      href={REPO}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex shrink-0 items-center gap-2 rounded-control border border-border px-2 py-1.5 font-mono text-sm text-fg transition-colors duration-150 hover:border-border-strong hover:bg-surface sm:px-3"
    >
      <svg aria-hidden viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      <span className="hidden sm:inline">{t('label')}</span>
      {stars === null ? null : (
        <span className="inline-flex items-center gap-1 border-l border-border pl-2 tabular-nums text-muted">
          <svg aria-hidden viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          {compact(stars)}
        </span>
      )}
    </a>
  );
}
