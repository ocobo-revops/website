import { ChevronLeftCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import type { TocEntry } from '~/modules/content/toc';
import type { BlogpostFrontmatter, MarkdocFile } from '~/types';
import { url } from '~/utils/url';

import { BlogToc } from './blog-toc';
import { PostHeader } from './post-header';

import { LayoutPost } from '../LayoutPost';
import { PageMarkdownContainer } from '../PageMarkdownContainer';
import { PlayerYoutube } from '../PlayerYoutube';

interface BlogArticleProps {
  article: MarkdocFile<BlogpostFrontmatter>;
  toc: TocEntry[];
  intro: string | null;
}

const BlogArticle: React.FunctionComponent<BlogArticleProps> = ({
  article,
  toc,
  intro,
}) => {
  const { t } = useTranslation('blog');

  return (
    <LayoutPost.Root>
      <LayoutPost.Aside>
        <BlogToc entries={toc} />
      </LayoutPost.Aside>

      <LayoutPost.Main>
        <p className={css({ mb: '6', fontSize: 'sm', color: 'gray.500' })}>
          <NavLink to={url.blog} className={flex({ align: 'center', gap: 2 })}>
            <ChevronLeftCircleIcon className={css({ h: '4', w: '4' })} />
            {t('back')}
          </NavLink>
        </p>
        <PostHeader item={article.frontmatter} />
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
      </LayoutPost.Main>
    </LayoutPost.Root>
  );
};

BlogArticle.displayName = 'BlogArticle';

export { BlogArticle };
