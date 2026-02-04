import { GraduationCap, Layout, LineChart, Sliders } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { section } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { PillarCard } from './pillar-card';

type PillarColor = 'yellow' | 'sky' | 'mint' | 'coral' | 'dark';

type Deliverable = {
  title: string;
  description: string;
};

type PillarData = {
  number: string;
  title: string;
  description: string;
  color: PillarColor;
  icon: 'layout' | 'sliders' | 'lineChart' | 'graduationCap';
  deliverables: Deliverable[];
};

const iconMap = {
  layout: Layout,
  sliders: Sliders,
  lineChart: LineChart,
  graduationCap: GraduationCap,
} as const;

export const PillarsSection = () => {
  const { t } = useTranslation('method');
  const pillars = t('pillars.items', { returnObjects: true }) as PillarData[];

  return (
    <section
      className={`${section({ bg: 'gray', padding: 'lg' })} ${css({
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderColor: 'gray.100',
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
          backgroundImage: 'radial-gradient(#212323 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <Container className={css({ position: 'relative', zIndex: '10' })}>
        <div className={css({ mb: '24', textAlign: 'center' })}>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: '4xl', md: '6xl' },
              fontWeight: 'black',
              mb: '8',
              letterSpacing: 'tight',
            })}
          >
            {t('pillars.title')}
          </h2>
          <p
            className={css({
              color: 'gray.500',
              maxW: '2xl',
              mx: 'auto',
              fontSize: 'xl',
              fontWeight: 'medium',
            })}
          >
            {t('pillars.subtitle')}
          </p>
        </div>

        <div className={grid({ columns: { base: 1, lg: 2 }, gap: '10' })}>
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon];
            return (
              <PillarCard
                key={pillar.number}
                number={pillar.number}
                title={pillar.title}
                description={pillar.description}
                deliverables={pillar.deliverables}
                deliverablesLabel={t('pillars.deliverablesLabel')}
                color={pillar.color}
                icon={Icon}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
};
