import { type LoaderFunctionArgs } from 'react-router';
import { getApiCacheHeaders, shouldBypassCache } from '~/modules/cache';
import { fetchBlogposts, fetchStories } from '~/modules/content';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Extract parameters
  const query = url.searchParams.get('q');
  const type = url.searchParams.get('type'); // 'posts', 'stories', or 'all' (default)
  const lang = url.searchParams.get('lang') || 'fr';

  if (!query || query.length < 2) {
    return new Response(
      JSON.stringify({
        data: null,
        isError: true,
        error:
          'Query parameter "q" is required and must be at least 2 characters',
      }),
      {
        status: 400,
        headers: (() => {
          const headers = new Headers();
          headers.set('Content-Type', 'application/json');
          const cacheHeaders = getApiCacheHeaders(
            'static',
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

  const searchTerm = query.toLowerCase();
  const results: any[] = [];

  try {
    // Search in blog posts if type is 'posts' or 'all'
    if (!type || type === 'all' || type === 'posts') {
      const [blogStatus, _blogState, blogData] = await fetchBlogposts(lang);
      if (blogStatus === 200 && blogData) {
        const matchingPosts = blogData.filter((post) => {
          const title = post.frontmatter.title?.toLowerCase() || '';
          const description = post.frontmatter.description?.toLowerCase() || '';
          const content = String(post.content || '').toLowerCase();
          const tags = post.frontmatter.tags?.join(' ').toLowerCase() || '';

          return (
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            content.includes(searchTerm) ||
            tags.includes(searchTerm)
          );
        });

        matchingPosts.forEach((post) => {
          results.push({
            ...post,
            type: 'post',
            score: calculateScore(post, searchTerm),
          });
        });
      }
    }

    // Search in stories if type is 'stories' or 'all'
    if (!type || type === 'all' || type === 'stories') {
      const [storiesStatus, _storiesState, storiesData] =
        await fetchStories(lang);
      if (storiesStatus === 200 && storiesData) {
        const matchingStories = storiesData.filter((story) => {
          const title = story.frontmatter.title?.toLowerCase() || '';
          const description =
            story.frontmatter.description?.toLowerCase() || '';
          const content = String(story.content || '').toLowerCase();
          const tags = story.frontmatter.tags?.join(' ').toLowerCase() || '';

          return (
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            content.includes(searchTerm) ||
            tags.includes(searchTerm)
          );
        });

        matchingStories.forEach((story) => {
          results.push({
            ...story,
            type: 'story',
            score: calculateScore(story, searchTerm),
          });
        });
      }
    }

    // Sort by relevance score (highest first)
    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...item }) => item); // Remove score from final results

    // Return success response with cache headers
    const cacheHeaders = getApiCacheHeaders(
      'static',
      shouldBypassCache(request),
    );

    return new Response(
      JSON.stringify({
        data: sortedResults,
        isError: false,
        total: sortedResults.length,
        query: query,
      }),
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
  } catch (error) {
    console.error('Search failed:', error);
    return new Response(
      JSON.stringify({
        data: null,
        isError: true,
        error: 'Search failed due to internal error',
      }),
      {
        status: 500,
        headers: (() => {
          const headers = new Headers();
          headers.set('Content-Type', 'application/json');
          const cacheHeaders = getApiCacheHeaders(
            'static',
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
}

/**
 * Calculate relevance score for search results
 */
function calculateScore(item: any, searchTerm: string): number {
  let score = 0;
  const title = item.frontmatter.title?.toLowerCase() || '';
  const description = item.frontmatter.description?.toLowerCase() || '';
  const tags = item.frontmatter.tags?.join(' ').toLowerCase() || '';

  // Title matches get highest score
  if (title.includes(searchTerm)) {
    score += 10;
    if (title.startsWith(searchTerm)) score += 5;
  }

  // Description matches get medium score
  if (description.includes(searchTerm)) {
    score += 5;
  }

  // Tag matches get good score
  if (tags.includes(searchTerm)) {
    score += 7;
  }

  // Content matches get base score
  const content = String(item.content || '').toLowerCase();
  if (content.includes(searchTerm)) {
    score += 2;
    // Boost score for multiple content matches
    const matches = (content.match(new RegExp(searchTerm, 'g')) || []).length;
    score += Math.min(matches - 1, 3); // Max 3 extra points for multiple matches
  }

  return score;
}
