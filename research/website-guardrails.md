# Existing guardrails in the website repo

Research for Linear GTM-57 (map GTM-54). Question: what can a QA or tester agent verify alone, without a human, on this repo today? For each guardrail: what it catches, what it misses, and what a non-technical requester would need to judge an agent's PR from the Vercel preview alone.

Sources are files in this repo at `origin/main` (commit d25b140) and the GitHub API for the `ocobo-revops/website` rulesets. Tests were not run: `node_modules` is absent in the worktree.

## Answer

An agent can verify alone: formatting and a narrow lint, types and Panda token use, about 90 unit and component test files, and a small Playwright smoke run on local content. Only `lint`, `format` and `test` are required to merge. `typecheck`, `e2e` and the Vercel deployment run but do not block. Nothing automated checks visual output, FR/EN key parity, SEO tags, or pages fed by the `posts` repo. The preview is the only place those can be judged, and today it needs a human who knows which pages to open.

## Merge rules (GitHub)

Source: `gh api repos/ocobo-revops/website/rulesets`.

- Ruleset `protect-main` (active): no deletion, no force push, one approving review, required checks `lint`, `format`, `test`.
- Not required: `typecheck`, `e2e`, `Vercel`. All three report on PRs (checked on PR #344 head commit).
- Bypass in pull-request mode: organisation admins and the repository admin role.
- Ruleset `main` is disabled.
- ADR 0002 line 150 says "`pnpm typecheck` is a required CI check from J1". The ruleset does not require it. This contradicts the ADR.

## Inventory

### CI workflow

Source: `.github/workflows/test.yml`, single workflow, five jobs on push and PR to `main` and `develop`. Each job runs `pnpm install --frozen-lockfile` then `pnpm prepare` (Panda codegen).

| Job | Command | Required |
|---|---|---|
| lint | `pnpm check:error` | yes |
| format | `pnpm check` | yes |
| typecheck | `pnpm typecheck` | no |
| test | `pnpm test:run`, then `pnpm test:coverage` with `continue-on-error: true` | yes |
| e2e | `pnpm test:e2e` (Chromium only installed) | no |

- Catches: lockfile out of sync, Panda codegen failure, and everything listed below for each command.
- Misses: no production build (`react-router build`) runs in CI. A build-only failure shows only on the Vercel deployment, which is not required.
- Coverage thresholds (80% on `app/modules/**`, `vitest.config.ts`) never block: the step is `continue-on-error`.
- No Dependabot, Renovate or CODEOWNERS file: `.github/` holds only `workflows/`.

### `pnpm check` (Biome 1.9.4)

Source: `biome.json`, `package.json` scripts.

- Catches: formatting, import order, unused variables and imports, a short list of correctness and suspicious rules.
- `"recommended": false`: only rules listed by hand apply. No `a11y` or `style` group is enabled.
- `files.include` is `["app"]`: `preset/`, `e2e/`, `scripts/`, `panda.config.ts` and config files are never linted or formatted.
- Misses: everything about rendered output.

### `pnpm typecheck` (react-router typegen + tsc)

Source: `package.json`, `tsconfig.json`, `panda.config.ts` line 21 (`strictTokens: true`).

- Catches: type errors across the whole repo (`**/*.ts(x)`, including `preset/` and `e2e/`), route type mismatches through typegen, and with `strictTokens` any raw style value instead of a Panda token (ADR 0002 line 82).
- Misses: the `'[value]'` escape hatch passes by design. A wrong token (right type, wrong choice) passes. Dynamic `css()` values that Panda cannot extract type-check fine but ship only the default branch (CLAUDE.md §7).
- Not a required check (see above).

### Vitest

Source: `vitest.config.ts`, about 90 `*.test.ts(x)` files under `app/`.

- Environment `jsdom`, setup `app/test/setup.ts`, MSW handlers under `app/test/`.
- Strong on `app/modules`: content API, GitHub source, processor, Zod schemas (`schemas.test.ts`, `challenge-schema.test.ts`), cache strategy, env loader, feature flags, language helpers, redirections, sitemap loader, job posting JSON-LD (snapshot).
- Route loader tests exist for home, about-us, challenges, clients, jobs, method, studio, blog post.
- 17 files use `jest-axe` (`toHaveNoViolations`): accessibility on the components they render in jsdom.
- Misses: content tests run on fixtures, never on the real `posts` repo. No test reads `locales/` to compare FR and EN. `app/utils/metatags.ts` has no test. No test for `entry.server.tsx` (cache headers on the response, status 500 on render error).

### Playwright e2e

Source: `playwright.config.ts`, `e2e/` (3 spec files, 305 lines).

- Runs `pnpm dev:local` with `CONTENT_SOURCE=locale` and placeholder GitHub variables. Projects: desktop Chrome and Pixel 5.
- Checks: home title, hero heading, CTAs to `/contact`, contact page and HubSpot container, `/en/` smoke, challenge routing (404s and the `/fr` redirect), design system pages (links, current page, keyboard sidebar, no horizontal scroll at 375px).
- In CI the local source path is `~/projects/ocobo/<GITHUB_REPO>` (`app/modules/env.server.ts` line 96), which does not exist on the runner. So no blog post, story, job or challenge page renders with content in e2e (`e2e/challenges.spec.ts` comment says so).
- `PLAYWRIGHT_BASE_URL` lets the same suite run against a deployed preview. Nothing in CI uses it.
- No screenshot comparison. ADR 0002 lines 24 and 28 reject it until J6, for cost reasons (posts content pinned in CI, Linux baselines).
- Not a required check.

### Vercel previews

Source: commit statuses on PR #344 (`Vercel` context), CLAUDE.md §1 and §13. No `vercel.json` in the repo; project settings live in Vercel.

- Catches: a production build failure (status goes red), and gives a URL with real `posts` content from GitHub.
- Misses: nothing is run against the preview. It is not a required check. The preview env (`GITHUB_BRANCH`, `DISABLED_PAGES`) is set in Vercel, outside the repo, so an agent cannot know which content branch it shows without Vercel access.

### J1 route review checklist

Source: `docs/development/j1-route-review-checklist.md`.

- A manual list: 13 route groups, 4 views each (FR and EN, desktop 1440px and mobile 375px), with the expected change per route.
- Catches: visual regressions after a `preset/` change, when a human runs it.
- Misses: it is specific to the J1 token migration. It lists expected diffs, with no "looks right" baseline for an unrelated change. Only required, by CLAUDE.md §2, when `preset/` changes.
- An agent with a browser could walk the route list and take screenshots. It cannot decide "accepted" without a reference image.

### ADR 0001 and ADR 0002

Source: `docs/adr/0001-design-system-adoption-policy.md`, `docs/adr/0002-design-system-v2.md`.

- Rules: typography through `text()`, sections through `section()`, cards through `card()`, tokens only.
- Enforced by tooling: raw values (strictTokens, at typecheck). Everything else (inline `fontFamily: 'display'`, inline `maxW: '7xl'` containers, inline border plus radius plus shadow, alias variant names, AI gradient only on AI content) relies on review. ADR 0002 line 72 states no tool can check the gradient rule.
- A grep-based CI script was considered as a fallback in ADR 0002 line 82. It does not exist.

## Gaps by risk

| Risk | Caught today by | Gap |
|---|---|---|
| Visual regression | Nobody automatically. J1 checklist by hand, only for `preset/` | No screenshots, no baseline |
| Missing i18n key | Nothing. `fallbackLng` is `fr` (`app/localization/i18n.ts` line 8), so a missing EN key renders French silently | No FR/EN parity test. A quick `jq` diff today finds `strategy.json` with 2 keys present in EN only, so parity is already off |
| Hardcoded UI copy | Review only (CLAUDE.md §3) | No lint rule |
| SEO | `sitemap[.xml].test.ts` tests the loader | Sitemap is hand-written: it lists `/stories/<slug>` while routes are `/clients/<slug>`, and omits EN, studio, technology (`app/routes/sitemap[.xml].tsx`). No test on meta tags, `rel="canonical"`, hreflang |
| Broken content from `posts` | Zod schemas, tested on fixtures | A `posts` change never runs website CI. Website CI never reads real `posts`. Keeping the two schemas in step is manual (`challenge-schema.ts` header) |
| Build failure | Vercel status | Not required, no `react-router build` in CI |
| Type or token error | `typecheck` | Not required |
| Accessibility | `jest-axe` on 17 component tests | Not on full pages, not in e2e |

## Candidate sensitive zones

Zones where an agent change can break production with no required check failing.

- **`preset/`** (tokens, recipes): every page reads it. ADR 0002 line 28: a shared recipe change can alter pages not being redesigned, with no screenshot guard. Biome does not lint `preset/`. Needs `pnpm prepare` plus `panda cssgen --clean`, or classes go missing (CLAUDE.md §16).
- **`app/modules/cache.ts` and `app/entry.server.tsx`**: headers are set for every HTML response here. `getCacheStrategyForPath` maps only `/blog` and `/clients`; anything else gets 24h `s-maxage` plus 7 days of `stale-while-revalidate`. A wrong value keeps a broken page on the CDN for a day or more. `entry.server.tsx` already has to bypass cache when the challenge menu fails, a sign of how easy it is to cache a bad render. No test on `entry.server.tsx`.
- **Routing (`app/routes/`, `app/routes.ts`)**: flat fs-routes, so a file rename changes a public URL. 53 files. The sitemap is a separate hand-written list that does not follow.
- **Redirections (`app/utils/redirections.ts`)**: 301 redirects for the unprefixed locale and old blog IDs. A 301 is cached by browsers and search engines; a mistake is hard to undo.
- **Dependencies (`package.json`, `pnpm-lock.yaml`)**: no bot, no CODEOWNERS. CI only checks the lockfile is in sync; no build runs in CI.
- **CI (`.github/workflows/test.yml`) and the ruleset**: an agent editing the workflow can weaken its own checks. The required check names are matched by job name only.
- **Env (`app/modules/env.server.ts`, `app/modules/types.ts`)**: throws on missing GitHub variables; `NODE_ENV=production` forces the GitHub source. Preview and production values live in Vercel, out of reach of the repo.
- **Content schemas (`app/modules/schemas.ts`, `app/modules/challenge-schema.ts`)**: must accept every file the `posts` repo accepts. A tighter schema turns live pages into validation errors; tests use fixtures only.
- **Feature flags (`app/modules/feature-flags.ts`)**: `DISABLED_PAGES` replaces the default list, so a change here can publish an unfinished page (`roi` is guarded by a second list for that reason).
- **i18n (`locales/`, `app/localization/`)**: silent French fallback, see above.

## What is missing for a non-technical requester to judge from the preview alone

1. Make `typecheck`, `e2e` and `Vercel` required checks, so a green PR means the preview built and the smoke tests passed.
2. Run the Playwright suite against the preview URL (`PLAYWRIGHT_BASE_URL`), with real `posts` content, instead of only local placeholders.
3. A PR comment listing the preview links to the pages the diff touches, in FR and EN, desktop and mobile. The requester then knows where to look.
4. Before and after screenshots of those pages (production against preview), posted on the PR. ADR 0002 rejects baselines kept in the repo; a comparison against production on demand does not need them. This needs a new decision, since ADR 0002 defers screenshots to J6.
5. A FR/EN key parity check and a "no French text on `/en`" check.
6. An SEO smoke on the preview: title, description, `rel="canonical"`, hreflang, `robots.txt`, sitemap URLs returning 200.
7. A plain-language PR summary: what changed for a visitor, which pages, and whether a sensitive zone above was touched. A change in a sensitive zone should require a technical reviewer, for example through CODEOWNERS.

## Open points

- Whether Vercel redirects `/stories/*` to `/clients/*` at project level: not visible in the repo. If not, the sitemap lists dead URLs.
- Vercel preview env values (`GITHUB_BRANCH`, `DISABLED_PAGES`) were not checked.
- CLAUDE.md §6 says the local content path is `~/projects/ocobo-posts/`; the code builds `~/projects/ocobo/<GITHUB_REPO>`.
- Test pass rate today was not measured (no `node_modules`). PR #344 shows all five jobs green.
