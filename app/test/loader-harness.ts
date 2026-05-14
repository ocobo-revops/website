/**
 * React Router v7 loader test harness.
 *
 * Invokes a route loader with a synthesized {@link LoaderFunctionArgs} and
 * normalises the result into a tagged union so tests can branch on data vs
 * Response (redirects, 4xx, …) without try/catch boilerplate.
 *
 * When the loader returns via react-router's `data(payload, init)` helper, the
 * `DataWithResponseInit` wrapper is automatically unwrapped so `outcome.data`
 * holds the payload directly — no `.data.data` double-access in tests.
 *
 * See `loader-harness.test.ts` for examples.
 */

import type {
  LoaderFunctionArgs,
  UNSAFE_DataWithResponseInit,
} from 'react-router';

// Strip the DataWithResponseInit wrapper produced by react-router's data() helper.
type UnwrapLoaderData<T> = T extends UNSAFE_DataWithResponseInit<infer U>
  ? U
  : T;

// Duck-type guard for DataWithResponseInit — the class is not a runtime export.
function isDataWrapper(
  value: unknown,
): value is { type: 'DataWithResponseInit'; data: unknown } {
  return (
    value !== null &&
    typeof value === 'object' &&
    (value as Record<string, unknown>).type === 'DataWithResponseInit'
  );
}

export type LoaderOutcome<T> =
  | { type: 'data'; data: UnwrapLoaderData<Awaited<T>> }
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
): Promise<LoaderOutcome<T>> {
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
    const payload = isDataWrapper(result) ? result.data : result;
    return {
      type: 'data',
      data: payload as UnwrapLoaderData<Awaited<T>>,
    };
  } catch (thrown) {
    if (thrown instanceof Response) {
      return { type: 'response', response: thrown };
    }
    throw thrown;
  }
}
