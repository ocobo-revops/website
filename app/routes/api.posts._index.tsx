import { type LoaderFunctionArgs } from 'react-router';
import { getApiCacheHeaders, shouldBypassCache } from '~/modules/cache';
import { fetchBlogposts } from '~/modules/content';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tag = url.searchParams.get('tag');
  const lang = url.searchParams.get('lang') || 'fr';

  const [status, state, blogData] = await fetchBlogposts(lang);

  // Handle errors gracefully
  if (status !== 200 || !blogData) {
    console.error(`Failed to fetch blog posts: ${state}`);
    return new Response(
      JSON.stringify({ data: null, isError: true, error: state }),
      {
        status: status === 404 ? 404 : 500,
        headers: (() => {
          const headers = new Headers();
          headers.set('Content-Type', 'application/json');
          const cacheHeaders = getApiCacheHeaders(
            'blogListing',
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

  // Filter and sort posts
  const filteredPosts = tag
    ? blogData.filter((entry) => entry.frontmatter.tags.includes(tag))
    : blogData;

  const posts = filteredPosts
    .map((entry) => ({
      ...entry,
      _sortDate: new Date(entry.frontmatter.date).getTime(),
    }))
    .sort((a, b) => b._sortDate - a._sortDate)
    .map(({ _sortDate, ...entry }) => entry);

  // API-specific cache headers (short cache for new content visibility)
  const cacheHeaders = getApiCacheHeaders(
    'blogListing',
    shouldBypassCache(request),
  );

  return new Response(
    JSON.stringify({ data: posts, isError: false, total: posts.length }),
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
