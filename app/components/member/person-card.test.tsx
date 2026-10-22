import { describe, expect, it } from 'vitest';

import { axe, render, screen, userEvent, within } from '~/test/utils';

import { PersonCard } from './person-card';

const tools = [
  'Salesforce',
  'HubSpot',
  'Metabase',
  'Segment',
  'Planhat',
  'Vitally',
];

const member = {
  name: 'Clara Lecarrié',
  role: 'Manager',
  challenge: 'cx',
  challengeLabel: 'Expert Customer Experience',
  contribution: 'Santé client, renouvellements et expansion.',
  bio: 'Dix ans de Customer Success en SaaS.',
  tools,
  previousCompanies: ['Qonto', "L'Oréal"],
} as const;

// The back face is hidden until the card flips.
const toolNames = () =>
  within(screen.getByRole('list', { hidden: true })).getAllByRole('listitem', {
    hidden: true,
  });

describe('PersonCard', () => {
  it('shows the first four tools, in order, with a limit of four', () => {
    render(<PersonCard {...member} toolLimit={4} />);
    expect(toolNames().map((item) => item.textContent)).toEqual([
      'Salesforce',
      'HubSpot',
      'Metabase',
      'Segment',
    ]);
  });

  it('shows every tool without a limit', () => {
    render(<PersonCard {...member} />);
    expect(toolNames().map((item) => item.textContent)).toEqual(tools);
  });

  it('hides the tools line with a limit of zero', () => {
    const { container } = render(<PersonCard {...member} toolLimit={0} />);
    expect(container).not.toHaveTextContent('Ses outils');
    expect(screen.queryByRole('list', { hidden: true })).toBeNull();
  });

  it('hides the summary when the bio is asked for but absent', () => {
    const { container } = render(
      <PersonCard {...member} bio={undefined} showBio />,
    );
    expect(container).not.toHaveTextContent('Parcours');
    expect(container).not.toHaveTextContent(member.contribution);
  });

  it('renders the name at the given heading level', () => {
    render(<PersonCard {...member} headingLevel="h2" />);
    expect(
      screen.getByRole('heading', { level: 2, name: member.name }),
    ).toBeInTheDocument();
  });

  it('renders no empty line without previous companies', () => {
    const { container } = render(
      <PersonCard {...member} previousCompanies={[]} />,
    );
    expect(container).not.toHaveTextContent('Avant Ocobo');
    for (const element of container.querySelectorAll('p, span, li')) {
      if (element.children.length > 0) continue;
      expect(element.textContent?.trim()).not.toBe('');
    }
  });

  it('hides each absent field with its heading', () => {
    const { container } = render(
      <PersonCard name="Louis Strauss" role="RevOps Engineer" />,
    );
    expect(container).not.toHaveTextContent("Ce qu'il ou elle apporte");
    expect(container).not.toHaveTextContent('Ses outils');
    expect(container).not.toHaveTextContent('Avant Ocobo');
    expect(screen.queryByRole('list', { hidden: true })).toBeNull();
  });

  it('lists previous companies without escaping apostrophes', () => {
    const { container } = render(<PersonCard {...member} />);
    expect(container).toHaveTextContent("Avant Ocobo : Qonto, L'Oréal");
  });

  it('shows the bio in place of the contribution and can hide companies', () => {
    const { container } = render(
      <PersonCard {...member} showBio hidePreviousCompanies />,
    );
    expect(container).toHaveTextContent('Parcours');
    expect(container).toHaveTextContent(member.bio);
    expect(container).not.toHaveTextContent(member.contribution);
    expect(container).not.toHaveTextContent('Avant Ocobo');
  });

  it('shows initials when there is no photo', () => {
    const { container } = render(<PersonCard {...member} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container).toHaveTextContent('CL');
  });

  it('names its flip button after the person', () => {
    render(<PersonCard {...member} />);
    expect(
      screen.getByRole('button', {
        name: 'Retourner la carte : Clara Lecarrié',
      }),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <PersonCard {...member} photo="https://example.com/clara.jpg" />
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations on the back', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <PersonCard {...member} challenge="sy" />
      </main>,
    );
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
