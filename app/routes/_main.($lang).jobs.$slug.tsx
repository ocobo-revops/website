import {
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from 'react-router';
import { useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { Header } from '~/components/jobs/detail/header';
import { HiringContact } from '~/components/jobs/detail/hiring-contact';
import { ScrollspyToc } from '~/components/jobs/detail/scrollspy-toc';
import { Section } from '~/components/jobs/detail/section';
import { createHybridLoader } from '~/modules/cache';
import {
  extractJobSections,
  fetchJob,
  loadContactRegistry,
  resolveContact,
} from '~/modules/content';
import type { HiringContact as HiringContactType } from '~/modules/schemas';
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

    const registry = await loadContactRegistry();
    const contact = resolveContact(job.frontmatter.hiringContact, registry);

    return { job, sections, contact };
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
  const { job, sections, contact } = useLoaderData<typeof loader>();
  const { frontmatter } = job;

  return (
    <div className={css({ maxW: '6xl', mx: 'auto', px: '4', py: '8' })}>
      <Header frontmatter={frontmatter} />
      <div className={css({ mt: '8' })}>
        <p>{frontmatter.intro}</p>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 200px' },
          gap: '12',
          mt: '12',
          alignItems: 'start',
        })}
      >
        <div>
          <div id="mission">
            <Section nodes={sections.mission} />
          </div>
          <div id="competences" className={css({ mt: '12' })}>
            <Section nodes={sections.competences} />
          </div>
          <div id="pourquoi" className={css({ mt: '12' })}>
            <Section nodes={sections.pourquoi} />
          </div>
          {contact && (
            <div className={css({ mt: '12' })}>
              <HiringContact
                contact={contact as HiringContactType}
                applyEmail={frontmatter.applyEmail}
                jobTitle={frontmatter.title}
              />
            </div>
          )}
        </div>
        <div className={css({ display: { base: 'none', lg: 'block' } })}>
          <ScrollspyToc />
        </div>
      </div>
    </div>
  );
}
