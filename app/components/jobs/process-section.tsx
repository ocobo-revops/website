import { CheckCircle, Phone, Settings, Star, Users, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { center, flex, vstack } from '@ocobo/styled-system/patterns';
import { badge } from '@ocobo/styled-system/recipes';

const STEP_ICONS = [Phone, Video, Settings, Users, Star, CheckCircle];

type ProcessStep = { title: string; duration: string; desc: string };

export function ProcessSection() {
  const { t } = useTranslation('jobs');
  const steps = t('process.steps', { returnObjects: true }) as ProcessStep[];

  return (
    <section
      className={css({
        maxW: '7xl',
        mx: 'auto',
        px: { base: '4', sm: '6', lg: '8' },
        mb: '40',
      })}
    >
      <div
        className={css({
          borderWidth: '1.5px',
          borderColor: 'gray.100',
          rounded: '3xl',
          p: { base: '8', md: '24' },
          bg: 'gray.50/30',
          position: 'relative',
          overflow: 'hidden',
        })}
      >
        {/* Header */}
        <div
          className={css({
            textAlign: 'center',
            mb: '32',
            position: 'relative',
            zIndex: 10,
          })}
        >
          <span
            className={`${badge({ variant: 'sky' })} ${css({ mb: '6', display: 'inline-block' })}`}
          >
            {t('process.badge')}
          </span>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: '4xl', md: '6xl' },
              fontWeight: 'black',
              mb: '6',
              color: 'ocobo.dark',
              letterSpacing: 'tight',
            })}
          >
            {t('process.title')}
          </h2>
          <p
            className={css({
              color: 'gray.500',
              fontSize: 'xl',
              fontWeight: 'medium',
            })}
          >
            {t('process.subtitle')}
          </p>
        </div>

        {/* Timeline */}
        <div className={css({ position: 'relative', maxW: '5xl', mx: 'auto' })}>
          {/* Center line (desktop) */}
          <div
            className={css({
              position: 'absolute',
              left: '50%',
              top: '0',
              bottom: '0',
              w: '1.5px',
              bg: 'gray.200',
              transform: 'translateX(-50%)',
              display: { base: 'none', md: 'block' },
            })}
          />
          {/* Left line (mobile) */}
          <div
            className={css({
              position: 'absolute',
              left: '6',
              top: '0',
              bottom: '0',
              w: '1.5px',
              bg: 'gray.200',
              md: { display: 'none' },
            })}
          />

          <div
            className={`${vstack({ gap: '24' })} ${css({ position: 'relative', zIndex: 10 })}`}
          >
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = STEP_ICONS[idx % STEP_ICONS.length];

              return (
                <div
                  key={step.title}
                  className={`${flex({
                    direction: { base: 'column', md: 'row' },
                    align: 'center',
                  })} ${css({
                    position: 'relative',
                    w: 'full',
                    md: { flexDir: isEven ? 'row-reverse' : 'row' },
                  })}`}
                >
                  {/* Center dot */}
                  <div
                    className={css({
                      position: 'absolute',
                      left: { base: '6', md: '50%' },
                      w: '4',
                      h: '4',
                      bg: 'white',
                      borderWidth: '2.5px',
                      borderColor: 'ocobo.dark',
                      rounded: 'full',
                      zIndex: 10,
                      transform: 'translateX(-50%)',
                      shadow: 'sm',
                    })}
                  />

                  {/* Content half */}
                  <div
                    className={cx(
                      css({
                        w: { base: 'full', md: '1/2' },
                        pl: { base: '16', md: '0' },
                      }),
                      isEven
                        ? css({ md: { pl: '24' } })
                        : css({ md: { pr: '24' } }),
                    )}
                  >
                    <div
                      className={cx(
                        flex({ align: 'start', gap: '8', direction: 'row' }),
                        isEven
                          ? css({
                              md: {
                                justifyContent: 'start',
                                textAlign: 'right',
                              },
                            })
                          : css({
                              md: { justifyContent: 'end', textAlign: 'left' },
                            }),
                      )}
                    >
                      {/* Icon box */}
                      <div
                        className={cx(
                          center(),
                          css({
                            w: '16',
                            h: '16',
                            bg: 'white',
                            rounded: '2xl',
                            color: 'ocobo.dark',
                            flexShrink: 0,
                            shadow: 'lg',
                            borderWidth: '1px',
                            borderColor: 'gray.100',
                            order: 1,
                          }),
                          isEven
                            ? css({ md: { order: 2 } })
                            : css({ md: { order: 1 } }),
                        )}
                      >
                        <Icon size={24} strokeWidth={1.5} />
                      </div>

                      {/* Text */}
                      <div
                        className={cx(
                          css({ order: 2 }),
                          isEven
                            ? css({ md: { order: 1 } })
                            : css({ md: { order: 2 } }),
                        )}
                      >
                        <h3
                          className={css({
                            fontFamily: 'display',
                            fontSize: '2xl',
                            fontWeight: 'bold',
                            color: 'ocobo.dark',
                            mb: '2',
                            letterSpacing: 'tight',
                          })}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={css({
                            fontSize: 'xs',
                            fontWeight: 'black',
                            color: 'ocobo.coral',
                            mb: '3',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                          })}
                        >
                          {step.duration}
                        </p>
                        <p
                          className={css({
                            fontSize: 'base',
                            color: 'gray.500',
                            lineHeight: 'relaxed',
                            maxW: 'sm',
                            fontWeight: 'medium',
                          })}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Empty half (desktop only) */}
                  <div
                    className={css({
                      display: { base: 'none', md: 'block' },
                      md: { w: '1/2' },
                    })}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
