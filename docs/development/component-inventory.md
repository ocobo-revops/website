# Component Inventory - OCOBO Website

*Generated: 2026-01-08*
*Part: main*
*Type: React Router v7 Web Application*

## Component Overview

The OCOBO website implements a comprehensive component library built on Ark UI primitives with custom styling via Panda CSS. Components are organized by function and reusability, following atomic design principles.

## Base UI Components (`app/components/ui/`)

### Form Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Button** | `Button.tsx` | Primary action buttons with variants | Ark UI factory, Panda recipes |
| **IconButton** | `IconButton.tsx` | Icon-only buttons | Button component, Lucide icons |
| **Input** | `Input.tsx` | Text input fields with validation | Panda styling |
| **Label** | `Label.tsx` | Form field labels | Accessibility support |
| **Select** | `Select.tsx` | Dropdown selection component | Ark UI Select |

### Layout Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Container** | `Container.tsx` | Content width container | Panda patterns |
| **Card** | `Card.tsx` | Content cards and panels | Panda styling |
| **Carousel** | `Carousel.tsx` | Image/content carousel | react-snap-carousel |

### Navigation Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **NavigationMenu** | `NavigationMenu.tsx` | Main navigation menu | Radix NavigationMenu (not yet migrated) |
| **Breadcrumb** | `Breadcrumb.tsx` | Navigation breadcrumbs | Custom implementation |

### Interactive Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Accordion** | `Accordion.tsx` | Expandable content sections | Ark UI Accordion |
| **ScrollArea** | `ScrollArea.tsx` | Custom scrollable areas | Ark UI ScrollArea |
| **DotButton** | `DotButton.tsx` | Carousel navigation dots | Custom styling |
| **DotPagination** | `DotPagination.tsx` | Pagination indicator | Custom implementation |
| **FlipCard** | `flip-card.tsx` | Fixed-height card that turns over with its button, a tap or a mouse hover; the hidden face is `inert` | `flipCard` slot recipe |

### Display Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Avatar** | `Avatar.tsx` | User profile images | Image handling |
| **Tag** | `Tag.tsx` | Content tags and labels (blog chip, keeps its own style) | Panda styling |
| **Eyebrow** | `eyebrow.tsx` | `label` text variant, optional 7px coloured dot (`dotColor`) | `text` recipe |
| **Illustration** | `Illustration.tsx` | SVG illustrations | Custom wrapper |
| **Logocobo** | `Logocobo.tsx` | Company logo component | SVG assets |

### Feedback Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Loader** | `Loader.tsx` | Loading states | SVG animations |
| **Spinner** | `Spinner.tsx` | Inline loading indicator | CSS animations |
| **ScrollProgressBar** | `ScrollProgressBar.tsx` | Reading progress indicator | Scroll events |

## Feature-Specific Components

### Homepage Components (`app/components/home/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **HeroSection** | `hero-section.tsx` | Homepage hero section | Homepage-specific |
| **SocialProofSection** | `social-proof-section.tsx` | Client marquee + testimonial | Homepage-specific |
| **PainPointSection** | `pain-point-section.tsx` | RevOps pain point + mission | Homepage-specific |
| **TransformationSection** | `transformation-section.tsx` | System vs tools + method summary | Homepage-specific |
| **InterventionsSection** | `interventions-section.tsx` | Interventions cards | Homepage-specific |
| **ComparatifSection** | `comparatif-section.tsx` | Ocobo vs others comparison | Homepage-specific |
| **StackSection** | `stack-section.tsx` | Partner stack grid | Homepage-specific |
| **CtaSection** | `cta-section.tsx` | Bottom CTA | Reusable with props |
| **ClientMarquee** | `client-marquee.tsx` | Animated client list | Homepage-specific |
| **TestimonialCard** | `testimonial-card.tsx` | Testimonial block | Homepage-specific |
| **FeatureCard** | `feature-card.tsx` | Icon + label cards | Reusable |
| **HeroSplit** | `hero-split.tsx` | Hero layout split | Reusable |
| **FlexPair** | `flex-pair.tsx` | Icon + content rows | Reusable |
| **ModularStackGrid** | `modular-stack-grid.tsx` | Tech stack grid | Reusable |
| **DashboardIllustration** | `dashboard-illustration.tsx` | Hero illustration | Homepage-specific |

