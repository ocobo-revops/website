# Technology Stack Analysis - Main Application

## Core Framework & Architecture

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Framework** | React Router v7 | ^7.8.1 | Modern full-stack React framework (evolved from Remix), provides SSR, file-based routing, and optimized data loading |
| **Language** | TypeScript | ^5.9.2 | Type safety, enhanced developer experience, automatic type generation for routes |
| **Build Tool** | Vite | ^5.4.13 | Fast development server, optimized production builds, native ES modules |
| **Runtime** | Node.js | >=22.0.0 | Server-side rendering, modern JavaScript features |

## Styling & Design System

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **CSS Framework** | Panda CSS | ^0.37.2 | Type-safe CSS-in-JS with atomic CSS generation, zero-runtime overhead |
| **Design System** | Custom Panda Preset | - | Comprehensive design tokens, recipes, and patterns for consistent UI |
| **Animation** | Framer Motion | ^12.23.12 | React animation library for complex interactions and micro-animations |
| **UI Components** | Ark UI | ^5.30.0 | Accessible, unstyled UI primitives (Accordion, Select, ScrollArea). NavigationMenu still on Radix. |

## Internationalization

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **i18n Core** | React i18next | ^15.6.1 | React integration for internationalization with SSR support |
| **i18n Framework** | i18next | ^25.3.6 | Full-featured internationalization framework |
| **Detection** | i18next-browser-languagedetector | ^8.2.0 | Automatic language detection in browser |
| **Remix Integration** | remix-i18next | ^7.2.1 | Server-side i18n integration for React Router/Remix |

## Content Management & Data Processing

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Markdown Processing** | Markdoc | ^0.5.4 | Structured markdown parser with component rendering |
| **GitHub Integration** | @octokit/rest | ^22.0.0 | GitHub API client for fetching content from repositories |
| **YAML Processing** | js-yaml | ^4.1.0 | YAML parsing for frontmatter and configuration |
| **Schema Validation** | Zod | ^4.0.17 | TypeScript-first schema validation |

## Development & Quality Tools

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Code Quality** | Biome | 1.9.4 | Fast linter and formatter (ESLint + Prettier replacement) |
| **Testing** | Vitest | ^3.2.4 | Fast unit test runner with Vite integration |
| **Coverage** | @vitest/coverage-v8 | ^3.2.4 | Code coverage reporting with V8 provider |
| **Type Checking** | Built-in | - | React Router automatic type generation |

## Infrastructure & Deployment

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Deployment** | Vercel | - | Edge deployment platform with automatic caching |
| **Analytics** | @vercel/analytics | ^1.5.0 | Web analytics and performance monitoring |
| **Performance** | @vercel/speed-insights | ^1.2.0 | Real user monitoring and Core Web Vitals |
| **Storage** | @vercel/blob | ^1.1.1 | File storage for content and assets |

## External Integrations

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Form Processing** | HubSpot API | - | Contact form integration and CRM |
| **Chat Widget** | AGO Chatbot | - | Customer support integration (optional) |
| **Bot Detection** | isbot | ^5.1.30 | Server-side bot detection for analytics |

## Architecture Pattern

**Pattern**: **Component-based Layered Architecture**
- **Presentation Layer**: React components with Panda CSS styling
- **Data Layer**: React Router loaders with caching strategy  
- **Content Layer**: Markdoc processing with GitHub/filesystem sources
- **Infrastructure Layer**: Vercel edge deployment with global caching

## Key Architectural Decisions

1. **Hybrid Content Strategy**: Supports both local filesystem (development) and GitHub API (production)
2. **Edge-First Caching**: Leverages Vercel Edge Cache instead of application-level caching
3. **Type-Safe Styling**: Panda CSS provides compile-time CSS validation
4. **SSR-First i18n**: Server-side internationalization with client hydration
5. **Zero-Config Deployment**: Vercel integration with automatic optimization

## Performance Characteristics

- **Build Time**: Fast (Vite + esbuild)
- **Bundle Size**: Optimized (atomic CSS + tree shaking)
- **Runtime**: Zero-runtime CSS-in-JS
- **Caching**: Edge-distributed with stale-while-revalidate
- **SEO**: Full SSR with meta tag generation