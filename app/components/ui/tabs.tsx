import { Tabs as ArkTabs } from '@ark-ui/react/tabs';
import { Pause, Play } from 'lucide-react';
import {
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button, text } from '@ocobo/styled-system/recipes';

import { usePrefersReducedMotion } from '~/hooks/use-prefers-reduced-motion';

import { DEFAULT_INTERVAL, useTabsAutoplay } from './tabs-autoplay';

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

// Rendered from the server on, then hidden by CSS, so a visitor who reduces
// motion never sees it appear and vanish once the preference is known.
const pauseStyles = css({ _motionReduce: { display: 'none' } });

const iconStyles = css({ w: '4', h: '4' });

/**
 * Tabs built on Ark UI (ADR 0002): tab roles, arrow keys between tabs, one
 * panel shown at a time.
 *
 * With `autoplay`, the next tab is selected every `interval`. A visible
 * button pauses and resumes it (WCAG 2.2.2). Choosing a tab, with a click or
 * the arrow keys, pauses it too, so the visitor keeps the tab they chose.
 * It also waits while the pointer or the keyboard focus is in the tabs or the
 * panel, outside the pause button. Ark gives each panel `tabIndex` 0, so a
 * click or tap on panel text focuses the panel, and the autoplay waits until
 * the focus leaves it.
 * There is no autoplay, and the button is hidden, when the visitor reduces
 * motion.
 */
export function Tabs({
  items,
  label,
  orientation = 'horizontal',
  autoplay = false,
  interval = DEFAULT_INTERVAL,
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
  const pauseRef = useRef<HTMLButtonElement>(null);
  const hasPause = autoplay && values.length > 1;
  const playing = hasPause && !reducedMotion && !paused && !hovered && !focused;

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

  // The pause button stays out of these, so it toggles the autoplay at once.
  const isInPauseButton = (target: EventTarget) =>
    target instanceof Node && pauseRef.current?.contains(target) === true;
  const enter = (event: FocusEvent<HTMLElement>) =>
    setFocused(!isInPauseButton(event.target));
  const leave = (event: FocusEvent<HTMLElement>) => {
    // The window losing focus (alt-tab, the address bar) blurs with no
    // `relatedTarget` but keeps the active element. Advancing then would hide
    // the panel that holds it, and the focus would drop to the body.
    if (
      event.relatedTarget === null &&
      event.currentTarget.contains(document.activeElement)
    ) {
      return;
    }
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };
  const hover = (event: PointerEvent<HTMLElement>) =>
    setHovered(!isInPauseButton(event.target));

  if (items.length === 0) return null;

  return (
    <ArkTabs.Root
      value={current}
      onValueChange={(details) => choose(details.value)}
      orientation={orientation}
      className={cx(rootStyles[orientation], className)}
      onPointerOver={hover}
      onPointerLeave={() => setHovered(false)}
      onFocus={enter}
      onBlur={leave}
    >
      <div className={sideStyles}>
        <ArkTabs.List
          aria-label={label}
          className={cx(listStyles[orientation], listClassName)}
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
        {hasPause && (
          <button
            ref={pauseRef}
            type="button"
            className={cx(
              button({ variant: 'secondary', size: 'sm' }),
              pauseStyles,
            )}
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
