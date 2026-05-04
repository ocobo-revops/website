# Performance — Pre-PRD (draft)

> **Status** : draft, audit auto mai 2026 (branche `feature/jobs-pocock`)
> **Branche cible** : `chore/performance-improvements` (à créer, après merge jobs)
> **Score actuel** : 6.5/10 — fondations solides, optimisations manquantes

---

## 1. Problème

Architecture SSR + Vercel Edge correctement posée (streaming via `renderToPipeableStream`, Panda CSS zero-runtime, cache custom avec SWR), mais **trois axes lourds** dégradent les Core Web Vitals : data fetching (N+1, batches sous-dimensionnés), images (pas de LCP priority, dimensions manquantes), bundling (CSS non splittée par route).

### Constats CWV estimés (à vérifier sur prod)

| Vital | Estimation actuelle | Cible | Cause principale |
|-------|---------------------|-------|------------------|
| **LCP** | 3.5–4.2 s | < 2.5 s | Hero image sans `fetchPriority="high"` ni preload |
| **CLS** | 0.12–0.15 | < 0.1 | Images sans width/height, font swap |
| **INP** | 300–400 ms | < 200 ms | Hydration HubSpot ×3, i18next init bloquant |
| **TTFB** | 800–1 200 ms | < 600 ms | Fallback fetch séquentiel homepage, batch GitHub 10 |

### Forces actuelles

- **Streaming SSR** (`entry.server.tsx:60`) avec callback differencié bots/users (`onAllReady` vs `onShellReady`)
- **Cache strategy par route** (`cache.ts:105–119`) avec SWR `s-maxage 1h–24h` + `stale-while-revalidate 7d`, bypass `?refresh=1`
- **Panda CSS zero-runtime** : 76 KB CSS minifié, fonts Bornia/Bermia self-hosted avec `font-display: swap`
- **Monitoring** : Vercel Analytics + Speed Insights présents

### Faiblesses détectées

1. **N+1 fallback fetch** sur homepage (`_main.($lang)._index.tsx:48–52`) — `fetchStories(lang)` puis fallback `fetchStories('fr')` séquentiel quand status ≠ 200
2. **Batch GitHub API = 10 fichiers** (`github.ts:38`) avec timeout 5 s/batch → blog/clients/jobs pages listing à 3 batches séquentiels
3. **Images sans dimensions** dans 20+ composants (`ClientCarousel.tsx`, `BlogItem.tsx`, etc.) → CLS + pas de `fetchPriority` LCP
4. **Duplication code fetching** : `modules/github/fetchMarkdownFiles.server.ts` (legacy) coexiste avec `sources/github.ts` (refactored)
5. **i18next init synchrone en SSR** (`entry.server.tsx:42–55`) bloque le TTFB

### Top 10 problèmes critiques

| # | Problème | Localisation | Impact estimé |
|---|----------|--------------|---------------|
| 1 | Hero image LCP sans priority | `HeroSection`, `banner` | LCP +800 ms à +1.2 s |
| 2 | Batch GitHub 10 → 3 batches sur listings | `github.ts:38, 156–177` | LCP listings +1–2 s |
| 3 | Fallback fetch séquentiel EN→FR | `_index.tsx:48–52` | TTFB EN +1–2 s |
| 4 | i18next init bloquant | `entry.server.tsx:47–55` | TTFB +200–500 ms |
| 5 | Images sans width/height | 20+ fichiers | CLS +0.05 à +0.08 |
| 6 | HubSpot script ×3 | `ContactForm`, `NewsletterForm`, `PageMarkdownContainer` | INP +200 ms |
| 7 | CSS non splittée par route | `app/styles/` | FCP +150 ms, +20 KB initial |
| 8 | Sitemap fetchs séquentiels `.then()` chains | `sitemap[.xml].tsx:60–80` | TTFB sitemap haut |
| 9 | Cache headers actifs en source `locale` | `cache.ts:77–82` | CDN hit rate 0% en local |
| 10 | Pas de `defer()` sur metadata loaders | `_main.*.tsx` | INP +180 ms |

