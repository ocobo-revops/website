# Technical Plan: Job Offers List & Detail Pages

## Overview
Add job offers functionality following the existing blog/stories pattern with support for:
- List page with offer cards (title, contract type, location, experience, education)
- Detail page with sidebar (properties) and main content (markdown)
- Dual-source content fetching (GitHub repository or local filesystem)
- i18n support (French/English)

---

## Phase 1: Branch Setup

**Task 1.1: Create and checkout new branch**
```bash
git checkout -b offers
```

✅ **Status:** COMPLETED

---

## Phase 2: Schema & Type Definitions

**Task 2.1: Define Offer Frontmatter Schema**

**File:** `app/modules/schemas.ts`

Add the following schema:
```typescript
export const OfferFrontmatterSchema = z.object({
  title: CommonSchemas.nonEmptyString,
  description: CommonSchemas.nonEmptyString,
  contractType: CommonSchemas.nonEmptyString, // CDI, CDD, Freelance, etc.
  location: CommonSchemas.nonEmptyString,
  experience: CommonSchemas.nonEmptyString, // Junior, Mid-level, Senior
  education: CommonSchemas.nonEmptyString, // Bac+3, Bac+5, etc.
  department: CommonSchemas.nonEmptyString.optional(),
  salary: CommonSchemas.nonEmptyString.optional(),
  tags: CommonSchemas.stringArray,
  date: CommonSchemas.dateString,
});

export type OfferFrontmatter = z.infer<typeof OfferFrontmatterSchema>;
```

Add to `SchemaRegistry`:
```typescript
export const SchemaRegistry = {
  story: StoryFrontmatterSchema,
  blogpost: BlogpostFrontmatterSchema,
  page: PageFrontmatterSchema,
  offer: OfferFrontmatterSchema, // Add this line
} as const;
```

---

## Phase 3: Content Fetching Module

**Task 3.1: Create Offer Fetcher**

**File:** `app/modules/content/api.ts`

Add validator to `ContentValidators`:
```typescript
export const ContentValidators = {
  blogpost: createFrontmatterValidator(SchemaRegistry.blogpost),
  story: createFrontmatterValidator(SchemaRegistry.story),
  page: createFrontmatterValidator(SchemaRegistry.page),
  offer: createFrontmatterValidator(SchemaRegistry.offer), // Add this
} as const;
```

Add `OfferFetcher` class:
```typescript
export class OfferFetcher extends GenericContentFetcher {
  async fetchOffer(path: string, slug: string = '') {
    return this.fetchSingle(path, slug, ContentValidators.offer);
  }

  async fetchOffers(path: string) {
    return this.fetchMultiple(path, ContentValidators.offer);
  }
}

export const offerFetcher = new OfferFetcher();
```

**Task 3.2: Export Convenience Functions**

**File:** `app/modules/content/index.ts`

Add exports:
```typescript
export async function fetchOffer(slug = '', language = 'fr') {
  const path = `offers/${language}`;
  return offerFetcher.fetchOffer(path, slug);
}

export async function fetchOffers(language = 'fr') {
  const path = `offers/${language}`;
  return offerFetcher.fetchOffers(path);
}
```

---

## Phase 4: Cache Configuration

**Task 4.1: Add Offer Cache Strategy**

**File:** `app/modules/cache.ts`

Update `CacheStrategy` type:
```typescript
export type CacheStrategy = 'blogPost' | 'story' | 'offer' | 'static';
```

Add cache config:
```typescript
const CACHE_CONFIG = {
  blogPost: { maxAge: 3600, staleWhileRevalidate: 86400 },
  story: { maxAge: 3600, staleWhileRevalidate: 86400 },
  offer: { maxAge: 3600, staleWhileRevalidate: 86400 }, // Add this
  static: { maxAge: 86400, staleWhileRevalidate: 604800 },
};
```

---

## Phase 5: URL Helpers

**Task 5.1: Add Offers URL**

**File:** `app/utils/url.ts`

Add offers URL:
```typescript
export const url = {
  home: '/',
  blog: '/blog',
  clients: '/clients',
  contact: '/contact',
  offers: '/offers', // Add this
} as const;
```

---

## Phase 6: Routes

**Task 6.1: Create Offers List Page**

**File:** `app/routes/_main.offers._index.tsx`

