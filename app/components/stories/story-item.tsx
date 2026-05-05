import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { flex, vstack } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { Tool } from '~/modules/content';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { url } from '~/utils/url';

interface StoryItemProps {
  item: MarkdocFile<StoryFrontmatter>['frontmatter'];
  slug: string;
  featuredTool?: Tool | null;
  index?: number;
}

const StoryItem: React.FunctionComponent<StoryItemProps> = React.memo(
  ({ item, slug, featuredTool = null, index = 0 }) => {
    const { t } = useTranslation('common');
    const storyUrl = `${url.stories}/${slug}`;

    return (
      <article
        className={css({
          bg: 'white',
          rounded: '3xl',
          shadow: 'sm',
          overflow: 'hidden',
          borderTopWidth: '4px',
          borderTopColor: 'ocobo.dark',
          transition: 'all',
          transitionDuration: '300ms',
          _hover: { shadow: 'soft-lg', transform: 'translateY(-4px)' },
          display: 'flex',
          flexDirection: { base: 'column', md: 'row' },
          h: 'full',
        })}
      >
        {/* Logo panel */}
        <NavLink
          to={storyUrl}
          tabIndex={-1}
          aria-hidden="true"
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bg: 'ocobo.dark',
            w: { base: 'full', md: '64' },
            minH: { base: '48', md: 'auto' },
            p: '8',
          })}
        >
          <img
            src={`${ASSETS_BASE_URL}/clients/${slug}-white.png`}
            alt=""
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
            width={120}
            height={48}
            className={css({
              w: 'auto',
              h: '12',
              maxW: '36',
              objectFit: 'contain',
            })}
          />
        </NavLink>

        {/* Content */}
        <div
          className={`${vstack({ alignItems: 'start', gap: '3' })} ${css({
            p: '8',
            flex: '1',
          })}`}
        >
          <span
            className={css({
              fontSize: 'xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'gray.400',
            })}
          >
            {item.name}
          </span>

          <h2
            className={cx(
              text({ variant: 'display-card' }),
              css({
                fontFamily: 'display',
                fontSize: { base: 'xl', md: '2xl' },
                fontWeight: 'bold',
                color: 'ocobo.dark',
                lineHeight: 'tight',
                letterSpacing: 'tight',
              }),
            )}
          >
            <NavLink
              to={storyUrl}
              className={css({
                transition: 'colors',
                _hover: { color: 'black' },
              })}
            >
              {item.title}
            </NavLink>
          </h2>

          <p className={css({ fontSize: 'sm', color: 'gray.500' })}>
            {item.speaker}
            {' · '}
            <span className={css({ color: 'gray.400' })}>{item.role}</span>
          </p>

          {featuredTool ? (
            <span
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'xs',
                fontWeight: 'bold',
                color: 'gray.700',
                borderWidth: '1px',
                borderColor: 'gray.200',
                rounded: 'full',
                px: '3',
                py: '1',
                bg: 'gray.50',
              })}
            >
              {featuredTool.iconUrl ? (
                <img
                  src={featuredTool.iconUrl}
                  alt=""
                  aria-hidden="true"
                  width={14}
                  height={14}
                  loading="lazy"
                  decoding="async"
                  className={css({
                    w: '[14px]',
                    h: '[14px]',
                    objectFit: 'contain',
                  })}
                />
              ) : null}
              {featuredTool.name}
            </span>
          ) : null}

          <div className={css({ mt: 'auto', pt: '4' })}>
            <NavLink
              to={storyUrl}
              className={`${flex({ align: 'center', gap: '2' })} ${css({
                fontSize: 'xs',
                fontWeight: 'black',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'ocobo.dark',
                transition: 'gap',
                _hover: { gap: '3' },
              })}`}
            >
              {t('see_more')}
              <ArrowRight size={14} className={css({ flexShrink: 0 })} />
            </NavLink>
          </div>
        </div>
      </article>
    );
  },
);

StoryItem.displayName = 'StoryItem';

export { StoryItem };
