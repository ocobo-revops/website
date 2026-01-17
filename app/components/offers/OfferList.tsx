import { css } from '@ocobo/styled-system/css';
import type { OfferFrontmatter } from '~/modules/schemas';
import type { MarkdocFile } from '~/types';
import { OfferItem } from './OfferItem';

interface OfferListProps {
  items: MarkdocFile<OfferFrontmatter>[];
}

export function OfferList({ items }: OfferListProps) {
  if (items.length === 0) {
    return (
      <div className={css({ padding: '4', textAlign: 'center' })}>
        <p>Aucune offre disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1', md: '2' },
        gap: '6',
        padding: '4',
      })}
    >
      {items.map((item, index) => (
        <OfferItem
          key={item.slug}
          item={item.frontmatter}
          slug={item.slug}
          index={index}
        />
      ))}
    </div>
  );
}
