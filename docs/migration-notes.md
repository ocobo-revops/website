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

### Story 8: Home page migration learnings

- **Panda token extraction needs literal values:** Dynamic token strings (e.g. computed `bg`/`border` values) can fail to emit styles. Prefer static `css()` mappings for tokenized variants.
- **Prototype base styles matter for parity:** The prototype’s `globals.css` sets body font smoothing and heading defaults (Bermia 900 + tight tracking). Reintroducing these in `app/index.css` brought typography back in line.
- **Container sizing drift is easy to miss:** The prototype `Container` uses `maxW: 7xl` (and `5xl` for `narrow`), while the website used custom `mobile/desktop` sizes. Aligning these was required to match layout rhythm.
- **Dot background scale affects perceived spacing:** The dot pattern size (40px/30px) meaningfully changes the visual density; parity requires matching those exact values.
- **Feature flags should guard CTAs too:** Studio/Technology CTAs on the homepage need to respect `isPageEnabled` to avoid linking to disabled pages.

### Story 9: Offer page migration learnings

- **Group hover needs a `.group` parent:** `_groupHover` styles won’t trigger unless the parent has the `group` class; add it to card links.
- **Nested i18n structures should be explicit:** Use `returnObjects: true` for arrays (`logoRows`, `tags`, `pyramid`) and model optional shapes in the component to avoid rigid layouts.
- **Redirects should preserve locale:** Use `redirectWithLocale` then redirect to `/${lang}/offer` for legacy routes.
- **Orion/WebKit sizing quirks:** Fixed-size elements styled with `center()` can stretch to full width; use `center({ inline: true })` + `flexShrink: 0` to enforce dimensions.
- **writing-mode fallback:** `writing-mode` + `transform` is unreliable in Orion; add a `@supports not (writing-mode: vertical-rl)` fallback that uses `rotate(-90deg)` with `writingMode: horizontal-tb`.
