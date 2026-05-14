/**
 * React Router v7 loader test harness.
 *
 * Invokes a route loader with a synthesized {@link LoaderFunctionArgs} and
 * normalises the result into a tagged union so tests can branch on data vs
 * Response (redirects, 4xx, …) without try/catch boilerplate.
 *
 * See `loader-harness.test.ts` for examples.
 */

import type { LoaderFunctionArgs } from 'react-router';

export type LoaderOutcome<T> =
  | { type: 'data'; data: T }
  | { type: 'response'; response: Response };

export interface InvokeLoaderOptions {
  /** Request URL. Defaults to `http://test.local/`. Ignored when `request` is set. */
  url?: string;
  /** Route params. Defaults to `{}`. */
  params?: Record<string, string>;
  /** Pre-built `Request`. Wins over `url`. */
  request?: Request;
}

type AnyLoader<T> = (args: LoaderFunctionArgs) => Promise<T> | T;

export async function invokeLoader<T>(
  loader: AnyLoader<T>,
  options: InvokeLoaderOptions = {},
): Promise<LoaderOutcome<Awaited<T>>> {
  const request =
    options.request ?? new Request(options.url ?? 'http://test.local/');
  const params = options.params ?? {};
  const args: LoaderFunctionArgs = {
    request,
    params,
    context: {} as LoaderFunctionArgs['context'],
    // RR v7 internal field; not part of public route loader contract but
    // required by the type. Loaders that reach for it are an anti-pattern.
    unstable_pattern: options.url ?? '/',
  };
  try {
    const result = await loader(args);
    if (result instanceof Response) {
      return { type: 'response', response: result };
    }
    return { type: 'data', data: result as Awaited<T> };
  } catch (thrown) {
    if (thrown instanceof Response) {
      return { type: 'response', response: thrown };
    }
    throw thrown;
  }
}
