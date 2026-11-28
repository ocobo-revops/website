# Domain docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This is a **single-context repo**: one `GLOSSARY.md` + `docs/adr/` at the repo root.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root
- **`docs/adr/`**: read ADRs that touch the area you're about to work in

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

The content domain (stories, blog posts, challenges) has its own glossary in the `posts` repo (`CONTEXT.md` there). Read it when the task touches content types.

## File structure

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-design-system-adoption-policy.md
│   └── 0002-design-system-v2.md
└── app/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't switch to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, say so explicitly rather than silently overriding:

> _Contradicts ADR-0002 (design system v2), but worth reopening because…_