### Offer Components (`app/components/offer/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **HeroSection** | `hero-section.tsx` | Offer hero section | Offer-specific |
| **ArchitecturalGrid** | `architectural-grid.tsx` | Hero illustration grid | Offer-specific |
| **SymptomsSection** | `symptoms-section.tsx` | Growth symptoms + pyramid | Offer-specific |
| **PyramidSection** | `pyramid-section.tsx` | Symptoms pyramid graphic | Offer-specific |
| **TransitionSection** | `transition-section.tsx` | RevOps transition highlights | Offer-specific |
| **OffersDetailSection** | `offers-detail-section.tsx` | Offer phases + deliverables | Offer-specific |
| **LeviersSection** | `leviers-section.tsx` | Growth levers cards | Offer-specific |
| **MethodeSection** | `methode-section.tsx` | 4-step method overview | Offer-specific |
| **ImplicationsSection** | `implications-section.tsx` | Concrete RevOps actions | Offer-specific |
| **WhyOcoboSection** | `why-ocobo-section.tsx` | Reasons to choose Ocobo | Offer-specific |
| **CtaSection** | `cta-section.tsx` | Offer CTA | Reusable with props |
| **SectionHeader** | `section-header.tsx` | Offer section header | Reusable |

### Method Components (`app/components/method/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **HeroSection** | `hero-section.tsx` | Method hero section | Method-specific |
| **AttioPillarsIllustration** | `attio-pillars-illustration.tsx` | Method hero illustration | Method-specific |
| **PillarsSection** | `pillars-section.tsx` | 4 pillars overview | Method-specific |
| **PillarCard** | `pillar-card.tsx` | Pillar detail card | Reusable |
| **ScopeSection** | `scope-section.tsx` | Scope + diagram | Method-specific |
| **UnifiedBowtie** | `unified-bowtie.tsx` | Revenue scope diagram | Method-specific |
| **ScopeCard** | `scope-card.tsx` | Scope detail card | Reusable |

### About Components (`app/components/about/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **HeroSection** | `hero-section.tsx` | About hero section | About-specific |
| **DataIllustration** | `data-illustration.tsx` | About hero illustration | About-specific |
| **ManifestoSection** | `manifesto-section.tsx` | Manifesto content | About-specific |
| **TeamSection** | `team-section.tsx` | Founding team section | About-specific |
| **TeamMemberCard** | `team-member-card.tsx` | Team profile card | Reusable |
| **ValuesSection** | `values-section.tsx` | Values grid | About-specific |
| **ValueCard** | `value-card.tsx` | Values card | Reusable |

### Member Components (`app/components/member/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **MemberCard** | `member-card.tsx` | Profile card: avatar, role, bio, LinkedIn (jobs, blog author) | Reusable |
| **PersonCard** | `person-card.tsx` | Person variant of `FlipCard`: photo, role and challenge label, then contribution or bio, tools (with a limit) and previous companies | Reusable |

### Legacy Homepage Components (`app/components/homepage/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **Hero** | `Hero.tsx` | Legacy homepage hero section | Deprecated |
| **Better** | `Better.tsx` | Legacy "Better" value proposition | Deprecated |
| **Faster** | `Faster.tsx` | Legacy "Faster" value proposition | Deprecated |
| **Stronger** | `Stronger.tsx` | Legacy "Stronger" value proposition | Deprecated |
| **Aligned** | `Aligned.tsx` | Legacy "Aligned" value proposition | Deprecated |
| **Contact** | `Contact.tsx` | Legacy contact CTA section | Deprecated |
| **Stories** | `Stories.tsx` | Legacy client stories showcase | Deprecated |
| **Tools** | `Tools.tsx` | Legacy tools/integrations display | Deprecated |

