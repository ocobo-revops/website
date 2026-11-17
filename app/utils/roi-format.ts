import type { Language } from '~/localization/resources';

/**
 * Number formatting for the ROI calculator (#248).
 *
 * French writes "3,44 M€" and "+15 %" with a non-breaking space; English
 * writes "€3.44M" and "+15%". Unit words (years, points, opportunities)
 * stay in the locale files: these helpers only return figures.
 */

const NBSP = ' ';

const INTL_LOCALE: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
};

const toLocaleDecimal = (value: string, lang: Language): string =>
  lang === 'fr' ? value.replace('.', ',') : value;

/** One decimal when the value has one, none otherwise: "3", "1,5". */
export const formatRoiDecimal = (value: number, lang: Language): string => {
  const rounded = Math.round(value * 10) / 10;
  const digits = Number.isInteger(rounded) ? 0 : 1;
  return toLocaleDecimal(rounded.toFixed(digits), lang);
};

const scaleEuro = (amount: number): { figure: string; suffix: string } => {
  if (amount >= 1e6) {
    const digits = amount >= 1e8 ? 0 : amount >= 1e7 ? 1 : 2;
    return { figure: (amount / 1e6).toFixed(digits), suffix: 'M' };
  }
  if (amount >= 1e3) {
    const digits = amount >= 1e5 ? 0 : 1;
    const figure = (amount / 1e3).toFixed(digits).replace(/\.0$/, '');
    return { figure, suffix: 'k' };
  }
  return { figure: String(Math.round(amount)), suffix: '' };
};

/** A euro amount, shortened to k€ or M€: "26,3 k€", "€9.00M". */
export const formatRoiEuro = (value: number, lang: Language): string => {
  const sign = value < 0 ? '-' : '';
  const { figure, suffix } = scaleEuro(Math.abs(value));
  const localised = toLocaleDecimal(figure, lang);
  return lang === 'fr'
    ? `${sign}${localised}${NBSP}${suffix}€`
    : `${sign}€${localised}${suffix}`;
};

/** A whole number with thousands grouped: "1 234", "1,234". */
export const formatRoiCount = (value: number, lang: Language): string =>
  new Intl.NumberFormat(INTL_LOCALE[lang], {
    maximumFractionDigits: 0,
  }).format(value);

const percentSuffix = (lang: Language): string =>
  lang === 'fr' ? `${NBSP}%` : '%';

/** A win rate in percent: "25 %", "25%". */
export const formatRoiPercent = (value: number, lang: Language): string =>
  `${formatRoiDecimal(value, lang)}${percentSuffix(lang)}`;

/** A signed relative change, from a fraction: 0.05 gives "+5 %". */
export const formatRoiPercentDelta = (
  fraction: number,
  lang: Language,
): string => {
  const rounded = Math.round(fraction * 100);
  const sign = rounded >= 0 ? '+' : '';
  return `${sign}${rounded}${percentSuffix(lang)}`;
};
