# Cache Strategy Guide

A simple, source-aware caching strategy that adapts to your content source.

## Quick Overview

- **Local files**: No caching (development)
- **GitHub API**: Vercel Edge Cache (production)  
- **Testing**: Add `?refresh=1` to bypass cache

## Implementation

### Single Function API

```typescript
import { createHybridLoader } from '~/modules/cache';

export const loader = createHybridLoader(
  async ({ request }) => {
    const [status, _state, data] = await fetchBlogposts();
    if (status !== 200) return { posts: [], error: true };
    return { posts: data };
  },
  'blogPost' // Cache strategy
);
```

### Cache Strategies

| Strategy | Fresh | Stale-While-Revalidate | Use For |
|----------|-------|------------------------|---------|
| `blogPost` | 1 hour | 24 hours | Blog articles |
| `story` | 1 hour | 24 hours | Client stories |
| `static` | 24 hours | 7 days | Static content |

## How It Works

### Content Source Detection
Automatically detects if you're using local files or GitHub API:

```typescript
// Local development (.env.local)
CONTENT_SOURCE=locale

// Production with GitHub
CONTENT_SOURCE=github
```

### Cache Headers Generated

**Local filesystem:**
```
Cache-Control: no-cache
```

**GitHub API:**
```
Cache-Control: s-maxage=3600, stale-while-revalidate=86400
Vary: Accept-Language
```

## Usage Examples

### Blog Route
```typescript
export const loader = createHybridLoader(
  async ({ request }) => {
    const [status, _state, posts] = await fetchBlogposts();
    return { posts: posts || [] };
  },
  'blogPost'
);
```

### Story Route with Meta
```typescript
export const loader = createHybridLoader(
  async ({ params }) => {
    const [status, _state, story] = await fetchStory(params.slug);
    if (status !== 200) throw new Response('Not Found', { status: 404 });
    return { story };
  },
  'story'
);

// Meta function works because data is directly accessible
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getMetaTags({
    title: data?.story.title,
    description: data?.story.description,
  });
};
```

## Testing

### Cache Bypass
Add `?refresh=1` to any URL:
```
https://example.com/blog?refresh=1
```

### Environment Testing
```bash
# Test with local files (no caching)
CONTENT_SOURCE=locale npm run dev

# Test with GitHub API (with caching) 
CONTENT_SOURCE=github npm run dev
```

### Verify Caching
Check response headers:
```bash
curl -I https://example.com/blog
# Look for: Cache-Control: s-maxage=3600, stale-while-revalidate=86400
```

## Benefits

### Local Development
- ✅ No caching complexity
- ✅ Instant file updates
- ✅ Fast local reads

### Production
- ✅ Global edge caching
- ✅ 90%+ API call reduction  
- ✅ Zero maintenance
- ✅ Automatic geographic optimization

## Monitoring

The cache strategy logs on server startup:
```
🚀 Cache Strategy: Vercel Edge Cache           # Production with GitHub
🚀 Cache Strategy: No cache (local filesystem) # Local development
```

This log appears in:
- **Local development**: Terminal console during `pnpm dev`
- **Vercel deployment**: Function startup logs in Vercel Dashboard

Monitor cache performance in Vercel Dashboard:
- Cache hit rates
- Edge location performance  
- Function execution times

## Best Practices

**Do:**
- Use appropriate cache strategy for your content type
- Test cache behavior with `?refresh=1`
- Monitor cache hit rates in production

**Don't:**
- Add additional caching layers
- Cache local filesystem reads
- Create complex invalidation logic

---

This strategy leverages Vercel's edge network instead of application-level caching, providing better performance with zero maintenance.