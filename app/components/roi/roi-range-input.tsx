import { useId } from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type { RoiInputRange } from '~/utils/roi';

/**
 * One figure of the ROI calculator: a label, its formatted value and a
 * native range slider. The native input keeps keyboard and screen reader
 * support for free; `aria-valuetext` reads the formatted value aloud.
 */

const thumb = {
  appearance: 'none',
  w: '6',
  h: '6',
  rounded: 'full',
  bg: 'white',
  borderWidth: '3px',
  borderStyle: 'solid',
  borderColor: 'dark',
  boxShadow: 'rest',
  cursor: 'grab',
} as const;

const range = css({
  appearance: 'none',
  display: 'block',
  w: 'full',
  h: '1.5',
  rounded: 'full',
  cursor: 'pointer',
  outline: 'none',
  '&::-webkit-slider-thumb': thumb,
  '&::-moz-range-thumb': thumb,
  '&:focus-visible::-webkit-slider-thumb': {
    boxShadow: '[0 0 0 3px var(--colors-yellow)]',
  },
  '&:focus-visible::-moz-range-thumb': {
    boxShadow: '[0 0 0 3px var(--colors-yellow)]',
  },
});

type RoiRangeInputProps = {
  label: string;
  hint: string;
  value: number;
  formatted: string;
  range: RoiInputRange;
  onChange: (value: number) => void;
};

export function RoiRangeInput({
  label,
  hint,
  value,
  formatted,
  range: { min, max, step },
  onChange,
}: RoiRangeInputProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const filled = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '3',
        py: '2.5',
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '3',
        })}
      >
        <label
          htmlFor={id}
          className={css({ display: 'flex', flexDir: 'column' })}
        >
          <span className={css({ fontSize: 'md', fontWeight: 'bold' })}>
            {label}
          </span>
          {/* The hint describes the slider without lengthening its name. */}
          <span
            id={hintId}
            className={css({ fontSize: 'xs', color: 'gray.400' })}
          >
            {hint}
          </span>
        </label>
        <output
          htmlFor={id}
          className={cx(
            text({ variant: 'display-md-black' }),
            css({
              fontSize: '2xl',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }),
          )}
        >
          {formatted}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={formatted}
        aria-describedby={hintId}
        onChange={(event) => onChange(Number(event.target.value))}
        className={range}
        // The filled part of the track follows the value.
        style={{
          background: `linear-gradient(to right, var(--colors-dark) ${filled}%, var(--colors-gray-200) ${filled}%)`,
        }}
      />
    </div>
  );
}
