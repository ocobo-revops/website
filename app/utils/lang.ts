import { Params } from 'react-router';

import { type Language, languages } from '~/localization/resources';
import { DEFAULT_LANGUAGE } from '~/modules/language';

/** The `($lang)` segment, or the default language when it is absent. */
export function getLangParam(params: Params<string>): string {
  return params.lang ?? DEFAULT_LANGUAGE;
}

export function getLang(params: Params<string>) {
  const lang = getLangParam(params);

  if (!languages.includes(lang as Language)) {
    throw new Response(null, {
      status: 404,
      statusText: `Not Found: Invalid language ${lang}`,
    });
  }
  return lang as Language;
}

export function getLocaleFromPathname(pathname: string) {
  return pathname.split('/')[1] as Language;
}
