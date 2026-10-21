import { Tooltip as ArkTooltip } from '@ark-ui/react/tooltip';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  /** Text shown in the tooltip. Keep it non-interactive: no links, no buttons. */
  content: ReactNode;
  /** Trigger contents, rendered inside a `<button>` unless `asChild` is set. */
  children: ReactNode;
  /**
   * Use the single child element as the trigger. It must be a focusable HTML
   * element, not an SVG one: the tooltip renders next to it.
   */
  asChild?: boolean;
  placement?: TooltipPlacement;
  className?: string;
  triggerClassName?: string;
};

const triggerStyles = css({
  cursor: 'help',
  _focusVisible: {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: 'ocobo.dark',
    outlineOffset: '0.5',
  },
});

const contentStyles = css({
  zIndex: 'tooltip',
  maxW: '56',
  px: '4.5',
  py: '4',
  bg: 'ocobo.dark',
  color: 'white',
  borderWidth: '1px',
  borderColor: 'white/12',
  rounded: '2xl',
  shadow: 'window',
  textAlign: 'left',
});

/**
 * Tooltip that opens on hover, on keyboard focus and on tap (ADR 0002,
 * "Accessibility is part of each shared component").
 *
 * Built on a controlled Ark UI Tooltip: Ark handles hover, focus, Escape and
 * `aria-describedby`, but ignores touch pointers. A click or tap therefore
 * opens it here, and a second click closes it. A tap outside closes it too.
 *
 * The content renders next to its trigger, not in a portal, so it stays in the
 * trigger's landmark and reading order. The fixed positioning strategy keeps
 * it clear of `overflow: hidden` ancestors. Place the trigger where a `<div>`
 * is valid: not inside an `<svg>` or a `<p>`.
 *
 * The content stays open while the pointer is over it (WCAG 1.4.13).
 */
export function Tooltip({
  content,
  children,
  asChild,
  placement = 'top',
  className,
  triggerClassName,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  // True once a click or tap opened the tooltip, so a second click closes it.
  // A click on a tooltip opened by hover or focus leaves it open. Moving the
  // pointer away still closes it, whatever opened it.
  const openedByClick = useRef(false);
  // Element ids rather than refs: an `asChild` trigger may not forward refs.
  const baseId = useId();
  const ids = {
    trigger: `${baseId}trigger`,
    positioner: `${baseId}positioner`,
  };

  const changeOpen = (next: boolean) => {
    if (!next) openedByClick.current = false;
    setOpen(next);
  };

  const handleClick = () => {
    if (open && openedByClick.current) {
      changeOpen(false);
      return;
    }
    openedByClick.current = true;
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (document.getElementById(ids.trigger)?.contains(target)) return;
      if (document.getElementById(ids.positioner)?.contains(target)) return;
      openedByClick.current = false;
      setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
    };
  }, [open, ids.trigger, ids.positioner]);

  return (
    <ArkTooltip.Root
      ids={ids}
      open={open}
      interactive
      onOpenChange={(details) => changeOpen(details.open)}
      closeOnClick={false}
      openDelay={200}
      positioning={{ placement, gutter: 8, strategy: 'fixed' }}
      lazyMount
      unmountOnExit
    >
      <ArkTooltip.Trigger
        asChild={asChild}
        type={asChild ? undefined : 'button'}
        className={cx(triggerStyles, triggerClassName)}
        onClick={handleClick}
      >
        {children}
      </ArkTooltip.Trigger>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          className={cx(text({ variant: 'small' }), contentStyles, className)}
        >
          {content}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  );
}
