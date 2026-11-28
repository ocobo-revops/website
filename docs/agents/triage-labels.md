# Triage labels

The `/triage` skill speaks in terms of two category roles and five state roles. This file maps those roles to the label strings used in Linear (team GTM).

When a skill mentions a role (for example "apply the AFK-ready triage label"), use the corresponding label string from these tables. Never create a label named after a role (`bug`, `enhancement`): the labels below already exist.

## Category roles

Every triaged issue carries exactly one category label. These are the type labels, which sit outside any label group.

| Role in mattpocock/skills | Label in our tracker      | Meaning                                         |
| ------------------------- | ------------------------- | ----------------------------------------------- |
| `bug`                     | `Bug`                     | Something is broken                             |
| `enhancement`             | `Feature` or `Improvement` | `Feature`: a new capability. `Improvement`: a change to something that already exists |

The other type labels (`Perf`, `Tests`, `Deps`) describe technical work, not incoming requests: `/triage` does not assign them.

## State roles

Every triaged issue carries exactly one state label, from the single-select label group `triage`. Pass the child name (`labels: ["needs-triage"]`).

| Role in mattpocock/skills | Label in our tracker | Meaning                                  |
| ------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`            | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`              | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`         | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`         | `ready-for-human`    | Requires human implementation            |
| `wontfix`                 | `wontfix`            | Will not be actioned                     |

An issue labelled `needs-triage` sits in the `Backlog` status. Moving it to `ready-for-agent` or `ready-for-human` also moves it to `Todo`. `wontfix` goes with the `Canceled` status.

`save_issue` `labels` replaces the whole set: when changing the state label, pass the category label again.
