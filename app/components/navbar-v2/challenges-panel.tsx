import * as React from 'react';

import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { challengePalette } from '~/components/challenges/challenge-palette';
import type { DropdownItem } from '~/components/navbar/types';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { focusRing, panelItemTint } from './nav-styles';
import { PanelFooter, panelLabelStyles } from './panel-parts';

type ChallengesPanelProps = {
  items: DropdownItem[];
  /** Mobile accordion: one column, no scope card. */
  compact: boolean;
  onSelect: () => void;
};

const rowStyles = css({
  display: 'flex',
  gap: '3.5',
  alignItems: 'flex-start',
  p: '3.5',
  rounded: '2xl',
  color: 'dark',
  textDecoration: 'none',
  transition: 'colors',
  '& .nav-row-icon, & .nav-row-text, & .nav-row-arrow': {
    transition: 'transform',
  },
  '& .nav-row-arrow': {
    opacity: 0,
    transitionProperty: '[opacity, transform]',
  },
  '&:hover .nav-row-arrow, &:focus-visible .nav-row-arrow': { opacity: 1 },
  // Movement only when motion is allowed: under reduced motion the arrow
  // fades in where it stands.
  _motionSafe: {
    '& .nav-row-arrow': { transform: 'translateX(-4px)' },
    '&:hover .nav-row-arrow, &:focus-visible .nav-row-arrow': {
      transform: 'none',
    },
    '&:hover .nav-row-icon': { transform: 'scale(1.05)' },
    '&:hover .nav-row-text': { transform: 'translateX(4px)' },
  },
});

// Revenue AI: gradient tile and a light wash of the AI gradient on the row,
// as the prototype does (`sn-ic-dark`). The wash is the `ai` gradient on a
// faded layer behind the content, so no new colour value is needed.
const aiRow = css({
  position: 'relative',
  isolation: 'isolate',
  _before: {
    content: '""',
    position: 'absolute',
    inset: '0',
    zIndex: -1,
    rounded: '2xl',
    bgGradient: 'ai',
    opacity: 0.12,
    transition: 'opacity',
  },
  '&:hover::before, &:focus-visible::before': { opacity: 0.22 },
});
const aiTile = css({ bgGradient: 'ai', color: 'dark' });

function ChallengeRow({
  item,
  index,
  onSelect,
}: {
  item: DropdownItem;
  index: number;
  onSelect: () => void;
}) {
  const isAi = item.palette === challengePalette.ai;
  const tint = panelItemTint(item);

  return (
    <NavLink
      to={item.path}
      onClick={onSelect}
      className={cx(rowStyles, isAi ? aiRow : tint.hover, focusRing)}
    >
      <span
        aria-hidden="true"
        className={cx(
          'nav-row-icon',
          center(),
          text({ variant: 'small' }),
          css({
            w: '10',
            h: '10',
            flexShrink: 0,
            rounded: 'lg',
            fontWeight: 'black',
          }),
          isAi ? aiTile : tint.icon,
        )}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span
        className={cx(
          'nav-row-text',
          text({ variant: 'body' }),
          css({
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'center',
            fontWeight: 'bold',
            lineHeight: 'tight',
          }),
        )}
      >
        <span>
          {item.description && (
            <>
              <span className={css({ srOnly: true })}>{item.label}:</span>{' '}
            </>
          )}
          {item.description ?? item.label}
          <ArrowRight
            size={14}
            aria-hidden="true"
            className={cx(
              'nav-row-arrow',
              css({ display: 'inline', ml: '1', verticalAlign: 'middle' }),
            )}
          />
        </span>
      </span>
    </NavLink>
  );
}

/**
 * Mini bow tie of the scope card: six revenue flows that meet in the
 * middle. Geometry copied from the prototype menu.
 */
