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

type EuroUnit = { size: number; suffix: string; maxDigits: number };

const EURO_UNITS: ReadonlyArray<EuroUnit> = [
  { size: 1e6, suffix: 'M', maxDigits: 2 },
  { size: 1e3, suffix: 'k', maxDigits: 1 },
  { size: 1, suffix: '', maxDigits: 0 },
];

// Fewer decimals as the figure grows: "3,44", "10,3", "123".
const digitsFor = (scaled: number, maxDigits: number): number =>
  scaled >= 100 ? 0 : scaled >= 10 ? Math.min(1, maxDigits) : maxDigits;

// Decimals come from the rounded figure, so 9,999 M€ reads "10,0", not
// "10,00".
const figureIn = (amount: number, unit: EuroUnit): string => {
  const scaled = amount / unit.size;
  const figure = scaled.toFixed(digitsFor(scaled, unit.maxDigits));
  const digits = digitsFor(Number(figure), unit.maxDigits);
  return Number(figure).toFixed(digits);
};

const scaleEuro = (amount: number): { figure: string; suffix: string } => {
  const start = amount >= 1e6 ? 0 : amount >= 1e3 ? 1 : 2;
  // Rounding can reach a thousand ("1000 k€"): show the next unit instead.
  const index =
    start > 0 && Number(figureIn(amount, EURO_UNITS[start])) >= 1000
      ? start - 1
      : start;
  const unit = EURO_UNITS[index];
  const figure = figureIn(amount, unit);
  return {
    figure: unit.suffix === 'k' ? figure.replace(/\.0$/, '') : figure,
    suffix: unit.suffix,
  };
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

/**
 * A whole number with thousands grouped: "1 234", "1,234". French Intl
 * groups with a narrow space; the other helpers use NBSP, so this one does
 * too.
 */
export const formatRoiCount = (value: number, lang: Language): string =>
  new Intl.NumberFormat(INTL_LOCALE[lang], {
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s/gu, NBSP);

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
