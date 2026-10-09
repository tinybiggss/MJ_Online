---
id: kb-pipelines-rt-content-pipeline
title: RT Content Pipeline
updated: 2026-10-02
source: Mike Jones public knowledge base (https://mikejones.online/llms.txt)
---

# RT Content Pipeline

## RT Content Pipeline

Intended flow: trend-watcher (Reddit/X/YouTube/Substack/exa) → signal-scorer → trend report → content-generator → article drafts → platform-adapter (per-channel versions) → publish. Current state: not operational. Details: v1 was built but "never fully operational" (Mike, 2026-09-24) — he moved on before finishing it OpenClaw cron scheduler died 2026-07-28; with it died the trend-watcher family and the nightly generation runs ~1,200 generated notes from the dead era now quarantined in _Archive/2026-09/ Substack publication itself is live and hand-fed; the pipeline was supposed to automate the top of the funnel

### What Worked in v1

Signal scoring → trend reports have real content (147 written) Adapter produced per-channel versions with solid frontmatter conventions (source_draft, scheduled_date, platform keys) — worth keeping in v2 Draft structure: one folder per date, N drafts, per-channel files

### v2 Intent

Revise into something actually functional. Open design questions: Which stages to keep vs collapse (trend-watcher alone may not justify 4 separate scrapers) Run under Hermes cron (the scheduler that actually works today) vs fixing OpenClaw's runtime Generation cadence: weekly compile vs nightly run Quality gate: v1 generated volume nobody read — v2 needs a human-review checkpoint before anything reaches drafts

### Related

generator-registry — this pipeline's emitters are listed there as dead resilient-tomorrow — the business this pipeline feeds
