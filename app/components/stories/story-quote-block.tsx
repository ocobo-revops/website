import { css, cx } from '@ocobo/styled-system/css';
import { circle } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { StoryFrontmatter } from '~/types';

import { Avatar } from '../ui/Avatar';

interface StoryQuoteBlockProps {
  item: StoryFrontmatter;
  slug: string;
}

const StoryQuoteBlock: React.FunctionComponent<StoryQuoteBlockProps> = ({
  item,
  slug,
}) => {
  const quote = item.quotes[0];
  if (!quote) return null;

  return (
    <blockquote
      className={css({
        mt: '16',
        pt: '12',
        borderTopWidth: '1px',
        borderColor: 'gray.100',
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        gap: '8',
        alignItems: 'flex-start',
      })}
    >
      <div
        className={css({
          flexShrink: 0,
          transform: 'rotate(3deg)',
          shadow: 'md',
          rounded: 'full',
        })}
      >
        <Avatar
          src={`${ASSETS_BASE_URL}/clients/${slug}-avatar.png`}
          alt={item.speaker}
          loading="lazy"
          decoding="async"
          className={circle({ size: '80px' })}
        />
      </div>
      <div>
        <p
          className={cx(
            css({
              fontStyle: 'italic',
              fontSize: { base: 'lg', md: 'xl' },
              color: 'gray.700',
              lineHeight: 'relaxed',
              mb: '4',
            }),
          )}
        >
          « {quote} »
        </p>
        <footer>
          <cite
            className={cx(
              text({ variant: 'body' }),
              css({ fontStyle: 'normal', color: 'gray.500' }),
            )}
          >
            {item.speaker} · {item.role}
          </cite>
        </footer>
      </div>
    </blockquote>
  );
};

StoryQuoteBlock.displayName = 'StoryQuoteBlock';

export { StoryQuoteBlock };
