import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';

import type { MarkdocFile, StoryFrontmatter } from '~/types';

import { StoryItem } from './StoryItem';

interface StoryListProps {
  items: MarkdocFile<StoryFrontmatter>[];
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
          className={css({
            fontFamily: 'display',
            fontSize: { base: 'xl', md: '2xl' },
            fontWeight: 'bold',
            color: 'ocobo.dark',
            mb: '4',
          })}
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
        gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)' },
        gap: 10,
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
          <StoryItem slug={entry.slug} item={entry.frontmatter} index={i} />
        </li>
      ))}
    </ul>
  );
};

StoryList.displayName = 'StoryList';

export { StoryList };
