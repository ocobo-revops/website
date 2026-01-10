# Tech Spec: Dependencies Cleanup & Updates

```yaml
id: tech-spec-dependencies-cleanup
title: "Clean-up des dépendances et fichiers obsolètes"
created: 2026-01-09
status: ready-for-dev
complexity: medium
estimated_files: 10-15
type: maintenance
author: Claude (Sonnet 4.5)
```

## Objectif

Nettoyer et moderniser les dépendances du projet ocobo-website:
- Supprimer les dépendances obsolètes/inutilisées
- Mettre à jour les dépendances outdated de manière sécurisée
- Identifier et supprimer les fichiers obsolètes
- Préparer le projet pour la refonte UI à venir

## Contexte

**Projet:** ocobo-website (Remix/React Router 7 + Panda CSS)

**État actuel:**
- Migration Radix UI → Ark UI complétée (sauf NavigationMenu)
- NavigationMenu conservé en Radix UI pour la refonte navigation
- @shadow-panda/style-context encore utilisé uniquement dans NavigationMenu
- 42 packages outdated détectés

**Scope:** Phase 2 du clean-up général (Phase 1 = Migration UI complétée)

## ✅ Travail Déjà Complété

### 1. Suppression de yaml-js
- ✅ **Fichier:** `package.json`
- ✅ **Action:** Supprimé `yaml-js: ^0.3.1` (doublon avec js-yaml)
- ✅ **Validation:** Aucune utilisation dans le code (grep confirmé)
- ✅ **Statut:** Prêt pour `pnpm install`

## 📦 Analyse des Dépendances Outdated

### Catégorie 1: Mises à jour PATCH (Sûres) ✅

**Recommandation:** À appliquer sans risque

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| js-yaml | 4.1.0 | 4.1.1 | Bugfixes uniquement |
| typescript | 5.9.2 | 5.9.3 | Bugfixes |
| isbot | 5.1.30 | 5.1.32 | +2 patches |
| @octokit/rest | 22.0.0 | 22.0.1 | Patch GitHub API |
| react-remove-scroll | 2.7.1 | 2.7.2 | Bugfix |
| @radix-ui/react-context | 1.1.2 | 1.1.3 | Patch |
| @radix-ui/react-portal | 1.1.9 | 1.1.10 | Patch |
| i18next-fs-backend | 2.6.0 | 2.6.1 | Patch |

**Commande:**
```bash
pnpm update js-yaml typescript isbot @octokit/rest react-remove-scroll @radix-ui/react-context @radix-ui/react-portal i18next-fs-backend
```

### Catégorie 2: Mises à jour MINOR (À tester) ⚠️

**Recommandation:** Appliquer avec validation tests

| Package | Current | Latest | Type | Notes |
|---------|---------|--------|------|-------|
| **React Router** | 7.8.1 | 7.12.0 | minor | +4 versions, tester routing |
| framer-motion | 12.23.12 | 12.25.0 | patch | Stable, animations |
| i18next | 25.3.6 | 25.7.4 | minor | i18n core |
| remix-i18next | 7.2.1 | 7.4.2 | minor | Dépend de i18next |
| zod | 4.0.17 | 4.3.5 | minor | Validation schemas |
| lucide-react | 0.540.0 | 0.562.0 | minor | Icons, safe |
| @vercel/analytics | 1.5.0 | 1.6.1 | minor | Analytics |
| @vercel/speed-insights | 1.2.0 | 1.3.1 | minor | Monitoring |

**Commande:**
```bash
pnpm update framer-motion i18next remix-i18next zod lucide-react @vercel/analytics @vercel/speed-insights @react-router/dev @react-router/fs-routes @react-router/node @react-router/serve react-router
```

### Catégorie 3: Mises à jour MAJOR (Breaking Changes) 🔴

**Recommandation:** À ÉVITER pour l'instant - Reporter après refonte UI

