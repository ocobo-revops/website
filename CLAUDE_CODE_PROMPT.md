# Claude Code Agent: API Routes Refactoring Implementation

## 🎯 **Mission**

Transform this React Router v7 application into a **true API-first architecture** by implementing systematic API routes refactoring following the comprehensive guide provided.

## 📋 **Current State**

- ✅ **Working foundation**: Framework-native cache strategy with `Vercel-CDN-Cache-Control`
- ✅ **First API route**: `/api/blog` working with proper cache headers
- ✅ **Content system**: GitHub-based content with `app/modules/content/api.ts`
- ✅ **Cache module**: `app/modules/cache.ts` with caching infrastructure

**Test current API**: `curl -I https://ocobo-git-api-routes-wabdsgn.vercel.app/api/blog`

## 📖 **Implementation Guide**

**READ THIS FIRST**: `API_ROUTES_REFACTORING_GUIDE.md` (1,018 lines) contains:
- Complete technical specifications
- Step-by-step implementation instructions
- Code templates for all patterns
- Testing protocols for each phase
- Cache strategy optimization
- Success criteria and validation

## 🚀 **Your Implementation Tasks**

### **Phase 1: Complete API Routes (START HERE)**

**CRITICAL FIRST STEP**:
```bash
# Rename existing API route
mv app/routes/api.blog._index.tsx app/routes/api.posts._index.tsx
# Update internal route logic to use new naming
```

**Then implement these routes in order**:
1. **`api.posts.$slug.tsx`** - Individual blog posts
2. **`api.stories._index.tsx`** - Client stories listing
3. **`api.stories.$slug.tsx`** - Individual stories
4. **`api.search.tsx`** - Search functionality
5. **`api.tags.tsx`** - Tags listing

**Pattern**: Follow the exact template in the guide (lines 72-126) for each route.

### **Phase 2: Test All Routes**
Verify each route using the testing protocols (lines 634-639 in guide).

### **Phase 2.5: Cache Strategy Cleanup**
Simplify `app/modules/cache.ts` following lines 292-586 in the guide.

### **Phase 3: Refactor Pages**
Convert HTML pages to call API routes instead of direct backend calls.

## 🔧 **Key Technical Requirements**

### **Cache Strategy** (CRITICAL):
```typescript
// Use differentiated caching:
'blogListing'   // 1h + 2h (for new content visibility)
'blogPost'      // 7d + 14d (for performance)
'storyListing'  // 1h + 2h (for new content visibility)
'story'         // 14d + 30d (for performance)
'static'        // 30d + 60d (for maximum efficiency)
```

### **API Response Format** (MANDATORY):
```typescript
// Success
{ data: T, isError: false, total?: number }

// Error
{ data: null, isError: true, error: string }
```

### **Route Template** (EXACT PATTERN):
```typescript
import { getApiCacheHeaders, shouldBypassCache } from '~/modules/cache';

export async function loader({ request, params }: LoaderFunctionArgs) {
  // 1. Extract parameters
  // 2. Fetch data using existing content API
  // 3. Handle errors with proper HTTP status
  // 4. Apply cache headers using getApiCacheHeaders()
  // 5. Return Response with proper JSON and headers
}
```

## ⚠️ **Critical Constraints**

### **DO NOT MODIFY**:
- `app/entry.server.tsx` (cache headers working perfectly)
- `app/modules/content/api.ts` (use existing functions)
- Cache header application logic (already optimized)

### **DO FOLLOW**:
- Exact response format (see guide lines 270-283)
- Cache strategy selection (see guide lines 284-291)
- Error handling patterns (see guide lines 94-107)
- Testing protocols (see guide lines 634-665)

## 🧪 **Testing Requirements**

For each route implemented:
```bash
# Test locally
curl -I http://localhost:5173/api/posts

# Test deployed
curl -I https://ocobo-git-api-routes-wabdsgn.vercel.app/api/posts

# Verify JSON response
curl -s https://ocobo-git-api-routes-wabdsgn.vercel.app/api/posts | head -20
```

**Expected headers**:
- `cache-control: s-maxage=3600, stale-while-revalidate=7200` (listings)
- `cache-control: s-maxage=604800, stale-while-revalidate=1209600` (individual content)
- `content-type: application/json`
- `vary: Accept-Language`

## 📊 **Success Criteria**

### **Phase 1 Complete When**:
- ✅ All 6 API routes return proper JSON with cache headers
- ✅ All routes handle errors with appropriate HTTP status codes
- ✅ Testing protocols pass for each route
- ✅ Cache headers match expected values by content type

### **Phase 2.5 Complete When**:
- ✅ `cache.ts` reduced from 129 → ~60 lines
- ✅ `createHybridLoader` removed entirely
- ✅ Separate `getApiCacheHeaders()` vs `getHtmlCacheHeaders()` functions

### **Phase 3 Complete When**:
- ✅ All HTML pages call API routes instead of direct backend functions
- ✅ No `fetchBlogposts`, `fetchStories` imports in page components
- ✅ Consistent error handling across all consumers
- ✅ Zero regression in page functionality

## 🎯 **Key Benefits You're Achieving**

- **API-first architecture**: External consumers get same data as HTML pages
- **50%+ code reduction**: Simplified cache module and page loaders
- **Optimal performance**: 95%+ GitHub API call reduction with smart caching
- **New content visibility**: Users see new articles within 1-3 hours automatically
- **Future-ready**: Foundation for React Query, mobile apps, webhooks

## 📝 **Implementation Notes**

1. **Start simple**: Begin with Phase 1, test thoroughly
2. **Follow patterns**: Use the exact templates provided in the guide
3. **Test frequently**: Verify each route before moving to the next
4. **Read the guide**: All edge cases and detailed instructions are documented
5. **Incremental approach**: Complete each phase fully before proceeding

## 🔗 **Reference**

- **Complete Guide**: `API_ROUTES_REFACTORING_GUIDE.md`
- **Working Example**: `app/routes/api.blog._index.tsx` (to be renamed)
- **Content Functions**: `app/modules/content/api.ts`
- **Cache Module**: `app/modules/cache.ts`

---

**Ready to implement? Start with renaming the existing API route and then follow Phase 1 step-by-step. The comprehensive guide has all the details you need for successful implementation.**
