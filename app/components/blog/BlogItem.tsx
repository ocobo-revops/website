import { CoffeeIcon, DotIcon, PenToolIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex, vstack } from '@ocobo/styled-system/patterns';
import { icon, link } from '@ocobo/styled-system/recipes';

import type { BlogpostFrontmatter, MarkdocFile } from '~/types';
import { getAuthor, getTag } from '~/utils/labels';
import { url } from '~/utils/url';

import { Tag } from '../ui/Tag';

interface BlogItemProps {
  item: MarkdocFile<BlogpostFrontmatter>['frontmatter'];
  slug: string;
  index: number;
}

const BlogItem: React.FunctionComponent<BlogItemProps> = React.memo(
  ({ item, slug }) => {
    const { t } = useTranslation('blog');

    return (
      <article
        className={`${vstack({ alignItems: 'stretch', gap: '5' })} ${css({
          position: 'relative',
          height: 'full',
          bg: 'white',
          borderWidth: '1px',
          borderColor: 'gray.100',
          rounded: '2xl',
          shadow: 'sm',
          transition: 'all',
          overflow: 'hidden',
          _hover: { shadow: '2xl', transform: 'translateY(-4px)' },
        })}`}
      >
        <NavLink
          to={`${url.blog}/${slug}`}
          className={css({ display: 'block' })}
        >
          <div
            className={css({
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '16/9',
              bg: 'gray.50',
            })}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className={css({ w: 'full', h: 'full', objectFit: 'cover' })}
            />
          </div>
        </NavLink>

        <div className={css({ px: '6', pb: '6' })}>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: '2xl', md: '3xl' },
              fontWeight: 'bold',
              color: 'ocobo.dark',
              mb: '3',
            })}
          >
            {item.title}
          </h2>

          <div
            className={css({
              display: 'flex',
              gap: '2',
              alignItems: 'center',
              my: 4,
              fontSize: 'sm',
              color: 'gray.500',
            })}
          >
            <PenToolIcon className={icon({ size: 'md' })} />
            {getAuthor(item.author)}
            <DotIcon className={icon({ size: 'md' })} />
            <CoffeeIcon className={icon({ size: 'md' })} />
            {item.read}
          </div>

          <ul className={flex({ gap: 3, alignItems: 'center', my: 4 })}>
            {item.tags.map((item) => {
              return (
                <li key={item} className={css({})}>
                  <Tag>{getTag(item)}</Tag>
                </li>
              );
            })}
          </ul>

          <p
            className={css({
              hideBelow: 'lg',
              lineClamp: 4,
              color: 'gray.600',
              fontSize: 'sm',
              lineHeight: 'relaxed',
            })}
          >
            {item.description}
          </p>
        </div>
        <p
          className={css({
            fontSize: 'sm',
            px: '6',
            pb: '6',
            mt: 'auto',
          })}
        >
          <NavLink to={`${url.blog}/${slug}`} className={link()}>
            {t('see_more', { ns: 'common' })}
          </NavLink>
        </p>
      </article>
    );
  },
);

BlogItem.displayName = 'BlogItem';

export { BlogItem };
