import { Menu } from '@ark-ui/react/menu';
import { ChevronDown } from 'lucide-react';

import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import { NavDropdownItem } from './nav-dropdown-item';
import type { NavItem } from './types';

type NavItemWithDropdownProps = {
  item: NavItem;
  isCurrentPath: boolean;
  activeDropdown: string | null;
  setActiveDropdown: (label: string | null) => void;
};

export function NavItemWithDropdown({
  item,
  isCurrentPath,
  activeDropdown,
  setActiveDropdown,
}: NavItemWithDropdownProps) {
  const { key, label, dropdown } = item;
  const visibleItems = dropdown?.filter((sub) => !sub.shouldHide) ?? [];
  const isOpen = activeDropdown === key;

  if (visibleItems.length === 0) {
    return null;
  }

  const triggerStyles = cx(
    flex({ gap: '1', align: 'center' }),
    css({
      px: '4',
      py: '2',
      rounded: 'full',
      fontSize: 'sm',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all',
      transitionDuration: '300ms',
      color: isOpen || isCurrentPath ? 'ocobo.dark' : 'gray.500',
      _hover: { color: 'ocobo.dark' },
    }),
  );

  return (
    <Menu.Root
      open={isOpen}
      onOpenChange={(details) => {
        setActiveDropdown(details.open ? key : null);
      }}
      positioning={{ placement: 'bottom', gutter: 28 }}
      closeOnSelect
    >
      <Menu.Trigger asChild>
        <button type="button" className={triggerStyles}>
          {label}
          <ChevronDown
            size={14}
            className={css({
              transition: 'transform 0.3s',
              opacity: isOpen ? 0.6 : 0.3,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            })}
          />
        </button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content
          className={css({
            w: '380px',
            bg: 'white/95',
            backdropFilter: 'blur(12px)',
            rounded: '3xl',
            p: '2',
            shadow: 'soft-lg',
            borderWidth: '1px',
            borderColor: 'gray.100',
            overflow: 'hidden',
            outline: 'none',
            transition: 'all 0.3s',
            '&[data-state="open"]': {
              opacity: 1,
              transform: 'translateY(0)',
            },
            '&[data-state="closed"]': {
              opacity: 0,
              transform: 'translateY(-8px)',
              pointerEvents: 'none',
            },
          })}
        >
          {visibleItems.map((subItem) => (
            <Menu.Item key={subItem.key} value={subItem.key} asChild>
              <NavDropdownItem
                item={subItem}
                onClose={() => setActiveDropdown(null)}
              />
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
