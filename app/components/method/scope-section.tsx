import {
  BarChart3,
  Database,
  GraduationCap,
  Layers,
  RefreshCw,
  Target,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex, grid } from '@ocobo/styled-system/patterns';
import { section } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { BowtieLifecycle } from './revenue-model/bowtie-lifecycle';
import { PriorityProjects } from './revenue-model/priority-projects';
import { StageHeaders } from './revenue-model/stage-headers';
import { ScopeCard } from './scope-card';

type ScopeColor = 'yellow' | 'sky' | 'mint' | 'coral' | 'dark';

type ScopeData = {
  title: string;
  color: ScopeColor;
  icon:
    | 'target'
    | 'database'
    | 'barChart3'
    | 'refreshCw'
    | 'graduationCap'
    | 'layers';
  items: string[];
};

const iconMap = {
  target: Target,
  database: Database,
  barChart3: BarChart3,
  refreshCw: RefreshCw,
  graduationCap: GraduationCap,
  layers: Layers,
} as const;

export const ScopeSection = () => {
  const { t } = useTranslation('method');
  const scopes = t('scope.items', { returnObjects: true }) as ScopeData[];

  return (
    <section
      className={`${section({ bg: 'white', padding: 'lg' })} ${css({ overflow: 'hidden' })}`}
    >
      <Container className={css({ textAlign: 'center' })}>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: { base: '4xl', md: '5xl' },
            fontWeight: 'black',
            mb: '6',
            letterSpacing: 'tight',
          })}
        >
          {t('scope.title')}
        </h2>
        <p
          className={css({
            fontSize: 'xl',
            color: 'gray.500',
            mb: '12',
            maxW: '2xl',
            mx: 'auto',
            fontWeight: 'medium',
          })}
        >
          {t('scope.subtitle')}
        </p>

        {/* Revenue model — headers + bowtie + interventions */}
        <div className={flex({ direction: 'column' })}>
          <div
            className={css({
              borderWidth: '1px',
              borderColor: 'gray.200',
              rounded: 'lg',
              overflow: 'hidden',
              shadow: 'sm',
              textAlign: 'left',
            })}
          >
            <StageHeaders />
            <BowtieLifecycle />
            <PriorityProjects />
          </div>
        </div>

        <h3
          className={css({
            fontFamily: 'display',
            fontSize: { base: '2xl', md: '3xl' },
            fontWeight: 'bold',
            mt: '16',
            mb: '4',
            textAlign: 'center',
          })}
        >
          {t('scope.activitiesTitle')}
        </h3>

        <div
          className={`${grid({ columns: { base: 1, md: 2, lg: 3 }, gap: '8' })} ${css(
            {
              textAlign: 'left',
              mt: '12',
            },
          )}`}
        >
          {scopes.map((scope) => {
            const Icon = iconMap[scope.icon];
            return (
              <ScopeCard
                key={scope.title}
                title={scope.title}
                items={scope.items}
                color={scope.color}
                icon={Icon}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
};
