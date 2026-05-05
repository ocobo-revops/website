import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { badge } from '@ocobo/styled-system/recipes';

import { StoriesIllustration } from './stories-illustration';

const Hero = () => {
  const { t } = useTranslation('common');

  return (
    <section
      className={css({
        pt: '40',
        pb: '20',
        maxW: '7xl',
        mx: 'auto',
        px: { base: '4', sm: '6', lg: '8' },
      })}
    >
      <div
        className={flex({
          direction: { base: 'column', lg: 'row' },
          align: 'center',
          justify: 'space-between',
          gap: { base: '16', lg: '20' },
        })}
      >
        <div className={css({ lg: { w: '1/2' } })}>
          <span
            className={cx(
              badge({ variant: 'yellow' }),
              css({ mb: '10', display: 'inline-block' }),
            )}
          >
            {t('clients.badge')}
          </span>
          <h1
            className={css({
              fontFamily: 'display',
              fontSize: { base: '5xl', md: '6xl' },
              fontWeight: 'bold',
              color: 'ocobo.dark',
              mb: '10',
              lineHeight: '0.95',
              letterSpacing: 'tight',
              whiteSpace: 'pre-line',
            })}
          >
            {t('clients.title')}
          </h1>
          <p
            className={css({
              fontSize: 'xl',
              color: 'gray.700',
              lineHeight: 'relaxed',
              fontWeight: 'medium',
              maxW: 'md',
            })}
          >
            {t('clients.description')}
          </p>
        </div>
        <div
          className={`${flex({
            justify: { base: 'center', lg: 'end' },
            align: 'center',
          })} ${css({
            lg: { w: '1/2' },
            position: 'relative',
          })}`}
        >
          <StoriesIllustration />
        </div>
      </div>
    </section>
  );
};

export { Hero };
