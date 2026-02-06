import * as React from 'react';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigation } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center, flex, hstack, vstack } from '@ocobo/styled-system/patterns';

import { ButtonLink } from '~/components/ui/button-link';
import { useMenuItems } from '~/hooks/useMenuItems';

import { iconStyles } from './styles';
import type { DropdownItem, NavItem } from './types';

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function MobileDropdownItem({
  item,
  onClose,
}: {
  item: DropdownItem;
  onClose: () => void;
}) {
  const { label, description, path, icon: Icon, color, isExternal } = item;

  const content = (
    <>
      <div
        className={cx(
          center(),
          css({
            w: '10',
            h: '10',
            rounded: 'xl',
            flexShrink: 0,
            borderWidth: '1px',
            borderColor: 'gray.50',
          }),
          iconStyles[color],
        )}
      >
        {Icon && <Icon size={18} />}
      </div>
      <div>
        <span
          className={css({
            fontWeight: 'bold',
            fontSize: 'base',
            display: 'block',
            lineHeight: 'tight',
            transition: 'colors',
          })}
        >
          {label}
        </span>
        {description && (
          <span
            className={css({
              fontSize: 'xs',
              color: 'gray.400',
              fontWeight: 'medium',
            })}
          >
            {description}
          </span>
        )}
      </div>
    </>
  );

  const className = cx(
    hstack({ gap: '4' }),
    css({
      transition: 'transform',
      _active: { transform: 'translateX(4px)' },
    }),
  );

  if (isExternal) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClose}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink to={path} className={className} onClick={onClose}>
      {content}
    </NavLink>
  );
}

function MobileNavItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const { t } = useTranslation('common');
  const { label, path, dropdown, isButton } = item;
  const visibleItems = dropdown?.filter((sub) => !sub.shouldHide) ?? [];

  const headingStyles = css({
    fontFamily: 'display',
    fontSize: '2xl',
    fontWeight: '900',
    display: 'block',
    letterSpacing: 'tight',
    color: 'ocobo.dark',
  });

  if (isButton && path) {
    return (
      <div className={css({ w: 'full', mt: '10' })}>
        <ButtonLink to={path} onClick={onClose} variant="solid" size="lg">
          {t('contact.cta.mobile')}
        </ButtonLink>
      </div>
    );
  }

  if (path && visibleItems.length === 0) {
    return (
      <NavLink to={path} onClick={onClose} className={headingStyles}>
        {label}
      </NavLink>
    );
  }

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className={css({ spaceY: '5' })}>
      {path ? (
        <NavLink to={path} onClick={onClose} className={headingStyles}>
          {label}
        </NavLink>
      ) : (
        <span className={headingStyles}>{label}</span>
      )}
      <div className={css({ spaceY: '5', pl: '2' })}>
        {visibleItems.map((subItem) => (
          <MobileDropdownItem
            key={subItem.key}
            item={subItem}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const items = useMenuItems();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (navigation.state === 'loading' && open) {
      onOpenChange(false);
    }
  }, [navigation.state, open, onOpenChange]);

  React.useEffect(() => {
    // 1024px matches Panda CSS `lg` breakpoint
    const mediaQueryList = window.matchMedia('(min-width: 1024px)');

    const handleChange = () => {
      if (mediaQueryList.matches && open) {
        onOpenChange(false);
      }
    };

    handleChange();
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [open, onOpenChange]);

  const handleClose = () => onOpenChange(false);

  const regularItems = items.filter((item) => !item.isButton);
  const buttonItem = items.find((item) => item.isButton);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={css({
            display: { base: 'block', lg: 'none' },
            position: 'relative',
            zIndex: 50,
            p: '2.5',
            rounded: 'full',
            transition: 'colors',
            bg: 'ocobo.dark/5',
            color: 'ocobo.dark',
          })}
        >
          <MenuIcon size={20} />
        </button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Positioner
          className={css({
            position: 'fixed',
            inset: '0',
            zIndex: 1000,
            display: { lg: 'none' },
          })}
        >
          <Dialog.Content
            aria-label="Navigation menu"
            className={cx(
              vstack(),
              css({
                w: 'full',
                h: 'full',
                bg: 'white',
                pt: '8',
                px: '8',
                pb: '10',
                outline: 'none',
              }),
            )}
          >
            <div
              className={cx(
                flex({ justify: 'space-between', align: 'center' }),
                css({ w: 'full', mb: '10' }),
              )}
            >
              <img
                src="/logo-ocobo.png"
                alt="Ocobo Logo"
                className={css({ h: '8' })}
              />
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  aria-label="Close menu"
                  className={css({
                    p: '2',
                    color: 'ocobo.dark',
                    bg: 'gray.50',
                    rounded: 'full',
                    transition: 'transform',
                    _active: { transform: 'scale(0.9)' },
                  })}
                >
                  <X size={24} />
                </button>
              </Dialog.CloseTrigger>
            </div>

            <div
              className={css({
                w: 'full',
                flexGrow: 1,
                spaceY: '8',
                overflowY: 'auto',
              })}
            >
              {regularItems.map((item) => (
                <MobileNavItem
                  key={item.key}
                  item={item}
                  onClose={handleClose}
                />
              ))}
            </div>

            {buttonItem && (
              <MobileNavItem item={buttonItem} onClose={handleClose} />
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
