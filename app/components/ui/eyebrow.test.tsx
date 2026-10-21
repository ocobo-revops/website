// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { axe } from '~/test/utils';

import { Eyebrow } from './eyebrow';

describe('Eyebrow', () => {
  it('renders its text without a dot by default', () => {
    const { container } = render(<Eyebrow>Revenue AI</Eyebrow>);
    expect(screen.getByText('Revenue AI')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('renders a decorative dot when dotColor is set', () => {
    const { container } = render(
      <Eyebrow dotColor="coral">Revenue AI</Eyebrow>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('has no axe violations with and without the dot', async () => {
    const { container } = render(
      <>
        <Eyebrow>Plain</Eyebrow>
        <Eyebrow dotColor="sky">Dotted</Eyebrow>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
