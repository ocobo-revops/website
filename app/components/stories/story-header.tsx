import { css, cx } from '@ocobo/styled-system/css';
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
    <header className={css({ mb: '10' })}>
      <div
        className={css({
          display: 'inline-block',
          bg: 'ocobo.dark',
          p: '5',
          rounded: '2xl',
          shadow: 'xl',
          transform: 'rotate(-3deg)',
          mb: '8',
        })}
      >
        <img
          src={`${ASSETS_BASE_URL}/clients/${slug}-white.png`}
          alt={item.name}
          loading="eager"
          decoding="async"
          width={80}
          height={40}
          className={css({
            w: '80px',
            h: '40px',
            objectFit: 'contain',
            display: 'block',
          })}
        />
      </div>
      <h1
        className={cx(
          text({ variant: 'display-xl', color: 'dark' }),
          css({
            fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
            letterSpacing: 'tight',
          }),
        )}
      >
        {item.title}
      </h1>
      <p
        className={css({
          mt: '4',
          fontSize: { base: 'md', md: 'lg' },
          color: 'gray.600',
          lineHeight: 'relaxed',
        })}
      >
        {item.description}
      </p>
    </header>
  );
};

StoryHeader.displayName = 'StoryHeader';

export { StoryHeader };
