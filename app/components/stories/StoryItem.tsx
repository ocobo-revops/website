import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { vstack } from '@ocobo/styled-system/patterns';
import { link } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { url } from '~/utils/url';

interface StoryItemProps {
  item: MarkdocFile<StoryFrontmatter>['frontmatter'];
  slug: string;
  index?: number;
}

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
          className={css({ display: 'block' })}
        >
          <div
            className={css({
              position: 'relative',
              overflow: 'hidden',
              height: '280px',
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
                _groupHover: {
                  filter: 'brightness(1)',
                },
              })}
            />
            <div
              className={css({
                position: 'absolute',
                bottom: 0,
                right: 0,
                transform: 'translateY(50%)',
                bg: 'ocobo.dark',
                px: 3,
                py: 2,
                roundedTopLeft: 'lg',
              })}
            >
              <img
                src={`${ASSETS_BASE_URL}/clients/${slug}-white.png`}
                alt={item.name}
                loading="lazy"
                decoding="async"
                width={40}
                height={20}
                className={css({
                  w: '40px',
                  h: '20px',
                  objectFit: 'contain',
                })}
              />
            </div>
          </div>
        </NavLink>

        <div className={css({ px: '6' })}>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: 'xl', md: '2xl' },
              fontWeight: 'bold',
              color: 'ocobo.dark',
              pr: '60px',
            })}
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
          <NavLink to={`${url.stories}/${slug}`} className={link()}>
            {t('see_more')}
          </NavLink>
        </p>
      </article>
    );
  },
);

StoryItem.displayName = 'StoryItem';

export { StoryItem };
