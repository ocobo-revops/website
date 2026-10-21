import { Config } from '@pandacss/dev';

import { animate } from './animate';
import { backgroundAlpha } from './background-alpha';
import { space } from './space';
import { transform } from './transform';

export const utilities: Config['utilities'] = {
  extend: {
    ...animate,
    ...space,
    ...transform,
    ...backgroundAlpha,

    grid: {
      className: 'grid',
      values: ['2', '3', '4'],
      transform(value) {
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
          gap: '1rem',
        };
      },
    },
    bleft: {
      className: 'bleft',
      values: ['yellow', 'sky', 'mint', 'coral'],
      transform(value) {
        return {
          paddingLeft: '1rem',
          borderLeft: '10px solid var(--colors-' + value + ')',
        };
      },
    },
  },
};
