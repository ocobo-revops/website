import { useHydrated } from 'remix-utils/use-hydrated';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactForm } from '~/components/ContactForm';
import { render, screen, waitFor } from '~/test/utils';

const {
  loadHubSpotScriptMock,
  createHubSpotFormMock,
  loadDistroScriptMock,
  scheduleDistroMock,
} = vi.hoisted(() => ({
  loadHubSpotScriptMock: vi.fn(() => Promise.resolve('loaded')),
  createHubSpotFormMock: vi.fn(),
  loadDistroScriptMock: vi.fn(() => Promise.resolve('loaded')),
  scheduleDistroMock: vi.fn(),
}));

vi.mock('~/utils/hubspot', () => ({
  contactFormId: 'test-form-id',
  loadHubSpotScript: loadHubSpotScriptMock,
  createHubSpotForm: createHubSpotFormMock,
  loadDistroScript: loadDistroScriptMock,
  scheduleDistro: scheduleDistroMock,
}));

vi.mock('remix-utils/use-hydrated', () => ({
  useHydrated: vi.fn(),
}));

describe('ContactForm', () => {
  beforeEach(() => {
    vi.mocked(useHydrated).mockReturnValue(false);
  });

  it('renders the hbspt-form container', () => {
    const { container } = render(<ContactForm />);
    // `.hbspt-form` is the selector passed to HubSpot — must remain stable.
    expect(container.querySelector('.hbspt-form')).toBeInTheDocument();
  });

  it('renders children', () => {
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
      expect(scheduleDistroMock).toHaveBeenCalledWith('test-form-id');
    });

    expect(loadHubSpotScriptMock).toHaveBeenCalledOnce();
    expect(createHubSpotFormMock).toHaveBeenCalledWith(
      'test-form-id',
      '.hbspt-form',
    );
    expect(loadDistroScriptMock).toHaveBeenCalledOnce();
  });

  it('does not load scripts before hydration', () => {
    render(<ContactForm />);
    expect(loadHubSpotScriptMock).not.toHaveBeenCalled();
  });

  it('logs error and does not call Distro when HubSpot script fails', async () => {
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppress console noise in test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    loadHubSpotScriptMock.mockRejectedValueOnce(new Error('boom'));
    vi.mocked(useHydrated).mockReturnValue(true);

    render(<ContactForm />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    expect(createHubSpotFormMock).not.toHaveBeenCalled();
    expect(loadDistroScriptMock).not.toHaveBeenCalled();
    expect(scheduleDistroMock).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
