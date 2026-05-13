import type { UIMatch } from 'react-router';

/**
 * Convert a `@react-router/fs-routes` route id (e.g.
 * `routes/_main.($lang).blog.$slug`) into a stable pattern string
 * (`/:lang?/blog/:slug`) suitable for analytics tools that expect a
 * parameterised route — Vercel Speed Insights in particular.
 *
 * Rules:
 * - `routes/` prefix is stripped
 * - Segments are split on `.` outside `[...]` escapes (so `robots[.txt]` stays
 *   intact)
 * - `_index` segments are dropped
 * - Pathless layout segments (`_main`, `_layout`, …) are dropped
 * - `$param` → `:param`
 * - `($param)` → `:param?` (optional)
 * - `[literal]` escapes are unwrapped (e.g. `robots[.txt]` → `robots.txt`)
 */
export function routeIdToPattern(id: string): string {
  const stripped = id.replace(/^routes\//, '');
  const segments = splitSegments(stripped)
    .filter((segment) => segment !== '_index')
    .filter((segment) => !isPathlessLayout(segment))
    .map(transformSegment);

  if (segments.length === 0) return '/';
  return '/' + segments.join('/');
}

export function matchesToRoutePattern(
  matches: ReadonlyArray<Pick<UIMatch, 'id'>>,
): string | undefined {
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
  if (segment.startsWith('($') && segment.endsWith(')')) {
    return ':' + segment.slice(2, -1) + '?';
  }
  if (segment.startsWith('$')) {
    return ':' + segment.slice(1);
  }
  return unwrapEscapes(segment);
}

function unwrapEscapes(segment: string): string {
  return segment.replace(/\[([^\]]*)\]/g, '$1');
}
