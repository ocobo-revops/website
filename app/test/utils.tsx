import { type RenderResult, render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import type { ReactElement } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import {
  type RouteObject,
  RouterProvider,
  createMemoryRouter,
} from 'react-router';

import {
  defaultNS,
  fallbackLng,
  resources,
  supportedLngs,
} from '~/localization/i18n';

type RenderOptions = {
  initialEntries?: string[];
  i18nLang?: (typeof supportedLngs)[number];
  /** Route pattern of the rendered element, for example `:lang/*`. */
  path?: string;
  /**
   * Loader data by route id (`root`, `routes/_main`), for components that
   * read it with `useRouteLoaderData`. Each id becomes a parent route.
   */
  loaderData?: Record<string, unknown>;
};

function createTestI18n(lng: (typeof supportedLngs)[number]) {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    lng,
    fallbackLng,
    supportedLngs: [...supportedLngs],
    defaultNS,
    resources,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}

export function render(
  ui: ReactElement,
  options: RenderOptions = {},
): RenderResult {
  const {
    initialEntries = ['/'],
    i18nLang = fallbackLng,
    path = '*',
    loaderData = {},
  } = options;

  const leaf: RouteObject = {
    path,
    element: (
      <I18nextProvider i18n={createTestI18n(i18nLang)}>{ui}</I18nextProvider>
    ),
  };
  const routes = Object.entries(loaderData).reduceRight<RouteObject[]>(
    (children, [id, data]) => [{ id, loader: () => data, children }],
    [leaf],
  );
  const router = createMemoryRouter(routes, {
    initialEntries,
    hydrationData: { loaderData },
  });

  return rtlRender(<RouterProvider router={router} />);
}

export { axe } from 'jest-axe';
export { fireEvent, screen, waitFor, within } from '@testing-library/react';
export { userEvent };
