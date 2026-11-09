import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { ButtonLink } from '~/components/ui/button-link';
import { Reveal } from '~/components/ui/reveal';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';

import { AiAgentWindows } from './ai-agent-windows';

/** Anchor of the AI block, as in the mockup (`#ia`). */
export const AI_ID = 'ia';

type Layer = { label: string; title: string; description: string };

// Top to bottom: activation (AI), context (sky), foundation (mint).
const LAYERS = [
  {
    number: '03',
    tools: ['Claude', 'Dust'],
    node: css({
      bgGradient: 'ai',
      color: 'dark',
      borderColor: 'transparent',
      boxShadow: 'window',
    }),
    // Gradient text is for display sizes only (ADR 0002).
    label: css({ color: 'coral' }),
    card: css({
      borderColor: 'coral/60',
      bg: 'white/6',
      boxShadow: 'window',
    }),
    line: css({ bgGradient: 'to-b', gradientFrom: 'coral', gradientTo: 'sky' }),
  },
  {
    number: '02',
    tools: ['Notion', 'Modjo', 'Aircall'],
    node: css({ color: 'sky', borderColor: 'sky' }),
    label: css({ color: 'sky' }),
    card: css({ borderColor: 'white/10', bg: 'white/4' }),
    line: css({ bgGradient: 'to-b', gradientFrom: 'sky', gradientTo: 'mint' }),
  },
  {
    number: '01',
    tools: ['HubSpot', 'Salesforce'],
    node: css({ color: 'mint', borderColor: 'mint' }),
    label: css({ color: 'mint' }),
    card: css({ borderColor: 'white/10', bg: 'white/4' }),
    line: null,
  },
] as const;

const TOOL_LOGOS: Record<string, string> = {
  Claude: '/images/partners/claude.png',
  Dust: '/images/partners/dust.png',
  Notion: '/images/partners/notion.png',
  Modjo: '/images/partners/modjo.jpeg',
  Aircall: '/images/partners/aircall.png',
  HubSpot: '/images/partners/hubspot.png',
  Salesforce: '/images/partners/salesforce.png',
};

const pill = cx(
  text({ variant: 'label' }),
  css({
    display: 'inline-block',
    px: '4',
    py: '1.5',
    mb: '7',
    bgGradient: 'ai',
    color: 'dark',
    rounded: 'full',
  }),
);

// The dot grid of the mockup, faded towards the edges.
const dots = css({
  position: 'absolute',
  inset: '0',
  pointerEvents: 'none',
  backgroundImage:
    '[radial-gradient(rgba(255,255,255,.11) 1px, transparent 1.2px)]',
  backgroundSize: '[22px 22px]',
  maskImage:
    '[radial-gradient(ellipse 90% 50% at 50% 65%, #000 15%, transparent 85%)]',
});

const row = css({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '40px minmax(0, 1fr)',
  gap: '4',
  alignItems: 'start',
});

const node = cx(
  text({ variant: 'label' }),
  css({
    position: 'relative',
    zIndex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    w: '10',
    h: '10',
    mt: '2',
    rounded: 'full',
    borderWidth: '1px',
    bg: 'dark',
    letterSpacing: 'normal',
  }),
);

// Joins a node to the one below it.
const connector = css({
  position: 'absolute',
  left: '[19.5px]',
  top: '12',
  bottom: '-6',
  w: '[1px]',
});

const layerCard = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5',
  px: '6',
  py: '5',
  rounded: '2xl',
  borderWidth: '1px',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  _hover: { bg: 'white/8', borderColor: 'white/20' },
});

const tool = cx(
  text({ variant: 'small', color: 'white' }),
  css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2',
    py: '1',
    pl: '1',
    pr: '3',
    rounded: 'full',
    bg: 'white/6',
    borderWidth: '1px',
    borderColor: 'white/8',
    fontWeight: 'semibold',
  }),
);

const toolLogo = css({
  w: '5',
  h: '5',
  p: '0.5',
  rounded: 'full',
  bg: 'white',
  objectFit: 'contain',
});

type AiSectionProps = {
  /** Slug of the Revenue AI challenge page; hides the CTA when missing. */
  aiChallengeSlug: string | null;
};

