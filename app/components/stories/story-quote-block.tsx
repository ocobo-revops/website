import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { StoryFrontmatter } from '~/types';

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
      className={`${flex({ direction: { base: 'column', md: 'row' }, align: 'center', gap: '10' })} ${css(
        {
          mt: '24',
          p: '10',
          bg: 'gray.50',
          rounded: '3xl',
          borderWidth: '1px',
          borderColor: 'gray.100',
        },
      )}`}
    >
      <div
        className={css({
          w: '32',
          h: '32',
          rounded: '3xl',
          overflow: 'hidden',
          filter: 'grayscale(100%)',
          borderWidth: '4px',
          borderColor: 'white',
          shadow: 'xl',
          transform: 'rotate(3deg)',
          flexShrink: 0,
        })}
      >
        <img
          src={`${ASSETS_BASE_URL}/clients/${slug}-avatar.png`}
          alt={item.speaker}
          loading="lazy"
          decoding="async"
          className={css({ w: 'full', h: 'full', objectFit: 'cover' })}
        />
      </div>
      <div className={css({ textAlign: { base: 'center', md: 'left' } })}>
        <p
          className={css({
            fontFamily: 'display',
            fontSize: '2xl',
            fontWeight: 'black',
            color: 'ocobo.dark',
            mb: '1',
          })}
        >
          {item.speaker}
        </p>
        <p
          className={css({
            fontSize: 'xs',
            fontWeight: 'black',
            color: 'ocobo.mint',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            mb: '4',
          })}
        >
          {item.role}
        </p>
        <p
          className={css({
            color: 'gray.500',
            fontSize: 'sm',
            lineHeight: 'relaxed',
            maxW: 'md',
          })}
        >
          <q>{quote}</q>
        </p>
      </div>
    </blockquote>
  );
};

StoryQuoteBlock.displayName = 'StoryQuoteBlock';

export { StoryQuoteBlock };