---

## 2. Score & forces/faiblesses détaillés

### Score par axe

| Axe | Note | Priorité refacto |
|-----|------|------------------|
| Rendering & Hydration | 7/10 | Medium |
| Cache strategy | 7/10 | Medium |
| Data fetching | 5/10 | **High** |
| Bundle size | 6/10 | **High** |
| Images | 4/10 | **High** |
| Fonts | 7/10 | Low |
| JS runtime | 6/10 | Medium |
| Monitoring | 8/10 | Low |
| HTTP / network | 6/10 | Medium |

---

## 3. Objectifs

1. **CWV verts** : LCP < 2.5 s, CLS < 0.1, INP < 200 ms, TTFB < 600 ms
2. **Data fetching parallèle** : éliminer les N+1, paralléliser i18n + content
3. **Images optimisées** : composant `<OptimizedImage>` avec dimensions, format moderne, priority sur LCP
4. **Bundle plus léger** : CSS route-split, lazy HubSpot, single context
5. **Cohérence** : supprimer le module GitHub legacy, doc cache strategy
6. **Mesure** : baseline CWV + dashboard avant chaque phase pour valider gain réel

---

## 4. Non-objectifs

- Migration framework (Next.js, Astro) — on reste sur React Router v7
- Refonte du système de contenu (passage à un CMS) — orthogonal
- Optimisation de pages internes back-office si elles existent
- Atteindre 100/100 Lighthouse — viser des CWV verts est le bon proxy

---

## 5. Périmètre proposé (3 phases)

### Phase 0 — Quick wins (~2 j)

| Action | Fichier | Gain estimé |
|--------|---------|-------------|
| Hero LCP : `<link rel="preload">` + `fetchPriority="high"` + dimensions | `root.tsx`, `HeroSection.tsx` | LCP −800 ms |
| Supprimer le module GitHub legacy | `modules/github/fetchMarkdownFiles.server.ts` | −5 KB code mort |
| Cache headers conditionnels en source locale | `vercel.json` ou `cache.ts` | clarté CDN |
| Activer Vercel Speed Insights baseline | dashboard | mesure |

### Phase 1 — Data fetching (~5 j)

| Action | Fichier | Gain estimé |
|--------|---------|-------------|
| Paralléliser i18n + content via `Promise.all` | loaders racines | TTFB −300 ms |
| Fix N+1 fallback homepage : `Promise.all([lang, 'fr'])` + select client | `_index.tsx:48–52` | TTFB EN −1 s |
| Augmenter batch GitHub à 25 + timeout 8 s | `github.ts:38` | LCP listings −1.2 s |
| Sitemap : un seul `Promise.all` au lieu des `.then()` chains | `sitemap[.xml].tsx` | TTFB sitemap −500 ms |
| `defer()` metadata + related items sur pages détail | `blog.$slug.tsx`, `jobs.$slug.tsx`, `clients.$slug.tsx` | INP −180 ms |

### Phase 2 — Bundle + images (~6 j)

| Action | Fichier | Gain estimé |
|--------|---------|-------------|
| Composant `<OptimizedImage>` avec dimensions, srcset, lazy hors fold | nouveau, à utiliser ~20 sites | CLS −0.08, LCP −500 ms |
| Servir WebP/AVIF via Vercel Image Optimization | composant + assets | poids −40 % |
| CSS route code-split (Vite plugin) | `vite.config.ts`, styles | FCP −150 ms, initial −20 KB |
| Single HubSpot context provider + suspense | `app/components/forms/`, root | INP −200 ms, scripts ×3→×1 |
| `<link rel="preconnect">` GitHub raw + fonts | `root.tsx` head | TTFB −50 ms |

**Effort total** : ~13 jours dev équivalent une personne, parallélisable par axe.

---

## 6. Estimation gains cumulés

