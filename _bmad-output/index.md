# OCOBO Website - AI-Assisted Development Index

*Generated: 2026-01-08*

## Project Documentation Index

### Project Overview

- **Type:** Monolith with 1 part
- **Primary Language:** TypeScript
- **Architecture:** React Router v7 Web Application

### Quick Reference

- **Tech Stack:** React Router v7, TypeScript, Panda CSS, Vercel
- **Entry Point:** `app/root.tsx`
- **Architecture Pattern:** Layered Component Architecture with SSR

## Documentation Structure

### 📚 Official Documentation

All comprehensive documentation has been organized in the `docs/` directory:

#### 🏗️ Architecture & Design

- **[Architecture Overview](../docs/architecture/overview.md)** - System design principles
- **[Architecture Patterns](../docs/architecture/patterns.md)** - Implementation patterns and decisions
- **[Technology Stack](../docs/architecture/technology-stack.md)** - Technology choices and justifications
- **[Source Tree Analysis](../docs/architecture/source-tree.md)** - Code organization and structure

#### 👨‍💻 Development

- **[Getting Started Guide](../docs/development/getting-started.md)** - Complete setup and development workflow
- **[Operational Guide](../docs/development/operational-guide.md)** - Commands, deployment, and operations
- **[Component Inventory](../docs/development/component-inventory.md)** - Complete UI component catalog

#### 🔌 API & Data

- **[API Contracts](../docs/api/contracts.md)** - Endpoint documentation and integration guides
- **[Data Models](../docs/api/data-models.md)** - Schema validation and data structures
- **[State Management](../docs/api/state-management.md)** - State patterns and data flow

#### 📋 Project Context

- **[Project Overview](../docs/project/overview.md)** - Business context and objectives

### 🤖 AI Agent Navigation

- **[AGENTS.md](../AGENTS.md)** - Multi-agent AI entry point with specialized navigation
- **[CLAUDE.md](../CLAUDE.md)** - Claude Code specific guidance and commands

### 📖 Project Information

- **[Project README](../README.md)** - Project introduction and basic setup
- **[Cache Strategy Guide](../docs/development/cache-strategy.md)** - Content caching implementation details
- **[Vercel Branch Strategy](../docs/development/deployment-strategies.md)** - Deployment and branch targeting configuration

## AI-Assisted Development Quick Start

### For Development AI Agents

1. **Architecture Understanding**: Start with [Architecture Overview](../docs/architecture/overview.md)
2. **Component Reference**: Check [Component Inventory](../docs/development/component-inventory.md) before creating new components
3. **Development Setup**: Follow [Getting Started Guide](../docs/development/getting-started.md)
4. **Code Patterns**: Reference [Architecture Patterns](../docs/architecture/patterns.md)

### For Business Analysis AI Agents

1. **Project Context**: Begin with [Project Overview](../docs/project/overview.md)
2. **Technical Context**: Review [Technology Stack](../docs/architecture/technology-stack.md)
3. **API Understanding**: Explore [API Contracts](../docs/api/contracts.md)

### For Architecture AI Agents

1. **System Design**: [Architecture Overview](../docs/architecture/overview.md) + [Architecture Patterns](../docs/architecture/patterns.md)
2. **Technology Decisions**: [Technology Stack](../docs/architecture/technology-stack.md)
3. **Code Organization**: [Source Tree Analysis](../docs/architecture/source-tree.md)

## Development Commands Quick Reference

```bash
# Development
pnpm dev              # Start development server (filesystem content)
pnpm dev:local        # Explicit local content source
pnpm dev:github       # Development with GitHub content

# Build & Deploy
pnpm build            # Production build
pnpm build:analyze    # Build with bundle analysis
pnpm start            # Start production server

# Quality Assurance
pnpm check            # Full code quality check
pnpm check:fix        # Auto-fix formatting issues
pnpm test             # Run tests in watch mode
pnpm test:run         # Single test run (CI)
pnpm test:coverage    # Test with coverage report
pnpm typecheck        # TypeScript validation

# Style System
pnpm prepare          # Generate Panda CSS styled system (required)
```

