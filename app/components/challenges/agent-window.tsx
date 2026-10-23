import { Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type {
  ChallengeAgentDemo,
  ChallengeDemoElement,
} from '~/modules/challenge-page';

import { figureText, unbroken, visuallyHidden } from './challenge-figure';

type ElementOf<T extends ChallengeDemoElement['type']> = Extract<
  ChallengeDemoElement,
  { type: T }
>;

const smallText = text({ variant: 'small' });
const mutedText = text({ variant: 'small', color: 'muted' });

// Three tiles side by side only where the window is wide enough for a ten
// character value: from `sm`, where it fills the row, and from `xl`, where it
// sits in a half-width column. Elsewhere one row per figure.
const kpiList = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    sm: 'repeat(3, minmax(0, 1fr))',
    lg: '1fr',
    xl: 'repeat(3, minmax(0, 1fr))',
  },
  gap: '2.5',
});

const kpiTile = css({
  display: 'flex',
  flexDirection: { base: 'row', sm: 'column', lg: 'row', xl: 'column' },
  alignItems: {
    base: 'baseline',
    sm: 'flex-start',
    lg: 'baseline',
    xl: 'flex-start',
  },
  columnGap: '3',
  bg: 'gray.50',
  rounded: 'lg',
  // Room for a ten character value at `xl`.
  px: '3',
  py: '3',
});

function Kpis({ element }: { element: ElementOf<'kpis'> }) {
  return (
    // `list-style: none` drops list semantics in Safari.
    <ul role="list" className={kpiList}>
      {element.items.map((item, index) => (
        <li key={`${index}-${item.label}`} className={kpiTile}>
          <span className={cx(figureText, unbroken)}>{item.value}</span>{' '}
          <span className={mutedText}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Figure({ element }: { element: ElementOf<'figure'> }) {
  return (
    <p
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        columnGap: '3',
        bg: 'yellow.light',
        rounded: 'lg',
        px: '4',
        py: '3.5',
      })}
    >
      <span className={cx(figureText, unbroken)}>{element.value}</span>{' '}
      <span className={mutedText}>{element.caption}</span>
    </p>
  );
}

function Progress({ element }: { element: ElementOf<'progress'> }) {
  const { t } = useTranslation('challenges');
  const { percent, target } = element;
  // A target at 100% is the end of the bar: no marker, nothing to say.
  const hasTarget = target !== undefined && target < 100;

  return (
    <div
      role="progressbar"
      aria-label={t('aiBridge.progress')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={
        hasTarget
          ? t('aiBridge.progressTarget', { percent, target })
          : t('aiBridge.progressValue', { percent })
      }
      className={css({
        position: 'relative',
        h: '1.5',
        bg: 'gray.100',
        rounded: 'full',
      })}
    >
      <div
        className={css({ h: 'full', bgGradient: 'ai', rounded: 'full' })}
        // A data value: Panda cannot generate a class per percentage.
        style={{ width: `${percent}%` }}
      />
      {hasTarget ? (
        <span
          aria-hidden="true"
          className={css({
            position: 'absolute',
            top: '-0.5',
            bottom: '-0.5',
            w: '0.5',
            bg: 'dark',
            rounded: 'full',
          })}
          style={{ left: `${target}%` }}
        />
      ) : null}
    </div>
  );
}

const statusValueStyles = {
  ok: css({ color: 'dark' }),
  alert: css({ color: 'coral.dark' }),
};

const statusIcon = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  h: '4',
  w: '4',
  rounded: 'full',
});

const statusIconStyles = {
  ok: css({ bg: 'mint.light', color: 'mint.dark' }),
  alert: cx(
    text({ variant: 'label' }),
    // No tracking: it would push the glyph off centre.
    css({ bg: 'coral.light', color: 'coral.dark', letterSpacing: 'normal' }),
  ),
};

function Status({ element }: { element: ElementOf<'status'> }) {
  const { t } = useTranslation('challenges');
  const { label, value, state } = element;

  return (
    <p
      className={cx(
        smallText,
        css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '4',
          py: '2.5',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'line',
        }),
      )}
    >
      <span className={css({ color: 'gray' })}>{label}</span>{' '}
      <span
        className={cx(
          css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            fontWeight: 'semibold',
            textAlign: 'right',
          }),
          statusValueStyles[state],
        )}
      >
        {value}
        <span
          aria-hidden="true"
          className={cx(statusIcon, statusIconStyles[state])}
        >
          {state === 'ok' ? <Check size={10} strokeWidth={3} /> : '!'}
        </span>
        <span className={visuallyHidden}>
          {state === 'ok' ? t('aiBridge.statusOk') : t('aiBridge.statusAlert')}
        </span>
      </span>
    </p>
  );
}

