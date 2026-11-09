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

type AgentKey = keyof typeof STEP_DOTS;

const windowFrame = css({
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  minH: '64',
  overflow: 'hidden',
  bg: 'white',
  color: 'dark',
  rounded: '2xl',
  boxShadow: 'window',
});

const titleBar = cx(
  text({ variant: 'small', color: 'muted' }),
  css({
    display: 'flex',
    alignItems: 'center',
    gap: '1.5',
    h: '8',
    px: '3',
    flexShrink: '0',
    borderBottomWidth: '1px',
    borderColor: 'line',
    fontSize: 'xs',
  }),
);

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

const small = text({ variant: 'small' });
const muted = text({ variant: 'small', color: 'muted' });

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"
      />
    </svg>
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
      className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
    >
      <div className={windowFrame}>
        <div className={titleBar}>
          <span
            aria-hidden="true"
            className={cx(trafficDot, css({ bg: 'coral' }))}
          />
          <span
            aria-hidden="true"
            className={cx(trafficDot, css({ bg: 'yellow' }))}
          />
          <span
            aria-hidden="true"
            className={cx(trafficDot, css({ bg: 'mint' }))}
          />
          <span className={css({ ml: '2' })}>
            {t(`ai.agents.${agent}.window`)}
          </span>
        </div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '3',
            p: '4',
            flex: '1',
            minH: '0',
          })}
        >
          <div
            className={css({
              display: 'flex',
              gap: '2.5',
              alignItems: 'center',
            })}
          >
            <span className={avatar}>
              <Sparkle />
            </span>
            <div className={css({ minW: '0' })}>
              <p className={cx(small, css({ fontWeight: 'bold' }))}>
                {t(`ai.agents.${agent}.heading`)}
              </p>
              <p className={cx(muted, css({ fontSize: 'xs' }))}>
                {t(`ai.agents.${agent}.meta`)}
              </p>
            </div>
          </div>
          {children}
        </div>
      </div>
      <div>
        <p
          className={cx(
            text({ variant: 'label', color: 'white' }),
            css({ display: 'flex', alignItems: 'center', gap: '2', mb: '1' }),
          )}
        >
          <span
            aria-hidden="true"
            className={cx(trafficDot, STEP_DOTS[agent])}
          />
          {t(`ai.agents.${agent}.step`)}
        </p>
        <p
          className={cx(
            text({ variant: 'small', color: 'white' }),
            css({ fontWeight: 'bold' }),
          )}
        >
          {t(`ai.agents.${agent}.caption`)}
        </p>
      </div>
    </Reveal>
  );
}

const list = css({ display: 'flex', flexDirection: 'column', gap: '2.5' });

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
        gap: '6',
      })}
    >
      <AgentWindow agent="prospecting">
        <ul className={list}>
          {accounts.map((account, index) => (
            <li key={account.name}>
              <p className={cx(small, css({ fontWeight: 'semibold' }))}>
                {account.name}
              </p>
              <p className={cx(muted, css({ fontSize: 'xs', mb: '1' }))}>
                {account.signal}
              </p>
              <div
                className={css({ h: '1', rounded: 'full', bg: 'gray.light' })}
              >
                <div
                  className={cx(
                    css({ h: 'full', rounded: 'full', bgGradient: 'ai' }),
                    SCORES[index],
                  )}
                />
              </div>
            </li>
          ))}
        </ul>
      </AgentWindow>

      <AgentWindow agent="crm">
        <dl className={list}>
          {fields.map((field) => (
            <div
              key={field.name}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
              })}
            >
              <dt
                className={cx(
                  muted,
                  css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2',
                    fontSize: 'xs',
                  }),
                )}
              >
                <span
                  aria-hidden="true"
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0',
                    w: '4',
                    h: '4',
                    rounded: 'full',
                    bg: 'mint',
                  })}
                >
                  <Check size={10} strokeWidth={3} />
                </span>
                {field.name}
              </dt>
              <dd
                className={cx(
                  small,
                  css({
                    ml: 'auto',
                    fontWeight: 'semibold',
                    textAlign: 'right',
                  }),
                )}
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </AgentWindow>

      <AgentWindow agent="brief">
        <ul className={cx(list, css({ listStyleType: 'disc', pl: '4' }))}>
          {points.map((point) => (
            <li key={point.name} className={small}>
              <strong>{point.name}</strong> {point.value}
            </li>
          ))}
        </ul>
      </AgentWindow>

      <AgentWindow agent="insight">
        <p className={small}>{t('ai.agents.insight.message')}</p>
        <div className={css({ display: 'flex', gap: '2', mt: 'auto' })}>
          {actions.map((action, index) => (
            <span
              key={action}
              className={cx(
                text({ variant: 'small' }),
                css({
                  px: '3',
                  py: '1',
                  rounded: 'lg',
                  borderWidth: '1px',
                  borderColor: 'line',
                  fontSize: 'xs',
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
      </AgentWindow>
    </div>
  );
}