### Blog Components (`app/components/blog/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **BlogList** | `BlogList.tsx` | Blog posts listing | Blog-specific |
| **BlogItem** | `BlogItem.tsx` | Individual blog post card | Reusable for articles |
| **BlogArticle** | `BlogArticle.tsx` | Full blog post display | Blog-specific |
| **PostHeader** | `PostHeader.tsx` | Article header section | Reusable for content |
| **PostMetas** | `PostMetas.tsx` | Article metadata display | Reusable for content |

### Client Stories Components (`app/components/stories/`)

*Updated 2026-02-04: Migrated to new design system with card styling, `fontFamily: 'display'` headings, and i18n empty states.*

| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **Hero** | `Hero.tsx` | Stories page hero with display font | Stories-specific |
| **StoryList** | `StoryList.tsx` | Client stories grid with i18n empty state | Stories-specific |
| **StoryItem** | `StoryItem.tsx` | Story card with shadow, rounded corners, hover | Reusable |
| **StoryArticle** | `StoryArticle.tsx` | Full story display | Stories-specific |
| **StoryHeader** | `StoryHeader.tsx` | Story header with display font | Reusable for content |
| **StoryMetas** | `StoryMetas.tsx` | Story metadata panel | Reusable for content |
| **StoryDeliverables** | `StoryDeliverables.tsx` | Deliverables section | Stories-specific |
| **StorySpeaker** | `StorySpeaker.tsx` | Speaker with display font | Reusable |
| **StoryMarkdownContainer** | `StoryMarkdownContainer.tsx` | Content wrapper | Reusable |

### Projects Components (`app/components/projects/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **Hero** | `Hero.tsx` | Projects page hero | Projects-specific |
| **Card** | `Card.tsx` | Project cards | Reusable |
| **Contact** | `Contact.tsx` | Projects contact CTA | Reusable |
| **Levers*** | `Levers*.tsx` | Revenue operations levers | Projects-specific |
| **Team** | `Team.tsx` | Team showcase | Reusable |
| **SubSection** | `SubSection.tsx` | Content subsections | Reusable |

### Strategy Components (`app/components/strategy/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **Hero** | `Hero.tsx` | Strategy page hero | Strategy-specific |
| **Choose** | `Choose.tsx` | Strategy selection | Strategy-specific |
| **Method*** | `Method*.tsx` | Methodology components | Strategy-specific |
| **Needs** | `Needs.tsx` | Needs assessment | Reusable |
| **Team** | `Team.tsx` | Team presentation | Reusable |

### Challenge page components (`app/components/challenges/`)
Sections of the challenge page (`app/routes/_main.($lang).challenges.$slug.tsx`). The route builds the view model with `buildChallengePage` (`app/modules/challenge-page.ts`), which drops mockup placeholders (`[...]`, rule in `docs/architecture/two-repo-content-pipeline.md`) and returns `null` for a section with no content. The page root sets `colorPalette` to the challenge colour (`challenge-palette.ts`); the sections read `colorPalette` and `colorPalette.light`.

The sections fed by cross-references (client case, experts) get their view models from `buildChallengeReferenceSections` (`app/modules/challenge-reference-sections.ts`). The loader returns only that output, plus the resolved partner for the partner block. "Other challenges" reads the navbar list of the `_main` layout through `useOtherChallenges` (`app/hooks/use-challenge-menu.ts`), with no fetch of its own.

Shared pieces:
- `challenge-pill.ts`: the challenge pill class per key, used by the hero and the other challenges.
- `challengeFill` in `challenge-palette.ts`: the solid fill per challenge (white text on Revenue Systems, coral for Revenue AI, as ADR 0002 sets). The pill and `PersonCard` (`app/components/member/person-card.tsx`) use it.

| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **ChallengeHero** | `challenge-hero.tsx` | Colour pill, title, quote, lead, CTA to the diagnostic, bow tie with the active stages | Challenge-specific |
| **ChallengeSymptoms** | `challenge-symptoms.tsx` | Symptom cards with coral bullets | Challenge-specific |
| **ChallengeAudience** | `challenge-audience.tsx` | Teams, roles and benefit, on the light challenge colour | Challenge-specific |
| **ChallengeClientCase** | `challenge-client-case.tsx` | Case headline, summary, metric cards and the link to the Story; one column without metrics | Challenge-specific |
| **ChallengeExperts** | `challenge-experts.tsx` | Expert cards (`PersonCard`) of the Team members on the challenge | Challenge-specific |
| **ChallengeDiagnostic** | `challenge-diagnostic.tsx` | Yellow closing block with the contact CTA (`#diagnostic`) | Challenge-specific |
| **ChallengeOtherChallenges** | `challenge-other-challenges.tsx` | Pills to the other challenges, from the navbar list | Challenge-specific |

### Design system showcase (`app/components/design-system/`)
One `*-section.tsx` module per `/design-system` section, each wrapped in `ShowcaseSection` (`showcase-section.tsx`), whose heading carries an anchor id derived from its title. The registry `designSystemGroups` in `subpages.ts` lists the pages in three groups (foundations, components, patterns) and each page's section titles. It feeds the sidebar (`design-system-sidebar.tsx`) and the grouped index (`design-system._index.tsx`). The sidebar lists the current page's sections under its link when the page has more than one, from `lg`. `app/routes/design-system.tsx` is the layout: one sidebar, then the page title and `Outlet`. Each page is a route `design-system.<slug>.tsx` that only composes its section modules. A new showcase section is a new module, its title in the registry and one line in its page route.

## Layout Components (Root Level)

### Application Layout
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **LayoutMain** | `LayoutMain.tsx` | Main application layout | All public pages |
| **LayoutPost** | `LayoutPost.tsx` | Blog/story layout | Content pages |
| **Header** | `Header.tsx` | Global site header | All pages |
| **Footer** | `Footer.tsx` | Global site footer | All pages |

### Navigation Components
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **MainMenu** | `MainMenu.tsx` | Desktop navigation | Header component |
| **MainMobileMenu** | `MainMobileMenu.tsx` | Mobile navigation | Header component |
| **MobileMenu** | `MobileMenu.tsx` | Mobile menu wrapper | Mobile layouts |
| **SubMenu** | `SubMenu.tsx` | Secondary navigation | Contextual |
| **LanguageSwitcher** | `LanguageSwitcher.tsx` | Language toggle | Header component |

## Content Components

### Content Processing
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **MarkdowContainer** | `MarkdowContainer.tsx` | Markdown content wrapper | Blog posts |
| **PageMarkdownContainer** | `PageMarkdownContainer.tsx` | Page content wrapper | Static pages |

### Media Components
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **PlayerYoutube** | `PlayerYoutube.tsx` | YouTube video player | Content embeds |
| **ClientCarousel** | `ClientCarousel.tsx` | Client showcase carousel | Homepage, stories |
| **ToolCarousel** | `ToolCarousel.tsx` | Tools/integrations carousel | Homepage |

## Form Components

### Contact Forms
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **ContactForm** | `ContactForm.tsx` | Main contact form | Contact page |
| **IntContactForm** | `IntContactForm.tsx` | International contact form | Localized contact |
| **NewsletterForm** | `NewsletterForm.tsx` | Newsletter subscription | Footer, CTAs |

### Form Support
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **ErrorMessage** | `ErrorMessage.tsx` | Form error display | All forms |

## Icon Components

### Custom Icons
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **Arrow** | `icons/Arrow.tsx` | Directional arrows | Navigation, CTAs |

