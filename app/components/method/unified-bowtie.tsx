import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';

type DiagramLoops = {
  acquisition: string;
  expansion: string;
};

type DiagramCenter = {
  line1: string;
  line2: string;
};

type DiagramFlow = {
  left: string[];
  right: string[];
};

export const UnifiedBowtie = () => {
  const { t } = useTranslation('method');
  const loops = t('scope.diagram.loops', {
    returnObjects: true,
  }) as DiagramLoops;
  const center = t('scope.diagram.center', {
    returnObjects: true,
  }) as DiagramCenter;
  const flow = t('scope.diagram.flow', { returnObjects: true }) as DiagramFlow;
  const stages = t('scope.diagram.stages', { returnObjects: true }) as string[];

  return (
    <div
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
          aspectRatio: { base: '21/9', md: '28/9' },
        })}
      >
        <div
          className={css({ position: 'absolute', inset: '0', opacity: '0.03' })}
          style={{
            backgroundImage: 'radial-gradient(#212323 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <svg
          viewBox="0 0 1200 350"
          className={css({
            w: 'full',
            h: 'full',
            overflow: 'visible',
            color: 'ocobo.dark',
          })}
          fill="none"
        >
          <defs>
            <linearGradient
              id="blueprintGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#212323" stopOpacity="0.01" />
              <stop offset="50%" stopColor="#212323" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#212323" stopOpacity="0.01" />
            </linearGradient>
            <marker
              id="arrowhead"
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
            <path d="M 350,110 C 300,50 150,50 100,110" strokeDasharray="3 3" />
            <path
              d="M 100,240 C 150,300 300,300 350,240"
              strokeDasharray="3 3"
              markerEnd="url(#arrowhead)"
            />
            <text
              x="225"
              y="45"
              textAnchor="middle"
              fill="currentColor"
              fillOpacity="0.15"
              fontSize="9"
              fontWeight="900"
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
              })}
            >
              {loops.acquisition}
            </text>

            <path
              d="M 850,110 C 900,50 1050,50 1100,110"
              strokeDasharray="3 3"
            />
            <path
              d="M 1100,240 C 1050,300 900,300 850,240"
              strokeDasharray="3 3"
              markerEnd="url(#arrowhead)"
            />
            <text
              x="975"
              y="45"
              textAnchor="middle"
              fill="currentColor"
              fillOpacity="0.15"
              fontSize="9"
              fontWeight="900"
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
              })}
            >
              {loops.expansion}
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

          <path
            d="M40,60 L540,140 L540,210 L40,290 Z"
            fill="url(#blueprintGradient)"
          />
          <path
            d="M1160,60 L660,140 L660,210 L1160,290 Z"
            fill="url(#blueprintGradient)"
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

          <g>
            <rect
              x="540"
              y="125"
              width="120"
              height="100"
              fill="currentColor"
              rx="4"
              className={css({ shadow: 'lg' })}
            />
            <text
              x="600"
              y="165"
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="900"
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              })}
            >
              {center.line1}
            </text>
            <text
              x="600"
              y="185"
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="900"
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              })}
            >
              {center.line2}
            </text>
            <circle
              cx="600"
              cy="125"
              r="3"
              fill="#9ADBBA"
              className={css({ animation: 'pulse' })}
            />
          </g>

          <g
            fill="currentColor"
            fillOpacity="0.3"
            fontSize="10"
            fontWeight="900"
            className={css({
              fontFamily: 'display',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            })}
          >
            <text x="40" y="240" textAnchor="start" dx="5">
              {flow.left[0]}
            </text>
            <text x="206" y="220" textAnchor="middle">
              {flow.left[1]}
            </text>
            <text x="373" y="200" textAnchor="middle">
              {flow.left[2]}
            </text>

            <text x="826" y="200" textAnchor="middle">
              {flow.right[0]}
            </text>
            <text x="993" y="220" textAnchor="middle">
              {flow.right[1]}
            </text>
            <text x="1160" y="240" textAnchor="end" dx="-5">
              {flow.right[2]}
            </text>
          </g>

          <g
            className={css({ fontFamily: 'display' })}
            fontSize="13"
            fontWeight="900"
            fill="currentColor"
            letterSpacing="0.05em"
          >
            <text x="123" y="175" textAnchor="middle">
              {stages[0]}
            </text>
            <text x="123" y="192" textAnchor="middle">
              {stages[1]}
            </text>
            <text x="289" y="185" textAnchor="middle">
              {stages[2]}
            </text>
            <text x="456" y="185" textAnchor="middle">
              {stages[3]}
            </text>
            <text x="743" y="185" textAnchor="middle">
              {stages[4]}
            </text>
            <text x="909" y="185" textAnchor="middle">
              {stages[5]}
            </text>
            <text x="1076" y="185" textAnchor="middle">
              {stages[6]}
            </text>
          </g>

          <g stroke="currentColor" strokeOpacity="0.2" strokeWidth="1">
            <path d="M206,60 v-6 m-3,3 h6" />
            <path d="M373,85 v-6 m-3,3 h6" />
            <path d="M826,85 v-6 m-3,3 h6" />
            <path d="M993,60 v-6 m-3,3 h6" />
          </g>
        </svg>
      </div>
    </div>
  );
};
