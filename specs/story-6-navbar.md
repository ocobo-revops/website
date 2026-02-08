# Story 6: Migrate Navbar from prototype

> Part of [Plan A](./prd-migration-plan-a.md) — Feature #6

## Summary

Replace Radix NavigationMenu navbar with Ark UI Menu + Dialog. Port prototype's morphing scroll behaviour, rich dropdown items, and full-screen mobile menu.

## Key differences: prototype vs current

| Aspect | Current | Target |
|--------|---------|--------|
| Desktop dropdowns | Radix NavigationMenu | Ark UI `Menu` |
| Mobile | Accordion in portal overlay | Ark UI `Dialog` full-screen |
| Scroll | Hide on down, show on up | Morph: transparent → rounded pill with blur |
| Logo | Fixed size | Scales with scroll |
| Nav width | Static container | Narrows on scroll (7xl → 5xl) |
| Dropdown content | Title only | Icon + title + description |

## Adaptation notes

- Prototype uses `ocobo.yellow` → our tokens are just `yellow`, `coral`, `mint`, `sky`
- Prototype uses `Link` → we need `NavLink` + `useLocalizedPathname` for i18n
- Prototype uses hardcoded FR strings → wire to `t()` from `common` namespace
- Prototype uses its own `Button` → use existing legacy `button` recipe
- Prototype uses `gray.50`–`gray.500` — we only have `gray` + `gray.light` → extend tokens
- Keep `--main-header-height` CSS vars — used by `LayoutPost.tsx`, `ScrollProgressBar.tsx`
- Prototype has dark page detection for `/podcast` — keep but gate behind feature flag

## Data layer: `useMenuItems.ts`

Extend sub-items with `icon` (lucide component name), `description` (i18n key), `isExternal`. New nav structure from prototype:

- **Notre Offre** (direct link, no dropdown)
- **Méthode** (dropdown): RES framework, Technologie, RevOps Studio
- **Success Stories** (direct link)
- **À propos** (dropdown): Qui sommes-nous, Nous rejoindre
- **Ressources** (dropdown): Podcast, YouTube, Librairie, Modern Revenue Club

Add i18n keys for new descriptions to `common.json`.

## File plan

### New files

- `app/components/navbar/navbar.tsx` — main exported component
- `app/components/navbar/nav-dropdown-item.tsx` — rich dropdown item (icon + label + desc)
- `app/components/navbar/nav-item-with-dropdown.tsx` — desktop Ark Menu wrapper
- `app/components/navbar/mobile-menu.tsx` — Ark Dialog mobile full-screen
- `app/components/navbar/use-navbar-scroll.ts` — scroll threshold hook
- `app/components/navbar/types.ts` — shared types
- `app/components/navbar/styles.ts` — icon/hover colour style maps

### Modified files

- `app/hooks/useMenuItems.ts` — restructure for prototype nav + add icon/description/isExternal
- `app/components/LayoutMain.tsx` — replace Header/MobileMenuProvider/MainMobileMenu → Navbar
- `locales/{fr,en}/common.json` — add description keys for dropdown items
- `preset/tokens/colors.ts` — extend gray scale (50, 100, 400, 500)
- `preset/global-vars.ts` — update header height to match prototype (128px → `h: 32`)

### Delete after migration

- `app/components/Header.tsx`
- `app/components/MainMenu.tsx`
- `app/components/MainMobileMenu.tsx`
- `app/components/MobileMenu.tsx`
- `app/components/SubMenu.tsx`
- `app/components/ui/NavigationMenu.tsx`
- `preset/slot-recipes/navigation-menu.ts`
- Possibly remove `@radix-ui/react-navigation-menu` from deps

## Implementation order

1. Extend gray tokens in `preset/tokens/colors.ts`
2. Add missing i18n description keys to `common.json` (both locales)
3. Create `types.ts` + `styles.ts`
4. Create `use-navbar-scroll.ts`
5. Restructure `useMenuItems.ts`
6. Create `nav-dropdown-item.tsx`
7. Create `nav-item-with-dropdown.tsx`
8. Create `mobile-menu.tsx`
9. Create `navbar.tsx`
10. Update `LayoutMain.tsx`
11. Delete old navbar files + slot recipe
12. Check if `@radix-ui/react-navigation-menu` can be removed
13. `pnpm check && pnpm typecheck`

## Decisions

1. **Gray scale**: extend with `gray.50/100/400/500` ✓
2. **`fontFamily: 'display'`**: already exists (Bermia) ✓
3. **Logo**: keep local `/logo-ocobo.png`, add white variant locally if needed ✓
4. **Spinner**: keep navigation loading spinner ✓

## Verification

- `pnpm check && pnpm typecheck`
- `pnpm dev:local` — navbar renders, dropdowns work, mobile menu works
- Scroll: transparent at top → morphs to rounded pill with blur
- Feature-flagged items (technology, studio, podcasts, jobs) hidden
- All nav strings localised via `t()`

## Reference

- Prototype source: `prototype/components/Navbar.tsx` (743 lines)
