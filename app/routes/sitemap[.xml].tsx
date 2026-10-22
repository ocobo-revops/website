import type { Language } from '~/localization/resources';
import { isChallengeSlug } from '~/modules/challenge-page';
import { fetchBlogposts, fetchJobs, fetchStories } from '~/modules/content';
import { fetchChallenges } from '~/modules/content/api';

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
  jobs: { slug: string; date: Date }[],
  challenges: { slug: string; lang: Language }[],
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
            ${getUrlElementWithDate(`${baseUrl}/fr`, new Date().toISOString())}
            ${getUrlElementWithDate(`${baseUrl}/fr/offer`, new Date().toISOString())}
            ${getUrlElementWithDate(`${baseUrl}/fr/method`, new Date().toISOString())}
            ${getUrlElementWithDate(`${baseUrl}/fr/about-us`, new Date().toISOString())}
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
            ${getUrlElementWithDate(`${baseUrl}/fr/jobs`, new Date().toISOString())}
            ${jobs
              .map(
                (job) =>
                  `${getUrlElementWithDate(
                    `${baseUrl}/fr/jobs/${job.slug}`,
                    job.date.toISOString(),
                  )}`,
              )
              .join('\n')}
            ${challenges
              .map((challenge) =>
                getUrlElementWithDate(
                  `${baseUrl}/${challenge.lang}/challenges/${challenge.slug}`,
                  new Date().toISOString(),
                ),
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

  const jobsQuery = fetchJobs().then((result) => {
    const [, state, data] = result;
    if (state === 'success' && data) {
      return data
        .filter((job) => job.frontmatter.status === 'published')
        .map((job) => ({
          slug: job.slug,
          date: new Date(job.frontmatter.publishedAt),
        }));
    }
    return [];
  });

  // Challenge files carry no date: every file in the folder is published.
  const challengesQuery = (lang: Language) =>
    fetchChallenges(lang).then((result) => {
      const [, state, data] = result;
      if (state === 'success' && data) {
        // The route answers 404 to any other slug: never list it.
        return data
          .filter((challenge) => isChallengeSlug(challenge.slug))
          .map((challenge) => ({ slug: challenge.slug, lang }));
      }
      return [];
    });

  const [stories, posts, jobs, frChallenges, enChallenges] = await Promise.all([
    storiesQuery,
    postsQuery,
    jobsQuery,
    challengesQuery('fr'),
    challengesQuery('en'),
  ]);
  const challenges = [...frChallenges, ...enChallenges];
  return new Response(generateSiteMap(stories, posts, jobs, challenges), {
    headers: {
      'content-type': 'application/xml',
    },
  });
}
