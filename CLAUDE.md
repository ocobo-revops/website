# CLAUDE.md

Project guide for Claude Code and any other coding agent working on the Ocobo website. Curated entry point — agent-specific rules + pointers into `docs/`. `AGENTS.md` is a symlink to this file.

---

## 1. What this is

Ocobo is a RevOps consulting platform. The website is a React Router v7 (formerly Remix) full-stack app, server-rendered on Vercel Edge.

- **Framework**: React Router v7, file-based routing via `@react-router/fs-routes`, SSR on Vercel Edge with stale-while-revalidate.
- **Styling**: Panda CSS — atomic, zero-runtime, type-safe. UI primitives from Ark UI.
- **Content**: Markdoc + Zod, sourced from a sibling GitHub repo (or local filesystem in dev).
- **i18n**: `react-i18next` / `remix-i18next`. FR default, EN at `/en/*`.

Other versions/deps live in `package.json` — read it if a version matters to the task.

---

## 2. Commands

```bash
pnpm dev:local            # Dev server, local filesystem content
pnpm dev:github           # Dev server, GitHub API content
pnpm check                # Biome lint + format
pnpm typecheck            # react-router typegen && tsc
pnpm test                 # Vitest (watch); test:run for single, test:coverage for coverage
pnpm prepare              # panda codegen — required after token/recipe changes
```

Variants (`check:fix`, `check:error`, `build:analyze`, `start`, etc.) live in `package.json` scripts.

After recipe edits, also run the raw Panda CLI to rebuild atomic CSS: `pnpm panda cssgen --clean`.

**Before declaring work done**: `pnpm check && pnpm typecheck` must be green. Run tests when logic changed.

---

## 3. Golden rules

- **i18n required** — every user-facing string lives in `locales/fr/*.json` and `locales/en/*.json`. Never hardcode UI copy.
- **SSR first** — assume server render + client hydration. Guard browser-only APIs (`window`, `document`) behind `useEffect` or `typeof window !== 'undefined'`.
- **Check the component inventory** before creating a new component — many homepage/offer/method blocks already exist. See [docs/development/component-inventory.md](docs/development/component-inventory.md).
- **Follow ADR-0001** — typography goes through `text()`, sections through `section()`, cards through `card()`. The ADR is auto-loaded below (§7).
- **Named exports only**, no default exports. **Kebab-case filenames** for new files (existing PascalCase files keep their names until refactored).
- **No barrel files** (`index.ts` re-exports) — import directly from the module file.
- **Small files** — ~400 lines typical, 800 max.
- **Immutability** — return new objects, don't mutate.
- **No new top-level docs** unless explicitly requested. Update the relevant doc under `docs/`.

---

## 4. Source-of-truth files

Read these before inferring data structures, env shape, or content pipelines. Cheap to keep inline — they're the things Claude needs to know exist on every task.

| Concern | File |
|---------|------|
| Content Zod schemas (Story, Blogpost, Page, Job) | [app/modules/schemas.ts](app/modules/schemas.ts) |
| Content fetching interfaces | [app/modules/content/types.ts](app/modules/content/types.ts) |
| Content API factory (source dispatch) | [app/modules/content/factory.ts](app/modules/content/factory.ts) |
| Content public API | [app/modules/content/api.ts](app/modules/content/api.ts) |
| Markdoc renderer config | [app/modules/config.ts](app/modules/config.ts) |
| Env var types (public vs private) | [app/modules/types.ts](app/modules/types.ts) |
| Server env loader (throws on missing) | [app/modules/env.server.ts](app/modules/env.server.ts) |
| Edge cache strategy | [app/modules/cache.ts](app/modules/cache.ts) |
| Feature flags | [app/modules/feature-flags.ts](app/modules/feature-flags.ts) |
| Panda CSS config | [panda.config.ts](panda.config.ts) |
| Design system preset entry | [preset/index.ts](preset/index.ts) |
| Route config (flat fs-routes) | [app/routes.ts](app/routes.ts) |
| Root layout, providers, error boundary | [app/root.tsx](app/root.tsx) |
| Client i18n setup | [app/localization/i18n.ts](app/localization/i18n.ts) |
| Server i18n setup | [app/localization/i18n.server.ts](app/localization/i18n.server.ts) |

---

## 5. Routing (summary)

