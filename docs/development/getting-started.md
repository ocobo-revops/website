# Getting Started Guide

## Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** (recommended package manager)
- **Git** for version control

## Installation

### 1. Clone the project

```bash
git clone <repository-url>
cd ocobo-website
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Generate style system

```bash
pnpm prepare
```

## Environment Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Content Source (local for dev, github for prod)
CONTENT_SOURCE=locale

# To use GitHub as source (optional in dev)
GITHUB_ACCOUNT=your-account
GITHUB_REPO=your-content-repo
GITHUB_ACCESS_TOKEN=your-token
GITHUB_BRANCH=main

# AGO Chat widget (optional)
AGO_API_KEY=your-key
AGO_BASEPATH=your-base-path
```

### Content Sources

#### Local Development (Recommended)

```bash
# Uses local files from ~/projects/ocobo-posts/
pnpm dev:local
```

#### Development with GitHub

```bash
# Uses GitHub API (like production)
pnpm dev:github
```

## Essential Commands

### Development

```bash
# Start development server
pnpm dev                 # Automatic source based on CONTENT_SOURCE
pnpm dev:local          # Force use of local files
pnpm dev:github         # Force use of GitHub API

# Generate style system (after token changes)
pnpm prepare

# Code verification
pnpm check              # Linting and formatting
pnpm check:fix          # Automatic fix
pnpm typecheck          # Type verification
```

### Tests

```bash
pnpm test               # Unit tests
pnpm test:watch        # Tests in watch mode
pnpm test:coverage     # Code coverage
```

### Production

```bash
pnpm build             # Production build
pnpm start             # Start production server
pnpm build:analyze     # Bundle analysis
```

## Project Structure

```
├── app/                 # Application code
│   ├── routes/         # React Router routes
│   ├── components/     # React components
│   ├── modules/        # Business logic
│   └── localization/   # Internationalization
├── preset/             # Panda CSS design system
├── docs/               # Documentation
├── public/             # Static assets
└── locales/            # Translation files
```

## Development Workflow

### 1. Understand the Architecture

- Consult the [Architecture Overview](../architecture/overview.md)
- Explore the [Component Inventory](component-inventory.md)

### 2. Developing New Features

1. **Analyze** existing components
2. **Create** or modify necessary components
3. **Test** with `pnpm test`
4. **Verify** quality with `pnpm check`
5. **Validate** types with `pnpm typecheck`

### 3. Styling with Panda CSS

```typescript
// Using design tokens
import { css } from '@ocobo/styled-system/css';
import { Button } from '@ocobo/styled-system/jsx';

// Dynamic styles
const dynamicStyle = css({
  backgroundColor: 'coral.light',
  padding: 'md',
});

// Components with recipes
<Button variant="primary" size="md">Click me</Button>
```

### 4. Content Management

```typescript
// Fetching content
import { fetchBlogposts } from '~/modules/content';

export const loader = createHybridLoader(async () => {
  const [status, state, data] = await fetchBlogposts();
  return { posts: data || [] };
}, 'blogPost');
```

## Common Troubleshooting

### Build Errors

```bash
# Clean and regenerate
rm -rf node_modules .react-router build
pnpm install
pnpm prepare
pnpm build
```

### Cache Issues in Development

```bash
# Add ?refresh=1 to the URL
http://localhost:3000/blog?refresh=1
```

### Type Errors

```bash
# Regenerate React Router types
pnpm typecheck
```

## Useful Resources

- **[Operational Guide](operational-guide.md)** - Advanced commands and deployment
- **[API Contracts](../api/contracts.md)** - Endpoint documentation
- **[Component Inventory](component-inventory.md)** - UI component catalog
- **[Architecture](../architecture/patterns.md)** - Patterns and best practices

## Help and Support

- **Documentation:** Check files in `/docs`
- **Issues:** Create a ticket to report problems
- **Code Review:** Follow standards defined by Biome

---

Happy coding! 🚀
