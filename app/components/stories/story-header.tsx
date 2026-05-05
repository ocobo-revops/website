import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { StoryFrontmatter } from '~/types';

import { StorySpeaker } from './story-speaker';

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
      className={css({
        mb: '8',
      })}
    >
      <h1
        className={cx(
          text({ variant: 'display-heading', color: 'dark' }),
          css({
            fontSize: { base: '2xl', md: '3xl', lg: '4xl' },
            color: 'ocobo.dark',
            letterSpacing: 'tight',
          }),
        )}
      >
        {item.title}
      </h1>
      <StorySpeaker item={item} slug={slug} />
    </header>
  );
};

StoryHeader.displayName = 'StoryHeader';

export { StoryHeader };