| Package | Current | Latest | Raison de différer |
|---------|---------|--------|-------------------|
| **React** | 18.3.1 | **19.2.3** | React 19 encore récent, attendre stabilité écosystème |
| **@types/react** | 18.3.18 | **19.2.7** | Lié à React 19 |
| **@types/react-dom** | 18.3.5 | **19.2.3** | Lié à React 19 |
| **react-i18next** | 15.6.1 | **16.5.1** | Peut nécessiter React 19 |
| **Panda CSS** | 0.37.2 | **1.8.0** | v1.0 = breaking changes majeurs |
| **Biome** | 1.9.4 | **2.3.11** | v2.0 = nouvelles règles lint |
| **Vite** | 5.4.13 | **7.3.1** | v6+v7 = breaking changes config |
| **Vitest** | 3.2.4 | **4.0.16** | v4.0 = breaking changes API |
| @vercel/blob | 1.1.1 | **2.0.0** | API v2 breaking |
| remix-utils | 8.8.0 | **9.0.0** | v9 breaking |
| untildify | 5.0.0 | **6.0.0** | v6 breaking |
| vite-tsconfig-paths | 4.3.2 | **6.0.3** | v5+v6 breaking |

**Note importante:** Ces mises à jour nécessiteraient:
- Migration Panda CSS v0 → v1 (impacts sur tous les styled components)
- Tests complets de toute l'app avec React 19
- Mise à jour des configs Vite/Vitest
- Potentiellement breaking changes sur i18n
- Meilleure fenêtre = après refonte UI

## 🧹 Dépendances Obsolètes à Supprimer

### À garder temporairement (refonte navigation)
- ✅ `@shadow-panda/style-context` - Utilisé dans NavigationMenu.tsx
- ✅ `@shadow-panda/preset` - Preset pour style-context
- ✅ `@radix-ui/react-navigation-menu` - NavigationMenu en Radix

**Action:** Documenter pour suppression lors refonte navigation

### Déjà supprimées
- ✅ `yaml-js` - Supprimé (doublon js-yaml)
- ✅ `@radix-ui/react-accordion` - Migré vers Ark UI
- ✅ `@radix-ui/react-scroll-area` - Migré vers Ark UI
- ✅ `@radix-ui/react-select` - Migré vers Ark UI
- ✅ `@radix-ui/react-slot` - Remplacé par ark.div

## 📁 Fichiers Obsolètes à Identifier

### Patterns à rechercher
```bash
# Fichiers backup/old
**/*.old
**/*.backup
**/*.bak
**/*-old.*
**/*-backup.*

# Fichiers temporaires
**/*.tmp
**/*.temp
**/tmp/**

# Fichiers de test obsolètes
**/*.test.old.*
**/*.spec.old.*

# Composants dépréciés
**/components/**/*-deprecated.*
**/components/**/*-old.*

# Configs obsolètes
**/.eslintrc* # Si migration Biome complète
**/tsconfig.old.json
```

### Dossiers à vérifier
- `app/components/` - Composants inutilisés
- `app/modules/` - Modules legacy
- `public/` - Assets obsolètes
- `docs/` - Documentation outdated

## 📋 Plan d'Action par Options

### Option 1: Sécuritaire (Recommandé) ✅

**Scope:** Patches uniquement + yaml-js
**Durée estimée:** 15-30 min
**Risque:** Très faible

```bash
# 1. Supprimer yaml-js des node_modules
pnpm install  # Après suppression yaml-js du package.json

# 2. Mettre à jour patches
pnpm update js-yaml typescript isbot @octokit/rest react-remove-scroll \
  @radix-ui/react-context @radix-ui/react-portal i18next-fs-backend

# 3. Validation
pnpm typecheck
pnpm check
pnpm test:run
pnpm build
```

**Fichiers impactés:**
- `package.json` ✅ (déjà modifié)
- `pnpm-lock.yaml` (sera régénéré)

**Breaking changes:** Aucun

### Option 2: Modérée ⚠️

**Scope:** Option 1 + mineures stables (React Router, i18next, zod, etc.)
**Durée estimée:** 1-2h
**Risque:** Moyen (tests requis)

