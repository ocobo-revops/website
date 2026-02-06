import { ArrowRight, Cpu, Layers, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import {
  center,
  flex,
  grid,
  hstack,
  vstack,
} from '@ocobo/styled-system/patterns';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { SectionHeader } from './section-header';

type Lever = {
  key: 'method' | 'technology' | 'studio';
  title: string;
  badge: string;
  description: string;
  tags?: string[];
  logoRows?: { src: string; alt: string }[][];
  lines?: string[];
};

const iconMap = {
  method: Layers,
  technology: Cpu,
  studio: Users,
} as const;

const iconColorMap = {
  method: 'ocobo.yellow',
  technology: 'ocobo.sky',
  studio: 'ocobo.mint',
} as const;

const hoverColorMap = {
  method: 'ocobo.yellow',
  technology: 'ocobo.sky',
  studio: 'ocobo.mint',
} as const;

const pathMap = {
  method: url.method,
  technology: url.technology,
  studio: url.studio,
} as const;

export const LeviersSection = () => {
  const { t } = useTranslation('offer');
  const getLocalizedPath = useLocalizedPathname();
  const levers = t('levers.items', { returnObjects: true }) as Lever[];

  return (
    <section
      className={css({
        py: '24',
        bg: 'white',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderColor: 'gray.50',
      })}
    >
      <Container>
        <SectionHeader
          badgeText={t('levers.header.badge')}
          title={t('levers.header.title')}
          subtitle={t('levers.header.subtitle')}
          centered={false}
          className={css({ maxW: '3xl', mb: '20' })}
        />

        <div
          className={grid({
            columns: { base: 1, lg: 3 },
            gap: { base: '12', lg: '8' },
          })}
        >
          {levers.map((lever) => {
            const Icon = iconMap[lever.key];
            const iconColor = iconColorMap[lever.key];
            const hoverColor = hoverColorMap[lever.key];
            return (
              <NavLink
                key={lever.key}
                to={getLocalizedPath(pathMap[lever.key])}
                className={`group ${vstack({ h: 'full', alignItems: 'stretch' })}`}
              >
                <div
                  className={`${vstack({ alignItems: 'stretch' })} ${css({
                    position: 'relative',
                    p: '10',
                    bg: 'gray.50',
                    rounded: '3xl',
                    borderWidth: '1px',
                    borderColor: 'gray.100',
                    flexGrow: '1',
                    transition: 'all',
                    transitionDuration: '500',
                    overflow: 'hidden',
                    _hover: {
                      shadow: '2xl',
                      bg: 'white',
                      transform: 'translateY(-8px)',
                    },
                  })}`}
                >
                  <div
                    className={`${hstack({ justify: 'space-between' })} ${css({ mb: '12' })}`}
                  >
                    <div
                      className={`${center()} ${css({
                        w: '14',
                        h: '14',
                        bg: 'white',
                        rounded: '2xl',
                        color: iconColor,
                        shadow: 'sm',
                        borderWidth: '1px',
                        borderColor: 'gray.100',
                        _groupHover: { transform: 'scale(1.1)' },
                        transition: 'transform',
                      })}`}
                    >
                      <Icon size={28} />
                    </div>
                    <ArrowRight
                      className={css({
                        color: 'gray.200',
                        _groupHover: { color: 'ocobo.dark' },
                        transition: 'colors',
                      })}
                      size={24}
                    />
                  </div>
                  <h3
                    className={css({
                      fontFamily: 'display',
                      fontSize: '2xl',
                      fontWeight: 'bold',
                      mb: '6',
                      _groupHover: { color: hoverColor },
                      transition: 'colors',
                    })}
                  >
                    {lever.title}
                  </h3>
                  <p
                    className={css({
                      color: 'gray.400',
                      fontFamily: 'display',
                      fontWeight: 'black',
                      fontSize: 'xs',
                      textTransform: 'uppercase',
                      letterSpacing: 'widest',
                      mb: '4',
                    })}
                  >
                    {lever.badge}
                  </p>
                  <p
                    className={css({
                      color: 'gray.600',
                      fontSize: 'base',
                      lineHeight: 'relaxed',
                      mb: '10',
                      fontWeight: 'medium',
                      flexGrow: '1',
                    })}
                  >
                    {lever.description}
                  </p>

                  <div
                    className={css({
                      w: 'full',
                      h: '1',
                      bg: hoverColor,
                      opacity: '0.2',
                      mb: '8',
                      rounded: 'full',
                      _groupHover: { opacity: '1' },
                      transition: 'opacity',
                    })}
                  />

                  {lever.logoRows?.length ? (
                    <div
                      className={vstack({
                        h: '48px',
                        justify: 'flex-start',
                        gap: '3',
                        alignItems: 'flex-start',
                      })}
                    >
                      {lever.logoRows.map((row, rowIndex) => (
                        <div
                          key={`${lever.key}-row-${rowIndex}`}
                          className={`${hstack({ gap: '4' })} ${css({
                            filter: 'grayscale(1)',
                            opacity: '0.4',
                            _groupHover: {
                              opacity: '1',
                              filter: 'grayscale(0)',
                            },
                            transition: 'all',
                          })}`}
                        >
                          {row.map((logo) => (
                            <img
                              key={logo.src}
                              src={logo.src}
                              className={css({ h: '4', w: 'auto' })}
                              alt={logo.alt}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : lever.lines?.length ? (
                    <div
                      className={vstack({
                        h: '48px',
                        justify: 'flex-start',
                        alignItems: 'flex-start',
                      })}
                    >
                      {lever.lines.map((line) => (
                        <div
                          key={line}
                          className={css({
                            fontSize: 'xs',
                            fontWeight: 'black',
                            color: 'gray.400',
                            textTransform: 'uppercase',
                            letterSpacing: 'widest',
                            lineHeight: 'relaxed',
                          })}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={flex({
                        wrap: 'wrap',
                        gap: '2',
                        h: '48px',
                        alignContent: 'flex-start',
                      })}
                    >
                      {(lever.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className={css({
                            px: '3',
                            py: '1',
                            bg: 'white',
                            borderWidth: '1px',
                            borderColor: 'gray.100',
                            rounded: 'full',
                            fontSize: 'xs',
                            fontWeight: 'black',
                            textTransform: 'uppercase',
                            letterSpacing: 'wider',
                            color: 'gray.400',
                          })}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
