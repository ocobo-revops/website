# Architecture Patterns - OCOBO Website

*Generated: 2026-01-08*
*Part: main*
*Type: React Router v7 Web Application*

## Executive Summary

OCOBO website is a React Router v7 (formerly Remix) application with internationalization support, implementing a modern full-stack React architecture with server-side rendering and edge deployment capabilities.

## Technology Stack

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Framework** | React Router v7 | ^7.8.1 | Full-stack React with SSR, file-based routing, evolved from Remix |
| **Language** | TypeScript | ^5.9.2 | Type safety, better DX, modern JavaScript features |
| **Runtime** | Node.js | >=22.0.0 | Latest LTS, required for React Router v7 features |
| **Package Manager** | pnpm | latest | Fast, efficient, disk space optimization |
| **Styling** | Panda CSS | ^0.37.2 | CSS-in-JS with atomic CSS generation, type-safe |
| **UI Components** | Radix UI | Various | Accessible, unstyled component primitives |
| **Content** | Markdoc | ^0.5.4 | Markdown processing for blog/content pages |
| **Internationalization** | React i18next | ^15.6.1 | French/English support with SSR compatibility |
| **Testing** | Vitest | ^3.2.4 | Fast unit testing with coverage reporting |
| **Code Quality** | Biome | 1.9.4 | Fast linting and formatting |
| **Deployment** | Vercel | N/A | Edge deployment with global CDN |

## Architecture Pattern

### Layered Component Architecture

The application follows React Router v7's file-based routing with a layered component architecture:

```
┌─────────────────────────────────────────┐
│             Presentation Layer           │
│  • Routes (file-based)                  │
│  • UI Components (Radix + Custom)       │
│  • Layout Components                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              Business Layer             │
│  • Route Loaders (data fetching)        │
│  • Content Processing                   │
│  • Form Actions                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│               Data Layer                │
│  • GitHub API Integration               │
│  • Filesystem Operations               │
│  • Cache Management                    │
└─────────────────────────────────────────┘
```

### Key Architectural Patterns

1. **Server-Side Rendering (SSR)**
   - React Router v7 loader functions
   - SEO optimization
   - Progressive enhancement

2. **File-Based Routing**
   - Convention over configuration
   - Automatic code splitting
   - Nested layouts

3. **Content-Driven Architecture**
   - GitHub-based content management
   - Markdoc processing pipeline
   - Dual source support (local/remote)

4. **Edge-First Design**
   - Vercel Edge Runtime compatibility
   - Global content caching
   - Optimal performance worldwide

## Data Architecture

### Content Management Strategy

**Hybrid Content Sources:**
- **Development**: Local filesystem (`~/projects/ocobo-posts/`)
- **Production**: GitHub API with branch targeting
- **Caching**: Vercel Edge Cache for external sources

**Content Types:**
- Blog posts (Markdown with frontmatter)
- Client stories (Markdown with metadata)
- Static pages (React components)
- Legal documents (Markdown)

**Content Processing Pipeline:**
```
GitHub/Filesystem → Markdoc Parser → React Components → SSR → Client
```

### State Management

**Client-Side State:**
- React Context for theme/language
- Local component state
- Form state management

**Server-Side State:**
- Route loaders for data fetching
- Session management (i18next)
- Content cache coordination

## Component Architecture

### Design System Structure

```
preset/                    # Panda CSS Design System
├── tokens/               # Design tokens (colors, spacing, typography)
├── recipes/              # Component variants (button, input, etc.)
├── patterns/             # Layout patterns (flex, grid, container)
├── slot-recipes/         # Multi-part components (accordion, select)
└── utilities/            # Custom utilities

@ocobo/styled-system/     # Generated CSS-in-JS outputs
├── css/                  # Core CSS utilities
├── jsx/                  # Styled JSX components
├── patterns/             # Pattern components
├── recipes/              # Recipe components
└── types/                # TypeScript definitions
```

### Component Organization

```
app/components/
├── ui/                   # Base UI components (Button, Input, Card)
├── homepage/             # Page-specific components
├── blog/                 # Blog-related components
├── stories/              # Client stories components
├── projects/             # Projects page components
├── strategy/             # Strategy page components
└── icons/                # Icon components
```

### Component Categories

