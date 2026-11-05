import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, text } from '@ocobo/styled-system/recipes';

import { useInView } from '~/hooks/use-in-view';
import {
  type RevenueStack,
  type StackLayer,
  revenueStack,
} from '~/modules/revenue-stack';

import {
  StackLabel,
  ToolChips,
  ToolList,
  layerText,
  layerTitle,
  useLayerCopy,
} from './stack-parts';

/*
 * Ocobo's stack: the CRM at the centre, four layers around it, joined by
 * connectors where a dot travels. The figure is a size container: the layout
 * follows its own width, so it holds beside the design-system sidebar too.
 * From 1024px (`@/5xl`), a 5-column grid places context above the CRM,
 * signals and interface beside it, execution below. Narrower, one column in
 * DOM order: 01 signals, the CRM, 02, 03, 04.
 */

// --- Placement ------------------------------------------------------------

const grid = css({
  display: 'grid',
  py: { base: '4', '@/5xl': '10' },
  gridTemplateColumns: {
    base: 'minmax(0, 1fr)',
    '@/5xl': 'minmax(0, 1fr) 72px 360px 72px minmax(0, 1fr)',
  },
  gridTemplateRows: { '@/5xl': 'auto 64px auto 64px auto' },
  alignItems: 'center',
});

// Context and execution span the grid, centred, at most 896px wide.
const wide = css({
  w: 'full',
  '@/5xl': { maxW: '4xl', justifySelf: 'center' },
});

const areas = {
  context: cx(wide, css({ '@/5xl': { gridColumn: '1 / -1', gridRow: '1' } })),
  up: css({ '@/5xl': { gridColumn: '3', gridRow: '2' } }),
  signals: css({ '@/5xl': { gridColumn: '1', gridRow: '3' } }),
  right: css({ '@/5xl': { gridColumn: '2', gridRow: '3' } }),
  core: css({ '@/5xl': { gridColumn: '3', gridRow: '3' } }),
  left: css({ '@/5xl': { gridColumn: '4', gridRow: '3' } }),
  interface: css({ '@/5xl': { gridColumn: '5', gridRow: '3' } }),
  down: css({ '@/5xl': { gridColumn: '3', gridRow: '4' } }),
  execution: cx(wide, css({ '@/5xl': { gridColumn: '1 / -1', gridRow: '5' } })),
};

// --- Entrance -------------------------------------------------------------

// As in `Reveal`: the transition sits on the visible state only.
const nodeHidden = css({ opacity: '0', transform: 'translateY(14px)' });
const nodeVisible = css({
  opacity: '1',
  transform: 'none',
  transitionProperty: 'common',
  transitionDuration: '[800ms]',
  transitionTimingFunction: 'smooth',
  _motionReduce: { transitionDuration: 'instant', transitionDelay: 'instant' },
});

// The CRM first, then the sides, then context and execution.
const nodeDelays = {
  core: css({ transitionDelay: 'instant' }),
  sides: css({ transitionDelay: 'slowest' }),
  context: css({ transitionDelay: '[900ms]' }),
  execution: css({ transitionDelay: '[1100ms]' }),
};

type NodeProps = {
  area: string;
  delay: keyof typeof nodeDelays;
  inView: boolean;
  children: ReactNode;
};

function Node({ area, delay, inView, children }: NodeProps) {
  return (
    <div
      className={cx(
        area,
        inView ? nodeVisible : nodeHidden,
        inView ? nodeDelays[delay] : undefined,
      )}
    >
      {children}
    </div>
  );
}

// --- Connectors -----------------------------------------------------------

type Direction = 'right' | 'left' | 'up' | 'down';
type ConnectorColour = 'mint' | 'sky' | 'yellow' | 'coral';

// A dot halo: an outline in the dot colour, as no shadow token fits.
const dotColours: Record<ConnectorColour, string> = {
  mint: css({ bg: 'mint', outlineColor: 'mint/20' }),
  sky: css({ bg: 'sky', outlineColor: 'sky/20' }),
  yellow: css({ bg: 'yellow', outlineColor: 'yellow/20' }),
  coral: css({ bg: 'coral', outlineColor: 'coral/20' }),
};

// Horizontal connectors stand vertical below `@/5xl`.
const lineStyles = {
  horizontal: css({
    top: '0',
    left: '[50%]',
    w: '[1px]',
    h: 'full',
    '@/5xl': { top: '[50%]', left: '0', w: 'full', h: '[1px]' },
  }),
  vertical: css({ top: '0', bottom: '0', left: '[50%]', w: '[1px]' }),
};

// The line draws itself from the CRM outwards, once in view.
const lineHidden = css({ transform: 'scale(0)' });
const lineVisible = css({
  transform: 'scale(1)',
  transitionProperty: 'common',
  transitionDuration: '[700ms]',
  transitionDelay: 'slow',
  transitionTimingFunction: 'smooth',
  _motionReduce: { transitionDuration: 'instant', transitionDelay: 'instant' },
});

const lineOrigins: Record<Direction, string> = {
  right: css({ '@/5xl': { transformOrigin: 'left' } }),
  left: css({ '@/5xl': { transformOrigin: 'right' } }),
  up: css({ transformOrigin: 'bottom' }),
  down: css({ transformOrigin: 'top' }),
};

