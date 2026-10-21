import * as React from 'react';

import { ChevronDown } from 'lucide-react';

import { css, cx } from '@ocobo/styled-system/css';

import type { DropdownItem } from '~/components/navbar/types';

import { NavPanelItem } from './nav-panel-item';
import { topLinkStyles } from './nav-styles';

type NavDisclosureProps = {
  id: string;
  label: string;
  items: DropdownItem[];
  isOpen: boolean;
  isCurrent: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Desktop dropdown, built on the disclosure navigation pattern: a button
 * with `aria-expanded` that shows a panel of plain links. Escape closes it
 * and returns focus to the button; so do focus leaving the group and a
 * click outside it.
 */
export function NavDisclosure({
  id,
  label,
  items,
  isOpen,
  isCurrent,
  onOpenChange,
}: NavDisclosureProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const panelId = `${id}-panel`;
  // Keeps the listener below subscribed once per opening, whatever the
  // parent passes as callback.
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChangeRef.current(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      onOpenChange(false);
      buttonRef.current?.focus();
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (isOpen && next && !rootRef.current?.contains(next)) {
      onOpenChange(false);
    }
  };

  return (
    <div
      ref={rootRef}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={css({ position: 'relative' })}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-current={isCurrent || undefined}
        onClick={() => onOpenChange(!isOpen)}
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
        className={css({
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          mt: '7',
          w: 'sm',
          p: '2',
          bg: 'white',
          borderWidth: '1px',
          borderColor: 'line',
          rounded: '3xl',
          shadow: 'window',
          zIndex: 10,
          '&[hidden]': { display: 'none' },
        })}
      >
        <ul className={css({ display: 'flex', flexDirection: 'column' })}>
          {items.map((item) => (
            <li key={item.key}>
              <NavPanelItem item={item} onSelect={() => onOpenChange(false)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
