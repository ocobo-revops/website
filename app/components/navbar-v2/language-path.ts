import { type Language, languages } from '~/localization/resources';

const LOCALE_PREFIX = new RegExp(`^/(${languages.join('|')})(?=/|$)`);

/**
 * Reads the language from a leading `/fr` or `/en` segment.
 * Blog and media routes carry no prefix: the fallback applies there.
 */
export function getPathLanguage(
  pathname: string,
  fallback: Language,
): Language {
  const match = pathname.match(LOCALE_PREFIX);
  return match ? (match[1] as Language) : fallback;
}

/**
 * Swaps the leading locale segment for the target language.
 * A path without a locale prefix has no translated twin, so it goes to the
 * target home page.
 */
export function getLanguageSwitchPath(
  pathname: string,
  target: Language,
): string {
  const match = pathname.match(LOCALE_PREFIX);
  if (!match) {
    return `/${target}`;
  }
  return `/${target}${pathname.slice(match[0].length)}`;
}
