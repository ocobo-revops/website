import { Check, RefreshCw } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { Tooltip } from '~/components/ui/tooltip';
import {
  BOWTIE_NAMESPACE,
  MILESTONE_PREFIX_KEY,
  STAGE_IDS,
  type StageId,
  type StageWithState,
  getStageLabelKey,
  getStageStates,
} from '~/modules/bowtie-stages';

import {
  BOWTIE_VIEWBOX,
  FLOW_LINES,
  columnSlice,
  flowPath,
} from './bowtie-layout';

/** Challenge colours, keyed like the `challenge.<id>` tokens. */
export type BowtieChallenge = 'rp' | 'se' | 'sc' | 'cx' | 'sy' | 'ai';

type UnifiedBowtieProps = {
  /** Stages drawn at full strength. Every stage when omitted. */
  activeStages?: Iterable<StageId>;
  /** Tints the active stages and shows their KPI chips. Neutral when omitted. */
  challenge?: BowtieChallenge;
};

// One static class per challenge: Panda only ships literal values (CLAUDE.md,
// static analysis trap). Revenue AI's token is coral, the start of its
// gradient.
const flowStroke: Record<BowtieChallenge, string> = {
  rp: css({ stroke: 'challenge.rp' }),
  se: css({ stroke: 'challenge.se' }),
  sc: css({ stroke: 'challenge.sc' }),
  cx: css({ stroke: 'challenge.cx' }),
  sy: css({ stroke: 'challenge.sy' }),
  ai: css({ stroke: 'challenge.ai' }),
};

const tooltipAccent: Record<BowtieChallenge, string> = {
  rp: css({ borderTopColor: 'challenge.rp' }),
  se: css({ borderTopColor: 'challenge.se' }),
  sc: css({ borderTopColor: 'challenge.sc' }),
  cx: css({ borderTopColor: 'challenge.cx' }),
  sy: css({ borderTopColor: 'challenge.sy' }),
  ai: css({ borderTopColor: 'challenge.ai' }),
};

const knotRing: Record<BowtieChallenge, string> = {
  rp: css({ borderColor: 'challenge.rp' }),
  se: css({ borderColor: 'challenge.se' }),
  sc: css({ borderColor: 'challenge.sc' }),
  cx: css({ borderColor: 'challenge.cx' }),
  sy: css({ borderColor: 'challenge.sy' }),
  ai: css({ borderColor: 'challenge.ai' }),
};

// The chip text stays dark: the challenge shades fail contrast on white.
const chipBorder: Record<BowtieChallenge, string> = {
  rp: css({ borderColor: 'challenge.rp' }),
  se: css({ borderColor: 'challenge.se' }),
  sc: css({ borderColor: 'challenge.sc' }),
  cx: css({ borderColor: 'challenge.cx' }),
  sy: css({ borderColor: 'challenge.sy' }),
  ai: css({ borderColor: 'challenge.ai' }),
};

const chipDot: Record<BowtieChallenge, string> = {
  rp: css({ bg: 'challenge.rp' }),
  se: css({ bg: 'challenge.se' }),
  sc: css({ bg: 'challenge.sc' }),
  cx: css({ bg: 'challenge.cx' }),
  sy: css({ bg: 'challenge.sy' }),
  ai: css({ bg: 'challenge.ai' }),
};

const tooltipAccentBorder = css({ borderTopWidth: '4px' });
// An inactive stage keeps the muted grey, like its lines.
const tooltipAccentInactive = css({ borderTopColor: 'gray' });

const VIEWBOX = `0 0 ${BOWTIE_VIEWBOX.width} ${BOWTIE_VIEWBOX.height}`;

const stageGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
});

const flowSvg = css({ position: 'absolute', top: '0', h: 'full' });

const centreLine = css({
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '[50%]',
  borderLeftWidth: '1px',
  borderLeftStyle: 'dashed',
});
const centreLineState = {
  active: css({ borderLeftColor: 'gray.300' }),
  inactive: css({ borderLeftColor: 'gray.100' }),
};