## Component Categories by Reusability

### Highly Reusable (Design System)
- All `ui/` components
- Layout components (LayoutMain, Header, Footer)
- Content wrappers (MarkdownContainer, etc.)
- Form components (ContactForm patterns)

### Moderately Reusable (Feature Components)
- Card components (BlogItem, StoryItem)
- Hero variations (can be templated)
- Team showcase components
- Contact CTA sections

### Page-Specific (Limited Reusability)
- Homepage value proposition components
- Strategy methodology components
- Specific levers components
- Page-specific hero components

## Design System Recipes

Active Panda CSS recipes - use these before reaching for inline `css()`.

| Recipe | File | Description |
|--------|------|-------------|
| `badge` | [`preset/recipes/badge.ts`](../../preset/recipes/badge.ts) | Inline pill label: colour variants (`yellow`, `mint`, `sky`, `coral`, `ai` for AI content only), sizes `xs`/`sm`/`lg` |
| `button` | [`preset/recipes/button.ts`](../../preset/recipes/button.ts) | Button styles: variants (`primary`, `solid`, `outline`, `secondary`, `link`, `white`, `cta`, `nav`), sizes `sm`/`md`/`lg`; JSX-scanned on `ButtonLink` |
| `card` | [`preset/recipes/card.ts`](../../preset/recipes/card.ts) | Bordered card surface (v2: `line` border, 28px padding, `rest` shadow). Tone `white`/`tinted`, padding `sm`/`md`/`lg`/`xl`, radius `md` (M 16px) / `lg` (L 24px), shadow `none`/`sm`/`card`/`elevated`, border toggle |
| `iconBox` | [`preset/recipes/icon-box.ts`](../../preset/recipes/icon-box.ts) | Centred icon container - sizes `sm` (2rem) / `md` (2.5rem) / `xl` (3.5rem) / `lg` (4rem), variants `solid`/`outline`/`ghost`, colour tokens |
| `section` | [`preset/recipes/section.ts`](../../preset/recipes/section.ts) | Page section background and vertical padding: `bg` tokens, padding `sm`, `md` (v2 compact, 80px) and `lg` (v2 standard, 112px from 1024px) |
| `text` | [`preset/recipes/text.ts`](../../preset/recipes/text.ts) | v2 type scale (ADR 0002). Use the six kept names: `display-xl` (Display), `display-lg` (H2), `display-md-bold` (H3), `body`, `small`, `label`. The other names (`display-2xl`, `display-lg-bold`, `display-section`, `display-sm`, `display-heading`, `display-md`, `display-card`, `subtitle`, `display-label`) are aliases with the same values, deleted in J6. Colour variants unchanged |

### Design system v2 tokens

Defined in `preset/tokens/` and `preset/semantic-tokens.ts`, shown on `/design-system/tokens`, `/design-system/colours` and `/design-system/typography`. ADR 0002 has the full mapping from older names.

