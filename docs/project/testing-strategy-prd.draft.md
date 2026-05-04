# Testing Strategy — Pre-PRD (draft)

> **Status** : draft, audit auto mai 2026 (branche `feature/jobs-pocock`)
> **Branche cible** : `chore/testing-strategy` (à créer, après merge jobs)
> **Score actuel** : 3.5/10 — fondations présentes mais inexploitées

---

## 1. Problème

Le repo a la **stack de test** correcte (Vitest 3.2, Testing Library, jsdom, v8 coverage) mais une **adoption quasi nulle** sur ce qui compte le plus : composants, loaders React Router, intégrations externes (GitHub API), E2E.

### Constats chiffrés

| Indicateur | Valeur | Constat |
|------------|-------:|---------|
| Fichiers source TS/TSX | 226 | base codebase |
| Fichiers de test | 11 | ratio ~5 % |
| LOC tests | 2 643 | concentrés sur schemas (507) + errors (425) |
| Tests composants UI | **0** | malgré `@testing-library/react` v16 installé |
| Tests loaders/actions | **0** | toute la surface React Router v7 non couverte |
| Tests E2E | **0** | aucun golden path automatisé |
| Coverage gate CI | ❌ | seuil 80 % défini localement, non bloquant en CI |
| Tests modules `github/*` | 0 | 670 LOC d'intégration externe non testée |
| Tests `cache.ts` | 0 | 129 LOC SWR/TTL non testées |

### Bug bloquant (root cause de l'absence de tests UI)

`vitest.config.ts` : `environment: 'node'`. `jsdom` est installé mais inutilisé. Tant que ce flag n'est pas changé, **`@testing-library/react` ne peut pas tourner** — c'est ce qui explique les 0 tests composants malgré la dépendance présente.

C'est un fix d'une ligne qui débloque toute la phase composants.

### Top 10 modules critiques sans test

| # | Fichier | LOC | Risque |
|---|---------|----:|--------|
| 1 | `app/modules/github/fetchMarkdownFile.server.ts` | 172 | Erreurs API GitHub → 500 prod |
| 2 | `app/modules/content/sources/github.ts` | 224 | Pagination, retry, rate-limit |
| 3 | `app/modules/content/sources/filesystem.ts` | 200 | I/O fichiers, fichier manquant |
| 4 | `app/modules/cache.ts` | 129 | TTL/SWR/bypass — Edge headers |
| 5 | `app/modules/config.ts` (Markdoc) | 133 | Tag transforms, vecteur XSS potentiel |
| 6 | `app/modules/content/processor.ts` | 152 | YAML edge cases, frontmatter |
| 7 | `app/routes/_main.($lang)._index.tsx` | — | HomePage loader, i18n |
| 8 | `app/routes/_main.($lang).jobs.$slug.tsx` | — | Job detail + LD-JSON |
| 9 | `app/routes/_main.($lang).contact.tsx` | — | Form action, RGPD |
| 10 | `app/components/ContactForm.tsx` | — | Validation client, soumission |

---

## 2. Évaluation globale (3.5/10)

**Forces** :
- Vitest + v8 coverage en place
- Tests unitaires solides sur Zod schemas (507 LOC) + errors (425 LOC)
- Stratégie de mock fonctionnelle (`vi.mock`)

**Faiblesses** :
- `environment: 'node'` au lieu de `jsdom` → Testing Library inutilisable
- 0 tests composants / loaders / actions / E2E
- Intégration GitHub non testée → risque prod direct si API down ou rate-limit
- CI n'enforce pas le seuil de coverage
- Pas de MSW → mocks `vi.mock` ne testent pas la shape réelle de l'API

---

## 3. Objectifs

1. **Corriger le bug environment** — passer en `jsdom` pour débloquer Testing Library
2. **Tests composants UI** sur les composants critiques (ContactForm, LanguageSwitcher, NavigationMenu)
3. **Tests loaders/actions** React Router v7 sur les routes critiques (homepage, blog detail, jobs detail, contact)
4. **Tests d'intégration GitHub API** via MSW
5. **Tests cache + processor + config Markdoc**
6. **E2E smoke tests** (Playwright) sur 4 golden paths
7. **Coverage gate CI** — seuil 80 % bloquant
8. **A11y automatisé** via axe-core sur les composants

---

## 4. Non-objectifs

- Atteindre 100 % de coverage — l'objectif est la confiance sur les chemins critiques, pas la metrique
- Visual regression (Percy/Chromatic) — phase ultérieure si besoin
- Performance budgets (LCP/CLS) — relève d'un PRD perf séparé
- Tests sur composants Panda CSS purs sans logique (Container, ButtonLink) — faible valeur

---

## 5. Périmètre proposé (4 phases)

### Phase 0 — Quick wins (~1 j)
- Fix `vitest.config.ts` : `environment: 'node'` → `'jsdom'`
- Créer `app/test/utils.tsx` : helper `render` Testing Library avec providers (i18n, router, theme)
- Ajouter MSW + setup baseline pour mocker GitHub API
- Ajouter `axe-core` + `jest-axe` matcher
- Activer `--coverage` en CI sans gate (juste pour la metrique)

