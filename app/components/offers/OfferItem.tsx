import { css } from '@ocobo/styled-system/css';
import { NavLink } from 'react-router';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import type { OfferFrontmatter } from '~/modules/schemas';
import { url } from '~/utils/url';

interface OfferItemProps {
  item: OfferFrontmatter;
  slug: string;
  index: number;
}

export function OfferItem({ item, slug }: OfferItemProps) {
  const getLocalizedPath = useLocalizedPathname();

  return (
    <article
      className={css({
        border: '1px solid',
        borderColor: 'gray.200',
        borderRadius: 'md',
        padding: '6',
        transition: 'all 0.2s',
        _hover: { borderColor: 'blue.500', boxShadow: 'md' },
      })}
    >
      <h2
        className={css({
          fontSize: 'xl',
          fontWeight: 'bold',
          marginBottom: '4',
        })}
      >
        {item.title}
      </h2>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2',
          marginBottom: '4',
        })}
      >
        <div className={css({ display: 'flex', gap: '2' })}>
          <span className={css({ fontWeight: 'semibold' })}>Type:</span>
          <span>{item.contractType}</span>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          <span className={css({ fontWeight: 'semibold' })}>Localisation:</span>
          <span>{item.location}</span>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          <span className={css({ fontWeight: 'semibold' })}>Expérience:</span>
          <span>{item.experience}</span>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          <span className={css({ fontWeight: 'semibold' })}>Formation:</span>
          <span>{item.education}</span>
        </div>
      </div>

      <NavLink
        to={getLocalizedPath(`${url.offers}/${slug}`)}
        className={css({
          display: 'inline-block',
          color: 'blue.600',
          fontWeight: 'medium',
          _hover: { textDecoration: 'underline' },
        })}
      >
        Voir l'offre →
      </NavLink>
    </article>
  );
}
