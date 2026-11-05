import type { LoaderFunctionArgs } from 'react-router';
import { describe, expect, it } from 'vitest';

import { redirectBlogPosts, redirectWithLocale } from './redirections';

function loaderArgs(
  url: string,
  params: Record<string, string> = {},
): LoaderFunctionArgs {
  return {
    request: new Request(url),
    params,
    context: {} as LoaderFunctionArgs['context'],
    url: new URL(url),
    pattern: new URL(url).pathname,
  };
}

async function thrownResponse(promise: Promise<unknown>): Promise<Response> {
  try {
    await promise;
  } catch (thrown) {
    if (thrown instanceof Response) return thrown;
    throw thrown;
  }
  throw new Error('expected a thrown Response');
}

describe('redirectWithLocale', () => {
  it('redirects the bare root to the French home page', async () => {
    const response = await thrownResponse(
      redirectWithLocale(loaderArgs('http://test.local/')),
    );

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('/fr');
  });

  it('redirects a path without prefix to its French twin', async () => {
    const response = await thrownResponse(
      redirectWithLocale(loaderArgs('http://test.local/clients/acme')),
    );

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('/fr/clients/acme');
  });

  it('lets a prefixed request through', async () => {
    await expect(
      redirectWithLocale(
        loaderArgs('http://test.local/en/offer', { lang: 'en' }),
      ),
    ).resolves.toBeUndefined();
  });

  // Bug: the redirect is built from `pathname` alone, so the query string is
  // dropped. A campaign link such as `/offer?utm_source=linkedin` lands on
  // `/fr/offer` without its UTM parameters. Remove `.fails` once fixed.
  it.fails('keeps the query string when it adds the prefix', async () => {
    const response = await thrownResponse(
      redirectWithLocale(
        loaderArgs('http://test.local/offer?utm_source=linkedin'),
      ),
    );

    expect(response.headers.get('Location')).toBe(
      '/fr/offer?utm_source=linkedin',
    );
  });
});

describe('redirectBlogPosts', () => {
  it('redirects a legacy numeric slug to its permanent slug', async () => {
    const response = await thrownResponse(redirectBlogPosts('1'));

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe(
      '/blog/business-ops-revenue-ops-definition',
    );
  });

  it('leaves any other slug alone', async () => {
    await expect(redirectBlogPosts('9')).resolves.toBeUndefined();
    await expect(
      redirectBlogPosts('business-ops-revenue-ops-definition'),
    ).resolves.toBeUndefined();
  });
});
