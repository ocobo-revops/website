# Data Models - Main Application

## Overview
This application uses a **content-driven data model** with Markdown files and TypeScript schemas for validation. No traditional database is used - content is stored as structured Markdown with YAML frontmatter and validated using Zod schemas.

## Data Architecture Pattern

### Content as Data
- **Storage**: Markdown files with YAML frontmatter
- **Sources**: GitHub API (production) / Filesystem (development)
- **Processing**: Markdoc compilation with TypeScript validation
- **Caching**: Edge-level caching (Vercel) with stale-while-revalidate

## Core Data Models

### 1. Story (Client Case Studies)

**Purpose**: Client testimonials and project case studies

```typescript
interface StoryFrontmatter {
  name: string;              // Client/project name
  date: string;              // Publication/project date (ISO string)
  title: string;             // Main title of the story
  subtitle: string;          // Subtitle or tagline
  description: string;       // Brief description
  speaker: string;           // Name of person giving testimonial
  role: string;              // Role/position of speaker
  duration: string;          // Project duration
  scopes: string[];          // Project scopes/areas covered
  tags: string[];            // Categorization tags
  tools: string[];           // Tools and technologies used
  quotes: string[];          // Key quotes from client
  deliverables: string[];    // Project deliverables
  youtubeId?: string;        // Optional YouTube video ID (11 chars)
}
```

**Validation Schema**: `StoryFrontmatterSchema` (Zod)
**File Location**: `stories/*.md` 
**Example Path**: `/stories/client-transformation-case-study.md`

### 2. Blog Post (Articles & Insights)

**Purpose**: Marketing content and thought leadership articles

```typescript
interface BlogpostFrontmatter {
  title: string;             // Article title
  description: string;       // Article description/summary
  exerpt?: string;          // Optional excerpt (legacy typo maintained)
  author: string;            // Author name
  image: string;             // Featured image URL or path
  date: string;              // Publication date (ISO string)
  tags: string[];            // Article tags for categorization
  read: string;              // Estimated reading time
  youtubeId?: string;        // Optional YouTube video ID for video content
}
```

**Validation Schema**: `BlogpostFrontmatterSchema` (Zod)
**File Location**: `blog/*.md`
**Example Path**: `/blog/revenue-operations-best-practices.md`

### 3. Page (Static Content)

**Purpose**: Static pages like legal documents, about pages, etc.

```typescript
interface PageFrontmatter {
  title: string;             // Page title
  description: string;       // Page description for SEO
}
```

**Validation Schema**: `PageFrontmatterSchema` (Zod)
**File Location**: Various (`legal/*.md`, etc.)
**Example Path**: `/legal/privacy-policy.md`

## Content Processing Pipeline

### 1. Content Fetching Layer

```typescript
interface ContentSource {
  fetchSingle<T>(path: string, slug: string, validator: ContentValidator<T>): 
    Promise<ContentResult<MarkdocFile<T>>>;
    
  fetchMultiple<T>(path: string, validator: ContentValidator<T>): 
    Promise<ContentResult<MarkdocFile<T>[]>>;
    
  fetchMetadata?(path: string): 
    Promise<ContentResult<ContentItemMetadata[]>>;
}
```

**Implementations**:
- **GitHub Source**: `app/modules/content/sources/github.ts`
- **Filesystem Source**: `app/modules/content/sources/filesystem.ts`

### 2. Validation Layer

**Common Validation Schemas**:
```typescript
const CommonSchemas = {
  nonEmptyString: z.string().min(1).trim(),
  dateString: z.string().refine(date => !isNaN(Date.parse(date))),
  stringArray: z.array(z.string().min(1)).default([]),
  youtubeId: z.string().regex(/^[a-zA-Z0-9_-]{11}$/).optional(),
}
```

**Validation Functions**:
- **Type Guards**: `isValidStoryFrontmatter()`, `isValidBlogpostFrontmatter()`
- **Detailed Validation**: `validateWithSchema()` with error reporting
- **Schema Registry**: Dynamic validation by content type

### 3. Content Processing

```typescript
interface ProcessingResult<T> {
  success: boolean;
  data?: MarkdocFile<T>;
  error?: string;
  ignored?: boolean;
}
```

