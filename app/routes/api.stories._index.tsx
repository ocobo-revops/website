import { type LoaderFunctionArgs } from 'react-router';
import { getApiCacheHeaders, shouldBypassCache } from '~/modules/cache';
import { fetchStories } from '~/modules/content';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Extract parameters
  const tag = url.searchParams.get('tag');
  const lang = url.searchParams.get('lang') || 'fr';

  // Fetch data using existing content API
  const [status, state, storiesData] = await fetchStories(lang);

  // Handle errors
  if (status !== 200 || !storiesData) {
    console.error(`Failed to fetch stories: ${state}`);
    return new Response(
      JSON.stringify({ data: null, isError: true, error: state }),
      {
        status: status === 404 ? 404 : 500,
        headers: (() => {
          const headers = new Headers();
          headers.set('Content-Type', 'application/json');
          const cacheHeaders = getApiCacheHeaders(
            'storyListing',
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

  // Filter and sort stories
  const filteredStories = tag
    ? storiesData.filter((entry) => entry.frontmatter.tags?.includes(tag))
    : storiesData;

  const stories = filteredStories
    .map((entry) => ({
      ...entry,
      _sortDate: new Date(entry.frontmatter.date).getTime(),
    }))
    .sort((a, b) => b._sortDate - a._sortDate)
    .map(({ _sortDate, ...entry }) => entry);

  // Return success response with cache headers
  const cacheHeaders = getApiCacheHeaders(
    'storyListing',
    shouldBypassCache(request),
  );

  return new Response(
    JSON.stringify({ data: stories, isError: false, total: stories.length }),
    {
      headers: (() => {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        for (const [key, value] of Object.entries(cacheHeaders)) {
          headers.set(key, value);
        }
        return headers;
      })(),
    },
  );
}
