# Triage labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the label strings used in Linear (team GTM, single-select label group `triage`). Pass the child name (`labels: ["needs-triage"]`): an issue carries one triage label at a time.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (for example "apply the AFK-ready triage label"), use the corresponding label string from this table.

An issue labelled `needs-triage` sits in the `Backlog` status. Moving it to `ready-for-agent` or `ready-for-human` also moves it to `Todo`. `wontfix` goes with the `Canceled` status.

Edit the right-hand column to match whatever vocabulary you actually use.
