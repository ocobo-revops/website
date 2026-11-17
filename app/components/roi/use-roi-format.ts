import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { getLang } from '~/utils/lang';
import {
  formatRoiCount,
  formatRoiDecimal,
  formatRoiEuro,
  formatRoiPercent,
  formatRoiPercentDelta,
} from '~/utils/roi-format';

const withSign = (formatted: string, value: number): string =>
  value >= 0 ? `+${formatted}` : formatted;

/**
 * The figures of the ROI page in the page language. Numbers come from
 * `~/utils/roi-format`; unit words come from the `roi` locale files.
 */
export function useRoiFormat() {
  const { t } = useTranslation('roi');
  const lang = getLang(useParams());

  return useMemo(() => {
    const decimal = (value: number) => formatRoiDecimal(value, lang);
    const euro = (value: number) => formatRoiEuro(value, lang);
    const points = (value: number) =>
      t('units.points', { count: value, value: decimal(value) });

    return {
      decimal,
      euro,
      signedEuro: (value: number) => withSign(euro(value), value),
      count: (value: number) => formatRoiCount(value, lang),
      percent: (value: number) => formatRoiPercent(value, lang),
      delta: (fraction: number) => formatRoiPercentDelta(fraction, lang),
      years: (value: number) =>
        t('units.years', { count: value, value: decimal(value) }),
      points,
      signedPoints: (value: number) => withSign(points(value), value),
      oppsPerYear: (value: number) =>
        t('units.oppsPerYear', { value: decimal(value) }),
      oppsPerMonth: (value: number) =>
        t('units.oppsPerMonth', { value: decimal(value) }),
    };
  }, [t, lang]);
}

export type RoiFormat = ReturnType<typeof useRoiFormat>;
