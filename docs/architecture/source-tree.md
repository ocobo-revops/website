# Source Tree Analysis - Main Application

## Project Structure Overview

This React Router v7 application follows a **modular monolith architecture** with clear separation of concerns and a focus on performance and maintainability.

```
ocobo-website/
├── app/                          # 🚀 Main application code (React Router v7)
│   ├── routes/                   # 📄 File-based routing (18 routes)
│   │   ├── _main.tsx             # 🏗️  Main layout wrapper
│   │   ├── _main.($lang).*       # 🌍 Internationalized routes (FR/EN)
│   │   ├── _main.blog.*          # 📝 Blog routes (listing + individual posts)
│   │   ├── _main.clients.*       # 👥 Client stories routes
│   │   ├── robots[.txt].tsx      # 🤖 SEO: Robots.txt generator
│   │   └── sitemap[.xml].tsx     # 🔗 SEO: Dynamic sitemap generator
│   │
│   ├── components/               # 🧩 Reusable React components
│   │   ├── ui/                   # 🎨 Base UI components (atoms)
│   │   │   ├── Button.tsx        # 🔘 Styled button with Panda CSS variants
│   │   │   ├── Accordion.tsx     # 📋 Radix UI accordion wrapper
│   │   │   ├── NavigationMenu.tsx # 🧭 Radix UI navigation with i18n
│   │   │   └── Card.tsx          # 📇 Content display cards
│   │   │
│   │   ├── homepage/             # 🏠 Homepage-specific components (molecules)
│   │   │   ├── Hero.tsx          # 🎯 Hero section with animations
│   │   │   ├── Stories.tsx       # 📚 Featured client stories
│   │   │   └── Tools.tsx         # 🛠️ Tools carousel component
│   │   │
│   │   ├── blog/                 # 📖 Blog-specific components
│   │   │   ├── BlogList.tsx      # 📋 Blog post listing with filtering
│   │   │   ├── BlogItem.tsx      # 📄 Individual blog post preview
│   │   │   └── PostHeader.tsx    # 📌 Blog post header with meta
│   │   │
│   │   ├── stories/              # 🗣️ Client story components
│   │   │   ├── StoryList.tsx     # 📜 Client story listing
│   │   │   ├── StoryArticle.tsx  # 📰 Full story display
│   │   │   └── StoryMetas.tsx    # ℹ️  Story metadata display
│   │   │
│   │   ├── ContactForm.tsx       # 📧 HubSpot-integrated contact form
│   │   ├── Header.tsx            # 📱 Site header with navigation
│   │   └── Footer.tsx            # 📍 Site footer with links
│   │
│   ├── modules/                  # 🧠 Business logic and utilities
│   │   ├── content/              # 📚 Content management abstraction
│   │   │   ├── api.ts            # 🔌 Content fetching API
│   │   │   ├── factory.ts        # 🏭 Content source factory
│   │   │   ├── processor.ts      # ⚡ Markdoc processing pipeline
│   │   │   ├── types.ts          # 📋 Content type definitions
│   │   │   └── sources/          # 🗂️ Content source implementations
│   │   │       ├── github.ts     # 🐙 GitHub API integration
│   │   │       └── filesystem.ts # 📁 Local filesystem reader
│   │   │
│   │   ├── github/               # 🐙 GitHub API integration
│   │   │   ├── fetchMarkdownFiles.server.ts # 📥 Batch file fetching
│   │   │   ├── fetchMarkdownFile.server.ts  # 📄 Single file fetching
│   │   │   └── fetchFileItems.server.ts     # 🗂️ Directory listing
│   │   │
│   │   ├── fs/                   # 📁 File system operations
│   │   │   ├── fetchMarkdownFiles.server.ts # 📂 Local batch reading
│   │   │   └── fetchMarkdownFile.server.ts  # 📄 Local file reading
│   │   │
│   │   ├── cache.ts              # ⚡ Hybrid caching strategy
│   │   ├── schemas.ts            # ✅ Zod validation schemas
│   │   ├── env.server.ts         # 🌍 Environment configuration
│   │   ├── config.ts             # ⚙️ Application configuration
│   │   └── types.ts              # 📝 Shared type definitions
│   │
│   ├── localization/             # 🌍 Internationalization (i18n)
│   │   ├── i18n.server.ts        # 🖥️ Server-side i18n setup
│   │   ├── i18n.ts               # 📱 Client-side i18n configuration
│   │   └── resources.ts          # 📚 Translation resource loader
│   │
│   ├── hooks/                    # 🎣 Custom React hooks
│   │   ├── useWindowSize.ts      # 📏 Responsive design hook
│   │   ├── useLocalizedPathname.ts # 🌍 i18n pathname helper
│   │   └── useMenuItems.ts       # 🧭 Navigation menu builder
│   │
│   ├── utils/                    # 🛠️ Shared utility functions
│   │   ├── metatags.ts           # 🏷️ SEO meta tag generation
│   │   ├── redirections.ts       # 🔄 Language-aware redirects
│   │   ├── url.ts                # 🔗 URL manipulation helpers
│   │   └── lang.ts               # 🌍 Language detection utilities
│   │
│   ├── entry.server.tsx          # 🖥️ Server-side entry point
│   ├── entry.client.tsx          # 📱 Client-side hydration
│   ├── root.tsx                  # 🌳 Application root component
│   ├── routes.ts                 # 🗺️ Route configuration
│   └── index.css                 # 🎨 Global CSS imports
│
├── preset/                       # 🎨 Custom Panda CSS design system
│   ├── tokens/                   # 🎯 Design tokens (colors, spacing, typography)
│   │   ├── colors.ts             # 🌈 Color palette definition
│   │   ├── typography.ts         # ✍️ Font scales and families
│   │   ├── spacing.ts            # 📏 Spacing scale system
│   │   └── sizes.ts              # 📐 Size tokens for components
│   │
│   ├── recipes/                  # 🍳 Component style variants
│   │   ├── button.ts             # 🔘 Button style variations
│   │   ├── typography.ts         # ✍️ Text style variations
│   │   ├── input.ts              # 📝 Form input styles
│   │   └── link.ts               # 🔗 Link style variations
│   │
│   ├── patterns/                 # 📐 Layout pattern definitions
│   │   ├── container.ts          # 📦 Container layout pattern
│   │   ├── grid.ts               # ⚡ CSS Grid patterns
│   │   └── flex.ts               # 🔀 Flexbox patterns
│   │
│   ├── slot-recipes/             # 🍱 Multi-part component recipes
│   │   ├── accordion.ts          # 📋 Accordion component parts
│   │   ├── navigation-menu.ts    # 🧭 Navigation menu parts
│   │   └── select.ts             # 📝 Select dropdown parts
│   │
│   └── index.ts                  # 📦 Preset entry point
│
├── @ocobo/styled-system/         # 🤖 Generated Panda CSS output
│   ├── css/                      # 🎨 CSS generation functions
│   ├── jsx/                      # ⚛️ JSX components with styling
│   ├── patterns/                 # 📐 Layout pattern functions
│   ├── recipes/                  # 🍳 Component recipe functions
│   └── types/                    # 📝 TypeScript definitions
│
├── locales/                      # 🗣️ Translation files
│   ├── fr/                       # 🇫🇷 French translations (default)
│   │   ├── common.json           # 🌍 Common UI strings
│   │   ├── home.json             # 🏠 Homepage strings
│   │   ├── contact.json          # 📧 Contact page strings
│   │   ├── projects.json         # 🚀 Projects page strings
│   │   └── strategy.json         # 📈 Strategy page strings
│   │
│   └── en/                       # 🇬🇧 English translations
│       ├── common.json           # 🌍 Common UI strings
│       ├── home.json             # 🏠 Homepage strings
│       ├── contact.json          # 📧 Contact page strings
│       ├── projects.json         # 🚀 Projects page strings
│       └── strategy.json         # 📈 Strategy page strings
│
├── public/                       # 🌐 Static assets
│   ├── fonts/                    # ✍️ Custom font files (Bermia, Bornia)
│   ├── illus/                    # 🎨 Illustrations and SVG graphics
│   ├── logos/                    # 🏢 Client and partner logos
│   ├── og/                       # 🖼️ Open Graph images for social sharing
│   └── svg-loaders/              # ⏳ Loading animation SVGs
│
├── scripts/                      # 🔧 Build and maintenance scripts
│   ├── migrate-to-blob.js        # 📦 Asset migration to Vercel Blob
│   ├── update-frontmatter.js     # 📝 Content metadata updater
│   └── github-actions-workflow.yml # 🚀 CI/CD configuration
│
├── docs/                         # 📚 Project documentation
├── build/                        # 🏗️ Production build output
├── coverage/                     # 📊 Test coverage reports
│
├── package.json                  # 📦 Dependencies and scripts
├── tsconfig.json                 # ⚙️ TypeScript configuration
├── panda.config.ts               # 🎨 Panda CSS configuration
├── vite.config.ts                # ⚡ Vite build configuration
├── vitest.config.ts              # 🧪 Test configuration
├── biome.json                    # 🔍 Code quality configuration
├── postcss.config.cjs            # 🎨 PostCSS configuration
│
└── README.md                     # 📖 Project documentation
```