1. **Base UI Components** (`ui/`)
   - Atomic components (Button, Input, Label)
   - Layout components (Container, Card)
   - Interaction components (Carousel, Accordion)

2. **Feature Components**
   - Page-specific business logic
   - Content-aware components
   - Integration-specific UI

3. **Layout Components**
   - Main layout structure
   - Header/Footer components
   - Navigation systems

## API Design

### Route Structure

**Public Routes:**
```
/                        # Homepage (with optional language param)
/($lang)/                # Internationalized routes
/blog/                   # Blog listing
/blog/$slug              # Individual blog posts
/clients/                # Client stories listing
/clients/$slug           # Individual client stories
/contact                 # Contact form
/projets-revops          # Projects page
/strategies-revenue-operations  # Strategy page
```

**System Routes:**
```
/robots.txt              # SEO robots file
/sitemap.xml             # XML sitemap
/legal/$slug             # Legal documents
/media/$slug             # Media files
```

### Data Loading Pattern

**Route Loaders:**
```typescript
// Example: Blog listing loader
export const loader = createHybridLoader(
  async ({ request }) => {
    const [status, _state, posts] = await fetchBlogposts();
    if (status !== 200) return { posts: [], error: true };
    return { posts: posts || [] };
  },
  'blogPost'  // Cache strategy
);
```

**Content Fetching:**
- Abstracted content API (`app/modules/content/`)
- Source-agnostic interface
- Built-in caching and error handling

## Development Workflow

### Local Development Process

1. **Setup**: `pnpm install && pnpm prepare`
2. **Development**: `pnpm dev` (filesystem content) or `pnpm dev:github`
3. **Quality**: `pnpm check && pnpm test`
4. **Build**: `pnpm build` for production testing

### Code Quality Pipeline

**Pre-commit Checks:**
- Biome linting and formatting
- TypeScript type checking
- Unit test execution
- Style system generation

**CI/CD Pipeline:**
- Automated testing on push/PR
- Multi-job validation (lint, format, test)
- Coverage reporting

## Deployment Architecture

### Vercel Edge Deployment

**Infrastructure:**
- Global edge network
- Automatic scaling
- Zero-config deployment

**Environment Configuration:**
```
Production:   CONTENT_SOURCE=github, GITHUB_BRANCH=main
Preview:      CONTENT_SOURCE=github, GITHUB_BRANCH=offers
Development:  CONTENT_SOURCE=locale
```

**Caching Strategy:**
- Edge caching for GitHub content
- No caching for local development
- Cache bypass via `?refresh=1`

### Performance Optimizations

1. **Build Optimizations**
   - Automatic code splitting
   - Tree shaking
   - Bundle analysis available

2. **Runtime Optimizations**
   - Server-side rendering
   - Progressive enhancement
   - Edge caching

3. **Content Optimizations**
   - Markdown processing at build time
   - Image optimization (Vercel)
   - Asset optimization

## Testing Strategy

### Unit Testing
- **Framework**: Vitest with coverage
- **Coverage Target**: Critical business logic
- **Test Location**: Co-located with source files

### Integration Testing
- **API Testing**: Content fetching validation
- **Component Testing**: UI component behavior
- **Route Testing**: Loader and action validation

### Quality Assurance
- **Static Analysis**: Biome linting
- **Type Safety**: TypeScript strict mode
- **Code Coverage**: Automated reporting

## Internationalization Architecture

### i18n Implementation
- **Languages**: French (default), English
- **Route Structure**: `/` (French), `/en/` (English)
- **Translation Files**: `locales/fr/`, `locales/en/`
- **Detection**: Browser language detection with override

### Content Localization
- Language-aware content fetching
- Metadata localization
- URL generation for language switching

## Security Considerations

### Content Security
- GitHub token-based API access
- Environment variable protection
- Content validation and sanitization

### Deployment Security
- Environment variable isolation
- HTTPS enforcement
- Vercel platform security features

## Monitoring and Observability

### Performance Monitoring
- Vercel Analytics integration
- Core Web Vitals tracking
- Function execution monitoring

### Error Tracking
- Route-level error boundaries
- Graceful degradation for content failures
- Development vs production error handling

This architecture supports the OCOBO website's requirements for a fast, maintainable, and globally accessible web presence with robust content management and internationalization capabilities.