```typescript
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';
import { data } from 'react-router';
import { createHybridLoader } from '~/modules/cache';
import { fetchOffers } from '~/modules/content';
import { OfferList } from '~/components/offers/OfferList';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const language = getLang(params);
    const [status, _state, offerData] = await fetchOffers(language);

    if (status !== 200 || !offerData) {
      return data({ offers: [], isError: true });
    }

    // Sort by date (newest first)
    const offers = offerData
      .map((entry) => ({
        ...entry,
        _sortDate: new Date(entry.frontmatter.date).getTime(),
      }))
      .sort((a, b) => b._sortDate - a._sortDate)
      .map(({ _sortDate, ...entry }) => entry);

    return data({ offers, isError: false });
  },
  'offer',
);

export const meta: MetaFunction<typeof loader> = ({ params }) => {
  return getMetaTags({
    title: 'Offres d\'emploi',
    description: 'Rejoignez notre équipe',
    locale: getLang(params),
  });
};

export default function OffersIndex() {
  const { offers, isError } = useLoaderData<typeof loader>();

  if (isError) {
    return <div>Error loading offers</div>;
  }

  return <OfferList items={offers} />;
}
```

**Task 6.2: Create Offer Detail Page**

**File:** `app/routes/_main.offers.$slug.tsx`

```typescript
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';
import { data } from 'react-router';
import { createHybridLoader } from '~/modules/cache';
import { fetchOffer } from '~/modules/content';
import { OfferArticle } from '~/components/offers/OfferArticle';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const { slug } = params;
    const language = getLang(params);

    if (!slug) {
      throw new Response('Not Found', { status: 404 });
    }

    const [status, _state, offer] = await fetchOffer(slug, language);

    if (status !== 200 || !offer) {
      throw new Response('Not Found', { status: 404 });
    }

    return data(
      { offer },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
          Vary: 'Accept-Language',
        },
      },
    );
  },
  'offer',
);

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  return getMetaTags({
    title: data?.offer.frontmatter.title,
    description: data?.offer.frontmatter.description,
    locale: getLang(params),
  });
};

export default function OfferDetail() {
  const { offer } = useLoaderData<typeof loader>();
  return <OfferArticle offer={offer} />;
}
```

---

## Phase 7: Components

**Task 7.1: Create Offers Component Directory**

Create: `app/components/offers/`

**Task 7.2: Create OfferList Component**

**File:** `app/components/offers/OfferList.tsx`

```typescript
import type { MarkdocFile } from '~/types';
import type { OfferFrontmatter } from '~/modules/schemas';
import { OfferItem } from './OfferItem';
import { css } from '@ocobo/styled-system/css';

interface OfferListProps {
  items: MarkdocFile<OfferFrontmatter>[];
}

export function OfferList({ items }: OfferListProps) {
  if (items.length === 0) {
    return (
      <div className={css({ padding: '4', textAlign: 'center' })}>
        <p>Aucune offre disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1', md: '2' },
        gap: '6',
        padding: '4',
      })}
    >
      {items.map((item, index) => (
        <OfferItem
          key={item.slug}
          item={item.frontmatter}
          slug={item.slug}
          index={index}
        />
      ))}
    </div>
  );
}
```

**Task 7.3: Create OfferItem Component**

**File:** `app/components/offers/OfferItem.tsx`

```typescript
import { NavLink } from 'react-router';
import type { OfferFrontmatter } from '~/modules/schemas';
import { css } from '@ocobo/styled-system/css';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

interface OfferItemProps {
  item: OfferFrontmatter;
  slug: string;
  index: number;
}

export function OfferItem({ item, slug }: OfferItemProps) {
  const getLocalizedPath = useLocalizedPathname();

  return (
    <article
      className={css({
        border: '1px solid',
        borderColor: 'gray.200',
        borderRadius: 'md',
        padding: '6',
        transition: 'all 0.2s',
        _hover: { borderColor: 'blue.500', boxShadow: 'md' },
      })}
    >
      <h2 className={css({ fontSize: 'xl', fontWeight: 'bold', marginBottom: '4' })}>
        {item.title}
      </h2>

      <div className={css({ display: 'flex', flexDirection: 'column', gap: '2', marginBottom: '4' })}>
        <div className={css({ display: 'flex', gap: '2' })}>
          <span className={css({ fontWeight: 'semibold' })}>Type:</span>
          <span>{item.contractType}</span>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          <span className={css({ fontWeight: 'semibold' })}>Localisation:</span>
          <span>{item.location}</span>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          <span className={css({ fontWeight: 'semibold' })}>Expérience:</span>
          <span>{item.experience}</span>
        </div>
        <div className={css({ display: 'flex', gap: '2' })}>
          <span className={css({ fontWeight: 'semibold' })}>Formation:</span>
          <span>{item.education}</span>
        </div>
      </div>

      <NavLink
        to={getLocalizedPath(`${url.offers}/${slug}`)}
        className={css({
          display: 'inline-block',
          color: 'blue.600',
          fontWeight: 'medium',
          _hover: { textDecoration: 'underline' },
        })}
      >
        Voir l'offre →
      </NavLink>
    </article>
  );
}
```

