import { ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import type { Member } from '~/modules/content/members';
import type { TocEntry } from '~/modules/content/toc';
import type { BlogpostFrontmatter, MarkdocFile } from '~/types';
import { url } from '~/utils/url';

import { BlogToc } from './blog-toc';
import { PostHeader } from './post-header';

import { LayoutPost } from '../LayoutPost';
import { PageMarkdownContainer } from '../PageMarkdownContainer';
import { PlayerYoutube } from '../PlayerYoutube';
import { MemberCard } from '../member/member-card';

interface BlogArticleProps {
  article: MarkdocFile<BlogpostFrontmatter>;
  toc: TocEntry[];
  intro: string | null;
  author: Member | null;
}

const BlogArticle: React.FunctionComponent<BlogArticleProps> = ({
  article,
  toc,
  intro,
  author,
}) => {
  const { t } = useTranslation('blog');

  return (
    <div>
      <div className={css({ mb: '12' })}>
        <NavLink
          to={url.blog}
          className={`${flex({ gap: '2', align: 'center' })} ${css({
            display: 'inline-flex',
            color: 'gray.400',
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            fontSize: 'xs',
            transition: 'colors',
            _hover: { color: 'ocobo.dark' },
          })}`}
        >
          <ArrowLeftIcon size={14} className={css({ mr: '2' })} />
          {t('back')}
        </NavLink>
      </div>

      <PostHeader item={article.frontmatter} />

      <LayoutPost.Root>
        <LayoutPost.Aside>
          <BlogToc entries={toc} />
        </LayoutPost.Aside>

        <LayoutPost.Main>
          {intro && (
            <p
              className={css({
                fontStyle: 'italic',
                fontSize: { base: 'lg', md: 'xl' },
                color: 'gray.600',
                lineHeight: 'relaxed',
                mb: '8',
              })}
            >
              <span
                className={css({ color: 'ocobo.coral', fontStyle: 'normal' })}
              >
                {'— '}
              </span>
              {intro}
            </p>
          )}
          <PageMarkdownContainer content={article.content} />
          {article.frontmatter.youtubeId && (
            <PlayerYoutube
              id={article.frontmatter.youtubeId}
              className={css({ mt: 8 })}
            />
          )}
          {author && (
            <div
              className={css({
                mt: '16',
                pt: '12',
                borderTopWidth: '1px',
                borderColor: 'gray.100',
              })}
            >
              <div
                className={css({
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  color: 'gray.400',
                  mb: '6',
                })}
              >
                {t('author.heading')}
              </div>
              <MemberCard member={author} />
            </div>
          )}
        </LayoutPost.Main>
      </LayoutPost.Root>
    </div>
  );
};

BlogArticle.displayName = 'BlogArticle';

export { BlogArticle };
