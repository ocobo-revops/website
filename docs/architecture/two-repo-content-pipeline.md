# Two-repo content pipeline

## Overview

Ocobo's content lives in a dedicated repository (`ocobo-revops/posts`) separate from the website code (`ocobo-revops/website`). The website is a **pure read-side consumer** — it never writes content and never needs to redeploy when content changes.

| Repo | Responsibility | Who touches it |
|------|----------------|----------------|
| `ocobo-revops/posts` | Markdown content + assets | Content editors, RevOps writers |
| `ocobo-revops/website` | SSR React Router app | Engineers, designers |

---

## System diagram

```mermaid
graph TB
    author(["Author / Content editor"])
    engineer(["Engineer / Designer"])
    reader(["Reader / Browser"])

    subgraph posts ["ocobo-revops/posts"]
        md["Markdown + frontmatter\nblog/ stories/ team/ tools/ jobs/"]
        assets_dir["assets/\nposts/ clients/ stories/"]
    end

    subgraph infra ["Infrastructure"]
        blob[("Vercel Blob\nCDN — assets")]
    end

    subgraph website ["ocobo-revops/website"]
        app["SSR React Router app\nVercel Edge"]
    end

    author -->|"edit markdown + PR → merge"| md
    author -->|"pnpm sync-assets"| blob
    assets_dir -.->|"read by sync-assets"| blob
    engineer -->|"code / design PRs"| app

    md -->|"GitHub API (prod)\nlocal FS (dev)"| app
    blob -->|"ASSETS_BASE_URL\nHTTP read"| app
    app -->|"SSR HTML + CDN URLs"| reader
    reader -->|"load images"| blob
```

---

## Content flow

How a markdown change reaches readers:

```mermaid
sequenceDiagram
    participant A as Author
    participant P as posts repo (GitHub)
    participant W as website (runtime)
    participant R as Reader

    A->>P: Edit markdown, open PR
    P-->>A: Review + merge to main
    Note over W: No redeploy required
    R->>W: HTTP request
    W->>P: GitHub API — GET file (branch=main)
    P-->>W: Raw markdown
    W->>W: Markdoc parse → Zod validate → SSR render
    W-->>R: HTML page
```

**Local dev** (`CONTENT_SOURCE=locale`): the website reads directly from `~/projects/ocobo-posts/` on the filesystem — no GitHub API call, instant feedback.

**Production** (`CONTENT_SOURCE=github`): every request hits the GitHub API; the Vercel CDN caches the rendered page (`stale-while-revalidate`). Append `?refresh=1` to bypass cache.

---

## Asset flow

How an image added to `posts` ends up on the website:

```mermaid
sequenceDiagram
    participant A as Author
    participant P as posts repo (local)
    participant B as Vercel Blob (CDN)
    participant W as website

    A->>P: Add file to assets/<category>/<slug>/
    A->>B: pnpm sync-assets (upload changed files)
    B-->>P: pnpm update-urls rewrites frontmatter URLs to blob URLs
    A->>P: git add + commit + push
    Note over W: Next request picks up new blob URL
    W->>B: ASSETS_BASE_URL HTTP read
    B-->>W: Image (served from CDN edge)
```

Assets are stored in Vercel Blob under paths like `content/posts/<slug>/filename.png`. The blob store (`ocobo-blob`) is owned by the `wab` Vercel account; it is accessible to the website via `BLOB_READ_WRITE_TOKEN`.

---

## Content-type relationships

```mermaid
erDiagram
    BLOG_POST }o--|| TEAM_MEMBER : "author (slug)"
    JOB }o--|| TEAM_MEMBER : "hiringContact (slug)"
    STORY }o--o{ TOOL : "tools / featuredTool (slugs)"

    BLOG_POST {
        string slug
        string title
        string author
        date date
        string lang
    }
    STORY {
        string slug
        string title
        string[] tools
        string featuredTool
    }
    JOB {
        string slug
        string title
        string hiringContact
        string lang
    }
    TEAM_MEMBER {
        string slug
        string name
        string role
    }
    TOOL {
        string slug
        string name
    }
```

Cross-references between content types always use **slugs** (kebab-case filename without `.md`). The canonical glossary for these terms lives in [`posts/CONTEXT.md`](https://github.com/ocobo-revops/posts/blob/main/CONTEXT.md).

---

## Repo boundaries — which repo do I PR against?

| Change | Repo |
|--------|------|
| New blog post, story, job | `ocobo-revops/posts` |
| Edit existing content text | `ocobo-revops/posts` |
| Add or replace an image / asset | `ocobo-revops/posts` (then run `pnpm sync-assets`) |
| New team member or tool | `ocobo-revops/posts` |
| Fix a rendering bug | `ocobo-revops/website` |
| Add a new page or route | `ocobo-revops/website` |
| Update design tokens or components | `ocobo-revops/website` |
| Add a new content type (schema) | `ocobo-revops/website` (Zod schema + route) **and** `ocobo-revops/posts` (markdown files) |
| Change cache TTL | `ocobo-revops/website` — `app/modules/cache.ts` |

---

## Environment variables (website side)

| Var | When set | Effect |
|-----|----------|--------|
| `CONTENT_SOURCE=locale` | Dev (default) | Reads from local `~/projects/ocobo-posts/` filesystem |
| `CONTENT_SOURCE=github` | Prod | Fetches via GitHub API |
| `GITHUB_ACCOUNT` / `GITHUB_REPO` / `GITHUB_ACCESS_TOKEN` | When `github` | Content repo coordinates |
| `GITHUB_BRANCH` | Optional | Defaults `main`; use `offers` to preview placeholder branches |
| `ASSETS_BASE_URL` | Prod | Base URL for Vercel Blob CDN |
| `BLOB_READ_WRITE_TOKEN` | Both | Blob store access token |

---

## Further reading

- [`posts/CONTEXT.md`](https://github.com/ocobo-revops/posts/blob/main/CONTEXT.md) — content domain glossary
- [`docs/architecture/overview.md`](overview.md) — website internal architecture
- [`docs/development/cache-strategy.md`](../development/cache-strategy.md) — CDN cache TTLs and bypass
- [`app/modules/content/api.ts`](../../app/modules/content/api.ts) — content public API
- [`app/modules/content/factory.ts`](../../app/modules/content/factory.ts) — source dispatch (locale vs github)
