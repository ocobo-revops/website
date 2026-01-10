# AGENTS.md - Multi-Agent AI Entry Point

Welcome AI agents! This file provides specialized navigation and context for different types of AI assistants working on the OCOBO project.

## Project Context

> [!IMPORTANT]
> **Context Efficiency**: Do not read referenced files unless absolutely necessary for your specific task. Use this file as a directory to find the **one** or **two** most relevant documents, rather than ingesting all linked context.

**OCOBO** is a modern React Router v7 application for a RevOps consulting platform with:

- **Architecture**: Component-based layered architecture with SSR
- **Stack**: TypeScript, Panda CSS, Vercel Edge deployment
- **Content**: Dual-source management (GitHub API + Filesystem)
- **i18n**: French/English internationalization
- **Performance**: Edge caching with stale-while-revalidate strategy

## Critical Constraints

> [!CAUTION]
> **Agents MUST follow these rules. Violations cause significant rework.**

### Do NOT

- **Create new files** unless absolutely necessary — prefer editing existing files
- **Create documentation files** (*.md, README) unless explicitly requested
- **Assume patterns** — check [Component Inventory](docs/development/component-inventory.md) and [Architecture Patterns](docs/architecture/patterns.md) first
- **Skip type checking** — always run `pnpm typecheck` before completing work
- **Ignore i18n** — all user-facing text must support French and English
- **Break existing tests** — run `pnpm test` if modifying logic

### Always

- **Read schema source files** before inferring data structures
- **Follow existing patterns** in the codebase
- **Run `pnpm check`** before any commit
- **Consider SSR implications** — server-first architecture

## Search & Discovery Tools

> [!CAUTION]
> **MANDATORY: Use mgrep for all semantic code searches**

### Critical Rule: mgrep Only

**ALWAYS use mgrep for semantic searches in the codebase.** Never use grep, the Grep tool, or ripgrep directly.

mgrep provides semantic understanding of code context, unlike basic text search tools.

### When to Use mgrep

- Searching for concepts or patterns in the codebase
- Finding functions, classes, or variables by name
- Locating module references or imports
- Any search requiring semantic understanding of code
- Exploratory searches to understand project structure

### Syntax

```bash
# Local codebase search
mgrep "query"

# Web search
mgrep --web "query"
```

### Examples

**Correct:**
```bash
mgrep "authentication function"
mgrep "UserService class"
mgrep "i18n configuration"
mgrep --web "React Router 7 migration guide"
```

**Incorrect - DO NOT USE:**
```bash
grep "authentication"        # ❌ Do not use grep
Grep tool pattern="auth"     # ❌ Do not use Grep tool
rg "UserService"             # ❌ Do not use ripgrep
```

## Navigation by Agent Specialization

### 🔨 Development & Code Agents

**Primary Entry**: [CLAUDE.md](CLAUDE.md) - Development commands and workflows
**Documentation**:

- [Architecture Overview](docs/architecture/overview.md) - System design principles
- [Technology Stack](docs/architecture/technology-stack.md) - Complete tech specifications
- [Source Tree Analysis](docs/architecture/source-tree.md) - Code organization and patterns
- [Getting Started Guide](docs/development/getting-started.md) - Setup and development workflow
- [Operational Guide](docs/development/operational-guide.md) - Commands and deployment

**Key Commands**:

```bash
pnpm dev:local    # Local development with filesystem content
pnpm dev:github   # Development with GitHub API content  
pnpm check        # Code quality and linting
pnpm typecheck    # TypeScript validation
```

### 📊 Business Analysis Agents

**Focus**: Market analysis, requirements gathering, competitive research
**Documentation**:

- [Project Overview](docs/project/overview.md) - Business context and objectives
- [Architecture Patterns](docs/architecture/patterns.md) - Business logic organization
- [API Contracts](docs/api/contracts.md) - Business processes and data flows

**Key Insights**:

- RevOps consulting platform targeting French/English markets
- Content-driven approach with GitHub-based content management
- Performance-first architecture for global distribution

### 🏗️ Architecture & Systems Agents

**Focus**: System design, scalability, infrastructure decisions
**Documentation**:

- [Architecture Overview](docs/architecture/overview.md) - Complete system architecture
- [Architecture Patterns](docs/architecture/patterns.md) - Implementation patterns and decisions
- [Technology Stack](docs/architecture/technology-stack.md) - Technology choices and justifications
- [State Management](docs/api/state-management.md) - Server-first state architecture

**Key Decisions**:

- React Router v7 for full-stack SSR capabilities
- Panda CSS for type-safe styling with zero runtime
- Vercel Edge deployment with intelligent caching
- Dual content sources for development flexibility

### 🎨 Design & UX Agents

**Focus**: UI/UX design, component systems, user experience
**Documentation**:

- [Component Inventory](docs/development/component-inventory.md) - Complete UI component catalog
- [Design System](preset/) - Panda CSS tokens, recipes, and patterns
- [Architecture Patterns](docs/architecture/patterns.md) - Component organization patterns

**Design System**:

- **Tokens**: [preset/tokens/](preset/tokens/) - Colors, typography, spacing
- **Recipes**: [preset/recipes/](preset/recipes/) - Component style variants
- **Patterns**: [preset/patterns/](preset/patterns/) - Layout patterns
- **Components**: [app/components/ui/](app/components/ui/) - Reusable UI components

### 🔌 API & Integration Agents

**Focus**: API design, data integration, external services
**Documentation**:

- [API Contracts](docs/api/contracts.md) - Complete endpoint documentation
- [Data Models](docs/api/data-models.md) - Schema validation and data structures
- [State Management](docs/api/state-management.md) - Data flow patterns

**Key Integrations**:

- GitHub API for content management
- HubSpot for form processing
- Vercel Analytics for performance monitoring
- AGO Chatbot for customer support

### 🌍 Content & Localization Agents

**Focus**: Content strategy, internationalization, content management
**Documentation**:

- [API Contracts](docs/api/contracts.md) - Content fetching and processing
- [Data Models](docs/api/data-models.md) - Content schema validation
- [Operational Guide](docs/development/operational-guide.md) - Content source configuration

**Content Architecture**:

- **Sources**: GitHub API (production) / Filesystem (development)
- **Processing**: Markdoc with Zod validation
- **Languages**: French (default) / English
- **Types**: Blog posts, client stories, static pages

### 🧪 Testing & Quality Agents

**Focus**: Test automation, code quality, performance monitoring
**Documentation**:

- [Operational Guide](docs/development/operational-guide.md) - Testing commands and setup
- [Technology Stack](docs/architecture/technology-stack.md) - Testing tools and configuration

**Quality Tools**:

- **Testing**: Vitest with 80% coverage thresholds
- **Linting**: Biome for formatting and code quality
- **Type Safety**: TypeScript with strict configuration
- **Performance**: Vercel Analytics and Speed Insights

## Quick Start for Agents

### For Development Tasks

1. Read [CLAUDE.md](CLAUDE.md) for development commands
2. Check [Getting Started](docs/development/getting-started.md) for setup
3. Review [Component Inventory](docs/development/component-inventory.md) for existing components

### For Analysis Tasks

1. Start with [Project Overview](docs/project/overview.md) for context
2. Review [Architecture Overview](docs/architecture/overview.md) for technical understanding
3. Check [API Contracts](docs/api/contracts.md) for data flows

### For Architecture Tasks

1. Begin with [Architecture Overview](docs/architecture/overview.md)
2. Deep dive into [Architecture Patterns](docs/architecture/patterns.md)
3. Review [Technology Stack](docs/architecture/technology-stack.md) for decisions

## Project Structure

```
├── AGENTS.md               # This file - AI agent navigation
├── CLAUDE.md              # Development-specific AI guidance
├── README.md              # Human-readable project overview
├── docs/                  # Official project documentation
│   ├── architecture/      # System design documentation
│   ├── development/       # Developer guides and references
│   ├── api/              # API and data documentation
│   └── project/          # Business context and overview
├── app/                  # React Router v7 application
├── preset/               # Panda CSS design system
└── locales/              # Internationalization files
```

## 🧬 Key Data Structures

Direct access to the source of truth for data models. **Read these types** before inferring schemas.

### Content Models (Zod Schemas)

- **[app/modules/schemas.ts](app/modules/schemas.ts)** - **CRITICAL**: Contains the exact Zod schemas for `Story`, `Blogpost`, and `Page` frontmatter.
- **[app/modules/content/types.ts](app/modules/content/types.ts)** - Content fetching interfaces and return types.

### Configuration

- **[app/modules/types.ts](app/modules/types.ts)** - Environment variable definitions (`PublicEnvVars`, `PrivateEnvVars`).
- **[vite.config.ts](vite.config.ts)** - Build configuration.

## ✅ Verification Protocols

Agents **must** verify their work using these specific commands.

### 1. Code Quality (Pre-submission)

Run this before confirming any code change:

```bash
pnpm check      # Runs Biome (Format + Lint)
pnpm typecheck  # Validates TypeScript types (Strict)
```

### 2. Testing

If modifying logic, run related tests:

```bash
pnpm test               # Run all unit tests
pnpm test run <file>    # Run specific test file
```

### 3. Visual/Runtime Verification

If modifying UI or Routes:

1. Start dev server: `pnpm dev:local`
2. **Action**: Verify no console errors in browser or terminal.
3. **Action**: Verify hydration works (interactive elements functional).

## Best Practices for AI Agents

1. **Always read relevant documentation** before making assumptions
2. **Follow existing patterns** found in the component inventory and architecture
3. **Respect the type system** - this project prioritizes type safety
4. **Consider internationalization** - support French and English
5. **Maintain performance** - follow SSR and caching patterns
6. **Test thoroughly** - use existing test patterns and coverage requirements

## Recent Changes

To understand what has changed recently in the codebase:

```bash
# Recent commits
git log --oneline -20

# Changes to specific area
git log --oneline -10 -- app/modules/

# What changed in a file
git log --oneline -5 -- <filepath>
```

> [!TIP]
> Before making significant changes, check recent git history to understand the current direction and avoid conflicts with in-progress work.

---

*This project welcomes AI assistance across all domains. Reference this file for optimal context and navigation.*