- File-based via `@react-router/fs-routes` (`flatRoutes()` in [app/routes.ts](app/routes.ts)).
- `_main.tsx` is a thin shell: wraps `<Outlet>` with `LayoutMain` (which carries the navbar/footer) plus an opacity transition during navigation, and exports an `ErrorBoundary`. The header/footer/skip-link live inside `LayoutMain`, not here.
- `_main.($lang).<path>.tsx` — optional `($lang)` segment captures `en`; absence means French. Derive language via `app/utils/lang.ts`, not by parsing params directly.
- Blog and media routes are not locale-prefixed.
- SEO routes use bracket-escaped extensions: `robots[.txt].tsx`, `sitemap[.xml].tsx`.
- Loaders wrap their fetcher in `createHybridLoader` from [app/modules/cache.ts](app/modules/cache.ts) for consistency, **but the strategy argument is currently a no-op** — the function is pass-through and kept for backward compatibility. Cache headers are applied centrally in `app/entry.server.tsx`, using `getCacheStrategyForPath(pathname)` to map URL → strategy (`/blog*` → `blogPost`, `/clients*` → `story`, else `static`). When adding a new content section, extend that mapping rather than passing a strategy to the loader.

Full route map + tree analysis → [docs/architecture/source-tree.md](docs/architecture/source-tree.md).

---

## 6. Content pipeline (summary)

- Two sources, one API. Switch via `CONTENT_SOURCE` (`locale` or `github`).
- **Local**: `~/projects/ocobo-posts/` (path via `localeRepoAPIUrl`).
- **GitHub**: `@octokit/rest`, branch via `GITHUB_BRANCH` (e.g. `offers` to preview placeholders).
- Markdown + frontmatter → Markdoc → Zod validation → loader.
- Public API: import from [app/modules/content/api.ts](app/modules/content/api.ts) — never reach into `sources/` directly. Use the convenience functions: `fetchStory`, `fetchStories`, `fetchBlogpost`, `fetchBlogposts`, `fetchPage`, `fetchPages`, `fetchJob`, `fetchJobs`, plus generic `fetchContent`/`fetchContents` for custom types.
- Return shape is `ContentResult<T>` = `ActionResult<ContentFetchState, T>` — a tuple destructured as `[statusCode, state, data]` where `state` is one of `'success' | 'not_found' | 'validation_error' | 'source_error' | 'ignored'`. Routes branch on `statusCode !== 200`.
- Validators are pre-configured in `ContentValidators` (`story`, `blogpost`, `page`, `job`) — built from Zod schemas in [app/modules/schemas.ts](app/modules/schemas.ts).

Deeper detail → [docs/api/contracts.md](docs/api/contracts.md), [docs/api/data-models.md](docs/api/data-models.md).

---

## 7. Design system rules

### ADR-0001 decisions (inline, load-bearing)

- **Typography**: use `text({ variant: ... })`. Never `fontFamily: 'display'` inline outside `preset/`. Variants: `display-2xl | xl | lg | lg-bold | section | md | md-bold | sm | heading | card | label`, plus `subtitle`, `body`, `label`. Base names use `fontWeight: black`; `-bold` suffix uses `fontWeight: bold`. `display-xl` is the named exception (uses `bold`).
- **Sectioning**: `<section className={section({ bg, padding })}>` wrapping `<Container>`. Never inline `maxW: '7xl'` + `mx: 'auto'` containers.
- **Cards**: use `card()` (variants `shadow: none|sm|card|elevated`, `padding.xl`). Never inline `rounded + border + shadow`.
- **Legacy recipes deleted**: `icon`, `link`, `subtitle` no longer exist. Old `icon({ size })` maps to token `css({ h, w })`. Reintroducing a legacy-style single-concern recipe needs a new ADR.

Appendix (known inline exceptions, deferred per-feature occurrences, full mapping tables) → [docs/adr/0001-design-system-adoption-policy.md](docs/adr/0001-design-system-adoption-policy.md). Read it when touching a file flagged in those tables, or before proposing to bend any of the four rules above.

### Panda CSS traps (Claude-specific gotchas)

**Static analysis trap**. Panda extracts class names statically. Dynamic values inside `css()` do not get extracted — only the default branch ships. Always use static literal values per branch:

