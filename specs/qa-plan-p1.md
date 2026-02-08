# QA P1 — Plan QFX

## Contexte

Retours QA client sur la migration P1. ~28 items restants apres stories 17-19. Priorisation : bugs → polish → contenu → features. Assets (logos, photos) fournis separement.

---

## Phase 1 — Bugs (5 items)

### N2. URL YouTube (XS)
- `app/utils/url.ts:23` — changer `@ocobo` → `@Ocobo-Revenue`
- `app/components/Footer.tsx:157` — deja correct, mais utiliser `url.youtube` au lieu du hardcode

### N3. Navbar z-index au scroll (M)
- `app/components/navbar/nav-item-with-dropdown.tsx:78` — dropdown `zIndex: 200` trop bas
- Passer a `zIndex: 1001` (au-dessus du navbar container qui est a 1000)

### N1. Navbar radius + gap (S)
- `app/components/navbar/navbar.tsx` — verifier `rounded: '3xl'` en etat scrolled, ajuster gap entre items et CTA/toggle
- Besoin de comparer visuellement avec le prototype pour les valeurs exactes

### O2. Pyramide bullets manquants en mobile (S)
- `app/components/offer/symptoms-section.tsx` — la vue mobile (cards) utilise `slice(0, 1)` → ne montre que le 1er bullet
- Retirer le `slice(0, 1)` ou ajuster pour afficher tous les bullets en mobile

### M1. Animation rond tourne autour du hero (S)
- `app/components/method/attio-pillars-illustration.tsx:333` — cercle avec `animation: 'spin-slow'`
- Manque `transformOrigin: 'center'` ou `transformOrigin: '250px 250px'` (centre du SVG viewBox 500x500)

---

## Phase 2 — Polish global (items transversaux)

### G1. Marges globales (S)
- `app/components/ui/Container.tsx` — changer :
  - `maxW` default : `7xl` (1280px) → `70rem` (1120px)
  - `px` : `{ base: '4', sm: '6', lg: '8' }` → `8` (2rem fixe)
  - `narrow` maxW : `5xl` → ajuster proportionnellement si besoin

### G2. Selection texte en jaune (XS)
- `preset/global-css.ts` — ajouter :
  ```
  '::selection': { backgroundColor: 'yellow', color: 'dark' }
  ```

### G3. Blog en cyan dans dropdown Ressources (XS)
- `app/hooks/useMenuItems.ts` — item `blog` (l.111-117) : changer `color: 'coral'` → `color: 'sky'`

---

## Phase 3 — Polish par page

### Home page

**H1. Polices trop petites** (S) — cas par cas sur les descriptions/mentions :
- Identifier les `fontSize: 'sm'` ou `'xs'` dans `app/components/home/` et augmenter d'un cran
- Specifiquement les sous-titres gris et les descriptions de blocs

**H3. Badge "Notre mission"** (XS)
- Composant mission section dans `app/components/home/` — uniformiser le badge : fond opaque + police noire (utiliser `badge({ variant: 'mint' })` ou ajuster)

**H4. Badges 3 blocs DESIGN/OPERATE/GROW** (S)
- Rationaliser les badges dans les 3 cartes offre sur la home
- Augmenter la police des titres couleur
- S'applique aussi a la page Offre (O4 = meme fix)

### Page Offre

**O1. Hero badge + bouton** (S)
- `app/components/offer/hero-section.tsx` — uniformiser le badge, reduire largeur bouton (`maxW` ou `width: 'auto'`), ajouter icone fleche (ArrowRight de lucide)

**O3. Textes gris trop petits** (S)
- Parcourir `app/components/offer/` — augmenter les `fontSize` des textes gris (descriptions, sous-titres)

### Page Methode

**M2. Polices textes gris** (S)
- `app/components/method/` — augmenter `fontSize` sur les descriptions

**M3. Taille cartes trop grandes** (S)
- Reduire padding/max-width des cartes phases dans `app/components/method/`

**M4. Police livrables + bordure couleur** (S)
- Augmenter fontSize des livrables cle
- Verifier que la `borderTop` de chaque carte utilise la bonne couleur de phase

**M5. Bowtie : police + masquer mobile + titre** (M)
- Augmenter toutes les polices du bowtie SVG
- Ajouter `display: { base: 'none', md: 'block' }` sur le conteneur bowtie
- Ajouter titre "Quelques exemples d'activites" en dessous

### Page A propos

**A2. Taille phrases niveau 3** (XS)
- `app/components/about/` — augmenter fontSize des headings h3

**A4. Bloc CTA fond jaune** (XS)
- `app/routes/_main.($lang).about-us.tsx` — changer `CtaSection variant` en `"yellow"`

---

## Phase 4 — Contenu (textes fournis)

**O5. Titre GROW → "Animation RevOps (RUN)"** (XS)
- `locales/fr/offer.json` — mettre a jour le titre de la 3e phase

**O7. Bloc Methode : reecrire textes** (S)
- `locales/fr/offer.json` — remplacer intro, contenu cartes, texte sous cartes par la copie fournie dans le doc QA (`QA/migration-p1/P1 2fe3e6cbc84580f496fce06a422d4a43.md`)

**O9. Bloc "Ce que ca implique" : ajouter livrables** (M)
- `locales/fr/offer.json` — ajouter les livrables (Livrable:...) a chaque item
- Adapter le composant implications pour afficher les livrables

**O10. Bloc "Pourquoi choisir" : reecrire** (S)
- `locales/fr/offer.json` — remplacer par la copie fournie

**M6. Entreprises entre parentheses** (XS)
- `locales/fr/method.json` — changer "(TheFork, Spendesk, Yousign, Qonto, etc.)" — supprimer "Payfit"

---

## Phase 5 — Features (quand assets dispo)

**H2. Section citations complete** (L) — BLOQUE sur assets
- Ajouter toutes les citations actuelles + photos/logos clients/partenaires/membres
- Revoir design "quote jaune"
- Augmenter police "DECOUVRIR NOS STORIES"

**H5. Bouton "Decouvrez le RevOps Studio →"** (XS)
- `app/components/home/` — ajouter NavLink sous les blocs comparaison, lien vers `/studio`

**H6. Section tech home** (M)
- Ajouter logos outils, augmenter police, bouton "Nos solutions partenaires →", completer phrase "Notre role..."

**O6. Sous-titres + logos outils + logos equipe** (M) — BLOQUE sur assets
- Augmenter sous-titres gris, ajouter logos, remplacer noms entreprises par logos

**O8. Hover jaune cartes methode + lien** (S)
- Ajouter hover jaune sur les cartes
- Ajouter sous-titre "THE REVENUE EXPERIENCE SYSTEM" + bouton "Decouvrir" → `/method`

**A1. Photos founders** (S)
- `app/components/about/` — ajouter photos founders dans le composant team

**A3. Bloc reassurance "Pourquoi nous choisir ?"** (M)
- Nouveau composant dans `app/components/about/`
- Animation scroll (meme pattern que les 3 blocs offre)
- Copie fournie dans le doc QA

---

## Verification

Apres chaque phase :
1. `pnpm check && pnpm typecheck` — zero errors
2. Test visuel sur chaque page modifiee
3. Test responsive (mobile/desktop)
4. Commit par phase
