# Development & Operational Guide

*Generated: 2026-01-08*
*Project: OCOBO Website*

## Development Commands

### Core Development Scripts
| Command | Purpose | Usage |
|---------|---------|-------|
| `pnpm dev` | Start development server | Local development with filesystem content source |
| `pnpm dev:local` | Development with local content | Uses content from `~/projects/ocobo-posts/` |
| `pnpm dev:github` | Development with GitHub content | Fetches content from GitHub repository |
| `pnpm build` | Production build | Generates optimized build for deployment |
| `pnpm build:analyze` | Build with bundle analysis | Analyzes bundle size and dependencies |
| `pnpm start` | Start production server | Runs built application |

### Code Quality & Testing
| Command | Purpose | Usage |
|---------|---------|-------|
| `pnpm check` | Run Biome linting/formatting | Full code quality check |
| `pnpm check:error` | Show only error-level issues | CI-compatible error checking |
| `pnpm check:fix` | Auto-fix formatting issues | Applies automatic fixes |
| `pnpm test` | Run tests in watch mode | Interactive testing during development |
| `pnpm test:run` | Run tests once | CI test execution |
| `pnpm test:coverage` | Run tests with coverage | Generates coverage reports |
| `pnpm typecheck` | Type checking | Validates TypeScript and generates types |

### Build System
| Command | Purpose | Usage |
|---------|---------|-------|
| `pnpm prepare` | Generate Panda CSS styled system | Required before first run or after style changes |

### Prerequisites
- **Node.js**: >= 22.0.0 (specified in package.json engines)
- **Package Manager**: pnpm (preferred) or npm
- **Environment Variables**: See Configuration section below

## Configuration

### Environment Variables

#### Required for Development
```bash
# Content source selection
CONTENT_SOURCE=locale  # Use local filesystem (default for dev)
# or
CONTENT_SOURCE=github  # Use GitHub API

# For GitHub content source
GITHUB_ACCOUNT="wab"
GITHUB_REPO="ocobo-posts"
GITHUB_ACCESS_TOKEN="your-github-token"
GITHUB_BRANCH="main"  # Default branch, can override for feature testing
```

#### Third-Party Integrations (Optional)
```bash
# AGO Chatbot Integration
AGO_API_KEY="your-ago-api-key"
AGO_BASEPATH="https://your-ago-instance.com"
```

### Content Source Testing

The application supports multiple content sources for different environments:

1. **Local Filesystem** (Development Default)
   - Command: `pnpm dev:local` or set `CONTENT_SOURCE=locale`
   - Sources content from: `~/projects/ocobo-posts/`
   - No caching applied
   - Instant file updates

2. **GitHub API** (Production/Testing)
   - Command: `pnpm dev:github` or set `CONTENT_SOURCE=github`
   - Fetches from GitHub repository
   - Vercel Edge Cache applied
   - Branch targeting via `GITHUB_BRANCH`

3. **Branch-Specific Testing**
   - Set `GITHUB_BRANCH=offers` to test placeholder offers
   - Defaults to `main` branch if not specified

### Cache Strategy

The application implements an intelligent caching strategy:

- **Local Development**: No caching (immediate file updates)
- **Production**: Vercel Edge Cache with configurable TTL
- **Cache Bypass**: Add `?refresh=1` to any URL
- **Cache Strategies**:
  - Blog posts: 1 hour fresh, 24 hours stale-while-revalidate
  - Client stories: 1 hour fresh, 24 hours stale-while-revalidate
  - Static content: 24 hours fresh, 7 days stale-while-revalidate

## Deployment Configuration

### Vercel Deployment

The application is designed for Vercel deployment with the following configuration:

#### Production Environment
```json
{
  "env": {
    "GITHUB_ACCOUNT": "wab",
    "GITHUB_REPO": "ocobo-posts",
    "GITHUB_BRANCH": "main",
    "CONTENT_SOURCE": "github"
  }
}
```

