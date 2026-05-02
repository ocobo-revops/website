import {
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from 'react-router';
import { useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import { AboutOcoboSection } from '~/components/jobs/about-ocobo-section';
import { ApplyCta } from '~/components/jobs/detail/apply-cta';
import { Header } from '~/components/jobs/detail/header';
import { HiringContact } from '~/components/jobs/detail/hiring-contact';
import { Intro } from '~/components/jobs/detail/intro';
import { ScrollspyToc } from '~/components/jobs/detail/scrollspy-toc';
import { Section } from '~/components/jobs/detail/section';
import { createHybridLoader } from '~/modules/cache';
import {
  buildJobPostingLd,
  extractJobSections,
  fetchJob,
  loadContactRegistry,
  resolveContact,
} from '~/modules/content';
import type { HiringContact as HiringContactType } from '~/modules/schemas';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(
  async ({ params, request }: LoaderFunctionArgs) => {
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
    const { origin } = new URL(request.url);
    const ld = buildJobPostingLd(job.frontmatter, contact, origin, slug, lang);

    return { job, sections, contact, lang, slug, ld };
  },
  'job',
);

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  return getMetaTags({
    title: data.job.frontmatter.title,
    description: data.job.frontmatter.intro,
    locale: data.lang as 'fr' | 'en',
    type: 'website',
  });
};

export default function JobDetail() {
  const { job, sections, contact, lang, ld } = useLoaderData<typeof loader>();
  const { frontmatter } = job;

  return (
    <div
      className={css({
        width: 'full',
        bg: 'white',
        pt: '32',
        pb: '24',
      })}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <div
        className={css({
          maxW: '7xl',
          mx: 'auto',
          px: { base: '4', sm: '6', lg: '8' },
        })}
      >
        <Header frontmatter={frontmatter} lang={lang} />

        {/* Main layout: sidebar LEFT + content RIGHT */}
        <div
          className={`${flex({ direction: { base: 'column', lg: 'row' }, gap: '16' })} ${css({ position: 'relative' })}`}
        >
          {/* Sidebar */}
          <aside className={css({ lg: { w: '1/4' } })}>
            <div className={css({ position: 'sticky', top: '32' })}>
              <ScrollspyToc />
              <div className={css({ mt: '8' })}>
                <AboutOcoboSection
                  applyEmail={frontmatter.applyEmail}
                  jobTitle={frontmatter.title}
                />
              </div>
            </div>
          </aside>

          {/* Content */}
          <article className={css({ lg: { w: '3/4' }, maxW: '3xl' })}>
            <Intro text={frontmatter.intro} />

            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '24',
              })}
            >
              <div id="mission" className={css({ scrollMarginTop: '40' })}>
                <Section nodes={sections.mission} />
              </div>
              <div
                id="responsabilites"
                className={css({ scrollMarginTop: '40' })}
              >
                <Section nodes={sections.responsabilites} />
              </div>
              <div id="profil" className={css({ scrollMarginTop: '40' })}>
                <Section nodes={sections.profil} />
              </div>
            </div>

            {contact && (
              <div
                className={css({
                  mt: '24',
                  pt: '12',
                  borderTopWidth: '1px',
                  borderColor: 'gray.100',
                })}
              >
                <HiringContact contact={contact as HiringContactType} />
              </div>
            )}

            <ApplyCta
              applyEmail={frontmatter.applyEmail}
              jobTitle={frontmatter.title}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
