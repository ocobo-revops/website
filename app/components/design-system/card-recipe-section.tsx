import { css } from '@ocobo/styled-system/css';
import { hstack } from '@ocobo/styled-system/patterns';
import { card } from '@ocobo/styled-system/recipes';

import { ShowcaseSection } from './showcase-section';

const cardTitle = css({ fontWeight: 'bold' });
const cardCaption = css({ color: 'gray.500', fontSize: 'sm', mt: '2' });

export function CardRecipeSection() {
  return (
    <ShowcaseSection title="Card recipe">
      <ul
        className={hstack({
          gap: '6',
          alignItems: 'stretch',
          flexWrap: 'wrap',
        })}
      >
        <li className={card()}>
          <p className={cardTitle}>Default card</p>
          <p className={cardCaption}>padding md · radius md · white · border</p>
        </li>
        <li className={card({ tone: 'tinted' })}>
          <p className={cardTitle}>Tinted card</p>
          <p className={cardCaption}>tone tinted (gray.50 bg)</p>
        </li>
        <li className={card({ border: false })}>
          <p className={cardTitle}>No-border card</p>
          <p className={cardCaption}>border false · shadow only</p>
        </li>
        <li className={card({ padding: 'lg', radius: 'lg' })}>
          <p className={cardTitle}>Large card</p>
          <p className={cardCaption}>padding lg · radius lg (3xl)</p>
        </li>
      </ul>
    </ShowcaseSection>
  );
}
