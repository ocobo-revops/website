# Ocobo website

The Ocobo marketing site and the organisation of agents that maintains it on behalf of non-technical Ocobo teams.

## Agents factory

**Agents factory**:
The organisation of agents embedded in the repo that turns an Intent into a pull request ready for human validation.
_Avoid_: agent org, AI team, pipeline

**Intent**:
A request expressed by a human in plain language, describing what should change on the site and why, without saying how.
_Avoid_: ticket, task, prompt, demand

**Requester**:
The human who expresses an Intent and validates its result on the preview.
_Avoid_: user, client, stakeholder

**Team**:
A group of agents responsible for one repo: the editorial Team for content, the product and engineering Team for the site.
_Avoid_: squad, crew

**Intake agent**:
The single entry point of the Agents factory, which qualifies an Intent and routes it to one Team or both.
_Avoid_: router, front desk, orchestrator

**Gate**:
A point where a human must approve before the work moves on.
_Avoid_: checkpoint, approval step, review

**Sensitive zone**:
A part of the site whose changes require the technical owner's approval at a Gate, on top of the Requester's.
_Avoid_: critical path, protected area