```tsx
// BAD — only the default border colour will exist in the bundle
const map = { yellow: 'ocobo.yellow', sky: 'ocobo.sky' };
css({ borderTopColor: map[color] });

// GOOD — each css() call has static literals; combine with cx() at runtime
const borderStyles = {
  yellow: css({ borderTopColor: 'ocobo.yellow' }),
  sky: css({ borderTopColor: 'ocobo.sky' }),
};
cx(css({ ...staticProps }), borderStyles[color]);
```

For recipe-driven components whose variants come from dynamic props, add `jsx: ['ComponentName']` to the recipe so Panda scans JSX usage too. Examples: `preset/recipes/button.ts` (`jsx: ['ButtonLink']`), `app/components/method/pillar-card.tsx`.

**Hover via child selectors**. Co-locate hover on the parent using `'& .classname'` / `'&:hover .classname'` inside the parent `css()`, then `cx('classname', css({...}))` on the child. Keeps the hover scope authoritative across hydration.

**Workflow after preset edits**:

```bash
pnpm panda codegen
pnpm panda cssgen --clean
```

`pnpm prepare` runs `panda codegen` and is wired into `postinstall`.

### Static CSS palette

[panda.config.ts](panda.config.ts) pre-generates `color`, `borderColor`, and `backgroundColor` for `yellow | sky | mint | coral` (plus `.light` for backgrounds). The `section` recipe ships every `bg` and `padding` variant via `staticCss`. Use those palette names when colour is data-driven.

---

## 8. Components (summary)

Before creating anything: look in `app/components/<feature>/` (section blocks per page) and `app/components/ui/` (primitives) — most things already exist. Notable shared pieces: `ButtonLink` (navigation), `MemberCard` (profile card), and the two markdown wrappers (`markdown-container.tsx` for content articles, `PageMarkdownContainer.tsx` for static pages).

Full catalogue → [docs/development/component-inventory.md](docs/development/component-inventory.md).

---

## 9. Caching (summary)

[app/modules/cache.ts](app/modules/cache.ts) defines the strategies; **headers are applied centrally in `app/entry.server.tsx`**, not in individual loaders.

| Strategy | `s-maxage` | `stale-while-revalidate` |
|----------|-----------|--------------------------|
| `blogPost` / `story` / `job` | 1h | 24h |
| `static` | 24h | 7d |

- Strategy is selected from the URL by `getCacheStrategyForPath(pathname)` (`/blog*` → `blogPost`, `/clients*` → `story`, else `static`). When adding a new cacheable section, extend that function.
- Local filesystem source: no cache.
- GitHub source: cache + `Vercel-CDN-Cache-Control` mirror + `Vary: Accept-Language`.
- `?refresh=1` bypasses cache entirely (`shouldBypassCache(request)`).
- `createHybridLoader` is kept as a wrapper for legacy reasons — its strategy argument is currently ignored.

Deeper detail → [docs/development/cache-strategy.md](docs/development/cache-strategy.md), [docs/development/deployment-strategies.md](docs/development/deployment-strategies.md).

---

## 10. i18n (summary)

- Server: [app/localization/i18n.server.ts](app/localization/i18n.server.ts). Client: [app/localization/i18n.ts](app/localization/i18n.ts).
- Namespaces lazy-loaded from `locales/<lang>/<namespace>.json`.
- FR is default. `/en/<path>` is English. Switch keys live in `app/components/LanguageSwitcher.tsx`; URL slug mapping (e.g. `projets-revops` ↔ EN) in `app/utils/redirections.ts`.
- Helpers: `useLocalizedPathname`, `useFrenchText`, `app/utils/typography.ts` (server-safe variant).
- New namespace → register in both i18n configs + add JSON for both `fr/` and `en/`.

---

## 11. Testing

- Vitest 3 (`vitest.config.ts`). Tests sit beside source as `*.test.ts(x)`.
- React Testing Library + `jest-axe` + MSW (handlers under `app/test/`).
- Default env `node`; component tests opt into `jsdom` via `@vitest-environment jsdom` docblock.
- **Skip tests on pure-visual components**. Only TDD when there is extractable pure-function logic to assert.
- Watch mode (`pnpm test`) for active dev; `pnpm test:run` in CI.

---

## 12. Code style & tooling

