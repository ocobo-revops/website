import { Link as LinkIcon, Lock, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { iconBox, text } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';

interface PhilosophyCardData {
  icon: string;
  title: string;
  description: string;
  hoverColor: 'sky' | 'mint' | 'yellow';
}

const iconMap: Record<string, React.ReactNode> = {
  lock: <Lock size={28} />,
  link: <LinkIcon size={28} />,
  'shield-check': <ShieldCheck size={28} />,
};

const PhilosophyCard = ({
  icon,
  title,
  description,
  hoverColor,
}: PhilosophyCardData) => {
  const hoverStyles = {
    sky: { '&:hover .icon-box': { bg: 'ocobo.sky' } },
    mint: { '&:hover .icon-box': { bg: 'ocobo.mint' } },
    yellow: { '&:hover .icon-box': { bg: 'ocobo.yellow' } },
  } as const;

  return (
    <div
      className={css({
        bg: 'white',
        p: '10',
        rounded: 'xl',
        shadow: 'xl',
        transition: 'transform',
        transitionDuration: '300ms',
        _hover: { transform: 'translateY(-4px)' },
        '& .icon-box': { transition: 'colors' },
        ...hoverStyles[hoverColor],
      })}
    >
      <div
        className={`icon-box ${iconBox({ size: 'lg', variant: 'solid' })} ${css({ mb: '8' })}`}
      >
        {iconMap[icon]}
      </div>
      <h3
        className={`${text({ variant: 'display-md', color: 'dark' })} ${css({ mb: '4' })}`}
      >
        {title}
      </h3>
      <p
        className={css({
          color: 'gray.600',
          lineHeight: 'relaxed',
          fontWeight: 'medium',
        })}
      >
        {description}
      </p>
    </div>
  );
};

export const PhilosophySection = () => {
  const { t } = useTranslation('technology');
  const cards = t('philosophy.cards', {
    returnObjects: true,
  }) as PhilosophyCardData[];

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
      <div
        className={css({
          position: 'absolute',
          inset: '0',
          opacity: 0.03,
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        })}
      />

      <Container className={css({ position: 'relative', zIndex: 10 })}>
        <div
          className={css({
            maxW: '3xl',
            mb: '20',
            textAlign: { base: 'center', md: 'left' },
          })}
        >
          <h2
            className={`${text({ variant: 'display-lg', color: 'white' })} ${css({ mb: '6' })}`}
          >
            {t('philosophy.title')}
          </h2>
          <p
            className={css({
              color: 'gray.400',
              fontSize: 'lg',
              fontWeight: 'medium',
              lineHeight: 'relaxed',
            })}
          >
            {t('philosophy.subtitle')}
          </p>
        </div>

        <div className={grid({ columns: { base: 1, md: 3 }, gap: '10' })}>
          {cards.map((card) => (
            <PhilosophyCard key={card.title} {...card} />
          ))}
        </div>
      </Container>
    </section>
  );
};
