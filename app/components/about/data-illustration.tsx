import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

export const DataIllustration = () => {
  const { t } = useTranslation('about');

  return (
    <div className={css({ w: 'full', overflow: 'hidden' })}>
      <div
        className={`${flex({ direction: 'column', align: 'center' })} ${css({
          position: 'relative',
          w: 'full',
          maxW: '3xl',
          h: { base: '280px', md: '420px' },
          mx: 'auto',
          p: '4',
        })}`}
      >
        <div
          className={css({
            position: 'relative',
            w: 'full',
            h: 'full',
            bg: '#FCFAF5',
            rounded: '3xl',
            p: { base: '6', md: '8' },
            shadow: 'soft-lg',
            borderWidth: '1px',
            borderColor: 'gray.100',
            overflow: 'hidden',
          })}
        >
          <svg
            viewBox="0 0 800 500"
            className={css({ w: 'full', h: 'full', color: 'ocobo.dark' })}
            preserveAspectRatio="xMidYMid meet"
          >
            <g className="bars">
              {[
                { x: 40, h: 140 },
                { x: 70, h: 180 },
                { x: 100, h: 160 },
                { x: 130, h: 220 },
                { x: 160, h: 200 },
                { x: 190, h: 240 },
                { x: 220, h: 190 },
                { x: 250, h: 280 },
                { x: 280, h: 320 },
                { x: 310, h: 300 },
                { x: 340, h: 350 },
                { x: 370, h: 330 },
                { x: 400, h: 380 },
                { x: 430, h: 360 },
                { x: 460, h: 400 },
                { x: 490, h: 340 },
                { x: 520, h: 320 },
                { x: 550, h: 280 },
                { x: 580, h: 300 },
                { x: 610, h: 260 },
                { x: 640, h: 320 },
                { x: 670, h: 340 },
                { x: 700, h: 300 },
                { x: 730, h: 360 },
              ].map((bar) => (
                <g key={bar.x}>
                  <rect
                    x={bar.x}
                    y={450 - bar.h}
                    width="14"
                    height={bar.h}
                    fill="currentColor"
                    className="bar-transition"
                  />
                  <rect
                    x={bar.x + 1}
                    y={450 - bar.h * 0.7}
                    width="12"
                    height={bar.h * 0.3}
                    fill="white"
                  />
                  <rect
                    x={bar.x}
                    y={450 - bar.h}
                    width="14"
                    height={bar.h}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </g>

            <g>
              <rect
                x="270"
                y="60"
                width="205"
                height="400"
                fill="#F1CF25"
                className={css({ animation: 'slow-fade' })}
              />
              <rect
                x="270"
                y="60"
                width="205"
                height="400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </g>

            <path
              d="M110,410 l4,8 l8,4 l-8,4 l-4,8 l-4,-8 l-8,-4 l8,-4 Z"
              fill="currentColor"
            />
            <path
              d="M180,120 l3,6 l6,3 l-6,3 l-3,6 l-3,-6 l-6,-3 l6,-3 Z"
              fill="currentColor"
            />
            <path
              d="M520,30 l4,8 l8,4 l-8,4 l-4,8 l-4,-8 l-8,-4 l8,-4 Z"
              fill="currentColor"
            />
            <path
              d="M750,150 l3,6 l6,3 l-6,3 l-3,6 l-3,-6 l-6,-3 l6,-3 Z"
              fill="currentColor"
            />
            <path
              d="M620,400 l4,8 l8,4 l-8,4 l-4,8 l-4,-8 l-8,-4 l8,-4 Z"
              fill="currentColor"
            />

            <g
              transform="translate(485, 460)"
              className={css({ animation: 'float-cursor' })}
            >
              <circle
                cx="0"
                cy="0"
                r="18"
                fill="white"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M-8,-8 C-4,-12 4,-12 8,-8 M-8,8 C-4,12 4,12 8,8 M-12,0 C-12,-4 -12,4 -12,0 M12,0 C12,-4 12,4 12,0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M-5,-5 L5,5 M-5,5 L5,-5"
                stroke="currentColor"
                strokeWidth="1"
              />
            </g>

            <path
              transform="translate(470, 455) scale(1.2)"
              d="M0,0 L25,40 L10,35 L0,55 Z"
              fill="currentColor"
              className={css({ animation: 'float-cursor' })}
            />
          </svg>
        </div>
        <div
          className={css({
            mt: '10',
            textAlign: 'center',
            maxW: 'lg',
            mx: 'auto',
          })}
        >
          <h3
            className={css({
              fontFamily: 'display',
              fontSize: { base: 'xl', md: '2xl' },
              fontWeight: 'bold',
              color: 'ocobo.dark',
              mb: '3',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            })}
          >
            {t('hero.illustration.title')}
          </h3>
          <p
            className={css({
              color: 'gray.400',
              fontSize: { base: 'sm', md: 'base' },
              fontWeight: 'medium',
              lineHeight: 'relaxed',
              px: '4',
            })}
          >
            {t('hero.illustration.subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
};
