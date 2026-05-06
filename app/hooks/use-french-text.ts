import { useTranslation } from 'react-i18next';

import { applyFrenchTypography } from '~/utils/typography';

/**
 * Returns a transform that applies French typography rules to a string when
 * the active locale is `fr`, and is a pass-through for any other locale.
 */
export function useFrenchText(): (text: string) => string {
  const { i18n } = useTranslation();
  if (i18n.language === 'fr') return applyFrenchTypography;
  return (text) => text;
}
