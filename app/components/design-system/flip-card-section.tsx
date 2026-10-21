import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { FlipCard } from '~/components/ui/flip-card';

import { ShowcaseSection } from './showcase-section';

const caption = css({ fontSize: 'caption', color: 'gray', mb: '6' });
// Keeps the first line of a face clear of the flip button in the corner.
const clearOfButton = css({ pr: '12' });
const pill = css({
  alignSelf: 'flex-start',
  px: '4',
  py: '1.5',
  borderRadius: 'full',
  bg: 'enjeu.se',
});
const backLabel = cx(text({ variant: 'label' }), css({ color: 'gray.300' }));
const steps = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  mt: '4',
  flex: '1',
  fontWeight: 'semibold',
});
const stepNumber = css({ color: 'enjeu.se', mr: '2' });
const footerLink = css({
  mt: '4',
  fontWeight: 'semibold',
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
});
const toolBack = css({ bg: 'yellow', color: 'dark' });

const chantiers = [
  'Des leads mieux ciblés, qualifiés et assignés',
  'Les bons rôles, au bon moment du cycle',
  'Un cycle de vente outillé de bout en bout',
  'Des managers qui pilotent sur des faits',
];

export function FlipCardSection() {
  return (
    <ShowcaseSection title="Flip card">
      <p className={caption}>
        Flips with its button (Enter or Space), a tap on the card, or a mouse
        hover. The hidden face is inert. Fixed height: size md (tool cards) or
        lg (home enjeu cards).
      </p>
      <div className={grid({ columns: { base: 1, md: 2 }, gap: '8' })}>
        <FlipCard
          size="lg"
          label="Une organisation commerciale qui passe à l'échelle"
          front={
            <>
              <span className={cx(text({ variant: 'label' }), pill)}>
                Enjeu 01
              </span>
              <h3
                className={cx(
                  text({ variant: 'display-md-bold' }),
                  css({ mt: '7' }),
                )}
              >
                Une organisation commerciale qui passe à l'échelle
              </h3>
              <p
                className={cx(
                  text({ variant: 'body' }),
                  css({ mt: '4', fontStyle: 'italic', color: 'gray.700' }),
                )}
              >
                « Deux commerciaux font l'essentiel du chiffre. »
              </p>
            </>
          }
          back={
            <>
              <span className={cx(backLabel, clearOfButton)}>
                Enjeu 01 · Ce que nous déployons
              </span>
              <ol className={steps}>
                {chantiers.map((chantier, index) => (
                  <li key={chantier}>
                    <span className={stepNumber}>0{index + 1}</span>
                    {chantier}
                  </li>
                ))}
              </ol>
              <a href="/" className={footerLink}>
                Voir les chantiers
              </a>
            </>
          }
        />
        <FlipCard
          label="HubSpot"
          backClassName={toolBack}
          front={
            <>
              <span className={cx(text({ variant: 'label' }), clearOfButton)}>
                CRM
              </span>
              <h3
                className={cx(
                  text({ variant: 'display-md-bold' }),
                  css({ mt: '4' }),
                )}
              >
                HubSpot
              </h3>
              <p
                className={cx(
                  text({ variant: 'small' }),
                  css({ mt: 'auto', color: 'gray' }),
                )}
              >
                Le CRM, colonne vertébrale du système
              </p>
            </>
          }
          back={
            <>
              <span className={cx(text({ variant: 'label' }), clearOfButton)}>
                Pourquoi HubSpot
              </span>
              <p
                className={cx(
                  text({ variant: 'body' }),
                  css({ mt: '3', fontWeight: 'semibold' }),
                )}
              >
                Partenaire Platinum : modèle de données, gouvernance et
                adoption, de la PME à l'ETI.
              </p>
              <a href="/" className={cx(footerLink, css({ mt: 'auto' }))}>
                Voir la page partenaire
              </a>
            </>
          }
        />
      </div>
    </ShowcaseSection>
  );
}
