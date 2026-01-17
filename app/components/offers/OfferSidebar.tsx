import { css } from '@ocobo/styled-system/css';
import type { OfferFrontmatter } from '~/modules/schemas';

interface OfferSidebarProps {
  frontmatter: OfferFrontmatter;
}

export function OfferSidebar({ frontmatter }: OfferSidebarProps) {
  return (
    <aside className={css({ position: 'sticky', top: '4' })}>
      <div
        className={css({
          backgroundColor: 'gray.50',
          padding: '6',
          borderRadius: 'md',
        })}
      >
        <h3
          className={css({
            fontSize: 'lg',
            fontWeight: 'bold',
            marginBottom: '4',
          })}
        >
          Détails du poste
        </h3>

        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '3',
          })}
        >
          <div>
            <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>
              Type de contrat
            </div>
            <div>{frontmatter.contractType}</div>
          </div>

          <div>
            <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>
              Localisation
            </div>
            <div>{frontmatter.location}</div>
          </div>

          <div>
            <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>
              Expérience
            </div>
            <div>{frontmatter.experience}</div>
          </div>

          <div>
            <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>
              Formation
            </div>
            <div>{frontmatter.education}</div>
          </div>

          {frontmatter.department && (
            <div>
              <div
                className={css({ fontWeight: 'semibold', marginBottom: '1' })}
              >
                Département
              </div>
              <div>{frontmatter.department}</div>
            </div>
          )}

          {frontmatter.salary && (
            <div>
              <div
                className={css({ fontWeight: 'semibold', marginBottom: '1' })}
              >
                Salaire
              </div>
              <div>{frontmatter.salary}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
