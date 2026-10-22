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

import { KNOT, STAGE_LAYOUT, splitLabel, toPercentBox } from './bowtie-layout';

/** Challenge colours, keyed like the `challenge.<id>` tokens. */
export type BowtieChallenge = 'rp' | 'se' | 'sc' | 'cx' | 'sy' | 'ai';

type UnifiedBowtieProps = {
  /** Stages drawn at full strength. Every stage when omitted. */
  activeStages?: Iterable<StageId>;
  /** Tints the active stages. The drawing stays neutral when omitted. */
  challenge?: BowtieChallenge;
};

// One static class per challenge: Panda only ships literal values (CLAUDE.md,
// static analysis trap). Revenue AI's token is coral, the start of its
// gradient.
const sliceFill: Record<BowtieChallenge, string> = {
  rp: css({ fill: 'challenge.rp' }),
  se: css({ fill: 'challenge.se' }),
  sc: css({ fill: 'challenge.sc' }),
  cx: css({ fill: 'challenge.cx' }),
  sy: css({ fill: 'challenge.sy' }),
  ai: css({ fill: 'challenge.ai' }),
};

const tooltipAccent: Record<BowtieChallenge, string> = {
  rp: css({ borderTopColor: 'challenge.rp' }),
  se: css({ borderTopColor: 'challenge.se' }),
  sc: css({ borderTopColor: 'challenge.sc' }),
  cx: css({ borderTopColor: 'challenge.cx' }),
  sy: css({ borderTopColor: 'challenge.sy' }),
  ai: css({ borderTopColor: 'challenge.ai' }),
};

const tooltipAccentBorder = css({ borderTopWidth: '4px' });

const pulseFill = css({ fill: 'mint' });

const INACTIVE_OPACITY = 0.3;

// The SVG keeps its inline display font (ADR 0001 exception).
const displayText = css({
  fontFamily: 'display',
  textTransform: 'uppercase',
});

const stageTrigger = css({
  position: 'absolute',
  rounded: 'lg',
  bg: 'transparent',
});

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

function stageOpacity(stage: StageWithState) {
  return stage.state === 'active' ? 1 : INACTIVE_OPACITY;
}

/**
 * The revenue bow tie: seven stages from the stage model, two funnels around
 * the closing knot. Each stage opens a tooltip with its KPI and Milestone, on
 * hover, keyboard focus and tap. The triggers are HTML buttons laid over the
 * SVG, since a tooltip cannot render inside it.
 */
