import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';

import { useInView } from '~/hooks/use-in-view';

// The `smooth` easing token: `animation` shorthands cannot reference tokens.
const easeOut = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const easeBack = 'cubic-bezier(0.2, 0.8, 0.2, 1.3)';

// The mockup `#mission` illustration. Once a quarter of it is in view, the
// shapes pop, the windows rise, then their content grows and the wave draws
// itself. On hover the windows drift apart and the shapes swell.
const box = css({
  position: 'relative',
  w: 'full',
  maxW: '[580px]',
  aspectRatio: 'square',
  '& .il-w': {
    transitionProperty: '[transform]',
    transitionDuration: 'slower',
    transitionTimingFunction: 'smooth',
  },
  // Keeps the mint circle's own 1s hover rotation, which this rule overrides.
  '& .il-s': { transition: `[scale 0.4s ${easeBack}, transform 1s ease]` },
  '& .il-ln, & .il-bar, & .il-pie': { transformBox: 'fill-box' },
  '& .il-ln': { transformOrigin: 'left center' },
  '& .il-bar': { transformOrigin: 'center bottom' },
  '& .il-pie': { transformOrigin: 'center' },
  '& .il-wave': { strokeDasharray: '1' },
  // No hover drift under reduced motion.
  _motionSafe: {
    '&:hover .il-w1': { transform: 'translate(-4px, -6px)' },
    '&:hover .il-w2': { transform: 'translate(5px, -8px)' },
    '&:hover .il-w3': { transform: 'translate(6px, 4px)' },
    '&:hover .il-w4': { transform: 'translate(0px, -5px)' },
    '&:hover .il-w5': { transform: 'translate(-5px, 3px)' },
    '&:hover .il-s': { scale: '[1.08]' },
  },
});

const waiting = css({ '& .il-s, & .il-w': { opacity: '0' } });

const playing = css({
  '& .il-s': { animation: `[il-pop 0.7s ${easeBack} backwards]` },
  '& .il-s1': { animationDelay: '[0.1s]' },
  '& .il-s2': { animationDelay: '[0.25s]' },
  '& .il-s3': { animationDelay: '[0.4s]' },
  '& .il-s4': { animationDelay: '[0.55s]' },
  '& .il-w': { animation: `[il-up 0.7s ${easeOut} backwards]` },
  '& .il-w1': { animationDelay: '[0.3s]' },
  '& .il-w2': { animationDelay: '[0.45s]' },
  '& .il-w3': { animationDelay: '[0.6s]' },
  '& .il-w4': { animationDelay: '[0.75s]' },
  '& .il-w5': { animationDelay: '[0.9s]' },
  '& .il-ln': { animation: `[il-x 0.6s ${easeOut} backwards]` },
  '& .il-ln:nth-of-type(1)': { animationDelay: '[0.9s]' },
  '& .il-ln:nth-of-type(2)': { animationDelay: '[1.0s]' },
  '& .il-ln:nth-of-type(3)': { animationDelay: '[1.1s]' },
  '& .il-ln:nth-of-type(4)': { animationDelay: '[1.2s]' },
  '& .il-ln:nth-of-type(5)': { animationDelay: '[1.3s]' },
  '& .il-bar': {
    animation: '[il-y 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2) backwards]',
  },
  '& .il-bar:nth-of-type(1)': { animationDelay: '[1.3s]' },
  '& .il-bar:nth-of-type(2)': { animationDelay: '[1.4s]' },
  '& .il-bar:nth-of-type(3)': { animationDelay: '[1.5s]' },
  '& .il-bar:nth-of-type(4)': { animationDelay: '[1.6s]' },
  '& .il-bar:nth-of-type(5)': { animationDelay: '[1.7s]' },
  '& .il-pie': { animation: `[il-pie 1s ${easeOut} 1s backwards]` },
  '& .il-wave': { animation: '[il-draw 1.4s ease 1.3s backwards]' },
  '& .il-wave2': { animation: '[il-fade 0.8s ease 1.9s backwards]' },
  _motionReduce: {
    '& .il-s, & .il-w, & .il-ln, & .il-bar, & .il-pie, & .il-wave, & .il-wave2':
      { animation: '[none]', opacity: '1' },
  },
});