| Étape | LCP | CLS | INP | TTFB | Score perf indicatif |
|-------|------|------|------|------|----------------------|
| Baseline | 3.8 s | 0.13 | 320 ms | 1.0 s | ~6.2 |
| Après P0 | 2.8 s | 0.10 | 280 ms | 0.9 s | ~7.8 |
| Après P1 | 2.0 s | 0.10 | 180 ms | 0.5 s | ~8.9 |
| Après P2 | **1.5 s** | **0.07** | **120 ms** | **0.4 s** | **~9.5** |

Estimation : ~45 % plus rapide sur homepage, CWV tous verts.

---

## 7. Découpage en issues vertical-slice

Une issue par phase, sous-issues par axe en P1/P2. Chaque PR mergeable indépendamment, validation via Vercel Speed Insights ou Lighthouse CI sur preview.

À reprendre via `/to-issues` quand le PRD est validé.

---

## 8. Risques

| Risque | Mitigation |
|--------|-----------|
| Refacto fetching change la sémantique loader (erreur silencieuse) | Tests d'intégration loaders — couplage avec PRD test (Phase 3 du PRD test) |
| Vercel Image Optimization a un quota | Vérifier le plan, fallback `<img>` standard si dépassement |
| Augmenter batch GitHub → rate-limit | Mesurer avant/après, garde-fou retry exponential |
| `defer()` peut dégrader si sub-data critique au contenu primaire | Bien choisir ce qui est différé : metadata, related, jamais le `<h1>` |
| Quick wins masquent le besoin d'une refonte plus profonde | Faire baseline + final dashboard CWV pour vraie mesure |

---

## 9. Métriques de succès

- LCP p75 mobile < 2.5 s sur homepage, blog detail, jobs detail
- CLS p75 < 0.1 sur toutes pages indexées
- INP p75 < 200 ms
- TTFB p75 < 600 ms
- Speed Insights : score 90+
- Bundle initial JS < 200 KB gzipped, CSS initial < 50 KB
- 0 import de `modules/github/fetchMarkdownFiles.server.ts` (module supprimé)

---

## 10. Questions ouvertes

1. **Vercel Image Optimization** — plan actuel autorise quel quota ? Si limité, on bascule sur Cloudinary ou on optimise au build ?
2. **Source contenu en prod** — `CONTENT_SOURCE=github` ou `locale` ? Si `github`, le batch + i18n + cache deviennent les vrais bottlenecks. Si `locale`, le cache HTTP devient inutile.
3. **HubSpot** — peut-on charger les scripts à l'interaction (lazy) plutôt qu'au mount ? Validation produit nécessaire (tracking conversions ?).
4. **Routes statiques** — homepage, about, method changent rarement. Vaut-il mieux passer en pré-render au build avec revalidation périodique ?
5. **Lighthouse CI** — l'ajouter en gate PR ou juste en monitoring ?
6. **Coupling avec PRD test** — tester les loaders refactorés en parallèle, ou laisser le PRD test couvrir après ?
7. **Dépendance avec PRD DS** — créer un `<OptimizedImage>` doit s'inscrire dans le DS pour cohérence, à coordonner.
8. **Quand démarrer** — Phase 0 (hero LCP, dead code) pourrait passer dans le PR jobs lui-même (gain immédiat, faible risque).

---

## 11. Sources

- Audit Explore agent (mai 2026, branche `feature/jobs-pocock`)
- `app/entry.server.tsx`, `app/root.tsx`
- `app/modules/cache.ts`, `app/modules/content/sources/{github,filesystem}.ts`
- `app/modules/github/fetchMarkdownFiles.server.ts` (legacy à supprimer)
- Loaders critiques : `_main.($lang)._index.tsx`, `sitemap[.xml].tsx`, blog/jobs detail
- Composants : `HeroSection`, `ClientCarousel`, `BlogItem`, `ContactForm`, `NewsletterForm`, `PageMarkdownContainer`
