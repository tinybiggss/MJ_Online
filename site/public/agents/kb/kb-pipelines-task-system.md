---
id: kb-pipelines-task-system
title: Task System
updated: 2026-10-08
source: Mike Jones public knowledge base (https://mikejones.online/llms.txt)
---

# Task System

## Task System

What it is: Mike's personal Kanban — the claim layer for how work is captured, decided, and tracked across all four businesses. Task files in Tasks/ are the source of truth in both directions: Mike's board view reads them, agent boards are views of them, and every agent writes status back to the files, never only to its own board. The compiled claim lives here; the how-to-run lives in Operations (links below).

### The claims

One store per direction. Tasks/*.md is canonical; the Hermes kanban board is a view. A status that lives only on an agent's board is a second store — the failure mode that killed the Distills board and stranded 71 tasks in daily notes for weeks. Statuses are board columns: backlog, on-deck, todo, in-progress, blocked, resolved, closed, parked. Only todo means today; on-deck is this week; backlog is soon-but-unscheduled; parked is not soon and carries an unpark trigger. Agents never promote across these on their own. All reads and writes go through the agent CLI (scripts/tasks.py, adopt.py in ~/Dev/openclaw_projects/task-system, 769 tests): it takes a file lock and verifies its write. Direct file edits do neither — never edit task files by hand. Intake: cards Mike makes on the board land at the vault root with no id; adopt.py (every 10 min, the task-intake cron) gives them an id and moves them into Tasks/. The 10-minute window is deliberate — editing a card resets its clock, so Mike is never interrupted mid-draft. Sweeps: the orchestrator sweep (Hermes cron, 00:30/11:00/15:00) is orchestrator AND worker — it reads the queue, executes todo work cards, executes cards Mike has moved to resolved, verifies in-progress work on disk, and triages fresh inbox cards (proposes project/priority/estimate in the Agent log; never changes status — todo is Mike's call alone). Assignee follows the doer (DEC-029): when an agent delegates work onward, it rewrites assignee so the vault shows who actually holds the work. Estimates are a system input: agents record real minutes on work done; nearly every card starts as an unestimated 60-minute guess, and real numbers are what make the day plan honest. Capacity defaults live in Tasks/_config/capacity.yaml (Mike corrects the defaults; a focused-minutes ask remains open). Known accepted race: Mike can drag a card in Obsidian in the microseconds between the CLI's final check and its write, and his change loses. Obsidian does not take the CLI's lock; measured ~1/60 ordering risk, accepted rather than fixed. Exit semantics: CLI exit 1 is a normal refusal (already claimed, expectation failed) — log and move on. Exit 3, or repeated "locked": false, means stop and surface to Mike. Delegated children cannot mutate the board (write-fence, documented 2026-10-07): claim, update, and complete — including --force — all fail inside a delegate_task child. Children do the work and report results up; the parent session (or Hermes directly) closes cards. The fence is an invariant, not a bug to strip around.

### Open work (as of 2026-09-28)

Retiring the rollover's task half (local.mike.task-rollover LaunchAgent still carries tasks forward in daily notes — redundant with this system, re-creates a second store). Mike wants it done as part of his cron audit, not unilaterally. Plan-3 remainder in the CLI repo: assignee-aware selection, rollup attribution, notifications, remaining crons.

### Related

generator-registry — which generators write into the vault; task-intake and the orchestrator sweep are registered there publication-layer — the reader-side rule that surface publishing is gated; the task system is where those stage-and-approve cards live how-mike-works — agent collaboration rules; the task system is where they are enforced
