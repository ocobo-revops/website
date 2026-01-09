# API Contracts - Main Application

## Overview
This React Router v7 application uses **server-side loaders** for data fetching rather than traditional REST APIs. All data loading happens during server-side rendering with caching optimization.

## Route-Based API Endpoints

### Content Routes

#### Blog Routes

**GET `/blog`** - Blog listing page
- **Loader**: `createHybridLoader` with cache strategy
- **Data Source**: Content API (GitHub/filesystem)
- **Query Parameters**: 
  - `tag` (optional): Filter posts by tag
  - `refresh=1` (optional): Bypass cache
- **Response**: `{ posts: BlogPost[], isError: boolean }`
- **Cache Strategy**: `blogPost` (1 hour fresh, 24 hours stale-while-revalidate)

**GET `/blog/$slug`** - Individual blog post
- **Loader**: Content fetching with error handling
- **Parameters**: `slug` - Post identifier
- **Response**: `{ post: BlogPost }` or 404
- **Cache Strategy**: `blogPost`

#### Client Stories Routes

**GET `/clients`** - Client stories listing
- **Loader**: Content fetching with sorting
- **Response**: `{ stories: Story[] }`
- **Cache Strategy**: `story`

**GET `/clients/$slug`** - Individual client story
- **Loader**: Content fetching with metadata
- **Parameters**: `slug` - Story identifier
- **Response**: `{ story: Story }` or 404
- **Cache Strategy**: `story`

### Static Content Routes

#### Contact Route

**GET `/contact`** - Contact page
- **Loader**: i18n data preparation
- **Response**: `{ title: string, description: string, ogImageSrc: string }`
- **Features**: 
  - Contact form processing (HubSpot integration)
  - Language-aware meta tags
  - OG image generation

#### Project Pages

**GET `/projets-revops`** - RevOps projects page (French)
**GET `/strategies-revenue-operations`** - Revenue operations page (French)
- **Loader**: i18n meta preparation
- **Features**: 
  - Language routing with `($lang)` parameter
  - Automatic locale redirect
  - SEO optimization

### Utility Routes

#### SEO & Technical Routes

**GET `/sitemap.xml`** - Dynamic sitemap generation
- **Loader**: Aggregates all content for sitemap
- **Data Sources**: 
  - Blog posts (with dates)
  - Client stories (with dates)
  - Static pages
- **Output**: XML sitemap format
- **Headers**: `Content-Type: application/xml`

**GET `/robots.txt`** - Robots.txt file
- **Static**: Robot crawling instructions
- **Headers**: `Content-Type: text/plain`

## Content API Integration

### GitHub API Integration

**Base URL**: `https://api.github.com/repos/{account}/{repo}/contents`
**Authentication**: GitHub Access Token (Bearer)

#### Endpoints Used:

**GET `/contents/blog`** - Fetch blog posts
- **Headers**: `Authorization: Bearer {token}`
- **Query**: `?ref={branch}` (branch targeting)
- **Response**: GitHub file tree with content

**GET `/contents/stories`** - Fetch client stories
- **Headers**: `Authorization: Bearer {token}`
- **Query**: `?ref={branch}` 
- **Response**: GitHub file tree with content

### Filesystem API (Development)

**Local Path**: `~/projects/ocobo-posts/`
- **blog/**: Markdown blog posts
- **stories/**: Client story markdown files
- **No Authentication**: Direct file system access

## Data Models

### BlogPost Interface
```typescript
interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    description: string;
    tags: string[];
    author?: string;
    image?: string;
  };
  content: string;
  readingTime?: number;
}
```

### Story Interface
```typescript
interface Story {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    client: string;
    sector: string;
    description: string;
    deliverables: string[];
    results: string[];
    image?: string;
  };
  content: string;
}
```

## Error Handling

### HTTP Status Codes
- **200**: Successful data fetch
- **404**: Content not found (post/story doesn't exist)
- **500**: Server error (GitHub API failure, file system error)

### Error Responses
```typescript
// Graceful degradation
{ posts: [], isError: true }  // Blog listing error
{ stories: [], isError: true } // Stories listing error

// 404 handling
throw new Response('Not Found', { status: 404 });
```

## Caching Strategy

### Cache Headers (Production)
```http
Cache-Control: s-maxage=3600, stale-while-revalidate=86400
Vary: Accept-Language
```

### Cache Strategies
- **blogPost**: 1 hour fresh, 24 hours stale-while-revalidate
- **story**: 1 hour fresh, 24 hours stale-while-revalidate  
- **static**: 24 hours fresh, 7 days stale-while-revalidate

### Cache Bypass
- **URL Parameter**: `?refresh=1`
- **Development**: No caching with `CONTENT_SOURCE=locale`

## Internationalization

### Language Detection
- **URL Parameter**: `($lang)` optional parameter
- **Supported Languages**: `fr` (default), `en`
- **Fallback**: French for missing translations

### Localized Routes
```
/                    → French homepage
/en/                 → English homepage
/contact            → French contact
/en/contact         → English contact
```

## External Service Integration

### HubSpot API (Contact Forms)
- **Endpoint**: Custom HubSpot integration
- **Method**: POST form submissions
- **Validation**: Server-side form processing

### Vercel Analytics
- **Integration**: `@vercel/analytics` and `@vercel/speed-insights`
- **Data Collection**: Page views, performance metrics
- **Privacy**: GDPR compliant

## Security & Performance

### Security Headers
- **CORS**: Configured for content domains
- **CSP**: Content Security Policy for external resources
- **Bot Detection**: `isbot` library for analytics filtering

### Performance Optimization
- **Edge Caching**: Global CDN distribution
- **Bundle Splitting**: Route-based code splitting
- **Image Optimization**: Lazy loading and optimization
- **Critical CSS**: Above-the-fold CSS inlining

This API architecture prioritizes **performance** and **SEO** through server-side rendering while maintaining **developer experience** through TypeScript and modern React patterns.