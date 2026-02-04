import { fetchBlogposts, fetchStories } from '~/modules/content';

const baseUrl = 'https://www.ocobo.co';

function getUrlElementWithDate(url: string, date: string) {
  return `<url>
        <loc>${url}</loc>
        <lastmod>${date}</lastmod>
        </url>`;
}

function generateSiteMap(
  stories: { slug: string; date: Date }[],
  posts: { slug: string; date: Date }[],
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
            ${getUrlElementWithDate(`${baseUrl}/fr`, new Date().toISOString())}
            ${getUrlElementWithDate(`${baseUrl}/fr/offer`, new Date().toISOString())}
            ${getUrlElementWithDate(`${baseUrl}/fr/method`, new Date().toISOString())}
            ${getUrlElementWithDate(`${baseUrl}/fr/contact`, new Date().toISOString())}
            ${getUrlElementWithDate(`${baseUrl}/stories`, new Date().toISOString())}

            ${stories
              .map(
                (story) =>
                  `${getUrlElementWithDate(
                    `${baseUrl}/stories/${story.slug}`,
                    story.date.toISOString(),
                  )}`,
              )
              .join('\n')}
            ${getUrlElementWithDate(`${baseUrl}/blog`, new Date().toISOString())}
            ${posts
              .map(
                (post) =>
                  `${getUrlElementWithDate(
                    `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
                    post.date.toISOString(),
                  )}`,
              )
              .join('\n')}
            ${getUrlElementWithDate(`${baseUrl}/legal/confidentialite`, new Date().toISOString())}
            ${getUrlElementWithDate(`${baseUrl}/legal/cgu`, new Date().toISOString())}
        </urlset>`;
}

export async function loader() {
  const storiesQuery = fetchStories().then((result) => {
    const [, state, data] = result;
    if (state === 'success' && data) {
      return data.map((story) => ({
        slug: story.slug,
        date: new Date(story.frontmatter.date),
      }));
    }
    return [];
  });

  const postsQuery = fetchBlogposts().then((result) => {
    const [, state, data] = result;
    if (state === 'success' && data) {
      return data.map((post) => ({
        slug: post.slug,
        date: new Date(post.frontmatter.date),
      }));
    }
    return [];
  });

  const [stories, posts] = await Promise.all([storiesQuery, postsQuery]);
  return new Response(generateSiteMap(stories, posts), {
    headers: {
      'content-type': 'application/xml',
    },
  });
}
