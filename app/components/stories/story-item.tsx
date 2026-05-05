import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { hstack, vstack } from '@ocobo/styled-system/patterns';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { Tool } from '~/modules/content';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { url } from '~/utils/url';

interface StoryItemProps {
  item: MarkdocFile<StoryFrontmatter>['frontmatter'];
  slug: string;
  featuredTool?: Tool | null;
  resolvedTools?: Tool[];
  index?: number;
}

const cardClass = css({
  position: 'relative',
  bg: 'white',
  borderWidth: '1px',
  borderColor: 'gray.100',
  rounded: '3xl',
  p: '6',
  transition: 'all',
  transitionDuration: '500ms',
  overflow: 'hidden',
  h: 'full',
  _hover: { shadow: 'soft-lg', transform: 'translateY(-8px)' },
  '& .main-img': { transition: 'all', transitionDuration: '700ms' },
  '&:hover .main-img': {
    filter: 'grayscale(0)',
    opacity: 1,
    transform: 'scale(1.05)',
  },
  '& .logo-overlay': { transition: 'all', transitionDuration: '500ms' },
  '&:hover .logo-overlay': { opacity: 1, transform: 'translateY(0)' },
  '& .arrow': { transition: 'all' },
  '&:hover .arrow': { color: 'ocobo.dark', transform: 'translateX(4px)' },
});

const StoryItem: React.FunctionComponent<StoryItemProps> = React.memo(
  ({ item, slug, featuredTool = null, resolvedTools = [], index = 0 }) => {
    const { t } = useTranslation('common');
    const storyUrl = `${url.stories}/${slug}`;

    return (
      <article className={`${vstack()} ${cardClass}`}>
        {/* Image with featured tool overlay (on hover) */}
        <NavLink
          to={storyUrl}
          className={css({
            position: 'relative',
            aspectRatio: '16/10',
            overflow: 'hidden',
            rounded: '2xl',
            bg: 'gray.50',
            mb: '4',
            display: 'block',
            w: 'full',
            flexShrink: 0,
          })}
        >
          <img
            src={`${ASSETS_BASE_URL}/clients/${slug}-avatar.png`}
            alt={item.name}
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
            width={600}
            height={375}
            className={cx(
              'main-img',
              css({
                w: 'full',
                h: 'full',
                objectFit: 'cover',
                filter: 'grayscale(100%)',
                opacity: 0.8,
              }),
            )}
          />
          {featuredTool?.iconUrl ? (
            <div
              className={cx(
                'logo-overlay',
                css({
                  position: 'absolute',
                  bottom: '4',
                  right: '4',
                  bg: 'ocobo.dark',
                  p: '3',
                  rounded: 'xl',
                  shadow: '2xl',
                  opacity: 0,
                  transform: 'translateY(8px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2',
                }),
              )}
            >
              <img
                src={featuredTool.iconUrl}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={20}
                height={20}
                className={css({
                  h: '5',
                  w: '5',
                  objectFit: 'contain',
                })}
              />
              <span
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  color: 'white',
                })}
              >
                {featuredTool.name}
              </span>
            </div>
          ) : null}
        </NavLink>

        {/* Content */}
        <div className={`${vstack()} ${css({ flexGrow: 1, w: 'full' })}`}>
          {/* Company eyebrow */}
          <div className={hstack({ gap: '2', mb: '2' })}>
            <span
              className={css({
                fontSize: 'xs',
                fontWeight: 'black',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'ocobo.dark',
              })}
            >
              {item.name}
            </span>
          </div>

          {/* Title */}
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: '2xl',
              fontWeight: 'bold',
              color: 'ocobo.dark',
              lineHeight: 'tight',
              mb: '2',
              letterSpacing: 'tight',
            })}
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

          {/* Speaker + client logo */}
          <div
            className={hstack({
              gap: '3',
              alignItems: 'center',
              mb: '4',
              w: 'full',
            })}
          >
            <img
              src={`${ASSETS_BASE_URL}/clients/${slug}-white.png`}
              alt={item.name}
              loading="lazy"
              decoding="async"
              width={48}
              height={16}
              className={css({
                h: '4',
                w: 'auto',
                maxW: '20',
                objectFit: 'contain',
                flexShrink: 0,
                filter: 'brightness(0)',
              })}
            />
            <div className={css({ flex: 1, minW: 0 })}>
              <span
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  color: 'ocobo.dark',
                  opacity: 0.6,
                  display: 'block',
                })}
              >
                {item.speaker}
              </span>
              <span
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'medium',
                  color: 'gray.400',
                })}
              >
                {item.role}
              </span>
            </div>
          </div>

          {/* Tool chips */}
          {resolvedTools.length > 0 ? (
            <div
              className={css({
                w: 'full',
                mb: '4',
                pt: '3',
                borderTopWidth: '1px',
                borderColor: 'gray.100',
              })}
            >
              <span
                className={css({
                  display: 'block',
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: 'gray.400',
                  mb: '2',
                })}
              >
                {t('clients.techStack')}
              </span>
              <div className={hstack({ gap: '2', flexWrap: 'wrap' })}>
                {resolvedTools.map((tool) => (
                  <span
                    key={tool.slug}
                    className={css({
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '1.5',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                      color: 'gray.700',
                      borderWidth: '1px',
                      borderColor: 'gray.200',
                      rounded: 'full',
                      px: '2.5',
                      py: '1',
                      bg: 'gray.50',
                    })}
                  >
                    {tool.iconUrl ? (
                      <img
                        src={tool.iconUrl}
                        alt=""
                        aria-hidden="true"
                        width={12}
                        height={12}
                        loading="lazy"
                        decoding="async"
                        className={css({
                          w: '[12px]',
                          h: '[12px]',
                          objectFit: 'contain',
                        })}
                      />
                    ) : null}
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Read more */}
          <div className={css({ mt: 'auto' })}>
            <NavLink
              to={storyUrl}
              className={`${hstack({ gap: '2' })} ${css({
                fontSize: 'xs',
                fontWeight: 'black',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'gray.400',
                display: 'inline-flex',
              })}`}
            >
              {t('see_more')}
              <ArrowRight
                size={14}
                className={cx(
                  'arrow',
                  css({ color: 'gray.300', flexShrink: 0 }),
                )}
              />
            </NavLink>
          </div>
        </div>
      </article>
    );
  },
);

StoryItem.displayName = 'StoryItem';

export { StoryItem };
