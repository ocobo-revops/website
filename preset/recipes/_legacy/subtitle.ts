import { defineRecipe } from '@pandacss/dev';

export const subtitle = defineRecipe({
  className: 'subtitle',
  description: 'heading of grouping of content',
  base: {
    display: 'inline-block',
    p: '0.5em 1em',
    bg: 'dark',
    color: 'white',
    textTransform: 'uppercase',
    textStyle: 'large',
    fontWeight: 'bold',
    position: 'relative',
  },
});
