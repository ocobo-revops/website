import type { UIMatch } from 'react-router';

/**
 * Convert a `@react-router/fs-routes` route id (e.g.
 * `routes/_main.($lang).blog.$slug`) into a stable pattern string
 * (`/[lang]/blog/[slug]`) for analytics tools that expect a parameterised
 * route — Vercel Speed Insights in particular. Bracket syntax matches the
 * Next.js convention Speed Insights' Routes tab is tuned for.
 *
 * Rules:
 * - `routes/` prefix is stripped
 * - Segments are split on `.` outside `[...]` escapes (so `robots[.txt]` stays
 *   intact)
 * - `_index` segments are dropped
 * - Pathless layout segments (`_main`, `_layout`, …) are dropped
 * - `$param` → `[param]`
 * - `($param)` → `[param]` (optional collapses to a single pattern so
 *   FR and EN aggregate together)
 * - `[literal]` fs-routes escapes are unwrapped (e.g. `robots[.txt]` →
 *   `robots.txt`); param + trailing escape combos like `$slug[.json]` are
 *   preserved as `[slug].json`
 */
export function routeIdToPattern(id: string): string {
  const stripped = id.replace(/^routes\//, '');
  const segments = splitSegments(stripped)
    .filter((segment) => segment !== '_index')
    .filter((segment) => !isPathlessLayout(segment))
    .map(transformSegment);

  if (segments.length === 0) return '/';
  return `/${segments.join('/')}`;
}

export function matchesToRoutePattern(
  matches: ReadonlyArray<Pick<UIMatch, 'id'>>,
): string | undefined {
  // The leaf match is always path-bearing under `@react-router/fs-routes` —
  // pathless layouts (`_main`, `_layout`, …) can't be a leaf because they
  // can't own a URL. See React Router `useMatches()` semantics.
  const last = matches[matches.length - 1];
  if (!last) return undefined;
  return routeIdToPattern(last.id);
}

function splitSegments(input: string): string[] {
  const segments: string[] = [];
  let current = '';
  let depth = 0;
  for (const char of input) {
    if (char === '[') {
      depth++;
      current += char;
      continue;
    }
    if (char === ']') {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }
    if (char === '.' && depth === 0) {
      segments.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  if (current) segments.push(current);
  return segments;
}

function isPathlessLayout(segment: string): boolean {
  return segment.startsWith('_');
}

function transformSegment(segment: string): string {
  const optional = segment.match(/^\(\$(\w+)\)(.*)$/);
  if (optional) {
    return `[${optional[1]}]${unwrapEscapes(optional[2])}`;
  }
  const required = segment.match(/^\$(\w+)(.*)$/);
  if (required) {
    return `[${required[1]}]${unwrapEscapes(required[2])}`;
  }
  return unwrapEscapes(segment);
}

function unwrapEscapes(segment: string): string {
  return segment.replace(/\[([^\]]*)\]/g, '$1');
}
