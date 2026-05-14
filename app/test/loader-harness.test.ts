/**
 * Tests for the React Router v7 loader test harness.
 *
 * The harness lets unit tests invoke a route loader directly with a
 * synthesized {@link LoaderFunctionArgs}, then inspect the loader's return
 * value or any Response it returned/threw (redirects, 404s, …).
 *
 * Usage:
 *
 *     const outcome = await invokeLoader(loader, {
 *       params: { lang: 'en' },
 *       url: 'http://test.local/en',
 *     });
 *     if (outcome.type === 'data') expect(outcome.data).toEqual(...);
 *     if (outcome.type === 'response') expect(outcome.response.status).toBe(301);
 */

import { type LoaderFunctionArgs, redirect } from 'react-router';
import { describe, expect, it } from 'vitest';

import { invokeLoader } from './loader-harness';

describe('invokeLoader', () => {
  it('returns the loader value as { type: "data" } for a plain return', async () => {
    const loader = async (_args: LoaderFunctionArgs) => ({ hello: 'world' });

    const outcome = await invokeLoader(loader);

    expect(outcome).toEqual({ type: 'data', data: { hello: 'world' } });
  });

  it('captures a thrown Response (RR redirect) as { type: "response" }', async () => {
    const loader = async (_args: LoaderFunctionArgs) => {
      throw redirect('/fr', 301);
    };

    const outcome = await invokeLoader(loader);

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(301);
    expect(outcome.response.headers.get('Location')).toBe('/fr');
  });

  it('captures a returned Response (e.g. data() error) as { type: "response" }', async () => {
    const loader = async (_args: LoaderFunctionArgs) =>
      new Response(null, { status: 404 });

    const outcome = await invokeLoader(loader);

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  it('rethrows non-Response errors so tests see real failures', async () => {
    const loader = async (_args: LoaderFunctionArgs) => {
      throw new Error('boom');
    };

    await expect(invokeLoader(loader)).rejects.toThrow('boom');
  });

  it('passes synthesized request and params through to the loader', async () => {
    const loader = async ({ request, params }: LoaderFunctionArgs) => ({
      url: request.url,
      lang: params.lang,
    });

    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en',
      params: { lang: 'en' },
    });

    expect(outcome).toEqual({
      type: 'data',
      data: { url: 'http://test.local/en', lang: 'en' },
    });
  });
});
