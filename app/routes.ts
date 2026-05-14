import { flatRoutes } from '@react-router/fs-routes';

// Co-located route tests (`*.test.ts(x)`) live next to their routes for
// faster discovery; exclude them from the route scan.
export default flatRoutes({
  ignoredRouteFiles: ['**/*.test.{ts,tsx}'],
});
