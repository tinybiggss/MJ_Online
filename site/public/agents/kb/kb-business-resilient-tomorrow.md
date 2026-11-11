---
id: kb-business-resilient-tomorrow
title: Resilient Tomorrow
updated: 2026-11-11
source: Mike Jones public knowledge base (https://mikejones.online/llms.txt)
---

# Resilient Tomorrow

## Resilient Tomorrow

Media + platform. The legacy play (north-star): "known for Resilient Tomorrow. Teaching people how to build technology that makes their lives more independent and connected."

### Identity

Tagline: "Build your exit. Without burning anything down." Archetype: Outlaw (60-70%) + Sage (30-40%) — the rebel who found the exits, calmly showing them NOT: prepper site, self-help, activism, guru platform, charity

### The Staircase Model (load-bearing)

1. Perspective — "The system did this to you." 2. Practical Path — "Here's the audit. Here's the first step." 3. Peer Belonging — "You're not alone." Community is the side effect, not the selling point. Evidence: individual-framed articles outperform collective-organizing CTAs by ~10x (16,316 views / 378 signups vs ~1,250 views / net subscriber loss). Strategic teaching direction (2026-10-26): Teach people to regain control one system at a time. Each class should create a concrete win, then connect the learner to the tools, formulas, or options for the next step. The aim is to stay half a step ahead and show the way—not to wait for a complete platform before teaching. The first class and its specific outcome remain undecided; the working note is the raw hub Resilient Tomorrow/RT Content Engine.md.

### Seven Pillars

Energy · Food · Governance · Health · Shelter · Finance · Connection (voice lines for each live in Resilient Tomorrow/CLAUDE.md)

### Product Architecture

` RT Tools / Scorecard (free entry — individual, not collective) → RT Community / The Commons ($50/mo) → RT Courses (member-created, revenue share) → RT Commons Fund (member-funded grants) ` Front door is Tools (individual), not Community (collective).

### Content Machinery

Substack publication is live. The content generation pipeline (trend-watcher → generator → adapter) is not operational — v1 never fully worked, scheduler died 2026-07-28. The "v2 revision is intended" line this page carried from 2026-09-24 is superseded: Mike's 2026-10-29 single-home ruling froze the RT second pipeline (682 md to _Archive/2026-10/rt-content-pre-social/) and made Social/ the only drafting, adaptation and published-log home. The replacement is a runbook (Operations/content-pipeline.md) plus one unit shipped by hand at a time — not a rebuilt machine. Reaffirmed 2026-11-05 (kanban t_acabf0b3): the Resilient Tomorrow/Article …/ folders had regrown a second drafting home, so both live drafts were moved into Social/Drafts/<date>-<slug>/ and the convention was retired; Operations/content-surfaces.md now fixes one sentence per surface so the same map does not get rewritten by each agent. What *is* automated is measurement, not production: two launchd agents pull Substack nightly (posts/notes/daily CSVs 23:30, note stats 23:45). Since 2026-11-01 the text archive is automated too — rt_archive.py runs as leg 5 of the 23:30 pull, archiving every post with no vault note into Resilient Tomorrow/Published/ and logging it in Social/Published/ only when no note cites that canonical URL; a nightly drift guard compares the public archive's post set against the note set and raises a T- card on any mismatch. Verified 2026-11-01 23:30: 33 posts / 33 log notes, 0 missing, guard ok, and the backfill closed both gaps (2026-10-08 Muse, 2026-10-30 "Three Ways…"). That green reading has not held since, and the failure is chronic: every nightly from 2026-11-05 through 11-09 logged posts=0 … guard=error, and the pull's own error log repeats [posts] FAILED: HTTP Error 400 and `[archive] FAILED: … HTTP Error 400` at each 23:30 tick — the post and archive reads are being rejected outright, so nothing has completed a successful pull since 2026-11-03. Because the drift comparison is skipped on error, a dead archive leg alarms nobody: T-2026-11-04-EWF (opened on 21 false orphans after the 11-04 partial fetch) is closed, and drift-state.json still reads last_ok 2026-11-03T23:30:20-08:00. Coverage has held by hand — Mike published "A Blue Wave Won't Build What We Need" on 2026-11-09 (2,840 words), the shipped final of the two-clocks draft, and it was archived by a manual run that afternoon rather than by the nightly — so Resilient Tomorrow/Published/ now holds 34 posts and Social/Published/ six log notes (10-08, 10-29, 11-02, 11-03, 11-04, 11-09); the 11-04 Mark-Day piece still logs seven platforms with every URL null. Distribution of the Blue Wave piece is partly recorded: the 11-10 video went to the video platforms, and the agent posted the Bluesky cut the same evening at 21:16 PT (2:58 of the 7:27 cut, post 3mzz7ah4c2c2g, ledger entry 2026-11-10T21:16:55-08:00); LinkedIn is not recorded as done. Superseded 2026-11-10 — kept per contradiction policy (2026-11-05 wording): *"the 2026-11-04 23:30 tick failed its posts fetch … the archive leg saw 12 of 33 posts and the guard opened high-priority T-2026-11-04-EWF on 21 notes it called orphans — the vault still holds all 33 … Social/Published/ now holds five log notes (10-08, 10-29, 11-02, 11-03, 11-04)."* That reading treated one failed fetch as the whole fault; the leg has not pulled successfully since 2026-11-03. 2026-10-30 wording on this page — "the missing leg is the text archive … had nothing after 2026-07-22 … no retro backfill … archiver tracked on Tasks/T-2026-10-29-CB8" — is superseded; the card is resolved (2026-11-01). The split it described survives: text in Resilient Tomorrow/Published/, canonical record in the Social/Published/ log (URLs and metadata, never hand-edited). Subscriber numbers are still hand-entered because the pull's subscriber leg has 403'd since ~2026-10-02. See rt-content-pipeline and generator-registry.
