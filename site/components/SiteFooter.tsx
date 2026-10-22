import { Wordmark } from '@/components/Wordmark';
import { FooterMark } from '@/components/FooterMark';
import { localeHash, localePath } from '@/i18n/routing';
import { AUTHOR_URL, REPO, blob, tree } from '@/lib/site';

type T = {
  (key: string, values?: Record<string, string | number>): string;
  rich: (key: string, values: Record<string, (chunks: React.ReactNode) => React.ReactNode>) => React.ReactNode;
};

type Props = {
  locale: string;
  t: T;
  version: string;
};

export function SiteFooter({ locale, t, version }: Props) {
  const changelogHref = localePath(locale, '/changelog');

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto grid w-full max-w-wide grid-cols-2 gap-8 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <Wordmark className="text-lg" />
          <p className="mt-4 max-w-[36ch] text-sm text-muted">{t('footer.tagline')}</p>
        </div>
        {(
          [
            [t('footer.project'), [[t('footer.github'), REPO], [t('footer.issues'), `${REPO}/issues`], [t('nav.changelog'), changelogHref]]],
            [t('footer.read'), [['SKILL.md', blob('skills/antiwebslop/SKILL.md')], [t('footer.antiPatterns'), blob('skills/antiwebslop/references/anti-patterns.md')], [t('footer.evalKit'), tree('eval')], [t('footer.designMd'), blob('site/DESIGN.md')]]],
            [t('footer.install'), [['npx skills', localeHash(locale, 'install')], [t('nav.commands'), localeHash(locale, 'commands')], ['Cursor', localeHash(locale, 'install')], ['Claude Code', localeHash(locale, 'install')]]],
          ] as [string, [string, string][]][]
        ).map(([title, links]) => (
          <nav key={title} aria-label={title} className="md:col-span-2 md:last:col-span-3">
            <h2 className="mb-3 font-mono text-cap text-muted">{title}</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {links.map(([label, href]) => (
                <li key={label}>
                  <a className="text-fg transition-colors duration-150 hover:text-accent" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="fade-rule-t mx-auto flex w-full max-w-wide flex-wrap justify-between gap-2 px-4 py-6 font-mono text-cap text-muted sm:px-6">
        <span>
          {t.rich('footer.rights', {
            author: (chunks) => (
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-fg"
              >
                {chunks}
                <span className="sr-only"> {t('github.newTab')}</span>
              </a>
            ),
            license: (chunks) => (
              <a
                href={blob('LICENSE')}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-fg"
              >
                {chunks}
                <span className="sr-only"> {t('github.newTab')}</span>
              </a>
            ),
          })}
        </span>
        <a href={changelogHref} className="transition-colors duration-150 hover:text-fg" aria-label={t('footer.versionAria', { version })}>
          v{version}
        </a>
      </div>
      <FooterMark />
    </footer>
  );
}
