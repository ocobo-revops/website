import { css } from '@ocobo/styled-system/css';

import type { JobFrontmatter } from '~/modules/schemas';

type HeaderProps = {
  frontmatter: JobFrontmatter;
};

export function Header({ frontmatter }: HeaderProps) {
  return (
    <div>
      <div className={css({ fontSize: '4xl' })}>{frontmatter.icon}</div>
      <h2
        className={css({
          fontFamily: 'display',
          fontSize: { base: '2xl', md: '3xl' },
          fontWeight: 'bold',
          color: 'ocobo.dark',
          mt: '4',
        })}
      >
        {frontmatter.title}
      </h2>
      <div
        className={css({
          display: 'flex',
          gap: '4',
          flexWrap: 'wrap',
          mt: '4',
          color: 'ocobo.dark/60',
          fontSize: 'sm',
        })}
      >
        <span>{frontmatter.contractType}</span>
        <span>{frontmatter.location}</span>
        <span>{frontmatter.seniority}</span>
      </div>
    </div>
  );
}
