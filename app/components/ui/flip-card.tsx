import * as React from 'react';

import { RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cx } from '@ocobo/styled-system/css';
import { flipCard } from '@ocobo/styled-system/recipes';
import type { FlipCardVariantProps } from '@ocobo/styled-system/recipes/flip-card';

// A tap on these lets them do their own job instead of flipping the card.
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, summary, [role="button"], [tabindex]';

// React 18 has no typed `inert` prop; an empty string renders the attribute.
// React 19 reads `inert=""` as false: switch to `inert` on upgrade.
const INERT = { inert: '' } as React.HTMLAttributes<HTMLDivElement>;

type FlipCardProps = FlipCardVariantProps & {
  /** Names the card in the flip button's accessible name. */
  label: string;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
};

/**
 * Card with a front and a back face (ADR 0002). It flips with its button
 * (Enter or Space), with a tap on the card, or while a mouse hovers it. The
 * face turned away is `inert`: out of the tab order and hidden from screen
 * readers. The button sits outside both faces, so focus stays on it when
 * the card turns over.
 */
export function FlipCard({
  label,
  front,
  back,
  size,
  className,
  frontClassName,
  backClassName,
}: FlipCardProps) {
  const { t } = useTranslation();
  const [flipped, setFlipped] = React.useState(false);
  const pointerType = React.useRef<string>('');
  // True while the back shows only because a mouse hovers the card. Leaving
  // then shows the front; a flip from the button or a tap stays put.
  const flippedByHover = React.useRef(false);
  const backId = React.useId();
  const styles = flipCard({ size });

  const toggle = () => {
    flippedByHover.current = false;
    setFlipped((value) => !value);
  };

  const onPointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || flipped) return;
    flippedByHover.current = true;
    setFlipped(true);
  };

  const onPointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || !flippedByHover.current) return;
    flippedByHover.current = false;
    setFlipped(false);
  };

  const onPointerDown = (event: React.PointerEvent) => {
    pointerType.current = event.pointerType;
  };

  // Tap anywhere on the card. A mouse already flipped it on hover, and a
  // link or button inside a face keeps its own action.
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pointerType.current === 'mouse') return;
    const target = event.target as Element;
    const interactive = target.closest(INTERACTIVE_SELECTOR);
    if (interactive && event.currentTarget.contains(interactive)) return;
    toggle();
  };

  return (
    // The flip button is the keyboard control; the click handler on the card
    // only widens the tap target.
    <div
      className={cx(styles.root, className)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <button
        type="button"
        className={styles.trigger}
        // React escapes attributes; i18next escaping would show `&#39;`.
        aria-label={t('flipCard.flip', {
          label,
          interpolation: { escapeValue: false },
        })}
        aria-expanded={flipped}
        aria-controls={backId}
        onClick={toggle}
      >
        <RotateCw aria-hidden="true" />
      </button>
      <div className={styles.inner} data-state={flipped ? 'back' : 'front'}>
        <div
          className={cx(styles.front, frontClassName)}
          aria-hidden={flipped || undefined}
          {...(flipped ? INERT : {})}
        >
          {front}
        </div>
        <div
          id={backId}
          className={cx(styles.back, backClassName)}
          aria-hidden={!flipped || undefined}
          {...(flipped ? {} : INERT)}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
