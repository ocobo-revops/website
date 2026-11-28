import { useTranslation } from 'react-i18next';

import { ChallengeDiagnostic } from '~/components/challenges/challenge-diagnostic';

/** The closing call to action of the ROI page, the challenge pages' block. */
export function RoiDiagnostic() {
  const { t } = useTranslation('roi');
  const cta = t('diagnostic.cta');

  return (
    <ChallengeDiagnostic
      diagnostic={{
        question: t('diagnostic.question'),
        subtitle: t('diagnostic.subtitle'),
        cta,
      }}
      fallbackCta={cta}
    />
  );
}
