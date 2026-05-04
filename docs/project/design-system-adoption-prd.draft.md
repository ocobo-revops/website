# Design System Adoption — Pre-PRD (draft)

> **Status** : draft, en attente du merge de `feature/jobs-pocock` pour raffinement
> **Branche cible** : `refactor/design-system-adoption` (à créer)
> **Auteur** : audit auto, mai 2026
> **Source** : audit Explore basé sur le brief `project_ds_audit.md`

---

## 1. Problème

Les recipes Panda du DS ne sont pas adoptées. Chaque feature recrée les mêmes patterns inline via `css({...})`, ce qui produit :

- **Incohérence visuelle** — `mb` entre sections, dimensions d'icon-box, rondeurs de cards divergent feature à feature
- **Coût de maintenance** — un changement de typo display = 111 fichiers à toucher
- **Rebuild duplicate CSS** — ~4.3 KB minified de styles redondants
- **Onboarding bruité** — un nouveau contributeur copie le pattern inline du fichier d'à côté plutôt que la recipe

### Constatations chiffrées (audit branche `feature/jobs-pocock`)

| Indicateur | Valeur | Conformité |
|------------|-------:|-----------|
| Imports recipe `text` | 0 | ❌ jamais adopté |
| Imports recipe `iconBox` | 0 | ❌ jamais adopté |
| Imports recipe `section` | 20 | ⚠️ importé, **0 call site** |
| Imports recipe `badge` | 11 | ✅ 13 call sites |
| Adoption `<Container>` (composant) | 67 sites | ✅ adopté |
| Pattern `fontFamily: 'display'` inline | 111 occurrences | À migrer vers `text()` |
| Pattern `borderWidth: 1px` + `gray.100` | 46 occurrences | Candidat `Card` |
| Pattern `rounded: 2xl/3xl` + `bg: white` + `shadow: sm` | 34 occurrences | Candidat `Card` ou `iconBox` |

### Top fichiers non-conformes

`offer/pyramid-section.tsx` (8), `method/unified-bowtie.tsx` (6), `home/pain-point-section.tsx` (4+), `PageMarkdownContainer.tsx` (4), `method/attio-pillars-illustration.tsx` (4), `jobs/hero-section.tsx` (3+4), `home/testimonial-card.tsx` (3+2), `jobs/detail/header.tsx` (3 MetaPill), `technology/partner-card.tsx` (3), `studio/team-photo-illustration.tsx` (5).

### Distribution par feature

| Feature | Total inline | Effort refacto |
|---------|-------------:|----------------|
| offer | 41 | High |
| jobs | 41 | High (déjà reviewé) |
| home | 35 | Medium |
| method | 21 | Medium |
| about | 15 | Low |
| blog/technology/studio/stories | 13 cumulé | Low |

---

## 2. Pourquoi `section` est imported-but-unused

L'audit révèle un signal fort de **DX cassée** : 20 imports, 0 call. Hypothèse : la recipe expose `bg` + `padding` mais les call sites ont aussi besoin de `maxW: 7xl` + `mx: auto` + `px: {base, sm, lg}` (layout container). Tant que `section()` ne couvre pas ce besoin, il faut composer avec `<Container>` — et la friction fait basculer les devs vers du `css({...})` direct.

**Décision à prendre** dans le PRD : enrichir `section` recipe (ajouter une variante `contained` qui inline le layout container) **OU** documenter qu'il faut utiliser `<section className={section()}><Container>...</Container></section>`.

---

## 3. Objectifs

