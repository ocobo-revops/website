import {
  BarChart3,
  Database,
  GraduationCap,
  Layers,
  RefreshCw,
  Target,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { section, text } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { ScopeCard } from './scope-card';
import { UnifiedBowtie } from './unified-bowtie';

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
        <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '6' }))}>
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

        <UnifiedBowtie />

        <h3
          className={cx(
            text({ variant: 'display-heading' }),
            css({ mt: '16', mb: '4', textAlign: 'center' }),
          )}
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
