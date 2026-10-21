# ADR 0002: Design system v2 from the redesign mockup

**Date:** 2026-10-20
**Status:** Draft
**Deciders:** Jerome Boileux
**Amends:** ADR 0001

---

## Context

The redesign mockup (`prototype` repo, audit in `docs/audit-v2.md`) defines a design system block: brand colours, a zinc grey scale, four radii, three shadows, one fluid H2, section paddings, flip cards, tags and an AI gradient. Most tokens already exist in the Panda theme; some contradict ADR 0001. Production stays the source of truth, and pages move to the redesign one at a time.

---

## Decision

### Pages that keep their current style

The offer page, the blog (`librairie` in the mockup) and customer stories (`clients`, `clients-beev`) are not redesigned. The mockup ships them without its design system block. They take the new navbar and the design system tokens, and keep their layout.

### Tokens are aligned on the whole site first

The v2 tokens and type scale apply to every page in J1, the first delivery step, before any page is redesigned. Pages that keep their current style get them at the same time. The changes will show on every page; each one is reviewed and corrected, not avoided. Redesigns then ship page by page on a single system. The changes are reviewed by hand on the Vercel preview of the J1 PR, route by route, in French and English, on desktop and mobile. An automated screenshot comparison would flag every page at once, so it adds nothing here. It does not guard the later page redesigns either (see below). We rejected moving pages to v2 one at a time, which keeps two systems alive for the whole migration, and keeping the old values for the three pages above, which keeps them forever.

### No screenshot comparison guards the redesigns

From J2 to J5, a change to a shared recipe can alter a page that is not being redesigned: the offer page, the blog, customer stories, legal pages and contact. No automated screenshot comparison guards them. The existing e2e smoke test stays as it is: nine checks on the home, the contact page with its HubSpot form, and the English home. It runs in CI and is not a required check. #242 (redesigned home live) updates its home and navbar selectors when it switches the home on. Regressions on the other pages are caught by reviewing them on the Vercel preview of each PR that changes a shared recipe or component. We rejected a screenshot guard on every route, and one on the five pages above only: both need the `posts` content pinned in CI, baselines generated on Linux and maintained through every redesign, for a check that `main` cannot enforce today. We also rejected turning the e2e tests off for the migration: they cost nothing until #242 and they cover the contact page. The choice is reviewed at J6, once the v1 navbar and footer are deleted.

### The `text()` variants keep their names and take v2 values

The v2 scale has five sizes: Display (Bermia 900, 64 to 72px), H2 (Bermia 900, 34 to 48px, one size), H3 (Bornia 700, 24px), Body (Bornia 400, 17px, line height 1.6) and Small (Bornia 500, 14px). The existing variants keep their names and call sites; each takes the values of the closest v2 size. Several names therefore share one size. We rejected new role-named variants, which would mean migrating about 120 call sites.

J1 also picks one existing name per v2 size as the name to keep. Redesigned pages use only those five names, and J6 deletes the other names and migrates their remaining call sites, mostly on the offer page, the blog and stories. We rejected keeping the aliases for good, which leaves a porting agent five names for one style.

The legacy `textStyles` (`heading1` to `heading3`, `large`, `medium`, `small`, `nav`, about twenty call sites) follow the same rule; `heading2` (18 to 32px, weight 400) takes the v2 H2 values.

