# Ocobo - React Router v7 Application

A modern React Router v7 application with internationalization support, built with Panda CSS and deployed on Vercel. This RevOps consulting platform serves French and English markets with a content-driven architecture.

## Quick Start

```bash
# Install dependencies
pnpm install

# Generate CSS styles (required after install)
pnpm prepare

# Start development server
pnpm dev
```

## Documentation

### 📚 For Developers

- **[Getting Started](docs/development/getting-started.md)** - Complete setup and development guide
- **[Official Documentation](docs/)** - Comprehensive project documentation

### 🤖 For AI Agents

- **[AGENTS.md](AGENTS.md)** - Primary AI entry point with role-based navigation and constraints
- **[CLAUDE.md](CLAUDE.md)** - Quick reference for Claude Code
- Supports development, business analysis, architecture, design, and integration agents

## Tech Stack

- **React Router v7** - Full-stack React framework with SSR
- **Panda CSS** - Type-safe CSS-in-JS with atomic CSS generation
- **React i18next** - French/English internationalization
- **TypeScript** - Type-safe development with automatic type generation
- **Biome** - Code formatting and linting
- **Vercel** - Edge deployment with intelligent caching

## Development Commands

```bash
pnpm dev          # Start development server (auto-detects content source)
pnpm dev:local    # Development with local filesystem content
pnpm dev:github   # Development with GitHub API content
pnpm build        # Build for production
pnpm start        # Start production server
pnpm check        # Check code quality (Biome)
pnpm check:fix    # Auto-fix formatting/linting
pnpm typecheck    # Type checking with route type generation
pnpm prepare      # Generate Panda CSS styles
pnpm test         # Run tests with coverage
```

## Project Structure

```
├── docs/                 # 📚 Official documentation
│   ├── architecture/     # System design and patterns
│   ├── development/      # Developer guides
│   ├── api/             # API and data documentation
│   └── project/         # Business context
├── app/                 # ⚛️ React Router v7 application
│   ├── routes/          # File-based routing with i18n
│   ├── components/      # React components (atomic design)
│   ├── modules/         # Business logic and content management
│   └── localization/    # i18n configuration
├── preset/              # 🎨 Panda CSS design system
│   ├── tokens/          # Design tokens (colors, typography, spacing)
│   ├── recipes/         # Component style variants
│   ├── patterns/        # Layout patterns
│   └── slot-recipes/    # Multi-part component recipes
├── locales/             # 🌍 Translation files (fr/en)
├── public/              # 🌐 Static assets and media
└── @ocobo/styled-system/ # 🤖 Generated Panda CSS output
```

## Key Features

### 🌍 Internationalization

- **French** (default): `/`
- **English**: `/en/`
- **Server-side** language detection and rendering
- **Translation files** in `locales/fr/` and `locales/en/`

### 📝 Content Management

- **Dual source**: GitHub API (production) / Filesystem (development)
- **Markdoc** parsing with TypeScript validation
- **Content types**: Blog posts, client stories, legal pages
- **Automatic** content validation with Zod schemas

### ⚡ Performance & Caching

- **Server-side rendering** with React Router v7
- **Edge caching** via Vercel with stale-while-revalidate
- **Code splitting** by route for optimal loading
- **Asset optimization** with automatic image optimization

### 🎨 Design System

- **Panda CSS** for type-safe styling with zero runtime overhead
- **Design tokens** for consistent theming
- **Component recipes** for style variations
- **Responsive design** with mobile-first approach

## Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# Content source (locale for dev, github for prod)
CONTENT_SOURCE=locale

# GitHub API configuration (for content fetching)
GITHUB_ACCOUNT=your-account
GITHUB_REPO=your-content-repo
GITHUB_ACCESS_TOKEN=your-token
GITHUB_BRANCH=main

# Optional integrations
AGO_API_KEY=your-ago-key
AGO_BASEPATH=your-ago-basepath
```

### Content Sources

```bash
# Local development (recommended)
CONTENT_SOURCE=locale pnpm dev:local

# GitHub API development (production-like)
CONTENT_SOURCE=github pnpm dev:github
```

## Deployment

### Vercel (Production)

The application is optimized for Vercel deployment with:

- **Automatic builds** on push to main branch
- **Edge caching** for GitHub content with configurable TTL
- **Environment-based** content source switching
- **Branch deployments** for feature testing

```bash
vercel deploy
```

### Performance Monitoring

- **Vercel Analytics** for usage insights
- **Speed Insights** for Core Web Vitals
- **Bundle analysis** with `pnpm build:analyze`

## Development Tips

### Cache Management

```bash
# Bypass cache during development/testing
http://localhost:3000/blog?refresh=1

# Clear build cache
rm -rf build .react-router node_modules/.cache
```

### Content Development

- **Local content**: Store in `~/projects/ocobo-posts/`
- **GitHub content**: Use branch-specific content with `GITHUB_BRANCH`
- **Content validation**: Automatic Zod schema validation

### Styling Development

```bash
# Regenerate styles after token changes
pnpm prepare

# Use design tokens in components
import { css } from '@ocobo/styled-system/css';
```

## Contributing

1. Read the [Getting Started Guide](docs/development/getting-started.md)
2. Follow code quality standards (Biome configuration)
3. Maintain test coverage (80% threshold)
4. Update documentation for significant changes

## Architecture

This application follows a **component-based layered architecture** with:

- **Server-first** state management via URL and React Router loaders
- **Content-as-data** approach with Markdown and GitHub integration
- **Type-safe** styling with Panda CSS and design tokens
- **Edge-optimized** deployment with intelligent caching

For detailed architectural information, see [docs/architecture/overview.md](docs/architecture/overview.md).

---

**Need help?** Check the [documentation](docs/) or [AGENTS.md](AGENTS.md) for AI-assisted development guidance.
