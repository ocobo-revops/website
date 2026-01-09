# OCOBO Website - Project Overview

*Generated: 2026-01-08*

## Project Summary

**OCOBO** is a React Router v7 web application serving as the company website for OCOBO, a revenue operations consultancy. The application features internationalization support (French/English), content management through GitHub, and modern full-stack React architecture.

## Executive Summary

The OCOBO website is built with React Router v7 (evolved from Remix), implementing server-side rendering, file-based routing, and a sophisticated content management system. The architecture supports global deployment through Vercel's edge network with intelligent caching strategies.

### Key Features

- **Bilingual Support**: French (default) and English internationalization
- **Content Management**: Hybrid system supporting both local filesystem and GitHub API
- **Modern Styling**: Panda CSS for type-safe, atomic CSS generation
- **Performance**: Server-side rendering with edge caching
- **Accessibility**: Built on Radix UI primitives for inclusive design

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | React Router v7 | Full-stack React with SSR and file-based routing |
| **Language** | TypeScript | Type safety and enhanced developer experience |
| **Styling** | Panda CSS | CSS-in-JS with atomic CSS generation |
| **Content Processing** | Markdoc | Markdown parsing and rendering |
| **Internationalization** | React i18next | Multi-language support |
| **Testing** | Vitest | Unit testing with coverage |
| **Code Quality** | Biome | Linting and formatting |
| **Deployment** | Vercel | Edge deployment and global CDN |

## Architecture Classification

**Type**: Monolith Web Application
**Pattern**: Layered Component Architecture with SSR
**Deployment**: Edge-first with global CDN
**Content**: GitHub-based headless CMS

## Repository Structure

```markdown
ocobo-website/                 # Single cohesive codebase
├── app/                      # Main application code
│   ├── routes/              # File-based routing
│   ├── components/          # React components
│   ├── modules/             # Business logic
│   └── localization/        # i18n configuration
├── preset/                  # Panda CSS design system
├── @ocobo/styled-system/    # Generated CSS utilities
├── public/                  # Static assets
└── locales/                 # Translation files
```

## Content Architecture

### Content Sources

- **Development**: Local filesystem (`~/projects/ocobo-posts/`)
- **Production**: GitHub API with branch targeting
- **Content Types**: Blog posts, client stories, static pages, legal documents

### Content Processing Flow

```markdown
Content Source → Markdoc Parser → React Components → SSR → Client
```

## Key Integrations

### External APIs

- **GitHub API**: Content fetching with authentication
- **HubSpot API**: Contact form submission
- **AGO Chatbot**: Optional customer support widget

### Third-Party Services

- **Vercel Analytics**: Performance monitoring
- **Google Analytics**: Usage tracking (production)
- **Clearbit**: Lead enrichment (production)

## Development Environment

### Prerequisites

- Node.js >= 22.0.0
- pnpm package manager
- GitHub access token (for content)

### Quick Start

```bash
pnpm install
pnpm prepare    # Generate styled system
pnpm dev        # Start development server
```

## Deployment Strategy

### Environments

- **Production**: `CONTENT_SOURCE=github, GITHUB_BRANCH=main`
- **Preview**: `CONTENT_SOURCE=github, GITHUB_BRANCH=offers`
- **Development**: `CONTENT_SOURCE=locale`

### Performance Features

- Global edge caching via Vercel
- Automatic code splitting
- Server-side rendering
- Progressive enhancement

## Quality Assurance

### Automated Testing

- **Unit Tests**: Vitest with coverage reporting
- **Code Quality**: Biome linting and formatting
- **Type Safety**: TypeScript strict mode
- **CI/CD**: GitHub Actions pipeline

### Performance Monitoring

- Core Web Vitals tracking
- Vercel Analytics integration
- Function execution monitoring
- Cache hit rate optimization

## Project Navigation

### Architecture & Design

- [Architecture Overview](../architecture/overview.md) - System design principles
- [Architecture Patterns](../architecture/patterns.md) - Implementation patterns
- [Technology Stack](../architecture/technology-stack.md) - Technologies and versions
- [Source Tree](../architecture/source-tree.md) - Code organisation

### API & Data

- [API Contracts](../api/contracts.md) - Endpoint documentation
- [Data Models](../api/data-models.md) - Schema and validation
- [State Management](../api/state-management.md) - State patterns

### Development

- [Getting Started](../development/getting-started.md) - Setup guide
- [Operational Guide](../development/operational-guide.md) - Commands and deployment
- [Cache Strategy](../development/cache-strategy.md) - Caching implementation
- [Deployment Strategies](../development/deployment-strategies.md) - Vercel configuration

### Root Files

- [README](../../README.md) - Project introduction and setup
- [AGENTS.md](../../AGENTS.md) - AI agent navigation and guidelines

## Getting Started

### For Developers

1. **Setup**: Follow development guide for initial setup
2. **Content**: Configure content source (local vs GitHub)
3. **Development**: Use `pnpm dev` for local development
4. **Quality**: Run `pnpm check && pnpm test` before commits

### For Content Managers

1. **Local Content**: Edit files in `~/projects/ocobo-posts/`
2. **Production Content**: Update GitHub repository
3. **Preview**: Use branch-specific deployments for testing

### For Designers

1. **Design System**: Explore `preset/` directory for tokens and patterns
2. **Components**: Review `app/components/ui/` for base components
3. **Styling**: Use Panda CSS recipes and patterns

This project overview provides a comprehensive introduction to the OCOBO website architecture, designed to support rapid development while maintaining high performance and accessibility standards.
