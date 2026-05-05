import { css } from '@ocobo/styled-system/css';

export type StoryAccent = 'yellow' | 'mint';

export const accentBgStyles: Record<StoryAccent, string> = {
  yellow: css({ bg: 'ocobo.yellow' }),
  mint: css({ bg: 'ocobo.mint' }),
};

export const accentTextStyles: Record<StoryAccent, string> = {
  yellow: css({ color: 'ocobo.yellow' }),
  mint: css({ color: 'ocobo.mint' }),
};

export const accentBorderStyles: Record<StoryAccent, string> = {
  yellow: css({ borderColor: 'ocobo.yellow' }),
  mint: css({ borderColor: 'ocobo.mint' }),
};

export const accentBgLightStyles: Record<StoryAccent, string> = {
  yellow: css({ bg: 'ocobo.yellow.light' }),
  mint: css({ bg: 'ocobo.mint.light' }),
};

export const accentBadgeVariant: Record<StoryAccent, 'yellow' | 'mint'> = {
  yellow: 'yellow',
  mint: 'mint',
};
