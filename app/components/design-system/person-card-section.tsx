import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';

import { PersonCard } from '~/components/member/person-card';

import { ShowcaseSection } from './showcase-section';

const caption = css({ fontSize: 'caption', color: 'gray', mb: '6' });

// Real team photos, from the member registry in the posts repository.
const photoBase =
  'https://ipjmp3k0z0p479cb.public.blob.vercel-storage.com/content/team';

const tools = [
  'Salesforce',
  'HubSpot',
  'Metabase',
  'Segment',
  'Planhat',
  'Vitally',
  'Stripe',
  'Make',
];

export function PersonCardSection() {
  return (
    <ShowcaseSection title="Person card">
      <p className={caption}>
        Person variant of the flip card. Challenge page: four tools. Team page:
        every tool. About-us: bio in place of the contribution, no previous
        companies. An absent field hides its line.
      </p>
      <div className={grid({ columns: { base: 1, md: 2, xl: 4 }, gap: '6' })}>
        <PersonCard
          name="Clara Lecarrié"
          photo={`${photoBase}/clara-lecarrie.jpg`}
          role="Manager"
          challenge="cx"
          challengeLabel="Expert Customer Experience"
          contribution="Santé client, renouvellements et expansion pilotés depuis un seul outil."
          tools={tools}
          toolLimit={4}
          previousCompanies={['Qonto', 'Alan']}
        />
        <PersonCard
          name="Louis Strauss"
          photo={`${photoBase}/louis-strauss.jpg`}
          role="RevOps Engineer"
          challenge="sy"
          challengeLabel="Expert Revenue Systems"
          contribution="Un CRM propre, des données fiables et des intégrations qui tiennent."
          tools={tools}
        />
        <PersonCard
          name="Aude Cadiot"
          photo={`${photoBase}/aude-cadiot.jpg`}
          role="Consultante RevOps"
          challenge="sc"
          challengeLabel="Expert Sales Compensation"
          contribution="Des plans de rémunération variable lisibles et pilotés."
          bio="Dix ans de RevOps en SaaS, passée par la finance avant de rejoindre Ocobo."
          showBio
          hidePreviousCompanies
          tools={['Qobra', 'Salesforce', 'HubSpot']}
          previousCompanies={['Spendesk']}
        />
        <PersonCard name="Hugo Bernard" role="RevOps Analyst" />
      </div>
    </ShowcaseSection>
  );
}
