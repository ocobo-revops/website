import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import type { DropdownItem } from '~/components/navbar/types';

import { focusRing, panelItemTint } from './nav-styles';
import { PanelFooter, panelLabelStyles } from './panel-parts';

type MethodPanelProps = {
  items: DropdownItem[];
  /** The ROI calculator entry, or `undefined` while its page is off. */
  roiItem?: DropdownItem;
  /** Mobile accordion: one column. */
  compact: boolean;
  onSelect: () => void;
};

const arrowStyles = cx('nav-cta-arrow', css({ transition: 'transform' }));

function MethodRow({
  item,
  onSelect,
}: {
  item: DropdownItem;
  onSelect: () => void;
}) {
  const tint = panelItemTint(item);
  const Icon = item.icon;

  return (
    <div
      className={css({
        display: 'flex',
        gap: '4',
        alignItems: 'flex-start',
        p: '4',
        rounded: '2xl',
      })}
    >
      <span
        aria-hidden="true"
        className={cx(
          center(),
          css({ w: '10', h: '10', flexShrink: 0, rounded: 'lg' }),
          tint.icon,
        )}
      >
        {Icon && <Icon size={18} />}
      </span>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5',
          minW: '0',
        })}
      >
        <NavLink
          to={item.path}
          onClick={onSelect}
          className={cx(
            css({
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5',
              rounded: 'lg',
              color: 'dark',
              textDecoration: 'none',
              _motionSafe: {
                '&:hover .nav-cta-arrow': { transform: 'translateX(4px)' },
              },
            }),
            focusRing,
          )}
        >
          <span
            className={cx(
              text({ variant: 'body' }),
              css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1',
                fontWeight: 'bold',
                lineHeight: 'tight',
              }),
            )}
          >
            {item.label}
            <ArrowRight size={14} aria-hidden="true" className={arrowStyles} />
          </span>
          {item.description && (
            <span
              className={css({
                fontSize: 'caption',
                fontWeight: 'medium',
                lineHeight: 'tight',
                color: 'gray',
              })}
            >
              {item.description}
            </span>
          )}
        </NavLink>
      </div>
    </div>
  );
}

/** Dark ROI calculator card, with the multiplier curve of the prototype. */
function RoiCard({
  item,
  onSelect,
}: {
  item: DropdownItem;
  onSelect: () => void;
}) {
  const { t } = useTranslation('common');

  return (
    <NavLink
      to={item.path}
      onClick={onSelect}
      className={cx(
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: '3',
          p: '5.5',
          rounded: '2xl',
          bg: 'dark',
          color: 'white',
          textDecoration: 'none',
          _motionSafe: {
            '&:hover .nav-cta-arrow': { transform: 'translateX(4px)' },
          },
        }),
        focusRing,
      )}
    >
      <span className={cx(panelLabelStyles, css({ color: 'ocobo.yellow' }))}>
        {t('navigation.method.panel.roi.label')}
      </span>
      <span
        className={cx(
          text({ variant: 'body', color: 'white' }),
          css({ fontWeight: 'bold', lineHeight: 'tight' }),
        )}
      >
        {t('navigation.method.panel.roi.title')}
      </span>
      <svg
        viewBox="0 0 200 70"
        aria-hidden="true"
        className={css({ display: 'block', w: 'full', h: 'auto' })}
      >
        <path
          d="M4,62 L196,44"
          fill="none"
          stroke="white"
          strokeOpacity=".3"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M4,62 C100,61 150,46 196,8 L196,66 L4,66 Z"
          fill="var(--colors-ocobo-yellow)"
          fillOpacity=".12"
        />
        <path
          d="M4,62 C100,61 150,46 196,8"
          fill="none"
          stroke="var(--colors-ocobo-yellow)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="196" cy="8" r="5" fill="var(--colors-ocobo-yellow)" />
      </svg>
      <span className={css({ fontSize: 'caption', color: 'white/70' })}>
        {t('navigation.method.panel.roi.description')}
      </span>
      <span
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1.5',
          fontSize: 'caption',
          fontWeight: 'bold',
          color: 'ocobo.yellow',
        })}
      >
        {t('navigation.method.panel.roi.cta')}
        <ArrowRight size={14} aria-hidden="true" className={arrowStyles} />
      </span>
    </NavLink>
  );
}

/**
 * "Méthode" mega panel (#315): the three method pages and the ROI
 * calculator card while its page is on.
 */
export function MethodPanel({
  items,
  roiItem,
  compact,
  onSelect,
}: MethodPanelProps) {
  const { t } = useTranslation('common');
  const withRoi = roiItem !== undefined;

  return (
    <div>
      <div
        className={
          !compact && withRoi
            ? css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 250px',
                gap: '2.5',
                alignItems: 'start',
              })
            : css({ display: 'flex', flexDirection: 'column', gap: '2.5' })
        }
      >
        <ul>
          {items.map((item) => (
            <li key={item.key}>
              <MethodRow item={item} onSelect={onSelect} />
            </li>
          ))}
        </ul>
        {roiItem && <RoiCard item={roiItem} onSelect={onSelect} />}
      </div>
      <PanelFooter compact={compact}>
        <span>{t('navigation.method.panel.tagline')}</span>
      </PanelFooter>
    </div>
  );
}
