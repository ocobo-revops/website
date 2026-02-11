import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';

import { SectionLabel } from './section-label';

type Center = { line1: string; line2: string };
type ConversionPill = { label: string; w: number };

const colCenters = [86, 260, 434, 766, 940, 1114];

export const BowtieLifecycle = () => {
  const { t } = useTranslation('method');
  const teams = t('scope.teams', { returnObjects: true }) as string[];
  const phases = t('scope.phases', { returnObjects: true }) as string[];
  const conversions = t('scope.conversions', {
    returnObjects: true,
  }) as ConversionPill[];
  const center = t('scope.center', { returnObjects: true }) as Center;

  return (
    <div
      className={css({
        position: 'relative',
        pt: '6',
        pb: '6',
        bg: '#F9F9F9',
        borderBottomWidth: '1px',
        borderBottomColor: 'gray.100',
        overflow: 'hidden',
        display: { base: 'none', md: 'block' },
      })}
    >
      {/* Dot grid background */}
      <div
        className={css({ position: 'absolute', inset: '0', opacity: '0.05' })}
        style={{
          backgroundImage: 'radial-gradient(#212323 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <SectionLabel label={t('scope.labels.lifecycle')} color="dark" />

      <div className={css({ px: '4', position: 'relative', zIndex: '1' })}>
        <svg
          viewBox="0 0 1200 400"
          className={css({ w: 'full', h: 'auto', overflow: 'visible' })}
          fill="none"
        >
          {/* Team labels with indicator lines */}
          <g>
            {colCenters.map((x, i) => (
              <g key={`team-${i}`} opacity="0.6">
                <line
                  x1={x}
                  y1="92"
                  x2={x}
                  y2="108"
                  stroke="#212323"
                  strokeWidth="0.5"
                  strokeDasharray="2 3"
                  opacity="0.3"
                />
                <circle cx={x} cy="92" r="2" fill="#212323" opacity="0.4" />
                <text
                  x={x}
                  y="80"
                  textAnchor="middle"
                  fill="#212323"
                  fontSize="13"
                  fontWeight="900"
                  className={css({
                    fontFamily: 'body',
                    textTransform: 'uppercase',
                  })}
                  style={{ letterSpacing: '0.15em' }}
                >
                  {teams[i]}
                </text>
              </g>
            ))}
          </g>

          {/* Architectural arcs */}
          <g
            stroke="#212323"
            strokeWidth="0.5"
            strokeOpacity="0.1"
            strokeDasharray="4 4"
          >
            <circle cx="300" cy="190" r="110" />
            <circle cx="900" cy="190" r="110" />
          </g>

          {/* Bowtie shape group */}
          <g transform="translate(0, 70)">
            {/* Left funnel */}
            <path
              d="M 0,40 L 520,110 L 520,210 L 0,280 Z"
              fill="#F0F0F0"
              fillOpacity="0.5"
              stroke="#212323"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />
            {/* Right funnel */}
            <path
              d="M 1200,40 L 680,110 L 680,210 L 1200,280 Z"
              fill="#F0F0F0"
              fillOpacity="0.5"
              stroke="#212323"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />

            {/* Central nexus */}
            <g transform="translate(600, 160)">
              <rect
                x="-80"
                y="-45"
                width="160"
                height="90"
                fill="#212323"
                rx="8"
              />
              <text
                y="-5"
                textAnchor="middle"
                fill="white"
                fontSize="12"
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
                y="15"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="900"
                className={css({
                  fontFamily: 'display',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                })}
              >
                {center.line2}
              </text>
              <circle cy="-55" r="3" fill="#9ADBBA" />
            </g>

            {/* Phase labels */}
            <g
              fill="#212323"
              fontSize="15"
              fontWeight="900"
              textAnchor="middle"
              className={css({
                fontFamily: 'body',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
              })}
            >
              {phases.map((phase, i) => (
                <text key={`phase-${i}`} x={colCenters[i]} y="165">
                  {phase}
                </text>
              ))}
            </g>
          </g>

          {/* Conversion pills */}
          <g transform="translate(0, 365)">
            {conversions.map((pill, i) => (
              <g key={`pill-${i}`} transform={`translate(${colCenters[i]}, 0)`}>
                <rect
                  x={-pill.w / 2}
                  y="-18"
                  width={pill.w}
                  height="36"
                  rx="18"
                  fill="#F1CF25"
                />
                <text
                  y="7"
                  textAnchor="middle"
                  fill="#212323"
                  fontSize="13"
                  fontWeight="900"
                  className={css({
                    fontFamily: 'body',
                    letterSpacing: 'tight',
                    textTransform: 'uppercase',
                  })}
                >
                  {pill.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};