The `gray` scale becomes zinc throughout. `gray.DEFAULT` and `gray.light` still hold the default Tailwind greys (#767676, #F5F5F5); they take #71717A and #F4F4F5. The zinc steps the mockup uses without a token (#E4E4E7, #D4D4D8, #3F3F46) become `gray.200`, `gray.300` and `gray.700`.

Visible effects across the site: body text drops from weight 500 to 400, card titles (`display-card`) move from Bermia to Bornia, and the muted grey changes from #767676 to #71717A.

### The `section()` and `card()` defaults take v2 values in J1

The `section` recipe's default spacing goes from 96px to the mockup's 112px, and its `md` size becomes the 80px compact spacing. The `card` recipe takes the four v2 radii and the mockup card padding. Every page gets longer by about 16px per section, reviewed with the type changes. We rejected changing the recipe defaults page by page, which keeps two spacing rhythms until the last redesign.

### Four radii and three shadows, behind the existing token names

The v2 scale has four radii plus `full`, and three shadows: rest, hover and window. Production uses eight radius tokens and nine shadow tokens; they keep their names and take the closest v2 value, as the `text()` variants do. When a mockup page is ported, any radius or shadow outside the scale snaps to the nearest token: the mockup writes about 910 radii inline, about 280 of them off its own scale, and those values are export noise. An element that loses its character once snapped gets one more named token, never a raw value. We rejected widening the scale to every value the mockup uses, which drops the rule, and applying the scale to new components only, which keeps two scales.

### The text link is a `button` variant

The mockup has a call to action styled as underlined text, which recreates the `link` recipe that ADR 0001 deleted. It becomes a `link` variant of `button`, next to `primary` and a new `secondary` (light border), so every call to action goes through one recipe. We rejected bringing back the `link` recipe for a single style, and an underline written inline in each component, which is the pattern ADR 0001 forbids. Links inside Markdoc prose are not covered: their style belongs to the text, not to `button`.

### Eyebrows and tags are the `label` text variant

The mockup eyebrow (`.ds-eyebrow`) and tag (`.ds-tag`) are the same uppercase text, the tag adding a 7px coloured dot; neither has a background or a border. Both use `text({ variant: 'label' })` with the v2 values. A small `Eyebrow` component adds the dot when asked. The existing `Tag` component is the blog's lowercase chip on a coloured background; the blog keeps its style, so it stays as it is. We rejected a `tag` recipe, which would put typography outside `text()`, and a `badge` variant, since `badge` carries a background. A tag that becomes clickable, such as a story filter, is a button.

### One flip card recipe; `PersonCard` and `MemberCard` coexist

A `flipCard` slot recipe carries the flip mechanism and its accessibility once, for the home enjeu cards and the person cards alike. `PersonCard` is its `person` variant: photo on the front, contribution on the back. It serves the redesigned pages (team, enjeu pages, about-us). `MemberCard` stays on the blog, stories and job pages, which keep their style, and takes the v2 tokens. We rejected replacing `MemberCard` everywhere, which would restyle the blog and stories, and a separate person recipe, which would copy the flip mechanism.

### The AI gradient is two tokens, reserved for AI topics

The mockup writes its coral to yellow gradient inline 75 times, in 14 variants. Two tokens remain: `gradients.ai` for backgrounds and decoration, and `gradients.ai-text` for gradient text. Every other variant (angles, transparent tints, conic spinner, radial halo) snaps to one of them. Only AI content uses them; review checks this, since no tool can tell what a page is about. We rejected a single token, which leaves gradient text unreadable on light backgrounds, and one token per effect, which widens the scale for decoration.

Neither the mockup gradient nor its darkened text version reaches 3:1 on white at either end (2.0 to 2.8 for coral, 1.5 to 2.2 for yellow). `gradients.ai-text` is therefore darkened until each end reaches 3:1 on white, and gradient text is allowed only at display and H2 sizes. On dark backgrounds `gradients.ai` passes as it is. We rejected keeping the mockup values, which breaks the accessibility rule below, and dropping gradient text on light backgrounds, which removes a recurring brand element.

### Enjeu colours mark identity; coral and yellow keep fixed roles

Each enjeu has one colour, defined once in the website as a semantic token with its light tint: Sales Experience mint, Customer Experience sky, Revenue Performance coral, Sales Compensation yellow, Revenue Systems grey (shade to be confirmed by Ocobo), Revenue AI the AI gradient. It marks identity only: pills, workstream card backs, expert labels, the bow tie. Symptom bullets stay coral and the diagnostic block stays yellow on every enjeu page, as the mockup does on five pages out of six: coral stands for the problem, yellow for Ocobo's call to action. Revenue AI uses coral, the start of its gradient, wherever a solid colour is needed (pills, rings, tints). We rejected colouring every element by enjeu, which would make the Revenue Systems diagnostic grey and would need a solid stand-in for the gradient everywhere.

### Raw values are refused at type check

ADR 0001 relied on review alone, and the mockup writes most of its radii inline. Panda's `strictTokens` is turned on in J1, and `pnpm typecheck` becomes a required CI check (it does not run in CI today). The about 240 raw values in `app/` become tokens, or use Panda's `'[value]'` escape hatch when no token fits. We rejected review alone, which ADR 0001 shows is not enough. If the escape hatch turns out to be the common case rather than the exception, `strictTokens` is turned off again and a CI script checks only raw colours, off-scale radii and shadows, and inline display fonts.

### Accessibility is part of each shared component

FlipCard, PersonCard, Tooltip and Tabs are done only when they work with a keyboard and on touch. The mockup flips cards and shows KPI tooltips on hover only, and its animated tabs have no pause. These components are built once and reused on every page, so fixing them later would reopen every page. Hover does not exist on mobile.

- A flip card flips with a button, not only on hover.
- A tooltip opens on focus and on tap.
- An animation that plays on its own has a pause control.
- Copy that says "Survolez" (hover) gets a wording that also fits touch and keyboard.

---

## Consequences

- J1 is one change to `preset/` that every page sees: v2 values for the `text()` variants, `textStyles`, `section()`, `card()`, radii, shadows and the `gray` scale, plus the five kept variant names.
- New tokens: `colors.line`, `gray.200`, `gray.300`, `gray.700`, `gradients.ai`, `gradients.ai-text`, three shadows, enjeu semantic tokens with their light tints, font sizes 24, 17, 13, 11 and 10px, letter spacings .3em, .16em and .08em, and the `cubic-bezier(.2,.8,.2,1)` easing.
- Recipe changes: `button` gains `secondary` and `link`; `badge` gains an `ai` variant and an `xs` size; a new `flipCard` slot recipe with a `person` variant; a new `Eyebrow` component.
- `strictTokens` is on and `pnpm typecheck` is a required CI check from J1. The about 240 raw values in `app/` are cleaned up in the same step.
- J1 needs a written route checklist (French and English, desktop and mobile) for the manual review on the Vercel preview.
- No screenshot comparison from J2 to J5. The e2e smoke test stays, and #242 updates its selectors. Each PR that changes a shared recipe or component is reviewed on the pages that are not being redesigned.
- J6 deletes the alias variant names, and reviews whether e2e coverage or screenshot comparisons should be added.
- ADR 0001 is outdated on four points: its 96px section example, its "six live recipes" inventory, the deleted `link` recipe (now a `button` variant) and its lack of an automated check. The design system rules in `CLAUDE.md` are updated in J1 to match this ADR.
- Ocobo confirms two visual choices before the pages that use them ship: the Revenue Systems grey, and the darkened gradient text.
- Review checks that the AI gradient appears on AI content only.
