import { GraduationCap, Layout, LineChart, Sliders } from 'lucide-react';

import { css } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';

type AttioPillarsIllustrationProps = {
  labels: [string, string, string, string];
};

export const AttioPillarsIllustration = ({
  labels,
}: AttioPillarsIllustrationProps) => {
  const [label1, label2, label3, label4] = labels;

  return (
    <div
      className={`${center()} ${css({
        position: 'relative',
        w: 'full',
        maxW: '520px',
        aspectRatio: 'square',
        overflow: 'visible',
      })}`}
    >
      <div
        className={css({
          position: 'absolute',
          inset: '4',
          opacity: '0.12',
        })}
        style={{
          backgroundImage: 'radial-gradient(#212323 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div
        className={`${center()} ${css({
          position: 'relative',
          zIndex: '10',
          w: 'full',
          h: 'full',
        })}`}
      >
        <svg
          viewBox="0 0 500 500"
          className={css({
            w: 'full',
            h: 'full',
            overflow: 'visible',
            color: 'ocobo.dark',
          })}
        >
          <g
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            opacity="0.1"
          >
            <line x1="250" y1="50" x2="250" y2="450" />
            <line x1="50" y1="250" x2="450" y2="250" />
            <circle cx="250" cy="250" r="100" fill="none" />
            <circle cx="250" cy="250" r="180" fill="none" />
          </g>

          <g
            className={css({
              cursor: 'default',
              opacity: '0',
              animation: 'gentle-reveal',
            })}
            style={{ animationDelay: '0.2s' }}
          >
            <rect
              x="70"
              y="70"
              width="160"
              height="160"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({
                transition: 'all',
                transitionDuration: '500ms',
                shadow: 'sm',
                _groupHover: { transform: 'translateY(-4px)' },
              })}
            />
            <rect x="70" y="70" width="160" height="4" fill="#F1CF25" />
            <g
              className={css({
                opacity: '0.4',
                transition: 'opacity',
                _groupHover: { opacity: '1' },
              })}
            >
              <Layout
                x="135"
                y="130"
                size={32}
                className={css({ color: 'ocobo.dark' })}
              />
            </g>
            <text
              x="150"
              y="210"
              textAnchor="middle"
              fill="currentColor"
              fontSize="10"
              fontWeight="900"
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              })}
            >
              {label1}
            </text>
            <circle
              cx="230"
              cy="230"
              r="3"
              fill="#F1CF25"
              className={css({ animation: 'pulse' })}
            />
          </g>

          <g
            className={css({
              cursor: 'default',
              opacity: '0',
              animation: 'gentle-reveal',
            })}
            style={{ animationDelay: '0.35s' }}
          >
            <rect
              x="270"
              y="70"
              width="160"
              height="160"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({
                transition: 'all',
                transitionDuration: '500ms',
                shadow: 'sm',
                _groupHover: { transform: 'translateY(-4px)' },
              })}
            />
            <rect x="270" y="70" width="160" height="4" fill="#99D1DF" />
            <g
              className={css({
                opacity: '0.4',
                transition: 'opacity',
                _groupHover: { opacity: '1' },
              })}
            >
              <Sliders
                x="335"
                y="130"
                size={32}
                className={css({ color: 'ocobo.dark' })}
              />
            </g>
            <text
              x="350"
              y="210"
              textAnchor="middle"
              fill="currentColor"
              fontSize="10"
              fontWeight="900"
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              })}
            >
              {label2}
            </text>
            <circle
              cx="270"
              cy="230"
              r="3"
              fill="#99D1DF"
              className={css({ animation: 'pulse' })}
            />
          </g>

          <g
            className={css({
              cursor: 'default',
              opacity: '0',
              animation: 'gentle-reveal',
            })}
            style={{ animationDelay: '0.5s' }}
          >
            <rect
              x="70"
              y="270"
              width="160"
              height="160"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({
                transition: 'all',
                transitionDuration: '500ms',
                shadow: 'sm',
                _groupHover: { transform: 'translateY(4px)' },
              })}
            />
            <rect x="70" y="270" width="160" height="4" fill="#9ADBBA" />
            <g
              className={css({
                opacity: '0.4',
                transition: 'opacity',
                _groupHover: { opacity: '1' },
              })}
            >
              <LineChart
                x="135"
                y="330"
                size={32}
                className={css({ color: 'ocobo.dark' })}
              />
            </g>
            <text
              x="150"
              y="410"
              textAnchor="middle"
              fill="currentColor"
              fontSize="10"
              fontWeight="900"
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              })}
            >
              {label3}
            </text>
            <circle
              cx="230"
              cy="270"
              r="3"
              fill="#9ADBBA"
              className={css({ animation: 'pulse' })}
            />
          </g>

          <g
            className={css({
              cursor: 'default',
              opacity: '0',
              animation: 'gentle-reveal',
            })}
            style={{ animationDelay: '0.65s' }}
          >
            <rect
              x="270"
              y="270"
              width="160"
              height="160"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({
                transition: 'all',
                transitionDuration: '500ms',
                shadow: 'sm',
                _groupHover: { transform: 'translateY(4px)' },
              })}
            />
            <rect x="270" y="270" width="160" height="4" fill="#FE9C87" />
            <g
              className={css({
                opacity: '0.4',
                transition: 'opacity',
                _groupHover: { opacity: '1' },
              })}
            >
              <GraduationCap
                x="335"
                y="330"
                size={32}
                className={css({ color: 'ocobo.dark' })}
              />
            </g>
            <text
              x="350"
              y="410"
              textAnchor="middle"
              fill="currentColor"
              fontSize="10"
              fontWeight="900"
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              })}
            >
              {label4}
            </text>
            <circle
              cx="270"
              cy="270"
              r="3"
              fill="#FE9C87"
              className={css({ animation: 'pulse' })}
            />
          </g>

          <g
            className={css({ opacity: '0', animation: 'gentle-reveal' })}
            style={{ animationDelay: '0.9s' }}
          >
            <circle cx="250" cy="250" r="25" fill="currentColor" />
            <path
              d="M242,250 L258,250 M250,242 L250,258"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="250"
              cy="250"
              r="35"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2 4"
              className={css({
                animation: 'spin-slow',
                transformOrigin: '250px 250px',
              })}
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
