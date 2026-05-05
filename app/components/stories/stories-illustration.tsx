import { BarChart3, Smile, Star, TrendingUp, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, hstack } from '@ocobo/styled-system/patterns';

const StoriesIllustration: React.FunctionComponent = () => {
  const { t } = useTranslation('common');

  return (
    <div
      className={`${center()} ${css({
        position: 'relative',
        w: 'full',
        maxW: '540px',
        aspectRatio: '1',
        overflow: 'visible',
      })}`}
    >
      <div
        className={css({
          position: 'absolute',
          inset: '0',
          opacity: 0.05,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(#212323 1px, transparent 1px), linear-gradient(rgba(33,35,35,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(33,35,35,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
        })}
      />

      <svg
        viewBox="0 0 600 600"
        role="img"
        aria-label={t('clients.illustration.aria')}
        className={css({
          w: 'full',
          h: 'full',
          overflow: 'visible',
          color: 'ocobo.dark',
        })}
        fill="none"
      >
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#212323" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#212323" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g stroke="currentColor" strokeWidth="0.5">
          <circle cx="300" cy="300" r="60" opacity="0.3" />
          <circle cx="300" cy="300" r="120" opacity="0.2" />
          <circle cx="300" cy="300" r="180" opacity="0.12" />
          <circle cx="300" cy="300" r="240" opacity="0.08" />
          <circle cx="300" cy="300" r="300" opacity="0.04" />
        </g>

        <g
          className={css({
            animation: 'radar-sweep',
            transformOrigin: '300px 300px',
          })}
        >
          <path
            d="M300,300 L300,0 A300,300 0 0,1 512,87 Z"
            fill="url(#radarGradient)"
            opacity="0.15"
          />
          <line
            x1="300"
            y1="300"
            x2="300"
            y2="0"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.25"
          />
        </g>

        <g transform="translate(300, 300)">
          <circle
            r="60"
            fill="none"
            stroke="#9ADBBA"
            strokeWidth="1"
            opacity="0.25"
            className={css({ animation: 'pulse' })}
          />

          <rect
            x="-45"
            y="-45"
            width="90"
            height="90"
            rx="20"
            fill="currentColor"
            className={css({ shadow: '2xl' })}
          />
          <Star
            x="-20"
            y="-20"
            size={40}
            fill="#9ADBBA"
            className={css({ color: 'ocobo.mint' })}
          />

          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <circle
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 55}
              cy={Math.sin((angle * Math.PI) / 180) * 55}
              r="2.5"
              fill="#F1CF25"
            />
          ))}
        </g>

        <foreignObject
          x="408"
          y="72"
          width="180"
          height="120"
          className={css({ animation: 'float-gentle' })}
        >
          <div
            className={css({
              bg: 'white',
              borderWidth: '2px',
              borderColor: 'ocobo.dark',
              p: '4',
              rounded: '2xl',
              shadow: 'offset',
              mr: '2',
              mb: '2',
            })}
          >
            <div className={`${hstack({ gap: '2' })} ${css({ mb: '2' })}`}>
              <TrendingUp size={14} className={css({ color: 'ocobo.coral' })} />
              <span
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  color: 'ocobo.dark',
                  opacity: 0.4,
                })}
              >
                {t('clients.illustration.impact.label')}
              </span>
            </div>
            <div
              className={css({
                fontSize: '2xl',
                fontFamily: 'display',
                fontWeight: 'black',
                color: 'ocobo.dark',
                lineHeight: 'none',
              })}
            >
              +50%
            </div>
            <div
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                color: 'gray.400',
                mt: '1',
                textTransform: 'uppercase',
              })}
            >
              {t('clients.illustration.impact.caption')}
            </div>
          </div>
        </foreignObject>

        <foreignObject
          x="32"
          y="312"
          width="180"
          height="120"
          className={css({
            animation: 'float-gentle',
            animationDelay: '1.2s',
          })}
        >
          <div
            className={css({
              bg: 'white',
              borderWidth: '2px',
              borderColor: 'ocobo.dark',
              p: '4',
              rounded: '2xl',
              shadow: 'offset',
              mr: '2',
              mb: '2',
            })}
          >
            <div className={`${hstack({ gap: '2' })} ${css({ mb: '2' })}`}>
              <Zap size={14} className={css({ color: 'ocobo.sky' })} />
              <span
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  color: 'ocobo.dark',
                  opacity: 0.4,
                })}
              >
                {t('clients.illustration.process.label')}
              </span>
            </div>
            <div
              className={css({
                fontSize: '2xl',
                fontFamily: 'display',
                fontWeight: 'black',
                color: 'ocobo.dark',
                lineHeight: 'none',
              })}
            >
              100%
            </div>
            <div
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                color: 'gray.400',
                mt: '1',
                textTransform: 'uppercase',
              })}
            >
              {t('clients.illustration.process.caption')}
            </div>
          </div>
        </foreignObject>

        <foreignObject
          x="340"
          y="432"
          width="180"
          height="120"
          className={css({
            animation: 'float-gentle',
            animationDelay: '2.5s',
          })}
        >
          <div
            className={css({
              bg: 'white',
              borderWidth: '2px',
              borderColor: 'ocobo.dark',
              p: '4',
              rounded: '2xl',
              shadow: 'offset',
              mr: '2',
              mb: '2',
            })}
          >
            <div className={`${hstack({ gap: '2' })} ${css({ mb: '2' })}`}>
              <BarChart3 size={14} className={css({ color: 'ocobo.yellow' })} />
              <span
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  color: 'ocobo.dark',
                  opacity: 0.4,
                })}
              >
                {t('clients.illustration.data.label')}
              </span>
            </div>
            <div
              className={css({
                fontSize: '2xl',
                fontFamily: 'display',
                fontWeight: 'black',
                color: 'ocobo.dark',
                lineHeight: 'none',
              })}
            >
              {t('clients.illustration.data.value')}
            </div>
            <div
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                color: 'gray.400',
                mt: '1',
                textTransform: 'uppercase',
              })}
            >
              {t('clients.illustration.data.caption')}
            </div>
          </div>
        </foreignObject>

        <foreignObject
          x="32"
          y="42"
          width="240"
          height="160"
          className={css({
            animation: 'float-gentle',
            animationDelay: '0.6s',
          })}
        >
          <div
            className={css({
              bg: 'white',
              borderWidth: '2px',
              borderColor: 'ocobo.dark',
              p: '4',
              rounded: '2xl',
              shadow: 'offset',
              mr: '2',
              mb: '2',
            })}
          >
            <div className={`${hstack({ gap: '2' })} ${css({ mb: '2' })}`}>
              <Smile size={14} className={css({ color: 'ocobo.mint' })} />
              <span
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  color: 'ocobo.dark',
                  opacity: 0.4,
                })}
              >
                {t('clients.illustration.userExperience.label')}
              </span>
            </div>
            <div className={hstack({ gap: '3' })}>
              <div
                className={css({
                  fontSize: '2xl',
                  fontFamily: 'display',
                  fontWeight: 'black',
                  color: 'ocobo.dark',
                  lineHeight: 'none',
                })}
              >
                {t('clients.illustration.userExperience.value')}
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
                className={css({ color: 'ocobo.mint' })}
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle cx="18" cy="20" r="2.5" fill="currentColor" />
                <circle cx="30" cy="20" r="2.5" fill="currentColor" />
                <path
                  d="M16 30 Q24 36 32 30"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <div
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                color: 'gray.400',
                mt: '1',
                textTransform: 'uppercase',
              })}
            >
              {t('clients.illustration.userExperience.caption')}
            </div>
          </div>
        </foreignObject>

        <g opacity="0.3">
          <circle
            cx="100"
            cy="100"
            r="4"
            fill="#9ADBBA"
            className={css({ animation: 'pulse' })}
          />
          <circle
            cx="500"
            cy="500"
            r="4"
            fill="#FE9C87"
            className={css({
              animation: 'pulse',
              animationDelay: '1.5s',
            })}
          />
          <path
            d="M50,50 l10,0 m-5,-5 l0,10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M550,50 l10,0 m-5,-5 l0,10"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
};

StoriesIllustration.displayName = 'StoriesIllustration';

export { StoriesIllustration };
