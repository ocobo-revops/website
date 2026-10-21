import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { ShowcaseSection } from './showcase-section';

// Design system v2 tokens (ADR 0002). Every class below is a static literal
// so Panda extracts it; see CLAUDE.md §7.

const caption = css({ fontSize: 'caption', color: 'gray' });
const swatch = css({
  h: '16',
  w: '16',
  rounded: 'lg',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'line',
});
const tile = css({ display: 'flex', flexDirection: 'column', gap: '2' });

const typeScale = [
  {
    name: 'display-xl',
    size: 'Display',
    className: text({ variant: 'display-xl' }),
  },
  {
    name: 'display-lg',
    size: 'H2',
    className: text({ variant: 'display-lg' }),
  },
  {
    name: 'display-md-bold',
    size: 'H3',
    className: text({ variant: 'display-md-bold' }),
  },
  { name: 'body', size: 'Body', className: text({ variant: 'body' }) },
  { name: 'small', size: 'Small', className: text({ variant: 'small' }) },
  { name: 'label', size: 'Label', className: text({ variant: 'label' }) },
];

const greys = [
  { name: 'gray.50', className: css({ bg: 'gray.50' }) },
  { name: 'gray.100', className: css({ bg: 'gray.100' }) },
  { name: 'gray.200', className: css({ bg: 'gray.200' }) },
  { name: 'gray.300', className: css({ bg: 'gray.300' }) },
  { name: 'gray.400', className: css({ bg: 'gray.400' }) },
  { name: 'gray (500)', className: css({ bg: 'gray.500' }) },
  { name: 'gray.600', className: css({ bg: 'gray.600' }) },
  { name: 'gray.700', className: css({ bg: 'gray.700' }) },
  { name: 'line', className: css({ bg: 'line' }) },
];

const challenges = [
  {
    key: 'rp',
    label: 'Revenue Performance',
    accent: css({ bg: 'challenge.rp' }),
    tint: css({ bg: 'challenge.rp.light' }),
  },
  {
    key: 'se',
    label: 'Sales Experience',
    accent: css({ bg: 'challenge.se' }),
    tint: css({ bg: 'challenge.se.light' }),
  },
  {
    key: 'sc',
    label: 'Sales Compensation',
    accent: css({ bg: 'challenge.sc' }),
    tint: css({ bg: 'challenge.sc.light' }),
  },
  {
    key: 'cx',
    label: 'Customer Experience',
    accent: css({ bg: 'challenge.cx' }),
    tint: css({ bg: 'challenge.cx.light' }),
  },
  {
    key: 'sy',
    label: 'Revenue Systems',
    accent: css({ bg: 'challenge.sy' }),
    tint: css({ bg: 'challenge.sy.light' }),
  },
  {
    key: 'ai',
    label: 'Revenue AI',
    accent: css({ bg: 'challenge.ai' }),
    tint: css({ bg: 'challenge.ai.light' }),
  },
];

const radii = [
  { name: 'S · lg (8px)', className: css({ rounded: 'lg' }) },
  { name: 'M · 2xl (16px)', className: css({ rounded: '2xl' }) },
  { name: 'L · 3xl (24px)', className: css({ rounded: '3xl' }) },
  { name: 'full', className: css({ rounded: 'full' }) },
];

const shadows = [
  { name: 'rest', className: css({ boxShadow: 'rest' }) },
  { name: 'hover', className: css({ boxShadow: 'hover' }) },
  { name: 'window', className: css({ boxShadow: 'window' }) },
];

const fontSizes = [
  { name: 'h3 (24px)', className: css({ fontSize: 'h3' }) },
  { name: 'body (17px)', className: css({ fontSize: 'body' }) },
  { name: 'caption (13px)', className: css({ fontSize: 'caption' }) },
  { name: 'label (11px)', className: css({ fontSize: 'label' }) },
  { name: 'micro (10px)', className: css({ fontSize: 'micro' }) },
];

const letterSpacings = [
  { name: 'label (.3em)', className: css({ letterSpacing: 'label' }) },
  { name: 'tag (.16em)', className: css({ letterSpacing: 'tag' }) },
  { name: 'chip (.08em)', className: css({ letterSpacing: 'chip' }) },
];

const surface = css({
  bg: 'white',
  h: '24',
  rounded: '2xl',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'line',
});

export function V2TokensSection() {
  return (
    <>
      <ShowcaseSection title="Type scale (v2)">
        <ul
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '6',
          })}
        >
          {typeScale.map((item) => (
            <li key={item.name} className={tile}>
              <span className={caption}>
                {item.size} · text({`{ variant: '${item.name}' }`})
              </span>
              <span className={item.className}>Revenue operations</span>
            </li>
          ))}
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="Greys and line">
        <ul className={grid({ columns: { base: 3, md: 9 }, gap: '4' })}>
          {greys.map((item) => (
            <li key={item.name} className={tile}>
              <span className={cx(swatch, item.className)} />
              <span className={caption}>{item.name}</span>
            </li>
          ))}
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="Challenge colours">
        <ul className={grid({ columns: { base: 2, md: 6 }, gap: '4' })}>
          {challenges.map((item) => (
            <li key={item.key} className={tile}>
              <span className={css({ display: 'flex', gap: '2' })}>
                <span className={cx(swatch, item.accent)} />
                <span className={cx(swatch, item.tint)} />
              </span>
              <span className={caption}>
                challenge.{item.key} · {item.label}
              </span>
            </li>
          ))}
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="AI gradients">
        <div
          className={css({
            h: '4',
            rounded: 'full',
            bgGradient: 'ai',
            mb: '4',
          })}
        />
        <p className={caption}>gradients.ai (decoration)</p>
        <p
          className={cx(
            text({ variant: 'display-lg' }),
            css({
              textGradient: 'ai-text',
              mt: '6',
            }),
          )}
        >
          Revenue AI
        </p>
        <p className={caption}>gradients.ai-text (display and H2 only)</p>
      </ShowcaseSection>

      <ShowcaseSection title="Radii">
        <ul className={grid({ columns: { base: 2, md: 4 }, gap: '6' })}>
          {radii.map((item) => (
            <li key={item.name} className={tile}>
              <span
                className={cx(css({ h: '20', bg: 'gray.100' }), item.className)}
              />
              <span className={caption}>{item.name}</span>
            </li>
          ))}
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="Shadows">
        <ul className={grid({ columns: { base: 1, md: 3 }, gap: '8' })}>
          {shadows.map((item) => (
            <li key={item.name} className={tile}>
              <span className={cx(surface, item.className)} />
              <span className={caption}>{item.name}</span>
            </li>
          ))}
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="Font sizes and letter spacings">
        <ul
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '3',
          })}
        >
          {fontSizes.map((item) => (
            <li key={item.name} className={item.className}>
              {item.name}
            </li>
          ))}
        </ul>
        <ul
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '3',
            mt: '6',
            fontSize: 'label',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          })}
        >
          {letterSpacings.map((item) => (
            <li key={item.name} className={item.className}>
              {item.name}
            </li>
          ))}
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="Easing">
        <div
          className={cx(
            surface,
            css({
              w: '40',
              boxShadow: 'rest',
              transition: 'common',
              transitionDuration: 'slower',
              transitionTimingFunction: 'smooth',
              _hover: { transform: 'translateY(-4px)', boxShadow: 'hover' },
            }),
          )}
        />
        <p className={cx(caption, css({ mt: '3' }))}>
          easings.smooth · cubic-bezier(.2, .8, .2, 1), hover the card
        </p>
      </ShowcaseSection>
    </>
  );
}
