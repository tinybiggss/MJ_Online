---
id: kb-pipelines-rt-content-pipeline
title: RT Content Pipeline
updated: 2026-10-30
source: Mike Jones public knowledge base (https://mikejones.online/llms.txt)
---

# RT Content Pipeline

## RT Content Pipeline

Intended flow (v1 design): trend-watcher (Reddit/X/YouTube/Substack/exa) → signal-scorer → trend report → content-generator → article drafts → platform-adapter (per-channel versions) → publish. Current state (verified 2026-10-29/30): the top of that funnel is dead and accepted as dead; the rest of the pipeline is manual and single-homed at Social/. This is no longer a "revise v2" page — it records what runs, what does not, and where the procedure lives.

### One pipeline, one home

Mike's ruling 2026-10-29 (kanban t_81b71d28) froze the RT second pipeline wholesale: Resilient Tomorrow/Content Adapted/ (541 md), Content Drafts/ (124 md) and Drafts/ (17 md) — 682 files — moved to _Archive/2026-10/rt-content-pre-social/, promotion into Social/Adapted/ is on-demand item by item, and the Oct-2 TRIAGE-INDEX.md Keep/Trash pass is retired. The RT pipeline's own strategy docs moved to Social/Research/. So the v1 "v2 revision intended" intent recorded here on 2026-09-24 is superseded: there is no second pipeline to revise. The live procedure is Operations/content-pipeline.md (runbook, verified live 2026-10-29) and the replacement shape is Projects/content-pipeline/PLAN.md — ship one unit by hand, automate only what proves itself.

### What does not run

Stage Last sign of life Consequence Trend watchers (Reddit/X/YouTube/Substack/exa) newest trend report + scored set on disk: 2026-09-27 No automated signal feed; ideas come from Mike Signal scorer none since the scheduler died — Content generator ~930 generated notes quarantined in _Archive/2026-09/ Nothing auto-drafts Platform adapter — Cuts are made per piece, by hand, into Social/Adapted/<draft-name>/ Atomizer newest atom set 2026-10-08 Atoms lag pieces; built on demand The old wording here — "OpenClaw cron scheduler died 2026-07-28; with it died the trend-watcher family" — is half true and half misleading: the scheduler did die 2026-07-28, but reports kept being produced for two more months (newest 2026-09-27) before stopping. Anyone tempted to revive v1 should read Operations/content-pipeline.md §2 first: do not rebuild from the v1 spec.

### What does run

Two launchd agents, not Hermes cron, verified by launchctl list and their own logs on 2026-10-29 (both loaded, both exiting 0): com.jones-co.rt-substack-daily-pull — 23:30 daily; post, note and subscriber CSVs into ~/.openclaw/workspace/projects/ResilientTomorrow/data/. Post metadata is current (knows your-agent-their-terms, id 219345302). Its subscriber leg has failed HTTP 403 on every run since ~2026-10-02 (cookie scope, not a rebuild). com.jones-co.rt-substack-stats-pull — 23:45 daily; note stats into Resilient Tomorrow/Analytics/data/notes-stats.jsonl, last capture 2026-10-29T06:45Z. The missing leg is the text archive. Resilient Tomorrow/Published/ (renamed from Completed Articles on 2026-10-29, 31 notes) had nothing after 2026-07-22 — the 2026-10-08 Muse piece never landed — and nothing compared the folder against the feed, so the gap went unseen for three months. The record layer is now a log at Social/Published/ (one note per piece, URLs not copies; schema in that folder's README, no retro backfill). The archiver is net-new, not a repair: the old rt_migrate_to_obsidian.py in ~/Dev/RT_articles/automation/ is a one-time migration with a hardcoded destination. Tracked on T-2026-10-29-CB8 (kanban t_e8d0afc5); drift guard is posts-CSV row count vs note count.

### What Worked in v1

Trend reports carry real content — measured on disk 2026-10-30: 48 trend reports + 46 scored signal sets (Resilient Tomorrow/Trend Reports/, 2026-06-27 → 2026-09-27). The "147 written" figure this page carried from 2026-09-24 is not reproducible from the folder; treat the on-disk count as the fact. Adapter produced per-channel versions with solid frontmatter conventions (source_draft, scheduled_date, platform keys) — worth keeping. Draft structure: one folder per date, N drafts, per-channel files.

### Related

generator-registry — this pipeline's emitters are listed there as dead resilient-tomorrow — the business this pipeline feeds publication-layer — the gate this pipeline publishes through