const stageTrigger = css({
  display: 'flex',
  justifyContent: 'center',
  w: 'full',
  h: 'full',
  pt: '52',
  pb: '1',
  px: '1',
  rounded: 'lg',
  bg: 'transparent',
  textAlign: 'center',
});

const stageLabel = cx(
  text({ variant: 'label' }),
  css({ letterSpacing: 'chip', fontWeight: 'bold' }),
);
const labelState = {
  active: css({ color: 'gray.600' }),
  emphasis: css({ color: 'dark' }),
  inactive: css({ color: 'gray' }),
};

const chip = cx(
  text({ variant: 'small' }),
  css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1.5',
    px: '2.5',
    py: '1',
    bg: 'white',
    borderWidth: '1px',
    borderStyle: 'solid',
    rounded: 'full',
    color: 'dark',
    whiteSpace: 'nowrap',
  }),
);

const kpiContent = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});
const kpiLabel = css({ color: 'white/75' });
const kpiTitle = cx(
  text({ variant: 'body', color: 'white' }),
  css({ fontWeight: 'bold' }),
);

const centred = css({
  position: 'absolute',
  top: '[50%]',
  left: '[50%]',
  transform: 'translate(-50%, -50%)',
});

// Without a challenge every active stage is emphasised the same way, except
// the closing knot; with one, every active stage is.
function labelClass(stage: StageWithState, challenge?: BowtieChallenge) {
  if (stage.state === 'inactive') return labelState.inactive;
  if (challenge || stage.id === 'closing') return labelState.emphasis;
  return labelState.active;
}

/**
 * The revenue bow tie: flow lines converge on the closing knot, then fan out
 * again, over the seven stages of the model. Active stages carry the colour,
 * inactive ones keep the grey lines. Each stage label opens a tooltip with
 * its KPI and Milestone, on hover, keyboard focus and tap. With a challenge,
 * KPI chips sit under the active stages.
 */