// The dot rides a track as long as the connector. The keyframes move the
// track with `transform`, which costs no layout per frame; its percentages
// refer to the track, so to the connector.
const trackStyles = {
  horizontal: css({ top: '[50%]', left: '0', w: 'full', h: '0' }),
  vertical: css({ top: '0', left: '[50%]', w: '0', h: 'full' }),
};

// No dot in one column: the connectors only join the cards in reading
// order there, and a travelling dot would point the wrong way.
const trackMotion: Record<Direction, string> = {
  right: css({
    display: 'none',
    '@/5xl': { display: 'block', animation: 'stack-flow-right' },
  }),
  left: css({
    display: 'none',
    '@/5xl': { display: 'block', animation: 'stack-flow-left' },
  }),
  up: css({
    display: 'none',
    '@/5xl': { display: 'block', animation: 'stack-flow-up' },
  }),
  down: css({
    display: 'none',
    '@/5xl': { display: 'block', animation: 'stack-flow-down' },
  }),
};

// Centres the dot on the track.
const dotOffset = {
  horizontal: css({ mt: '[-3.5px]' }),
  vertical: css({ ml: '[-3.5px]' }),
};

const paused = css({ animationPlayState: 'paused' });

type ConnectorProps = {
  area: string;
  direction: Direction;
  colour: ConnectorColour;
  inView: boolean;
};

function Connector({ area, direction, colour, inView }: ConnectorProps) {
  const axis =
    direction === 'right' || direction === 'left' ? 'horizontal' : 'vertical';

  return (
    <div
      aria-hidden="true"
      className={cx(
        area,
        css({
          position: 'relative',
          alignSelf: 'stretch',
          h: '10',
          '@/5xl': { h: 'auto' },
        }),
      )}
    >
      <span
        className={cx(
          css({ position: 'absolute', bg: 'gray.300' }),
          inView ? lineVisible : lineHidden,
          lineStyles[axis],
          lineOrigins[direction],
        )}
      />
      <span
        className={cx(
          css({
            position: 'absolute',
            opacity: '0',
            _motionReduce: { animation: '[none]' },
          }),
          trackStyles[axis],
          trackMotion[direction],
          inView ? undefined : paused,
        )}
      >
        <span
          className={cx(
            css({
              position: 'absolute',
              top: '0',
              left: '0',
              w: 'dot',
              h: 'dot',
              borderRadius: 'full',
              outlineWidth: '4px',
              outlineStyle: 'solid',
            }),
            dotColours[colour],
            dotOffset[axis],
          )}
        />
      </span>
    </div>
  );
}

// --- Layers ---------------------------------------------------------------

// `app/index.css` sets headings in Bermia: the body font comes back here.
const layerHeading = css({ fontFamily: 'body' });

/**
 * The layer's heading: its label ("01 · Signaux") above its title, both in
 * the `h3`, so a screen reader moving by heading hears the layer name too.
 */
function LayerHeading({ layer }: { layer: StackLayer }) {
  const { heading, title } = useLayerCopy(layer);
  return (
    <h3 className={layerHeading}>
      <span className={css({ display: 'block', mb: '3.5' })}>
        <StackLabel accent={layer.accent}>{heading}</StackLabel>
      </span>{' '}
      <span className={cx(layerTitle, css({ display: 'block' }))}>{title}</span>
    </h3>
  );
}

/** Signals and interface: title, text, then the tools with their role. */
function ListCard({ layer }: { layer: StackLayer }) {
  const { text: body } = useLayerCopy(layer);
  return (
    <>
      <LayerHeading layer={layer} />
      <p className={layerText}>{body}</p>
      <ToolList tools={layer.tools} />
    </>
  );
}

/** Context: title and text beside the tool chips, from `@/5xl`. */
function ChipsCard({ layer }: { layer: StackLayer }) {
  const { text: body } = useLayerCopy(layer);
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', '@/5xl': 'row' },
        alignItems: { base: 'flex-start', '@/5xl': 'center' },
        justifyContent: 'space-between',
        gap: { base: '5', '@/5xl': '7' },
      })}
    >
      <div>
        <LayerHeading layer={layer} />
        <p className={layerText}>{body}</p>
      </div>
      <ToolChips tools={layer.tools} inline />
    </div>
  );
}

/** Execution: label, title and chips on one row, from `@/5xl`. No text. */
function RowCard({ layer }: { layer: StackLayer }) {
  const { heading, title } = useLayerCopy(layer);
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', '@/5xl': 'row' },
        alignItems: { base: 'flex-start', '@/5xl': 'center' },
        gap: { base: '3', '@/5xl': '5' },
      })}
    >
      <h3
        className={cx(
          layerHeading,
          css({
            display: 'flex',
            flexDirection: { base: 'column', '@/5xl': 'row' },
            alignItems: { base: 'flex-start', '@/5xl': 'center' },
            gap: { base: '3', '@/5xl': '5' },
            '@/5xl': { mr: 'auto' },
          }),
        )}
      >
        <StackLabel accent={layer.accent}>{heading}</StackLabel>{' '}
        <span className={layerTitle}>{title}</span>
      </h3>
      <ToolChips tools={layer.tools} inline />
    </div>
  );
}