/**
 * The AI block of the v2 home (`#ia` in the mockup): the three layers an
 * agent needs, then four agents already running at clients.
 */
export function AiSection({ aiChallengeSlug }: AiSectionProps) {
  const { t } = useTranslation('home');
  const getLocalizedPath = useLocalizedPathname();
  const layers = t('ai.layers', { returnObjects: true }) as Layer[];

  return (
    <section
      id={AI_ID}
      className={cx(
        section({ bg: 'dark', padding: 'lg' }),
        css({ position: 'relative', overflow: 'hidden', isolation: 'isolate' }),
      )}
    >
      <div aria-hidden="true" className={dots} />
      <Container className={css({ position: 'relative' })}>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: 'minmax(0, 1fr)',
              lg: 'minmax(0, 1fr) minmax(0, 1fr)',
            },
            gap: { base: '12', lg: '16' },
            alignItems: 'start',
          })}
        >
          <div>
            <span className={pill}>{t('ai.label')}</span>
            <h2
              className={cx(
                text({ variant: 'display-lg', color: 'white' }),
                css({ mb: '7' }),
              )}
            >
              {t('ai.title')}
            </h2>
            <p
              className={cx(
                text({ variant: 'body', color: 'white' }),
                css({ color: 'white/70', mb: '4' }),
              )}
            >
              {t('ai.lead')}
            </p>
            <p
              className={cx(
                text({ variant: 'body', color: 'white' }),
                css({ fontWeight: 'bold' }),
              )}
            >
              {t('ai.promise')}
            </p>
          </div>

          <div>
            <ol
              aria-label={t('ai.layersLabel')}
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '3.5',
              })}
            >
              {LAYERS.map((layer, index) => {
                const copy = layers[index];
                if (!copy) return null;
                return (
                  <li key={layer.number} className={row}>
                    {layer.line ? (
                      <span
                        aria-hidden="true"
                        className={cx(connector, layer.line)}
                      />
                    ) : null}
                    <span aria-hidden="true" className={cx(node, layer.node)}>
                      {layer.number}
                    </span>
                    <Reveal>
                      <div className={cx(layerCard, layer.card)}>
                        <span
                          className={cx(
                            text({ variant: 'label' }),
                            css({ alignSelf: 'flex-start' }),
                            layer.label,
                          )}
                        >
                          {copy.label}
                        </span>
                        <h3
                          className={text({
                            variant: 'display-md-bold',
                            color: 'white',
                          })}
                        >
                          {copy.title}
                        </h3>
                        <p
                          className={cx(
                            text({ variant: 'small', color: 'white' }),
                            css({ color: 'white/60' }),
                          )}
                        >
                          {copy.description}
                        </p>
                        <ul
                          className={css({
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '2',
                            mt: '2',
                          })}
                        >
                          {layer.tools.map((name) => (
                            <li key={name} className={tool}>
                              <img
                                src={TOOL_LOGOS[name]}
                                alt=""
                                width={20}
                                height={20}
                                loading="lazy"
                                className={toolLogo}
                              />
                              {name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
            <p
              className={cx(
                text({ variant: 'small', color: 'white' }),
                css({ color: 'white/50', mt: '3', ml: '14' }),
              )}
            >
              {t('ai.layersCaption')}
            </p>
          </div>
        </div>

        <div
          className={css({
            mt: '20',
            pt: '14',
            borderTopWidth: '1px',
            borderColor: 'white/12',
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '4',
              mb: '8',
            })}
          >
            {/* Bermia at 28px in the mockup: the display face, nearest size. */}
            <h3
              className={cx(
                text({ variant: 'display-lg', color: 'white' }),
                css({ fontSize: '3xl' }),
              )}
            >
              {t('ai.agents.title')}
            </h3>
            <p
              className={cx(
                text({ variant: 'small', color: 'white' }),
                css({ color: 'white/60' }),
              )}
            >
              {t('ai.agents.subtitle')}
            </p>
          </div>
          <AiAgentWindows />
        </div>

        {aiChallengeSlug ? (
          <div className={css({ textAlign: 'center', mt: '16' })}>
            <ButtonLink
              to={getLocalizedPath(`/challenges/${aiChallengeSlug}`)}
              variant="ai"
              size="lg"
            >
              {t('ai.cta')}
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