export const UnifiedBowtie = ({
  activeStages = STAGE_IDS,
  challenge,
}: UnifiedBowtieProps) => {
  const { t } = useTranslation(BOWTIE_NAMESPACE);
  // Unique per instance: several bow ties can share a page.
  const svgId = useId();
  const gradientId = `${svgId}gradient`;
  const arrowId = `${svgId}arrow`;
  const stages = getStageStates(activeStages);
  const label = (id: StageId) => t(getStageLabelKey(id, 'label'));
  const milestone = (id: StageId) => t(getStageLabelKey(id, 'milestone'));
  const closing = stages.find((stage) => stage.id === 'closing');
  const funnelStages = stages.filter((stage) => stage.id !== 'closing');

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
        overflow: 'visible',
        display: { base: 'none', md: 'block' },
      })}
    >
      <div
        className={css({
          position: 'relative',
          w: 'full',
          aspectRatio: { base: '[21/9]', md: '[28/9]' },
          display: 'flex',
          alignItems: 'center',
        })}
      >
        <div
          className={css({ position: 'absolute', inset: '0', opacity: '0.03' })}
          style={{
            backgroundImage: 'radial-gradient(#212323 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Same ratio as the viewBox, so the triggers line up with it. */}
        <div
          className={css({
            position: 'relative',
            w: 'full',
            aspectRatio: '[24/7]',
          })}
        >
          <svg
            viewBox="0 0 1200 350"
            aria-hidden="true"
            className={css({
              w: 'full',
              h: 'full',
              overflow: 'visible',
              color: 'ocobo.dark',
            })}
            fill="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#212323" stopOpacity="0.01" />
                <stop offset="50%" stopColor="#212323" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#212323" stopOpacity="0.01" />
              </linearGradient>
              <marker
                id={arrowId}
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="currentColor"
                  fillOpacity="0.2"
                />
              </marker>
            </defs>

            <g
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.1"
              fill="none"
            >
              <path
                d="M 350,110 C 300,50 150,50 100,110"
                strokeDasharray="3 3"
              />
              <path
                d="M 100,240 C 150,300 300,300 350,240"
                strokeDasharray="3 3"
                markerEnd={`url(#${arrowId})`}
              />
              <path
                d="M 850,110 C 900,50 1050,50 1100,110"
                strokeDasharray="3 3"
              />
              <path
                d="M 1100,240 C 1050,300 900,300 850,240"
                strokeDasharray="3 3"
                markerEnd={`url(#${arrowId})`}
              />
            </g>
            <g
              fill="currentColor"
              fillOpacity="0.35"
              fontSize="12"
              fontWeight="900"
              textAnchor="middle"
              className={cx(displayText, css({ letterSpacing: 'label' }))}
            >
              <text x="225" y="45">
                {t('loops.acquisition')}
              </text>
              <text x="975" y="45">
                {t('loops.expansion')}
              </text>
            </g>

            <path
              d="M40,60 L540,140 L540,210 L40,290 Z"
              fill="white"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />
            <path
              d="M1160,60 L660,140 L660,210 L1160,290 Z"
              fill="white"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />

            {challenge &&
              funnelStages
                .filter((stage) => stage.state === 'active')
                .map((stage) => (
                  <polygon
                    key={stage.id}
                    data-stage-slice={stage.id}
                    points={STAGE_LAYOUT[stage.id].slice}
                    fillOpacity="0.22"
                    className={sliceFill[challenge]}
                  />
                ))}

            <path
              d="M40,60 L540,140 L540,210 L40,290 Z"
              fill={`url(#${gradientId})`}
            />
            <path
              d="M1160,60 L660,140 L660,210 L1160,290 Z"
              fill={`url(#${gradientId})`}
            />

            <g
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              strokeOpacity="0.15"
            >
              <line x1="206" y1="40" x2="206" y2="310" />
              <line x1="373" y1="40" x2="373" y2="310" />
              <line x1="826" y1="40" x2="826" y2="310" />
              <line x1="993" y1="40" x2="993" y2="310" />
            </g>

            {closing && (
              <g data-stage="closing" opacity={stageOpacity(closing)}>
                <rect
                  x={KNOT.x}
                  y={KNOT.y}
                  width={KNOT.width}
                  height={KNOT.height}
                  fill="currentColor"
                  rx="4"
                />
                <g
                  fill="white"
                  fontWeight="900"
                  textAnchor="middle"
                  className={cx(displayText, css({ letterSpacing: 'tag' }))}
                >
                  <text x={STAGE_LAYOUT.closing.labelX} y="155" fontSize="11">
                    {label('closing')}
                  </text>
                  <text
                    x={STAGE_LAYOUT.closing.milestone.x}
                    y={STAGE_LAYOUT.closing.milestone.y}
                    fontSize="9"
                    fillOpacity="0.7"
                  >
                    {splitLabel(milestone('closing'), 12).map((line, i) => (
                      <tspan
                        key={i}
                        x={STAGE_LAYOUT.closing.milestone.x}
                        dy={i === 0 ? 0 : 13}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
                <circle
                  cx="600"
                  cy="125"
                  r="3"
                  className={cx(
                    challenge ? sliceFill[challenge] : pulseFill,
                    css({ animation: 'pulse' }),
                  )}
                />
              </g>
            )}

            <g fill="currentColor" fontWeight="900" className={displayText}>
              {funnelStages.map((stage) => {
                const layout = STAGE_LAYOUT[stage.id];
                const lines = splitLabel(label(stage.id), 14);
                return (
                  <g
                    key={stage.id}
                    data-stage={stage.id}
                    opacity={stageOpacity(stage)}
                  >
                    <text
                      x={layout.labelX}
                      y={lines.length === 1 ? 185 : 175}
                      textAnchor="middle"
                      fontSize="13"
                      letterSpacing="0.05em"
                    >
                      {lines.map((line, i) => (
                        <tspan key={i} x={layout.labelX} dy={i === 0 ? 0 : 17}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                    <text
                      x={layout.milestone.x}
                      y={layout.milestone.y}
                      dx={layout.milestone.dx}
                      textAnchor={layout.milestone.anchor}
                      fillOpacity="0.45"
                      fontSize="13"
                      className={css({ letterSpacing: 'tag' })}
                    >
                      {milestone(stage.id)}
                    </text>
                  </g>
                );
              })}
            </g>

            <g stroke="currentColor" strokeOpacity="0.2" strokeWidth="1">
              <path d="M206,60 v-6 m-3,3 h6" />
              <path d="M373,85 v-6 m-3,3 h6" />
              <path d="M826,85 v-6 m-3,3 h6" />
              <path d="M993,60 v-6 m-3,3 h6" />
            </g>
          </svg>

          <ul>
            {stages.map((stage) => (
              <li key={stage.id}>
                <Tooltip
                  className={
                    challenge
                      ? cx(tooltipAccentBorder, tooltipAccent[challenge])
                      : undefined
                  }
                  asChild
                  content={
                    <span className={kpiContent}>
                      <span className={kpiLabel}>
                        {t(MILESTONE_PREFIX_KEY)} · {milestone(stage.id)}
                      </span>
                      <span className={kpiTitle}>
                        {t(getStageLabelKey(stage.id, 'kpiTitle'))}
                      </span>
                      <span>
                        {t(getStageLabelKey(stage.id, 'description'))}
                      </span>
                    </span>
                  }
                >
                  <button
                    type="button"
                    data-stage-trigger={stage.id}
                    className={stageTrigger}
                    style={toPercentBox(STAGE_LAYOUT[stage.id].hitBox)}
                  >
                    <span className={css({ srOnly: true })}>
                      {stage.state === 'active'
                        ? label(stage.id)
                        : `${label(stage.id)}, ${t('inactive')}`}
                    </span>
                  </button>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
