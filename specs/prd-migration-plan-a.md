# PRD: Website migration — Prep + P1

## Problem statement

The next version of the ocobo website has been prototyped as a standalone SPA (`ocobo-revops/prototype`). The production site (`ocobo/website`) runs React Router v7 with SSR, i18n, and Markdoc content. Business timelines require migrating the prototype's new pages and design system into production while the prototype cleanup is still ongoing.

Key gaps between prototype and production:
- **No localisation** in prototype (hardcoded FR). Production uses `remix-i18next`.
- **Different Panda CSS version** (prototype v1.8, production v0.37). New design system built on v1.
- **SPA vs SSR** routing (HashRouter → file-based `($lang)` routes).
- **New pages** (Offer, Method, About us) and redesigned Home not yet in production.
- **New layout** (Navbar, Footer) from prototype needs to replace production layout.

## Goals

1. Upgrade production deps to match prototype (Panda CSS v1.8, Ark UI v5.30).
2. Port design system tokens, recipes, and layout components.
3. Migrate P1 pages: Home, Offer, Method, About us.
4. Adapt existing pages (Blog, Stories, Contact, Legal) to new design system.
5. Establish localisation pattern (single `common.json` with structured keys).
6. Feature-flag unreleased pages (P2+).
7. Keep documentation in sync with code after every step.

## Non-goals

- Full EN translations (deferred to Plan B).
- P2–P4 pages (Technology, Studio, Jobs, Podcasts).
- Panda CSS v1 migration guide for external contributors.
- E2E test suite (deferred to Plan B).

## Scope

### Source repository
`github.com/ocobo-revops/prototype` — prototype SPA.

### Target repository
`github.com/ocobo-revops/website` (production) — `main` branch.

---

## Implementation steps

### Step 1: Dependencies upgrade

- Upgrade `@pandacss/dev` v0.37 → v1.8.
- Upgrade `@ark-ui/react` to v5.30.
- Resolve breaking changes in existing production components.
- Remove deprecated/unused deps from `package.json`.

**Doc update**: `docs/development/getting-started.md` (deps), `CLAUDE.md` if commands change.

### Step 2: Design system reconciliation

- Port prototype tokens (colours, shadows, animations) → `preset/tokens/`.
- Port new recipes (text, badge, iconBox, section) → `preset/recipes/`.
- Move legacy recipes to `preset/recipes/_legacy/` (button, icon, icon-button, input, link, subtitle, typography). Import paths updated in `preset/recipes/index.ts`.
- Convert prototype `styled()` wrappers → `css()` or recipe variants.
- When a story replaces a legacy recipe and usage drops to 0, delete from `_legacy/`.
- Post-migration: delete `_legacy/` directory entirely.

**Doc update**: `docs/architecture/patterns.md` (new recipes, `_legacy/` convention), `docs/development/component-inventory.md`.

### Step 3: Feature flags

- Create `app/modules/feature-flags.ts` — record of page slugs → booleans from `process.env`.
- `useMenuItems.ts`: wire `shouldHide` to flags.
- Route loaders: check flag, throw 404 if disabled.

**Doc update**: `docs/architecture/patterns.md` (feature flag pattern), `docs/development/getting-started.md` (env vars).

### Step 4: Localisation setup

Single file per locale — extend `locales/fr/common.json` with structured key paths:

```
nav.services, nav.method, nav.about, ...
home.hero.title, home.hero.subtitle, ...
offer.hero.title, offer.section.key, ...
method.intro.title, ...
about.team.title, ...
```

- All pages use `useTranslation('common')` + `t('page.section.key')`.
- Stub EN file with same keys. i18next falls back to FR.

**Doc update**: `docs/architecture/patterns.md` (localisation key convention).

### Step 5: Layout migration

- Port prototype Navbar (Ark UI Menu, responsive drawer, scroll behaviour) → replace `Header.tsx` / `MainMenu.tsx` / `MainMobileMenu.tsx`.
- Port prototype Footer → replace `Footer.tsx`.
- Port layout wrapper (`LayoutMain.tsx`) if structure differs.
- Localise nav/footer strings under `nav.*` / `footer.*` keys.

**Doc update**: `docs/development/component-inventory.md` (layout components).

### Step 6: P1 new pages

| Page | Route file | Replaces |
|------|-----------|----------|
| Home | `_main.($lang)._index.tsx` | Existing homepage (redesign) |
| Offer | `_main.($lang).offer.tsx` | `/strategies-revenue-operations` + `/projets-revops` |
| Method | `_main.($lang).method.tsx` | New page |
| About us | `_main.($lang).about-us.tsx` | External Notion link |

**Offer route consolidation**: remove old strategy/projects routes, add 301 redirects → `/offer`.

Per-page process:
1. Create route with loader + meta.
2. Add keys to `locales/fr/common.json` under `<page>.*`, stub `locales/en/common.json`.
3. Port components → `app/components/<page>/`: convert `styled()` → recipes, hardcoded text → `t()`, HashRouter Link → NavLink.
4. Update `useMenuItems.ts` + `app/utils/url.ts`.
5. `pnpm check && pnpm typecheck`.

**Doc update**: `docs/architecture/overview.md` (route map), `app/utils/url.ts`, `docs/development/component-inventory.md`.

### Step 7: P1 existing pages

Adapt to new design system (structure stays, tokens/recipes updated):
- Blog, Stories/Clients, Contact, Legal.

**Doc update**: `docs/development/component-inventory.md` (updated components).

### Step 8: Documentation sync

After **each step above**, update relevant docs:
- `CLAUDE.md` / `AGENTS.md` — quick commands, key files, constraints.
- `docs/architecture/overview.md` — Panda v1, new routes, feature flags.
- `docs/architecture/patterns.md` — recipes, localisation convention, feature flag pattern.
- `docs/development/component-inventory.md` — migrated components, removed ones.
- `docs/development/getting-started.md` — deps, env vars, dev commands.

**Rule**: No step is complete until its doc impact is assessed and updated.

### Continuous: Migration notes

After each step, update `docs/migration-notes.md` with:
- **Deferred issues** — bugs or tech debt spotted but out of scope for this step.
- **Learnings** — patterns discovered, gotchas, decisions made and why.
- **Ideas / future refactors** — improvements to revisit in Plan B or later.

Delete this file after the migration branch merges.

---

## Verification

- `pnpm check && pnpm typecheck` after each step.
- Visual comparison vs running prototype.
- SSR hydration: browser console check.
- Feature flags: hidden pages → 404, nav items filtered.
- i18n: FR renders correctly, EN falls back to FR.
- Docs match code reality (spot-check after each step).

## Success criteria

- All P1 pages render identically to prototype (FR).
- Existing pages (Blog, Stories, Contact, Legal) render with new design system.
- No regressions on `pnpm check && pnpm typecheck`.
- P2+ pages return 404 when feature-flagged off.
- Documentation is up to date.