export const DashboardIllustration = () => {
  // `inView` starts true, so the server render shows the final state.
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: '0px',
    threshold: 0.25,
  });

  return (
    <div ref={ref} className={cx(center(), box, inView ? playing : waiting)}>
      <div
        className={cx(
          center(),
          'il-s il-s1',
          css({
            position: 'absolute',
            top: '[8%]',
            left: '[38%]',
            w: '[110px]',
            h: '[110px]',
            rounded: 'full',
            bg: 'ocobo.mint/80',
            transform: 'rotate(12deg)',
            transition: 'transform',
            transitionDuration: '[1000ms]',
            _hover: { transform: 'rotate(45deg)' },
          }),
        )}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
        </svg>
      </div>

      <div
        className={cx(
          'il-s il-s2',
          css({
            position: 'absolute',
            top: '[12%]',
            right: '[12%]',
            w: '[90px]',
            h: '[90px]',
            bg: 'ocobo.coral/80',
            transform: 'rotate(-6deg)',
            rounded: 'sm',
          }),
        )}
      />

      <div
        className={cx(
          'il-s il-s3',
          css({
            position: 'absolute',
            top: '[42%]',
            left: '[5%]',
            w: '[85px]',
            h: '[100px]',
            bg: 'ocobo.yellow/80',
            transform: 'rotate(3deg)',
            rounded: 'sm',
          }),
        )}
      />

      <div
        className={cx(
          'il-s il-s4',
          css({
            position: 'absolute',
            bottom: '[8%]',
            left: '[48%]',
            w: '[100px]',
            h: '[100px]',
            rounded: 'full',
            bg: 'ocobo.sky/80',
          }),
        )}
      />

      <svg
        viewBox="0 0 600 600"
        className={css({
          position: 'relative',
          zIndex: '10',
          w: 'full',
          h: 'full',
          overflow: 'visible',
          color: 'ocobo.dark',
        })}
        fill="none"
      >
        <g className="il-w il-w1">
          <g className={css({ animation: 'float-very-slow' })}>
            <rect
              x="50"
              y="100"
              width="280"
              height="180"
              rx="16"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({ shadow: '2xl' })}
            />
            <line
              x1="50"
              y1="145"
              x2="330"
              y2="145"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="80" cy="122" r="3.5" fill="currentColor" />
            <circle cx="100" cy="122" r="3.5" fill="currentColor" />
            <circle cx="120" cy="122" r="3.5" fill="currentColor" />

            <g transform="translate(85, 175)">
              <rect
                x="0"
                y="0"
                width="200"
                height="6"
                rx="3"
                className="il-ln"
                fill="currentColor"
              />
              <rect
                x="0"
                y="20"
                width="170"
                height="6"
                rx="3"
                className="il-ln"
                fill="currentColor"
              />
              <rect
                x="0"
                y="40"
                width="185"
                height="6"
                rx="3"
                className="il-ln"
                fill="currentColor"
              />
              <rect
                x="0"
                y="60"
                width="130"
                height="6"
                rx="3"
                className="il-ln"
                fill="currentColor"
              />
              <rect
                x="0"
                y="80"
                width="160"
                height="6"
                rx="3"
                className="il-ln"
                fill="currentColor"
              />
              <line
                x1="-15"
                y1="-10"
                x2="-15"
                y2="95"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            </g>
          </g>
        </g>

        <g className="il-w il-w2">
          <g
            className={css({ animation: 'float-very-slow' })}
            style={{ animationDelay: '-4s' }}
          >
            <rect
              x="350"
              y="100"
              width="180"
              height="230"
              rx="16"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({ shadow: '2xl' })}
            />
            <line
              x1="350"
              y1="145"
              x2="530"
              y2="145"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="380" cy="122" r="3.5" fill="currentColor" />
            <circle cx="400" cy="122" r="3.5" fill="currentColor" />

            <g transform="translate(440, 240)">
              <g className="il-pie">
                <circle
                  cx="0"
                  cy="0"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M0,0 L0,-60 A60,60 0 0,1 52,-30 Z"
                  fill="currentColor"
                  transform="rotate(30)"
                />
                <path
                  d="M0,0 L-60,0 A60,60 0 0,1 -30,-52 Z"
                  fill="currentColor"
                  opacity="0.8"
                />
                <line
                  x1="0"
                  y1="0"
                  x2="60"
                  y2="0"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="0"
                  x2="-30"
                  y2="52"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </g>
            </g>
          </g>
        </g>

        <g className="il-w il-w3">
          <g
            className={css({ animation: 'float-very-slow' })}
            style={{ animationDelay: '-8s' }}
          >
            <rect
              x="350"
              y="350"
              width="180"
              height="150"
              rx="16"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({ shadow: '2xl' })}
            />
            <line
              x1="350"
              y1="395"
              x2="530"
              y2="395"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="380" cy="372" r="3.5" fill="currentColor" />

            <path
              className="il-wave"
              pathLength={1}
              d="M 375,460 Q 405,400 435,460 T 495,460"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              className="il-wave2"
              d="M 375,445 Q 415,485 455,435 T 515,445"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
              fill="none"
            />
            <line
              x1="375"
              y1="480"
              x2="510"
              y2="480"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </g>
        </g>

        <g className="il-w il-w4">
          <g
            className={css({ animation: 'float-very-slow' })}
            style={{ animationDelay: '-2s' }}
          >
            <rect
              x="200"
              y="305"
              width="130"
              height="210"
              rx="16"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({ shadow: '2xl' })}
            />
            <line
              x1="200"
              y1="350"
              x2="330"
              y2="350"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <g transform="translate(225, 490)">
              <rect
                x="0"
                y="-40"
                width="12"
                rx="2"
                className="il-bar"
                height="40"
                fill="currentColor"
              />
              <rect
                x="18"
                y="-70"
                width="12"
                rx="2"
                className="il-bar"
                height="70"
                fill="currentColor"
              />
              <rect
                x="36"
                y="-55"
                width="12"
                rx="2"
                className="il-bar"
                height="55"
                fill="currentColor"
              />
              <rect
                x="54"
                y="-30"
                width="12"
                rx="2"
                className="il-bar"
                height="30"
                fill="currentColor"
              />
              <rect
                x="72"
                y="-85"
                width="12"
                rx="2"
                className="il-bar"
                height="85"
                fill="currentColor"
              />
            </g>
          </g>
        </g>

        <g className="il-w il-w5">
          <g
            className={css({ animation: 'float-very-slow' })}
            style={{ animationDelay: '-6s' }}
          >
            <rect
              x="50"
              y="305"
              width="130"
              height="210"
              rx="16"
              fill="white"
              stroke="currentColor"
              strokeWidth="1.5"
              className={css({ shadow: '2xl' })}
            />
            <line
              x1="50"
              y1="350"
              x2="180"
              y2="350"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <g transform="translate(75, 430)">
              <line
                x1="0"
                y1="-30"
                x2="0"
                y2="30"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="-4"
                y="-12"
                width="8"
                rx="1"
                height="24"
                stroke="currentColor"
                strokeWidth="1"
                fill="white"
              />
              <line
                x1="22"
                y1="-45"
                x2="22"
                y2="25"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="18"
                y="-22"
                width="8"
                rx="1"
                height="35"
                fill="currentColor"
              />
              <line
                x1="44"
                y1="-25"
                x2="44"
                y2="55"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="40"
                y="5"
                width="8"
                rx="1"
                height="40"
                fill="currentColor"
              />
              <line
                x1="66"
                y1="-55"
                x2="66"
                y2="15"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="62"
                y="-45"
                width="8"
                rx="1"
                height="30"
                stroke="currentColor"
                strokeWidth="1"
                fill="white"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
