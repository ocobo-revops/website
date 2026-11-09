import { describe, expect, it } from 'vitest';

import { render, screen } from '~/test/utils';

import { LayoutMain } from './LayoutMain';

describe('LayoutMain', () => {
  it('renders the v2 navbar and footer around the page', () => {
    render(
      <LayoutMain>
        <p>Page body</p>
      </LayoutMain>,
    );

    expect(screen.getByText('Page body')).toBeInTheDocument();
    // The mobile drawer's navigation shares the label but stays hidden.
    expect(
      screen.getByRole('navigation', { name: 'Navigation principale' }),
    ).toBeInTheDocument();
    // A single banner: the navbar. Page heroes must not add another.
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    // The v1 footer has no labelled link row.
    expect(
      screen.getByRole('navigation', { name: 'Liens du site' }),
    ).toBeInTheDocument();
  });
});
