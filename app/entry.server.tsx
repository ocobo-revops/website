import { PassThrough } from 'node:stream';

import { createReadableStreamFromReadable } from '@react-router/node';
import { createInstance } from 'i18next';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { type EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

import * as i18n from '~/localization/i18n'; // your i18n configuration file
import i18nServer from '~/localization/i18n.server';
import {
  getCacheHeaders,
  getCacheStrategyForPath,
  logCacheStrategy,
  shouldBypassCache,
} from '~/modules/cache';
import { didMainChallengeLoadFail } from '~/modules/challenge-menu';

import { returnLanguageIfSupported } from './localization/resources';

// Log cache strategy on server startup
logCacheStrategy();

const ABORT_DELAY = 35000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  const url = new URL(request.url);
  const { pathname } = url;
  const lang = pathname.split('/')[1];
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady';

  const instance = createInstance();
  const lng =
    returnLanguageIfSupported(lang) ?? (await i18nServer.getLocale(request));
  const ns = i18nServer.getRouteNamespaces(reactRouterContext);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .init({
      ...i18n, // spread the configuration
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
    });

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <ServerRouter context={reactRouterContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set('Content-Type', 'text/html');

          // Apply framework-native cache headers at response level
          const cacheStrategy = getCacheStrategyForPath(pathname);
          // A page rendered while the challenge list failed to load would
          // keep its empty or outdated navbar entry in the CDN for a day.
          const bypassCache =
            shouldBypassCache(request) ||
            didMainChallengeLoadFail(
              reactRouterContext.staticHandlerContext.loaderData,
            );
          const cacheHeaders = getCacheHeaders(cacheStrategy, bypassCache);

          // Set cache headers on response (bypasses Vercel framework-level override)
          for (const [key, value] of Object.entries(cacheHeaders)) {
            responseHeaders.set(key, value);
          }

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;

          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
