import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { data, useLoaderData } from 'react-router';

import { OfferArticle } from '~/components/offers/OfferArticle';
import { Container } from '~/components/ui/Container';
import { createHybridLoader } from '~/modules/cache';
import { fetchOffer } from '~/modules/content';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const { slug } = params;
    const language = getLang(params);

    if (!slug) {
      throw new Response('Not Found', { status: 404 });
    }

    const [status, _state, offer] = await fetchOffer(slug, language);

    if (status !== 200 || !offer) {
      throw new Response('Not Found', { status: 404 });
    }

    return data(
      { offer },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
          Vary: 'Accept-Language',
        },
      },
    );
  },
  'offer',
);

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  return getMetaTags({
    title: data?.offer.frontmatter.title,
    description: data?.offer.frontmatter.description,
    locale: getLang(params),
  });
};

export default function OfferDetail() {
  const { offer } = useLoaderData<typeof loader>();

  return (
    <Container>
      <OfferArticle offer={offer} />
    </Container>
  );
}