- **Biome 1.9.4** ([biome.json](biome.json)). Indent 2 spaces, single quotes JS, double quotes JSX, semicolons always, trailing commas everywhere, line width 80.
- `noUnusedVariables` / `noUnusedImports` are errors. `organizeImports` is on — let Biome resolve order.
- Excluded from Biome: `@ocobo`, `build`, `node_modules`, `public`, `.react-router`, `coverage`.
- TS strict mode. `react-router typegen` populates `.react-router/types/` — never edit those.
- No default exports anywhere new. Kebab-case for new files.
- Functional-first; small pure helpers in `app/utils/`. Avoid classes.
- pnpm only — never npm or yarn.

---

## 13. Environment variables

Defined by [app/modules/types.ts](app/modules/types.ts), loaded in [app/modules/env.server.ts](app/modules/env.server.ts) (throws on missing required values).

| Var | Required | Notes |
|-----|----------|-------|
| `NODE_ENV` | yes | `production` or `development` (anything not `production` is dev) |
| `CONTENT_SOURCE` | no | `locale` (default in dev) or `github` |
| `GITHUB_ACCOUNT` / `GITHUB_REPO` / `GITHUB_ACCESS_TOKEN` | when `github` | Content repo coordinates + PAT (repo scope) |
| `GITHUB_BRANCH` | no | Defaults to `main`; use `offers` to preview placeholder offers |

There is no env var for the local filesystem content path — when `CONTENT_SOURCE=locale`, the filesystem source uses its built-in default path (check the `filesystem` source under `app/modules/content/sources/` before tweaking).

Optional integrations (HubSpot, Ago, analytics) load lazily — check `env.server.ts` and `app/utils/hubspot.ts`.

Use `.env.local` for dev. Never commit secrets. Server-only vars must never be imported by client modules — keep them behind `*.server.ts` boundaries.

---

## 14. Agent skills

GitHub issues on `ocobo-revops/website`, via `gh` CLI. Triage vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.

- Issue tracker → [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)
- Triage labels → [docs/agents/triage-labels.md](docs/agents/triage-labels.md)
- Domain docs convention → [docs/agents/domain.md](docs/agents/domain.md)

Single-context repo: glossary in `CONTEXT.md` (root, lazily created) + decisions in `docs/adr/`. If your output contradicts an ADR, surface it explicitly.

---

## 15. Deeper docs (linked, on demand)

Read at most one or two relevant docs per task.

| Area | Document |
|------|----------|
| Architecture overview | [docs/architecture/overview.md](docs/architecture/overview.md) |
| Patterns | [docs/architecture/patterns.md](docs/architecture/patterns.md) |
| Tech stack | [docs/architecture/technology-stack.md](docs/architecture/technology-stack.md) |
| Source tree | [docs/architecture/source-tree.md](docs/architecture/source-tree.md) |
| Component inventory | [docs/development/component-inventory.md](docs/development/component-inventory.md) |
| Getting started | [docs/development/getting-started.md](docs/development/getting-started.md) |
| Operational guide | [docs/development/operational-guide.md](docs/development/operational-guide.md) |
| Cache strategy | [docs/development/cache-strategy.md](docs/development/cache-strategy.md) |
| Deployment strategies | [docs/development/deployment-strategies.md](docs/development/deployment-strategies.md) |
| API contracts | [docs/api/contracts.md](docs/api/contracts.md) |
| Data models | [docs/api/data-models.md](docs/api/data-models.md) |
| State management | [docs/api/state-management.md](docs/api/state-management.md) |
| ADRs | [docs/adr/](docs/adr/) |
| Long-form specs / PRDs | [specs/](specs/) |

---

## 16. Common pitfalls

- Forgetting `pnpm prepare` after editing tokens or recipes — JSX classes will be missing.
- Dynamic-value `css()` calls (§7) — only the default branch ships.
- Adding new strings without updating both `locales/fr/` and `locales/en/`.
- Using `document` / `window` outside `useEffect` — breaks SSR.
- Importing `*.server.ts` files from client-rendered modules.
- Calling content `sources/` modules directly — go through `app/modules/content/api.ts`.
- Inline DS violations (`fontFamily: 'display'`, raw `maxW: '7xl'` containers, raw `border + rounded + shadow`) — reviewers will reject under ADR-0001.
- Skipping `pnpm typecheck` because `pnpm check` passed — Biome doesn't typecheck.
- Squash-merging PRs from feature lanes — breaks GitButler integration detection. Default `--merge`, not `--squash` or `--rebase`, unless asked.
