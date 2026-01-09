import { type LoaderFunctionArgs } from 'react-router';
import { getApiCacheHeaders, shouldBypassCache } from '~/modules/cache';
import { fetchBlogpost } from '~/modules/content';

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
            'blogPost',
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
  const [status, state, blogData] = await fetchBlogpost(slug, lang);

  // Handle errors
  if (status !== 200 || !blogData) {
    console.error(`Failed to fetch blog post: ${state}`);
    return new Response(
      JSON.stringify({ data: null, isError: true, error: state }),
      {
        status: status === 404 ? 404 : 500,
        headers: (() => {
          const headers = new Headers();
          headers.set('Content-Type', 'application/json');
          const cacheHeaders = getApiCacheHeaders(
            'blogPost',
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
  const cacheHeaders = getApiCacheHeaders(
    'blogPost',
    shouldBypassCache(request),
  );

  return new Response(JSON.stringify({ data: blogData, isError: false }), {
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
