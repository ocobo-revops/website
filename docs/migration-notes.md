# Migration notes

Working document for the `migration-plan-a` branch. Delete after merge.

## Deferred issues

- [ ] XSS: unsanitised env vars (`gaTrackingId`, `agoBasePath`, `agoApiKey`) interpolated into `dangerouslySetInnerHTML` in `app/root.tsx` — validate format before interpolation

## Learnings

- Feature flags: `DISABLED_PAGES` env var is the single source of truth; removed duplicate path through `PrivateEnvVars` after code review caught the dual source

### Story 6: Navbar migration learnings

**Copy first, adapt second:** When porting from prototype, copy code verbatim before making any changes. Diverging on naming (e.g. `title`→`label`, `url`→`path`, `variant`→`color`) creates cognitive overhead and introduces bugs.

**Token naming must match:** The prototype uses `ocobo.*` namespace for colours (`ocobo.yellow`, `ocobo.dark`). Using flat names (`yellow`, `dark`) or `.dark` variants (`yellow.dark`) caused colour mismatches. Added `ocobo.*` tokens to maintain parity.

**Type property names matter:**
- Prototype: `label`, `path`, `color`, `dropdown`
- Initially used: `title`, `url`, `variant`, `subItems`
- This mismatch caused confusion and errors; aligned to prototype naming.

**Browser compatibility:** Orion (WebKit) needed explicit `hstack()` pattern instead of just `display: flex`. The `hstack` pattern sets `flex-direction: row` explicitly which some browsers require.

**Desktop vs mobile labels:** The prototype uses different CTA labels:
- Desktop: "Prendre RDV" (short)
- Mobile: "Prendre rendez-vous" (long)
Requires separate translation keys (`contact.cta` vs `contact.cta.mobile`).

**Font token naming:** Website had `heading` but prototype uses `display`. Both map to Bermia font, but consistency with prototype naming prevents errors. Use `fontFamily: 'display'` not `fontFamily: 'heading'`.

**Colour assignments per dropdown:** Each dropdown item can have a different colour:
- Method: yellow, sky, mint
- Resources: yellow, coral, coral, sky
Don't assume all items in a dropdown share the same colour.

## Ideas / future refactors

- Modern Revenue Club uses custom image icon from HubSpot; consider supporting image icons in DropdownItem type
- Consider removing legacy button recipe once all pages migrated
