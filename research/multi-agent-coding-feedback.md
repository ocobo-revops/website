# Multi-agent coding organisations: what trusted sources report

Research for Linear GTM-56 (map GTM-54, project "Agents factory"). Question: what do trusted sources say about multi-agent organisations that produce code, so we can decide how many separate agents phase 1 needs. Sources read on 2026-11-28.

## Answer

The sources converge: **one agent writes, and the others only add judgement from a clean context.** Separate agents pay off for review (and for read-only investigation that would flood the main context). They do not pay off for splitting the build itself into roles that hand work to each other. For phase 1 this supports two agents: one builder (with skills for each phase: spec, tickets, implementation, QA) and one independent reviewer. A third agent (product challenge) is justified only if it runs before the build, reads the spec cold, and has no write access.

What would change this: a measured case where our builder's own QA misses defects that a separate QA agent catches. No source reports such a case for QA, only for review.

## 1. Token cost: multi-agent vs one agent with skills

| Source | Figure |
|---|---|
| Anthropic, multi-agent research system (2025-06-13) | Agents use about 4x the tokens of chat. Multi-agent systems use about 15x. Token usage alone explains 80% of performance variance on BrowseComp. The economics only work "for high-value tasks". |
| Claude Code docs, costs | Agent teams use "approximately 7x more tokens than standard sessions" when teammates run in plan mode. Cost is "roughly proportional to team size". |
| Claude Code docs, best practices | Subagents cost "mostly tokens", and sometimes time: a fresh subagent must regather context, so it "can end up slower". By default it is the same model: "You get parallelism or a fresh pair of eyes out of it, but not a smarter answer." |
| Matt Pocock, `implement` docs | One ticket exceeding 100k tokens is normal (exploration, red-green loop, full suite, review). The fix is smaller tickets, not more agents. |
| Cognition, "What's actually working" (2026-04-22) | No token figures published. |

Skills are the cheap alternative: they load on demand into the main context, so knowledge reaches the agent without a second context window (Claude Code costs page: "Move instructions from CLAUDE.md to skills"; "a skill can give Claude domain knowledge so it doesn't have to explore").

Sources:
- https://www.anthropic.com/engineering/multi-agent-research-system
- https://code.claude.com/docs/en/costs
- https://code.claude.com/docs/en/best-practices
- https://github.com/mattpocock/skills (file `docs/engineering/implement.md`, v1.3.2)

## 2. Context loss at handoffs

- **Cognition, "Don't build multi-agents" (2025-06-12).** Two principles: "Share context, and share full agent traces, not just individual messages", and "Actions carry implicit decisions, and conflicting decisions carry bad results". Flappy Bird example: two subagents build a Mario background and a bird that does not match, and the final agent cannot reconcile them. Default recommendation: a single-threaded linear agent. https://cognition.com/blog/dont-build-multi-agents
- **Anthropic, multi-agent research system.** Multi-agent fits poorly where "all agents must share the same context" or with many dependencies, and "most coding tasks" have fewer parallelisable parts than research. Mitigation: subagents write outputs to the filesystem and pass references back, to avoid the "game of telephone". https://www.anthropic.com/engineering/multi-agent-research-system
- **Claude Code subagents docs.** A subagent receives its system prompt, the delegation message, CLAUDE.md, git status and preloaded skills. It does not receive the conversation history. "Restate any rule the subagent must follow in the delegation prompt." https://code.claude.com/docs/en/sub-agents
- **Matt Pocock, `implement-spec` docs.** Field reports: implementer subagents "don't inherit the /tdd directive"; two parallel implementers named the same field `blockedSince` and `blockedOn`. Mitigation: pass context pointers (spec, ticket, shared notes) and add blocking edges when two tickets touch one shared file. https://github.com/mattpocock/skills (file `docs/engineering/implement-spec.md`)
- **Anthropic, context engineering (2025-09-29).** A subagent may spend tens of thousands of tokens and return 1,000 to 2,000. Useful for isolation; the return is lossy by design. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

## 3. Which roles gain from isolation

| Role | Verdict | Evidence |
|---|---|---|
| **Code review** | Isolate. Strongest evidence. | Cognition: Devin Review catches about 2 bugs per PR, about 58% severe; it "work[s] best when the coding and review agents do not share any context beforehand". Claude Code best practices: a reviewer in a fresh subagent "isn't swayed by the reasoning that produced the code". Matt Pocock: "Same context reviewing itself isn't review, it's confirmation bias with a slash command" (quoted reader, endorsed in the docs). |
| **Read-only investigation** (search, logs, tests output) | Isolate, for context hygiene only. | Claude Code subagents and costs docs; Cognition notes Claude Code subagents "usually answer a well-defined question and don't write code". |
| **QA / verification** | Weak evidence for a separate agent. Strong evidence for a separate *check*. | MAST: "many existing verifiers perform only superficial checks" (compiles, no TODOs). Adding high-level objective verification gave +15.6% on ChatDev. Claude Code best practices prefer an enforced check (Stop hook, `/goal`, tests) over a judgement call. |
| **Product challenge / devil's advocate** | Plausible, unmeasured. | Agent teams docs list "one playing devil's advocate" and competing-hypotheses debugging as good fits. No source publishes results for coding. |
| **Parallel writers (front, back, tests as separate agents)** | Avoid. | Cognition 2026: parallel-writer swarms "still don't see meaningful adoption"; "writes stay single-threaded". Agent teams docs: for "sequential tasks, same-file edits, or work with many dependencies, a single session or subagents are more effective". |

