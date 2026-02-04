import { css } from '@ocobo/styled-system/css';

import { StoryFrontmatter } from '~/types';

import { StorySpeaker } from './StorySpeaker';

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
        className={css({
          fontFamily: 'display',
          fontSize: { base: '2xl', md: '3xl', lg: '4xl' },
          fontWeight: 'bold',
          color: 'ocobo.dark',
          letterSpacing: 'tight',
        })}
      >
        {item.title}
      </h1>
      <StorySpeaker item={item} slug={slug} />
    </header>
  );
};

StoryHeader.displayName = 'StoryHeader';

export { StoryHeader };
