import { Target, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { iconBox, text } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';

const ICON_MAP: Record<string, React.ElementType> = {
  users: Users,
  zap: Zap,
  target: Target,
};

interface ModelCard {
  icon: string;
  title: string;
  description: string;
  hoverColor: string;
}

export const ModelSection = () => {
  const { t } = useTranslation('studio');

  const cards = t('model.cards', { returnObjects: true }) as ModelCard[];

  return (
    <section
      className={css({
        bg: 'ocobo.dark',
        py: '32',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      })}
    >
      {/* Dot pattern background */}
      <div
        className={css({
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        })}
      />

      <Container className={css({ position: 'relative', zIndex: 10 })}>
        <div className={css({ maxW: '3xl', mb: '20' })}>
          <h2 className={text({ variant: 'display-lg', color: 'white' })}>
            {t('model.title')}
          </h2>
          <p
            className={css({
              color: 'gray.400',
              fontSize: 'lg',
              fontWeight: 'medium',
              lineHeight: 'relaxed',
            })}
          >
            {t('model.subtitle')}
          </p>
        </div>

        <div className={grid({ columns: { base: 1, md: 3 }, gap: '10' })}>
          {cards.map((card) => {
            const IconComponent = ICON_MAP[card.icon] ?? Users;

            return (
              <div
                key={card.title}
                className={css({
                  bg: 'white',
                  p: '10',
                  rounded: 'xl',
                  shadow: 'xl',
                  transition: 'transform 300ms',
                  _hover: { transform: 'translateY(-4px)' },
                })}
              >
                <div
                  className={`${iconBox({ size: 'lg' })} ${css({ mb: '8' })}`}
                >
                  <IconComponent size={28} />
                </div>
                <h3
                  className={css({
                    fontFamily: 'display',
                    fontSize: '2xl',
                    fontWeight: 'black',
                    mb: '4',
                    color: 'ocobo.dark',
                  })}
                >
                  {card.title}
                </h3>
                <p
                  className={css({
                    color: 'gray.600',
                    lineHeight: 'relaxed',
                    fontWeight: 'medium',
                  })}
                >
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
