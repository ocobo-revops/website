import {
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from 'react-router';
import { useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { Header } from '~/components/jobs/detail/header';
import { Section } from '~/components/jobs/detail/section';
import { createHybridLoader } from '~/modules/cache';
import { extractJobSections, fetchJob } from '~/modules/content';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const lang = getLang(params);
    const { slug } = params;

    if (!slug) {
      return redirect(`/${lang}/jobs`);
    }

    const [status, , job] = await fetchJob(slug, lang);

    if (status !== 200 || !job) {
      return redirect(`/${lang}/jobs`);
    }

    if (job.frontmatter.status !== 'published') {
      return redirect(`/${lang}/jobs`);
    }

    const sections = extractJobSections(job.content);

    return { job, sections };
  },
  'job',
);

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  return getMetaTags({
    title: data.job.frontmatter.title,
    description: data.job.frontmatter.intro,
    locale: 'fr',
  });
};

export default function JobDetail() {
  const { job, sections } = useLoaderData<typeof loader>();
  const { frontmatter } = job;

  return (
    <div className={css({ maxW: '4xl', mx: 'auto', px: '4', py: '8' })}>
      <Header frontmatter={frontmatter} />
      <div className={css({ mt: '8' })}>
        <p>{frontmatter.intro}</p>
      </div>
      <div id="mission" className={css({ mt: '12' })}>
        <Section nodes={sections.mission} />
      </div>
      <div id="competences" className={css({ mt: '12' })}>
        <Section nodes={sections.competences} />
      </div>
      <div id="pourquoi" className={css({ mt: '12' })}>
        <Section nodes={sections.pourquoi} />
      </div>
    </div>
  );
}
