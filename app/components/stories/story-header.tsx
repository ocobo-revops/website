import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { StoryFrontmatter } from '~/types';

import { FrenchText } from '../typography/french-text';

interface StoryHeaderProps {
  item: StoryFrontmatter;
  slug: string;
}

const StoryHeader: React.FunctionComponent<StoryHeaderProps> = ({
  item,
  slug,
}) => {
  return (
    <header
      className={`${flex({ direction: { base: 'column', lg: 'row' }, gap: '16', align: 'start' })} ${css({ mb: '24' })}`}
    >
      <div className={css({ lg: { w: '2/3' } })}>
        <h1
          className={cx(
            text({ variant: 'display-xl', color: 'dark' }),
            css({
              fontSize: { base: '4xl', md: '5xl', lg: '6xl' },
              letterSpacing: 'tight',
              lineHeight: '0.95',
            }),
          )}
        >
          <FrenchText>{item.title}</FrenchText>
        </h1>
      </div>

      <div
        className={`${flex()} ${css({ lg: { w: '1/3', justifyContent: 'end', pt: '20' } })}`}
      >
        <div
          className={css({
            bg: 'ocobo.dark',
            p: '8',
            rounded: '3xl',
            shadow: '2xl',
            transform: 'rotate(2deg)',
            transition: 'transform',
            transitionDuration: '500ms',
            _hover: { transform: 'rotate(0deg)' },
          })}
        >
          <img
            src={`${ASSETS_BASE_URL}/clients/${slug}-white.png`}
            alt={item.name}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className={css({
              h: '10',
              w: 'auto',
              objectFit: 'contain',
              display: 'block',
            })}
          />
        </div>
      </div>
    </header>
  );
};

StoryHeader.displayName = 'StoryHeader';

export { StoryHeader };
