import * as React from 'react';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import type { DropdownItem, NavItem } from '~/components/navbar/types';
import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';

import { LanguageLinks } from './language-links';
import { NavPanelItem } from './nav-panel-item';
import { focusRing } from './nav-styles';

type MobileMenuProps = {
  items: NavItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Close when the viewport grows to the desktop breakpoint. */
  closeOnDesktop: boolean;
  triggerClassName?: string;
};

const entryStyles = cx(
  text({ variant: 'body' }),
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    w: 'full',
    px: '4',
    py: '3.5',
    rounded: '2xl',
    fontWeight: 'bold',
    color: 'dark',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'colors',
    _hover: { bg: 'gray.50' },
    '&[aria-current="page"]': { bg: 'gray.50' },
    '&[aria-expanded=true] .nav-chevron': { transform: 'rotate(180deg)' },
  }),
  focusRing,
);

const iconButtonStyles = cx(
  center(),
  css({
    w: '11',
    h: '11',
    flexShrink: 0,
    rounded: 'full',
    color: 'dark',
    cursor: 'pointer',
    transition: 'colors',
    _hover: { bg: 'gray.50' },
  }),
  focusRing,
);

function MobileGroup({
  item,
  visible,
  isOpen,
  onToggle,
  onSelect,
}: {
  item: NavItem;
  visible: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: () => void;
}) {
  const panelId = `${React.useId()}-panel`;

  return (
    <li>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={entryStyles}
      >
        {item.label}
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={cx('nav-chevron', css({ transition: 'transform' }))}
        />
      </button>
      <ul id={panelId} hidden={!isOpen} className={css({ pb: '2' })}>
        {visible.map((sub) => (
          <li key={sub.key}>
            <NavPanelItem item={sub} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </li>
  );
}

/**
 * Mobile menu: a burger that opens a dialog card under the top edge.
 * Ark's dialog brings the focus trap, Escape, scroll lock and focus return.
 * Groups open as accordions; any link closes the menu.
 */
export function MobileMenu({
  items,
  open,
  onOpenChange,
  closeOnDesktop,
  triggerClassName,
}: MobileMenuProps) {
  const { t } = useTranslation('common');
  const getLocalizedPath = useLocalizedPathname();
  const [openGroup, setOpenGroup] = React.useState<string | null>(null);
  // The burger is hidden at desktop width, so focus cannot go back to it.
  const [restoreFocus, setRestoreFocus] = React.useState(true);

  React.useEffect(() => {
    if (!closeOnDesktop) {
      return;
    }
    // 1024px matches the Panda `lg` breakpoint
    const query = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      if (query.matches && open) {
        setRestoreFocus(false);
        onOpenChange(false);
      }
    };
    handleChange();
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [closeOnDesktop, open, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      setRestoreFocus(true);
    } else {
      setOpenGroup(null);
    }
  }, [open]);

  const close = () => onOpenChange(false);
  const entries = items.filter((item) => !item.isButton && !item.shouldHide);
  const cta = items.find((item) => item.isButton && item.path);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      restoreFocus={restoreFocus}
      lazyMount
      unmountOnExit
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t('navigation.menu.open')}
          className={cx(iconButtonStyles, triggerClassName)}
        >
          <MenuIcon size={22} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop
          className={css({
            position: 'fixed',
            inset: '0',
            zIndex: 1000,
            bg: 'dark/20',
          })}
        />
        <Dialog.Positioner
          className={css({
            position: 'fixed',
            inset: '0',
            zIndex: 1000,
            p: '4',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          })}
        >
          <Dialog.Content
            aria-label={t('navigation.menu.title')}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              w: 'full',
              maxW: 'xl',
              maxH: 'full',
              p: '3',
              bg: 'white',
              borderWidth: '1px',
              borderColor: 'line',
              rounded: '3xl',
              shadow: 'window',
              outline: 'none',
            })}
          >
            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pl: '4',
                pb: '2',
              })}
            >
              <NavLink
                to={getLocalizedPath('/')}
                onClick={close}
                aria-label={t('navigation.home')}
                className={cx(css({ rounded: 'lg' }), focusRing)}
              >
                <img
                  src="/logo-ocobo.png"
                  alt=""
                  className={css({ h: '8', w: 'auto' })}
                />
              </NavLink>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  aria-label={t('navigation.menu.close')}
                  className={iconButtonStyles}
                >
                  <X size={22} aria-hidden="true" />
                </button>
              </Dialog.CloseTrigger>
            </div>

            <nav
              aria-label={t('navigation.label')}
              className={css({ flex: '1', overflowY: 'auto' })}
            >
              <ul>
                {entries.map((item) => {
                  const visible =
                    item.dropdown?.filter((sub) => !sub.shouldHide) ?? [];
                  if (visible.length > 0) {
                    return (
                      <MobileGroup
                        key={item.key}
                        item={item}
                        visible={visible}
                        isOpen={openGroup === item.key}
                        onToggle={() =>
                          setOpenGroup((current) =>
                            current === item.key ? null : item.key,
                          )
                        }
                        onSelect={close}
                      />
                    );
                  }
                  if (!item.path) {
                    return null;
                  }
                  if (item.isExternal) {
                    return (
                      <li key={item.key}>
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={close}
                          className={entryStyles}
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={item.key}>
                      <NavLink
                        to={item.path}
                        end
                        onClick={close}
                        className={entryStyles}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '3',
                pt: '3',
                px: '2',
                borderTopWidth: '1px',
                borderColor: 'line',
              })}
            >
              <LanguageLinks />
              {cta?.path && (
                <ButtonLink
                  to={cta.path}
                  onClick={close}
                  variant="solid"
                  size="sm"
                >
                  {t('contact.cta.mobile')}
                </ButtonLink>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
