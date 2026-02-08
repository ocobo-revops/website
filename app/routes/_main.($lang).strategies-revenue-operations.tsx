import { type LoaderFunctionArgs, redirect } from 'react-router';

import { getLang } from '~/utils/lang';
import { redirectWithLocale } from '~/utils/redirections';
import { url } from '~/utils/url';

export async function loader(args: LoaderFunctionArgs) {
  await redirectWithLocale(args);
  throw redirect(`/${getLang(args.params)}${url.offer}`, 301);
}

export default function StrategyRedirect() {
  return null;
}
