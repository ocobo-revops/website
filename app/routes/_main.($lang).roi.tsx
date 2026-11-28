import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

import { RoiDiagnostic } from '~/components/roi/roi-diagnostic';
import { RoiExperience } from '~/components/roi/roi-experience';
import { RoiHero } from '~/components/roi/roi-hero';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { throwIfDisabled } from '~/modules/feature-flags';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  throwIfDisabled('roi');
  const lang = getLang(args.params);
  const t = await i18nServer.getFixedT(lang, 'roi');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    // No ROI share image yet: the homepage one stands in.
    ogImageSrc: getImageOgFullPath('homepage', args.request.url),
    lang,
  };
}, 'static');

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [];
  }
  return getMetaTags({
    title: data.title,
    description: data.description,
    image: data.ogImageSrc,
    locale: getLang(params),
  });
};

export default function RoiPage() {
  return (
    <div>
      <RoiHero />
      <RoiExperience />
      <RoiDiagnostic />
    </div>
  );
}
