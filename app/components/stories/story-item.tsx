import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { vstack } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { url } from '~/utils/url';

interface StoryItemProps {
  item: MarkdocFile<StoryFrontmatter>['frontmatter'];
  slug: string;
  index?: number;
}

const speakerTextClass = text({ variant: 'display-card' });

const linkClass = cx(
  text({ variant: 'body' }),
  css({
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: '700',
    textDecoration: 'none',
    cursor: 'pointer',
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

const StoryItem: React.FunctionComponent<StoryItemProps> = React.memo(
  ({ item, slug, index = 0 }) => {
    const { t } = useTranslation('common');

    return (
      <article
        className={`${vstack({ alignItems: 'stretch', gap: '4' })} ${css({
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
          to={`${url.stories}/${slug}`}
          className={css({
            display: 'block',
            position: 'relative',
            mb: 4,
          })}
        >
          <div
            className={css({
              overflow: 'hidden',
              height: '280px',
              roundedTop: 'xl',
            })}
          >
            <img
              src={`${ASSETS_BASE_URL}/clients/${slug}-avatar.png`}
              alt={item.name}
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
              width={340}
              height={280}
              {...({ fetchpriority: index < 2 ? 'high' : 'auto' } as any)}
              className={css({
                w: 'full',
                h: 'full',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'brightness(0.75)',
                transition: 'filter 0.3s ease',
              })}
            />
          </div>
          <div
            className={css({
              position: 'absolute',
              bottom: 0,
              right: '16px',
              transform: 'translateY(50%)',
              bg: 'ocobo.dark',
              px: 4,
              py: 3,
              rounded: 'lg',
            })}
          >
            <img
              src={`${ASSETS_BASE_URL}/clients/${slug}-white.png`}
              alt={item.name}
              loading="lazy"
              decoding="async"
              width={60}
              height={28}
              className={css({
                w: '60px',
                h: '28px',
                objectFit: 'contain',
              })}
            />
          </div>
        </NavLink>

        <div className={css({ px: '6' })}>
          <h2
            className={cx(
              speakerTextClass,
              css({
                color: 'ocobo.dark',
                pr: '60px',
              }),
            )}
          >
            {item.speaker}
          </h2>
          <p
            className={css({
              fontStyle: 'italic',
              color: 'gray.600',
              fontSize: 'sm',
            })}
          >
            {item.role}
          </p>
        </div>

        <p
          className={css({
            px: '6',
            color: 'gray.700',
            lineClamp: 3,
            lineHeight: 'relaxed',
          })}
        >
          {item.title}
        </p>

        <p
          className={css({
            fontSize: 'sm',
            px: '6',
            pb: '6',
            mt: 'auto',
          })}
        >
          <NavLink to={`${url.stories}/${slug}`} className={linkClass}>
            {t('see_more')}
          </NavLink>
        </p>
      </article>
    );
  },
);

StoryItem.displayName = 'StoryItem';

export { StoryItem };
