import type { LucideIcon } from 'lucide-react';

// Matching prototype naming exactly
export type Color = 'yellow' | 'sky' | 'coral' | 'mint';

export type NavbarScrollState = 'at-top' | 'scrolled';

export type ScrollDirection = 'up' | 'down';

/**
 * Item tint: a navbar colour, or a class that sets `colorPalette` (the
 * challenge entries pass `challengePalette[key]`).
 */
export type DropdownItemTint =
  | { color: Color; palette?: never }
  | { palette: string; color?: never };

export type DropdownItem = DropdownItemTint & {
  key: string;
  label: string;
  description?: string;
  path: string;
  icon?: LucideIcon;
  imageSrc?: string;
  isExternal?: boolean;
  shouldHide?: boolean;
};

export type NavItem = {
  key: string;
  label: string;
  path: string | null;
  icon?: LucideIcon;
  dropdown?: DropdownItem[];
  shouldHide?: boolean;
  isButton?: boolean;
  isExternal?: boolean;
};
