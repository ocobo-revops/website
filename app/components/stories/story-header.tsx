import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { StoryFrontmatter } from '~/types';

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
      className={`${flex({ direction: { base: 'column', lg: 'row' }, gap: '12', align: 'start' })} ${css({ mb: '12' })}`}
    >
      <div className={css({ flex: '1', minW: '0' })}>
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
          {item.title}
        </h1>
        <p
          className={css({
            mt: '6',
            fontSize: { base: 'md', md: 'lg' },
            color: 'gray.600',
            lineHeight: 'relaxed',
          })}
        >
          {item.description}
        </p>
      </div>

      <div
        className={css({
          flexShrink: 0,
          pt: { lg: '16' },
        })}
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
            className={css({
              h: '12',
              w: 'auto',
              maxW: '32',
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