## Critical Directory Analysis

### 🚀 `/app` - Core Application
**Purpose**: Main React Router v7 application code
**Key Patterns**: 
- File-based routing with internationalization
- Component-driven architecture with clear separation
- Server-side first approach with client hydration

**Entry Points**:
- `entry.server.tsx` - Server-side rendering entry
- `entry.client.tsx` - Client-side hydration entry  
- `root.tsx` - Application shell with providers

### 📄 `/app/routes` - Routing Layer
**Purpose**: File-based routing with React Router v7
**Pattern**: Convention-based route definition
**Key Features**:
- `_main.tsx` - Main layout wrapper for all content routes
- `($lang)` - Optional language parameter for internationalization
- `[.txt]` & `[.xml]` - Special file extensions for SEO routes

**Integration Points**:
- All routes use `createHybridLoader` for caching
- Language detection and redirect logic
- Content fetching from GitHub/filesystem sources

### 🧩 `/app/components` - Component Library
**Purpose**: Reusable React components organized by scope
**Architecture**: Atomic Design methodology
- **`ui/`**: Atomic components (Button, Input, Card)
- **`homepage/`**: Page-specific molecular components
- **`blog/`**, **`stories/`**: Feature-specific components

**Design System Integration**: All components use Panda CSS recipes and patterns

