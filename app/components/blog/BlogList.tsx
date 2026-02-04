import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';

import type { BlogpostFrontmatter, MarkdocFile } from '~/types';

import { BlogItem } from './BlogItem';

interface BlogListProps {
  items: MarkdocFile<BlogpostFrontmatter>[];
}

const BlogList: React.FunctionComponent<BlogListProps> = ({ items }) => {
  const { t } = useTranslation('blog');

  return (
    <div>
      {items.length === 0 ? (
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
            {t('empty.title')}
          </p>
          <p className={css({ fontSize: 'sm' })}>{t('empty.subtitle')}</p>
        </div>
      ) : (
        <ul
          className={css({
            py: { base: 6, lg: 12 },
            display: 'grid',
            gridTemplateColumns: { base: '1', lg: 'repeat(2, 1fr)' },
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
              <BlogItem slug={entry.slug} item={entry.frontmatter} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

BlogList.displayName = 'BlogList';

export { BlogList };
