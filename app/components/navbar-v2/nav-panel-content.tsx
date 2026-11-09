import { css } from '@ocobo/styled-system/css';

import type { DropdownItem, NavItem } from '~/components/navbar/types';

import { ChallengesPanel } from './challenges-panel';
import { MethodPanel } from './method-panel';
import type { PanelWidth } from './nav-disclosure';
import { NavPanelItem } from './nav-panel-item';

/** Desktop panel width per entry: the mega panels of #315, else `sm`. */
export function panelWidthFor(key: string): PanelWidth {
  if (key === 'challenges') {
    return '4xl';
  }
  if (key === 'method') {
    return '3xl';
  }
  return 'sm';
}

/**
 * The ROI calculator entry of the resources menu, unless its page is off.
 * The method panel shows it as a card, so the flag, label and path keep a
 * single source.
 */
export function findRoiItem(items: NavItem[]): DropdownItem | undefined {
  return items
    .flatMap((item) => item.dropdown ?? [])
    .find((sub) => sub.key === 'roi' && !sub.shouldHide);
}

type NavPanelContentProps = {
  item: NavItem;
  /** Dropdown entries left once hidden pages are filtered out. */
  visible: DropdownItem[];
  roiItem?: DropdownItem;
  /** Mobile accordion layout. */
  compact: boolean;
  onSelect: () => void;
};

/**
 * Content of one dropdown, shared by the desktop panel and the mobile
 * accordion: the challenge and method panels, or a plain list.
 */
export function NavPanelContent({
  item,
  visible,
  roiItem,
  compact,
  onSelect,
}: NavPanelContentProps) {
  if (item.key === 'challenges') {
    return (
      <ChallengesPanel items={visible} compact={compact} onSelect={onSelect} />
    );
  }
  if (item.key === 'method') {
    return (
      <MethodPanel
        items={visible}
        roiItem={roiItem}
        compact={compact}
        onSelect={onSelect}
      />
    );
  }
  return (
    <ul className={css({ display: 'flex', flexDirection: 'column' })}>
      {visible.map((sub) => (
        <li key={sub.key}>
          <NavPanelItem item={sub} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
