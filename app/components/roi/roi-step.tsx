import { css, cx } from '@ocobo/styled-system/css';

// The numbered step header of the calculator cards (mockup `roi`).

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
        className={css({
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
          w: '8',
          h: '8',
          rounded: 'full',
          bg: 'yellow',
          color: 'dark',
          fontFamily: 'display',
          fontWeight: 'black',
          fontSize: 'sm',
        })}
      >
        {number}
      </span>
      <div className={css({ display: 'flex', flexDir: 'column' })}>
        <h3 className={css({ fontSize: 'body', fontWeight: 'bold' })}>
          {title}
        </h3>
        <p className={cx(css({ fontSize: 'caption' }), hintTones[tone])}>
          {hint}
        </p>
      </div>
    </div>
  );
}
