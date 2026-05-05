import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';

import { useActiveSection } from '~/hooks/use-active-section';
import type { TocEntry } from '~/modules/content/toc';

interface BlogTocProps {
  entries: TocEntry[];
}

const linkBase = css({
  display: 'block',
  fontSize: 'sm',
  fontWeight: 'medium',
  lineHeight: '1.4',
  py: '1',
  pl: '4',
  borderLeftWidth: '2px',
  textDecoration: 'none',
  transition: 'all',
  transitionDuration: '300ms',
});

const linkInactive = css({
  color: 'gray.400',
  borderColor: 'gray.100',
  _hover: { color: 'gray.600', borderColor: 'gray.300' },
});

const linkActive = css({
  color: 'ocobo.dark',
  fontWeight: 'bold',
  borderColor: 'ocobo.yellow',
  transform: 'translateX(4px)',
  _hover: { color: 'ocobo.dark', borderColor: 'ocobo.yellow' },
});

const BlogToc: React.FunctionComponent<BlogTocProps> = ({ entries }) => {
  const { t } = useTranslation('blog');
  const ids = entries.map((e) => e.id);
  const activeId = useActiveSection(ids);

  if (entries.length === 0) return null;

  return (
    <nav aria-label={t('toc.label')} className={css({ mb: 4 })}>
      <ul
        className={css({
          listStyle: 'none',
          p: 0,
          m: 0,
          display: 'flex',
          flexDir: 'column',
          gap: '3',
        })}
      >
        {entries.map((entry) => (
          <li key={entry.id} className={css({ pl: entry.level === 3 ? 3 : 0 })}>
            <a
              href={`#${entry.id}`}
              className={cx(
                linkBase,
                activeId === entry.id ? linkActive : linkInactive,
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
