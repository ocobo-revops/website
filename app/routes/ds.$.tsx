import { type LoaderFunctionArgs, redirect } from 'react-router';

/** Short alias: `/ds` and `/ds/<page>` lead to the design system. */
export function loader({ params, request }: LoaderFunctionArgs) {
  const page = params['*'];
  const { search } = new URL(request.url);
  throw redirect(`/design-system${page ? `/${page}` : ''}${search}`);
}
