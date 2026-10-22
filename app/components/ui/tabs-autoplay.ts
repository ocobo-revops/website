import { useEffect } from 'react';

/** Shortest time a tab stays selected, so a bad `interval` cannot spin. */
const MIN_INTERVAL = 1000;

/** Value after `current`, wrapping round to the first one after the last. */
export function nextTabValue(values: readonly string[], current: string) {
  const index = values.indexOf(current);
  return values[(index + 1) % values.length] ?? current;
}

type TabsAutoplayOptions = {
  values: readonly string[];
  value: string;
  playing: boolean;
  /** Time each tab stays selected, in milliseconds. */
  interval: number;
  onAdvance: (next: string) => void;
};

/**
 * Selects the next tab every `interval` while `playing`. Each change of the
 * selected tab restarts the countdown, so a tab always gets the full time.
 */
export function useTabsAutoplay({
  values,
  value,
  playing,
  interval,
  onAdvance,
}: TabsAutoplayOptions) {
  useEffect(() => {
    if (!playing || values.length < 2) return;
    const timer = window.setTimeout(
      () => {
        onAdvance(nextTabValue(values, value));
      },
      Math.max(interval, MIN_INTERVAL),
    );
    return () => window.clearTimeout(timer);
  }, [values, value, playing, interval, onAdvance]);
}
