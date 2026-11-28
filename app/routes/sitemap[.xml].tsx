import type { LoaderFunctionArgs } from 'react-router';

import { type Language, languages } from '~/localization/resources';
import { shouldBypassCache } from '~/modules/cache';
import { loadChallengeMenu } from '~/modules/challenge-menu.server';
import { fetchBlogposts, fetchJobs, fetchStories } from '~/modules/content';
import { isPageEnabled } from '~/modules/feature-flags';
import {
  type ContentKind,
  type SitemapEntry,
  buildLocalizedPageEntries,
  localizedPath,
  renderSitemap,
} from '~/modules/sitemap';

const baseUrl = 'https://www.ocobo.co';

/** Entries for one content folder, empty when the folder is missing. */
type ContentEntries = {
  kind: ContentKind;
  lang: Language;
  entries: SitemapEntry[];
};

async function storyEntries(lang: Language): Promise<ContentEntries> {
  const [, state, data] = await fetchStories(lang);
  const stories = state === 'success' && data ? data : [];
  return {
    kind: 'stories',
    lang,
    entries: stories.map((story) => ({
      path: localizedPath(lang, `/clients/${encodeURIComponent(story.slug)}`),
      lastmod: new Date(story.frontmatter.date),
    })),
  };
}

// Blog routes carry no language segment: French posts only.
async function blogEntries(): Promise<SitemapEntry[]> {
  const [, state, data] = await fetchBlogposts();
  if (state !== 'success' || !data) return [];
  return data.map((post) => ({
    path: `/blog/${encodeURIComponent(post.slug)}`,
    lastmod: new Date(post.frontmatter.date),
  }));
}

async function jobEntries(lang: Language): Promise<ContentEntries> {
  if (!isPageEnabled('jobs')) return { kind: 'jobs', lang, entries: [] };
  const [, state, data] = await fetchJobs(lang);
  const jobs = state === 'success' && data ? data : [];
  return {
    kind: 'jobs',
    lang,
    entries: jobs
      .filter((job) => job.frontmatter.status === 'published')
      .map((job) => ({
        path: localizedPath(lang, `/jobs/${encodeURIComponent(job.slug)}`),
        lastmod: new Date(job.frontmatter.publishedAt),
      })),
  };
}

// Challenge files carry no date: every file in the folder is published.
// Same list as the navbar entry: it skips invalid files and slugs the
// route answers 404 to, and shares its in-memory cache.
async function challengeEntries(
  lang: Language,
  refresh: boolean,
): Promise<SitemapEntry[]> {
  const { challenges } = await loadChallengeMenu(lang, { refresh });
  return challenges.map(({ slug }) => ({
    path: localizedPath(lang, `/challenges/${encodeURIComponent(slug)}`),
  }));
}

export async function loader({ request }: LoaderFunctionArgs) {
  const refresh = shouldBypassCache(request);
  const [content, posts, challenges] = await Promise.all([
    Promise.all([...languages.map(storyEntries), ...languages.map(jobEntries)]),
    blogEntries(),
    Promise.all(languages.map((lang) => challengeEntries(lang, refresh))),
  ]);

  // An index page with nothing to list renders an error state: leave it out.
  const hasContent = (kind: ContentKind, lang: Language) =>
    content.some(
      (folder) =>
        folder.kind === kind &&
        folder.lang === lang &&
        folder.entries.length > 0,
    );

  const entries = [
    ...buildLocalizedPageEntries(languages, {
      isEnabled: isPageEnabled,
      hasContent,
    }),
    { path: '/blog' },
    ...content.flatMap((folder) => folder.entries),
    ...posts,
    ...challenges.flat(),
  ];

  return new Response(renderSitemap(baseUrl, entries), {
    headers: {
      'content-type': 'application/xml',
    },
  });
}
