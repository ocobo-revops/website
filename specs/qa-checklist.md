# QA P1 — Checklist

## Phase 1 — Bugs

- [x] **N2** YouTube URL `@ocobo` → `@Ocobo-Revenue` + Footer uses `url.youtube`
- [x] **N3** Navbar dropdown z-index 200 → 1001
- [x] **N1** Navbar radius + gap (items gap 1→2, CTA gap 3→4)
- [x] **O2** Pyramid bullets visible on mobile (removed `slice(0,1)`)
- [x] **M1** Circle animation `transformOrigin: '250px 250px'`

## Phase 2 — Global polish

- [x] **G1** Container maxW 70rem, px 2rem fixed, narrow 56rem
- [x] **G2** Text selection yellow
- [x] **G3** Blog dropdown colour coral → sky

## Phase 3 — Polish par page

### Home

- [x] **H1** Font sizes bumped (descriptions, labels, taglines)
- [x] **H3** Badge "Notre mission" — solid mint bg + dark text
- [x] **H4** Badges DESIGN/OPERATE/GROW — title font increased

### Offre

- [x] **O1** Hero CTA — ArrowRight icon added
- [x] **O3** Grey text font sizes bumped (implications, leviers, offers-detail, transition)

### Methode

- [x] **M2** Grey description font sizes bumped
- [x] **M3** Card padding reduced 10→8
- [x] **M4** Deliverable fonts bumped, border colours correct
- [x] **M5** Bowtie: fonts +2, hidden mobile, title "Quelques exemples d'activites" added

### A propos

- [x] **A2** h3 font sizes xl/3xl → 2xl/4xl
- [x] **A4** CTA variant sky → yellow

## Phase 4 — Content

- [x] **O5** Titre GROW → "Animation RevOps (RUN)" in `offer.json`
- [ ] **O7** Bloc Methode: rewrite texts from client copy
- [ ] **O9** Bloc "Ce que ca implique": add deliverables
- [ ] **O10** Bloc "Pourquoi choisir": rewrite from client copy
- [x] **M6** Remove "Payfit" from company list

## Phase 5 — Features (asset-dependent)

- [ ] **H2** Citations section — photos/logos clients (blocked on assets)
- [ ] **H5** Button "Decouvrez le RevOps Studio →" link to `/studio`
- [ ] **H6** Section tech home — tool logos, font, button, phrase
- [ ] **O6** Sous-titres + logos outils + logos equipe (blocked on assets)
- [ ] **O8** Hover jaune cartes methode + link to `/method`
- [ ] **A1** Photos founders (blocked on assets)
- [ ] **A3** Bloc reassurance "Pourquoi nous choisir ?" (new component)

## Final verification

- [ ] `pnpm check && pnpm typecheck` — zero errors
- [ ] `pnpm build` — production build succeeds
- [ ] `pnpm test:coverage` — all tests pass
- [ ] Visual review all 6 pages (FR) at mobile / tablet / desktop
- [ ] i18n: EN fallback renders without errors
