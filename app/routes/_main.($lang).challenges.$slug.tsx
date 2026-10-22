import { useTranslation } from 'react-i18next';
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from 'react-router';

import { ChallengeAudience } from '~/components/challenges/challenge-audience';
import { ChallengeDiagnostic } from '~/components/challenges/challenge-diagnostic';
import { ChallengeHero } from '~/components/challenges/challenge-hero';
import { challengePalette } from '~/components/challenges/challenge-palette';
import { ChallengeSymptoms } from '~/components/challenges/challenge-symptoms';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { buildChallengePage, isChallengeSlug } from '~/modules/challenge-page';
import { fetchChallenge } from '~/modules/content/api';
import { loadChallengeReferences } from '~/modules/content/challenge-references';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';

const notFound = () => new Response('Not Found', { status: 404 });

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
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
  const references = await loadChallengeReferences(
    slug,
    challenge.frontmatter,
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
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className={challengePalette[page.key]}>
      <ChallengeHero
        hero={page.hero}
        challenge={page.key}
        name={page.name}
        order={page.order}
        hasDiagnostic={page.diagnostic !== null}
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
      {page.diagnostic ? (
        <ChallengeDiagnostic
          diagnostic={page.diagnostic}
          fallbackCta={t('diagnostic.cta')}
        />
      ) : null}
    </div>
  );
}
