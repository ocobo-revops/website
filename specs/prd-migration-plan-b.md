# PRD: Website migration — P2–P4 + Cleanup

## Problem statement

Plan A delivers the foundation: upgraded deps, design system, layout, P1 pages, feature flags, and localisation pattern. Plan B completes the migration with remaining pages (P2–P4), then cleans up dependencies, components, localisation structure, and documentation.

## Goals

1. Migrate P2 pages: Technology, Studio.
2. Redesign existing pages (Blog, Stories, Contact) to fully match prototype.
3. Migrate P3–P4 pages: Jobs, Podcasts (replacing external links).
4. Add P2+ localisation namespaces, remove legacy ones, complete EN translations.
5. Clean dependencies and remove unused components.
6. Complete EN translations.
7. Add E2E tests and finalise documentation.

## Non-goals

- Webinar page (evaluate separately — currently external GetContrast link).
- Panda CSS major version upgrades beyond v1.8.
- New features not in the prototype.

## Dependencies

- **Plan A completed**: deps upgraded, design system ported, layout migrated, P1 pages live, feature flags operational.

---

## Implementation steps

### Step 1: P2 new pages

| Page | Route file |
|------|-----------|
| Technology/Partners | `_main.($lang).technology.tsx` |
| Studio | `_main.($lang).studio.tsx` |

Follow per-page template from Plan A. Enable via feature flags.

**Doc update**: `docs/development/component-inventory.md`, `app/utils/url.ts`.

### Step 2: P2 existing pages redesign

Full prototype-matching redesign of:
- Blog (listing + article detail)
- Stories/Clients (listing + detail)
- Contact

Port prototype section components, match visual design exactly.

**Doc update**: `docs/development/component-inventory.md`.

### Step 3: P3–P4

- **P3**: Jobs — `_main.($lang).jobs.tsx`. Replaces external Notion link. Remove Notion URL from `url.ts` and nav.
- **P4**: Podcasts — `_main.($lang).podcasts.tsx`. Replaces external Ausha link.

**Doc update**: `app/utils/url.ts`, `useMenuItems.ts`.

### Step 4: Localisation — add P2+ namespaces and clean up

Per-page namespace pattern already in place from Plan A (`home.json`, `offer.json`, `method.json`, `about.json` + `common.json` for shared nav/footer keys). This step:
- Create namespace files for P2+ pages: `locales/{fr,en}/technology.json`, `studio.json`, `jobs.json`, `podcasts.json`.
- Register new namespaces in `app/localization/resources.ts`.
- Remove legacy `strategy.json` and `projects.json` (replaced by `offer.json` in story 9).
- Complete EN translations for all namespace files.

**Doc update**: `docs/architecture/patterns.md` (namespace convention).

### Step 5: Dependencies & components cleaning

1. Audit and remove unused production components replaced by prototype equivalents.
2. Remove Radix UI deps once NavigationMenu fully on Ark UI.
3. Remove Tailwind remnants if any carried over.
4. Deduplicate shared components (Button, Card) — single source of truth.
5. Remove stale route files (old `/strategies-revenue-operations`, `/projets-revops`).

**Doc update**: `docs/development/component-inventory.md`, `package.json`.

### Step 6: Feature & content cleanup

1. Remove feature flags and `app/modules/feature-flags.ts` once all pages live.
2. Complete EN translations for all namespace files.
3. Remove stale external Notion/Ausha links from `url.ts`.

**Doc update**: `docs/development/getting-started.md` (remove feature flag env vars), `docs/architecture/patterns.md`.

### Step 7: Quality

1. Add Playwright E2E tests for critical user flows (navigation, contact form, page rendering).
2. Continue compound component rationalisation (align with prototype specs).
3. Full Biome/typecheck audit of all migrated code.

### Step 8: Final documentation pass

1. Full audit of all docs against code reality.
2. Update component inventory with final state (removed, added, changed).
3. Update architecture docs with final route map, design system state.
4. Update `AGENTS.md` constraints and navigation if changed.
5. Archive or remove obsolete prototype specs that no longer apply.

### Continuous: Migration notes

After each step, update `docs/migration-notes.md` with:
- **Deferred issues** — bugs or tech debt spotted but out of scope for this step.
- **Learnings** — patterns discovered, gotchas, decisions made and why.
- **Ideas / future refactors** — improvements to revisit later.

Delete this file after the migration is fully complete.

---

## External links kept until migrated

| Link | Current target | Migrated in |
|------|---------------|-------------|
| Podcasts | Ausha | P4 |
| Webinars | GetContrast | Evaluate separately |
| Jobs | Notion | P3 |

## Verification

- `pnpm check && pnpm typecheck` after each step.
- Visual comparison vs prototype for redesigned pages.
- All routes accessible (no stale 404s from removed flags).
- EN locale renders with complete translations.
- No unused deps in `package.json` (`pnpm why` audit).
- Docs match code reality.

## Success criteria

- All prototype pages live in production.
- No external Notion/Ausha links for migrated pages.
- All per-page namespaces populated, legacy `strategy`/`projects` removed, EN complete.
- No unused components or dependencies.
- E2E tests passing for critical flows.
- Documentation fully up to date.