## Architecture Summary

**OCOBO Website** is a modern React Router v7 application implementing:

- **Server-Side Rendering**: SEO optimization and performance
- **File-Based Routing**: Convention-driven page structure
- **Internationalization**: French (default) and English support
- **Content Management**: Hybrid GitHub/filesystem content sourcing
- **Design System**: Panda CSS with atomic styling and Radix UI components
- **Global Deployment**: Vercel edge network with intelligent caching
- **Type Safety**: Full TypeScript implementation with generated types

## Key Features

- **Bilingual Support**: Automatic language detection with manual override
- **Content Flexibility**: Development-friendly local files, production GitHub API
- **Performance Optimization**: Edge caching, code splitting, progressive enhancement
- **Developer Experience**: Hot reloading, type safety, automated quality checks
- **Accessibility**: Built on accessible Radix UI primitives
- **Monitoring**: Vercel Analytics, Core Web Vitals tracking

## Environment Configuration

### Content Source Testing

- **Local filesystem** (default): `pnpm dev:local` - Uses content from `~/projects/ocobo-posts/`
- **GitHub API**: `pnpm dev:github` - Fetches content from GitHub repository
- **Custom source**: Set `CONTENT_SOURCE=github` or `CONTENT_SOURCE=locale` in `.env.local`
- **Branch targeting**: Set `GITHUB_BRANCH=offers` to test placeholder offers (defaults to `main`)

### Third-Party Integrations

- **AGO Chatbot**: Set `AGO_API_KEY` and `AGO_BASEPATH` in `.env` to enable the chat widget
- **Analytics**: Google Analytics, Clearbit, and HubSpot tracking (production only)
- **Vercel**: Analytics and Speed Insights integration

## Cache Strategy

- **Local Development**: No caching (immediate file updates)
- **Production**: Vercel Edge Cache with 1-hour fresh, 24-hour stale-while-revalidate
- **Cache Bypass**: Add `?refresh=1` parameter to any URL
- **Monitoring**: Cache hit rates available in Vercel Dashboard

## File Structure Overview

```
ocobo-website/
├── docs/                   # 📚 Official documentation (organized)
│   ├── architecture/       # System design documentation
│   ├── development/        # Developer guides and references
│   ├── api/               # API and data documentation
│   └── project/           # Business context
├── app/                   # Main React Router v7 application
│   ├── routes/            # File-based routing with i18n
│   ├── components/        # React components (atomic design)
│   ├── modules/           # Business logic and content management
│   └── localization/      # i18n configuration
├── preset/                # Panda CSS design system
├── @ocobo/styled-system/ # Generated CSS utilities
├── public/               # Static assets and media
├── locales/              # Translation files (fr/en)
└── _bmad-output/         # AI workflow artifacts (this folder)
```

## AI Development Workflow

### For New Feature Development

1. **Read Architecture**: [Architecture Overview](../docs/architecture/overview.md) and [Architecture Patterns](../docs/architecture/patterns.md)
2. **Check Components**: [Component Inventory](../docs/development/component-inventory.md) for existing components
3. **Understand Data**: [Data Models](../docs/api/data-models.md) and [API Contracts](../docs/api/contracts.md)
4. **Follow Patterns**: Use established patterns from architecture documentation

### For Brownfield PRDs

- **Input**: Use `../docs/index.md` as comprehensive project context
- **Reference**: This index for AI-optimized navigation
- **Architecture**: Link to relevant architecture documentation sections

### For UI/UX Development

1. **Design System**: Review [Component Inventory](../docs/development/component-inventory.md)
2. **Patterns**: Check `preset/` directory structure in [Source Tree](../docs/architecture/source-tree.md)
3. **Existing Components**: Analyze `app/components/ui/` organization

This documentation index provides AI agents with optimized navigation and context for efficient development assistance on the OCOBO website project.
