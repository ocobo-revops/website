import { css } from '@ocobo/styled-system/css';

import { HomeChallengeCards } from '~/components/home/home-challenge-cards';
import type { HomeChallengeCard } from '~/modules/home-challenges';

import { ShowcaseSection } from './showcase-section';

const caption = css({ fontSize: 'caption', color: 'gray', mb: '6' });

/**
 * Sample cards, in the shape the home loader returns. The text is a frozen
 * copy of three challenge files of the posts repo: it does not follow later
 * edits there.
 */
const samples: HomeChallengeCard[] = [
  {
    slug: 'sales-experience',
    key: 'se',
    order: 1,
    name: 'Sales Experience',
    tagline: 'Une organisation commerciale qui grandit avec vous',
    quote: "Deux commerciaux font l'essentiel du chiffre.",
    intro:
      'Six chantiers, priorisés selon votre point de départ. Chacun livre un système qui reste chez vous.',
    workstreams: [
      'Des leads mieux ciblés, qualifiés et assignés',
      'Les bons rôles, au bon moment du cycle',
      'Un cycle de vente outillé de bout en bout',
      "Du devis signé à l'argent encaissé, sans ressaisie",
      'Des managers qui pilotent sur des faits',
      'La méthode intégrée aux outils',
    ],
  },
  {
    slug: 'customer-experience',
    key: 'cx',
    order: 2,
    name: 'Customer Experience',
    tagline: 'Des clients qui restent et achètent plus',
    quote: 'On signe, puis on perd le fil.',
    intro: 'Six chantiers, de la signature au développement du compte.',
    workstreams: [
      "Qui s'occupe de quel client, et comment",
      "Une passation sans perte d'information",
      'La santé de chaque client, lisible',
      'Des renouvellements anticipés, un développement piloté',
      'Une seule vue du client, partagée',
      'Des équipes client outillées',
    ],
  },
  {
    slug: 'revenue-ai',
    key: 'ai',
    order: 6,
    name: 'Revenue AI',
    tagline: 'Une IA qui travaille pour vos équipes',
    quote: 'Tout le monde utilise ChatGPT, personne ne vend mieux.',
    intro: 'Chacun se livre en un Revenue AI Sprint.',
    workstreams: [
      'Les bons comptes, enrichis et priorisés',
      "Les comptes rendus d'appel remplissent le CRM",
      'La préparation de rendez-vous en une minute',
      'La revue de pipe assistée',
      'Le prévisionnel en langage naturel',
      "Le playbook dans l'outil du commercial",
    ],
  },
];

export function HomeChallengeCardsSection() {
  return (
    <ShowcaseSection title="Home challenge cards">
      <p className={caption}>
        One FlipCard per published challenge, fed by its file (quote, workstream
        intro, workstream titles). A tap or the button shows the back; the link
        to the challenge page sits on the back only.
      </p>
      <HomeChallengeCards challenges={samples} />
    </ShowcaseSection>
  );
}
