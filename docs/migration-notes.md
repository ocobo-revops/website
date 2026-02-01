# Migration notes

Working document for the `migration-plan-a` branch. Delete after merge.

## Deferred issues

- [ ] XSS: unsanitised env vars (`gaTrackingId`, `agoBasePath`, `agoApiKey`) interpolated into `dangerouslySetInnerHTML` in `app/root.tsx` — validate format before interpolation

## Learnings

- Feature flags: `DISABLED_PAGES` env var is the single source of truth; removed duplicate path through `PrivateEnvVars` after code review caught the dual source

## Ideas / future refactors

-