**Task 7.4: Create OfferArticle Component**

**File:** `app/components/offers/OfferArticle.tsx`

```typescript
import type { MarkdocFile } from '~/types';
import type { OfferFrontmatter } from '~/modules/schemas';
import { LayoutPost } from '~/components/LayoutPost';
import { OfferHeader } from './OfferHeader';
import { OfferSidebar } from './OfferSidebar';
import { OfferContent } from './OfferContent';

interface OfferArticleProps {
  offer: MarkdocFile<OfferFrontmatter>;
}

export function OfferArticle({ offer }: OfferArticleProps) {
  return (
    <LayoutPost.Root>
      <LayoutPost.Aside>
        <OfferSidebar frontmatter={offer.frontmatter} />
      </LayoutPost.Aside>
      <LayoutPost.Main>
        <OfferHeader frontmatter={offer.frontmatter} />
        <OfferContent content={offer.content} />
      </LayoutPost.Main>
    </LayoutPost.Root>
  );
}
```

**Task 7.5: Create OfferHeader Component**

**File:** `app/components/offers/OfferHeader.tsx`

```typescript
import type { OfferFrontmatter } from '~/modules/schemas';
import { css } from '@ocobo/styled-system/css';

interface OfferHeaderProps {
  frontmatter: OfferFrontmatter;
}

export function OfferHeader({ frontmatter }: OfferHeaderProps) {
  return (
    <header className={css({ marginBottom: '8' })}>
      <h1 className={css({ fontSize: '3xl', fontWeight: 'bold', marginBottom: '4' })}>
        {frontmatter.title}
      </h1>
      <p className={css({ fontSize: 'lg', color: 'gray.600' })}>
        {frontmatter.description}
      </p>
    </header>
  );
}
```

**Task 7.6: Create OfferSidebar Component**

**File:** `app/components/offers/OfferSidebar.tsx`

```typescript
import type { OfferFrontmatter } from '~/modules/schemas';
import { css } from '@ocobo/styled-system/css';

interface OfferSidebarProps {
  frontmatter: OfferFrontmatter;
}

export function OfferSidebar({ frontmatter }: OfferSidebarProps) {
  return (
    <aside className={css({ position: 'sticky', top: '4' })}>
      <div className={css({ backgroundColor: 'gray.50', padding: '6', borderRadius: 'md' })}>
        <h3 className={css({ fontSize: 'lg', fontWeight: 'bold', marginBottom: '4' })}>
          Détails du poste
        </h3>

        <div className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
          <div>
            <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>Type de contrat</div>
            <div>{frontmatter.contractType}</div>
          </div>

          <div>
            <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>Localisation</div>
            <div>{frontmatter.location}</div>
          </div>

          <div>
            <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>Expérience</div>
            <div>{frontmatter.experience}</div>
          </div>

          <div>
            <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>Formation</div>
            <div>{frontmatter.education}</div>
          </div>

          {frontmatter.department && (
            <div>
              <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>Département</div>
              <div>{frontmatter.department}</div>
            </div>
          )}

          {frontmatter.salary && (
            <div>
              <div className={css({ fontWeight: 'semibold', marginBottom: '1' })}>Salaire</div>
              <div>{frontmatter.salary}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
```

**Task 7.7: Create OfferContent Component**

**File:** `app/components/offers/OfferContent.tsx`

```typescript
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import { css } from '@ocobo/styled-system/css';

interface OfferContentProps {
  content: string;
}

export function OfferContent({ content }: OfferContentProps) {
  const ast = Markdoc.parse(content);
  const transformed = Markdoc.transform(ast);
  const renderedContent = Markdoc.renderers.react(transformed, React);

  return (
    <div
      className={css({
        '& h2': { fontSize: '2xl', fontWeight: 'bold', marginTop: '8', marginBottom: '4' },
        '& h3': { fontSize: 'xl', fontWeight: 'bold', marginTop: '6', marginBottom: '3' },
        '& p': { marginBottom: '4', lineHeight: '1.7' },
        '& ul, & ol': { marginLeft: '6', marginBottom: '4' },
        '& li': { marginBottom: '2' },
      })}
    >
      {renderedContent}
    </div>
  );
}
```

---

## Phase 8: Content Structure

**Task 8.1: Create Sample Markdown Files**

For **local filesystem** testing, create:
- `~/projects/ocobo-posts/offers/fr/senior-developer.md`
- `~/projects/ocobo-posts/offers/en/senior-developer.md`

