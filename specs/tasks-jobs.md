# Tasks: Jobs feature

**Plan:** `specs/plan-jobs.md`
**PRD:** `specs/prd-jobs.md`
**Created:** 2026-04-26
**Branch:** `feature/jobs`

Each task is a single completable unit. Check off as completed.

---

## Phase 1: Foundation + 1 offre détail end-to-end

### 1.1 — Branch + content seed

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 1.1.1 | Create branch `feature/jobs` from `main`. Create folder skeleton `posts/jobs/fr/`. | S | HITL | — |
| 1.1.2 | Author `posts/jobs/fr/revenue-operations-manager.md` (frontmatter + 3 sections + h4 + callouts) from Notion content. | M | HITL | 1.1.1 |
| 1.1.3 | Create `posts/jobs/_managers.yml` with `aude-cadiot` entry (name, role, photo ref, bio). Copy `aude-cadiot.jpeg` to `posts/assets/` if absent. | S | HITL | 1.1.1 |

### 1.2 — Zod schemas

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 1.2.1 | Add `JobFrontmatter` + `Manager` Zod schemas in `app/modules/schemas.ts`. | M | AFK | 1.1.2, 1.1.3 |
| 1.2.2 | Register `Job` content type in content registry. Add type exports. | S | AFK | 1.2.1 |

### 1.3 — Fetch layer

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 1.3.1 | Add cache strategy `'job'` in `app/modules/cache.ts` with same TTL as `blogPost`. | S | AFK | 1.2.2 |
| 1.3.2 | Implement filesystem fetchers (`fetchJobs`, `fetchJob`, `fetchManagers`) in `app/modules/content/sources/filesystem.ts`. | M | AFK | 1.3.1 |
| 1.3.3 | Implement GitHub fetchers (same 3 functions) in `app/modules/content/sources/github.ts`. | M | AFK | 1.3.2 |
| 1.3.4 | Wire fetchers into `app/modules/content/index.ts` exports. Update `app/modules/content/types.ts`. | S | AFK | 1.3.3 |

### 1.4 — Markdoc parser

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 1.4.1 | Write h3-section extractor in `app/modules/content/processor.ts` (or new helper). Walks tree, matches by slug ID `mission`/`competences`/`pourquoi`, returns structured tree per section. | M | AFK | 1.3.4 |
| 1.4.2 | Add `{% callout %}` Markdoc tag config in `app/modules/config.ts` if not already registered. | S | AFK | 1.4.1 |
| 1.4.3 | Wire parser into job processing pipeline. Add `status !== 'published'` filter at fetcher level. | S | AFK | 1.4.2 |

### 1.5 — Detail route + components

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 1.5.1 | Create route `app/routes/_main.($lang).jobs.$slug.tsx`: loader (`createHybridLoader` + `'job'` cache + 404 redirect to `/jobs`), meta function. | M | AFK | 1.4.3 |
| 1.5.2 | Build `app/components/jobs/detail/header.tsx` (icon + title + meta strip: contrat / lieu / séniorité). | S | AFK | 1.5.1 |
| 1.5.3 | Build `app/components/jobs/detail/intro.tsx` (paragraph from frontmatter `intro`). | S | AFK | 1.5.1 |
| 1.5.4 | Build `app/components/jobs/detail/section.tsx` — generic renderer for one parsed h3 section: title + Markdoc tree (h4 + lists + callouts). | M | AFK | 1.5.1 |
| 1.5.5 | Build `app/components/jobs/detail/scrollspy-toc.tsx` — sidebar with 3 anchors (mission/compétences/pourquoi) + active section highlight on scroll. | M | AFK | 1.5.4 |
| 1.5.6 | Build `app/components/jobs/detail/manager-block.tsx` — photo + name + role + bio from `_managers.yml`, displayed above CTA. | S | AFK | 1.5.1 |
| 1.5.7 | Build `app/components/jobs/detail/apply-cta.tsx` — `mailto:` button with prefilled subject `Candidature - <title>`. | S | AFK | 1.5.1 |
| 1.5.8 | Build `app/components/jobs/detail/about-ocobo.tsx` — boilerplate block, content from `jobs.json`. | S | AFK | 1.6.1 |
| 1.5.9 | Compose detail page layout in route file (header → intro → scrollspy + sections → about-ocobo → manager-block → apply-cta). | S | AFK | 1.5.2-1.5.8 |

