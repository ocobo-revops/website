import { type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import type { Language } from '~/localization/resources';
import { createHybridLoader } from '~/modules/cache';
import { fetchJobs } from '~/modules/content';
import type { JobFrontmatter } from '~/modules/schemas';
import type { MarkdocFile } from '~/types';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

import { HeroSection } from '~/components/jobs/hero-section';
import { JobList } from '~/components/jobs/job-list';
import { OfficesSection } from '~/components/jobs/offices-section';
import { ProcessSection } from '~/components/jobs/process-section';
import { ValuesSection } from '~/components/jobs/values-section';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const lang = getLang(params);
    const [status, state, jobsData] = await fetchJobs(lang);

    if (status !== 200 || !jobsData) {
      console.error(`Failed to fetch jobs: ${state}`);
      return { jobs: [], lang, isError: true };
    }

    const jobs = (jobsData as MarkdocFile<JobFrontmatter>[])
      .filter((entry) => entry.frontmatter.status === 'published')
      .sort(
        (a, b) =>
          new Date(b.frontmatter.publishedAt).getTime() -
          new Date(a.frontmatter.publishedAt).getTime(),
      );

    return { jobs, lang, isError: false };
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
  const { jobs, lang } = useLoaderData<typeof loader>();

  return (
    <div className={css({ width: 'full', pt: '32', pb: '24', bg: 'white' })}>
      <HeroSection />
      <ValuesSection />
      <JobList jobs={jobs} lang={lang} />
      <ProcessSection />
      <OfficesSection />
    </div>
  );
}
