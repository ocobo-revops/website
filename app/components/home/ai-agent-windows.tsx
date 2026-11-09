import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { Reveal } from '~/components/ui/reveal';

type Account = { name: string; signal: string };
type Pair = { name: string; value: string };

// The prospecting scores of the mockup, best account first.
const SCORES = [
  css({ w: '[92%]' }),
  css({ w: '[84%]' }),
  css({ w: '[68%]' }),
] as const;

const STEP_DOTS = {
  prospecting: css({ bg: 'mint' }),
  crm: css({ bg: 'sky' }),
  brief: css({ bg: 'coral' }),
  insight: css({ bg: 'yellow' }),
} as const;

const STEP_LABELS = {
  prospecting: css({ color: 'mint' }),
  crm: css({ color: 'sky' }),
  brief: css({ color: 'coral' }),
  insight: css({ color: 'yellow' }),
} as const;

type AgentKey = keyof typeof STEP_DOTS;

// The windows draw a small app UI: the mockup sets them at 11 to 12px, under
// the six v2 sizes, so they use the `xs` and `label` font sizes.
const windowFrame = css({
  display: 'flex',
  flexDirection: 'column',
  // The mockup gives every window the same 250px height.
  h: '64',
  overflow: 'hidden',
  bg: 'white',
  color: 'dark',
  rounded: '2xl',
  boxShadow: 'window',
  fontSize: 'xs',
  lineHeight: 'snug',
  transitionProperty: 'common',
  transitionDuration: 'slow',
  _groupHover: { transform: 'translateY(-4px)' },
  _motionReduce: { _groupHover: { transform: 'none' } },
});

const titleBar = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2.5',
  h: '8',
  px: '2.5',
  flexShrink: '0',
  bg: 'gray.50',
  borderBottomWidth: '1px',
  borderColor: 'line',
  fontWeight: 'semibold',
  color: 'gray.700',
});

const trafficDot = css({ w: '2', h: '2', rounded: 'full' });

const avatar = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
  w: '7',
  h: '7',
  rounded: 'lg',
  bgGradient: 'ai',
  color: 'dark',
});

const strong = css({ display: 'block', fontWeight: 'semibold' });
const meta = css({
  display: 'block',
  fontSize: 'label',
  fontWeight: 'medium',
  color: 'gray.400',
});

// Each list row sits under a hairline, as in the mockup.
const divided = css({ borderTopWidth: '1px', borderColor: 'gray.100' });

function Sparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.9 5.8L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.2z" />
    </svg>
  );
}

function AgentHeader({ agent }: { agent: AgentKey }) {
  const { t } = useTranslation('home');
  return (
    <div className={css({ display: 'flex', gap: '2.5', alignItems: 'center' })}>
      <span className={avatar}>
        <Sparkle />
      </span>
      <span className={css({ minW: '0' })}>
        <b className={strong}>{t(`ai.agents.${agent}.heading`)}</b>
        <small className={meta}>{t(`ai.agents.${agent}.meta`)}</small>
      </span>
    </div>
  );
}

function AgentWindow({
  agent,
  children,
}: {
  agent: AgentKey;
  children: ReactNode;
}) {
  const { t } = useTranslation('home');
  return (
    <Reveal
      className={cx(
        'group',
        css({ display: 'flex', flexDirection: 'column', gap: '4' }),
      )}
    >
      <div className={windowFrame}>
        <div className={titleBar}>
          <span
            aria-hidden="true"
            className={css({ display: 'flex', gap: '1' })}
          >
            <span className={cx(trafficDot, css({ bg: 'coral' }))} />
            <span className={cx(trafficDot, css({ bg: 'yellow' }))} />
            <span className={cx(trafficDot, css({ bg: 'mint' }))} />
          </span>
          <span>{t(`ai.agents.${agent}.window`)}</span>
        </div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '2',
            px: '3.5',
            py: '3',
            flex: '1',
            minH: '0',
          })}
        >
          {children}
        </div>
      </div>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5',
          px: '1',
        })}
      >
        <p
          className={cx(
            text({ variant: 'label' }),
            css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2',
              mt: '0',
              letterSpacing: 'tag',
            }),
            STEP_LABELS[agent],
          )}
        >
          <span
            aria-hidden="true"
            className={cx(trafficDot, STEP_DOTS[agent])}
          />
          {t(`ai.agents.${agent}.step`)}
        </p>
        {/* Bermia at 17px in the mockup: the display face, at the nearest size. */}
        <p
          className={cx(
            text({ variant: 'display-lg', color: 'white' }),
            css({
              fontSize: 'lg',
              mt: '0',
              lineHeight: 'tight',
              letterSpacing: 'normal',
            }),
          )}
        >
          {t(`ai.agents.${agent}.caption`)}
        </p>
      </div>
    </Reveal>
  );
}