#### Preview Environments
```json
{
  "env": {
    "GITHUB_ACCOUNT": "wab", 
    "GITHUB_REPO": "ocobo-posts",
    "GITHUB_BRANCH": "offers",
    "CONTENT_SOURCE": "github"
  }
}
```

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/test.yml`) provides:

#### Jobs
1. **Lint Job**
   - Runs on: `ubuntu-latest`
   - Node.js: 22.x
   - Package manager: pnpm
   - Commands: `pnpm check:error`

2. **Format Job**
   - Runs on: `ubuntu-latest`
   - Node.js: 22.x
   - Package manager: pnpm
   - Commands: `pnpm check`

3. **Test Job**
   - Runs on: `ubuntu-latest`
   - Node.js: 22.x
   - Package manager: pnpm
   - Commands: `pnpm test:run`, `pnpm test:coverage`

#### Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

#### Pipeline Steps
1. Checkout code
2. Setup pnpm
3. Setup Node.js with cache
4. Install dependencies (`--no-frozen-lockfile`)
5. Generate styled system (`pnpm prepare`)
6. Run quality checks/tests

### Deployment Features

- **Analytics**: Google Analytics, Clearbit, HubSpot (production only)
- **Vercel Integrations**: Analytics and Speed Insights
- **Global Edge Caching**: Automatic geographic optimization
- **Branch Deployments**: Preview environments for feature testing

## Development Workflow

### Initial Setup
```bash
# 1. Clone repository
git clone [repository-url]
cd ocobo-website

# 2. Install dependencies
pnpm install

# 3. Generate styled system
pnpm prepare

# 4. Set up environment
cp .env.example .env.local
# Configure environment variables

# 5. Start development
pnpm dev
```

### Daily Development
```bash
# Start development server
pnpm dev

# Run tests in watch mode
pnpm test

# Check code quality
pnpm check

# Fix formatting issues
pnpm check:fix
```

### Before Deployment
```bash
# Run full quality checks
pnpm check:error

# Run all tests
pnpm test:run

# Generate types and validate
pnpm typecheck

# Test production build
pnpm build
```

## Architecture Support

### Technology Stack
- **Framework**: React Router v7 (evolved from Remix)
- **Language**: TypeScript
- **Styling**: Panda CSS (CSS-in-JS with atomic generation)
- **Internationalization**: React i18next (French/English)
- **Code Quality**: Biome (formatting and linting)
- **Testing**: Vitest with coverage
- **Build Tool**: Vite

### Project Structure
- **Monolith Architecture**: Single cohesive codebase
- **File-based Routing**: React Router v7 conventions
- **Content Management**: GitHub-based with fallback to filesystem
- **Component Organization**: Modular structure with design system

### Integration Points
- **External APIs**: GitHub API for content, HubSpot for forms
- **Third-party Services**: AGO Chatbot (optional)
- **Analytics**: Multiple providers (production only)
- **CDN**: Vercel Edge Network

## Troubleshooting

### Common Issues

1. **Styled System Not Generated**
   - Solution: Run `pnpm prepare`
   - When: After style changes or first setup

2. **Content Not Loading**
   - Check `CONTENT_SOURCE` environment variable
   - Verify GitHub credentials if using GitHub source
   - Ensure content repository is accessible

3. **Type Errors**
   - Run `pnpm typecheck` to generate types
   - Ensure Panda CSS types are generated (`pnpm prepare`)

4. **Cache Issues in Development**
   - Use `?refresh=1` parameter to bypass cache
   - Check content source configuration

### Performance Monitoring
- Vercel Dashboard: Function execution times and cache hit rates
- Browser DevTools: Core Web Vitals and loading performance
- Coverage Reports: Generated in `coverage/` directory

This development and operational guide provides comprehensive instructions for working with the OCOBO website, from initial setup to production deployment and monitoring.