import { css } from '@ocobo/styled-system/css';

import { BlogpostFrontmatter } from '~/types';

interface BlogpostHeaderProps {
  item: BlogpostFrontmatter;
}

const PostHeader: React.FunctionComponent<BlogpostHeaderProps> = ({ item }) => {
  return (
    <header
      className={css({
        mb: '8',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontSize: { base: '4xl', md: '6xl' },
          fontWeight: 'bold',
          color: 'ocobo.dark',
          lineHeight: '0.95',
          letterSpacing: 'tight',
        })}
      >
        {item.title}
      </h1>

      <p
        className={css({
          fontSize: { base: 'lg', md: 'xl' },
          color: 'gray.600',
          fontWeight: 'medium',
          lineHeight: 'relaxed',
          borderLeftWidth: '4px',
          borderColor: 'ocobo.sky',
          pl: '6',
          mt: '6',
        })}
      >
        {item.exerpt || item.description}
      </p>

      <img
        src={item.image}
        alt=""
        className={css({
          display: 'block',
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '2xl',
          my: 10,
        })}
      />
    </header>
  );
};

PostHeader.displayName = 'PostHeader';

export { PostHeader };