For **GitHub repository**, create:
- `offers/fr/senior-developer.md`
- `offers/en/senior-developer.md`

**Sample Markdown Structure:**

```markdown
---
title: "Développeur Full-Stack Senior"
description: "Rejoignez notre équipe pour construire des solutions innovantes"
contractType: "CDI"
location: "Paris, France"
experience: "5+ ans"
education: "Bac+5 en informatique"
department: "Ingénierie"
salary: "60k-80k €"
tags: ["javascript", "react", "node"]
date: "2025-11-06"
---

## Description du poste

Nous recherchons un développeur full-stack expérimenté...

## Responsabilités

- Développer et maintenir des applications web
- Collaborer avec l'équipe produit
- Participer aux revues de code

## Profil recherché

- Maîtrise de React et Node.js
- Expérience avec TypeScript
- Bonnes compétences en communication
```

---

## Phase 9: Testing Checklist

- [ ] **List page**: Visit `/offers` to see offer cards
- [ ] **Detail page**: Click on an offer to view details
- [ ] **i18n**: Test `/en/offers` for English version
- [ ] **Local filesystem**: Test with `pnpm dev:local`
- [ ] **GitHub source**: Test with `pnpm dev:github`
- [ ] **Responsive**: Test mobile/desktop layouts
- [ ] **404 handling**: Test invalid slug `/offers/non-existent`

---

## Phase 10: Commit & Push

**Task 10.1: Commit changes**
```bash
git add .
git commit -m "feat: add job offers list and detail pages"
```

**Task 10.2: Push to branch**
```bash
git push -u origin offers
```

---

## File Summary

### Files to Create:
1. `app/routes/_main.offers._index.tsx` - List route
2. `app/routes/_main.offers.$slug.tsx` - Detail route
3. `app/components/offers/OfferList.tsx`
4. `app/components/offers/OfferItem.tsx`
5. `app/components/offers/OfferArticle.tsx`
6. `app/components/offers/OfferHeader.tsx`
7. `app/components/offers/OfferSidebar.tsx`
8. `app/components/offers/OfferContent.tsx`

### Files to Modify:
1. `app/modules/schemas.ts` - Add schema
2. `app/modules/content/api.ts` - Add fetcher
3. `app/modules/content/index.ts` - Export functions
4. `app/modules/cache.ts` - Add cache strategy
5. `app/utils/url.ts` - Add URL

### Content Files to Create (external):
- `offers/fr/*.md`
- `offers/en/*.md`

---

## Architecture Notes

### Content Fetching Pattern
The system uses a generic content fetching abstraction that supports both GitHub API and local filesystem sources:

```typescript
// Generic pattern used for all content types
export class GenericContentFetcher {
  async fetchSingle<T>(path, slug, validator): Promise<ContentResult<MarkdocFile<T>>>
  async fetchMultiple<T>(path, validator): Promise<ContentResult<MarkdocFile<T>[]>>
}
```

Content source is determined by the `CONTENT_SOURCE` environment variable:
- `CONTENT_SOURCE=github` - Fetches from GitHub repository
- `CONTENT_SOURCE=locale` - Fetches from local filesystem (`~/projects/ocobo-posts/`)

### Routing Pattern
Routes follow the Remix/React Router v7 file-based routing convention:
- `_main.offers._index.tsx` - List page at `/offers`
- `_main.offers.$slug.tsx` - Detail page at `/offers/{slug}`
- Routes support optional `($lang)` parameter for internationalization

### Component Architecture
Components follow the existing pattern with separation of concerns:
- **List components**: Grid layout with individual item cards
- **Detail components**: Use `LayoutPost` for responsive sidebar + main content layout
- **Styling**: Panda CSS with type-safe CSS-in-JS

### Internationalization
Content is organized by language in the content source:
- French content: `offers/fr/`
- English content: `offers/en/`

URLs follow the pattern:
- `/offers` - French (default)
- `/en/offers` - English

---

## Implementation Status

- [x] Branch created: `offers`
- [x] Plan documented in repository
- [ ] Schema and types defined
- [ ] Content fetching module created
- [ ] Cache configuration updated
- [ ] Routes implemented
- [ ] Components created
- [ ] Sample content added
- [ ] Testing completed

---

## Notes

- No design/styling considerations (minimal CSS using Panda)
- Follows exact patterns from blog/stories implementation
- Ready for local manual testing immediately after implementation
- Can switch between local and GitHub content sources via env variable
- All file paths are absolute for easy reference
- Type-safe throughout with Zod validation for frontmatter