export const UnifiedBowtie = ({
  activeStages = STAGE_IDS,
  challenge,
}: UnifiedBowtieProps) => {
  const { t } = useTranslation(BOWTIE_NAMESPACE);
  // Unique per instance: several bow ties can share a page.
  const gradientId = `${useId()}flow`;
  const stages = getStageStates(activeStages);
  const label = (id: StageId) => t(getStageLabelKey(id, 'label'));
  const paths = FLOW_LINES.map(flowPath);

  return (
    <div
      role="group"
      aria-label={t('title')}
      className={css({
        position: 'relative',
        w: 'full',
        maxW: '7xl',
        mx: 'auto',
        py: '12',
        px: '4',
        display: { base: 'none', md: 'block' },
      })}
    >
      <div className={css({ position: 'relative' })}>
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            h: '48',
          })}
        >
          <svg
            viewBox={VIEWBOX}
            preserveAspectRatio="none"
            fill="none"
            className={css({
              position: 'absolute',
              inset: '0',
              w: 'full',
              h: 'full',
              stroke: 'line',
            })}
          >
            <defs>
              <linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2={BOWTIE_VIEWBOX.width}
                y2="0"
              >
                <stop offset="0%" stopColor="var(--colors-mint)" />
                <stop offset="35%" stopColor="var(--colors-coral)" />
                <stop offset="65%" stopColor="var(--colors-yellow)" />
                <stop offset="100%" stopColor="var(--colors-sky)" />
              </linearGradient>
            </defs>
            {paths.map((d) => (
              <path
                key={d}
                d={d}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div
            className={cx(stageGrid, css({ position: 'absolute', inset: '0' }))}
          >
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                data-stage-column={stage.id}
                data-state={stage.state}
                className={css({ position: 'relative', overflow: 'hidden' })}
              >
                <span
                  className={cx(centreLine, centreLineState[stage.state])}
                />
                {stage.state === 'active' && (
                  <svg
                    data-stage-tint={challenge ?? 'neutral'}
                    viewBox={VIEWBOX}
                    preserveAspectRatio="none"
                    fill="none"
                    className={cx(flowSvg, challenge && flowStroke[challenge])}
                    style={columnSlice(index, stages.length)}
                    stroke={challenge ? undefined : `url(#${gradientId})`}
                  >
                    {paths.map((d) => (
                      <path
                        key={d}
                        d={d}
                        strokeWidth="2"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </svg>
                )}
              </div>
            ))}
          </div>

          {challenge ? (
            <span
              className={cx(
                centred,
                css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  h: '14',
                  w: '14',
                  rounded: 'full',
                  bg: 'dark',
                  color: 'white',
                }),
              )}
            >
              <span
                className={cx(
                  knotRing[challenge],
                  css({
                    position: 'absolute',
                    inset: '-1.5',
                    rounded: 'full',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    animation: 'pulse',
                    _motionReduce: { animation: '[none]' },
                  }),
                )}
              />
              <Check className={css({ h: '6', w: '6' })} strokeWidth={3} />
            </span>
          ) : (
            <span
              className={cx(
                centred,
                css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  h: '10',
                  w: '10',
                  rounded: 'full',
                  bg: 'dark',
                  borderWidth: '6px',
                  borderStyle: 'solid',
                  borderColor: 'white',
                  boxSizing: 'content-box',
                }),
              )}
            >
              <span
                className={css({
                  h: '3',
                  w: '3',
                  rounded: 'full',
                  bgGradient: 'ai',
                })}
              />
            </span>
          )}

          {/* The expansion loop feeds revenue back into the bow tie. */}
          <span
            className={css({
              position: 'absolute',
              top: '[50%]',
              left: '[85.714%]',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              h: '6',
              w: '6',
              rounded: 'full',
              bg: 'white',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'line',
              color: 'gray',
            })}
          >
            <RefreshCw className={css({ h: '3', w: '3' })} />
          </span>
        </div>

        <ul className={cx(stageGrid, css({ position: 'relative' }))}>
          {stages.map((stage) => (
            <li key={stage.id}>
              <Tooltip
                className={
                  challenge
                    ? cx(
                        tooltipAccentBorder,
                        stage.state === 'active'
                          ? tooltipAccent[challenge]
                          : tooltipAccentInactive,
                      )
                    : undefined
                }
                asChild
                content={
                  <span className={kpiContent} data-stage-kpi={stage.id}>
                    <span className={kpiLabel}>
                      {t(MILESTONE_PREFIX_KEY)} ·{' '}
                      {t(getStageLabelKey(stage.id, 'milestone'))}
                    </span>
                    <span className={kpiTitle}>
                      {t(getStageLabelKey(stage.id, 'kpiTitle'))}
                    </span>
                    <span>{t(getStageLabelKey(stage.id, 'description'))}</span>
                  </span>
                }
              >
                <button
                  type="button"
                  data-stage-trigger={stage.id}
                  className={stageTrigger}
                >
                  <span
                    className={cx(stageLabel, labelClass(stage, challenge))}
                  >
                    {label(stage.id)}
                  </span>
                  {stage.state === 'inactive' && (
                    <span className={css({ srOnly: true })}>
                      , {t('inactive')}
                    </span>
                  )}
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>

      {challenge && (
        <ul className={cx(stageGrid, css({ mt: '3' }))}>
          {stages.map((stage) => (
            <li
              key={stage.id}
              aria-hidden={stage.state === 'active' ? undefined : true}
              className={css({ display: 'flex', justifyContent: 'center' })}
            >
              {stage.state === 'active' && (
                <span
                  data-stage-chip={stage.id}
                  className={cx(chip, chipBorder[challenge])}
                >
                  <span
                    className={cx(
                      css({ h: '1.5', w: '1.5', rounded: 'full' }),
                      chipDot[challenge],
                    )}
                  />
                  <span className={css({ srOnly: true })}>
                    {label(stage.id)},{' '}
                  </span>
                  {t(getStageLabelKey(stage.id, 'kpiShort'))}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
