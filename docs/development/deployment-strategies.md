# Vercel Branch-Specific Content Deployment Strategy

This document outlines how to configure Vercel deployments to target specific branches of the ocobo-posts repository, allowing for content testing and preview environments.

## Current Architecture

The ocobo application fetches content from the ocobo-posts repository using:
- **Production**: GitHub API (`CONTENT_SOURCE=github`)
- **Development**: Local filesystem (`CONTENT_SOURCE=locale`)

Key environment variables:
- `GITHUB_ACCOUNT`: GitHub organization/user (e.g., "wab")
- `GITHUB_REPO`: Repository name (e.g., "ocobo-posts")
- `GITHUB_ACCESS_TOKEN`: Personal access token for API access
- `CONTENT_SOURCE`: "github" or "locale"

## Strategy: Environment-Based Branch Targeting

### Option 1: Multiple Environment Variables (Recommended)

Create environment variables that allow branch targeting per deployment:

```bash
# Base configuration
GITHUB_ACCOUNT="wab"
GITHUB_REPO="ocobo-posts"
GITHUB_ACCESS_TOKEN="your-token"
CONTENT_SOURCE="github"

# Branch targeting (new)
GITHUB_BRANCH="main"  # Default to main branch
```

### Option 2: Branch-Specific Environment Override

For specific Vercel deployments, override the repository reference:

```bash
# For feature branch deployment
GITHUB_REPO="ocobo-posts"
GITHUB_BRANCH="offers"
```

## Implementation Steps

### 1. Update Content Fetching Logic

Modify the GitHub API URL construction to include branch reference:

```typescript
// In app/modules/env.server.ts
const githubBranch = process.env.GITHUB_BRANCH || 'main';
const githubRepoAPIUrl = `https://api.github.com/repos/${githubAccount}/${githubRepo}/contents`;

// In GitHub fetch modules, add ref parameter:
const apiUrl = `${baseUrl}/${path}?ref=${githubBranch}`;
```

### 2. Vercel Environment Configuration

Configure environment variables in Vercel dashboard or `vercel.json`:

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

#### Preview Environment (Feature Branches)
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

### 3. Branch-Specific Deployment Workflow

1. **Create Content Branch**: 
   ```bash
   cd ocobo-posts
   git checkout -b offers
   # Add content files
   git add .
   git commit -m "feat: add placeholder offers"
   git push -u origin offers
   ```

2. **Deploy Application Branch**:
   ```bash
   cd ocobo
   git checkout claude/plan-offers-pages-011CUr7mcLL5kUPP8WW24zHp
   # Configure environment for this deployment
   vercel --env GITHUB_BRANCH=offers
   ```

3. **Set Environment in Vercel Dashboard**:
   - Go to Vercel project settings
   - Add environment variable: `GITHUB_BRANCH=offers`
   - Scope to specific deployment/branch

## Vercel Configuration Options

### Option A: Manual Environment Variables
Set in Vercel dashboard per deployment environment:
- Production: `GITHUB_BRANCH=main`
- Preview: `GITHUB_BRANCH=offers`

### Option B: Git Branch Mapping (Advanced)
Use Vercel's branch deployment mapping:

```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "claude/plan-offers-pages-011CUr7mcLL5kUPP8WW24zHp": true
    }
  },
  "env": {
    "GITHUB_BRANCH": "main"
  },
  "preview": {
    "env": {
      "GITHUB_BRANCH": "offers"
    }
  }
}
```

### Option C: Dynamic Branch Detection
Detect the current Git branch and map it to content branch:

```typescript
// Dynamic branch mapping
const deploymentBranch = process.env.VERCEL_GIT_COMMIT_REF;
const contentBranch = mapDeploymentToContentBranch(deploymentBranch);

function mapDeploymentToContentBranch(deploymentBranch: string): string {
  const mapping = {
    'claude/plan-offers-pages-011CUr7mcLL5kUPP8WW24zHp': 'offers',
    'main': 'main',
    'develop': 'develop'
  };
  
  return mapping[deploymentBranch] || 'main';
}
```

## Testing the Current Setup

To test with the current `offers` branch:

1. **Set Environment Variable**:
   ```bash
   # In Vercel dashboard or .env.local
   GITHUB_BRANCH=offers
   ```

2. **Verify in Application**:
   - Navigate to `/offers`
   - Should display the 3 placeholder offers
   - Verify content is loading from the feature branch

3. **Debug Content Source**:
   ```typescript
   // Add to a route loader for debugging
   console.log('Content branch:', process.env.GITHUB_BRANCH);
   console.log('API URL:', githubRepoAPIUrl);
   ```

## Recommended Implementation

For immediate testing with the current feature:

1. **Simple Environment Override**:
   ```bash
   # Set in Vercel for the claude/plan-offers-pages-011CUr7mcLL5kUPP8WW24zHp deployment
   GITHUB_BRANCH=offers
   ```

2. **Minimal Code Changes**:
   Update GitHub API calls to include `?ref=${process.env.GITHUB_BRANCH || 'main'}`

3. **Verification Steps**:
   - Deploy with environment variable
   - Check `/offers` page loads placeholder content
   - Verify branch targeting in network requests

This strategy allows you to:
- ✅ Test offers feature with placeholder content
- ✅ Keep production stable on main branch  
- ✅ Easily switch between content branches
- ✅ Support multiple preview environments
- ✅ Maintain clean separation of concerns