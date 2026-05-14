import { useHydrated } from 'remix-utils/use-hydrated';
import { describe, expect, it, vi } from 'vitest';

import { ContactForm } from '~/components/ContactForm';
import { render, screen, waitFor } from '~/test/utils';

const loadHubSpotScriptMock = vi.fn(() => Promise.resolve('loaded'));
const createHubSpotFormMock = vi.fn();
const loadDistroScriptMock = vi.fn(() => Promise.resolve('loaded'));
const scheduleDistroMock = vi.fn();

vi.mock('~/utils/hubspot', () => ({
  contactFormId: 'test-form-id',
  loadHubSpotScript: () => loadHubSpotScriptMock(),
  createHubSpotForm: (...args: unknown[]) => createHubSpotFormMock(...args),
  loadDistroScript: () => loadDistroScriptMock(),
  scheduleDistro: (...args: unknown[]) => scheduleDistroMock(...args),
}));

vi.mock('remix-utils/use-hydrated', () => ({
  useHydrated: vi.fn(),
}));

describe('ContactForm', () => {
  it('renders the hbspt-form container', () => {
    vi.mocked(useHydrated).mockReturnValue(false);
    const { container } = render(<ContactForm />);
    expect(container.querySelector('.hbspt-form')).toBeInTheDocument();
  });

  it('renders children', () => {
    vi.mocked(useHydrated).mockReturnValue(false);
    render(
      <ContactForm>
        <span>child content</span>
      </ContactForm>,
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('loads HubSpot then Distro scripts after hydration', async () => {
    vi.mocked(useHydrated).mockReturnValue(true);
    render(<ContactForm />);

    await waitFor(() => {
      expect(loadHubSpotScriptMock).toHaveBeenCalledOnce();
    });
    expect(createHubSpotFormMock).toHaveBeenCalledWith(
      'test-form-id',
      '.hbspt-form',
    );
    expect(loadDistroScriptMock).toHaveBeenCalledOnce();
    expect(scheduleDistroMock).toHaveBeenCalledWith('test-form-id');
  });

  it('does not load scripts before hydration', () => {
    vi.mocked(useHydrated).mockReturnValue(false);
    render(<ContactForm />);
    expect(loadHubSpotScriptMock).not.toHaveBeenCalled();
  });
});
