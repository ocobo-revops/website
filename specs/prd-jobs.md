# PRD: Jobs feature — internalise recruitment pages

## Problem statement

Plan A enabled "Nous rejoindre" as an external Notion link (`useMenuItems` + `url.ts`) as a temporary measure. The recruitment content lives in two disconnected places:

- **Notion** (`ocobo.notion.site/Ocobo-Nous-rejoindre-...`) — current source of truth for offers, latest content, used by recruiters to publish.
- **Prototype** (`prototype/pages/Jobs.tsx` + `JobDetail.tsx`) — visual design intent, but mock data only.

This split blocks SEO (Notion pages don't index well, no `JobPosting` structured data), brand consistency (Notion design ≠ ocobo.co), and operational efficiency (no single workflow). Jobs is **plan B step 2 priority 1** per latest decision; Podcasts deferred.

## Goals

1. Migrate offer content from Notion to a markdown source under `ocobo/posts/jobs/fr/`.
2. Build internal `/jobs` (list) and `/jobs/<slug>` (detail) routes matching the prototype design.
3. Reproduce the prototype's recruitment narrative (values, hiring process, team, offices) on the list page, with content sourced from Notion where fresher.
4. Replace the external Notion link in nav with the internal route on merge.
5. Add `JobPosting` JSON-LD structured data on detail pages for Google Jobs / SEO.
6. Keep editorial workflow simple — markdown + frontmatter + shared managers table, no CMS.

## Non-goals

- **English translations** — FR-only at launch. Schema and folder structure (`posts/jobs/<lang>/`) leave room for `en/` later without refactor.
- **Native application form** — `mailto:` CTA only at launch. External form (Typeform, Notion form) deferred.
- **Feature flag for staged rollout** — work happens on a dedicated branch, deployed to a preview environment. Direct switch on merge.
- **Podcasts page** — kept as external Ausha link. Deferred to a later iteration.
- **Closed offer archive** — `status: closed` filtered at loader, never displayed. No archive view.
- **Free-form sections** — strict 3-section structure (`mission`, `competences`, `pourquoi`) for editorial consistency. h4 sub-sections allowed inside.

## Dependencies

- Plan A completed (design system, `($lang)` routing, i18n namespaces, Markdoc pipeline).
- `ocobo/posts/` repo accessible (used for blog/stories already).
- Lucide icons, Panda CSS recipes, Ark UI primitives — already available.
- Photos managers + offices — to be added to `posts/assets/` (sourced from Notion).

---

## Content source

### Repository layout

```
~/projects/ocobo/posts/jobs/
├── _managers.yml          # shared managers table
└── fr/
    ├── revenue-operations-manager.md
    ├── consultant-revops-senior.md
    └── ...
```

### Frontmatter schema

```yaml
---
title: Revenue Operations Manager
slug: revenue-operations-manager           # auto from filename if absent
icon: 🧘                                   # emoji
contractType: CDI                          # CDI | CDD | Stage | Alternance (default CDI)
seniority: 3-5 ans                         # free string
location: Paris (On site)                  # free string
startDate: 2026-06-01
manager: aude-cadiot                       # ref to _managers.yml key
applyEmail: recrutement@ocobo.co
status: published                          # draft | published | closed
publishedAt: 2026-04-26
intro: >
  La mission du Revenue Operations Manager est de définir
  et d'exécuter une stratégie de transformation opérationnelle...
---
```

`highlightColor` is **not** in frontmatter — computed at render time via rotation by index across `yellow / sky / mint / coral`.

### Managers table — `_managers.yml`

```yaml
aude-cadiot:
  name: Aude Cadiot
  role: Co-fondatrice
  photo: aude-cadiot.jpg          # in posts/assets/
  bio: Aude est la référente RevOps chez Ocobo...

benjamin-boileux:
  name: Benjamin Boileux
  role: Co-fondateur
  photo: benjamin-boileux.jpeg
  bio: ...
```

Photos resolved against `ASSETS_BASE_URL` (same pattern as story avatars).

### Body structure (Markdoc)

3 imposed sections via h3 with stable slug IDs. h4 sub-sections free inside.

```markdown
### Mission {% #mission %}

Paragraphe d'intro contexte.

#### 1. Optimisation des processus
- Bullet 1
- Bullet 2

{% callout %}
**Compétences clés**
- Item
{% /callout %}

#### 2. Data & Analyse
...

### Compétences recherchées {% #competences %}

- Bullet 1
- Bullet 2

### Pourquoi nous rejoindre {% #pourquoi %}

#### Ce que nous valorisons chez Ocobo
- ...

#### Pourquoi rejoindre Ocobo ?
- ...
```

The "À propos d'Ocobo" boilerplate and the "Postuler" CTA are **rendered by the React component**, not part of the markdown — they are identical across all offers and live in `locales/fr/jobs.json`.

---

## Implementation steps

### Step 1: Content schema and fetch layer

1. Add Zod schema in `app/modules/schemas.ts`: `JobFrontmatter`, `Manager`, `Job` (frontmatter + parsed sections).
2. Add fetch interface in `app/modules/content/types.ts`: `fetchJobs(lang)`, `fetchJob(slug, lang)`, `fetchManagers()`.
3. Implement local + GitHub fetchers under `app/modules/content/<source>/jobs.ts` mirroring stories pattern.
4. Add cache strategy `'job'` in `app/modules/cache.ts`.
5. Markdoc parser: extract h3-level sections by ID, return `{ mission, competences, pourquoi }` content trees + `intro` from frontmatter.
6. Filter `status !== 'published'` at loader. Sort by `publishedAt` desc.
7. Seed `posts/jobs/fr/revenue-operations-manager.md` and `_managers.yml` (Aude/Benjamin/Corentin) from current Notion content.

### Step 2: Routes and i18n

1. Create `app/routes/_main.($lang).jobs._index.tsx` — list route, loader fetches all published jobs.
2. Create `app/routes/_main.($lang).jobs.$slug.tsx` — detail route, loader fetches single job, 404 redirects to `/jobs`.
3. Create `locales/{fr}/jobs.json` namespace with: page meta, hero copy, values block (4 items), hiring process (6 steps), offices block, about-ocobo boilerplate, apply CTA labels.
4. Register `jobs` namespace in `app/localization/resources.ts`.
5. Update `app/utils/sitemap.ts` to include `/jobs` and detail URLs.

### Step 3: List page components

Visual reference: `prototype/pages/Jobs.tsx` (1398 lines). Content reference: Notion landing page.

Components in `app/components/jobs/`:
- `hero-section.tsx` — title, intro, badge "RECRUTEMENT".
- `values-section.tsx` — 4 values (Excellence Senior / Transparence Radicale / Impact Mesurable / Esprit de Squad). Content from `jobs.json`.
- `offers-list-section.tsx` — grid of offer cards. Each card: icon, title, contractType, location, seniority, highlightColor (rotated), link to detail.
- `process-section.tsx` — 6 hiring steps from `jobs.json`. Reuse iconBox + text recipes.
- `team-section.tsx` — placeholder bloc équipe (defer detailed list to later if heavy; minimum: photo + tagline).
- `stories-section.tsx` — embed Ocobo Stories videos (3 episodes from Notion). YouTube/Vimeo iframes or local thumbnails — TBD during build.
- `offices-section.tsx` — Paris office photos from Notion + caption.
- Reuse existing `CtaSection` for apply.

Pragmatic trade-offs (prototype is heavy): start with hero + values + offers + process + about. Add stories/team/offices iteratively if time permits before merge.

### Step 4: Detail page components

Components in `app/components/jobs/detail/`:
- `header.tsx` — icon, title, meta strip (contrat / lieu / séniorité), badge category.
- `meta-table.tsx` — optional 4-cell metadata block matching prototype.
- `intro.tsx` — accroche from frontmatter.
- `scrollspy-toc.tsx` — sidebar with 3 anchors (mission/compétences/pourquoi) + active section highlight on scroll.
- `section.tsx` — generic wrapper for a parsed h3 section, rendering the Markdoc tree + h4 sub-sections + callouts.
- `about-ocobo.tsx` — boilerplate block, content from `jobs.json`.
- `manager-block.tsx` — photo + name + role + bio from `_managers.yml`, displayed in footer area above CTA.
- `apply-cta.tsx` — `mailto:` button with prefilled subject `Candidature - <title>`.

### Step 5: SEO

1. Add `JobPosting` JSON-LD in detail route head — fields: `title`, `description` (intro), `datePosted`, `validThrough` (publishedAt + 90 days fallback), `employmentType` (mapped from contractType), `hiringOrganization`, `jobLocation`, `applicantLocationRequirements`.
2. Open Graph tags on detail (title, description, icon as og:image fallback).
3. Add `/jobs` and detail URLs to sitemap with appropriate `lastmod`.

### Step 6: Nav and external link cleanup

1. Update `app/hooks/useMenuItems.ts` — `jobs` item: remove `isExternal`, point to internal `/jobs` route.
2. Remove `https://ocobo.notion.site/Ocobo-Nous-rejoindre-...` from `app/utils/url.ts`.
3. Verify no other reference to the Notion URL remains (`grep -r "Nous-rejoindre"`).

### Step 7: Verification and deployment

1. `pnpm check && pnpm typecheck` clean.
2. Visual check on `/jobs` and `/jobs/revenue-operations-manager` against prototype + Notion content.
3. Responsive check (mobile/desktop).
4. JSON-LD validated via Google Rich Results Test.
5. 404 redirect to `/jobs` on unknown slug verified.
6. Deploy branch to preview environment (Vercel preview), share URL for review.
7. Merge to `main` once content + visuals approved.

### Continuous: progress log

Update `progress.txt` after each step with what was done + checks status, mirroring Plan A / QFX log format.

---

## Verification

- All published offers from Notion ported to `posts/jobs/fr/`.
- `_managers.yml` populated with at least Aude Cadiot.
- `/jobs` lists offers sorted by `publishedAt` desc, closed/draft filtered.
- `/jobs/<slug>` renders all 3 sections + boilerplate + manager + CTA.
- 404 on unknown slug → redirect to `/jobs`.
- Nav "Nous rejoindre" points to internal route, no Notion URL anywhere in code.
- JSON-LD `JobPosting` valid on detail pages.
- `pnpm check && pnpm typecheck` pass.
- FR locale complete; `posts/jobs/en/` empty but supported by fetch layer.

## Success criteria

- Recruiters can publish a new offer by adding a markdown file to `ocobo/posts/jobs/fr/` — no code change needed.
- Detail pages indexable by Google Jobs.
- Page liste reproduces the prototype's narrative depth (values, process, team, offices) within pragmatic limits.
- Notion link permanently removed from production code.

## Open questions to revisit during implementation

- **Stories videos hosting** : Notion embeds vs YouTube vs local MP4 — depends on where the videos actually live.
- **Team section depth** : minimum tagline + photo, or full member grid (would duplicate `studio` page content) ?
- **Offices section** : carousel vs static grid, depends on number of photos available from Notion.
- **Manager bio length** : if too long, may need a `bioShort` for the card and `bioFull` for a tooltip / modal.

These are explicitly punted to the implementation phase — they need real content in hand to decide.