### 1.6 — i18n

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 1.6.1 | Create `locales/fr/jobs.json` (meta keys, about-ocobo boilerplate, apply CTA labels, section title fallbacks). Register `jobs` namespace in `app/localization/resources.ts`. | S | AFK | — |

### 1.7 — Visual check

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 1.7.1 | Run dev server, compare `/fr/jobs/revenue-operations-manager` against `prototype/pages/JobDetail.tsx`. Check responsive (mobile/desktop). Document gaps + decide which are blocking vs deferred. | S | HITL | 1.5.9 |

---

## Phase 2: Liste minimale

### 2.1 — List route + loader

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 2.1.1 | Create route `app/routes/_main.($lang).jobs._index.tsx`: loader filters `status === 'published'`, sorts by `publishedAt` desc. | M | AFK | 1.3.4 |
| 2.1.2 | Add meta function with localised title/description for SEO. | S | AFK | 2.1.1 |

### 2.2 — Offer card component

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 2.2.1 | Build `app/components/jobs/offer-card.tsx` (icon, title, contractType, location, seniority, link). Compute `highlightColor` via `['yellow','sky','mint','coral'][index % 4]`. | M | AFK | 2.1.1 |

### 2.3 — List page sections

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 2.3.1 | Build `app/components/jobs/hero-section.tsx` (badge "RECRUTEMENT", title, intro). | M | AFK | 1.6.1 |
| 2.3.2 | Build `app/components/jobs/offers-list-section.tsx` (responsive grid using `offer-card`). | M | AFK | 2.2.1 |
| 2.3.3 | Compose list page layout in route (hero → offers list). | S | AFK | 2.3.1, 2.3.2 |

### 2.4 — Visual check

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 2.4.1 | Run dev server. Compare `/fr/jobs` against prototype hero + offers grid. Responsive check. | S | HITL | 2.3.3 |

---

## Phase 3: Liste enrichie (Notion parity)

### 3.1 — Values section

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 3.1.1 | Add 4 values i18n keys in `locales/fr/jobs.json` (Excellence Senior / Transparence Radicale / Impact Mesurable / Esprit de Squad). | S | AFK | — |
| 3.1.2 | Build `app/components/jobs/values-section.tsx` using `iconBox()` + `text()` recipes. Wire into list route. | M | AFK | 3.1.1, 2.3.3 |

### 3.2 — Process section

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 3.2.1 | Add 6 hiring steps i18n keys (RH / Hiring Manager / Technique / Case Study / Cultural Fit / Référence) with durations + descriptions. | S | AFK | — |
| 3.2.2 | Build `app/components/jobs/process-section.tsx`. Wire into list route. | M | AFK | 3.2.1, 2.3.3 |

### 3.3 — Offices section

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 3.3.1 | Decide office photos count + layout (carousel vs grid). Import photos from Notion to `posts/assets/`. | S | HITL | — |
| 3.3.2 | Build `app/components/jobs/offices-section.tsx`. Add caption i18n key. Wire into list route. | M | AFK | 3.3.1, 2.3.3 |

### 3.4 — About-Ocobo on list

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 3.4.1 | Build `app/components/jobs/about-ocobo-section.tsx` for list page (reuse i18n keys from 1.6.1). Wire into list route. | S | AFK | 1.6.1, 2.3.3 |

### 3.5 — Visual + parity check

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 3.5.1 | Run dev server. Visual + responsive check on `/fr/jobs`. Compare narrative depth against Notion landing. Document any remaining gaps. | S | HITL | 3.1.2, 3.2.2, 3.3.2, 3.4.1 |

---

