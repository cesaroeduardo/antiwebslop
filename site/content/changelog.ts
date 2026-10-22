/**
 * Site changelog. Entry copy stays English (same rule as the catalog and prior art).
 * Add newest first. `month` is derived from `date` (YYYY-MM) for the filter.
 */
export type ChangelogEntry = {
  id: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Semver when this note ships a tagged cut; omit for site-only notes */
  version?: string;
  title: string;
  /** Short bullets; plain text, no markdown */
  items: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    id: '2026-10-22-site-changelog',
    date: '2026-10-22',
    title: 'Changelog page on the site',
    items: [
      'New /changelog page with search and a month filter',
      'Linked from the header and the footer on every locale',
    ],
  },
  {
    id: '0.1.0',
    date: '2026-10-21',
    version: '0.1.0',
    title: 'First public cut',
    items: [
      'Skill folder with anti-pattern catalog, craft rules, and a per-project DESIGN.md brief',
      'Zero-dependency slop-lint with file:line output and optional Cursor post-write hook',
      'Blind A/B eval kit (rubric + protocol); no scored runs logged yet',
      'Install paths for Cursor, Codex, Claude Code, Grok, and npx skills',
      'Marketing site in English, Brazilian Portuguese, French, and Spanish',
    ],
  },
];

export const changelogMonths = (): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of changelog) {
    const m = e.date.slice(0, 7);
    if (!seen.has(m)) {
      seen.add(m);
      out.push(m);
    }
  }
  return out;
};
