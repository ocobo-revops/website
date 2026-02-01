# AGENTS.md

React Router v7 RevOps consulting platform — TypeScript, Panda CSS, Vercel Edge, French/English i18n.

## Commands

```bash
pnpm dev:local    # Dev server (filesystem content)
pnpm dev:github   # Dev server (GitHub API content)
pnpm check        # Biome lint + format
pnpm typecheck    # TypeScript strict
pnpm test         # Vitest
```

## Constraints

- **i18n required** — all user-facing text must support French and English
- **SSR-first** — consider server rendering and hydration implications
- **Check before done** — run `pnpm check && pnpm typecheck` before completing work
- **Check components** — see [Component Inventory](docs/development/component-inventory.md) before creating new ones
- **Follow patterns** — see [Architecture Patterns](docs/architecture/patterns.md)

## Source of truth

- **Content schemas**: [app/modules/schemas.ts](app/modules/schemas.ts) — Zod schemas for Story, Blogpost, Page
- **Content types**: [app/modules/content/types.ts](app/modules/content/types.ts) — fetching interfaces
- **Env config**: [app/modules/types.ts](app/modules/types.ts) — PublicEnvVars, PrivateEnvVars

Read these before inferring data structures.

## Documentation index

| Area | Document |
|------|----------|
| Architecture | [docs/architecture/overview.md](docs/architecture/overview.md) |
| Patterns | [docs/architecture/patterns.md](docs/architecture/patterns.md) |
| Tech stack | [docs/architecture/technology-stack.md](docs/architecture/technology-stack.md) |
| Components | [docs/development/component-inventory.md](docs/development/component-inventory.md) |
| Getting started | [docs/development/getting-started.md](docs/development/getting-started.md) |
| Operations | [docs/development/operational-guide.md](docs/development/operational-guide.md) |
| API contracts | [docs/api/contracts.md](docs/api/contracts.md) |
| Data models | [docs/api/data-models.md](docs/api/data-models.md) |
| State management | [docs/api/state-management.md](docs/api/state-management.md) |

Read only the one or two documents relevant to your task — not all of them.

## Key implementation details

- **UI library**: Ark UI (migrated from Radix). NavigationMenu + `@radix-ui/react-context` still on Radix.
- **Routing**: file-based via `@react-router/fs-routes`. i18n uses `($lang)` param — e.g. `_main.($lang).blog._index.tsx`
- **i18n config**: `app/localization/i18n.ts` (client), `app/localization/i18n.server.ts` (server)
- **Markdoc config**: `app/modules/config.ts`
- **Panda CSS config**: `panda.config.ts`, preset in `preset/`
- **Cache**: `app/modules/cache.ts` — edge caching with stale-while-revalidate

## Content sources

- **Local**: `CONTENT_SOURCE=locale` — reads from `~/projects/ocobo-posts/`
- **GitHub**: `CONTENT_SOURCE=github` — fetches from GitHub API
- **Branch**: Set `GITHUB_BRANCH=offers` to test placeholder offers