// Interface is AI content: a 1px AI gradient frame around a white card.
const aiFrame = css({ p: '[1px]', borderRadius: '2xl', bgGradient: 'ai' });

// --- CRM ------------------------------------------------------------------

type CrmCoreProps = { crm: RevenueStack['crm']; inView: boolean };

function CrmCore({ crm, inView }: CrmCoreProps) {
  const { t } = useTranslation('stack');

  return (
    <div
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'dark',
        color: 'white',
        borderRadius: '3xl',
        pt: '10',
        px: '8',
        pb: '8',
        textAlign: 'center',
        boxShadow: 'window',
      })}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className={css({
          position: 'absolute',
          left: '[50%]',
          top: '[44%]',
          w: '[520px]',
          h: '[520px]',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          stroke: 'white/7',
        })}
      >
        <circle cx="200" cy="200" r="70" fill="none" />
        <circle cx="200" cy="200" r="120" fill="none" />
        <circle cx="200" cy="200" r="170" fill="none" />
        <circle
          cx="200"
          cy="200"
          r="70"
          fill="none"
          className={cx(
            css({
              stroke: 'yellow/50',
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: 'stack-ping',
              _motionReduce: { animation: '[none]' },
            }),
            inView ? undefined : paused,
          )}
        />
      </svg>
      <div className={css({ position: 'relative' })}>
        <StackLabel accent="yellow" tone="dark">
          {t('crm.label')}
        </StackLabel>
        {/* A display word, not a heading: ADR 0002 keeps the H2 size for
            H2s, and the label and text already read in order. */}
        <p
          className={cx(
            text({ variant: 'display-lg', color: 'white' }),
            css({ mt: '4', mb: '3' }),
          )}
        >
          {t('crm.title')}
        </p>
        <p
          className={cx(
            text({ variant: 'small' }),
            css({ color: 'white/65', maxW: '[250px]', mx: 'auto', mb: '6' }),
          )}
        >
          {t('crm.text')}
        </p>
        <ul
          role="list"
          className={css({
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5',
          })}
        >
          {crm.map((tool) => (
            <li
              key={tool.name}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                h: '11',
                px: '4',
                borderRadius: 'lg',
                bg: 'white',
              })}
            >
              <img
                src={tool.logo}
                alt={tool.name}
                loading="lazy"
                className={css({ h: '6', w: 'auto' })}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- Diagram --------------------------------------------------------------

type StackDiagramProps = {
  /** Defaults to Ocobo's stack (`app/modules/revenue-stack.ts`). */
  stack?: RevenueStack;
  className?: string;
};

export function StackDiagram({
  stack = revenueStack,
  className,
}: StackDiagramProps) {
  const { t } = useTranslation('stack');
  const { ref, inView } = useInView<HTMLElement>();
  const { signals, context, interface: aiLayer, execution } = stack.layers;

  return (
    <figure
      ref={ref}
      aria-label={t('figureLabel')}
      className={cx(
        css({
          position: 'relative',
          isolation: 'isolate',
          containerType: 'inline-size',
        }),
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          top: '-36',
          bottom: '-36',
          left: '0',
          right: '0',
          zIndex: '-1',
          pointerEvents: 'none',
          backgroundImage:
            '[radial-gradient(rgba(33,35,35,0.12) 1px, transparent 1.2px)]',
          backgroundSize: '[22px 22px]',
          maskImage:
            '[radial-gradient(ellipse 55% 60% at 50% 50%, black 25%, transparent 100%)]',
        })}
      />
      <div className={grid}>
        <Node area={areas.signals} delay="sides" inView={inView}>
          <div className={card()}>
            <ListCard layer={signals} />
          </div>
        </Node>
        <Connector
          area={areas.right}
          direction="right"
          colour="mint"
          inView={inView}
        />
        <Node area={areas.core} delay="core" inView={inView}>
          <CrmCore crm={stack.crm} inView={inView} />
        </Node>
        <Connector
          area={areas.up}
          direction="up"
          colour="sky"
          inView={inView}
        />
        <Node area={areas.context} delay="context" inView={inView}>
          <div className={card()}>
            <ChipsCard layer={context} />
          </div>
        </Node>
        <Connector
          area={areas.left}
          direction="left"
          colour="yellow"
          inView={inView}
        />
        <Node area={areas.interface} delay="sides" inView={inView}>
          <div className={aiFrame}>
            <div
              className={cx(
                card({ border: false }),
                css({ borderRadius: '[15px]' }),
              )}
            >
              <ListCard layer={aiLayer} />
            </div>
          </div>
        </Node>
        <Connector
          area={areas.down}
          direction="down"
          colour="coral"
          inView={inView}
        />
        <Node area={areas.execution} delay="execution" inView={inView}>
          <div className={cx(card({ padding: 'sm' }), css({ pl: '6' }))}>
            <RowCard layer={execution} />
          </div>
        </Node>
      </div>
    </figure>
  );
}
