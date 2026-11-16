import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

type SquadRole = {
  name: string;
  tag: string;
  description: string;
};

// One static class per role, in role order: strategy, builder, on demand.
const tagTones = [
  css({ bg: 'sky.light' }),
  css({ bg: 'coral.light' }),
  css({ bg: 'mint.light' }),
];

const tagStyle = cx(
  text({ variant: 'label' }),
  css({
    gridColumn: '2',
    gridRow: 'span 2',
    alignSelf: 'center',
    px: '3',
    py: '1.5',
    borderRadius: 'full',
    whiteSpace: 'nowrap',
  }),
);

// Ten working days: four build days, then a review day, twice.
const SPRINT_DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const REVIEW_DAYS = new Set([5, 10]);
const dayBar = css({ h: '3.5', borderRadius: 'full' });
const buildDay = css({ bg: 'mint' });
const reviewDay = css({ bg: 'gray.100' });

const timelineGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
  columnGap: '1.5',
});
const weekLabel = cx(
  text({ variant: 'label' }),
  css({ gridColumn: 'span 5', color: 'gray.400' }),
);
const phaseStyle = cx(
  text({ variant: 'small' }),
  css({
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    fontWeight: 'semibold',
    color: 'gray.600',
  }),
);
const dot = css({ flex: 'none', w: '2.5', h: '2.5', borderRadius: 'full' });

// Phase columns and dots are static, one class each.
const phases = [
  {
    key: 'planning',
    column: css({ gridColumn: '1 / 4' }),
    dot: css({ bg: 'dark' }),
  },
  { key: 'build', column: css({ gridColumn: '4 / 9' }), dot: null },
  {
    key: 'review',
    column: css({ gridColumn: '9 / 11' }),
    dot: css({ bg: 'coral' }),
  },
] as const;

/**
 * How a mission runs (`#squad`): the three roles of a squad, then the
 * two-week sprint cadence.
 */
export function SquadSection() {
  const { t } = useTranslation('studio');
  const roles = t('squad.roles', { returnObjects: true }) as SquadRole[];

  return (
    <section
      id="squad"
      className={cx(section({ bg: 'white' }), css({ scrollMarginTop: '24' }))}
    >
      <Container>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              lg: 'minmax(0, 0.85fr) minmax(0, 1.15fr)',
            },
            gap: { base: '10', lg: '16' },
            alignItems: 'center',
          })}
        >
          <div>
            <span className={cx(badge({ variant: 'coral' }), css({ mb: '6' }))}>
              {t('squad.badge')}
            </span>
            <h2
              className={cx(text({ variant: 'display-lg' }), css({ mb: '5' }))}
            >
              {t('squad.title')}
            </h2>
            <p className={text({ variant: 'body', color: 'muted' })}>
              {t('squad.subtitle')}
            </p>
          </div>

          <ul
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '3.5',
            })}
          >
            {roles.map((role, index) => (
              <li
                key={role.name}
                className={cx(
                  card(),
                  css({
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    columnGap: '6',
                    rowGap: '1.5',
                  }),
                )}
              >
                <h3 className={text({ variant: 'display-md-black' })}>
                  {role.name}
                </h3>
                <span className={cx(tagStyle, tagTones[index])}>
                  {role.tag}
                </span>
                <p className={text({ variant: 'small', color: 'muted' })}>
                  {role.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={cx(
            card({
              padding: 'xl',
              radius: 'lg',
              border: false,
              shadow: 'none',
            }),
            css({
              mt: '20',
              bg: 'gray.light',
              display: 'grid',
              gridTemplateColumns: {
                base: '1fr',
                md: '18rem minmax(0, 1fr)',
              },
              gap: { base: '8', md: '14' },
              alignItems: 'center',
            }),
          )}
        >
          <div>
            <h3
              className={cx(
                text({ variant: 'display-md-black' }),
                css({ mb: '3' }),
              )}
            >
              {t('squad.sprint.title')}
            </h3>
            <p className={text({ variant: 'small', color: 'muted' })}>
              {t('squad.sprint.description')}
            </p>
          </div>

          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '3',
            })}
          >
            <div aria-hidden="true" className={timelineGrid}>
              {SPRINT_DAYS.map((day) => (
                <span
                  key={day}
                  className={cx(
                    dayBar,
                    REVIEW_DAYS.has(day) ? reviewDay : buildDay,
                  )}
                />
              ))}
            </div>
            <div aria-hidden="true" className={timelineGrid}>
              <span className={weekLabel}>{t('squad.sprint.week1')}</span>
              <span className={weekLabel}>{t('squad.sprint.week2')}</span>
            </div>
            <ol className={cx(timelineGrid, css({ mt: '2', rowGap: '2' }))}>
              {phases.map((phase) => (
                <li key={phase.key} className={cx(phaseStyle, phase.column)}>
                  {phase.dot && (
                    <span aria-hidden="true" className={cx(dot, phase.dot)} />
                  )}
                  {t(`squad.sprint.phases.${phase.key}`)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
