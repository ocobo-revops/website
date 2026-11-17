import { describe, expect, it } from 'vitest';

import { MAIN_ROUTE_ID } from '~/modules/challenge-menu';
import type { StudioMemberCard } from '~/modules/studio-team';
import { render, screen, within } from '~/test/utils';

import { TeamSection } from './team-section';

const expert: StudioMemberCard = {
  slug: 'clara',
  name: 'Clara Lecarrié',
  role: 'Manager',
  photo: '',
  challenge: 'cx',
  contribution: 'Santé client, renouvellements et expansion.',
  tools: ['Salesforce', 'HubSpot', 'Metabase', 'Segment', 'Planhat'],
  previousCompanies: ['Qonto'],
  bio: 'Dix ans de Customer Success en SaaS.',
};

// No expert fields: the card stays, with the bio on its back.
const member: StudioMemberCard = {
  slug: 'yoann',
  name: 'Yoann Boileux',
  role: 'RevOps Manager',
  photo: '',
  challenge: null,
  contribution: null,
  tools: [],
  previousCompanies: [],
  bio: 'Ancien Head of Sales Ops.',
};

const loaderData = {
  [MAIN_ROUTE_ID]: {
    challenges: [
      {
        slug: 'customer-experience',
        key: 'cx',
        name: 'Customer Experience',
        tagline: null,
      },
    ],
    failed: false,
  },
};

describe('TeamSection', () => {
  it('renders one card per member, with or without expert fields', () => {
    render(<TeamSection members={[expert, member]} />, { loaderData });
    expect(
      screen.getByRole('heading', { level: 3, name: 'Clara Lecarrié' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Yoann Boileux' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('shows every tool of a member, with no limit', () => {
    render(<TeamSection members={[expert]} />, { loaderData });
    const tools = screen.getByRole('list', {
      name: 'Ses outils',
      hidden: true,
    });
    expect(
      within(tools)
        .getAllByRole('listitem', { hidden: true })
        .map((item) => item.textContent),
    ).toEqual(expert.tools);
  });

  it('labels an expert with the challenge name', () => {
    render(<TeamSection members={[expert]} />, { loaderData });
    expect(screen.getByText('Expert Customer Experience')).toBeInTheDocument();
  });

  it('puts the bio on the back of a card with no contribution', () => {
    const { container } = render(<TeamSection members={[member]} />, {
      loaderData,
    });
    expect(container).toHaveTextContent('Parcours');
    expect(container).toHaveTextContent(member.bio ?? '');
    expect(container).not.toHaveTextContent('Expert');
  });

  it('keeps the contribution on the back of an expert card', () => {
    const { container } = render(<TeamSection members={[expert]} />, {
      loaderData,
    });
    expect(container).toHaveTextContent(expert.contribution ?? '');
    expect(container).not.toHaveTextContent(expert.bio ?? '');
  });
});