1. **Adoption** des recipes existantes : `text` (0→111 sites), `iconBox` (0→34 sites), `section` (clarifier l'API + 20 sites)
2. **Création** de nouveaux primitifs DS : `Card` recipe, `MetaPill` (recipe ou composant React)
3. **Garde-fous** : règle de lint qui interdit `fontFamily: 'display'` hors `preset/recipes/`
4. **Documentation** : section "DS adoption checklist" dans `docs/development/component-inventory.md`

---

## 4. Non-objectifs

- Réécriture des composants UI déjà adoptés (`<Container>`, `<ButtonLink>`, badge)
- Refacto visuel — l'output rendu doit être pixel-équivalent post-refacto (validation Percy ou capture manuelle par feature)
- Migration vers une autre lib (Tailwind, vanilla-extract) — on reste sur Panda

---

## 5. Périmètre proposé (5 phases)

### Phase 0 — DX foundation (~0.5 j)
- Diagnostiquer pourquoi `section` est unused
- Décision : enrichir recipe avec variante `contained` OU clarifier doc d'usage
- Si enrichissement : ajouter compound variant et ajuster les 20 imports existants

### Phase 1 — Quick wins (~1 j)
- Créer recipe `MetaPill` (3 occurrences confirmées dans `jobs/detail/header.tsx`)
- Créer recipe `iconBox` enrichie si la taille `w: 14` manque (entre md/lg actuels — voir gap signalé dans le brief)
- Lint rule : interdire `fontFamily: 'display'` hors recipes

### Phase 2 — Adoption `text` recipe (~3 j)
Migration des 111 occurrences `fontFamily: 'display'` vers `text({ variant: 'display-X' })`. Ordre :
1. `offer/pyramid-section.tsx` (8)
2. `method/unified-bowtie.tsx` (6)
3. `method/attio-pillars-illustration.tsx` (4)
4. `home/pain-point-section.tsx` (4)
5. `PageMarkdownContainer.tsx` (4)
6. Le reste par feature : home → offer → method → jobs → about

À chaque fichier : remplacer le pattern inline par `<h2 className={text({ variant: 'display-lg' })}>`. Si la valeur ne correspond pas à un variant existant, deux options : ajouter une variant à la recipe OU demander un override explicite (à arbitrer dans le PR).

### Phase 3 — Adoption `iconBox` recipe (~1.5 j)
- 34 occurrences `rounded` patterns → audit lequel relève vraiment de `iconBox` vs `Card`
- Vérifier l'API actuelle (`size: sm/md/lg` = 8/10/16) face aux dimensions trouvées (`w: 14`, etc.)
- Migrer

### Phase 4 — Recipe `Card` (~2 j)
- Créer recipe `Card` couvrant le pattern `rounded: 2xl/3xl` + `borderWidth: 1px` + `borderColor: gray.100` + `bg: white` + `shadow: sm`
- Variants : `padding` (sm/md/lg), `radius` (md/lg), `bordered` (true/false)
- Migrer les 46 occurrences candidates

### Phase 5 — Cleanup & docs (~1 j)
- Mettre à jour `docs/development/component-inventory.md` avec la liste exhaustive des recipes + cas d'usage
- Ajouter une "Recipe-or-inline?" decision tree
- Enregistrer un ADR sur la politique d'adoption DS

**Effort total** : ~9 jours dev équivalent une personne. Parallélisable par feature en Phase 2.

---

## 6. Découpage en issues vertical-slice

Plutôt qu'un méga-PR, une issue par phase + une sous-issue par feature en Phase 2 (offer, method, home, jobs, about). Chaque sous-issue = un PR atomique mergeable indépendamment, validé visuellement.

À reprendre via `/to-issues` quand le PRD est validé.

---

## 7. Risques

| Risque | Mitigation |
|--------|-----------|
| Refacto casse le visuel sur certaines pages | Validation manuelle ou Percy par PR. Diff snapshot en CI à terme |
| Recipes existantes pas assez expressives → forcent à des escape-hatches | Pré-enrichir les recipes (variants additionnels) avant de migrer en masse |
| 111 sites = fatigue refacto | Découpage par feature, ordre par densité, parallélisable |
| Concomitance avec d'autres features qui ajoutent du code inline | Lint rule activée dès Phase 1 pour bloquer la régression |

---

## 8. Métriques de succès

- `grep "fontFamily: 'display'"` hors `preset/recipes/` → **0**
- `grep "borderWidth: '1px'"` + `borderColor: 'gray.100'` hors `preset/recipes/` → **0** ou justifié
- Imports recipe `text` ≥ 50 fichiers
- Imports recipe `iconBox` ≥ 15 fichiers
- Documentation à jour, lint actif

---

## 9. Questions ouvertes

1. **`section` recipe** — enrichir avec variante `contained` ou laisser composer avec `<Container>` ?
2. **`Card`** — recipe Panda pure ou composant React ? (recipe si juste styling, composant si on ajoute des slots — header/body/footer)
3. **`MetaPill`** — recipe ou composant ? (probablement composant car icône + label = composition)
4. **Variantes `text` manquantes** — si le PRD révèle des display-sizes hors `display-xl/lg/md`, on les ajoute ou on force le variant le plus proche ?
5. **Validation visuelle** — Percy/Chromatic ou audit manuel ? Selon le budget temps disponible.
6. **Quand démarrer** — directement après merge de `feature/jobs-pocock`, ou attendre une fenêtre dédiée ?

---

## 10. Sources

- Audit Explore agent (mai 2026, branche `feature/jobs-pocock`)
- Brief mémoire `project_ds_audit.md`
- Recipes : `preset/recipes/{text,section,icon-box,badge,button}.ts`
- Composant : `app/components/ui/container.tsx`
