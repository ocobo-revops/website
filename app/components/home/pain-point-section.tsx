import { BarChart3, Layout, Target, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { section } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { FeatureCard } from './feature-card';

const ICONS = [
  <Layout key="layout" size={28} />,
  <Zap key="zap" size={28} />,
  <Target key="target" size={28} />,
  <BarChart3 key="bar" size={28} />,
];

type PainPointCard = {
  title: string;
  description: string;
  label: string;
  colour: 'coral' | 'yellow' | 'sky' | 'mint';
};

export const PainPointSection = () => {
  const { t } = useTranslation('home');
  const cards = t('painPoint.cards', {
    returnObjects: true,
  }) as PainPointCard[];

  return (
    <section
      className={`${section({ bg: 'white', padding: 'lg' })} ${css({
        py: '32',
        position: 'relative',
        overflow: 'hidden',
      })}`}
    >
      <div
        className={css({
          position: 'absolute',
          inset: '0',
          opacity: '0.03',
          pointerEvents: 'none',
        })}
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(33,35,35,0.5) 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      />

      <Container
        narrow
        className={css({
          textAlign: 'center',
          position: 'relative',
          zIndex: '10',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: { base: '4xl', md: '6xl' },
            fontWeight: 'black',
            color: 'ocobo.dark',
            mb: '10',
            lineHeight: '0.95',
            letterSpacing: 'tight',
          })}
        >
          {t('painPoint.title.line1')}
          <br />
          {t('painPoint.title.line2')}
        </h2>
        <div
          className={css({
            mx: 'auto',
            color: 'gray.500',
            mb: '12',
            fontWeight: 'medium',
            fontSize: 'xl',
            '& p': { lineHeight: 'relaxed' },
          })}
        >
          <p>{t('painPoint.description')}</p>
        </div>
        <div
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3',
            px: '8',
            py: '3',
            bg: 'ocobo.dark',
            color: 'white',
            fontFamily: 'display',
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: 'sm',
            rounded: 'full',
            transform: 'scale(1)',
            transition: 'transform',
            cursor: 'default',
            shadow: 'xl',
            _hover: { transform: 'scale(1.05)' },
          })}
        >
          {t('painPoint.badge')}
        </div>
      </Container>

      <Container
        className={css({ mt: '28', position: 'relative', zIndex: '10' })}
      >
        <div className={grid({ columns: { base: 1, md: 2, lg: 4 }, gap: '6' })}>
          {cards.map((card, index) => (
            <FeatureCard
              key={card.title}
              icon={ICONS[index]}
              title={card.title}
              description={card.description}
              colour={card.colour}
              label={card.label}
            />
          ))}
        </div>
      </Container>

      <div
        className={css({
          textAlign: 'center',
          mt: '32',
          maxW: '4xl',
          mx: 'auto',
          px: '4',
        })}
      >
        <div
          className={css({
            display: 'inline-block',
            px: '5',
            py: '2',
            bg: 'ocobo.mint',
            color: 'ocobo.dark',
            fontFamily: 'display',
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            fontSize: 'xs',
            mb: '8',
            rounded: 'full',
          })}
        >
          {t('painPoint.mission.label')}
        </div>
        <h3
          className={css({
            fontFamily: 'display',
            fontSize: { base: '4xl', md: '5xl' },
            fontWeight: 'black',
            mb: '6',
            letterSpacing: 'tight',
          })}
        >
          {t('painPoint.mission.title')}
        </h3>
        <p
          className={css({
            fontSize: 'xl',
            color: 'gray.500',
            fontWeight: 'medium',
            lineHeight: 'relaxed',
          })}
        >
          {t('painPoint.mission.description')}
        </p>
      </div>
    </section>
  );
};
