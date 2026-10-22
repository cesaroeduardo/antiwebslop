import { Wordmark } from '@/components/Wordmark';
import { GitHubStars } from '@/components/GitHubStars';
import { LanguageSelect, type LanguageOption } from '@/components/LanguageSelect';
import { localePath } from '@/i18n/routing';

type Props = {
  locale: string;
  // next-intl translator; keys are dotted paths into messages/*.json
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: any) => string;
  /** Path for language switching ("" = home, "/changelog" = this page). */
  path?: string;
};

export function SiteHeader({ locale, t, path = '' }: Props) {
  const languages: LanguageOption[] = [
    { locale: 'pt', code: 'PT', name: 'Português', hrefLang: 'pt-BR', href: localePath('pt', path) },
    { locale: 'en', code: 'EN', name: 'English', hrefLang: 'en', href: localePath('en', path) },
    { locale: 'es', code: 'ES', name: 'Español', hrefLang: 'es', href: localePath('es', path) },
    { locale: 'fr', code: 'FR', name: 'Français', hrefLang: 'fr', href: localePath('fr', path) },
  ];

  const home = localePath(locale);
  const wordmarkHref = path ? home : '#top';

  return (
    <header className="relative mx-auto flex w-full max-w-wide items-center justify-between gap-3 px-4 py-5 sm:gap-6 sm:px-6">
      <a href={wordmarkHref} aria-label={t('common.backToTop')} className="shrink-0">
        <Wordmark />
      </a>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <LanguageSelect current={locale} options={languages} label={t('common.language')} />
        <GitHubStars />
      </div>
    </header>
  );
}
