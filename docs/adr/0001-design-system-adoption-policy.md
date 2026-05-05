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

## Known intentional inline exceptions

These files retain `fontFamily: 'display'` or other inline patterns and are explicitly excluded from this policy:

| File | Reason |
|------|--------|
| `app/components/method/unified-bowtie.tsx` | SVG `<text>` elements — recipe `className` values break SVG presentation attributes |
| `app/components/method/attio-pillars-illustration.tsx` | SVG `<text>` elements — same reason as above |
| `app/components/Footer.tsx` | Shared component out of scope for this migration; to be addressed in a follow-up |
| `app/components/PageMarkdownContainer.tsx` | Shared component out of scope for this migration; to be addressed in a follow-up |
| `app/components/navbar/mobile-menu.tsx` | Shared component out of scope for this migration; to be addressed in a follow-up |

---

## Consequences

- `@ocobo/styled-system/recipes` no longer exports `icon`, `link`, or `subtitle`.
- The six live recipes (`badge`, `button`, `card`, `iconBox`, `section`, `text`) are the canonical DS surface.
- 9 remaining non-excepted `fontFamily: 'display'` inline occurrences (in `offer/`, `jobs/`, `routes/contact`) should be migrated in a follow-up pass.
- Component inventory (`docs/development/component-inventory.md`) is the authoritative recipe reference.
