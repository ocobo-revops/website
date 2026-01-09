# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> [!IMPORTANT]
> **For comprehensive guidance, see [AGENTS.md](AGENTS.md)** — the primary AI agent entry point with role-based navigation, constraints, and verification protocols.

## Quick Commands

```bash
pnpm dev:local    # Local development with filesystem content
pnpm dev:github   # Development with GitHub API content
pnpm check        # Code quality (Biome)
pnpm typecheck    # TypeScript validation
pnpm test         # Run tests
```

## Critical Rules

1. **Do NOT create files** unless absolutely necessary — prefer editing existing files
2. **Do NOT create documentation** (*.md, README) unless explicitly requested
3. **Check existing components** in [Component Inventory](docs/development/component-inventory.md) before creating new ones
4. **Follow patterns** documented in [Architecture Patterns](docs/architecture/patterns.md)
5. **Run `pnpm check && pnpm typecheck`** before completing any work

## Key Documentation

| Purpose             | Document                                                                           |
| ------------------- | ---------------------------------------------------------------------------------- |
| **AI Navigation**   | [AGENTS.md](AGENTS.md)                                                             |
| **Getting Started** | [docs/development/getting-started.md](docs/development/getting-started.md)         |
| **Architecture**    | [docs/architecture/overview.md](docs/architecture/overview.md)                     |
| **Components**      | [docs/development/component-inventory.md](docs/development/component-inventory.md) |
| **Data Schemas**    | [app/modules/schemas.ts](app/modules/schemas.ts)                                   |

## Content Sources

- **Local**: `CONTENT_SOURCE=locale` — uses `~/projects/ocobo-posts/`
- **GitHub**: `CONTENT_SOURCE=github` — fetches from GitHub API
- **Branch**: Set `GITHUB_BRANCH=offers` to test placeholder offers

---

*For detailed guidance by agent type (dev, analyst, architect, etc.), see [AGENTS.md](AGENTS.md).*
