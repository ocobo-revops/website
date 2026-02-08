import { css } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';

export const DashboardIllustration = () => {
  return (
    <div
      className={`${center()} ${css({
        position: 'relative',
        w: 'full',
        maxW: '580px',
        aspectRatio: 'square',
        opacity: '0',
        animation: 'hero-reveal',
      })}`}
      style={{ animationDelay: '0.4s' }}
    >
      <div
        className={`${center()} ${css({
          position: 'absolute',
          top: '8%',
          left: '38%',
          w: '110px',
          h: '110px',
          rounded: 'full',
          bg: 'ocobo.mint/80',
          transform: 'rotate(12deg)',
          transition: 'transform',
          transitionDuration: '1000ms',
          _hover: { transform: 'rotate(45deg)' },
        })}`}
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
        className={css({
          position: 'absolute',
          top: '12%',
          right: '12%',
          w: '90px',
          h: '90px',
          bg: 'ocobo.coral/80',
          transform: 'rotate(-6deg)',
          rounded: 'sm',
        })}
      />

      <div
        className={css({
          position: 'absolute',
          top: '42%',
          left: '5%',
          w: '85px',
          h: '100px',
          bg: 'ocobo.yellow/80',
          transform: 'rotate(3deg)',
          rounded: 'sm',
        })}
      />

      <div
        className={css({
          position: 'absolute',
          bottom: '8%',
          left: '48%',
          w: '100px',
          h: '100px',
          rounded: 'full',
          bg: 'ocobo.sky/80',
        })}
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
              fill="currentColor"
            />
            <rect
              x="0"
              y="20"
              width="170"
              height="6"
              rx="3"
              fill="currentColor"
            />
            <rect
              x="0"
              y="40"
              width="185"
              height="6"
              rx="3"
              fill="currentColor"
            />
            <rect
              x="0"
              y="60"
              width="130"
              height="6"
              rx="3"
              fill="currentColor"
            />
            <rect
              x="0"
              y="80"
              width="160"
              height="6"
              rx="3"
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
            d="M 375,460 Q 405,400 435,460 T 495,460"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
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
              height="40"
              fill="currentColor"
            />
            <rect
              x="18"
              y="-70"
              width="12"
              rx="2"
              height="70"
              fill="currentColor"
            />
            <rect
              x="36"
              y="-55"
              width="12"
              rx="2"
              height="55"
              fill="currentColor"
            />
            <rect
              x="54"
              y="-30"
              width="12"
              rx="2"
              height="30"
              fill="currentColor"
            />
            <rect
              x="72"
              y="-85"
              width="12"
              rx="2"
              height="85"
              fill="currentColor"
            />
          </g>
        </g>

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
      </svg>
    </div>
  );
};
