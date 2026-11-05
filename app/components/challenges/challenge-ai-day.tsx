import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { type TabItem, Tabs } from '~/components/ui/tabs';

import { AgentWindow, type AgentWindowDemo } from './agent-window';

/** Time each moment stays selected during autoplay, in milliseconds. */
const INTERVAL = 6000;

type Colour = 'mint' | 'coral' | 'sky' | 'yellow';

// One static class per colour: Panda keeps only literal values.
const dotStyles: Record<Colour, string> = {
  mint: css({ bg: 'mint' }),
  coral: css({ bg: 'coral' }),
  sky: css({ bg: 'sky' }),
  yellow: css({ bg: 'yellow' }),
};

type Moment = {
  key: 'step1' | 'step2' | 'step3' | 'step4';
  time: string;
  colour: Colour;
  demo: (t: TFunction<'challenges'>) => AgentWindowDemo;
};

// The structure of each scene lives here; its words live in the locales.
const MOMENTS: readonly Moment[] = [
  {
    key: 'step1',
    time: '08:30',
    colour: 'mint',
    demo: (t) => ({
      channel: t('aiDay.step1.channel'),
      agent: t('aiDay.step1.agent'),
      time: '08:30',
      clock: '08:30',
      opening: { kind: 'statement', text: t('aiDay.step1.text') },
      elements: [
        {
          type: 'accounts',
          items: [
            {
              name: t('aiDay.step1.account1.name'),
              signal: t('aiDay.step1.account1.signal'),
              score: 94,
            },
            {
              name: t('aiDay.step1.account2.name'),
              signal: t('aiDay.step1.account2.signal'),
              score: 86,
            },
            {
              name: t('aiDay.step1.account3.name'),
              signal: t('aiDay.step1.account3.signal'),
              score: 68,
            },
          ],
        },
      ],
      footer: t('aiDay.step1.footer'),
    }),
  },
  {
    key: 'step2',
    time: '09:45',
    colour: 'coral',
    demo: (t) => ({
      channel: t('aiDay.step2.channel'),
      agent: t('aiDay.step2.agent'),
      time: '09:45',
      clock: '09:45',
      opening: {
        kind: 'statement',
        lead: t('aiDay.step2.lead'),
        text: t('aiDay.step2.text'),
      },
      elements: [
        {
          type: 'bullets',
          items: (['bullet1', 'bullet2', 'bullet3'] as const).map((key) => ({
            label: t(`aiDay.step2.${key}.label`),
            text: t(`aiDay.step2.${key}.text`),
          })),
        },
      ],
      footer: t('aiDay.step2.footer'),
    }),
  },
  {
    key: 'step3',
    time: '11:10',
    colour: 'sky',
    demo: (t) => ({
      channel: t('aiDay.step3.channel'),
      agent: t('aiDay.step3.agent'),
      time: '11:10',
      clock: '11:10',
      opening: { kind: 'statement', text: t('aiDay.step3.text') },
      elements: (['row1', 'row2', 'row3', 'row4'] as const).map((key) => ({
        type: 'status' as const,
        label: t(`aiDay.step3.${key}.label`),
        value: t(`aiDay.step3.${key}.value`),
        state: 'ok' as const,
      })),
      footer: t('aiDay.step3.footer'),
    }),
  },
  {
    key: 'step4',
    time: '17:30',
    colour: 'yellow',
    demo: (t) => ({
      channel: t('aiDay.step4.channel'),
      agent: t('aiDay.step4.agent'),
      time: '17:30',
      clock: '17:30',
      opening: {
        kind: 'statement',
        lead: t('aiDay.step4.lead'),
        text: t('aiDay.step4.text'),
      },
      elements: [
        {
          type: 'kpis',
          items: (['kpi1', 'kpi2', 'kpi3'] as const).map((key) => ({
            value: t(`aiDay.step4.${key}.value`),
            label: t(`aiDay.step4.${key}.label`),
          })),
        },
        {
          type: 'buttons',
          labels: [t('aiDay.step4.button1'), t('aiDay.step4.button2')],
        },
      ],
      footer: t('aiDay.step4.footer'),
    }),
  },
];

function MomentLabel({
  moment,
  t,
}: {
  moment: Moment;
  t: TFunction<'challenges'>;
}) {
  return (
    <span
      className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}
    >
      <span
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2',
        })}
      >
        <time className={css({ fontVariantNumeric: 'tabular-nums' })}>
          {moment.time}
        </time>
        <span
          aria-hidden="true"
          className={cx(
            css({ h: '2', w: '2', rounded: 'full', flexShrink: 0 }),
            dotStyles[moment.colour],
          )}
        />
        {/* The tab sets the colour, per tone and state. */}
        <span
          className={cx(
            text({ variant: 'label' }),
            css({ color: '[inherit]' }),
          )}
        >
          {t(`aiDay.${moment.key}.label`)}
        </span>
      </span>
      <span
        className={css({
          srOnly: { base: true, md: false },
          fontWeight: 'semibold',
        })}
      >
        {t(`aiDay.${moment.key}.title`)}
      </span>
    </span>
  );
}

/**
 * "Une journée de commercial": four moments of a sales day, each with the
 * message an agent posts. The tabs move on by themselves, pause from their
 * own button, and hold still under reduced motion.
 */
export function ChallengeAiDay() {
  const { t } = useTranslation('challenges');

  const items: TabItem[] = MOMENTS.map((moment) => {
    const demo = moment.demo(t);
    return {
      value: moment.key,
      label: <MomentLabel moment={moment} t={t} />,
      content: (
        <figure
          aria-label={t('aiBridge.windowLabel', {
            agent: demo.agent,
            interpolation: { escapeValue: false },
          })}
        >
          <AgentWindow demo={demo} />
        </figure>
      ),
    };
  });

  return (
    <section
      id="production"
      className={cx(
        section({ bg: 'dark' }),
        css({ position: 'relative', overflow: 'hidden' }),
      )}
    >
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          inset: '0',
          backgroundImage:
            '[radial-gradient(rgba(255,255,255,0.11) 1px, transparent 1.2px)]',
          backgroundSize: '[22px 22px]',
          maskImage:
            '[radial-gradient(ellipse at center, black, transparent 75%)]',
        })}
      />
      <Container className={css({ position: 'relative' })}>
        <div className={css({ maxW: '3xl', mb: { base: '10', lg: '14' } })}>
          <span
            className={cx(
              badge({ variant: 'ai', size: 'sm' }),
              css({ mb: '6' }),
            )}
          >
            {t('aiDay.eyebrow')}
          </span>
          <h2
            className={cx(
              text({ variant: 'display-lg', color: 'white' }),
              css({ mb: '6' }),
            )}
          >
            {t('aiDay.title')}
          </h2>
          <p
            className={cx(
              text({ variant: 'body' }),
              css({ color: 'white/70' }),
            )}
          >
            {t('aiDay.lead')}
          </p>
        </div>
        <Tabs
          items={items}
          label={t('aiDay.tabsLabel')}
          orientation="vertical"
          tone="dark"
          autoplay
          interval={INTERVAL}
        />
      </Container>
    </section>
  );
}
