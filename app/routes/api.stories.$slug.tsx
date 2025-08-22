import { type LoaderFunctionArgs } from 'react-router';
import { getApiCacheHeaders, shouldBypassCache } from '~/modules/cache';
import { fetchStory } from '~/modules/content';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Extract parameters
  const lang = url.searchParams.get('lang') || 'fr';
  const slug = params?.slug;

  if (!slug) {
    return new Response(
      JSON.stringify({
        data: null,
        isError: true,
        error: 'Missing slug parameter',
      }),
      {
        status: 400,
        headers: (() => {
          const headers = new Headers();
          headers.set('Content-Type', 'application/json');
          const cacheHeaders = getApiCacheHeaders(
            'story',
            shouldBypassCache(request),
          );
          for (const [key, value] of Object.entries(cacheHeaders)) {
            headers.set(key, value);
          }
          return headers;
        })(),
      },
    );
  }

  // Fetch data using existing content API
  const [status, state, storyData] = await fetchStory(slug, lang);

  // Handle errors
  if (status !== 200 || !storyData) {
    console.error(`Failed to fetch story: ${state}`);
    return new Response(
      JSON.stringify({ data: null, isError: true, error: state }),
      {
        status: status === 404 ? 404 : 500,
        headers: (() => {
          const headers = new Headers();
          headers.set('Content-Type', 'application/json');
          const cacheHeaders = getApiCacheHeaders(
            'story',
            shouldBypassCache(request),
          );
          for (const [key, value] of Object.entries(cacheHeaders)) {
            headers.set(key, value);
          }
          return headers;
        })(),
      },
    );
  }

  // Return success response with cache headers
  const cacheHeaders = getApiCacheHeaders('story', shouldBypassCache(request));

  return new Response(JSON.stringify({ data: storyData, isError: false }), {
    headers: (() => {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      for (const [key, value] of Object.entries(cacheHeaders)) {
        headers.set(key, value);
      }
      return headers;
    })(),
  });
}
