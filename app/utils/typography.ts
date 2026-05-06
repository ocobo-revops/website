const NBSP = ' ';

const SPACE_BEFORE_DOUBLE_PUNCT = / ([!?:;»])/g;
const SPACE_AFTER_OPENING_GUILLEMET = /(«) /g;

/**
 * Apply French typography rules to a string by converting regular spaces
 * adjacent to double punctuation (! ? : ;) and guillemets (« ») into NBSP.
 *
 * Pure function, idempotent, preserves `{{variable}}` interpolation.
 */
export function applyFrenchTypography(text: string): string {
  if (!text) return text;
  return text
    .replace(SPACE_BEFORE_DOUBLE_PUNCT, `${NBSP}$1`)
    .replace(SPACE_AFTER_OPENING_GUILLEMET, `«${NBSP}`);
}
