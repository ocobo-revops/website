import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { hstack, vstack } from '@ocobo/styled-system/patterns';

import { useScrollSpy } from '~/hooks/useScrollSpy';

const SECTION_IDS = ['mission', 'responsabilites', 'profil'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function ScrollspyToc() {
  const { t } = useTranslation('jobs');
  const activeId = useScrollSpy(SECTION_IDS);

  return (
    <nav aria-label="Navigation">
      <h4
        className={css({
          fontFamily: 'display',
          fontWeight: 'black',
          fontSize: 'xs',
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          color: 'ocobo.dark',
          mb: '8',
        })}
      >
        Navigation
      </h4>
      <div className={vstack({ gap: '4', alignItems: 'stretch' })}>
        {SECTION_IDS.map((id) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={isActive ? 'location' : undefined}
              className={cx(
                hstack({ justify: 'space-between' }),
                css({
                  py: '2',
                  pl: '6',
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  transition: 'all',
                  borderLeftWidth: '2px',
                  _hover: { color: 'ocobo.dark' },
                }),
                isActive
                  ? css({
                      borderColor: 'ocobo.yellow',
                      color: 'ocobo.dark',
                      transform: 'translateX(8px)',
                    })
                  : css({ borderColor: 'gray.50', color: 'gray.300' }),
              )}
            >
              {t(`toc.${id as SectionId}`)}
              {isActive && (
                <ChevronRight
                  size={14}
                  className={css({ color: 'ocobo.yellow' })}
                />
              )}
            </a>
          );
        })}
        <a
          href="#apply"
          className={cx(
            hstack({ justify: 'space-between' }),
            css({
              py: '2',
              pl: '6',
              fontSize: 'xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              transition: 'all',
              borderLeftWidth: '2px',
              borderColor: activeId === null ? 'gray.50' : 'gray.50',
              color: 'ocobo.yellow',
              _hover: { color: 'ocobo.dark' },
            }),
          )}
        >
          {t('cta.apply')}
        </a>
      </div>
    </nav>
  );
}
