import type { MetaFunction } from 'react-router';

import { Language } from '~/localization/resources';
import { applyFrenchTypography } from './typography';

type GetMetaTagsParams = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  useCatchPhraseInTitle?: boolean;
  standaloneTitle?: boolean;
  noIndex?: boolean;
  type?: 'website' | 'article';
  meta?: Record<string, string>;
  locale?: Language;
};

const getTitle = (
  standaloneTitle: boolean,
  useCatchPhraseInTitle: boolean,
  title: string,
) =>
  standaloneTitle
    ? title
    : useCatchPhraseInTitle
      ? `${title} · RevOps & Stratégies Revenue`
      : `Ocobo · ${title}`;

// return a list of all meta tags for a route's meta function
const getMetaTags: (params: GetMetaTagsParams) => ReturnType<MetaFunction> = ({
  title = 'Ocobo',
  description = 'Ocobo vous permet de faire plus avec moins. Organisez vos équipes, déployez des processus de pointe et boostez vos performances',
  image = '',
  imageAlt = 'ocobo.co',
  useCatchPhraseInTitle = false,
  standaloneTitle = false,
  noIndex = false,
  type = 'website',
  locale = 'fr',
}) => {
  const localised = locale === 'fr' ? applyFrenchTypography : (s: string) => s;
  const finalTitle = localised(
    getTitle(standaloneTitle, useCatchPhraseInTitle, title),
  );
  const finalDescription = localised(description);

  const metaTags = [
    { title: finalTitle },
    { name: 'og:title', content: finalTitle },
    { name: 'og:locale', content: locale },
    { name: 'twitter:title', content: finalTitle },
    { name: 'description', content: finalDescription },
    { name: 'og:description', content: finalDescription },
    { name: 'twitter:description', content: finalDescription },
    { name: 'twitter:card', content: 'summary_large_image' },
    // { name: 'twitter:site', content: '' },
    // { name: 'twitter:creator', content: '' },
    { name: 'theme-color', content: 'rgb(94 234 212)' },
    { name: 'og:type', content: type },
    { name: 'robots', content: noIndex ? 'noindex' : 'all' },
  ];
  if (image && imageAlt) {
    metaTags.push(
      { name: 'image', content: image },
      { name: 'og:image', content: image },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:src', content: image },
      { name: 'twitter:tile:image', content: image },
    );
    metaTags.push(
      { name: 'image:alt', content: imageAlt },
      { name: 'og:image:alt', content: imageAlt },
      { name: 'twitter:image:alt', content: imageAlt },
    );
  }
  return metaTags;
};

export { getMetaTags };
