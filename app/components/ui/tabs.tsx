import { Tabs as ArkTabs } from '@ark-ui/react/tabs';
import { Pause, Play } from 'lucide-react';
import { type FocusEvent, type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button, text } from '@ocobo/styled-system/recipes';

import { usePrefersReducedMotion } from '~/hooks/use-prefers-reduced-motion';

import { useTabsAutoplay } from './tabs-autoplay';

export type TabItem = {
  value: string;
  /** Contents of the tab button. */
  label: ReactNode;
  /** Contents of the panel the tab shows. */
  content: ReactNode;
};

type TabsOrientation = 'horizontal' | 'vertical';

type TabsProps = {
  items: readonly TabItem[];
  /** Accessible name of the tab list. */
  label: string;
  orientation?: TabsOrientation;
  /** Selects the next tab on its own, unless the visitor reduces motion. */
  autoplay?: boolean;
  /** Time each tab stays selected during autoplay, in milliseconds. */
  interval?: number;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

const rootStyles = {
  horizontal: css({ display: 'flex', flexDirection: 'column', gap: '6' }),
  vertical: css({
    display: 'grid',
    gap: '6',
    md: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '8' },
  }),
};

const listStyles = {
  horizontal: css({ display: 'flex', flexWrap: 'wrap', gap: '2' }),
  // Two columns on small screens, one stacked column beside the panel above.
  vertical: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '1',
    alignSelf: 'stretch',
    md: { gridTemplateColumns: '1fr' },
  }),
};

const sideStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4',
});

const triggerStyles = css({
  px: '4',
  py: '3',
  rounded: 'lg',
  color: 'gray',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'colors',
  transitionDuration: 'normal',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'transparent',
  _hover: { bg: 'gray.light', color: 'foreground' },
  // The border marks the selected tab apart from hover, beyond colour alone.
  _selected: {
    bg: 'gray.light',
    color: 'foreground',
    borderColor: 'foreground',
  },
  _focusVisible: {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: 'foreground',
    outlineOffset: '0.5',
  },
  _motionReduce: { transitionDuration: 'instant' },
});

const contentStyles = css({
  _focusVisible: {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: 'foreground',
    outlineOffset: '1',
  },
});

const iconStyles = css({ w: '4', h: '4' });

/**
 * Tabs built on Ark UI (ADR 0002): tab roles, arrow keys between tabs, one
 * panel shown at a time.
 *
 * With `autoplay`, the next tab is selected every `interval`. A visible
 * button pauses and resumes it (WCAG 2.2.2). Choosing a tab, with a click or
 * the arrow keys, pauses it too, so the visitor keeps the tab they chose.
 * It also waits while the pointer or the keyboard focus is in the tab list.
 * There is no autoplay, and no button, when the visitor reduces motion.
 */
export function Tabs({
  items,
  label,
  orientation = 'horizontal',
  autoplay = false,
  interval = 6000,
  className,
  listClassName,
  triggerClassName,
  contentClassName,
}: TabsProps) {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  // Keyed on the values themselves, so an inline `items` array does not
  // restart the autoplay countdown on every render.
  const valuesKey = items.map((item) => item.value).join('\u0000');
  const values = useMemo(() => valuesKey.split('\u0000'), [valuesKey]);
  const [value, setValue] = useState(() => values[0] ?? '');
  // Falls back to the first tab when `items` no longer hold the selected one.
  const current = values.includes(value) ? value : (values[0] ?? '');
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const canAutoplay = autoplay && !reducedMotion && values.length > 1;
  const playing = canAutoplay && !paused && !hovered && !focused;

  useTabsAutoplay({
    values,
    value: current,
    playing,
    interval,
    onAdvance: setValue,
  });

  // Ark reports only the visitor's own choices here, never the autoplay.
  const choose = (next: string | null) => {
    if (next === null) return;
    setPaused(true);
    setValue(next);
  };

  const leaveList = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  return (
    <ArkTabs.Root
      value={current}
      onValueChange={(details) => choose(details.value)}
      orientation={orientation}
      className={cx(rootStyles[orientation], className)}
    >
      <div className={sideStyles}>
        <ArkTabs.List
          aria-label={label}
          className={cx(listStyles[orientation], listClassName)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={leaveList}
        >
          {items.map((item) => (
            <ArkTabs.Trigger
              key={item.value}
              value={item.value}
              className={cx(
                text({ variant: 'small' }),
                triggerStyles,
                triggerClassName,
              )}
            >
              {item.label}
            </ArkTabs.Trigger>
          ))}
        </ArkTabs.List>
        {canAutoplay && (
          <button
            type="button"
            className={button({ variant: 'secondary', size: 'sm' })}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? (
              <Play aria-hidden className={iconStyles} />
            ) : (
              <Pause aria-hidden className={iconStyles} />
            )}
            {paused ? t('tabs.play') : t('tabs.pause')}
          </button>
        )}
      </div>
      {items.map((item) => (
        <ArkTabs.Content
          key={item.value}
          value={item.value}
          className={cx(contentStyles, contentClassName)}
        >
          {item.content}
        </ArkTabs.Content>
      ))}
    </ArkTabs.Root>
  );
}
