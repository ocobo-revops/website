import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, text } from '@ocobo/styled-system/recipes';

import { useInView } from '~/hooks/use-in-view';

const sideCard = cx(
  card({ shadow: 'none', border: false }),
  css({
    position: 'relative',
    zIndex: '2',
    p: '8',
    color: 'dark',
    textAlign: 'center',
    borderTopWidth: '6px',
    borderTopStyle: 'solid',
  }),
);

const sideTitle = cx(text({ variant: 'display-md-black' }), css({ mb: '2.5' }));

const sideText = cx(
  text({ variant: 'small', color: 'muted' }),
  css({ mt: '0' }),
);

// Once in view, the logo pops in, then both lines grow out of it towards
// the cards, then the arrow heads appear (the mockup `#gap8`).
const line = css({
  display: { base: 'none', md: 'block' },
  position: 'absolute',
  top: '[50%]',
  h: '0.5',
  bg: 'white/60',
  transitionProperty: 'common',
  transitionDuration: 'slowest',
  transitionTimingFunction: 'smooth',
  transitionDelay: '[450ms]',
  _motionReduce: { transitionDuration: 'instant', transitionDelay: '[0ms]' },
});
const lineOut = css({ transform: 'scaleX(0)' });
const lineIn = css({ transform: 'scaleX(1)' });

const head = css({
  display: { base: 'none', md: 'block' },
  position: 'absolute',
  top: '[50%]',
  w: '0',
  h: '0',
  borderTopWidth: '7px',
  borderBottomWidth: '7px',
  borderTopColor: 'transparent',
  borderBottomColor: 'transparent',
  transitionProperty: 'common',
  transitionDuration: 'slow',
  transitionDelay: '[1050ms]',
  _motionReduce: { transitionDuration: 'instant', transitionDelay: '[0ms]' },
});

const logo = css({
  position: 'relative',
  zIndex: '2',
  display: 'inline-flex',
  rounded: 'full',
  // A ring in the section colour cuts the lines around the logo.
  boxShadow: '[0 0 0 6px {colors.dark}]',
  transitionProperty: 'common',
  transitionDuration: 'slower',
  transitionTimingFunction: 'smooth',
  _motionReduce: { transitionDuration: 'instant' },
});
const logoOut = css({ opacity: '0', transform: 'scale(0.6)' });
const logoIn = css({ opacity: '1', transform: 'none' });

const headOut = css({ opacity: '0' });
const headIn = css({ opacity: '1' });

/**
 * The gap diagram of the comparison block: consultancies on one side,
 * integrators on the other, and Ocobo in the gap between them.
 */
export function ComparatifGap() {
  const { t } = useTranslation('home');
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      className={css({ maxW: '5xl', mx: 'auto', mb: { base: '16', md: '24' } })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'minmax(0, 1fr)',
            md: 'minmax(0, 1fr) 240px minmax(0, 1fr)',
          },
          alignItems: 'center',
        })}
      >
        <div className={cx(sideCard, css({ borderTopColor: 'sky' }))}>
          <h3 className={sideTitle}>{t('comparatif.gap.consulting.title')}</h3>
          <p className={sideText}>{t('comparatif.gap.consulting.text')}</p>
        </div>

        <div
          ref={ref}
          className={css({
            position: 'relative',
            h: { base: '48', md: '64' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <div
            aria-hidden="true"
            className={css({
              position: 'absolute',
              insetBlock: { base: '6', md: '0' },
              insetInline: { base: '0', md: '6' },
              borderWidth: '1px',
              borderStyle: 'dashed',
              borderColor: 'white/35',
              rounded: '2xl',
              bg: 'white/4',
            })}
          />
          <span
            aria-hidden="true"
            className={cx(
              line,
              css({ left: '0', right: '[50%]', transformOrigin: 'right' }),
              inView ? lineIn : lineOut,
            )}
          />
          <span
            aria-hidden="true"
            className={cx(
              line,
              css({ left: '[50%]', right: '0', transformOrigin: 'left' }),
              inView ? lineIn : lineOut,
            )}
          />
          <span
            aria-hidden="true"
            className={cx(
              head,
              css({
                left: '0',
                transform: 'translateY(-50%)',
                borderRightWidth: '11px',
                borderRightColor: 'white/80',
              }),
              inView ? headIn : headOut,
            )}
          />
          <span
            aria-hidden="true"
            className={cx(
              head,
              css({
                right: '0',
                transform: 'translateY(-50%)',
                borderLeftWidth: '11px',
                borderLeftColor: 'white/80',
              }),
              inView ? headIn : headOut,
            )}
          />
          <span className={cx(logo, inView ? logoIn : logoOut)}>
            <img
              src="/images/home/ocobo-mark.png"
              alt="Ocobo"
              width={64}
              height={64}
              loading="lazy"
              className={css({ display: 'block', w: '16', h: '16' })}
            />
          </span>
          <span
            className={cx(
              text({ variant: 'label' }),
              css({
                position: 'absolute',
                bottom: { base: '8', md: '5' },
                insetInline: '0',
                textAlign: 'center',
                color: 'white/55',
              }),
            )}
          >
            {t('comparatif.gap.label')}
          </span>
        </div>

        <div className={cx(sideCard, css({ borderTopColor: 'coral' }))}>
          <h3 className={sideTitle}>{t('comparatif.gap.integrator.title')}</h3>
          <p className={sideText}>{t('comparatif.gap.integrator.text')}</p>
        </div>
      </div>

      <p
        className={cx(
          text({ variant: 'body', color: 'white' }),
          css({
            maxW: '2xl',
            mx: 'auto',
            mt: '10',
            textAlign: 'center',
            color: 'white/80',
          }),
        )}
      >
        {t('comparatif.gap.conclusion')}{' '}
        <strong className={css({ color: 'white' })}>
          {t('comparatif.gap.promise')}
        </strong>
      </p>
    </div>
  );
}
