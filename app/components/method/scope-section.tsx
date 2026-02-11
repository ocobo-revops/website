import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { flex, grid } from '@ocobo/styled-system/patterns';
import { section } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { BowtieLifecycle } from './revenue-model/bowtie-lifecycle';
import { CrmArchitecture } from './revenue-model/crm-architecture';
import { KpiGrid } from './revenue-model/kpi-grid';
import { PriorityProjects } from './revenue-model/priority-projects';
import { StageHeaders } from './revenue-model/stage-headers';
import { TerritoriesGrid } from './revenue-model/territories-grid';

type ThemeColor = 'yellow' | 'sky' | 'mint' | 'coral';

type ActivityItem = {
  number: string;
  title: string;
  description: string;
  color: ThemeColor;
};

/* Pre-computed colour maps for Panda CSS static analysis */
const accentStyles: Record<ThemeColor, string> = {
  yellow: css({
    _before: { bg: 'ocobo.yellow' },
  }),
  sky: css({
    _before: { bg: 'ocobo.sky' },
  }),
  mint: css({
    _before: { bg: 'ocobo.mint' },
  }),
  coral: css({
    _before: { bg: 'ocobo.coral' },
  }),
};

const numberStyles: Record<ThemeColor, string> = {
  yellow: css({ color: 'ocobo.yellow/15' }),
  sky: css({ color: 'ocobo.sky/15' }),
  mint: css({ color: 'ocobo.mint/15' }),
  coral: css({ color: 'ocobo.coral/15' }),
};

const tileBase = css({
  position: 'relative',
  p: '8',
  pt: '10',
  textAlign: 'left',
  transition: 'all',
  transitionDuration: '300ms',
  overflow: 'hidden',
  _before: {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    h: '3px',
    transition: 'height',
    transitionDuration: '300ms',
  },
  _hover: {
    transform: 'translateY(-2px)',
    shadow: 'lg',
    _before: { h: '5px' },
  },
});

const numberBase = css({
  position: 'absolute',
  top: '3',
  right: '6',
  fontFamily: 'display',
  fontSize: '5xl',
  fontWeight: 'black',
  lineHeight: '1',
  userSelect: 'none',
});

export const ScopeSection = () => {
  const { t } = useTranslation('method');
  const activities = t('scope.activities', {
    returnObjects: true,
  }) as ActivityItem[];

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

        {/* Revenue model — 6 strates */}
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
            <KpiGrid />
            <CrmArchitecture />
            <PriorityProjects />
            <TerritoriesGrid />
          </div>
        </div>

        {/* Activities */}
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
        <p
          className={css({
            fontSize: 'lg',
            color: 'gray.400',
            mb: '12',
            maxW: 'xl',
            mx: 'auto',
          })}
        >
          {t('scope.activitiesSubtitle')}
        </p>

        <div
          className={grid({
            columns: { base: 1, md: 2, lg: 3 },
            gap: '0',
          })}
        >
          {activities.map((item) => (
            <div
              key={item.number}
              className={cx(tileBase, accentStyles[item.color])}
            >
              <span className={cx(numberBase, numberStyles[item.color])}>
                {item.number}
              </span>
              <h4
                className={css({
                  fontFamily: 'display',
                  fontSize: 'lg',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: '3',
                  position: 'relative',
                })}
              >
                {item.title}
              </h4>
              <p
                className={css({
                  fontSize: 'sm',
                  color: 'gray.500',
                  lineHeight: 'relaxed',
                  position: 'relative',
                })}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
