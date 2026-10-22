export const designSystemDescription =
  "ensemble de composants réutilisables, guidés par des principes de design, qui peuvent être assemblés pour construire n'importe quel nombre d'applications.";

export const designSystemRoot = '/design-system';

export type DesignSystemPage = {
  slug: string;
  title: string;
  description: string;
  /**
   * Section titles in page order, as each `ShowcaseSection` shows them. They
   * feed the "On this page" list; the e2e spec checks they match the page.
   */
  sections: readonly string[];
};

type DesignSystemGroup = {
  title: string;
  pages: readonly DesignSystemPage[];
};

/**
 * The single list of `/design-system` pages, grouped. The sidebar, the index
 * and the "On this page" list read from it. A page is a route file
 * `app/routes/design-system.<slug>.tsx` that composes its section modules.
 */
export const designSystemGroups = [
  {
    title: 'Foundations',
    pages: [
      {
        slug: 'tokens',
        title: 'Tokens',
        description: 'Radii, shadows, easing, borders and grid.',
        sections: ['Radii', 'Shadows', 'Easing', 'Borders', 'Grid'],
      },
      {
        slug: 'colours',
        title: 'Colours',
        description: 'Greys, challenge colours, AI gradients and the palette.',
        sections: [
          'Greys and line',
          'Challenge colours',
          'AI gradients',
          'Colors',
        ],
      },
      {
        slug: 'typography',
        title: 'Typography',
        description: 'The v2 type scale, font sizes and the v1 text styles.',
        sections: ['Type scale (v2)', 'Font sizes and letter spacings', 'css'],
      },
      {
        slug: 'brand',
        title: 'Brand',
        description: 'Logo, icons and illustrations.',
        sections: ['Logo', 'Icons', 'Illustrations'],
      },
    ],
  },
  {
    title: 'Components',
    pages: [
      {
        slug: 'actions',
        title: 'Actions',
        description: 'Buttons, badges, eyebrow and meta pill.',
        sections: [
          'Buttons',
          'Button: secondary and link',
          'Badge: ai variant and xs size',
          'Eyebrow',
          'MetaPill',
        ],
      },
      {
        slug: 'forms',
        title: 'Forms',
        description: 'Inputs, select and form layout.',
        sections: ['Form'],
      },
      {
        slug: 'cards',
        title: 'Cards',
        description: 'The card recipe, flip card and person card.',
        sections: ['Card recipe', 'Flip card', 'Person card'],
      },
      {
        slug: 'tooltip-and-tabs',
        title: 'Tooltip and tabs',
        description: 'Tooltip and tabs.',
        sections: ['Tooltip', 'Tabs'],
      },
      {
        slug: 'navigation',
        title: 'Navigation',
        description: 'The v2 navbar and footer.',
        sections: ['Navbar and footer (v2)'],
      },
    ],
  },
  {
    title: 'Patterns',
    pages: [
      {
        slug: 'bow-tie',
        title: 'Bow tie',
        description: 'The bow tie diagram of the method.',
        sections: ['Bow tie'],
      },
      {
        slug: 'motion',
        title: 'Motion',
        description: 'Reveal on scroll and scroll progress.',
        sections: ['Motion'],
      },
    ],
  },
] as const satisfies readonly DesignSystemGroup[];

/** Every page, in registry order. */
export const designSystemPages = designSystemGroups.flatMap(
  (group): readonly DesignSystemPage[] => group.pages,
);

export function designSystemPagePath(slug: string) {
  return `${designSystemRoot}/${slug}`;
}

/** The registry entry for a pathname, or `undefined` on the index. */
export function findDesignSystemPage(pathname: string) {
  for (const group of designSystemGroups) {
    for (const page of group.pages) {
      if (pathname.replace(/\/$/, '') === designSystemPagePath(page.slug)) {
        return { group, page };
      }
    }
  }
  return undefined;
}
