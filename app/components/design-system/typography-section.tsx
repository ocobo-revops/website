import { css } from '@ocobo/styled-system/css';

import { ShowcaseSection, sectionTitle } from './showcase-section';

const fontTitle = css({
  display: 'block',
  color: 'gray',
  padding: '[16px 0 4px 0]',
});

export function TypographySection() {
  return (
    <ShowcaseSection title="css">
      <ul className={css({ maxWidth: 'prose' })}>
        <li>
          <span className={fontTitle}>heading1</span>
          <p className={css({ textStyle: 'heading1' })}>
            RevOps pour Entreprises Modernes
          </p>
        </li>
        <li>
          <span className={fontTitle}>heading2</span>
          <p className={sectionTitle}>RevOps pour Entreprises Modernes</p>
        </li>
        <li>
          <span className={fontTitle}>heading3</span>
          <p className={css({ textStyle: 'heading3' })}>
            Agence leader en revenue operations et stratégies revenus b2b & b2c
          </p>
        </li>
        <li>
          <span className={fontTitle}>large</span>
          <p className={css({ textStyle: 'large' })}>
            Nous vous aidons à transformer l’organisation et les processus de
            vos équipes Revenues pour leur permettre d’être plus performantes et
            d’atteindre vos objectifs de croissance et de rentabilité.
          </p>
        </li>
        <li>
          <span className={fontTitle}>medium</span>
          <p className={css()}>
            Nous vous aidons à transformer l’organisation et les processus de
            vos équipes Revenues pour leur permettre d’être plus performantes et
            d’atteindre vos objectifs de croissance et de rentabilité.
          </p>
        </li>
        <li>
          <span className={fontTitle}>small</span>
          <p className={css({ textStyle: 'small' })}>
            Nous vous aidons à transformer l’organisation et les processus de
            vos équipes Revenues pour leur permettre d’être plus performantes et
            d’atteindre vos objectifs de croissance et de rentabilité.
          </p>
        </li>
        <li>
          <span className={fontTitle}>nav</span>
          <p className={css({ textStyle: 'nav' })}>navigation item</p>
        </li>
      </ul>
    </ShowcaseSection>
  );
}
