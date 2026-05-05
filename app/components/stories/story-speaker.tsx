import { css, cx } from '@ocobo/styled-system/css';
import { circle } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { Avatar } from '../ui/Avatar';

interface StorySpeakerProps {
  item: MarkdocFile<StoryFrontmatter>['frontmatter'];
  slug: string;
}

const StorySpeaker: React.FunctionComponent<StorySpeakerProps> = ({
  item,
  slug,
}) => {
  return (
    <div
      className={css({
        display: 'grid',
        alignItems: 'center',
        gap: 8,
        py: 6,

        md: {
          gridTemplateColumns: 'auto 1fr',
        },
      })}
    >
      <div>
        <Avatar
          src={`${ASSETS_BASE_URL}/clients/${slug}-avatar.png`}
          alt={item.name}
          className={circle({
            size: 140,
          })}
        />
      </div>
      <div>
        <div
          className={cx(
            text({ variant: 'display-card', color: 'dark' }),
            css({ color: 'ocobo.dark' }),
          )}
        >
          {item.speaker}
        </div>
        <div className={css({ fontStyle: 'italic', color: 'gray.600' })}>
          {item.role}
        </div>
        <div className={css({ color: 'gray.700', mt: 2 })}>
          {item.description}
        </div>
      </div>
    </div>
  );
};

StorySpeaker.displayName = 'StorySpeaker';

export { StorySpeaker };
