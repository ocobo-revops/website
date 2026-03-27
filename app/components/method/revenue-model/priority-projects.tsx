import {
  type LucideIcon,
  Repeat,
  Rocket,
  Target,
  TrendingUp,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';

import { SectionLabel } from './section-label';

type ThemeColor = 'yellow' | 'sky' | 'mint' | 'coral';
type Project = { phase: string; text: string; color: ThemeColor; icon: string };

const iconMap: Record<string, LucideIcon> = {
  target: Target,
  userCheck: UserCheck,
  zap: Zap,
  rocket: Rocket,
  repeat: Repeat,
  trendingUp: TrendingUp,
};

/* Pre-computed hover border colours */
const hoverBorderStyles: Record<ThemeColor, string> = {
  sky: css({ _hover: { borderColor: 'ocobo.sky/30' } }),
  yellow: css({ _hover: { borderColor: 'ocobo.yellow/30' } }),
  mint: css({ _hover: { borderColor: 'ocobo.mint/30' } }),
  coral: css({ _hover: { borderColor: 'ocobo.coral/30' } }),
};

/* Pre-computed icon colours */
const iconColorStyles: Record<ThemeColor, string> = {
  sky: css({ color: 'ocobo.sky' }),
  yellow: css({ color: 'ocobo.yellow' }),
  mint: css({ color: 'ocobo.mint' }),
  coral: css({ color: 'ocobo.coral' }),
};

/* Pre-computed phase label colours */
const phaseLabelStyles: Record<ThemeColor, string> = {
  sky: css({ color: 'ocobo.sky' }),
  yellow: css({ color: 'ocobo.yellow' }),
  mint: css({ color: 'ocobo.mint' }),
  coral: css({ color: 'ocobo.coral' }),
};

const cardBase = css({
  bg: 'gray.50/40',
  borderWidth: '1px',
  borderColor: 'gray.100',
  p: '8',
  rounded: '2xl',
  display: 'flex',
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: '6',
  h: 'full',
  transition: 'all',
  transitionDuration: '300ms',
  _hover: { shadow: 'md', bg: 'white' },
});

const iconBoxBase = css({
  w: '12',
  h: '12',
  bg: 'white',
  rounded: 'xl',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: '1px',
  borderColor: 'gray.100',
  shadow: 'sm',
  flexShrink: 0,
  transition: 'transform',
  transitionDuration: '300ms',
});

const phaseLabelBase = css({
  fontSize: '10px',
  fontWeight: 'black',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  mb: '2',
  display: 'block',
});

export const PriorityProjects = () => {
  const { t } = useTranslation('method');
  const projects = t('scope.projects', { returnObjects: true }) as Project[];

  return (
    <div
      className={css({
        position: 'relative',
        pt: '16',
        pb: '16',
        bg: 'white',
        borderBottomWidth: '1px',
        borderBottomColor: 'gray.100',
      })}
    >
      <SectionLabel label={t('scope.labels.projects')} color="yellow" />

      <div
        className={grid({
          columns: { base: 1, md: 2, lg: 3 },
          gap: '8',
        })}
        style={{ padding: '0 2rem', marginTop: '3rem' }}
      >
        {projects.map((project, i) => {
          const Icon = iconMap[project.icon] ?? Target;
          return (
            <div
              key={`proj-${i}`}
              className={cx(cardBase, hoverBorderStyles[project.color])}
            >
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                })}
              >
                <div
                  className={cx(iconBoxBase, iconColorStyles[project.color])}
                >
                  <Icon size={22} />
                </div>
              </div>
              <div
                className={css({ display: 'flex', flexDirection: 'column' })}
              >
                <span
                  className={cx(
                    phaseLabelBase,
                    phaseLabelStyles[project.color],
                  )}
                >
                  {project.phase}
                </span>
                <p
                  className={css({
                    fontSize: '15px',
                    fontWeight: 'medium',
                    color: 'gray.600',
                    lineHeight: 'relaxed',
                  })}
                >
                  {project.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
