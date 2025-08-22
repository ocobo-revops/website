import { type LoaderFunctionArgs } from 'react-router';
import { getApiCacheHeaders, shouldBypassCache } from '~/modules/cache';
import { fetchBlogposts, fetchStories } from '~/modules/content';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Extract parameters
  const type = url.searchParams.get('type'); // 'posts', 'stories', or 'all' (default)
  const lang = url.searchParams.get('lang') || 'fr';

  const allTags = new Set<string>();
  const tagCounts: Record<
    string,
    { posts: number; stories: number; total: number }
  > = {};

  try {
    // Collect tags from blog posts if type is 'posts' or 'all'
    if (!type || type === 'all' || type === 'posts') {
      const [blogStatus, _blogState, blogData] = await fetchBlogposts(lang);
      if (blogStatus === 200 && blogData) {
        blogData.forEach((post) => {
          const tags = post.frontmatter.tags || [];
          tags.forEach((tag) => {
            allTags.add(tag);
            if (!tagCounts[tag]) {
              tagCounts[tag] = { posts: 0, stories: 0, total: 0 };
            }
            tagCounts[tag].posts += 1;
            tagCounts[tag].total += 1;
          });
        });
      }
    }

    // Collect tags from stories if type is 'stories' or 'all'
    if (!type || type === 'all' || type === 'stories') {
      const [storiesStatus, _storiesState, storiesData] =
        await fetchStories(lang);
      if (storiesStatus === 200 && storiesData) {
        storiesData.forEach((story) => {
          const tags = story.frontmatter.tags || [];
          tags.forEach((tag) => {
            allTags.add(tag);
            if (!tagCounts[tag]) {
              tagCounts[tag] = { posts: 0, stories: 0, total: 0 };
            }
            tagCounts[tag].stories += 1;
            tagCounts[tag].total += 1;
          });
        });
      }
    }

    // Convert to sorted array with metadata
    const tagsWithMetadata = Array.from(allTags)
      .map((tag) => ({
        name: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-'),
        counts: tagCounts[tag],
      }))
      .sort((a, b) => {
        // Sort by total count descending, then alphabetically
        if (b.counts.total !== a.counts.total) {
          return b.counts.total - a.counts.total;
        }
        return a.name.localeCompare(b.name);
      });

    // Simple array for minimal response (if client doesn't need counts)
    const includeMetadata = url.searchParams.get('metadata') !== 'false';
    const tagsData = includeMetadata
      ? tagsWithMetadata
      : Array.from(allTags).sort();

    // Return success response with cache headers
    const cacheHeaders = getApiCacheHeaders(
      'static',
      shouldBypassCache(request),
    );

    return new Response(
      JSON.stringify({
        data: tagsData,
        isError: false,
        total: allTags.size,
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
    console.error('Failed to fetch tags:', error);
    return new Response(
      JSON.stringify({
        data: null,
        isError: true,
        error: 'Failed to fetch tags due to internal error',
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
