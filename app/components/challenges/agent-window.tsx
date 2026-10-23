import { Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type {
  ChallengeAgentDemo,
  ChallengeDemoElement,
} from '~/modules/challenge-page';

type ElementOf<T extends ChallengeDemoElement['type']> = Extract<
  ChallengeDemoElement,
  { type: T }
>;

// Bermia figures below H2 size: the H2 variant at a smaller size.
const figureText = text({ variant: 'display-lg' });

const visuallyHidden = css({ srOnly: true });

function Kpis({ element }: { element: ElementOf<'kpis'> }) {
  return (
    <ul
      // `list-style: none` drops list semantics in Safari.
      role="list"
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '2.5',
      })}
    >
      {element.items.map((item, index) => (
        <li
          key={`${index}-${item.label}`}
          className={css({
            bg: 'gray.50',
            rounded: 'lg',
            px: { base: '2.5', sm: '3.5' },
            py: '3',
            overflowWrap: 'anywhere',
          })}
        >
          <span
            className={cx(
              figureText,
              css({ display: 'block', fontSize: 'xl' }),
            )}
          >
            {item.value}
          </span>{' '}
          <span
            className={css({ display: 'block', fontSize: 'xs', color: 'gray' })}
          >
            {item.label}
          </span>
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
      <span className={cx(figureText, css({ fontSize: '3xl' }))}>
        {element.value}
      </span>{' '}
      <span className={css({ fontSize: 'caption', color: 'gray' })}>
        {element.caption}
      </span>
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
  alert: css({
    bg: 'coral.light',
    color: 'coral.dark',
    fontSize: 'micro',
    fontWeight: 'bold',
  }),
};

function Status({ element }: { element: ElementOf<'status'> }) {
  const { t } = useTranslation('challenges');
  const { label, value, state } = element;

  return (
    <p
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '4',
        py: '2.5',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'line',
        fontSize: 'sm',
      })}
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

const demoButton = css({
  px: '3',
  py: '1.5',
  rounded: 'lg',
  fontSize: 'caption',
  fontWeight: 'semibold',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'line',
});

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
          className={css({
            fontSize: 'xs',
            fontWeight: 'semibold',
            color: 'gray.700',
            truncate: true,
          })}
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
            <span className={css({ fontSize: 'sm', fontWeight: 'semibold' })}>
              {agent}
            </span>{' '}
            <time className={css({ fontSize: 'xs', color: 'gray' })}>
              {time}
            </time>
          </p>
          {opening.kind === 'question' ? (
            <p
              className={css({
                alignSelf: 'flex-start',
                bg: 'gray.100',
                px: '3.5',
                py: '2.5',
                rounded: '2xl',
                borderBottomLeftRadius: 'lg',
                fontSize: 'sm',
                fontWeight: 'semibold',
              })}
            >
              {t('aiBridge.question', {
                text: opening.text,
                interpolation: { escapeValue: false },
              })}
            </p>
          ) : (
            <p className={css({ fontSize: 'sm', color: 'gray.700' })}>
              {opening.text}
            </p>
          )}
          {elements.map((element, index) => (
            <DemoElement key={elementKey(element, index)} element={element} />
          ))}
          <p
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              gap: '2',
              mt: 'auto',
              px: '3',
              py: '1.5',
              bg: 'mint.light',
              rounded: 'full',
              fontSize: 'xs',
              fontWeight: 'semibold',
            })}
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