**Processing Options**:
- **Ignore Flag**: Skip files with `ignore: true`
- **Error Handling**: Continue processing on individual failures
- **Context**: Error debugging information

## Content Metadata Structure

### File Structure
```
content-repository/
├── blog/
│   ├── revenue-operations-guide.md
│   └── client-success-metrics.md
├── stories/
│   ├── saas-transformation.md
│   └── ecommerce-optimization.md
└── legal/
    ├── privacy-policy.md
    └── terms-of-service.md
```

### Markdown File Format
```markdown
---
title: "Revenue Operations Best Practices"
description: "Complete guide to implementing RevOps"
author: "Jerome Boileux"
date: "2024-01-15"
tags: ["revops", "strategy", "automation"]
read: "8 min"
image: "/blog/revops-guide.jpg"
---

# Article Content

Article content in Markdoc format...
```

## Data Relationships

### Taxonomy Relationships
- **Tags**: Many-to-many relationship between content and categories
- **Tools**: Many-to-many relationship between stories and technologies
- **Authors**: One-to-many relationship between authors and blog posts

### Content Linking
- **Internal Links**: Markdown links between related content
- **Cross-References**: Related stories/posts suggested by tags
- **Category Navigation**: Tag-based content discovery

## Data Validation & Quality

### Validation Rules
1. **Required Fields**: All non-optional fields must be present and non-empty
2. **Date Format**: Must be valid ISO date strings or parseable dates
3. **YouTube IDs**: Must match YouTube video ID format (11 alphanumeric characters)
4. **Arrays**: All array items must be non-empty strings
5. **Unknown Fields**: Logged as warnings for cleanup purposes

### Quality Assurance
```typescript
// Example validation with detailed error reporting
const validationResult = Validators.story(frontmatter, 'story-slug');

if (!validationResult.success) {
  console.error('Validation errors:', validationResult.issues);
  // Handle validation failure gracefully
}
```

### Data Migration Support
- **Schema Evolution**: Zod schemas support gradual migration
- **Backward Compatibility**: Type guards maintain existing interfaces
- **Unknown Field Detection**: Warnings for deprecated fields

## Caching & Performance

### Content Caching Strategy
```typescript
interface CacheStrategy {
  fresh: number;      // Cache fresh duration (seconds)
  staleWhileRevalidate: number;  // Stale-while-revalidate duration
}

// Cache strategies by content type
const cacheStrategies = {
  blogPost: { fresh: 3600, staleWhileRevalidate: 86400 },    // 1h fresh, 24h SWR
  story: { fresh: 3600, staleWhileRevalidate: 86400 },       // 1h fresh, 24h SWR
  static: { fresh: 86400, staleWhileRevalidate: 604800 },    // 24h fresh, 7d SWR
};
```

### Performance Optimizations
- **Batch Loading**: Multiple files loaded efficiently
- **Lazy Processing**: Content processed on-demand
- **Edge Caching**: Global CDN distribution
- **Selective Loading**: Only required fields processed

## External Data Integration

### GitHub API Integration
```typescript
// GitHub content fetching
interface GitHubContentResponse {
  name: string;
  path: string;
  content: string;  // Base64 encoded
  type: 'file' | 'dir';
}
```

### Environment Configuration
```typescript
interface ContentSourceConfig {
  source: 'github' | 'filesystem';
  github?: {
    accessToken: string;
    baseUrl: string;
    timeout?: number;
    batchSize?: number;
  };
  filesystem?: {
    basePath: string;
  };
}
```

## Error Handling & Data Integrity

### Error States
```typescript
type ContentFetchState = 
  | 'success'           // Content loaded successfully
  | 'not_found'         // File/content not found
  | 'validation_error'  // Schema validation failed
  | 'source_error'      // GitHub/filesystem error
  | 'ignored';          // File marked as ignored
```

### Graceful Degradation
- **Missing Content**: Empty arrays returned instead of errors
- **Validation Failures**: Content skipped with detailed logging
- **Source Failures**: Fallback to empty state with error flags
- **Network Issues**: Cached content served when possible

This data model provides:
- **Type Safety**: Full TypeScript integration with Zod validation
- **Flexibility**: Easy content model evolution
- **Performance**: Edge caching and efficient processing
- **Maintainability**: Clear separation between content and code