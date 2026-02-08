import { ChevronLeftCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { icon } from '@ocobo/styled-system/recipes';

import type { BlogpostFrontmatter, MarkdocFile } from '~/types';
import { url } from '~/utils/url';

import { PostHeader } from './PostHeader';
import { PostMetas } from './PostMetas';

import { LayoutPost } from '../LayoutPost';
import { PageMarkdownContainer } from '../PageMarkdownContainer';
import { PlayerYoutube } from '../PlayerYoutube';

interface BlogArticleProps {
  article: MarkdocFile<BlogpostFrontmatter>;
}

const BlogArticle: React.FunctionComponent<BlogArticleProps> = ({
  article,
}) => {
  const { t } = useTranslation('blog');

  return (
    <LayoutPost.Root>
      <LayoutPost.Aside>
        <PostMetas item={article.frontmatter} />
      </LayoutPost.Aside>

      <LayoutPost.Main>
        <p className={css({ mb: '4', fontSize: 'sm', color: 'gray.500' })}>
          <NavLink to={url.blog} className={flex({ align: 'center', gap: 2 })}>
            <ChevronLeftCircleIcon className={icon({ size: 'md' })} />
            {t('back')}
          </NavLink>
        </p>
        <PostHeader item={article.frontmatter} />
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
