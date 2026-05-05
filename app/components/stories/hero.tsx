import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { badge, text } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';

const Hero = () => {
  const { t } = useTranslation('common');

  return (
    <header
      className={css({
        bg: 'white',
        pt: { base: 24, lg: 40 },
        pb: { base: 16, lg: 20 },
      })}
    >
      <Container>
        <div
          className={flex({
            direction: { base: 'column', lg: 'row' },
            align: 'center',
            justify: 'space-between',
            gap: { base: '12', lg: '20' },
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
              className={cx(
                text({ variant: 'display-xl', color: 'dark' }),
                css({
                  fontSize: { base: '4xl', md: '5xl', lg: '6xl' },
                  lineHeight: '0.95',
                  letterSpacing: 'tight',
                  mb: '10',
                }),
              )}
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
        </div>
      </Container>
    </header>
  );
};

export { Hero };
