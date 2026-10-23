import { useTranslation } from 'react-i18next';
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from 'react-router';

import { ChallengeAudience } from '~/components/challenges/challenge-audience';
import { ChallengeClientCase } from '~/components/challenges/challenge-client-case';
import { ChallengeDiagnostic } from '~/components/challenges/challenge-diagnostic';
import { ChallengeExperts } from '~/components/challenges/challenge-experts';
import { ChallengeHero } from '~/components/challenges/challenge-hero';
import { ChallengeMethod } from '~/components/challenges/challenge-method';
import { ChallengeOtherChallenges } from '~/components/challenges/challenge-other-challenges';
import { challengePalette } from '~/components/challenges/challenge-palette';
import { ChallengeSymptoms } from '~/components/challenges/challenge-symptoms';
import { ChallengeWorkstreams } from '~/components/challenges/challenge-workstreams';
import { useOtherChallenges } from '~/hooks/use-challenge-menu';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { buildChallengePage, isChallengeSlug } from '~/modules/challenge-page';
import { buildChallengeReferenceSections } from '~/modules/challenge-reference-sections';
import { fetchChallenge } from '~/modules/content/api';
import { loadChallengeReferences } from '~/modules/content/challenge-references';
import { throwIfDisabled } from '~/modules/feature-flags';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';

const notFound = () => new Response('Not Found', { status: 404 });

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  // Before the redirect: a disabled page answers 404 on every URL.
  throwIfDisabled('challenges');
  await redirectWithLocale(args);
  const lang = getLang(args.params);
  const { slug } = args.params;

  // The slug becomes a file path in the content source: kebab-case only.
  if (!slug || !isChallengeSlug(slug)) {
    throw notFound();
  }

  const [[status, , challenge], t] = await Promise.all([
    fetchChallenge(slug, lang),
    i18nServer.getFixedT(lang, 'challenges'),
  ]);

  if (status !== 200 || !challenge) {
    throw notFound();
  }

  const page = buildChallengePage(challenge.frontmatter);
  // Never throws: a broken reference hides only the block that needs it.
  // Only the section view models ship to the client.
  const references = buildChallengeReferenceSections(
    await loadChallengeReferences(slug, challenge.frontmatter, lang),
    lang,
  );
  const { name, tagline } = page;
  const description = [page.hero.lead, page.hero.highlight]
    .filter(Boolean)
    .join(' ');

  return {
    page,
    references,
    lang,
    slug,
    title: tagline
      ? t('meta.title', {
          name,
          tagline,
          interpolation: { escapeValue: false },
        })
      : name,
    description: description || tagline || undefined,
  };
}, 'static');

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }
  return getMetaTags({
    title: data.title,
    description: data.description,
    locale: data.lang,
  });
};

export default function ChallengeRoute() {
  const { t } = useTranslation('challenges');
  const { page, references, slug } = useLoaderData<typeof loader>();
  const { clientCase, experts } = references;
  // The `_main` layout already loads and caches the published list.
  const otherChallenges = useOtherChallenges(slug);

  return (
    <div className={challengePalette[page.key]}>
      <ChallengeHero
        hero={page.hero}
        challenge={page.key}
        name={page.name}
        order={page.order}
        hasDiagnostic={page.diagnostic !== null}
        hasWorkstreams={page.workstreams !== null}
      />
      {page.symptoms ? (
        <ChallengeSymptoms
          symptoms={page.symptoms}
          eyebrow={t('symptoms.eyebrow')}
        />
      ) : null}
      {page.audience ? (
        <ChallengeAudience
          audience={page.audience}
          title={t('audience.title')}
          intro={t('audience.intro')}
        />
      ) : null}
      {page.workstreams ? (
        <ChallengeWorkstreams
          workstreams={page.workstreams}
          challenge={page.key}
          defaultTitle={t('workstreams.title')}
        />
      ) : null}
      {page.method ? (
        <ChallengeMethod
          method={page.method}
          challenge={page.key}
          tools={references.methodTools}
        />
      ) : null}
      {clientCase ? (
        <ChallengeClientCase clientCase={clientCase} challenge={page.key} />
      ) : null}
      {experts.length > 0 ? (
        <ChallengeExperts
          experts={experts}
          challenge={page.key}
          challengeName={page.name}
          hasDiagnostic={page.diagnostic !== null}
          afterClientCase={clientCase !== null}
        />
      ) : null}
      {page.diagnostic ? (
        <ChallengeDiagnostic
          diagnostic={page.diagnostic}
          fallbackCta={t('diagnostic.cta')}
        />
      ) : null}
      {otherChallenges.length > 0 ? (
        <ChallengeOtherChallenges challenges={otherChallenges} />
      ) : null}
    </div>
  );
}
