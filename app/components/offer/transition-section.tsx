import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';

import { Container } from '../ui/Container';

type TransitionItem = {
  title: string;
  description: string;
  color: 'yellow' | 'mint' | 'coral' | 'sky';
};

const colorMap: Record<TransitionItem['color'], string> = {
  yellow: 'ocobo.yellow',
  mint: 'ocobo.mint',
  coral: 'ocobo.coral',
  sky: 'ocobo.sky',
};

export const TransitionSection = () => {
  const { t } = useTranslation('offer');
  const items = t('transition.items', {
    returnObjects: true,
  }) as TransitionItem[];

  return (
    <section
      className={css({
        py: '24',
        bg: 'ocobo.dark',
        color: 'white',
        overflow: 'hidden',
      })}
    >
      <Container>
        <div
          className={css({
            borderWidth: '1px',
            borderColor: 'gray.700/50',
            p: { base: '12', md: '20' },
            position: 'relative',
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: '3xl', md: '5xl' },
              fontWeight: 'bold',
              color: 'white',
              mb: { base: '16', md: '20' },
              textAlign: 'center',
              lineHeight: 'tight',
            })}
          >
            {t('transition.title')}
          </h2>

          <div
            className={grid({ columns: { base: 1, md: 2, lg: 4 }, gap: '12' })}
          >
            {items.map((item) => (
              <div key={item.title} className={css({ spaceY: '4' })}>
                <h3
                  className={css({
                    fontFamily: 'display',
                    fontSize: '2xl',
                    fontWeight: 'bold',
                    color: colorMap[item.color],
                  })}
                >
                  {item.title}
                </h3>
                <p
                  className={css({
                    fontSize: 'sm',
                    color: 'gray.400',
                    lineHeight: 'relaxed',
                  })}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