### 🧠 `/app/modules` - Business Logic
**Purpose**: Server-side business logic and content management
**Key Modules**:
- **`content/`**: Unified content API abstraction
- **`github/`**: GitHub API integration for production content
- **`fs/`**: Filesystem operations for development content
- **`cache.ts`**: Hybrid caching strategy implementation

**Data Flow**: `Sources → Processing → Validation → Caching → Routes`

### 🎨 `/preset` - Design System
**Purpose**: Custom Panda CSS design system definition
**Architecture**: Token-based design system
- **`tokens/`**: Design values (colors, typography, spacing)
- **`recipes/`**: Component style variants
- **`patterns/`**: Layout patterns (container, grid, flex)
- **`slot-recipes/`**: Multi-part component styling

**Build Process**: Generates `/styled-system` during `pnpm prepare`

### 🌍 `/locales` - Internationalization
**Purpose**: Translation files for French/English support
**Structure**: Namespace-based translation organization
**Route Integration**: Automatic language detection and routing

## Integration Architecture

### Content Pipeline
```
GitHub Repository → API Fetch → Validation → Markdoc Processing → Cache → Route Loader
       ↓
Local Filesystem → File Read → Validation → Markdoc Processing → No Cache → Route Loader
```

### Styling Pipeline
```
Design Tokens → Panda Config → CSS Generation → Component Recipes → Runtime Application
```

### Internationalization Flow
```
URL Lang Param → Server Detection → Translation Loading → Component Rendering → Client Hydration
```

### Deployment Pipeline
```
Source Code → Vite Build → Vercel Deploy → Edge Distribution → CDN Caching
```

## Key Integration Points

### 1. **Content Sources Integration**
- **Development**: `CONTENT_SOURCE=locale` → Filesystem API
- **Production**: `CONTENT_SOURCE=github` → GitHub API
- **Unified Interface**: Same API regardless of source

### 2. **Caching Integration**
- **Server Cache**: React Router loaders with cache headers
- **Edge Cache**: Vercel CDN with stale-while-revalidate
- **Local Cache**: No caching during development

### 3. **Build Integration**
- **CSS Generation**: `pnpm prepare` → Panda CSS codegen
- **Type Generation**: `react-router typegen` → Route type safety
- **Asset Optimization**: Vite bundling with tree shaking

### 4. **Deployment Integration**
- **Environment Detection**: Automatic source switching
- **Branch Deployment**: Content source branching strategy
- **Analytics Integration**: Vercel Analytics and Speed Insights

## Critical Files & Their Roles

### Configuration Files
- **`package.json`**: Dependencies, scripts, Node.js engine requirements
- **`tsconfig.json`**: TypeScript configuration with path mapping
- **`panda.config.ts`**: CSS-in-JS system configuration
- **`vite.config.ts`**: Build tool configuration for SSR
- **`biome.json`**: Code quality and formatting rules

### Entry Points
- **`app/entry.server.tsx`**: Server-side rendering bootstrap
- **`app/entry.client.tsx`**: Client-side hydration bootstrap  
- **`app/root.tsx`**: Application shell with global providers
- **`preset/index.ts`**: Design system entry point

### Infrastructure Files
- **`app/modules/cache.ts`**: Caching strategy implementation
- **`app/modules/env.server.ts`**: Environment configuration
- **`app/localization/i18n.server.ts`**: Server-side i18n setup

This architecture provides:
- **🚀 Performance**: Edge caching, SSR, optimized assets
- **🔧 Maintainability**: Clear separation of concerns, modular structure
- **🌍 Scalability**: Internationalization ready, content source flexibility  
- **👨‍💻 Developer Experience**: Type safety, fast development, clear patterns