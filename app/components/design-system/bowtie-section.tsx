import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import {
  type BowtieChallenge,
  UnifiedBowtie,
} from '~/components/method/unified-bowtie';
import type { StageId } from '~/modules/bowtie-stages';

import { ShowcaseSection } from './showcase-section';

// A partial active set per challenge, to show the dimmed stages.
const examples: Array<{
  challenge: BowtieChallenge;
  name: string;
  activeStages: StageId[];
}> = [
  {
    challenge: 'rp',
    name: 'Revenue Performance (rp)',
    activeStages: ['negotiation', 'closing', 'expansion'],
  },
  {
    challenge: 'se',
    name: 'Sales Experience (se)',
    activeStages: ['discovery', 'negotiation', 'closing'],
  },
  {
    challenge: 'sc',
    name: 'Sales Compensation (sc)',
    activeStages: ['demand-generation', 'discovery'],
  },
  {
    challenge: 'cx',
    name: 'Customer Experience (cx)',
    activeStages: ['onboarding', 'adoption', 'expansion'],
  },
  {
    challenge: 'sy',
    name: 'Revenue Systems (sy)',
    activeStages: ['discovery', 'closing', 'onboarding'],
  },
  {
    challenge: 'ai',
    name: 'Revenue AI (ai)',
    activeStages: ['demand-generation', 'negotiation', 'adoption'],
  },
];

export function BowtieSection() {
  return (
    <ShowcaseSection title="Bow tie">
      <p className={text({ variant: 'small' })}>
        Sept étapes du modèle, une couleur par enjeu. Les étapes inactives
        gardent les lignes grises. Avec un enjeu, un chip KPI s'affiche sous
        chaque étape active. Survolez, touchez ou atteignez au clavier une étape
        pour voir son KPI et son jalon. Masqué sous 768px.
      </p>
      <h3
        className={cx(text({ variant: 'display-md-bold' }), css({ mt: '8' }))}
      >
        Neutre, toutes les étapes actives (page méthode)
      </h3>
      <UnifiedBowtie />
      {examples.map((example) => (
        <div key={example.challenge}>
          <h3
            className={cx(
              text({ variant: 'display-md-bold' }),
              css({ mt: '8' }),
            )}
          >
            {example.name}
          </h3>
          <UnifiedBowtie
            challenge={example.challenge}
            activeStages={example.activeStages}
          />
        </div>
      ))}
    </ShowcaseSection>
  );
}
