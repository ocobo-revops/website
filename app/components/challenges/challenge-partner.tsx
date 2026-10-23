import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { OptimizedImage } from '~/components/ui/optimized-image';
import type { ChallengePartner as ChallengePartnerData } from '~/modules/content/challenge-references';

import { figureText, unbroken, visuallyHidden } from './challenge-figure';

const metricList = css({
  display: 'grid',
  gap: '4',
  flex: '1',
  minW: '0',
});

// One column per metric left after placeholders are dropped.
const metricColumns = {
  one: css({ gridTemplateColumns: '1fr' }),
  two: css({
    gridTemplateColumns: { base: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
  }),
};

type ChallengePartnerProps = {
  partner: ChallengePartnerData;
  className?: string;
};

/**
 * A partner Tool with its published results. The source attributes the
 * figures, so it shows with them and goes when no metric is left; the
 * partner and its sentence stay.
 */
export function ChallengePartner({
  partner,
  className,
}: ChallengePartnerProps) {
  const { t } = useTranslation('challenges');
  const { tool, sentence, metrics, source } = partner;
  // A broken logo URL falls back to the name.
  const [logoFailed, setLogoFailed] = useState(false);
  const toolRef = useRef<HTMLParagraphElement>(null);
  // An error fired before hydration never reaches `onError`.
  useEffect(() => {
    const logo = toolRef.current?.querySelector('img');
    if (logo?.complete && logo.naturalWidth === 0) setLogoFailed(true);
  }, []);
  const hasMetrics = metrics.length > 0;

  return (
    <div
      className={cx(
        card({ padding: 'lg', radius: 'lg' }),
        css({
          flexDirection: { base: 'column', lg: 'row' },
          alignItems: { lg: 'center' },
          gap: '10',
        }),
        className,
      )}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          flex: '1',
          minW: '0',
        })}
      >
        <p
          ref={toolRef}
          className={css({ display: 'flex', alignItems: 'center', gap: '4' })}
        >
          <span className={text({ variant: 'label', color: 'muted' })}>
            {t('partner.with')}
          </span>
          {tool.iconUrl && !logoFailed ? (
            <OptimizedImage
              src={tool.iconUrl}
              alt={tool.name}
              className={css({ h: '8', w: 'auto' })}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className={text({ variant: 'display-md-bold' })}>
              {tool.name}
            </span>
          )}
        </p>
        <p className={text({ variant: 'display-md-bold' })}>{sentence}</p>
        {hasMetrics ? (
          <p className={text({ variant: 'small', color: 'muted' })}>{source}</p>
        ) : null}
      </div>
      {hasMetrics ? (
        <ul
          // `list-style: none` drops list semantics in Safari.
          role="list"
          className={cx(
            metricList,
            metrics.length === 1 ? metricColumns.one : metricColumns.two,
          )}
        >
          {metrics.map(({ before, after, label }, index) => (
            <li
              key={`${index}-${label}`}
              className={css({
                bg: 'colorPalette.light',
                rounded: '2xl',
                p: '6',
              })}
            >
              <p className={figureText}>
                <span className={unbroken}>{before}</span>
                <span aria-hidden="true"> → </span>
                <span className={visuallyHidden}>
                  {` ${t('partner.then')} `}
                </span>
                <span className={unbroken}>{after}</span>
              </p>
              <p
                className={cx(
                  text({ variant: 'small', color: 'muted' }),
                  css({ mt: '2.5' }),
                )}
              >
                {label}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** The block on its own, for a page without workstreams to close. */
export function ChallengePartnerSection({ partner }: ChallengePartnerProps) {
  return (
    <section className={section({ bg: 'white' })}>
      <Container>
        <ChallengePartner partner={partner} />
      </Container>
    </section>
  );
}
