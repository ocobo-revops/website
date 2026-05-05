import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { flex, grid } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import type { ResolvedAuthor } from '~/modules/content/members';
import type { BlogpostFrontmatter, MarkdocFile } from '~/types';
import { url } from '~/utils/url';

import { BlogItem } from './blog-item';

type BlogListItem = MarkdocFile<BlogpostFrontmatter> & {
  resolvedAuthor: ResolvedAuthor;
};

interface BlogListProps {
  items: BlogListItem[];
}

const BlogList: React.FunctionComponent<BlogListProps> = ({ items }) => {
  const { t } = useTranslation('blog');

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
            css({ fontSize: { base: 'xl', md: '2xl' }, mb: '4' }),
          )}
        >
          {t('empty.title')}
        </p>
        <p className={css({ fontSize: 'sm' })}>{t('empty.subtitle')}</p>
      </div>
    );
  }

  const [featured, ...rest] = items;

  return (
    <div className={css({ py: { base: 8, lg: 16 } })}>
      {/* Featured post */}
      <NavLink
        to={`${url.blog}/${featured.slug}`}
        className={`${grid({ columns: { base: 1, md: 2 } })} ${css({
          rounded: '3xl',
          overflow: 'hidden',
          bg: 'ocobo.dark',
          color: 'white',
          shadow: '2xl',
          mb: '16',
          transition: 'transform',
          _hover: { transform: 'translateY(-4px)' },
        })}`}
      >
        {/* Image */}
        <div
          className={css({
            position: 'relative',
            overflow: 'hidden',
            minH: { base: '56', md: 'auto' },
          })}
        >
          <img
            src={featured.frontmatter.image}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className={css({
              position: 'absolute',
              inset: 0,
              w: 'full',
              h: 'full',
              objectFit: 'cover',
              opacity: 0.8,
            })}
          />
          <div
            className={css({
              position: 'absolute',
              inset: 0,
              bgGradient: 'to-r',
              gradientFrom: 'ocobo.dark/90',
              gradientTo: 'transparent',
            })}
          />
        </div>

        {/* Content */}
        <div
          className={`${flex({ direction: 'column', justify: 'center', align: 'start', gap: '0' })} ${css({ p: { base: '10', md: '16' } })}`}
        >
          <span
            className={css({
              bg: 'ocobo.yellow',
              color: 'ocobo.dark',
              px: '3',
              py: '1',
              rounded: 'base',
              fontSize: 'xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              mb: '6',
              display: 'inline-block',
            })}
          >
            {t('featured.badge')}
          </span>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: '2xl', md: '3xl' },
              fontWeight: 'bold',
              mb: '4',
              lineHeight: 'tight',
            })}
          >
            {featured.frontmatter.title}
          </h2>
          <p
            className={css({
              color: 'gray.400',
              mb: '8',
              lineHeight: 'relaxed',
              fontSize: 'sm',
            })}
          >
            {featured.frontmatter.description}
          </p>
          <span
            className={`${flex({ align: 'center', gap: '2' })} ${css({
              bg: 'white',
              color: 'ocobo.dark',
              px: '6',
              py: '3',
              rounded: 'full',
              fontSize: 'sm',
              fontWeight: 'bold',
            })}`}
          >
            {t('see_more', { ns: 'common' })}
            <ArrowRight size={14} />
          </span>
        </div>
      </NavLink>

      {/* Rest of posts */}
      {rest.length > 0 && (
        <ul
          className={`${grid({ columns: { base: 1, md: 2, lg: 3 }, gap: '8' })} ${css({ rowGap: '12' })}`}
        >
          {rest.map((entry, i) => (
            <li key={entry.slug}>
              <BlogItem
                slug={entry.slug}
                item={entry.frontmatter}
                index={i + 1}
                resolvedAuthor={entry.resolvedAuthor}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

BlogList.displayName = 'BlogList';

export { BlogList };
