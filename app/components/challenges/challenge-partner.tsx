import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { OptimizedImage } from '~/components/ui/optimized-image';
import type { ChallengePartner as ChallengePartnerData } from '~/modules/content/challenge-references';

// Bermia figures below H2 size: the H2 variant at a smaller size.
const figureText = text({ variant: 'display-lg' });

type ChallengePartnerProps = {
  partner: ChallengePartnerData;
  className?: string;
};

/**
 * A partner Tool with its published results. The figures are the partner's,
 * so the source always shows.
 */
export function ChallengePartner({
  partner,
  className,
}: ChallengePartnerProps) {
  const { t } = useTranslation('challenges');
  const { tool, sentence, metrics, source } = partner;

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
        <p className={css({ display: 'flex', alignItems: 'center', gap: '4' })}>
          <span className={text({ variant: 'label', color: 'muted' })}>
            {t('partner.with')}
          </span>
          {tool.iconUrl ? (
            <OptimizedImage
              src={tool.iconUrl}
              alt={tool.name}
              className={css({ h: '8', w: 'auto' })}
            />
          ) : (
            <span className={text({ variant: 'display-md-bold' })}>
              {tool.name}
            </span>
          )}
        </p>
        <p
          className={cx(
            figureText,
            css({ fontSize: 'h3', lineHeight: 'tight' }),
          )}
        >
          {sentence}
        </p>
        <p className={css({ fontSize: 'caption', color: 'gray' })}>{source}</p>
      </div>
      {metrics.length > 0 ? (
        <ul
          // `list-style: none` drops list semantics in Safari.
          role="list"
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
            },
            gap: '4',
            flex: '1',
            minW: '0',
          })}
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
              <p className={cx(figureText, css({ fontSize: '3xl' }))}>
                {before}
                <span aria-hidden="true"> → </span>
                <span className={css({ srOnly: true })}>
                  {` ${t('partner.then')} `}
                </span>
                {after}
              </p>
              <p
                className={css({
                  mt: '2.5',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  color: 'gray.600',
                })}
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
