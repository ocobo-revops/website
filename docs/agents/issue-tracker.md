# Issue tracker: Linear

Issues and specs for this repo live in Linear, team **GTM**. Use the Linear MCP tools for every operation. GitHub issues on `ocobo-revops/website` are no longer used: never create one.

Issue identifiers look like `GTM-42`. Older tickets reference GitHub issues as `#N`: these point at the closed GitHub issues of this repo, kept for history.

## How the site work is organised

The site is continuous work, so no single project holds it.

- **Label `website`**: every ticket about the site's code or infrastructure carries it. It is the only filter that finds all of them. Team GTM also tracks content work, which does not carry it.
- **Initiative "Website"**: groups the site's projects. It has no lead team, because team initiatives require the Business plan.
- **Projects**: one per bounded effort with an end (a spec), attached to the Website initiative. The current one is **Refonte v2**. A ticket gets a project only when it belongs to an active project.
- **Maintenance tickets** (dependency upgrades, CI, performance, infrastructure) have the `website` label and no project.

## Conventions

- **Create an issue**: `save_issue` with `team: "GTM"`, `labels` including `website`, a `title`, a markdown `description` and `state`. Add `project` only when the ticket belongs to an active project of the Website initiative. Check `list_issues` first to avoid a duplicate.
- **Raw requests**: a bug report or request created by hand must carry `website` from the start, or `/triage` will not find it.
- **Read an issue**: `get_issue` with the identifier, then `list_comments` for the discussion (`get_issue` does not include comments).
- **List issues**: `list_issues` with `team: "GTM"` and `label: "website"`, filtered by `state` or `query`. Pass `project` instead to scope to one project. Follow `cursor` while `hasNextPage` is true.
- **Statuses**: `Backlog` (not triaged), `Todo`, `In progress` (claimed, work started), `In Review` (a PR is open), `Done`, `Canceled`, `Duplicate`.
- **Start work**: `save_issue` with `assignee: "me"` and `state: "In progress"`.
- **Labels**: `website`, the triage labels (see `triage-labels.md`), plus a type: `Feature`, `Improvement`, `Bug`, `Perf`, `Tests`, `Deps`. `save_issue` `labels` replaces the whole set: pass every label to keep, `website` included. To add one label without touching the others, use `addLabels`.
- **Specs**: `/to-spec` creates a new project attached to the Website initiative (`save_project` with `initiatives: ["Website"]`), then the spec (PRD) as a Linear document in that project (`save_document` with `project`). A document cannot carry labels: the project links it to the site. Tickets link to their spec in a `## Parent` section at the top of their description.
- **Tickets from a spec**: `/to-tickets` sets `project` to the spec's project on each ticket, and the `website` label.
- **Milestones**: a spec's delivery steps are milestones of its project (`save_milestone`). Set `milestone` on each ticket that belongs to one. Milestones carry no date until the maintainer adds one.
- **Sub-issues**: `save_issue` with `parentId` set to the parent identifier.
- **Blocking**: Linear's native relations. Pass `blockedBy: ["GTM-N", ...]` (or `blocks`) to `save_issue`. A ticket is startable when every blocker is `Done` or `Canceled`.
- **Comment on an issue**: `save_comment` with the issue identifier and a markdown `body`.
- **Apply / remove labels**: `save_issue` with `id` and the full new `labels` list.
- **Link a PR**: add the PR URL with `links` on `save_issue`, and move the issue to `In Review`.
- **Close**: post the explanation with `save_comment`, then `save_issue` with `state: "Done"` (work delivered) or `state: "Canceled"` (not actioned).

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

## When a skill says "publish to the issue tracker"

Create a Linear issue in team GTM with the `website` label, as in **Create an issue** above.

## When a skill says "fetch the relevant ticket"

Read it as in **Read an issue** above.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single parent issue with **child** issues as tickets.

The wayfinder labels already exist on team GTM, as children of the single-select label group `wayfinder`: `map`, `research`, `prototype`, `grilling`, `task`. Linear displays them as `wayfinder/map` and so on. Pass the child name (`labels: ["map"]`). Never create flat `wayfinder:*` labels.

- **Map**: a Linear issue labelled `map`, holding the Notes / Decisions-so-far / Fog body.
- **Child ticket**: an issue with `parentId` set to the map, labelled with its type (`research`, `prototype`, `grilling` or `task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: see **Blocking** under Conventions.
- **Frontier query**: `list_issues` on the map's children that are not `Done` or `Canceled`, drop any with an open blocker or an assignee; first in map order wins.
- **Claim**: `save_issue` with `assignee: "me"` and `state: "In progress"`, the session's first write.
- **Resolve**: `save_comment` with the answer, then `save_issue` with `state: "Done"`, then append a context pointer (gist + link) to the map's Decisions-so-far.
