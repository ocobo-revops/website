export const designSystemDescription =
  "ensemble de composants réutilisables, guidés par des principes de design, qui peuvent être assemblés pour construire n'importe quel nombre d'applications.";

type DesignSystemSubpage = {
  to: string;
  title: string;
  description: string;
};

/** The `/design-system` subpages, in navigation order. */
export const designSystemSubpages = [
  {
    to: '/design-system/foundations',
    title: 'Foundations',
    description:
      'v2 tokens, typography, colours, borders, icons, logo, illustrations and grid.',
  },
  {
    to: '/design-system/components',
    title: 'Components',
    description:
      'Buttons, badges, eyebrow, forms, meta pill, card recipe, flip card, person card, tooltip and tabs.',
  },
  {
    to: '/design-system/patterns',
    title: 'Patterns',
    description: 'Navbar and footer, bow tie and motion.',
  },
] as const satisfies readonly DesignSystemSubpage[];