```bash
# 1. Option 1
pnpm install
pnpm update js-yaml typescript isbot @octokit/rest react-remove-scroll \
  @radix-ui/react-context @radix-ui/react-portal i18next-fs-backend

# 2. Mineures stables
pnpm update framer-motion i18next remix-i18next zod lucide-react \
  @vercel/analytics @vercel/speed-insights

# 3. React Router (séparément pour tester)
pnpm update @react-router/dev @react-router/fs-routes @react-router/node \
  @react-router/serve react-router

# 4. Tests complets
pnpm typecheck
pnpm check
pnpm test:run
pnpm dev  # Tester manuellement routing et i18n
pnpm build
```

**Tests manuels requis:**
- ✅ Navigation entre pages (React Router 7.8 → 7.12)
- ✅ Changement de langue (i18next updates)
- ✅ Validation forms (zod updates)
- ✅ Animations (framer-motion)

**Breaking changes possibles:**
- React Router API changes (peu probable 7.8→7.12)
- i18next config changes (vérifier breaking changes notes)

### Option 3: Agressive 🔴

**Scope:** Tout mettre à jour incluant majors
**Durée estimée:** 4-8h+
**Risque:** Élevé

**NON RECOMMANDÉ** - Reporter après refonte UI pour:
- React 19 migration nécessite audit complet composants
- Panda CSS v1 nécessite migration recipe/pattern syntax
- Vite 7 nécessite refonte config
- Cumul de breaking changes = beaucoup de debugging

## 🔍 Recherche Fichiers Obsolètes

### Script de détection
```bash
# Fichiers backup/old
find app -type f \( -name "*.old" -o -name "*.backup" -o -name "*.bak" \)

# Fichiers temporaires
find . -type f \( -name "*.tmp" -o -name "*.temp" \) -not -path "*/node_modules/*"

# Composants potentiellement inutilisés (nécessite analyse manuelle)
find app/components -type f -name "*.tsx" | while read file; do
  basename=$(basename "$file" .tsx)
  if ! grep -r "import.*$basename" app --exclude-dir=components &>/dev/null; then
    echo "Potentially unused: $file"
  fi
done
```

### Vérification manuelle requise
- Assets publics non référencés
- Modules legacy remplacés
- Documentation outdated

## ✅ Checklist de Validation

### Tests Automatisés
```bash
# 1. TypeScript
pnpm typecheck

# 2. Linting
pnpm check

# 3. Tests unitaires
pnpm test:run

# 4. Build production
pnpm build

# 5. Vérifier taille bundle (si option 2+)
pnpm build:analyze
```

### Tests Manuels (Option 2+)
- [ ] Page d'accueil charge correctement
- [ ] Navigation entre toutes les pages
- [ ] Changement de langue fonctionne
- [ ] Forms avec validation zod
- [ ] Animations framer-motion
- [ ] Analytics Vercel trackent
- [ ] Dev HMR fonctionne
- [ ] Build production démarre

### Vérification Post-Installation
```bash
# Vérifier qu'aucune dépendance cassée
pnpm list

# Vérifier conflits peer dependencies
pnpm why <package>

# Taille node_modules (devrait réduire légèrement)
du -sh node_modules
```

## 📝 Notes d'Implémentation

### Ordre d'Exécution Recommandé

**Phase 1:** Clean-up dépendances obsolètes ✅
1. ✅ Supprimer yaml-js du package.json (FAIT)
2. ✅ Exécuter `pnpm install` pour nettoyer node_modules (FAIT)
3. Commit: "🗑️ remove yaml-js (duplicate of js-yaml) + ⬆️ update patch dependencies"

**Phase 2:** Mises à jour patches (Option 1) - Sûr ✅
1. ✅ Exécuter commande update patches (FAIT - 8 packages mis à jour)
2. ✅ Validation complète (typecheck + check + build) (FAIT - tous passés)
3. Commit: "⬆️ update patch dependencies"

**Phase 3:** Mises à jour mineures (Option 2) - Optionnel
1. Exécuter commande update minors
2. Tests manuels requis
3. Commit: "⬆️ update minor dependencies (React Router, i18next, zod)"

