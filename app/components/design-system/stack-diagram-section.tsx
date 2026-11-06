import { css } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { StackDiagram } from '~/components/stack/stack-diagram';

import { ShowcaseSection } from './showcase-section';

export function StackDiagramSection() {
  return (
    <ShowcaseSection title="Stack diagram">
      <p className={text({ variant: 'small' })}>
        La stack Revenue Systems d'Ocobo : le CRM au centre, quatre couches
        autour. Données uniques dans app/modules/revenue-stack.ts, textes dans
        le namespace stack. La figure suit sa propre largeur (container query) :
        cinq colonnes dès 1024px, sinon une colonne dans l'ordre 01, CRM, 02,
        03, 04. Animations coupées en mouvement réduit.
      </p>
      <div className={css({ mt: '8', overflow: 'hidden' })}>
        <StackDiagram />
      </div>
    </ShowcaseSection>
  );
}
