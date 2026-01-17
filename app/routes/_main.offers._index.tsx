import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';

import { OfferList } from '~/components/offers/OfferList';
import { Container } from '~/components/ui/Container';
import { createHybridLoader } from '~/modules/cache';
import { fetchOffers } from '~/modules/content';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const language = getLang(params);
    const [status, state, offerData] = await fetchOffers(language);

    // Handle case where offers directory doesn't exist or has no content
    // This is not an error, just means no offers are available yet
    if (status === 404 || state === 'not_found') {
      return { offers: [], isError: false };
    }

    // Handle actual errors (validation errors, source errors, etc.)
    if (status !== 200 || !offerData) {
      console.error(`Failed to fetch offers: ${state}`);
      return { offers: [], isError: true };
    }

    // Sort by date (newest first)
    const offers = offerData
      .map((entry) => ({
        ...entry,
        _sortDate: new Date(entry.frontmatter.date).getTime(),
      }))
      .sort((a, b) => b._sortDate - a._sortDate)
      .map(({ _sortDate, ...entry }) => entry);

    return { offers, isError: false };
  },
  'offer',
);

export const meta: MetaFunction<typeof loader> = ({ params }) => {
  return getMetaTags({
    title: "Offres d'emploi",
    description: 'Rejoignez notre équipe',
    locale: getLang(params),
  });
};

export default function OffersIndex() {
  const { offers, isError } = useLoaderData<typeof loader>();

  if (isError) {
    return (
      <Container>
        <div>Erreur lors du chargement des offres</div>
      </Container>
    );
  }

  return (
    <Container>
      <OfferList items={offers} />
    </Container>
  );
}
