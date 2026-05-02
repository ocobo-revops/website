import { type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';

import type { Language } from '~/localization/resources';
import { createHybridLoader } from '~/modules/cache';
import { fetchJobs } from '~/modules/content';
import type { JobFrontmatter } from '~/modules/schemas';
import type { MarkdocFile } from '~/types';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

import { JobList } from '~/components/jobs/job-list';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const lang = getLang(params);
    const [status, state, jobsData] = await fetchJobs(lang);

    if (status !== 200 || !jobsData) {
      console.error(`Failed to fetch jobs: ${state}`);
      return { jobs: [], isError: true };
    }

    const jobs = (jobsData as MarkdocFile<JobFrontmatter>[])
      .filter((entry) => entry.frontmatter.status === 'published')
      .sort(
        (a, b) =>
          new Date(b.frontmatter.publishedAt).getTime() -
          new Date(a.frontmatter.publishedAt).getTime(),
      );

    return { jobs, isError: false };
  },
  'job',
);

export const meta: MetaFunction<typeof loader> = ({ params }) => {
  const lang = (params.lang ?? 'fr') as Language;
  return getMetaTags({
    title: lang === 'fr' ? 'Nous rejoindre — Ocobo' : 'Join us — Ocobo',
    description:
      lang === 'fr'
        ? 'Rejoignez Ocobo, référence française du Revenue Operations.'
        : "Join Ocobo, France's leading Revenue Operations consultancy.",
    locale: lang,
  });
};

export default function JobsIndex() {
  const { jobs } = useLoaderData<typeof loader>();

  return <JobList jobs={jobs} />;
}