## Phase 4: Enrichissements (peuvent slipper)

### 4.1 — Stories videos

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 4.1.1 | Decide videos source (YouTube embeds / Vimeo / self-hosted). Confirm 3 episodes URLs/files. | S | HITL | — |
| 4.1.2 | Build `app/components/jobs/stories-section.tsx` for 3 Ocobo Stories episodes. Wire into list route. | M | HITL | 4.1.1, 2.3.3 |

### 4.2 — Team section

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 4.2.1 | Decide team section depth + arbitrage with `/studio` page to avoid duplication. | S | HITL | — |
| 4.2.2 | Build `app/components/jobs/team-section.tsx`. Wire into list route. | M | AFK | 4.2.1, 2.3.3 |

### 4.3 — Final polish

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 4.3.1 | Final responsive sweep + typography/spacing polish on full liste page. | S | HITL | 4.1.2, 4.2.2 |

---

## Phase 5: SEO + Nav cleanup + Deploy

### 5.1 — SEO structured data

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 5.1.1 | Build `JobPosting` JSON-LD generator (title, description, datePosted, validThrough = publishedAt + 90 days, employmentType mapped from contractType, hiringOrganization, jobLocation). Add to detail route head. | M | AFK | 1.5.9 |
| 5.1.2 | Add Open Graph meta tags on detail (title, description, og:image fallback). | S | AFK | 1.5.9 |

### 5.2 — Sitemap

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 5.2.1 | Update `app/utils/sitemap.ts` to include `/jobs` and detail URLs with `lastmod`. | S | AFK | 2.1.1 |

### 5.3 — 404 verification

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 5.3.1 | Verify 404 redirect `/jobs/<unknown>` → `/jobs`. Add basic test if missing. | S | AFK | 1.5.1 |

### 5.4 — Seed remaining offers

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 5.4.1 | Audit Notion remaining published offers (list URLs + titles). | S | HITL | 3.5.1 |
| 5.4.2 | Author each as markdown in `posts/jobs/fr/`. Validate frontmatter on each. | M | HITL | 5.4.1 |

### 5.5 — Nav + URL cleanup

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 5.5.1 | Update `app/hooks/useMenuItems.ts` — `jobs` item: remove `isExternal`, point to internal `/jobs`. | S | AFK | 5.4.2 |
| 5.5.2 | Remove Notion URL from `app/utils/url.ts`. Grep `Nous-rejoindre` for residual references; remove all. | S | AFK | 5.5.1 |

### 5.6 — Preview + review

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 5.6.1 | Push branch. Trigger Vercel preview deploy. | S | HITL | 5.5.2 |
| 5.6.2 | Validate JSON-LD via Google Rich Results Test on preview URL. | S | HITL | 5.6.1 |
| 5.6.3 | Share preview URL for stakeholder review. Address blocking feedback. | S | HITL | 5.6.1 |

### 5.7 — Merge

| # | Task | Size | Tag | Depends on |
|---|------|------|-----|------------|
| 5.7.1 | Append Phase summary entries to `progress.txt`. | S | AFK | 5.6.3 |
| 5.7.2 | Open PR. Merge to `main` once CI green + review approved. | S | HITL | 5.7.1 |

---

## Summary

- **Total tasks:** 55
- **AFK tasks:** 35 (autonomous)
- **HITL tasks:** 20 (need human input)
- **Sizing:** S × 32, M × 23, L × 0
- **Estimated effort:** ~100h total (S avg 30min, M avg 2.5h)

### Critical path

1.1.1 → 1.1.2 → 1.2.1 → 1.3.1 → 1.3.2 → 1.4.1 → 1.5.1 → 1.5.4 → 1.5.9 → 1.7.1 → 2.1.1 → 2.3.3 → 2.4.1 → 3.5.1 → 5.4.2 → 5.5.2 → 5.6.1 → 5.7.2

### Notion parity reached at: 3.5.1

Tasks 4.x and beyond (besides cleanup/SEO) are iterative enhancements past parity.
