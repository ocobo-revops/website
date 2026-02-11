import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

type ThemeColor = 'yellow' | 'sky' | 'mint' | 'coral' | 'dark';

interface SectionLabelProps {
  label: string;
  color: ThemeColor;
}

const textColorStyles: Record<ThemeColor, string> = {
  dark: css({ color: 'ocobo.dark/30' }),
  yellow: css({ color: 'ocobo.yellow/50' }),
  sky: css({ color: 'ocobo.sky/50' }),
  mint: css({ color: 'ocobo.mint/50' }),
  coral: css({ color: 'ocobo.coral/50' }),
};

const lineColorStyles: Record<ThemeColor, string> = {
  dark: css({ bg: 'ocobo.dark/15' }),
  yellow: css({ bg: 'ocobo.yellow/40' }),
  sky: css({ bg: 'ocobo.sky/30' }),
  mint: css({ bg: 'ocobo.mint/40' }),
  coral: css({ bg: 'ocobo.coral/40' }),
};

const baseTextStyle = css({
  fontSize: 'sm',
  fontWeight: 'black',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
});

const lineStyle = css({
  w: '8',
  h: '0.5',
  rounded: 'full',
});

export const SectionLabel = ({ label, color }: SectionLabelProps) => (
  <div
    className={flex({
      direction: 'column',
      gap: '1.5',
      position: 'absolute',
      top: '4',
      left: '6',
    })}
  >
    <span className={cx(baseTextStyle, textColorStyles[color])}>{label}</span>
    <div className={cx(lineStyle, lineColorStyles[color])} />
  </div>
);