const demoButton = cx(
  smallText,
  css({
    px: '3',
    py: '1.5',
    rounded: 'lg',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'line',
  }),
);

function Buttons({ element }: { element: ElementOf<'buttons'> }) {
  const last = element.labels.length - 1;

  return (
    // Pictures of buttons: the demo has nothing to click.
    <p className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
      {element.labels.map((label, index) => (
        <span
          key={`${index}-${label}`}
          className={cx(
            demoButton,
            index === last
              ? css({ bg: 'dark', color: 'white', borderColor: 'dark' })
              : css({ bg: 'white', color: 'dark' }),
          )}
        >
          {label}{' '}
        </span>
      ))}
    </p>
  );
}

function DemoElement({ element }: { element: ChallengeDemoElement }) {
  switch (element.type) {
    case 'kpis':
      return <Kpis element={element} />;
    case 'figure':
      return <Figure element={element} />;
    case 'progress':
      return <Progress element={element} />;
    case 'status':
      return <Status element={element} />;
    case 'buttons':
      return <Buttons element={element} />;
  }
}

const elementKey = (element: ChallengeDemoElement, index: number) =>
  `${element.type}-${index}`;

const barDot = css({ h: '2', w: '2', rounded: 'full' });

type AgentWindowProps = {
  demo: ChallengeAgentDemo;
  className?: string;
};

/**
 * A chat message from an Ocobo agent, drawn as an app window. Every
 * challenge's message fits the same height, so the block keeps one size; a
 * longer one grows the window instead of being cut. The footer sits at the
 * bottom.
 */
export function AgentWindow({ demo, className }: AgentWindowProps) {
  const { t } = useTranslation('challenges');
  const { channel, agent, time, opening, elements, footer } = demo;

  return (
    <div
      className={cx(
        css({
          display: 'flex',
          flexDirection: 'column',
          minH: { base: 'lg', sm: 'md' },
          overflow: 'hidden',
          bg: 'white',
          color: 'dark',
          rounded: '3xl',
          shadow: 'window',
        }),
        className,
      )}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '3',
          flexShrink: 0,
          h: '10',
          px: '4',
          bg: 'gray.50',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'line',
        })}
      >
        <span
          aria-hidden="true"
          className={css({ display: 'flex', gap: '1.5' })}
        >
          <span className={cx(barDot, css({ bg: 'coral' }))} />
          <span className={cx(barDot, css({ bg: 'yellow' }))} />
          <span className={cx(barDot, css({ bg: 'mint' }))} />
        </span>
        <span
          className={cx(smallText, css({ color: 'gray.700', truncate: true }))}
        >
          {channel}
        </span>
      </div>

      <div
        className={css({
          display: 'flex',
          gap: '3.5',
          flex: '1',
          minH: '0',
          px: { base: '5', md: '6' },
          pt: '6',
          pb: '5',
        })}
      >
        <span
          aria-hidden="true"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            h: '8',
            w: '8',
            rounded: 'lg',
            bgGradient: 'ai',
          })}
        >
          <Sparkles size={16} />
        </span>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5',
            flex: '1',
            minW: '0',
          })}
        >
          <p
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              gap: '2',
            })}
          >
            <span className={smallText}>{agent}</span>{' '}
            <time className={mutedText}>{time}</time>
          </p>
          {opening.kind === 'question' ? (
            <p
              className={cx(
                smallText,
                css({
                  alignSelf: 'flex-start',
                  bg: 'gray.100',
                  px: '3.5',
                  py: '2.5',
                  rounded: '2xl',
                  borderBottomLeftRadius: 'lg',
                }),
              )}
            >
              {t('aiBridge.question', {
                text: opening.text,
                interpolation: { escapeValue: false },
              })}
            </p>
          ) : (
            <p className={cx(smallText, css({ color: 'gray.700' }))}>
              {opening.text}
            </p>
          )}
          {elements.map((element, index) => (
            <DemoElement key={elementKey(element, index)} element={element} />
          ))}
          <p
            className={cx(
              smallText,
              css({
                display: 'inline-flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: '2',
                mt: 'auto',
                px: '3',
                py: '1.5',
                bg: 'mint.light',
                rounded: 'full',
              }),
            )}
          >
            <span
              aria-hidden="true"
              className={css({
                flexShrink: 0,
                h: '1.5',
                w: '1.5',
                bg: 'mint.dark',
                rounded: 'full',
              })}
            />
            {footer}
          </p>
        </div>
      </div>
    </div>
  );
}