### Phase 1 — Tests intégrations critiques (~5 j)
- **`cache.ts`** — TTL, SWR, bypass, headers Edge (~12 tests)
- **`github/*`** — API errors, rate-limits, 404, auth fail (~20 tests, MSW)
- **`processor.ts`** + **`config.ts`** — Markdoc transforms, frontmatter edge cases (~15 tests)
- **Schémas Zod** — combler les edge cases manquants (extra fields, coercion, refinements imbriqués)
- **i18n routing** — lang param, fallback, redirects (~8 tests)

### Phase 2 — Tests composants UI (~4 j)
- **`ContactForm`** — validation, soumission, RGPD, états erreur
- **`LanguageSwitcher`** — toggle FR/EN, persistance, génération de liens
- **`NavigationMenu`** — ouverture, navigation clavier, mobile
- **Form jobs candidature** — validation, upload CV, soumission
- **`Newsletter`** — succès, erreur, double opt-in
- A11y axe sur chaque (~20 tests + a11y assertions)

### Phase 3 — Tests loaders/actions React Router (~3 j)
- Créer un harness de test loader React Router v7 (helper réutilisable)
- Loaders : homepage, blog index, blog detail, jobs detail, story detail, contact
- Actions : contact form, candidature, newsletter
- Cas d'erreur : data not found, cache miss, GitHub down (~15 tests)

### Phase 4 — E2E + gate CI (~3 j)
- Setup Playwright (config, fixtures, baseURL preview)
- 4 golden paths E2E :
  1. Homepage → contact form → soumission
  2. Blog index → article detail → lang switch
  3. Jobs index → job detail → candidature
  4. Lang switch FR ↔ EN sur toutes les pages racines
- **Coverage gate CI** activé : seuil 80 % bloquant sur PR
- E2E gate CI : run sur PR, fail si broken

**Effort total** : ~16 jours dev équivalent une personne. Phases 1–3 parallélisables.

---

## 6. Découpage en issues vertical-slice

Une issue par phase, sous-issues par module en Phase 1/2/3. Chaque PR mergeable indépendamment, ajoutant un set de tests + ses fixtures.

À reprendre via `/to-issues` quand le PRD est validé.

---

## 7. Stack additionnelle proposée

| Tool | Usage | Phase | Justification |
|------|-------|------|---------------|
| **MSW** | Mock GitHub API | 0 | Tester la shape réelle, pas un `vi.mock` fragile |
| **jest-axe** | A11y matcher | 0 | Bloquer les régressions d'accessibilité |
| **Playwright** | E2E | 4 | Standard moderne, parallèle, traces vidéo |
| **@testing-library/user-event** | Interactions | 0 | Déjà sans doute en dep transitive, à confirmer |

À éviter pour l'instant : Cypress (plus lourd, double emploi avec Playwright), Percy/Chromatic (coût, phase ultérieure), Storybook (utile pour DS audit séparé, hors scope test).

---

## 8. Risques

| Risque | Mitigation |
|--------|-----------|
| Tester loaders RR v7 = pas de pattern public mature | Créer un harness maison, partager via doc / ADR |
| MSW alourdit le setup | Documenter les handlers, isoler dans `app/test/msw/` |
| E2E flaky en CI Vercel preview | Retries Playwright, fixtures stables, éviter les sleeps |
| Coverage gate bloque des PRs urgents | `// vitest-coverage-ignore` ciblé + exception nominale via `--coverage.thresholds.perFile=false` |
| Refacto qui casse les tests à l'ancienne | Phase 0 corrige le setup avant d'écrire 200 tests dessus |

---

## 9. Métriques de succès

- `vitest.config.ts` : `environment: 'jsdom'`
- Tests composants ≥ 5 (ContactForm, LanguageSwitcher, NavigationMenu, Newsletter, JobApplicationForm)
- Tests loaders ≥ 6
- Tests intégration GitHub via MSW : ≥ 1 par fetcher
- Coverage `app/modules/**` ≥ 80 % bloquant en CI
- E2E : 4 scénarios verts en CI
- Score audit subjectif : 3.5/10 → 7+/10

---

## 10. Questions ouvertes

1. **CI duration** — viser quoi (cible <5 min en parallèle) ? Si E2E pousse au-delà, splitter en jobs séparés ?
2. **Visual regression** — vraiment hors scope, ou minimum viable Percy en Phase 4 sur 5 pages clés ?
3. **MSW ou nock** — MSW est plus moderne, mais nock plus simple pour du Node pur côté server. À trancher.
4. **Storybook** — pas dans le PRD, mais si tests composants explosent, un Storybook minimal pourrait servir d'environnement isolé. Décision à prendre Phase 2.
5. **Tests Panda CSS** — comment gérer ? Probablement non testés directement, juste via les composants qui les utilisent.
6. **Snapshot tests** — autorisés ou bannis ? Mon avis : bannis sauf cas Markdoc transforms où le rendu HTML structuré a un sens.
7. **Quand démarrer** — après merge jobs ou en parallèle d'une feature à venir ? La Phase 0 (fix env) pourrait passer dans le PR jobs lui-même tellement c'est rapide.

---

## 11. Sources

- Audit Explore agent (mai 2026, branche `feature/jobs-pocock`)
- `package.json`, `vitest.config.ts`, `app/test/setup.ts`
- `.github/workflows/test.yml`
- Inventaire complet : 11 fichiers test sur 226 fichiers source
