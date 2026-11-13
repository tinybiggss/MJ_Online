---
id: kb-pipelines-rt-content-pipeline
title: RT Content Pipeline (part 2/2)
updated: 2026-11-13
source: Mike Jones public knowledge base (https://mikejones.online/llms.txt)
---

# RT Content Pipeline (part 2/2)

### Repair mode — a partial note can be fixed (shipped 2026-11-02)

The archive's immutability rule had no way back: a note captured `body_complete: false` (truncated API body, a mid-post paywall) stayed partial even after the cookie was refreshed and the full body was fetchable. rt_archive.py now carries the repair path (vault card T-2026-11-01-YXJ, kanban t_4b3b967c): --list-incomplete — prints every partial note with its source URL, no network needed. --repair-incomplete [--dry-run] [--slug X] — re-fetches only those notes. Where the body now clears the completeness test it rewrites that one note in place: same filename, body_complete: true, captured kept as the original capture, recaptured: <ts> added beneath it, incomplete_reason dropped, every other frontmatter byte and every other note untouched. Where it still cannot, the note keeps what it has and says so out loud: `incomplete_reason: "body N/M words (P%)" plus a > [!warning] Partial capture` callout under the H1. The write path can no longer record a partial silently either: it retries a short body once (fetch_body_best), then marks the new note, logs INCOMPLETE <path>, appends incomplete=N to run-<month>.log, and the guard's body_complete=false warning names the repair command. Frontmatter convention was chosen deliberately: body_complete stays the machine flag (no second status enum for downstream readers to learn), with recaptured and incomplete_reason as additives. State at 2026-11-03: 0 partial notes in the vault, so repair has had nothing to rewrite here; the path was exercised live against the Substack API on a throwaway vault copy (1 repaired at 2,268 words, 1 marked as unreachable).

### What Worked in v1

Trend reports carry real content — measured on disk 2026-10-30: 48 trend reports + 46 scored signal sets (Resilient Tomorrow/Trend Reports/, 2026-06-27 → 2026-09-27). The "147 written" figure this page carried from 2026-09-24 is not reproducible from the folder; treat the on-disk count as the fact. Adapter produced per-channel versions with solid frontmatter conventions (source_draft, scheduled_date, platform keys) — worth keeping. Draft structure: one folder per date, N drafts, per-channel files.

### Related

generator-registry — this pipeline's emitters are listed there as dead resilient-tomorrow — the business this pipeline feeds publication-layer — the gate this pipeline publishes through