function ScopeBowTie() {
  // One gradient id per instance: the design-system page renders several
  // navbars at once.
  const gradientId = `nav-scope-${React.useId().replace(/[^\w-]/g, '')}`;
  const lines = [
    [8, 38.1],
    [20, 38.8],
    [32, 39.5],
    [48, 40.5],
    [60, 41.2],
    [72, 41.9],
  ];
  return (
    <svg
      viewBox="0 0 210 80"
      aria-hidden="true"
      className={css({ display: 'block', w: 'full', h: 'auto' })}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--colors-ocobo-mint)" />
          <stop offset=".42" stopColor="var(--colors-ocobo-coral)" />
          <stop offset=".58" stopColor="var(--colors-ocobo-yellow)" />
          <stop offset="1" stopColor="var(--colors-ocobo-sky)" />
        </linearGradient>
      </defs>
      {lines.map(([y, yc]) => (
        <path
          key={y}
          d={`M2,${y} C50,${y} 66,${yc} 90,${yc} L120,${yc} C144,${yc} 160,${y} 208,${y}`}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.3"
        />
      ))}
      <circle
        cx="105"
        cy="40"
        r="7"
        fill="var(--colors-dark)"
        stroke="var(--colors-gray-100)"
        strokeWidth="3"
      />
      <circle cx="105" cy="40" r="2" fill="var(--colors-ocobo-yellow)" />
    </svg>
  );
}

function ScopeCard({ onSelect }: { onSelect: () => void }) {
  const { t } = useTranslation('common');
  const getLocalizedPath = useLocalizedPathname();

  return (
    <Link
      to={`${getLocalizedPath(url.method)}#perimetre`}
      onClick={onSelect}
      className={cx(
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5',
          p: '5',
          rounded: '2xl',
          bg: 'ocobo.gray',
          color: 'dark',
          textDecoration: 'none',
          transition: 'transform',
          _motionSafe: {
            _hover: { transform: 'translateY(-2px)' },
            '&:hover .nav-cta-arrow': { transform: 'translateX(4px)' },
          },
        }),
        focusRing,
      )}
    >
      <span className={cx(panelLabelStyles, css({ color: 'gray' }))}>
        {t('navigation.challenges.panel.scope.label')}
      </span>
      <span
        className={cx(
          text({ variant: 'body' }),
          css({ fontWeight: 'bold', lineHeight: 'tight' }),
        )}
      >
        {t('navigation.challenges.panel.scope.title')}
      </span>
      <ScopeBowTie />
      <span
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'micro',
          fontWeight: 'semibold',
          letterSpacing: 'tag',
          textTransform: 'uppercase',
          color: 'gray',
        })}
      >
        <span>{t('navigation.challenges.panel.scope.acquire')}</span>
        <span>{t('navigation.challenges.panel.scope.sign')}</span>
        <span>{t('navigation.challenges.panel.scope.expand')}</span>
      </span>
      <span
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1.5',
          fontSize: 'caption',
          fontWeight: 'bold',
        })}
      >
        {t('navigation.challenges.panel.scope.cta')}
        <ArrowRight
          size={14}
          aria-hidden="true"
          className={cx('nav-cta-arrow', css({ transition: 'transform' }))}
        />
      </span>
    </Link>
  );
}

/**
 * "Vos enjeux" panel (#315): the challenges numbered in their colour, the
 * scope card linking to the method bow tie, and a contact footer.
 */
export function ChallengesPanel({
  items,
  compact,
  onSelect,
}: ChallengesPanelProps) {
  const { t } = useTranslation('common');
  const getLocalizedPath = useLocalizedPathname();

  return (
    <div>
      <div
        className={
          compact
            ? undefined
            : css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 260px',
                gap: '2.5',
              })
        }
      >
        <ul
          className={
            compact
              ? css({ display: 'flex', flexDirection: 'column' })
              : css({
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '0.5',
                  alignContent: 'start',
                })
          }
        >
          {items.map((item, index) => (
            <li key={item.key}>
              <ChallengeRow item={item} index={index} onSelect={onSelect} />
            </li>
          ))}
        </ul>
        {!compact && <ScopeCard onSelect={onSelect} />}
      </div>
      <PanelFooter compact={compact}>
        <span>{t('navigation.challenges.panel.footer')}</span>
        <NavLink
          to={getLocalizedPath(url.contact)}
          onClick={onSelect}
          className={cx(
            css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5',
              color: 'dark',
              fontWeight: 'bold',
              rounded: 'full',
              _motionSafe: {
                '&:hover .nav-cta-arrow': { transform: 'translateX(4px)' },
              },
            }),
            focusRing,
          )}
        >
          {t('navigation.cta')}
          <ArrowRight
            size={14}
            aria-hidden="true"
            className={cx('nav-cta-arrow', css({ transition: 'transform' }))}
          />
        </NavLink>
      </PanelFooter>
    </div>
  );
}
