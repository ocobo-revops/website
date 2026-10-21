# J1 route review checklist

Review of design system v2 values on every route (issue #216, [ADR 0002](../adr/0002-design-system-v2.md)). Rerun it on the Vercel preview of any later change to `preset/`.

## How to use it

- Open each route on the Vercel preview of the PR.
- Check four views: French desktop (1440px), French mobile (375px), English desktop, English mobile. Blog routes have no English version.
- For each line, tick the views you checked and set **Status** to `accepted` or `fixed (<commit>)`.
- Add a line for any change the list does not predict.

## Expected changes on every route

These come from the preset and show up everywhere. Check them once on Home, then only note exceptions on other routes.

| Change | Status |
|---|---|
| Body text drops from weight 500 to 400 and grows from 16px to 17px, line height 1.6 | |
| H3 variants (`display-md`, `display-md-bold`, `display-card`) move from Bermia to Bornia bold, 24px | |
| H2 variants (`display-lg`, `display-section`, `display-sm`, `display-heading`, `heading1`, `heading2`) take the fluid H2 size (34px to 48px), weight 900 | |
| `display-xl` goes from weight 700 to 900 | |
| `label` takes 11px, .3em letter spacing, uppercase | |
| Muted grey text and borders move to zinc (#71717A, #F4F4F5) | |
| Sections get longer: default padding 112px desktop, 80px tablet, 64px mobile | |
| Cards: 28px padding on mobile, a #ECECEE border and the soft `rest` shadow | |
| Radii snap to 8px, 16px or 24px: `xl` 12px becomes 16px, `sm` and `md` (4px, 6px) become 8px | |
| Shadows snap to rest, hover or window; the hard `offset` shadow is unchanged | |
| Eyebrow letter spacing: .2em becomes .16em (`tag`); .25em, .4em and .6em become .3em (`label`) (#217) | |
| Decorative blurs: 32px and 48px both become 40px (`2xl`) (#217) | |
| Transitions that used `ease` or `ease-in-out` take the Panda default curve, cubic-bezier(0.4, 0, 0.2, 1); durations unchanged (#217) | |
| Transitions written for one or two properties now use the `colors` or `common` preset, which animates a wider property set (team member card, team photo corners, contact inputs and button, design system tokens block) (#217) | |

## Routes

Views legend: FR-D, FR-M, EN-D, EN-M.

### Home (`/`, `/en`)

| Change | Views checked | Status |
|---|---|---|
| Hero display title at weight 900 | | |
| Transformation section: the item with `rounded: 'none'` now has square corners (it was ignored before as invalid CSS) | | |
| Client carousel heading (`heading2`) takes the H2 size | | |
| Section rhythm: each section about 16px taller | | |

### Method (`/method`, `/en/method`)

| Change | Views checked | Status |
|---|---|---|
| Bow tie SVG keeps its inline display font (ADR 0001 exception) | | |
| Scope cards: radius 12px becomes 16px | | |
| Pillar card halo: the 4px ring now renders (it rendered nothing before) (#217) | | |

### Offer (`/offer`, `/en/offer`)

Keeps its style; tokens only.

| Change | Views checked | Status |
|---|---|---|
| Offer detail and architectural grid cards keep the hard `offset` shadow | | |
| Implications and offer detail tiles: radius 12px becomes 16px | | |
| Architectural grid label: .6em letter spacing becomes .3em (#217) | | |
| Leviers: the 500ms transition now applies (the old value was invalid) (#217) | | |

### About us (`/about-us`, `/en/about-us`)

| Change | Views checked | Status |
|---|---|---|
| Reassurance tiles: radius 12px becomes 16px | | |
| Body copy at 17px, weight 400 | | |
| Hero title: line height .9 becomes 1 (#217) | | |
| Data illustration background: #FCFAF5 becomes #FAFAFA (`gray.50`) (#217) | | |

### Studio (`/studio`, `/en/studio`)

| Change | Views checked | Status |
|---|---|---|
| Team member cards: radius 12px becomes 16px, H3 names in Bornia | | |
| Model section tiles: radius 12px becomes 16px | | |
| Team photo hover: contrast and brightness stay, only the grayscale goes (#217) | | |

### Technology (`/technology`, `/en/technology`)

| Change | Views checked | Status |
|---|---|---|
| Partner cards: radius 12px becomes 16px; the logo tile loses its inner shadow | | |
| Partner form: inputs and button with `rounded: 'none'` now have square corners | | |
| Philosophy section tile: radius 12px becomes 16px | | |
| Partner form: the `mint.light` background now renders (the old token name did not resolve) (#217) | | |

### Jobs index and one job (`/jobs`, `/jobs/<slug>`, EN equivalents)

| Change | Views checked | Status |
|---|---|---|
| Job cards: card padding and border | | |
| Job page: Markdoc prose at body size; hiring contact card | | |
| Job page table of contents: .4em eyebrow spacing becomes .3em (#217) | | |

### Clients index and one story (`/clients`, `/clients/<slug>`, EN equivalents)

Keep their style; tokens only.

| Change | Views checked | Status |
|---|---|---|
| Stories illustration keeps the hard `offset` shadow | | |
| Story item and story metas: radius 12px becomes 16px | | |
| Story prose: `heading1` takes the H2 size; `medium` takes the body values | | |
| Clients hero and story header titles: line height .95 becomes 1 (#217) | | |
| Clients carousel text takes the zinc grey #71717A (the old `gray.medium` did not resolve) (#217) | | |

### Blog index and one post (`/blog`, `/blog/<slug>`)

Keep their style; not locale-prefixed, so FR views only.

| Change | Views checked | Status |
|---|---|---|
| Post cards: card padding, border and shadow | | |
| Post prose at body size; author card | | |
| Post card tag: 8px radius (the old radius was invalid, so corners were square) (#217) | | |
| Blog index highlighted post badge: 8px radius (the old `base` radius did not resolve) (#217) | | |

### Contact (`/contact`, `/en/contact`)

| Change | Views checked | Status |
|---|---|---|
| Form inputs: radius and border colour | | |
| Focus rings unchanged (`outline` and `ring` keep their values) | | |
| Hero tiles: radius 12px becomes 16px | | |

### Legal index and one page (`/legal`, `/legal/<slug>`, EN equivalents)

| Change | Views checked | Status |
|---|---|---|
| Markdoc prose: `medium` and `small` text styles take the body and small values | | |
| Breadcrumb in the `small` text style | | |

### Design system (`/design-system`)

| Change | Views checked | Status |
|---|---|---|
| New v2 tokens block: type scale, greys, enjeu colours, AI gradients, radii, shadows, font sizes, letter spacings, easing | | |
| `gradients.ai-text` title readable on white | | |
| Coral border sample now renders (#217) | | |
| Form section: the Select label now targets the Select trigger (#217) | | |

### Not found page (any unknown URL, FR and EN)

| Change | Views checked | Status |
|---|---|---|
| Error boundary heading (`heading2`) takes the H2 size | | |

### Shared chrome (navbar, mobile menu, footer)

| Change | Views checked | Status |
|---|---|---|
| Nav text style keeps line height 1 at body size | | |
| Mobile menu and nav dropdown items: radius 12px becomes 16px | | |
| Navbar width transition: easing becomes `smooth`, cubic-bezier(0.2, 0.8, 0.2, 1) (#217) | | |

## Open points for the reviewer

- `label` keeps .3em letter spacing; mockup eyebrows use .16em (`tag`). Issue #221 decides.
- Revenue Systems grey (#767676) and the darkened AI text gradient wait on Ocobo confirmation.
- The new `text({ variant: 'small' })` has no call site yet.
