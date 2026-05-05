import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type { Tool } from '~/modules/content';
import type { MarkdocFile, StoryFrontmatter } from '~/types';

import { StoryItem } from './story-item';

export type StoryListItem = MarkdocFile<StoryFrontmatter> & {
  featuredTool?: Tool | null;
};

interface StoryListProps {
  items: StoryListItem[];
}

const StoryList: React.FunctionComponent<StoryListProps> = ({ items }) => {
  const { t } = useTranslation('common');

  if (items.length === 0) {
    return (
      <div
        className={css({
          py: { base: 12, lg: 24 },
          textAlign: 'center',
          color: 'gray.600',
        })}
      >
        <p
          className={cx(
            text({ variant: 'display-card', color: 'dark' }),
            css({ color: 'ocobo.dark', mb: '4' }),
          )}
        >
          {t('clients.empty.title')}
        </p>
        <p className={css({ fontSize: 'sm' })}>{t('clients.empty.subtitle')}</p>
      </div>
    );
  }

  return (
    <ul
      className={css({
        py: { base: 6, lg: 12 },
        display: 'grid',
        gridTemplateColumns: {
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
        gap: 8,
        alignItems: 'stretch',
      })}
    >
      {items.map((entry, i) => (
        <li
          key={entry.slug}
          className={css({
            position: 'relative',
          })}
        >
          <StoryItem
            slug={entry.slug}
            item={entry.frontmatter}
            featuredTool={entry.featuredTool ?? null}
            index={i}
          />
        </li>
      ))}
    </ul>
  );
};

StoryList.displayName = 'StoryList';

export { StoryList };
