# ADR 0001 — Design system adoption policy

**Date:** 2026-05-05
**Status:** Accepted
**Deciders:** Jerome Boileux
**Related issues:** #81, #86–#94

---

## Context

The Panda CSS recipe system (`preset/recipes/`) was introduced but adoption was inconsistent. Before migration (#86–#94) the audit found:

- 111 `fontFamily: 'display'` inline occurrences instead of `text()` recipe
- 0 call sites for `iconBox` and `section` recipes despite 20+ imports
- `_legacy/` recipes (`icon`, `link`, `subtitle`, `button`) surviving in `preset/recipes/_legacy/` with a mix of active and stale callers

Issues #86–#94 migrated all in-scope components. Issue #94 (this ADR) finalises the closing pass:
- deleted `app/components/AsideCard.tsx` (no remaining importers)
- deleted `preset/recipes/_legacy/` (4 files: `icon.ts`, `link.ts`, `subtitle.ts`, `button.ts`)
- migrated all `icon` recipe callers to inline `css()` token equivalents
- migrated `link` recipe caller in `design-system.tsx` showcase

---

## Decision

### Typography rule

All display typography goes through the `text()` recipe. Do not write `fontFamily: 'display'` inline in `css()` calls outside `preset/recipes/`.

```tsx
// Bad
<h2 className={css({ fontFamily: 'display', fontSize: '3xl', fontWeight: 'bold' })}>

// Good
<h2 className={text({ variant: 'display-lg-bold' })}>
```

Available `text()` variants: `display-2xl`, `display-lg`, `display-lg-bold`, `display-section`, `display-sm`, `display-md`, `display-md-bold`, `display-heading`, `display-card`, `display-label`, `subtitle`, `body`, `label`.

**Variant naming convention for paired sizes:** some sizes come in two weights. The base name (`display-lg`, `display-md`, `display-sm`) uses `fontWeight: 'black'` — the heaviest display weight. The `-bold` suffix (`display-lg-bold`, `display-md-bold`) uses `fontWeight: 'bold'`. When choosing a paired variant, pick `-bold` for softer heading contexts (form labels, section subtitles) and the base for maximum-impact headlines. `display-xl` breaks this pattern (it uses `bold`, not `black`) because no black variant is needed at that size — treat it as a named exception.

### Sectioning rule

All page sections use `<section className={section()}>` wrapping `<Container>`. Do not write inline `maxW: '7xl'` / `mx: 'auto'` container patterns.

```tsx
// Bad
<div className={css({ maxW: '7xl', mx: 'auto', px: { base: '4', sm: '6' }, py: '24' })}>

// Good
<section className={section({ bg: 'gray', padding: 'lg' })}>
  <Container>{children}</Container>
</section>
```

### Card rule

All bordered card surfaces use the `card()` recipe. Do not write inline combinations of `rounded` + `border` + `shadow`.

```tsx
// Bad
<div className={css({ rounded: '2xl', borderWidth: '1px', borderColor: 'gray.100', shadow: 'sm' })}>

// Good
<div className={card()}>
```

### Legacy recipes

`preset/recipes/_legacy/` is deleted. The `icon`, `link`, and `subtitle` recipes no longer exist in the design system. Reintroducing a legacy-style recipe (single-concern, no variants, no DS ownership) requires a new ADR.

Replacing legacy `icon` recipe: map to token-equivalent `css()` calls:

| Was | Now |
|-----|-----|
| `icon({ size: 'xl' })` | `css({ h: '8', w: '8' })` |
| `icon({ size: 'lg' })` | `css({ h: '6', w: '6' })` |
| `icon({ size: 'md' })` | `css({ h: '4', w: '4' })` |
| `icon({ size: 'sm' })` | `css({ h: '2', w: '2' })` |
| `icon({ dimmed: true })` | `css({ opacity: '0.5' })` |

### No lint guardrail

Enforcement is at review time only (option C, logged during triage of #81). A Biome/ESLint rule banning `fontFamily: 'display'` outside `preset/` was considered but deferred — reviewer checks are sufficient at current team size.

---

## Known inline exceptions

### Permanent exceptions

These files retain `fontFamily: 'display'` for a structural reason that cannot be resolved with recipes:

| File | Reason |
|------|--------|
| `app/components/method/unified-bowtie.tsx` | SVG `<text>` elements — recipe `className` values break SVG presentation attributes |
| `app/components/method/attio-pillars-illustration.tsx` | SVG `<text>` elements — same reason as above |

### Shared component follow-up

These shared/layout components were out of scope for the #86–#93 per-feature migration. They retain inline `fontFamily: 'display'` and should be addressed in a follow-up issue:

| File | Occurrences | Note |
|------|-------------|------|
| `app/components/PageMarkdownContainer.tsx` | 4 | Markdown renderer headings |
| `app/components/Footer.tsx` | 1 | Footer heading |
| `app/components/navbar/mobile-menu.tsx` | 1 | Mobile nav heading |

### Deferred per-feature occurrences

These component files were migrated in #86–#91 but retain a small number of inline occurrences that had no matching `text` variant (size or weight outside the current scale) or were in contexts where recipe substitution caused visual regressions. Each occurrence is a candidate for a targeted follow-up:

| File | Occurrences | Context |
|------|-------------|---------|
| `app/components/offer/pyramid-section.tsx` | 4 | Numbered circle labels at non-standard sizes |
| `app/components/offer/offers-detail-section.tsx` | 1 | Service number badge |
| `app/components/offer/symptoms-section.tsx` | 1 | Symptom card number |
| `app/components/jobs/about-ocobo-section.tsx` | 1 | h5 at `fontSize: lg` — no `text` variant at this size |
| `app/components/jobs/detail/scrollspy-toc.tsx` | 1 | Nav label at `fontSize: xs` — too small for display variants |

Running `grep -rn "fontFamily.*display" app/ --include="*.tsx"` should return only the files listed in the two tables above. Any hit outside these tables is a policy violation.

---

## Consequences

- `@ocobo/styled-system/recipes` no longer exports `icon`, `link`, or `subtitle`.
- The six live recipes (`badge`, `button`, `card`, `iconBox`, `section`, `text`) are the canonical DS surface.
- Component inventory (`docs/development/component-inventory.md`) is the authoritative recipe reference.
- Follow-up scope: 6 deferred per-feature occurrences + 3 shared component files (see tables above).