| Group | Tokens to use |
|-------|---------------|
| Greys | `gray` (#71717A, muted text), `gray.light`, `gray.50` to `gray.700` (zinc), `line` (#ECECEE hairline) |
| Challenge colours | `challenge.rp`, `challenge.se`, `challenge.sc`, `challenge.cx`, `challenge.sy`, `challenge.ai`, each with `.light` tint |
| Gradients | `gradients.ai` (decoration, `bgGradient`), `gradients.ai-text` (`textGradient`, display and H2 only). AI content only |
| Radii | `lg` (S 8px), `2xl` (M 16px), `3xl` (L 24px), `full` |
| Shadows | `rest`, `hover`, `window`; `offset` is the one named exception |
| Font sizes | `display`, `h2`, `h3` (24px), `body` (17px), `sm` (14px), `caption` (13px), `label` (11px), `micro` (10px) |
| Letter spacings | `label` (.3em), `tag` (.16em), `chip` (.08em) |
| Line heights | `heading` (1.05), `body` (1.6) |
| Easing | `smooth` (`cubic-bezier(.2,.8,.2,1)`) |

### Section composition pattern

The canonical pattern for page sections: `section()` recipe on the `<section>` element + `<Container>` inside for max-width and horizontal padding.

**Before (inline `css()`):**
```tsx
<div className={css({
  maxW: '7xl',
  mx: 'auto',
  px: { base: '4', sm: '6', lg: '8' },
  py: '24',
  bg: 'gray.light',
})}>
  {children}
</div>
```

**After (recipe + `<Container>`):**
```tsx
<section className={section({ bg: 'gray', padding: 'lg' })}>
  <Container>
    {children}
  </Container>
</section>
```

`<Container>` handles `maxW: '70rem', mx: 'auto', px: '8'`. Use `narrow` prop for narrower content columns (`maxW: '56rem'`).

### Card usage pattern

All bordered card surfaces use the `card()` recipe. Do not write inline `rounded` + `border` + `shadow` combinations.

```tsx
// Default card (white, line border, rest shadow, padding md 28px, radius md 16px)
<div className={card()}>...</div>

// Tinted background
<div className={card({ tone: 'tinted' })}>...</div>

// No border, shadow only
<div className={card({ border: false })}>...</div>

// Large padding and radius
<div className={card({ padding: 'lg', radius: 'lg' })}>...</div>
```

### Recipes vs inline `css()` - decision rules

- **Use a recipe** when the component already has a matching recipe (check the table above). Don't reinvent what the DS owns.
- **Use `css()` for overrides only** - extra properties beyond what the recipe covers (e.g. `shadow`, `_groupHover`, `transition`).
- **Never duplicate recipe props inline** - if `iconBox({ size: 'xl' })` already sets `w`, `h`, and `rounded`, don't repeat them in a sibling `css()` call.
- **Static values only in `css()`** - Panda CSS extracts classes at build time; dynamic values won't generate. Pre-compute per-variant class strings with `css()` and combine at runtime with `cx()`.
- **Propose a recipe addition** when you see the same three-or-more `css()` properties repeated across two or more unrelated components.

## Design System Integration

### Panda CSS Recipes Used

Six live recipes (see table above): `badge`, `button`, `card`, `iconBox`, `section`, `text`. Their values follow ADR 0002 (design system v2) since J1 (#216). The `_legacy/` folder (`icon`, `link`, `subtitle`, `button`) was deleted in issue #94. See `docs/adr/0001-design-system-adoption-policy.md`.

### Ark UI Components
- **Accordion**: Expandable content sections
- **Select**: Form dropdowns
- **ScrollArea**: Custom scrollbars
- **Button**: Via `ark.button` factory

### Radix UI (remaining)
- **NavigationMenu**: Main site navigation (not yet migrated)
- **react-context**: Context utility used by Card, MobileMenu

## Component Dependencies

### External Dependencies
- `@ark-ui/react`: UI primitives (primary)
- `@radix-ui/react-navigation-menu`: Navigation (pending migration)
- `@radix-ui/react-context`: Context utility
- `lucide-react`: Icon library
- `react-snap-carousel`: Carousel functionality
- `framer-motion`: Animations

### Internal Dependencies
- Panda CSS recipes and patterns
- Custom hooks (useMenuItems, useWindowSize)
- Utility functions (metatags, labels)
- Internationalization (useTranslation)

## Component Standards

### File Organization
- One component per file
- Index files for category exports
- Co-located styles via Panda CSS
- TypeScript interfaces for props

### Naming Conventions
- PascalCase for component names
- Descriptive, domain-specific names
- Consistent naming across similar components
- Clear distinction between layout and content components

### Accessibility Features
- Ark UI provides accessible primitives
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Semantic HTML structure

This component inventory provides a comprehensive overview of the OCOBO website's component architecture, supporting maintainable development and consistent user experience across all pages.
