import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid, hstack } from '@ocobo/styled-system/patterns';

import { Container } from '../ui/Container';

export const ReassuranceSection = () => {
  const { t } = useTranslation('about');
  const items = t('reassurance.items', { returnObjects: true }) as string[];

  return (
    <section className={css({ py: '24', bg: 'gray.50' })}>
      <Container>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: '4xl',
            fontWeight: 'bold',
            mb: '4',
            textAlign: 'center',
          })}
        >
          {t('reassurance.title')}
        </h2>
        <p
          className={css({
            fontSize: 'lg',
            color: 'gray.600',
            textAlign: 'center',
            mb: '16',
            maxW: '3xl',
            mx: 'auto',
          })}
        >
          {t('reassurance.subtitle')}
        </p>

        <div className={grid({ columns: { base: 1, md: 2 }, gap: '6' })}>
          {items.map((item) => (
            <div
              key={item}
              className={`${hstack({ gap: '4' })} ${css({
                bg: 'white',
                p: '6',
                rounded: 'xl',
                borderWidth: '1px',
                borderColor: 'gray.100',
                transition: 'all',
                _hover: { shadow: 'lg' },
              })}`}
            >
              <CheckCircle2
                size={24}
                className={css({
                  color: 'ocobo.yellow',
                  flexShrink: '0',
                })}
              />
              <span
                className={css({
                  fontSize: 'base',
                  fontWeight: 'medium',
                  color: 'ocobo.dark',
                })}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
