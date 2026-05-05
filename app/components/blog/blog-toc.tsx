import { css, cx } from '@ocobo/styled-system/css';

import { useActiveSection } from '~/hooks/use-active-section';
import type { TocEntry } from '~/modules/content/toc';

interface BlogTocProps {
  entries: TocEntry[];
}

const BlogToc: React.FunctionComponent<BlogTocProps> = ({ entries }) => {
  const ids = entries.map((e) => e.id);
  const activeId = useActiveSection(ids);

  if (entries.length === 0) return null;

  return (
    <nav
      className={css({
        mb: 4,
        borderLeft: '2px solid',
        borderColor: 'gray.200',
        pl: 3,
      })}
    >
      <ul className={css({ listStyle: 'none', p: 0, m: 0 })}>
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={css({
              pl: entry.level === 3 ? 3 : 0,
              mb: 1,
            })}
          >
            <a
              href={`#${entry.id}`}
              className={cx(
                css({
                  display: 'block',
                  fontSize: 'xs',
                  lineHeight: '1.4',
                  py: '0.5',
                  color: 'gray.500',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                  _hover: { color: 'ocobo.dark' },
                }),
                activeId === entry.id &&
                  css({
                    color: 'ocobo.dark',
                    fontWeight: 'semibold',
                  }),
              )}
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

BlogToc.displayName = 'BlogToc';

export { BlogToc };
