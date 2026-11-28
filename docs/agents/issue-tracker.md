# Issue tracker: Linear

Issues and specs for this repo live in Linear: team **GTM**, project **Website** (`P-GTM-7`). Use the Linear MCP tools for every operation. GitHub issues on `ocobo-revops/website` are no longer used: never create one.

Issue identifiers look like `GTM-42`. Older tickets reference GitHub issues as `#N`: these point at the closed GitHub issues of this repo, kept for history.

## Conventions

- **Create an issue**: `save_issue` with `team: "GTM"`, `project: "P-GTM-7"`, a `title`, a markdown `description`, `labels` and `state`. Check `list_issues` first to avoid a duplicate.
- **Read an issue**: `get_issue` with the identifier, then `list_comments` for the discussion (`get_issue` does not include comments).
- **List issues**: `list_issues` with `project: "P-GTM-7"`, filtered by `state`, `label` or `query`. Follow `cursor` while `hasNextPage` is true.
- **Statuses**: `Backlog` (not triaged), `Todo`, `In Progress` (claimed, work started), `In Review` (a PR is open), `Done`, `Canceled`, `Duplicate`.
- **Start work**: `save_issue` with `assignee: "me"` and `state: "In Progress"`.
- **Labels**: the triage labels (see `triage-labels.md`), plus a type: `Feature`, `Improvement`, `Bug`, `Perf`, `Tests`, `Deps`. `save_issue` `labels` replaces the whole set: pass every label to keep.
- **Specs**: a spec (PRD) is a Linear document attached to the project (`save_document` with `project: "P-GTM-7"`). Its tickets link to it in a `## Parent` section at the top of their description.
- **Milestones**: a spec's delivery steps are project milestones (`save_milestone`). Set `milestone` on each ticket that belongs to one. Milestones carry no date until the maintainer adds one.
- **Sub-issues**: `save_issue` with `parentId` set to the parent identifier.
- **Blocking**: Linear's native relations. Pass `blockedBy: ["GTM-N", ...]` (or `blocks`) to `save_issue`. A ticket is startable when every blocker is `Done` or `Canceled`.
- **Comment on an issue**: `save_comment` with the issue identifier and a markdown `body`.
- **Apply / remove labels**: `save_issue` with `id` and the full new `labels` list.
- **Link a PR**: add the PR URL with `links` on `save_issue`, and move the issue to `In Review`.
- **Close**: post the explanation with `save_comment`, then `save_issue` with `state: "Done"` (work delivered) or `state: "Canceled"` (not actioned).

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

## When a skill says "publish to the issue tracker"

Create a Linear issue in team GTM, project Website, as in **Create an issue** above.

## When a skill says "fetch the relevant ticket"

Read it as in **Read an issue** above.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single parent issue with **child** issues as tickets.

The wayfinder labels already exist on team GTM, as children of the single-select label group `wayfinder`: `map`, `research`, `prototype`, `grilling`, `task`. Linear displays them as `wayfinder/map` and so on. Pass the child name (`labels: ["map"]`). Never create flat `wayfinder:*` labels.

- **Map**: a Linear issue labelled `map`, holding the Notes / Decisions-so-far / Fog body.
- **Child ticket**: an issue with `parentId` set to the map, labelled with its type (`research`, `prototype`, `grilling` or `task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: see **Blocking** under Conventions.
- **Frontier query**: `list_issues` on the map's children that are not `Done` or `Canceled`, drop any with an open blocker or an assignee; first in map order wins.
- **Claim**: `save_issue` with `assignee: "me"` and `state: "In Progress"`, the session's first write.
- **Resolve**: `save_comment` with the answer, then `save_issue` with `state: "Done"`, then append a context pointer (gist + link) to the map's Decisions-so-far.
