import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import { FlexPair } from '../home/flex-pair';

const toneColorMap = {
  white: 'white',
  muted: 'gray.400',
  highlight: 'ocobo.yellow',
} as const;

type Tone = keyof typeof toneColorMap;

type ManifestoLine = {
  text: string;
  tone: Tone;
  weight?: 'medium' | 'bold';
  italic?: boolean;
};

export const ManifestoSection = () => {
  const { t } = useTranslation('about');

  const introLines = t('manifesto.intro', {
    returnObjects: true,
  }) as ManifestoLine[];
  const statementLines = t('manifesto.statement', {
    returnObjects: true,
  }) as ManifestoLine[];
  const actionsLines = t('manifesto.actions', {
    returnObjects: true,
  }) as ManifestoLine[];
  const clarityLines = t('manifesto.clarity', {
    returnObjects: true,
  }) as ManifestoLine[];
  const invitationLines = t('manifesto.invitation.items', {
    returnObjects: true,
  }) as string[];
  const conclusionLines = t('manifesto.conclusion', {
    returnObjects: true,
  }) as ManifestoLine[];

  return (
    <section
      className={css({
        py: '32',
        bg: 'ocobo.dark',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      })}
    >
      <div
        className={css({
          position: 'absolute',
          top: '0',
          left: '0',
          w: 'full',
          h: '1px',
          bgGradient: 'to-r',
          gradientFrom: 'transparent',
          gradientVia: 'white/10',
          gradientTo: 'transparent',
        })}
      />
      <div
        className={css({
          position: 'absolute',
          bottom: '0',
          left: '0',
          w: 'full',
          h: '1px',
          bgGradient: 'to-r',
          gradientFrom: 'transparent',
          gradientVia: 'white/10',
          gradientTo: 'transparent',
        })}
      />
      <div
        className={css({
          position: 'absolute',
          top: '50%',
          left: '0',
          w: '32',
          h: '32',
          bg: 'ocobo.yellow/10',
          rounded: 'full',
          transform: 'translateX(-50%)',
          filter: 'blur(48px)',
          opacity: '0.5',
        })}
      />
      <div
        className={css({
          position: 'absolute',
          top: '25%',
          right: '0',
          w: '40',
          h: '40',
          bg: 'ocobo.sky/10',
          rounded: 'full',
          transform: 'translateX(50%)',
          filter: 'blur(48px)',
          opacity: '0.5',
        })}
      />

      <div
        className={css({
          maxW: '4xl',
          mx: 'auto',
          px: '6',
          textAlign: 'left',
          position: 'relative',
          zIndex: '10',
        })}
      >
        <div
          className={`${flex({ justify: { base: 'center', md: 'flex-start' } })} ${css(
            {
              mb: '24',
            },
          )}`}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              color: 'ocobo.dark',
              bg: 'ocobo.yellow',
              px: '6',
              py: '2',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              display: 'inline-block',
              rounded: 'full',
              shadow: 'lg',
            })}
          >
            {t('manifesto.badge')}
          </span>
        </div>

        <div className={css({ spaceY: { base: '12', md: '20' }, maxW: '3xl' })}>
          <div className={css({ spaceY: '4' })}>
            {introLines.map((line, index) => (
              <p
                key={`intro-${index}`}
                className={css({
                  fontSize: { base: 'xl', md: '3xl' },
                  fontWeight: line.weight ?? 'medium',
                  color: toneColorMap[line.tone],
                  lineHeight: 'tight',
                  fontStyle: line.italic ? 'italic' : 'normal',
                })}
              >
                {line.text}
              </p>
            ))}
          </div>

          <div
            className={css({
              spaceY: '4',
              borderLeftWidth: '4px',
              borderColor: 'ocobo.yellow',
              pl: '8',
              py: '2',
            })}
          >
            {statementLines.map((line, index) => (
              <p
                key={`statement-${index}`}
                className={css({
                  fontSize: { base: 'xl', md: '3xl' },
                  fontWeight: line.weight ?? 'bold',
                  color: toneColorMap[line.tone],
                  lineHeight: 'tight',
                  fontStyle: line.italic ? 'italic' : 'normal',
                })}
              >
                {line.text}
              </p>
            ))}
          </div>

          <div className={css({ spaceY: '4' })}>
            {actionsLines.map((line, index) => (
              <p
                key={`actions-${index}`}
                className={css({
                  fontSize: { base: 'xl', md: '3xl' },
                  fontWeight: line.weight ?? 'medium',
                  color: toneColorMap[line.tone],
                  lineHeight: 'tight',
                  fontStyle: line.italic ? 'italic' : 'normal',
                })}
              >
                {line.text}
              </p>
            ))}
          </div>

          <div className={css({ spaceY: '4' })}>
            {clarityLines.map((line, index) => (
              <p
                key={`clarity-${index}`}
                className={css({
                  fontSize: { base: 'xl', md: '3xl' },
                  fontWeight: line.weight ?? 'medium',
                  color: toneColorMap[line.tone],
                  lineHeight: 'tight',
                })}
              >
                {line.text}
              </p>
            ))}
          </div>

          <div
            className={css({
              position: 'relative',
              pt: '20',
              pb: '16',
              px: { base: '8', md: '12' },
              bg: 'white/5',
              rounded: '3xl',
              borderWidth: '1px',
              borderColor: 'white/10',
              shadow: '2xl',
              overflow: 'hidden',
              backdropFilter: 'blur(4px)',
            })}
          >
            <div
              className={css({
                position: 'absolute',
                top: '0',
                left: '0',
                w: 'full',
                h: '2',
                bgGradient: 'to-r',
                gradientFrom: 'ocobo.yellow',
                gradientVia: 'ocobo.coral',
                gradientTo: 'ocobo.sky',
              })}
            />

            <p
              className={css({
                fontSize: { base: 'xl', md: '3xl' },
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 'tight',
                mb: '12',
              })}
            >
              {t('manifesto.invitation.title')}
            </p>

            <div className={css({ spaceY: '8' })}>
              {invitationLines.map((line) => (
                <FlexPair key={line} gap={5}>
                  <FlexPair.Icon className={css({ mt: '1.5' })}>
                    <div
                      className={css({
                        bg: 'ocobo.yellow',
                        rounded: 'full',
                        p: '1',
                      })}
                    >
                      <ArrowRight
                        size={16}
                        className={css({ color: 'ocobo.dark' })}
                      />
                    </div>
                  </FlexPair.Icon>
                  <FlexPair.Content>
                    <p
                      className={css({
                        fontSize: { base: 'xl', md: '3xl' },
                        fontWeight: 'medium',
                        color: 'gray.300',
                        lineHeight: 'tight',
                        whiteSpace: 'pre-line',
                      })}
                    >
                      {line}
                    </p>
                  </FlexPair.Content>
                </FlexPair>
              ))}
            </div>
          </div>

          <div className={css({ spaceY: '4', pt: '10' })}>
            {conclusionLines.map((line, index) => (
              <p
                key={`conclusion-${index}`}
                className={css({
                  fontSize: { base: 'xl', md: '3xl' },
                  fontWeight: line.weight ?? 'medium',
                  color: toneColorMap[line.tone],
                  lineHeight: 'tight',
                })}
              >
                {line.text}
              </p>
            ))}
          </div>

          <div className={css({ pt: '24' })}>
            <div
              className={`${flex({ direction: 'column', align: 'flex-start' })} ${css(
                {
                  textAlign: 'left',
                },
              )}`}
            >
              <img
                src="https://27107933.fs1.hubspotusercontent-eu1.net/hubfs/27107933/logo-ocobo_full-white.svg"
                alt="Ocobo Logo"
                className={css({
                  h: { base: '16', md: '20' },
                  w: 'auto',
                  mb: '8',
                  objectFit: 'contain',
                })}
              />
              <p
                className={css({
                  fontFamily: 'display',
                  fontSize: { base: 'xl', md: '3xl' },
                  color: 'ocobo.yellow',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  fontWeight: 'bold',
                  lineHeight: 'tight',
                })}
              >
                {t('manifesto.signature')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
