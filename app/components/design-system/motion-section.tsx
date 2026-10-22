import { motion } from 'framer-motion';
import { useRef } from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { card, text } from '@ocobo/styled-system/recipes';

import { Reveal } from '~/components/ui/reveal';
import { useScrollProgress } from '~/hooks/use-scroll-progress';

import { ShowcaseSection } from './showcase-section';

const caption = css({ fontSize: 'caption', color: 'gray', mb: '6' });
const subheading = cx(text({ variant: 'display-md-bold' }), css({ mb: '2' }));
const track = css({
  position: 'relative',
  h: '2',
  bg: 'line',
  rounded: 'full',
  overflow: 'hidden',
  mb: '6',
});
const bar = css({
  position: 'absolute',
  inset: '0',
  bg: 'dark',
  transformOrigin: 'left',
});
const reducedNote = cx(text({ variant: 'small' }), css({ mb: '6' }));

const steps = [
  'Diagnostic de vos process',
  'Feuille de route priorisée',
  'Mise en place et adoption',
];

function ScrollProgressDemo() {
  const target = useRef<HTMLDivElement>(null);
  const { progress, enabled } = useScrollProgress({
    target,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={target}>
      <h3 className={subheading}>useScrollProgress</h3>
      <p className={caption}>
        Fills as this block crosses the viewport, smoothed by a spring. Under
        reduced motion it is off and the bar is not rendered.
      </p>
      {enabled ? (
        <div className={track} data-testid="scroll-progress">
          <motion.div className={bar} style={{ scaleX: progress }} />
        </div>
      ) : (
        <p className={reducedNote}>Reduced motion: scroll progress is off.</p>
      )}
    </div>
  );
}

export function MotionSection() {
  return (
    <ShowcaseSection title="Motion">
      <h3 className={subheading}>Reveal (useInView)</h3>
      <p className={caption}>
        Cards below the fold fade and rise into place once, with the smooth
        easing token, when they enter the viewport. A card already on screen at
        load stays put. The server render and reduced motion show the final
        state.
      </p>
      <div
        className={cx(
          grid({ columns: { base: 1, md: 3 }, gap: '6' }),
          css({ mb: '16' }),
        )}
      >
        {steps.map((step, index) => (
          <Reveal key={step} className={card()}>
            <span className={text({ variant: 'label' })}>
              Étape {index + 1}
            </span>
            <p className={text({ variant: 'body' })}>{step}</p>
          </Reveal>
        ))}
      </div>
      <ScrollProgressDemo />
    </ShowcaseSection>
  );
}
