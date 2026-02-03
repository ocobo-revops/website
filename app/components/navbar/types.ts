import type { LucideIcon } from 'lucide-react';

// Matching prototype naming exactly
export type Color = 'yellow' | 'sky' | 'coral' | 'mint';

export type NavbarScrollState = 'at-top' | 'scrolled';

export type ScrollDirection = 'up' | 'down';

export type DropdownItem = {
  key: string;
  label: string;
  description?: string;
  path: string;
  icon?: LucideIcon;
  color: Color;
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
