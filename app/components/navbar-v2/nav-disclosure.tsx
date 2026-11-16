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
// The panel also carries an invisible bridge over its top margin.
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

// React 18 has no typed `inert` prop; an empty string renders the attribute.
// React 19 reads `inert=""` as false: switch to `inert` on upgrade.
const INERT = { inert: '' } as React.HTMLAttributes<HTMLDivElement>;

// Opening motion of the prototype: the panel slides in from the left as it
// fades, then its links follow one after the other. Closing only fades.
const panelStyles = css({
  position: 'absolute',
  top: '[100%]',
  left: '[50%]',
  mt: '7',
  maxW: '[calc(100vw - 32px)]',
  bg: 'white',
  borderWidth: '1px',
  borderColor: 'line',
  rounded: '3xl',
  shadow: 'window',
  zIndex: 10,
  opacity: 0,
  transform: 'translateX(calc(-50% - 24px))',
  transitionProperty: '[opacity, transform, visibility]',
  // 450ms in the prototype, snapped to the scale.
  transitionDuration: 'slowest',
  transitionTimingFunction: 'smooth',
  '&[data-state=open]': { opacity: 1, transform: 'translateX(-50%)' },
  // The links arrive one after the other. An animation, not a transition:
  // it leaves the links' own hover transitions untouched. `backwards` holds
  // the start frame during the delay only, so hover transforms still apply.
  _motionSafe: {
    '&[data-state=open] a': {
      animationName: 'nav-link-in',
      animationDuration: 'slow',
      animationTimingFunction: 'smooth',
      animationFillMode: 'backwards',
    },
    '&[data-state=open] li:nth-child(1) a': { animationDelay: 'fastest' },
    '&[data-state=open] li:nth-child(2) a': { animationDelay: 'faster' },
    '&[data-state=open] li:nth-child(3) a': { animationDelay: 'fast' },
    '&[data-state=open] li:nth-child(4) a': { animationDelay: 'normal' },
    '&[data-state=open] li:nth-child(n+5) a': { animationDelay: 'slow' },
    // Links outside a list (scope and ROI cards) arrive with the third row.
    '&[data-state=open] a:not(li a)': { animationDelay: 'fast' },
  },
  _motionReduce: {
    transform: 'translateX(-50%)',
    transitionProperty: '[opacity, visibility]',
    transitionDuration: 'normal',
  },
  // Invisible bridge over the top margin, so the pointer stays inside the
  // group on its way from the button to the panel.
  _before: {
    content: '""',
    position: 'absolute',
    left: '0',
    right: '0',
    bottom: '[100%]',
    h: '7',
  },
});

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
  // A panel opened or confirmed by a click or a key press stays open when
  // the pointer leaves; one opened by hover alone closes. A ref, so it
  // does not depend on the browser focusing buttons on click (Safari).
  const pinned = React.useRef(false);

  const cancelClose = () => {
    clearTimeout(closeTimer.current);
  };

  React.useEffect(() => cancelClose, []);

  React.useEffect(() => {
    if (!isOpen) {
      pinned.current = false;
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
      onOpenChange(true);
    }
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || !isOpen) {
      return;
    }
    cancelClose();
    closeTimer.current = setTimeout(() => {
      // Closing with focus inside would drop focus to the page, so the
      // panel stays open while focus is in it, however it was opened.
      const hasFocus = rootRef.current?.contains(document.activeElement);
      if (pinned.current || hasFocus) {
        return;
      }
      onOpenChangeRef.current(false);
    }, HOVER_CLOSE_DELAY);
  };

  const handleClick = (event: React.MouseEvent) => {
    // A mouse click on a panel just opened by hover pins it instead of
    // closing it under the pointer. A key press (`detail` 0) toggles.
    if (isOpen && !pinned.current && event.detail > 0) {
      pinned.current = true;
      return;
    }
    pinned.current = !isOpen;
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
        data-state={isOpen ? 'open' : 'closed'}
        // Visibility, not `hidden`, so the panel can fade out. `inert` takes
        // a closing panel out of reach at once: no pointer, focus or reader.
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
        {...(isOpen ? {} : INERT)}
        className={cx(panelStyles, panelWidth[width])}
      >
        {children}
      </div>
    </div>
  );
}
