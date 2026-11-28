import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

// The numbered step header of the calculator cards (mockup `roi`).

// Small card titles in the body font, as on the home challenge cards.
export const stepTitle = css({
  fontFamily: 'body',
  fontSize: 'body',
  fontWeight: 'bold',
});
// Cancels the global `h3 + p` gap: the title and hint sit as one block.
export const stepHint = css({ mt: '0', fontSize: 'caption' });

const hintTones = {
  light: css({ color: 'gray' }),
  dark: css({ color: 'white/55' }),
};

type RoiStepProps = {
  number: number;
  title: string;
  hint: string;
  tone?: keyof typeof hintTones;
};

export function RoiStep({ number, title, hint, tone = 'light' }: RoiStepProps) {
  return (
    <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
      <span
        aria-hidden="true"
        className={cx(
          text({ variant: 'display-md-black' }),
          css({
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
            w: '8',
            h: '8',
            rounded: 'full',
            bg: 'yellow',
            color: 'dark',
            fontSize: 'sm',
          }),
        )}
      >
        {number}
      </span>
      <div className={css({ display: 'flex', flexDir: 'column' })}>
        <h3 className={stepTitle}>{title}</h3>
        <p className={cx(stepHint, hintTones[tone])}>{hint}</p>
      </div>
    </div>
  );
}
