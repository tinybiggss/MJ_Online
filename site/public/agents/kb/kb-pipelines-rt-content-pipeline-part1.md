---
id: kb-pipelines-rt-content-pipeline
title: RT Content Pipeline (part 1/2)
updated: 2026-11-27
source: Mike Jones public knowledge base (https://mikejones.online/llms.txt)
---

# RT Content Pipeline (part 1/2)

## RT Content Pipeline

Intended flow (v1 design): trend-watcher (Reddit/X/YouTube/Substack/exa) → signal-scorer → trend report → content-generator → article drafts → platform-adapter (per-channel versions) → publish. Current state (verified 2026-11-01 23:30, archive leg first scheduled run): the top of that funnel is dead and accepted as dead; the rest of the pipeline is manual and single-homed at Social/; the measurement and the text archive both run as launchd legs. This is no longer a "revise v2" page — it records what runs, what does not, and where the procedure lives.

### One pipeline, one home

Mike's ruling 2026-10-29 (kanban t_81b71d28) froze the RT second pipeline wholesale: Resilient Tomorrow/Content Adapted/ (541 md), Content Drafts/ (124 md) and Drafts/ (17 md) — 682 files — moved to _Archive/2026-10/rt-content-pre-social/, promotion into Social/Adapted/ is on-demand item by item, and the Oct-2 TRIAGE-INDEX.md Keep/Trash pass is retired. The RT pipeline's own strategy docs moved to Social/Research/. So the v1 "v2 revision intended" intent recorded here on 2026-09-24 is superseded: there is no second pipeline to revise. The live procedure is Operations/content-pipeline.md (runbook, verified live 2026-10-29) and the replacement shape is Projects/content-pipeline/PLAN.md — ship one unit by hand, automate only what proves itself.

### What does not run

Stage Last sign of life Consequence Trend watchers (Reddit/X/YouTube/Substack/exa) newest trend report + scored set on disk: 2026-09-27 No automated signal feed; ideas come from Mike Signal scorer none since the scheduler died — Content generator ~930 generated notes quarantined in _Archive/2026-09/ Nothing auto-drafts Platform adapter — Cuts are made per piece, by hand, into Social/Adapted/<draft-name>/ Atomizer newest atom set 2026-10-08 Atoms lag pieces; built on demand The old wording here — "OpenClaw cron scheduler died 2026-07-28; with it died the trend-watcher family" — is half true and half misleading: the scheduler did die 2026-07-28, but reports kept being produced for two more months (newest 2026-09-27) before stopping. Anyone tempted to revive v1 should read Operations/content-pipeline.md §2 first: do not rebuild from the v1 spec.

### What does run

Two launchd agents, not Hermes cron, verified by launchctl list and their own logs on 2026-10-29 (both loaded, both exiting 0): com.jones-co.rt-substack-daily-pull — 23:30 daily; post, note and subscriber CSVs into ~/.openclaw/workspace/projects/ResilientTomorrow/data/. Post metadata is current (knows your-agent-their-terms, id 219345302). Its subscriber leg failed HTTP 403 on every run from ~2026-10-02 until 2026-11-12 (cookie scope, not a rebuild; it walked again 2026-11-12, last_pulled_at 15:06:39Z, [subs] appended 0). Leg 5 since 2026-11-01: the text archive (below). com.jones-co.rt-substack-stats-pull — 23:45 daily; note stats into Resilient Tomorrow/Analytics/data/notes-stats.jsonl, rewritten each run as a current snapshot, last capture 2026-11-12T23:45. com.jones-co.rt-substack-weekly-digest — Mondays 07:00 since 2026-11-12 (was Fri 17:00; the 7-day window now closes on a Mon–Sun week and lands before weekly planning). Reads only the CSVs, so it needs no cookie: subscribers/free + paid deltas, ARR, open rate, Mike's own notes, posts with views/open%/signups, and a Pipeline health table naming each pull leg's status. Writes Resilient Tomorrow/Analytics/Weekly-Digests/YYYY-MM-DD-Wxx.md; first note 2026-11-12-W46 (window 11-06 → 11-12). This is the leg that stops the numbers on this page being hand-entered.

### The artifact layer (added 2026-11-20)

Every practical piece now ships with a printable artifact — not a PDF download, a printable web page. The rule, the piece-type mapping (checklist/kit → checklist; decision/comparison → decision table; cost/budget → cost worksheet; narrative → none unless it names a thing to do twice), the per-piece order of work and the linking mechanics live in the runbook: Operations/content-pipeline.md §8. Why it exists: the 2026-11-15 autocomplete mining found buying-and-using intent phrased as printables ("grid down checklist", "food storage list for 1 year pdf"), not only essays. Where it lives: ~/Dev/resilient-tomorrow-site — one self-contained template (src/_includes/layouts/artifact.njk; letter-size @media print sheet, screen preview with a print button, zero new dependencies, static build unchanged) and instances at src/artifacts/<slug>.njk, publishing at /artifacts/<slug>/. Two constraints that bite: the site commit must land BEFORE the essay publishes (the essay tail carries the artifact's bare https:// URL; publish first and it 404s), and the Social/Published/ note records the artifact URL beside the essay URL. State: staged, not live. The Grid-Down Checklist is the first exemplar — essay draft in Social/Drafts/2026-11-20-grid-down-checklist/, artifact page src/artifacts/grid-down-checklist.njk present but untracked in the site working tree (nothing committed, nothing published, 2026-11-21). Pieces 2+ inherit the template; a template conflict with the site's shared layouts is reported, never fixed by restyling the site.
