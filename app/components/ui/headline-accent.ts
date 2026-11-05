import { css, cx } from '@ocobo/styled-system/css';

/**
 * Second line of page headlines (prototype #28): italic, in the page accent.
 * Goes on a span inside a `text()` heading and keeps its size. The colours
 * are the `headlineAccent` semantic tokens, the only place to change them
 * (`preset/semantic-tokens.ts`). Bermia has no italic file, so the browser
 * slants it. One static class per tone, see CLAUDE.md §7.
 */
const italic = css({ fontStyle: 'italic' });

export const headlineAccent = {
  coral: cx(italic, css({ color: 'headlineAccent.coral' })),
  mint: cx(italic, css({ color: 'headlineAccent.mint' })),
  yellow: cx(italic, css({ color: 'headlineAccent.yellow' })),
  sky: cx(italic, css({ color: 'headlineAccent.sky' })),
  gray: cx(italic, css({ color: 'headlineAccent.gray' })),
  // Gradient text, display and H2 sizes only (ADR 0002). `clone` repeats
  // the gradient and the padding on each line when the accent wraps. The
  // slanted glyphs overflow the box and `background-clip: text` paints only
  // inside it, so the padding widens the box and the negative margin keeps
  // the text where it was.
  ai: cx(
    italic,
    css({
      textGradient: 'headlineAccent.ai',
      boxDecorationBreak: 'clone',
      px: '[0.1em]',
      mx: '[-0.1em]',
    }),
  ),
} as const;

export type HeadlineAccentTone = keyof typeof headlineAccent;