**Phase 4:** Recherche fichiers obsolètes
1. Exécuter scripts de détection
2. Analyser manuellement résultats
3. Supprimer fichiers confirmés obsolètes
4. Commit: "🧹 remove obsolete files"

### Rollback Plan

**Si problème après update:**
```bash
# Retour package.json + lock
git checkout HEAD -- package.json pnpm-lock.yaml

# Réinstaller versions précédentes
pnpm install

# Ou rollback commit complet
git revert <commit-hash>
```

### Documentation Post-Completion

**À mettre à jour:**
- [ ] `_bmad-output/planning-artifacts/bmm-workflow-status.yaml` - Marquer dependencies-cleanup comme complété
- [ ] Documenter décisions de différer majors (React 19, Panda v1, etc.)
- [ ] Noter pour refonte navigation: supprimer @shadow-panda après migration NavigationMenu

## 🎯 Recommandation Finale

**Pour l'instant:** **Option 1 (Sécuritaire)**
- Rapide, sûr, pas de breaking changes
- Maintient la stabilité avant refonte UI
- yaml-js déjà supprimé, reste juste `pnpm install` + patches

**Plus tard (après refonte UI):**
- Réévaluer React 19 (quand écosystème stabilisé)
- Migrer Panda CSS v0 → v1 (breaking changes)
- Vite 7 + Vitest 4 ensemble
- Biome v2 avec nouvelles règles

**Après refonte navigation:**
- Migrer NavigationMenu Radix → Ark UI
- Supprimer @shadow-panda/* complètement

## 🔗 Références

- [React Router 7 Changelog](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md)
- [Panda CSS v1 Migration Guide](https://panda-css.com/docs/migration/v1)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Vite 7 Migration](https://vite.dev/guide/migration)

---

## 🔍 Review Notes

### Adversarial Code Review
- **Review Type:** Adversarial review (general)
- **Findings:** 25 total identified
- **Critical/Valid Findings:** 5 addressed
- **Resolution Approach:** Auto-fix critical findings

### Critical Findings Addressed:
1. ✅ **F1 (CRITICAL):** Changes committed to git - Commit `bfd88e7` "⬆️ upgrade dependencies"
2. ✅ **F2 (HIGH):** Tech-spec file committed with changes
3. ✅ **F3 (HIGH):** Workflow status updated in commit
4. ✅ **F4 (MEDIUM):** Peer dependencies verified - 2 known warnings documented (to keep temporarily)
5. ✅ **F5 (LOW):** Phase 3-4 decision documented - Deferred until after UI refactor

### Other Findings (20):
- Classified as noise, suggestions, or non-critical improvements
- Notable suggestions for future work:
  - Bundle size comparison before/after
  - Detailed changelog reviews for each dependency
  - Manual testing documentation
  - Rollback plan testing

### Validation Summary:
- ✅ TypeScript: PASS
- ✅ Biome Lint: PASS (155 files checked)
- ✅ Build Production: PASS
- ✅ Peer Dependencies: Documented warnings acceptable

### Decision on Phase 3-4:
**DEFERRED** - Les mises à jour mineures (Phase 3) et le nettoyage de fichiers (Phase 4) sont reportées jusqu'après la refonte UI, comme recommandé dans le tech-spec. Raisons:
- Phase 1-2 (Option Sécuritaire) accomplie avec succès
- Phase 3 nécessiterait tests manuels étendus
- Meilleure fenêtre pour Phase 3-4 = après stabilisation refonte UI

---

**Status:** Completed & Committed
**Commit:** `bfd88e7` - ⬆️ upgrade dependencies
**Next Step:** Phase 3-4 optionnelles à réévaluer après refonte UI
**Created:** 2026-01-09
**Last Updated:** 2026-01-10 (Review completed)
**Completed By:** Claude (Sonnet 4.5) via quick-dev workflow
**Reviewed By:** Claude (Sonnet 4.5) via adversarial review task
