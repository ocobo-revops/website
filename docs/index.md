# OCOBO Website Documentation

Official documentation for the OCOBO project - React Router v7 application with internationalization and GitHub content management.

## Overview

- **Type:** React Router v7 Monolith
- **Technologies:** TypeScript, Panda CSS, Vercel, GitHub API
- **Architecture:** Component-based Layered Architecture with SSR
- **Deployment:** Vercel Edge with intelligent caching

## Documentation Structure

### 🏗️ Architecture

- **[Overview](architecture/overview.md)** - Global architectural vision
- **[Architectural Patterns](architecture/patterns.md)** - Design patterns and principles
- **[Technology Stack](architecture/technology-stack.md)** - Technologies and justifications
- **[Source Tree](architecture/source-tree.md)** - Code structure and organization

### 👨‍💻 Development

- **[Getting Started](development/getting-started.md)** - First steps for developers
- **[Operational Guide](development/operational-guide.md)** - Commands and deployment
- **[Component Inventory](development/component-inventory.md)** - UI component catalog
- **[Cache Strategy](development/cache-strategy.md)** - Hybrid cache implementation
- **[Deployment Strategies](development/deployment-strategies.md)** - Vercel and branch configuration

### 🔌 API & Data

- **[API Contracts](api/contracts.md)** - Endpoints and integrations
- **[Data Models](api/data-models.md)** - Data structure and validation
- **[State Management](api/state-management.md)** - State management patterns

### 📋 Project

- **[Overview](project/overview.md)** - Project context and objectives

## For Developers

### Quick Start

```bash
# Installation
pnpm install

# Local development with local content
pnpm dev:local

# Development with GitHub content
pnpm dev:github

# Production build
pnpm build
```

### Main Entry Points

- **Architecture:** Consult [Architectural Patterns](architecture/patterns.md)
- **Development:** Start with the [Operational Guide](development/operational-guide.md)
- **API:** Refer to [API Contracts](api/contracts.md)

## For AI Assistance

This documentation is optimized for AI assistance in developing new features. Refer to the appropriate sections based on the development type:

- **UI/UX:** [Component Inventory](development/component-inventory.md) + [Patterns](architecture/patterns.md)
- **Backend:** [API](api/contracts.md) + [Data](api/data-models.md)
- **Architecture:** [Technology Stack](architecture/technology-stack.md) + [Source Tree](architecture/source-tree.md)

---

*Documentation generated on January 8, 2026 - Maintained by the OCOBO team*
