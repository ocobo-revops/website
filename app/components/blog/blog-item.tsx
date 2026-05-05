import { CoffeeIcon, DotIcon, PenToolIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { circle, flex, vstack } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import type { ResolvedAuthor } from '~/modules/content/members';
import type { BlogpostFrontmatter, MarkdocFile } from '~/types';
import { getTag } from '~/utils/labels';
import { url } from '~/utils/url';

import { Avatar } from '../ui/Avatar';
import { Tag } from '../ui/Tag';

interface BlogItemProps {
  item: MarkdocFile<BlogpostFrontmatter>['frontmatter'];
  slug: string;
  index: number;
  resolvedAuthor: ResolvedAuthor;
}

const iconSizeMd = css({ h: '4', w: '4' });

const linkCss = cx(
  text({ variant: 'body' }),
  css({
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: '700',
    color: 'inherit',
    textDecoration: 'none',
    gap: '2',
    position: 'relative',
    pb: '2px',
    _before: {
      content: '""',
      display: 'inline-block',
      background: 'foreground',
      height: '[2px]',
      width: '[calc(100% - 40px)]',
      transition: 'all',
      position: 'absolute',
      bottom: 0,
    },
    _after: {
      content: '""',
      width: '[28px]',
      height: '[9px]',
      display: 'inline-block',
      position: 'relative',
      zIndex: '0',
      bg: 'currentColor',
      maskImage: `url("data:image/svg+xml,%3Csvg width='28' height='9' viewBox='0 0 28 9' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M27.3535 4.68388C27.5488 4.48862 27.5488 4.17204 27.3535 3.97678L24.1715 0.794796C23.9763 0.599534 23.6597 0.599534 23.4644 0.794796C23.2692 0.990058 23.2692 1.30664 23.4644 1.5019L26.2928 4.33033L23.4644 7.15876C23.2692 7.35402 23.2692 7.6706 23.4644 7.86586C23.6597 8.06113 23.9763 8.06113 24.1715 7.86586L27.3535 4.68388ZM0.473633 4.83033L27 4.83033V3.83033L0.473633 3.83033L0.473633 4.83033Z'/%3E%3C/svg%3E%0A")`,
    },
    _hover: {
      _before: {
        width: 'full',
      },
    },
    _focusVisible: {
      outline: 'none',
      _before: {
        height: '[4px]',
      },
    },
    '& svg': { marginLeft: '2' },
  }),
);

const BlogItem: React.FunctionComponent<BlogItemProps> = React.memo(
  ({ item, slug, resolvedAuthor }) => {
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
            className={cx(
              text({ variant: 'display-heading', color: 'dark' }),
              css({ mb: '3' }),
            )}
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
            {resolvedAuthor.avatar ? (
              <Avatar
                src={resolvedAuthor.avatar}
                alt=""
                className={circle({ size: '20px' })}
              />
            ) : (
              <PenToolIcon className={iconSizeMd} />
            )}
            {resolvedAuthor.name}
            <DotIcon className={iconSizeMd} />
            <CoffeeIcon className={iconSizeMd} />
            {item.read}
          </div>

          <ul className={flex({ gap: 3, alignItems: 'center', my: 4 })}>
            {item.tags.map((tag) => {
              return (
                <li key={tag} className={css({})}>
                  <Tag>{getTag(tag)}</Tag>
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
          <NavLink to={`${url.blog}/${slug}`} className={linkCss}>
            {t('see_more', { ns: 'common' })}
          </NavLink>
        </p>
      </article>
    );
  },
);

BlogItem.displayName = 'BlogItem';

export { BlogItem };
