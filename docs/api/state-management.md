# State Management Patterns - Main Application

## Overview
This React Router v7 application follows a **server-first state management approach** with minimal client-side state. Most state is managed through URL parameters, server-side loaders, and edge caching rather than complex client-side state management.

## State Management Philosophy

### Server-State First
- **Primary State Source**: Server-side data through React Router loaders
- **URL as State**: Route parameters and search params drive most application state
- **Minimal Client State**: Only UI interactions and ephemeral state on the client
- **Cache Layer**: Edge caching at Vercel level instead of application-level state

## State Management Patterns

### 1. Server State (Primary)

**React Router Loaders**
```typescript
// Example: Blog listing with filtering state via URL
export const loader = createHybridLoader(
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');  // State from URL
    
    const [status, state, blogData] = await fetchBlogposts();
    const filteredPosts = tag 
      ? blogData.filter(entry => entry.frontmatter.tags.includes(tag))
      : blogData;
    
    return { posts: filteredPosts };
  },
  'blogPost'
);
```

**State Sources**:
- **Route Parameters**: `$slug` for content identification
- **Search Parameters**: `?tag=revops` for filtering
- **Form Data**: POST actions for form submissions
- **Headers**: Language preferences, caching directives

### 2. Internationalization State

**i18next Integration**
```typescript
// Server-side language resolution
export async function loader(args: LoaderFunctionArgs) {
  await redirectWithLocale(args);
  const t = await i18nServer.getFixedT(getLang(args.params), 'contact');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

// Client-side i18n hook
const { t } = useTranslation('contact');
```

**Language State Management**:
- **Server Resolution**: Language detected from URL `($lang)` parameter
- **Client Hydration**: No language flash, seamless hydration
- **Fallback Logic**: French default with English support
- **Context Provider**: `I18nextProvider` for React integration

### 3. Local Component State

**UI Interaction State**
```typescript
// Window size tracking
export function useWindowSize() {
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    // ... event listeners
  }, []);

  return size;
}
```

**Local State Uses**:
- **Responsive Design**: Window dimensions for layout decisions
- **Form State**: Form inputs before submission
- **Animation State**: Component animation triggers
- **UI Toggles**: Menu open/closed, accordion expansion

### 4. CSS-in-JS State (Panda CSS)

**Style Context Pattern**
```typescript
// Panda CSS provides CSS-in-JS state through style context
import { css } from '@ocobo/styled-system/css';
import { Container, Grid } from '@ocobo/styled-system/jsx';

// Conditional styling based on props/state
const dynamicStyles = css({
  backgroundColor: isActive ? 'coral' : 'sky.light',
  transform: isExpanded ? 'scale(1.1)' : 'scale(1)',
});
```

**Style State Management**:
- **Compile-time**: Static styles generated at build time
- **Runtime**: Dynamic styles through CSS variables
- **Theme Context**: Design tokens accessible throughout component tree
- **Responsive State**: Breakpoint-based style application

## Specific State Management Implementations

### 1. Content State

**Content Loading Pattern**
```typescript
// Server-side content state
const [status, state, data] = await fetchBlogposts();

// State mapping
const stateToResponse = {
  'success': { posts: data, isError: false },
  'not_found': { posts: [], isError: false },
  'validation_error': { posts: [], isError: true },
  'source_error': { posts: [], isError: true },
};
```

**Error State Handling**:
- **Graceful Degradation**: Empty arrays instead of crashes
- **Error Boundaries**: Page-level error catching
- **Loading States**: Server-side loading, no client loading spinners
- **Cache State**: Stale-while-revalidate for better UX

### 2. Navigation State

**Route-Based Navigation State**
```typescript
// Language-aware routing
const routes = {
  '/': 'French homepage',
  '/en/': 'English homepage',
  '/blog': 'French blog listing',
  '/en/blog': 'English blog listing',
  '/blog?tag=revops': 'Filtered French blog',
};
```

**Navigation State Features**:
- **Language Persistence**: Language maintained across navigation
- **Filter State**: URL parameters preserve filter state
- **Back Button**: Browser history works correctly
- **Deep Linking**: All state recoverable from URL

### 3. Form State

**Server-Side Form Processing**
```typescript
// Contact form action
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Validation and processing
  const result = await processContactForm({ email, message });
  
  return redirect('/contact?submitted=true');
}
```

**Form State Pattern**:
- **Server Validation**: Form validation on the server
- **Progressive Enhancement**: Works without JavaScript
- **Error State**: Validation errors returned to client
- **Success State**: Redirect after successful submission

### 4. Cache State

**Hybrid Caching Strategy**
```typescript
export const createHybridLoader = (
  loaderFunction: LoaderFunction,
  cacheStrategy: CacheStrategy,
) => {
  return async (args: LoaderFunctionArgs) => {
    const result = await loaderFunction(args);
    
    // Set cache headers based on strategy
    const headers = getCacheHeaders(cacheStrategy);
    
    return new Response(JSON.stringify(result), { headers });
  };
};
```

**Cache State Management**:
- **Edge Cache**: Vercel edge cache as primary cache layer
- **Cache Keys**: URL-based cache invalidation
- **Cache Strategy**: Different TTL for different content types
- **Cache Bypass**: `?refresh=1` for cache busting

## State Flow Architecture

### 1. Request Flow
```
User Request → Route Loader → Content Fetch → Validation → Cache → Response
```

### 2. Language Flow
```
URL Lang Param → Server Detection → i18n Resolution → Component Translation
```

### 3. Form Flow
```
Form Submit → Server Action → Validation → Processing → Redirect
```

### 4. Error Flow
```
Error Occurs → Error Boundary → Graceful Fallback → User Feedback
```

## State Performance Optimizations

### 1. Minimal Client State
- **No Redux/Zustand**: Server state eliminates need for complex client state
- **No State Synchronization**: Server-side rendering prevents state mismatches
- **No Hydration Issues**: Minimal client state reduces hydration complexity

### 2. Efficient Updates
- **URL State**: State changes trigger navigation, efficient updates
- **Cache Invalidation**: Edge cache invalidation for fresh data
- **Partial Updates**: Only affected components re-render

### 3. Memory Management
- **Automatic Cleanup**: Server-side state automatically cleaned up
- **No Memory Leaks**: Minimal client-side state reduces leak potential
- **Garbage Collection**: Regular cleanup through navigation

## State Debugging & Monitoring

### 1. Server-Side Debugging
```typescript
// Content fetch debugging
console.log('Content fetch state:', state);
console.log('Cache strategy:', cacheStrategy);
console.log('Request URL:', request.url);
```

### 2. Client-Side Monitoring
```typescript
// Performance monitoring with Vercel Analytics
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
```

### 3. Error Tracking
- **Server Errors**: Console logging for server-side errors
- **Client Errors**: Error boundaries for client-side errors
- **Network Errors**: Graceful handling of API failures

## Benefits of This State Management Approach

### 1. Simplicity
- **Less Code**: No complex state management libraries
- **Easier Testing**: Server-side state easier to test
- **Better DX**: Fewer moving parts, clearer data flow

### 2. Performance
- **Faster Loading**: Server-side rendering with edge caching
- **Better SEO**: All state available during SSR
- **Reduced Bundle**: No state management library overhead

### 3. Reliability
- **Fewer Bugs**: Less client-side state, fewer state-related bugs
- **Better UX**: No loading spinners, immediate content
- **Resilient**: Works without JavaScript enabled

This state management approach provides a **robust**, **performant**, and **maintainable** solution that leverages React Router v7's full-stack capabilities while keeping complexity minimal.