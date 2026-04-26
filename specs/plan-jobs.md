# Implementation plan: Jobs feature

**PRD:** `specs/prd-jobs.md`
**Created:** 2026-04-26
**Branch:** `feature/jobs`

## Phasing rationale

Vertical slices, end-to-end. Risk concentrated in Phase 1 (Markdoc parsing + structured 3-section rendering + scrollspy). One real offer is seeded first to validate the full content → render pipeline before any list work. Phases 2 & 3 deliver Notion-equivalent depth (narrative + offers list). Phase 4 is enrichment (stories videos + team) that can slip without blocking parity. Phase 5 ships (SEO + nav cleanup + deploy).

Goal at end of Phase 3 = **Notion parity**. Phase 4 = optional enrichment by iteration.

---

## Phases

### Phase 1 — Foundation + 1 offre détail end-to-end

Risk reduction: validates Zod schema, fetch layer, Markdoc h3-section parsing, manager ref resolution, and structured rendering on a single real offer. If this works, the rest is mostly composition.

Produces: `/fr/jobs/revenue-operations-manager` accessible on preview env with real Notion content rendered.

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 1.1 | Create `feature/jobs` branch. Seed `posts/jobs/fr/revenue-operations-manager.md` + `posts/jobs/_managers.yml` (Aude Cadiot) from Notion content. Copy `aude-cadiot.jpeg` to `posts/assets/` if absent. | M | HITL | — |
| 1.2 | Add Zod schemas in `app/modules/schemas.ts`: `JobFrontmatter`, `Manager`, `Job` (frontmatter + parsed `intro` + `sections`). Update `CONTENT_TYPES`. | M | AFK | 1.1 |
| 1.3 | Implement `fetchJobs(lang)`, `fetchJob(slug, lang)`, `fetchManagers()` under `app/modules/content/sources/{filesystem,github}.ts`. Add cache strategy `'job'` in `app/modules/cache.ts`. | M | AFK | 1.2 |
| 1.4 | Markdoc parser in `app/modules/content/processor.ts` (or new helper): walk h3 nodes, match by slug ID (`mission`/`competences`/`pourquoi`), return structured tree per section. Filter `status !== 'published'`. | M | AFK | 1.3 |
| 1.5 | Create route `_main.($lang).jobs.$slug.tsx`. Build detail components in `app/components/jobs/detail/`: `header.tsx`, `intro.tsx`, `section.tsx` (renders one parsed section with h4 + callouts), `scrollspy-toc.tsx`, `manager-block.tsx`, `apply-cta.tsx`. 404 → redirect `/jobs`. | L | AFK | 1.4 |
| 1.6 | Create `locales/fr/jobs.json` with: meta keys, about-ocobo boilerplate, apply CTA labels (`Postuler`, mailto subject template), section titles fallback. Register namespace in `app/localization/resources.ts`. | S | AFK | 1.5 |
| 1.7 | Visual check: compare `/fr/jobs/revenue-operations-manager` against `prototype/pages/JobDetail.tsx`. Check responsive (mobile/desktop). Record gaps to address in later phases. | S | HITL | 1.6 |

---

### Phase 2 — Liste minimale (offers grid)

Risk reduction: validates loader filtering/sorting + `highlightColor` rotation logic + offer card design. After this phase, navigation between liste ↔ détail works end-to-end.

Produces: `/fr/jobs` lists all published offers as clickable cards with hero.

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 2.1 | Create route `_main.($lang).jobs._index.tsx`. Loader fetches all jobs, filters `status === 'published'`, sorts by `publishedAt` desc. | M | AFK | 1.3 |
| 2.2 | Build `app/components/jobs/offer-card.tsx`. Props: title, contractType, location, seniority, slug, icon, index. Compute `highlightColor` via `['yellow','sky','mint','coral'][index % 4]`. | M | AFK | 2.1 |
| 2.3 | Build `app/components/jobs/hero-section.tsx` (badge "RECRUTEMENT", title, intro) + `offers-list-section.tsx` (responsive grid). Wire into route. | M | AFK | 2.2 |
| 2.4 | Visual check `/fr/jobs` against prototype hero + offers grid. Responsive. | S | HITL | 2.3 |

---

### Phase 3 — Liste enrichie (Notion parity narrative)

Risk reduction: brings the recruitment narrative to the depth of the current Notion landing page (values, hiring process, about, offices). At end of this phase, the internal page can replace the external Notion link.

Produces: `/fr/jobs` reaches Notion content parity.

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 3.1 | Build `values-section.tsx` (4 values: Excellence Senior / Transparence Radicale / Impact Mesurable / Esprit de Squad). Add i18n keys + icons (lucide). | M | AFK | 2.3 |
| 3.2 | Build `process-section.tsx` (6 hiring steps: RH / Hiring Manager / Technique / Case Study / Cultural Fit / Référence). Add i18n keys with durations + descriptions. | M | AFK | 2.3 |
| 3.3 | Decide office photos count + layout (carousel vs grid). Import photos from Notion to `posts/assets/`. Build `offices-section.tsx`. | M | HITL | 2.3 |
| 3.4 | Build `about-ocobo-section.tsx` for the list page boilerplate. Reuse i18n keys from Phase 1.6 if shared with detail. | S | AFK | 2.3 |
| 3.5 | Visual check responsive mobile/desktop. Compare overall narrative against Notion landing. | S | HITL | 3.1, 3.2, 3.3, 3.4 |

