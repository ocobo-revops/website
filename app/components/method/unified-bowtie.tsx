import { Check, RefreshCw } from 'lucide-react';
import { type CSSProperties, useId } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { Tooltip } from '~/components/ui/tooltip';
import { useInView } from '~/hooks/use-in-view';
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
// static analysis trap). The root sets the palette, and every challenge colour
// below reads it as `colorPalette`. Revenue AI's token is coral, the start of
// its gradient.
const challengePalette: Record<BowtieChallenge, string> = {
  rp: css({ colorPalette: 'challenge.rp' }),
  se: css({ colorPalette: 'challenge.se' }),
  sc: css({ colorPalette: 'challenge.sc' }),
  cx: css({ colorPalette: 'challenge.cx' }),
  sy: css({ colorPalette: 'challenge.sy' }),
  ai: css({ colorPalette: 'challenge.ai' }),
};

const flowStroke = css({ stroke: 'colorPalette' });

// Revenue Systems spans the whole cycle, so its flow takes the colour of each
// phase, as in the prototype: mint to acquire, yellow to close, sky to retain.
// Revenue AI's flow takes the `gradients.ai` stops instead (an SVG stroke
// cannot use a CSS gradient), set as an attribute below.
const flowStrokeClass: Record<BowtieChallenge, string | undefined> = {
  rp: flowStroke,
  se: flowStroke,
  sc: flowStroke,
  cx: flowStroke,
  sy: undefined,
  ai: undefined,
};

type PhaseTone = 'acquire' | 'close' | 'retain';

const stagePhase: Record<StageId, PhaseTone> = {
  'demand-generation': 'acquire',
  discovery: 'acquire',
  negotiation: 'acquire',
  closing: 'close',
  onboarding: 'retain',
  adoption: 'retain',
  expansion: 'retain',
};

// Static literals per phase (CLAUDE.md, static analysis trap).
const phaseStroke: Record<PhaseTone, string> = {
  acquire: css({ stroke: 'mint' }),
  close: css({ stroke: 'yellow' }),
  retain: css({ stroke: 'sky' }),
};
const phaseBorder: Record<PhaseTone, string> = {
  acquire: css({ borderColor: 'mint' }),
  close: css({ borderColor: 'yellow' }),
  retain: css({ borderColor: 'sky' }),
};
const phaseDot: Record<PhaseTone, string> = {
  acquire: css({ bg: 'mint' }),
  close: css({ bg: 'yellow' }),
  retain: css({ bg: 'sky' }),
};
const phaseAccent: Record<PhaseTone, string> = {
  acquire: css({ borderTopWidth: '4px', borderTopColor: 'mint' }),
  close: css({ borderTopWidth: '4px', borderTopColor: 'yellow' }),
  retain: css({ borderTopWidth: '4px', borderTopColor: 'sky' }),
};

function stageStrokeClass(challenge: BowtieChallenge | undefined, id: StageId) {
  if (!challenge) return undefined;
  return challenge === 'sy'
    ? phaseStroke[stagePhase[id]]
    : flowStrokeClass[challenge];
}

function flowStrokeUrl(
  challenge: BowtieChallenge | undefined,
  neutralId: string,
  aiId: string,
) {
  if (!challenge) return `url(#${neutralId})`;
  return challenge === 'ai' ? `url(#${aiId})` : undefined;
}
const paletteBorder = css({ borderColor: 'colorPalette' });
const paletteDot = css({ bg: 'colorPalette' });

function chipBorder(challenge: BowtieChallenge, id: StageId) {
  return challenge === 'sy' ? phaseBorder[stagePhase[id]] : paletteBorder;
}
function chipDot(challenge: BowtieChallenge, id: StageId) {
  return challenge === 'sy' ? phaseDot[stagePhase[id]] : paletteDot;
}

// Before the reveal, the active lines wait hidden; then each column uncovers
// them in turn, left to right, so the flow reads as one stroke.
const drawState = {
  waiting: css({ clipPath: 'inset(0 100% 0 0)' }),
  drawing: css({
    animation: 'bowtie-draw',
    _motionReduce: { animation: '[none]' },
  }),
};
const DRAW_START_S = 0.2;
const DRAW_STEP_S = 0.32;

function drawDelay(index: number): CSSProperties {
  return { animationDelay: `${DRAW_START_S + index * DRAW_STEP_S}s` };
}

const tooltipAccent = css({
  borderTopWidth: '4px',
  borderTopColor: 'colorPalette',
});
// An inactive stage gets the light grey of its centre line, so that it never
// reads as Revenue Systems' grey.
const tooltipAccentInactive = css({
  borderTopWidth: '4px',
  borderTopColor: 'gray.300',
});

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
  // Clears the drawing (`h: '48'`) plus 1rem.
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
    // Dark text: the challenge shades fail contrast on white.
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

// Active labels are dark with a challenge; without one, only closing is.
function tooltipClass(
  stage: StageWithState,
  challenge: BowtieChallenge | undefined,
) {
  if (!challenge) return undefined;
  if (stage.state !== 'active') return tooltipAccentInactive;
  return challenge === 'sy' ? phaseAccent[stagePhase[stage.id]] : tooltipAccent;
}

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
  const instanceId = useId();
  const gradientId = `${instanceId}flow`;
  const aiGradientId = `${instanceId}ai`;
  const stages = getStageStates(activeStages);
  const label = (id: StageId) => t(getStageLabelKey(id, 'label'));
  const paths = FLOW_LINES.map(flowPath);
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      role="group"
      aria-label={t('title')}
      className={cx(
        challenge && challengePalette[challenge],
        css({
          position: 'relative',
          w: 'full',
          maxW: '7xl',
          mx: 'auto',
          py: '12',
          px: '4',
          display: { base: 'none', md: 'block' },
        }),
      )}
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
              {challenge === 'ai' && (
                <linearGradient
                  id={aiGradientId}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2={BOWTIE_VIEWBOX.width}
                  y2="0"
                >
                  <stop offset="0%" stopColor="var(--colors-coral)" />
                  <stop offset="100%" stopColor="var(--colors-yellow)" />
                </linearGradient>
              )}
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
                  <div
                    data-stage-draw
                    className={cx(
                      css({ position: 'absolute', inset: '0' }),
                      inView ? drawState.drawing : drawState.waiting,
                    )}
                    style={drawDelay(index)}
                  >
                    <svg
                      data-stage-tint={challenge ?? 'neutral'}
                      viewBox={VIEWBOX}
                      preserveAspectRatio="none"
                      fill="none"
                      className={cx(
                        flowSvg,
                        stageStrokeClass(challenge, stage.id),
                      )}
                      style={columnSlice(index, stages.length)}
                      stroke={flowStrokeUrl(
                        challenge,
                        gradientId,
                        aiGradientId,
                      )}
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
                  </div>
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
                  paletteBorder,
                  css({
                    position: 'absolute',
                    inset: '-1',
                    rounded: 'full',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    opacity: '0',
                    _motionReduce: { animation: '[none]', opacity: '1' },
                  }),
                  // Rings once the lines reach the knot.
                  inView &&
                    css({ animation: 'bowtie-ring', animationDelay: '[1.4s]' }),
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

          {/* The expansion loop feeds revenue back into the bow tie. It sits
              at six sevenths, between the adoption and expansion columns. */}
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
                className={tooltipClass(stage, challenge)}
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
                  className={cx(chip, chipBorder(challenge, stage.id))}
                >
                  <span
                    className={cx(
                      css({ h: '1.5', w: '1.5', rounded: 'full' }),
                      chipDot(challenge, stage.id),
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
