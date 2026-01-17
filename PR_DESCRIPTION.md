# Job Offers Feature - Implementation Complete

This PR implements the complete job offers functionality for the website, following the same patterns as blog posts and client stories.

## 📋 Summary

Adds job offers list and detail pages with support for:
- Dual content sources (GitHub repository or local filesystem)
- Internationalization (French/English)
- Server-side rendering with caching
- Type-safe schema validation
- Graceful handling of empty states

## ✨ What's Included

### 1. Technical Plan (`OFFERS_PLAN.md`)
- Comprehensive implementation documentation
- Architecture decisions and patterns
- File structure overview
- Testing checklist

### 2. Schema & Type System
**Files:** `app/modules/schemas.ts`
- `OfferFrontmatterSchema` with Zod validation
- Type-safe frontmatter fields:
  - `title`, `description`, `contractType`, `location`
  - `experience`, `education`, `department`, `salary`
  - `tags[]`, `date`
- Validator and type guard functions
- Integration with schema registry

### 3. Content Fetching Module
**Files:** `app/modules/content/api.ts`, `app/modules/content/index.ts`
- `OfferFetcher` class extending `GenericContentFetcher`
- `fetchOffer(slug, language)` - Single offer fetching
- `fetchOffers(language)` - Multiple offers fetching
- Content path: `offers/{language}/`
- Supports both GitHub API and local filesystem sources

### 4. Cache Strategy
**Files:** `app/modules/cache.ts`
- Added `'offer'` to `CacheStrategy` type
- Cache configuration: 1h max-age + 24h stale-while-revalidate
- Automatic cache strategy detection for `/offers` routes
- Matches blog/stories caching behavior

### 5. URL Helpers
**Files:** `app/utils/url.ts`
- Added `offers: '/offers'` constant
- Enables consistent URL referencing

### 6. Routes
**Files:** `app/routes/_main.offers._index.tsx`, `app/routes/_main.offers.$slug.tsx`

#### List Page (`_main.offers._index.tsx`)
- Fetches all offers for current language
- Sorts by date (newest first)
- **Gracefully handles empty state** when no offers exist
- Distinguishes between "no content" vs errors
- SEO meta tags

#### Detail Page (`_main.offers.$slug.tsx`)
- Fetches individual offer by slug
- Language-aware routing
- Cache headers for performance
- 404 handling for invalid slugs
- SEO meta tags

### 7. UI Components
**Files:** `app/components/offers/*.tsx`

All components follow existing blog/stories patterns:

- **`OfferList.tsx`** - Grid layout (2 columns on desktop, 1 on mobile)
- **`OfferItem.tsx`** - Job card with key details
  - Title, contract type, location, experience, education
  - Link to detail page
  - Hover effects
- **`OfferArticle.tsx`** - Detail page layout using `LayoutPost`
- **`OfferHeader.tsx`** - Title and description
- **`OfferSidebar.tsx`** - Job details panel (sticky)
  - Contract type, location, experience, education
  - Optional: department, salary
- **`OfferContent.tsx`** - Markdown content rendering

### 8. Code Quality
- ✅ All TypeScript types properly defined
- ✅ Biome formatting and linting passes
- ✅ Import organization follows project standards
- ✅ No type errors
- ✅ Handles edge cases (empty offers, missing directories)

## 🎯 Implementation Highlights

### Empty State Handling
The implementation gracefully handles the case when no offers exist:
```typescript
// Returns empty array without error when directory doesn't exist
if (status === 404 || state === 'not_found') {
  return { offers: [], isError: false };
}
```

### Content Source Flexibility
Works with both content sources out of the box:
```bash
pnpm dev:local   # Use ~/projects/ocobo-posts/offers/
pnpm dev:github  # Use GitHub repository
```

### i18n Support
Automatic language detection and content fetching:
- `/offers` → French content from `offers/fr/`
- `/en/offers` → English content from `offers/en/`

## 📁 Sample Content Structure

To add job offers, create markdown files in your content repository:

```
offers/
├── fr/
│   ├── senior-developer.md
│   └── product-manager.md
└── en/
    ├── senior-developer.md
    └── product-manager.md
```

### Example Frontmatter:
```yaml
---
title: "Développeur Full-Stack Senior"
description: "Rejoignez notre équipe"
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
...
```

## 🧪 Testing

### Routes to Test:
- List page: `/offers` (French), `/en/offers` (English)
- Detail page: `/offers/[slug]`, `/en/offers/[slug]`
- Empty state: Works when no offers directory exists

### Test Checklist:
- ✅ List page displays offer cards
- ✅ Detail page shows full offer with sidebar
- ✅ Empty state shows friendly message
- ✅ i18n works for both languages
- ✅ Responsive on mobile/desktop
- ✅ 404 handling for invalid slugs
- ✅ Cache headers applied correctly
- ✅ Type checking passes
- ✅ Linting/formatting passes

## 🚀 Deployment Ready

All code is production-ready:
- No breaking changes
- Follows existing patterns
- Fully typed and validated
- CI checks passing
- Backward compatible

## 📝 Commits Summary

1. ✅ Technical plan documentation
2. ✅ Offer schema with validation
3. ✅ Content fetching module
4. ✅ Cache strategy configuration
5. ✅ URL helper constants
6. ✅ Routes (list + detail pages)
7. ✅ UI components (6 components)
8. ✅ Dependencies lockfile update
9. ✅ Empty state handling + CI fixes

---

**Ready to merge!** Once merged, simply add your markdown files to the content repository to start publishing job offers.
