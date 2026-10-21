import { Tooltip as ArkTooltip } from '@ark-ui/react/tooltip';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { css, cx } from '@ocobo/styled-system/css';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  /** Text shown in the tooltip. Keep it non-interactive: no links, no buttons. */
  content: ReactNode;
  /** Trigger contents, rendered inside a `<button>` unless `asChild` is set. */
  children: ReactNode;
  /** Use the single child element as the trigger. It must be focusable. */
  asChild?: boolean;
  placement?: TooltipPlacement;
  className?: string;
  triggerClassName?: string;
};

const triggerStyles = css({
  cursor: 'help',
  _focusVisible: {
    outline: '2px solid',
    outlineColor: 'ocobo.dark',
    outlineOffset: '2px',
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
  fontSize: 'caption',
  lineHeight: 'body',
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
 * it clear of `overflow: hidden` ancestors.
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
  // True while the tooltip stays open because of a click or tap, so a second
  // click closes it. One opened by hover or focus stays open on a click.
  const openedByClick = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      if (triggerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      openedByClick.current = false;
      setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
    };
  }, [open]);

  return (
    <ArkTooltip.Root
      open={open}
      onOpenChange={(details) => changeOpen(details.open)}
      closeOnClick={false}
      openDelay={200}
      positioning={{ placement, gutter: 8, strategy: 'fixed' }}
      lazyMount
      unmountOnExit
    >
      <ArkTooltip.Trigger
        ref={triggerRef}
        asChild={asChild}
        className={cx(triggerStyles, triggerClassName)}
        onClick={handleClick}
      >
        {children}
      </ArkTooltip.Trigger>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          ref={contentRef}
          className={cx(contentStyles, className)}
        >
          {content}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  );
}