Sources:
- https://cognition.com/blog/multi-agents-working
- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/agent-teams
- https://arxiv.org/abs/2503.13657
- https://github.com/mattpocock/skills (files `docs/engineering/code-review.md`, `docs/engineering/implement.md`)

## 4. Known failure modes

**Loops and runaway fan-out**
- Anthropic research system: spawning 50 subagents for simple queries, endless searching for sources that do not exist, agents continuing after they had enough.
- Matt Pocock `code-review`: sub-agents re-invoke `/code-review` and fan out; one report reached more than 50 agents. His position: the harness, not the skill, must cap recursion (`.out-of-scope/subagent-recursion.md`).
- Matt Pocock `implement-spec`: a review and fix loop on a five-ticket feature "took roughly four hours" when review ran before all tickets were built.
- MAST (1,642 traces, 7 frameworks incl. ChatDev and MetaGPT): step repetition 15.7%, unaware of termination conditions 12.4%.

**Sycophantic agreement between agents**
- Yao et al., "Peacemaker or Troublemaker" (2025-09-27): sycophancy "collapse[s] debates into premature consensus" and yields lower accuracy than single-agent baselines. https://arxiv.org/abs/2509.23055
- Cognition's mitigation is structural: the reviewer gets no shared context, which reduces correlated bias. Claude Code best practices warn of the opposite bias too: "A reviewer that's asked to find problems will always find *something*", so constrain it ("skip style") or you end up with needless abstractions.

**Scope drift and disobeying the user**
- MAST: disobey task specification 11.8%, task derailment 7.4%, reasoning-action mismatch 13.2%.
- Cognition: a bridge filters reviewer findings against user instructions "to prevent looping, disobeying the user, and out-of-scope work". Managers tend to be over-prescriptive; children's discoveries do not reach siblings.

**Weak verification**
- MAST: no or incomplete verification 8.2%, incorrect verification 9.1%, premature termination 6.2%.

## 5. Recommended guardrails

1. **Start simple; add agents only when needed** (Anthropic, building effective agents, 2024-12-19). https://www.anthropic.com/engineering/building-effective-agents
2. **Single writer.** Other agents advise, review, or investigate; they do not commit (Cognition 2026).
3. **Reviewer with a clean context and read-only tools** (`tools: Read, Grep, Glob`), reviewing against the spec, not against taste (Claude Code best practices).
4. **Enforced stop conditions**: max iterations, Stop hook on typecheck/tests, harness-level caps on subagent depth and concurrency (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`, default 3 layers; 20 concurrent). Anthropic building effective agents; Claude Code subagents docs.
5. **Explicit delegation briefs**: objective, output format, tools, boundaries (Anthropic research system). Restate rules the subagent must follow, since it does not see the conversation.
6. **Pass pointers, not summaries**: spec, ticket, files on disk (Anthropic research system; Matt Pocock `implement-spec`).
7. **Review once at a fixed point** (per ticket, then once on the branch), never mid-build (Matt Pocock `implement-spec`).
8. **Treat agent findings as hypotheses**: every finding carries a citation that a human or the builder checks (Matt Pocock `code-review`).
9. **Human checkpoints** at blockers and before merge (Anthropic building effective agents; Cognition: most bugs fixed "before a human opens the PR", the human still opens it).
10. **Filter reviewer output against user intent** before the builder acts on it, to stop loops and scope creep (Cognition 2026).

## Implication for phase 1 of the agents factory

The charting rule (a role becomes a separate agent only when an independent viewpoint is required) matches the sources. Applied:

- **Builder** (one agent): carries the org-chart roles as skills (spec, tickets, implementation with TDD, QA checks run as commands and hooks). It is the only writer.
- **Reviewer** (separate agent): clean context, read-only, reviews the diff against the spec at a fixed point, findings cited and filtered by the builder or a human.
- **Product challenger** (optional third): only if it reads the spec before the build, cold and read-only. No coding source measures its value, so treat it as an experiment.

Not supported by the sources: separate front, back, QA, or PM agents that hand work to each other. Each handoff costs tokens (roughly linear in agent count, 7x to 15x reported), loses implicit decisions, and adds the loop and drift failures listed above.

## Uncertainties

- No source compares, on coding tasks, a team of agents against one agent with skills at equal token budget. The 90.2% gain (Anthropic) is on research, not code.
- Cognition's Devin Review figures are vendor self-reports, without a published method.
- The sycophancy evidence comes from debate benchmarks, not code review.
- The 7x agent-team figure applies to plan mode only, per the Claude Code costs page.
- Matt Pocock's field reports are anecdotes collected in his skills' docs, not measurements.
