import * as React from 'react';

import { ChevronDown } from 'lucide-react';

import { css, cx } from '@ocobo/styled-system/css';

import { topLinkStyles } from './nav-styles';

export type PanelWidth = 'sm' | '3xl' | '4xl';

type NavDisclosureProps = {
  id: string;
  label: string;
  /**
   * Panel width. The mega panels (#315) centre under the whole bar instead
   * of the button, so they never overflow the viewport edge.
   */
  width?: PanelWidth;
  isOpen: boolean;
  isCurrent: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

// Time to cross the gap between the button and the panel with the mouse.
const HOVER_CLOSE_DELAY = 250;

const rootLayout = {
  anchored: css({ position: 'relative' }),
  wide: css({ position: 'static' }),
};

const panelWidth: Record<PanelWidth, string> = {
  sm: css({ w: 'sm', p: '2' }),
  '3xl': css({ w: '3xl', p: '2.5' }),
  '4xl': css({ w: '4xl', p: '2.5' }),
};

/**
 * Desktop dropdown, built on the disclosure navigation pattern: a button
 * with `aria-expanded` that shows a panel of plain links. Escape closes it
 * and returns focus to the button; so do focus leaving the group and a
 * click outside it. A mouse also opens it on hover; touch and pen keep
 * the tap toggle.
 */
export function NavDisclosure({
  id,
  label,
  width = 'sm',
  isOpen,
  isCurrent,
  onOpenChange,
  children,
}: NavDisclosureProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const panelId = `${id}-panel`;
  // Keeps the listener below subscribed once per opening, whatever the
  // parent passes as callback.
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>();
  // A click right after a hover opening keeps the panel open instead of
  // closing it under the pointer.
  const openedByHover = React.useRef(false);

  const cancelClose = () => {
    clearTimeout(closeTimer.current);
  };

  React.useEffect(() => cancelClose, []);

  React.useEffect(() => {
    if (!isOpen) {
      openedByHover.current = false;
      // A close timer left by a pointer leave must not fire later, once
      // another panel or a click has changed the state.
      clearTimeout(closeTimer.current);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChangeRef.current(false);
      }
    };
    // Escape dismisses the panel wherever focus is, so a panel opened by
    // hover can be closed too (WCAG 1.4.13).
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      const hadFocus = rootRef.current?.contains(document.activeElement);
      onOpenChangeRef.current(false);
      if (hadFocus) {
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const handleBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (isOpen && next && !rootRef.current?.contains(next)) {
      onOpenChange(false);
    }
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') {
      return;
    }
    cancelClose();
    if (!isOpen) {
      openedByHover.current = true;
      onOpenChange(true);
    }
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || !isOpen) {
      return;
    }
    cancelClose();
    closeTimer.current = setTimeout(() => {
      // A panel opened by click or keyboard stays open while focus is in
      // it, so the pointer leaving does not drop focus to the page.
      const hasFocus = rootRef.current?.contains(document.activeElement);
      if (!openedByHover.current && hasFocus) {
        return;
      }
      onOpenChangeRef.current(false);
    }, HOVER_CLOSE_DELAY);
  };

  const handleClick = () => {
    if (isOpen && openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    onOpenChange(!isOpen);
  };

  const layout = width === 'sm' ? 'anchored' : 'wide';

  return (
    <div
      ref={rootRef}
      onBlur={handleBlur}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={rootLayout[layout]}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-current={isCurrent || undefined}
        onClick={handleClick}
        className={cx(
          topLinkStyles,
          css({
            '&[data-current]': { color: 'dark' },
            '&[aria-expanded=true] .nav-chevron': {
              transform: 'rotate(180deg)',
            },
          }),
        )}
      >
        {label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={cx('nav-chevron', css({ transition: 'transform' }))}
        />
      </button>
      <div
        id={panelId}
        hidden={!isOpen}
        className={cx(
          css({
            position: 'absolute',
            top: '[100%]',
            left: '[50%]',
            transform: 'translateX(-50%)',
            mt: '7',
            maxW: '[calc(100vw - 32px)]',
            bg: 'white',
            borderWidth: '1px',
            borderColor: 'line',
            rounded: '3xl',
            shadow: 'window',
            zIndex: 10,
            '&[hidden]': { display: 'none' },
          }),
          panelWidth[width],
        )}
      >
        {children}
      </div>
    </div>
  );
}