/** The four agents of the mockup, each drawn as a small app window. */
export function AiAgentWindows() {
  const { t } = useTranslation('home');
  const accounts = t('ai.agents.prospecting.accounts', {
    returnObjects: true,
  }) as Account[];
  const fields = t('ai.agents.crm.fields', { returnObjects: true }) as Pair[];
  const points = t('ai.agents.brief.points', { returnObjects: true }) as Pair[];
  const actions = t('ai.agents.insight.actions', {
    returnObjects: true,
  }) as string[];

  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: {
          base: 'minmax(0, 1fr)',
          md: 'repeat(2, minmax(0, 1fr))',
          xl: 'repeat(4, minmax(0, 1fr))',
        },
        gap: '5',
      })}
    >
      <AgentWindow agent="prospecting">
        <AgentHeader agent="prospecting" />
        <ul>
          {accounts.map((account, index) => (
            <li
              key={account.name}
              className={cx(
                divided,
                css({
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) 54px',
                  columnGap: '2.5',
                  rowGap: '0.5',
                  alignItems: 'center',
                  py: '1.5',
                }),
              )}
            >
              <b className={css({ fontWeight: 'semibold' })}>{account.name}</b>
              <span
                aria-hidden="true"
                className={css({
                  gridRow: '1 / 3',
                  gridColumn: '2',
                  h: '1',
                  rounded: 'full',
                  bg: 'gray.100',
                  overflow: 'hidden',
                })}
              >
                <span
                  className={cx(
                    css({
                      display: 'block',
                      h: 'full',
                      rounded: 'full',
                      bgGradient: 'ai',
                    }),
                    SCORES[index],
                  )}
                />
              </span>
              <small className={cx(meta, css({ gridColumn: '1' }))}>
                {account.signal}
              </small>
            </li>
          ))}
        </ul>
      </AgentWindow>

      <AgentWindow agent="crm">
        <AgentHeader agent="crm" />
        <dl>
          {fields.map((field) => (
            <div
              key={field.name}
              className={cx(
                divided,
                css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '2.5',
                  py: '1.5',
                }),
              )}
            >
              <dt className={css({ color: 'gray' })}>{field.name}</dt>
              <dd
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1.5',
                  fontWeight: 'semibold',
                  textAlign: 'right',
                })}
              >
                {field.value}
                <span
                  aria-hidden="true"
                  className={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0',
                    w: '4',
                    h: '4',
                    rounded: 'full',
                    bg: 'mint.light',
                    color: 'mint.dark',
                  })}
                >
                  <Check size={10} strokeWidth={3} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </AgentWindow>

      <AgentWindow agent="brief">
        <AgentHeader agent="brief" />
        <ul
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5',
            listStyleType: 'disc',
            pl: '4',
            color: 'gray.700',
          })}
        >
          {points.map((point) => (
            <li key={point.name}>
              <b className={css({ fontWeight: 'semibold', color: 'dark' })}>
                {point.name}
              </b>{' '}
              {point.value}
            </li>
          ))}
        </ul>
      </AgentWindow>

      <AgentWindow agent="insight">
        <div
          className={css({ display: 'flex', gap: '2.5', alignItems: 'start' })}
        >
          <span className={avatar}>
            <Sparkle />
          </span>
          <div className={css({ minW: '0' })}>
            <p className={css({ fontWeight: 'semibold' })}>
              {t('ai.agents.insight.heading')}{' '}
              <small
                className={css({
                  ml: '0.5',
                  fontSize: 'label',
                  fontWeight: 'medium',
                  color: 'gray.400',
                })}
              >
                {t('ai.agents.insight.meta')}
              </small>
            </p>
            <p className={css({ mt: '1', color: 'gray.700' })}>
              {t('ai.agents.insight.message')}
            </p>
            <div className={css({ display: 'flex', gap: '1.5', mt: '2' })}>
              {actions.map((action, index) => (
                <span
                  key={action}
                  className={cx(
                    css({
                      px: '2',
                      py: '1',
                      rounded: 'lg',
                      borderWidth: '1px',
                      borderColor: 'line',
                      bg: 'white',
                      fontSize: 'label',
                      fontWeight: 'semibold',
                    }),
                    index === actions.length - 1
                      ? css({ bg: 'dark', color: 'white', borderColor: 'dark' })
                      : undefined,
                  )}
                >
                  {action}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AgentWindow>
    </div>
  );
}
