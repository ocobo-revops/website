import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, flex, hstack } from '@ocobo/styled-system/patterns';

type RoleKey = 'ceo' | 'managers' | 'teams' | 'clients';

type RoleData = {
  title: string;
  items: string[];
};

type PyramidData = Record<RoleKey, RoleData>;

const bulletStyles: Record<RoleKey, string> = {
  ceo: css({ bg: 'ocobo.coral' }),
  managers: css({ bg: 'ocobo.yellow' }),
  teams: css({ bg: 'ocobo.sky' }),
  clients: css({ bg: 'ocobo.mint' }),
};

export const PyramidSection = () => {
  const { t } = useTranslation('offer');
  const pyramid = t('symptoms.pyramid', { returnObjects: true }) as PyramidData;

  return (
    <div
      className={css({
        position: 'relative',
        w: 'full',
        maxW: '6xl',
        mx: 'auto',
        h: '620px',
      })}
    >
      <svg
        viewBox="0 0 1000 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={css({
          w: 'full',
          h: 'full',
          overflow: 'visible',
          color: 'ocobo.dark',
        })}
      >
        <circle cx="580" cy="180" r="50" fill="#FE9C87" fillOpacity="0.25" />
        <circle cx="420" cy="250" r="45" fill="#F1CF25" fillOpacity="0.25" />
        <circle cx="630" cy="400" r="48" fill="#99D1DF" fillOpacity="0.25" />
        <circle cx="370" cy="480" r="50" fill="#9ADBBA" fillOpacity="0.25" />
        <g transform="translate(450, 200) rotate(15)">
          <path
            d="M-8 0 L8 0 M0 -8 L0 8"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </g>
        <g transform="translate(680, 420)">
          <path
            d="M-6 0 L6 0 M0 -6 L0 6"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>
        <g transform="translate(340, 540) rotate(-15)">
          <path
            d="M-5 0 L5 0 M0 -5 L0 5"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>
        <g transform="translate(620, 310) rotate(45)">
          <path
            d="M-10 0 L10 0 M0 -10 L0 10"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </g>

        <path
          d="M500 150 L460 220 L540 220 Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M540 220 L550 210 L510 140 L500 150" fill="currentColor" />
        <path
          d="M455 235 L545 235 L570 305 L430 305 Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M570 305 L580 295 L555 225 L545 235" fill="currentColor" />
        <path
          d="M425 320 L575 320 L605 390 L395 390 Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M605 390 L615 380 L585 310 L575 320" fill="currentColor" />
        <path
          d="M380 397.5 L630 397.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.4"
        />
        <path
          d="M385 405 L615 405 L650 490 L350 490 Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M650 490 L660 480 L625 395 L615 405" fill="currentColor" />

        <path
          d="M525 180 C 560 180, 575 100, 605 100"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="605" cy="100" r="3.5" fill="currentColor" />
        <foreignObject x="625" y="40" width="350" height="200">
          <div
            className={`${flex({ direction: 'column', align: 'flex-start' })} ${css({ textAlign: 'left' })}`}
          >
            <div className={hstack({ gap: '4', mb: '3' })}>
              <div
                className={`${center()} ${css({
                  w: '10',
                  h: '10',
                  bg: 'white',
                  borderWidth: '2px',
                  borderColor: 'ocobo.dark',
                  rounded: 'full',
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  shadow: 'sm',
                })}`}
              >
                1
              </div>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: '2xl',
                  color: 'ocobo.dark',
                })}
              >
                {pyramid.ceo.title}
              </h3>
            </div>
            <ul
              className={css({
                fontSize: 'sm',
                color: 'gray.500',
                fontWeight: 'medium',
                spaceY: '1',
              })}
            >
              {pyramid.ceo.items.map((item) => (
                <li
                  key={item}
                  className={flex({ gap: '2', align: 'flex-start' })}
                >
                  <span
                    className={`${css({
                      w: '1.5',
                      h: '1.5',
                      rounded: 'full',
                      flexShrink: 0,
                      mt: '1.5',
                    })} ${bulletStyles.ceo}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </foreignObject>

        <path
          d="M445 265 C 410 265, 410 210, 370 210"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="370" cy="210" r="3.5" fill="currentColor" />
        <foreignObject x="30" y="140" width="320" height="200">
          <div
            className={`${flex({ direction: 'column', align: 'flex-end' })} ${css({ textAlign: 'right', pr: '4' })}`}
          >
            <div className={hstack({ gap: '4', mb: '3' })}>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: '2xl',
                  color: 'ocobo.dark',
                })}
              >
                {pyramid.managers.title}
              </h3>
              <div
                className={`${center()} ${css({
                  w: '10',
                  h: '10',
                  bg: 'white',
                  borderWidth: '2px',
                  borderColor: 'ocobo.dark',
                  rounded: 'full',
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  shadow: 'sm',
                })}`}
              >
                2
              </div>
            </div>
            <ul
              className={css({
                fontSize: 'sm',
                color: 'gray.500',
                fontWeight: 'medium',
                spaceY: '1',
              })}
            >
              {pyramid.managers.items.map((item) => (
                <li
                  key={item}
                  className={flex({
                    gap: '2',
                    align: 'flex-start',
                    justify: 'flex-end',
                  })}
                >
                  {item}
                  <span
                    className={`${css({
                      w: '1.5',
                      h: '1.5',
                      rounded: 'full',
                      flexShrink: 0,
                      mt: '1.5',
                    })} ${bulletStyles.managers}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </foreignObject>

        <path
          d="M590 355 C 640 355, 650 300, 695 300"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="695" cy="300" r="3.5" fill="currentColor" />
        <foreignObject x="715" y="235" width="280" height="200">
          <div
            className={`${flex({ direction: 'column', align: 'flex-start' })} ${css({ textAlign: 'left' })}`}
          >
            <div className={hstack({ gap: '4', mb: '3' })}>
              <div
                className={`${center()} ${css({
                  w: '10',
                  h: '10',
                  bg: 'white',
                  borderWidth: '2px',
                  borderColor: 'ocobo.dark',
                  rounded: 'full',
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  shadow: 'sm',
                })}`}
              >
                3
              </div>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: '2xl',
                  color: 'ocobo.dark',
                })}
              >
                {pyramid.teams.title}
              </h3>
            </div>
            <ul
              className={css({
                fontSize: 'sm',
                color: 'gray.500',
                fontWeight: 'medium',
                spaceY: '1',
              })}
            >
              {pyramid.teams.items.map((item) => (
                <li
                  key={item}
                  className={flex({ gap: '2', align: 'flex-start' })}
                >
                  <span
                    className={`${css({
                      w: '1.5',
                      h: '1.5',
                      rounded: 'full',
                      flexShrink: 0,
                      mt: '1.5',
                    })} ${bulletStyles.teams}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </foreignObject>

        <path
          d="M370 445 C 330 445, 330 520, 280 520"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="280" cy="520" r="3.5" fill="currentColor" />
        <foreignObject x="10" y="450" width="250" height="200">
          <div
            className={`${flex({ direction: 'column', align: 'flex-end' })} ${css({ textAlign: 'right', pr: '4' })}`}
          >
            <div className={hstack({ gap: '4', mb: '3' })}>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontSize: '2xl',
                  color: 'ocobo.dark',
                })}
              >
                {pyramid.clients.title}
              </h3>
              <div
                className={`${center()} ${css({
                  w: '10',
                  h: '10',
                  bg: 'white',
                  borderWidth: '2px',
                  borderColor: 'ocobo.dark',
                  rounded: 'full',
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  shadow: 'sm',
                })}`}
              >
                4
              </div>
            </div>
            <ul
              className={css({
                fontSize: 'sm',
                color: 'gray.500',
                fontWeight: 'medium',
                spaceY: '1',
              })}
            >
              {pyramid.clients.items.map((item) => (
                <li
                  key={item}
                  className={flex({
                    gap: '2',
                    align: 'flex-start',
                    justify: 'flex-end',
                  })}
                >
                  {item}
                  <span
                    className={`${css({
                      w: '1.5',
                      h: '1.5',
                      rounded: 'full',
                      flexShrink: 0,
                      mt: '1.5',
                    })} ${bulletStyles.clients}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};
