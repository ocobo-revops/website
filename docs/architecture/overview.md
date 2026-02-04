# Architecture Overview

## Overview

OCOBO is a modern React Router v7 application following a **component-based layered architecture** with a **server-first** approach for optimal performance.

## Architectural Principles

### 1. Server-Side First

- **Default SSR** with client-side hydration
- **Data loading** via React Router loaders
- **Result**: Global performance and SEO optimization

### 2. Component-Driven Development

- **Atomic Design** with reusable components
- **Design System** with Panda CSS and tokens
- **Type Safety** complete with TypeScript

### 3. Content as Code

- **Markdown-driven** content management
- **Dual source**: GitHub API (prod) / Filesystem (dev)
- **Validation** with Zod schemas

### 4. Internationalization-Ready

- **Multi-language** French/English
- **URL-based** language routing
- **Server-side** i18n rendering

## Architectural Layers

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│        (React Components + Panda)       │
├─────────────────────────────────────────┤
│             Routing Layer               │
│         (React Router v7 SSR)           │
├─────────────────────────────────────────┤
│           Business Logic                │
│        (Content API + Cache)            │
├─────────────────────────────────────────┤
│            Data Sources                 │
│      (GitHub API / Filesystem)          │
├─────────────────────────────────────────┤
│           Infrastructure                │
│       (Vercel Edge + CDN Cache)         │
└─────────────────────────────────────────┘
```

## Data Flow

### Request Flow

```
User Request → Route Loader → Content Fetch → Validation → Cache → SSR → Client
```

### Content Flow

```
GitHub Repository → API Fetch → Markdoc Processing → Validation → Cache → Route
```

### Style Flow

```
Design Tokens → Panda Compilation → CSS Generation → Component Application
```

## Key Integration Points

### 1. Content Management

- **GitHub Integration** for production content
- **Local Development** with filesystem
- **Cache Strategy** adaptive to environment

### 2. Styling System

- **Panda CSS** for type-safe CSS-in-JS
- **Design Tokens** centralized
- **Component Recipes** for variations

### 3. Internationalization

- **react-i18next** for translations
- **URL routing** with language parameter
- **Server-side** detection and rendering

### 4. Performance Optimization

- **Edge Caching** with Vercel
- **Code Splitting** by route
- **Image Optimization** automatic
- **Bundle Analysis** integrated

## Route Map (Key Public Routes)

- `/` — Homepage (redesigned, Plan A)
- `/($lang)/` — Locale-prefixed routes (FR/EN)
- `/blog` — Blog listing
- `/blog/$slug` — Blog detail
- `/clients` — Client stories
- `/clients/$slug` — Client story detail
- `/contact` — Contact page

## Major Architectural Decisions

### 1. React Router v7 vs Alternatives

**Choice:** React Router v7 (evolution of Remix)
**Rationale:** Optimal SSR, file-based routing, integrated data loading, mature ecosystem

### 2. Content Source Strategy

**Choice:** Dual source (GitHub + Filesystem)
**Rationale:** Dev/prod flexibility, natural versioning, facilitated collaboration

### 3. Styling Approach

**Choice:** Panda CSS
**Rationale:** Type safety, atomic CSS, zero runtime, integrated design system

### 4. State Management

**Choice:** Server-first with URL state
**Rationale:** Simplicity, SSR performance, fewer bugs, SEO-friendly

## Scalability

### Horizontal

- **Vercel Edge** automatic global distribution
- **CDN Caching** zero configuration
- **Stateless Architecture** for automatic scaling

### Vertical

- **Modular Components** for feature addition
- **Content API** abstraction for new sources
- **Type System** for safe refactoring

---

For more details, consult:

- **[Architectural Patterns](patterns.md)** - Detailed pattern implementation
- **[Technology Stack](technology-stack.md)** - Technologies and versions
- **[Source Tree](source-tree.md)** - Code organization
