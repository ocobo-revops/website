import { ArrowDown, ArrowRight } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, text } from '@ocobo/styled-system/recipes';

import type { RoiResult } from '~/utils/roi';

import { ROI_DETAIL_ID } from './roi-ids';
import { RoiStep } from './roi-step';
import { useRoiFormat } from './use-roi-format';

/**
 * Step 3 of the ROI calculator (mockup `roi`): contract value today and with
 * RevOps, and the gain between the two. Only the gain is announced to
 * screen readers as the sliders move: the slider already reads its value.
 */

const compareLabel = cx(text({ variant: 'label' }), css({ color: 'white/55' }));
const compareValue = cx(
  text({ variant: 'display-md-black' }),
  css({
    fontSize: { base: 'xl', md: 'h3' },
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  }),
);

type RoiResultCardProps = {
  result: RoiResult;
};

export function RoiResultCard({ result }: RoiResultCardProps) {
  const { t } = useTranslation('roi');
  const f = useRoiFormat();
  const { today, withRevops, gain } = result;

  return (
    <div className={css({ display: 'flex', flexDir: 'column', gap: '3.5' })}>
      <div
        className={cx(
          card({
            tone: 'dark',
            radius: 'lg',
            border: false,
            shadow: 'elevated',
          }),
          css({ display: 'flex', flexDir: 'column', gap: '5', p: '7' }),
        )}
      >
        <RoiStep
          number={3}
          title={t('calculator.step3.title')}
          hint={t('calculator.step3.hint', {
            duration: f.years(today.durationYears),
          })}
          tone="dark"
        />
        <p
          aria-live="polite"
          aria-atomic="true"
          className={css({ srOnly: true })}
        >
          {t('calculator.liveGain', {
            amount: f.signedEuro(gain.contractValue),
          })}
        </p>
        <>
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
              alignItems: 'center',
              gap: '3',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'white/12',
              rounded: '2xl',
              p: '4',
            })}
          >
            <div
              className={css({ display: 'flex', flexDir: 'column', gap: '1' })}
            >
              <span className={compareLabel}>{t('calculator.today')}</span>
              <span className={compareValue}>
                {f.euro(today.contractValue)}
              </span>
            </div>
            <ArrowRight
              size={18}
              aria-hidden="true"
              className={css({ color: 'white/40' })}
            />
            <div
              className={css({
                display: 'flex',
                flexDir: 'column',
                alignItems: 'flex-end',
                gap: '1',
                textAlign: 'right',
              })}
            >
              <span className={compareLabel}>{t('calculator.withRevops')}</span>
              <span className={cx(compareValue, css({ color: 'yellow' }))}>
                {f.euro(withRevops.contractValue)}
              </span>
            </div>
          </div>
          <div
            className={css({ display: 'flex', flexDir: 'column', gap: '1' })}
          >
            <span className={compareLabel}>{t('calculator.gain')}</span>
            <span
              className={cx(
                text({ variant: 'display-md-black' }),
                css({
                  fontSize: { base: '5xl', md: '6xl' },
                  lineHeight: 'heading',
                  color: 'mint',
                  fontVariantNumeric: 'tabular-nums',
                  overflowWrap: 'anywhere',
                }),
              )}
            >
              {f.signedEuro(gain.contractValue)}
            </span>
          </div>
          <p className={css({ fontSize: 'md', color: 'white/75' })}>
            <Trans
              t={t}
              i18nKey="calculator.bookingGain"
              values={{ amount: f.signedEuro(gain.booking) }}
              components={[
                <strong key="amount" className={css({ color: 'white' })} />,
              ]}
            />
          </p>
        </>
        <a
          href={`#${ROI_DETAIL_ID}`}
          className={css({
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1.5',
            fontSize: 'sm',
            fontWeight: 'semibold',
            color: 'white',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'white/35',
            pb: '0.5',
            _hover: { borderBottomColor: 'white' },
          })}
        >
          {t('calculator.detailLink')}
          <ArrowDown size={14} aria-hidden="true" />
        </a>
      </div>
      <p className={css({ fontSize: 'xs', color: 'gray', px: '1' })}>
        {t('calculator.disclaimer')}
      </p>
    </div>
  );
}
