import { css, cx } from '@ocobo/styled-system/css';
import { useTranslation } from 'react-i18next';

import { useScrollSpy } from '~/hooks/useScrollSpy';

const SECTION_IDS = ['mission', 'competences', 'pourquoi'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function ScrollspyToc() {
  const { t } = useTranslation('jobs');
  const activeId = useScrollSpy(SECTION_IDS);

  return (
    <nav
      aria-label={t('toc.mission')}
      className={css({
        position: 'sticky',
        top: '8',
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
      })}
    >
      {SECTION_IDS.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={activeId === id ? 'location' : undefined}
          className={cx(
            css({
              fontSize: 'sm',
              fontWeight: 'medium',
              px: '3',
              py: '2',
              borderRadius: 'md',
              borderLeft: '2px solid',
              borderLeftColor: 'transparent',
              color: 'ocobo.dark/60',
              transition: 'all 0.15s',
              _hover: { color: 'ocobo.dark' },
            }),
            activeId === id
              ? css({
                  borderLeftColor: 'ocobo.dark',
                  color: 'ocobo.dark',
                  bg: 'gray.50',
                })
              : '',
          )}
        >
          {t(`toc.${id as SectionId}`)}
        </a>
      ))}
    </nav>
  );
}
