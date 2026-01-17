import { css } from '@ocobo/styled-system/css';
import type { OfferFrontmatter } from '~/modules/schemas';

interface OfferHeaderProps {
  frontmatter: OfferFrontmatter;
}

export function OfferHeader({ frontmatter }: OfferHeaderProps) {
  return (
    <header className={css({ marginBottom: '8' })}>
      <h1
        className={css({
          fontSize: '3xl',
          fontWeight: 'bold',
          marginBottom: '4',
        })}
      >
        {frontmatter.title}
      </h1>
      <p className={css({ fontSize: 'lg', color: 'gray.600' })}>
        {frontmatter.description}
      </p>
    </header>
  );
}