---

### Phase 4 — Enrichissements (peuvent slipper)

Risk reduction: optional iteration. None of these block Notion parity. Tag is HITL because each requires content/asset decisions.

Produces: stories videos + team integrated, full polish.

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 4.1 | Decide videos source (YouTube embeds vs hosted). Build `stories-section.tsx` for the 3 Ocobo Stories episodes. | M | HITL | 3.5 |
| 4.2 | Decide team section depth (arbitrage with existing `/studio` page to avoid duplication). Build `team-section.tsx`. | M | HITL | 3.5 |
| 4.3 | Final polish + responsive sweep on full liste page. | S | HITL | 4.1, 4.2 |

---

### Phase 5 — SEO + Nav cleanup + Deploy

Risk reduction: independent from prior phases except 1.5 (detail route). Last to ensure no rework if content shifts. JSON-LD validates only once content is stable.

Produces: production-ready, Notion link gone, indexable.

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 5.1 | Add `JobPosting` JSON-LD on detail route head: title, description, datePosted, validThrough (publishedAt + 90d), employmentType, hiringOrganization, jobLocation. Add Open Graph tags. | M | AFK | 1.5 |
| 5.2 | Update `app/utils/sitemap.ts` to include `/jobs` and detail URLs with `lastmod`. | S | AFK | 2.1 |
| 5.3 | Verify 404 redirect `/jobs/<unknown>` → `/jobs` (already implemented in 1.5, confirm in tests). | S | AFK | 1.5 |
| 5.4 | Seed remaining published Notion offers as markdown files in `posts/jobs/fr/`. Validate frontmatter for each. | M | HITL | 3.5 |
| 5.5 | Update `app/hooks/useMenuItems.ts` — remove `isExternal` from `jobs` item, point to internal `/jobs`. Remove Notion URL from `app/utils/url.ts`. Grep for residual `Nous-rejoindre` references. | S | AFK | 5.4 |
| 5.6 | Deploy `feature/jobs` to Vercel preview. Validate JSON-LD via Google Rich Results Test. Share preview URL for stakeholder review. | S | HITL | 5.1, 5.5 |
| 5.7 | Append Phase 5 entry to `progress.txt`. Open PR + merge to `main`. | S | HITL | 5.6 |

---

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-26 | Repo content = `~/projects/ocobo/posts/jobs/fr/` | Aligned with existing blog/stories structure |
| 2026-04-26 | FR-only at launch, EN deferred | No EN translation budget, schema supports `posts/jobs/en/` later |
| 2026-04-26 | 3 imposed sections (`mission`/`competences`/`pourquoi`) via h3 slug IDs | Editorial consistency + scrollspy reliability |
| 2026-04-26 | Body in Markdoc with `{% callout %}` tag for "Compétences clés" boxes | Already in stack, no new dep |
| 2026-04-26 | Manager via shared `_managers.yml`, photo in `posts/assets/` | Avoids duplication across offers (3 founders recur) |
| 2026-04-26 | `highlightColor` computed at render time, rotation by index | Zero editorial friction |
| 2026-04-26 | `mailto:` CTA only at launch, native form deferred | Pragmatic, matches Notion current behaviour |
| 2026-04-26 | `status: closed` filtered at loader, no archive view | Simplicity, recruiter just toggles status |
| 2026-04-26 | No feature flag, dedicated branch + Vercel preview | Direct switch on merge keeps codebase clean |
| 2026-04-26 | 404 unknown slug → redirect `/jobs` | More user-friendly than 404 page |
| 2026-04-26 | About-Ocobo + Apply blocks rendered by React component, not in markdown | Boilerplate identical across offers |
| 2026-04-26 | Phase 4 marked optional (slipping OK) | Notion parity reached at Phase 3, enrichment iterates |

## Open questions

- **Stories videos source** — YouTube? Vimeo? Self-hosted? Decide before Phase 4.1.
- **Team section depth on /jobs** — minimum tagline+photo, or full grid? Risk of duplication with `/studio`. Decide before Phase 4.2.
- **Offices section count** — number of photos available from Notion drives carousel vs grid choice. Decide before Phase 3.3.
- **Manager bio length** — if Notion bios are too long for the card footer, may need `bioShort` / `bioFull` split. Likely emerges in Phase 1.5 visual check.
- **Validity period for `JobPosting` JSON-LD** — `validThrough = publishedAt + 90 days` is a default; recruiters may want a `validUntil` frontmatter field instead. Decide in Phase 5.1.
