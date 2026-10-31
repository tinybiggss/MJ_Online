# Public automations page: feature-option spec (consolidated)

**For:** Mike
**From:** Spock (product), consolidating four inputs
**Date:** 2026-10-30
**Task:** kanban t_5153b4b5 (consolidation). Root option card: t_a857b360.
**Status: CAPTURED FUTURE OPTION, NOT A BUILD ORDER. No production change is authorized by this card. Nothing here is scheduled work. It activates only when you ask for the page, and every step below needs your ruling before a single file moves.**

**Inputs merged:** `public-automations-decision-2026-10-30.md` (t_cf4e6b4a, rulings R-1..R-5), `public-automations-content-model-2026-10-30.md` (t_968ed76e), `spec-registry-projection-2026-10-30.md` (t_15229258, declined design + S-1), `publication-gate-workflow-spec.md` (t_520c2740). Where they disagree, section 9 says so and section 10 lists what I could not close.

---

## 0. The verdict in five lines

One **case study on `/work`**, for **humans**, written as **authored prose curated from the held draft**, published through the **gate that already exists**.

It publishes categories, role names, one dated aggregate count, coarse cadence in prose, and failure **classes**. It never publishes job ids, credential or state paths, a schedule set, run status, or third-party data.

No generator, no digest alarm, no `/agents/` cut, no new route. A frozen "as of" window does the work a drift detector would otherwise pretend to do.

**The page is roughly one curation pass plus four small site edits, not a pipeline.** If you say go, my estimate is a day, and most of it is editing your own draft.

**Six decisions are yours (section 8). Nothing else in this document needs an answer to stay correct as a record.**

---

## 1. What the option actually is

The registry (`KB/pipelines/generator-registry.md`) went `public: no` on 2026-10-30 and its four exported files now answer 410 (t_c1a52c37). You called the automations page "a future feature option" on that card. This is that option, written down properly so the next worker inherits rulings instead of re-deriving them.

The cheapest true version was already sitting in your drafts: `content-drafts/case-studies/agent-stack.md` (99 lines, held from the Anthropic application) is most of the page in your voice, and its own header says it belongs on `/work`.

**The five rulings below are decisions, not questions.** They are inherited, not reopened:

| ID | Ruling | One-line reason |
|---|---|---|
| R-1 | Humans only, one cut. No `/agents/` version, now or later. | `/agents/` is a 1:1 digest-checked claims register. A fleet inventory there makes every paused job a false claim the daily alarm chases, which is the failure you just cleared. |
| R-2 | Link from `KB/ai/how-mike-works.md`; never replace or augment it. | That page's subject is how to work with Mike. An inventory's subject is what runs unattended. Merging back-doors the inventory into the export and turns a stable page into a weekly-edited one. |
| R-3 | Publish categories, role names, one dated aggregate count, coarse cadence. Never ids, credential or state paths, a schedule set, per-row counts, run status, third-party data. | Test per sentence: does it tell a reader when a bot is *not* looking, or what it would fail to catch? |
| R-4 | The mail-triage loss publishes as a failure **class**, not an instance, while the blind spot is open. | Same lesson, no third party, no live hole advertised. |
| R-5 | No generator, no digest, no drift alarm. Container is the existing frozen-prose case-study collection; a dated window bounds decay. | A projection of a lagging source is wrong at build time, and a digest cannot see a claim go false with no byte changing. |

### 1.1 The root card's five original requirements, answered

The feature-option card (t_a857b360) asked for five properties. Each is satisfied, or explicitly re-answered:

| Original requirement | Resolution |
|---|---|
| An audience-facing inventory, not the operator table | Yes: one `/work` case study whose units are "what it does for Mike and his readers", not scheduler wiring. |
| No ids, paths, tokens, third-party data | Yes: exclusion set X-1..X-12 (section 4), measured against the real corpus. |
| Generated or hand-written **from** the registry, so the private page stays the source of truth | Hand-written, **checked against** the registry at staging. The directionality the card asked for survives (one source of truth, no second copy); the generator does not. |
| Gated by the publication layer: agents stage, Mike approves | Yes: the existing `publish-case-studies.mjs` gate plus your commit and push (section 6). |
| If generated, the same digest and drift detection | Not generated, so the conditional does not fire. A dated window plus an optional ~25-line publish-time staleness lint (S-1) replaces it. |

---

## 2. Recommended scope

**v1 scope, if and only if you say go:**

1. Curate `agent-stack.md` into `content-drafts/case-studies/publish/agent-stack.md` per the curation map in 3.6 (drop the Anthropic header, drop "Needs from Mike", rewrite "Growth read" for a reader, replace "Sources" with scrubbed receipts, refresh every count at staging, and clear every leak listed in section 4.4, including the one in the body at line 41).
2. Add the case study's slot to `CASE_ORDER` in `site/src/lib/case-studies.ts`. **This is build-enforced**: a published case file with no slot throws "published case file has no slot in CASE_ORDER". The three sibling specs all missed this; it is one line, but the page does not build without it.
3. Publish via `node scripts/publish-case-studies.mjs agent-stack`, which copies the frozen prose into `src/content/case-studies/`, refusing on a missing required heading, an empty Sources list, or a slug/filename mismatch.
4. Systems-index pointer (D-4): one line in `CASE_PROJECTS` in `site/src/pages/work.astro`, keyed on the case study's `short` value matching a project name in `site/src/lib/content.ts`. See 6.4: this is cheaper than the "add a row" the memo proposed, because the row already exists.
5. One gated sentence appended to `KB/ai/how-mike-works.md` under the normal KB gate (text staged in the content model, not applied).
6. Build, verify, commit; you push. Live verification after deploy.

**Not in v1, at any price:** a generator, a route, a template, a nav item, an `/agents/` file, a digest file, a detector cron, a schema overhaul, a registry rewrite.

---

## 3. Reader-facing inventory design

### 3.1 Container and schema

The page is a case study in the existing collection: `site/src/content/case-studies/*.md`, schema in `site/src/content.config.ts`, frozen prose copied from `content-drafts/case-studies/publish/`.

Verified schema (read tonight): `title, slug, kind: "case-study", short, tag, status, rowTitle, diag, navMark, position (min 1), ledger (2..4), plate? {src, alt, caption}, appendix?`. Every string field is refined against an em-dash check and **fails the build** if one appears.

Gate rules the schema and script enforce, verified in source:

- six required headings: `The problem`, `What was actually blocking use`, `What I designed`, `What I'd change`, `Growth read`, `Sources`;
- `Sources` must contain at least one list item;
- frontmatter `slug` must equal the filename;
- prose is never rewritten by the script (frozen copy).

**Correction to the memo, carried from the content model and re-verified:** the memo's pre-mortem says "strip Growth read". It cannot be stripped; the gate requires the heading. It is a **rewrite** for a general reader (keep the demand-signature observation, drop the qualification and growth-team framing). Same for `Sources`: it cannot be emptied, so the path list is **replaced** with scrubbed receipts.

### 3.2 The inventory unit

Prose paragraphs in "What I designed" (echoed in the other sections), one unit per automation category, each carrying:

1. the category (bold lead);
2. the reader-facing effect (what it does for Mike and his readers);
3. the named role(s) that run it (role names are allowed by R-3, and the eight personas are allowed by the resolution in 9.11; the draft already publishes both);
4. coarse cadence in prose ("every morning", "nightly"); a single in-story clock time is allowed, a schedule set is not;
5. a dated receipt where one exists.

Explicitly not: wiring, a job id, a path, a per-row count, a run status, a schedule set, third-party data.

### 3.3 The aggregate count, and its three carriers

One number, one date, three carriers refreshed together: `navMark`, one ledger receipt, one prose sentence ("as of October 2026"). Nothing else on the page may carry a volume claim.

**The number is not decided here and must not be copied from any input document.** Three different values are in play (section 5.3). Whatever the publisher counts on the staging date is what ships, with that date.

### 3.4 Illustrative frontmatter (build-clean; values marked [r] refresh at staging)

```yaml
---
title: "The Agent Stack: automation I designed, shipped, and live in"
slug: agent-stack
kind: case-study
short: "Agent Executive Suite"
tag: "personal automation"
status: "live daily, one user"
rowTitle: "The agent stack: eight named roles, one operator"
diag: "My tools had no memory of each other, and I was the transport layer."
navMark: "<count> enabled jobs, October 2026"
position: "Each piece was fine on its own. The problem lived between them, and so did the fix."
ledger:
  - "one shared memory ledger, every write validated or rejected"
  - "eight named agent profiles, one role each"
  - "<count> enabled jobs across four profiles, as of October 2026"
  - "the morning brief, read every morning"
---
```

Note `short: "Agent Executive Suite"`. That is a deliberate lever, not a typo: `CASE_PROJECTS` in `work.astro` maps a case study to a Systems-index row **by matching the case study's `short` against a project name**. "Agent Executive Suite" is an existing row ("A multi-agent org structure: a chief-of-staff agent plus ops, sales, and product agents coordinating across every venture"). Naming the case study after that row buys the index link with one mapping line and no new row, no "ten systems" copy churn, no tenth screenshot. If you prefer a different display name, D-4 gets more expensive, not less (6.4).

Sample flag: that `short` assumes D-4 is answered "yes". If you decline the Systems-index pointer, `short` is free text and any display name works. If you accept it, `short` must equal the `content.ts` row name exactly, or the index link silently does not appear: `CASE_PROJECTS` is a name-keyed lookup with a `?? null` fallback, so a near-miss fails quietly rather than at build.

### 3.5 Sample entries (illustrative prose, already in your genre)

> **The morning brief.** The one thing I read before work. It takes the week's plan, promotes up to five things into the day, and reports what broke overnight before anything else. The delivery check behind it has to prove it delivered what it claims, or the brief does not send.

> **One shared memory.** Every agent writes session evidence into the same ledger through a single writer that validates or rejects the write, and a write that does not validate does not land. There is a nightly pass that looks for patterns in all of it, and it is allowed to find nothing.

> **Eight named roles.** Finance, content, design, dev lead, marketing, operations, product, release. Money moves only behind an approval the seat can grant.

> **A publish gate instead of a reflex.** Content moves from draft to published through a check that stages the copy and holds the ship until the artifacts match the source, and nothing goes live without a human pass.

> **The failure class I design against.** A job that cannot read what it was sent has to say so out loud, and a job that goes quiet because it already advanced its gate is the failure the fidelity checks exist to catch. I have lost real messages to exactly this shape. The specific story waits for the fix.

### 3.6 Curation map for `agent-stack.md` (the staging-time work, pending D-1)

Restated from the content model so this document stands alone. Left column is the draft as it stands tonight; right column is the only permitted treatment.

| Section / block of the draft | Action |
|---|---|
| Anthropic header, held-draft blockquote, author line (lines 1-9) | Drop. This was an application, not site copy. |
| `The problem` (line 11) | Carry. It is the `diag` in prose. |
| `What was actually blocking use` (line 23) | Carry; refresh counts; drop the network addressing (port, mesh VPN, refresh intervals) with the scheduler detail. |
| `What I designed` (line 33) | Carry as inventory units (3.2). Rewrite the two quoted health strings as described checks. Drop script names and file paths except working-path receipts. |
| `What I'd change` (line 45) | Carry. Failures stay classes; the untrimmed-ledger and the never-built spec are the honest residue and they are the section's value. |
| `Growth read` (line 55) | **Rewrite** for a general reader. Keep the demand-signature observation; drop the qualification and growth-team framing. The heading is required by the gate. |
| `Sources` (lines 65-89) | **Replace** the whole path list with the scrubbed shape: public KB pages, the private registry named without a path, dated. The gate requires at least one list item. |
| `Needs from Mike` (lines 90-99) | Drop. Internal notes. |
| Every count ("33 cron jobs, 26 enabled" at lines 29 and 67) | Refresh at staging from a live store count; date it; carries into `navMark`, one ledger receipt and one prose sentence only. |

---

## 4. Exclusion and safety requirements

These are mandatory. Any one of them fails an entry regardless of how the prose reads. (Renumbered from the projection spec's `D-1..D-10` to `X-1..X-12` so they stop colliding with your decision numbers; see 9.7.)

| ID | Rule | Why it exists |
|---|---|---|
| X-1 | No job ids as identifiers: no row key, no column, nothing that lets a reader correlate a live scheduler record. A frozen receipt path is a separate question (D-6). | The id is the enumeration handle for every card, log line and cron record. |
| X-2 | No kanban card ids, ever. | Same handle, internal board. |
| X-3a | No credential or **state** paths: `secrets/`, `tokens.json`, `.config/`, `.hermes/`, `price-watches/`, `jobs.json`, `.prune-ledger`, `state.db`. | A key path is a target; a state path is a map of the machine. |
| X-3b | **Allowed deliberately:** a working path cited as provenance (`~/Dev/<repo>/FILE.md`, a memory ledger mount). | R-3's own wording is "credential or state paths", not all paths. Your three published case studies cite working files as receipts; a rule your own shipped pages break gets waived at the first review. |
| X-4 | No credentials or token material of any kind (`secret`, `token`, `PAT`, `api key`, `password`, `oauth`). | Obvious; also catches a rewrite that re-introduces a name. |
| X-5 | No scheduler topology: no cron expression, no job-store name, no per-store or per-profile breakdown. The **aggregate** profile count is allowed ("across four profiles"). | A per-store matrix is an operator diagram. |
| X-6 | No run-status bookkeeping: no `enabled=`, no last-run time, no pass/fail string, no paused/completed state. Describe designed checks in the abstract. | Run status is stale within hours and meaningless to a reader. |
| X-7 | No third-party personal data: no family, client, candidate, mailbox identity, calendar entry, gift item. Roster lives outside the repo. | One named third party turns a systems page into a privacy event. |
| X-8 | No host or network identity: no IPv4 literal, port, `.local` hostname, launchd label, Tailscale reference. | A live endpoint on a private network is an address, not trivia. |
| X-9 | No delivery channels (`telegram`, `bot-chat`, `deliver all`). | Channel map is operator detail. |
| X-10 | No complete schedule set and no schedule column; at most one in-story clock time on the page. | A firing-time table is a map of when nobody is watching. |
| X-11 | No line-redaction of the registry table, ever. Authored prose only; facts are **checked** against the registry at staging. | The row shape defeated the redactor; a rewrite is authorship, and authorship is the point. |
| X-12 | No `/agents/` surface: not in the export, `index.json`, `llms.txt`, or the query endpoint. | R-1, mechanically. |

Two structural rules ride with the list:

- **Per-sentence test (R-3), which outranks any wording preference here:** does the sentence tell a reader when a bot is *not* looking, or what it would fail to catch? If yes, cut it.
- **No-surgery rule (from the gate spec, kept):** a passage that fails a screen is removed whole and rewritten, never redacted mid-sentence. The 2026-10-30 drift audit's row 12 (a redactor mangling an internal-rates paragraph into a public fact sheet) is the counterexample.

### 4.1 The rejection checklist

The content model's 13-item per-entry checklist (committed at `docs/plans/public-automations-content-model-2026-10-30.md` §6) is adopted unchanged as the staging screen: id, path, wiring, schedule set, run status, "when is nobody watching", named person, personal-life row, open blind spot as instance, lifted table line, `/agents/` presence, exactly one dated aggregate, build gate. Plus the retell test: if a paragraph contains no fact a reader would repeat to a colleague, fold it to a résumé line.

### 4.2 Measured corpus (why "just filter the table" does not exist)

Run over the real sources on 2026-10-30 (projection card, 23:35 PT; I spot-checked its conclusions below):

| Corpus | job ids | card ids | state-path tokens | cron exprs | run-status hits | third-party names |
|---|---|---|---|---|---|---|
| `KB/pipelines/generator-registry.md` (35 table rows) | 32 | 12 | 71 | 7 | 93 | 5 |
| `content-drafts/case-studies/agent-stack.md` | 0 | 0 | **2, plus body hits the earlier run missed (4.4)** | 0 | **3 quoted health strings** | 1 |
| `add-friendly-agent.md`, **live served bytes** (curl, 2026-10-31) | **1** | 0 | 0 | 0 | 0 | 0 |
| `content-drafts/.../add-friendly-agent.md` (staging draft, not served) | 3 | 0 | 3+ | 0 | 0 | 0 |
| `distills.md`, `neighborhoodshare.md` (**live**) | 0 | 0 | 0 | 0 | 0 | 0 |

The registry cannot be published by any transform that preserves its language: 32 job ids, 12 card ids, 71 state-path tokens, 7 cron expressions and five third-party names sit inside 35 rows of prose. The unit of the table is a row; the unit of publication is a sentence. That is the whole argument against the generator, with numbers.

### 4.3 The live precedent that the new page does not inherit

`add-friendly-agent.md` is live on `/work` and its **served bytes carry one job id**, inside a frozen `~/.hermes/cron/output/577137c655f2/` receipt (re-verified by curl on 2026-10-31; the staging draft carried three, but only one survived curation into the published copy). No state paths are served; `/work/distills` and `/work/neighborhoodshare` carry zero ids and zero paths. Under a strict reading of X-1 that one frozen receipt path is a latent problem. The new page needs no ids at all, so this does not block it; it is your call as D-6, and the exposure is one page, one hash.

### 4.4 Leaks in the draft, and a correction to the input measurement

Verified by reading `content-drafts/case-studies/agent-stack.md` tonight. The inputs called this draft "nearly clean, two hits"; it is clean-ish, but the two hits are not the only problem, and two of the extras sit in the **body**, where the "replace Sources whole" move does not reach them:

- line 86, `Sources`: `http://100.82.70.37:11434/api/tags`, a live Ollama endpoint on your private network (X-8). The block is replaced whole, so this one is disposed of by rule.
- line 94, "Needs from Mike": `GHN`. That block (from line 90) is dropped entirely.
- **line 41, body:** "Phase 0 shipped as a lightweight command center on port 3333 over Tailscale". A port number and a mesh-VPN name, published as a sentence, in the middle of the best paragraph on the page. X-8 forbids it and no block-replacement rule removes it; it is a rewrite.
- **lines 35 and 39, body:** quoted run results, `pipeline_health: ok` and `feed-fidelity: OK`. X-6 forbids quoting a run's result; describe the check, do not print its output. Same rewrite, three strings.
- **line 67, `Sources`:** `~/.hermes/cron/jobs.json` and line 85 `~/.openclaw/workspace/.../Cron-Health/cron-health-log.jsonl`. Both are state paths under X-3a. **Correction:** the projection card reports zero state-path hits in this draft; by its own pattern list (`jobs.json`, `.hermes/`) line 67 alone is two tokens. Both sit in `Sources`, so the replacement covers them; the point is that a worker who trusts the earlier number and decides to keep that block ships machine paths.
- line 39 also names all eight agent personas (Alfred, Perkins, Norman, Daedalus, Don, Callimachus, Spock, Scotty). That is not a leak under the X-list, but it is a disclosure the content model's sample quietly dropped, so it is recorded as a conflict in 9.11 rather than decided in passing.

The lesson for the staging pass: run the screens over the **staged copy**, not over the earlier measurement. The inherited count understated the draft twice.

---

## 5. Generation and drift detection

### 5.1 The generator is a declined design, not a deferred one

Recorded so nobody re-derives it. The projection design is on file at `docs/plans/spec-registry-projection-2026-10-30.md` (allow-list A-1..A-6, transform rules T-1..T-6, the deny list, three digest candidates, failure modes F-1..F-10, review points RP-1..RP-4, acceptance checks AC-1..AC-11). Its deny list appears here renumbered X-1..X-12 for the reason in 9.7. It is not authorized and this spec does not revive it.

### 5.2 Why, technically

1. **No field boundary to project through.** One Live row carries, in a single line, a job id, a schedule expression, a profile name, a state path, a run-status history, an incident note and a delivery channel. A projection selects fields; here the only extractable unit is a row, and publishing a row's meaning requires rewriting it. Rewriting is authorship, which is the cost the ruling refused to pay.
2. **The source lags its own truth by construction, and this is measured, not argued.** The registry says "31 enabled as of 2026-10-30". I counted the four stores at 23:36 tonight: default 24 of 26, ops 4 of 4, dev-lead 2 of 2, roy 2 of 2, so **32 enabled across 34 records**. Three default records are unlisted; two were created after the 03:00 pass that last verified the page (RT Bluesky publish 12:09, disabled; Agentic feed T1 13:24, enabled). A generator built this morning ships a knowingly incomplete inventory, and the drift alarm beside it fires on its first comparison, as the truth.
3. **A digest measures the wrong quantity.** Hash the emitted page and it churns on nightly bookkeeping while the page's meaning does not change. Hash only the published fields and it stays silent while a claim goes false with no byte changing (a job is deleted; the count is now wrong; the page is byte-identical). Neither answers the only question worth asking: is the sentence a reader is looking at still true today? That is answered by re-measurement at publish, or not at all.
4. **The claims-register collision** is why there is no `/agents/` cut: an inventory in a digest-checked register converts every paused or deleted job into a false claim that a daily alarm chases.

### 5.3 The count is a measured value, never a stored one

Three numbers exist tonight and none of them may be published as-is:

| Source | Says | Status |
|---|---|---|
| `agent-stack.md` draft, lines 29 and 67 | "33 cron jobs, 26 of them enabled" | Stale. Pre-dates several jobs. Publish-blocking if copied. |
| `generator-registry.md` | "31 enabled as of 2026-10-30" | Stale by one live job, verified 5.2. |
| The four job stores, counted tonight | **32 enabled, 34 records** | Ground truth at 23:36 on 2026-10-30. Becomes stale by morning. |

Rule: the publisher counts at staging, writes the number and the date into the three carriers (3.3), and never carries a number forward from a document.

### 5.4 What replaces drift detection

- **A frozen window.** The page states its measurement month in prose and in the count-bearing receipt. A stale date is visible to a reader, which is the honest failure mode; a stale row is a false claim to a machine, which is the dishonest one.
- **S-1, an optional publish-time staleness lint (gated on D-5).** ~15 lines in `publish-case-studies.mjs`, ~8 in `verify-case-render.mjs`, one optional `asOf` schema line (`^\d{4}-(0[1-9]|1[0-2])$`), and a three-case test (fresh, stale, missing). At publish, a tracked slug with no `asOf`, or one more than two quarters old, is **refused** with the script's existing `refused:` idiom; `--allow-stale` overrides and prints what it overrode. At build, it is a **warning**, never a failure: a content fact must not break a cloud build where nobody can act on it. The tracked-slug list is a literal array, not a heuristic over prose.
- **Who refreshes, and when:** the publisher, in the same session, by counting the live stores. Not the nightly KB pass (its owner is the registry, not this page). Not a cron job: a job that updates a number nobody approved is a generator with extra steps.
- **What the lint cannot do:** a bumped month passes it. F-10 is real. The truth check is a fresh count in the same session, and it is Mike's review question (6.3), not a machine's.

### 5.5 What would reopen the projection

Only as decisions, never as drift: you want per-job public pages rather than a system narrative; the case-study container is retired or stops being gated; a second reader surface appears that must be machine-checkable; or the registry gains a structured field-level public representation (it will not; its shape is what broke it).

---

## 6. Publication approval path

### 6.1 The gate, scoped to this surface

The gate workflow spec is written surface-agnostically, with an `/agents/` variant beside a human page. For **this** surface, the variant table collapses to one column, and part of its machinery does not apply. The mapping, so a future worker does not implement the wrong half:

| Gate step / mechanism | For this page | Note |
|---|---|---|
| 0. Prerequisite ruling | **Applies, re-read for a curated page.** | The gate spec's step 0 was written for a registry-derived projection and requires either a marker flip or an approved public source. This page is authored prose that *checks against* the registry; the registry stays `public: no` and must not be flipped to publish it. Your activation ruling ("build the page") is the gate. See 9.2. |
| 1. Stage to a staging area with a review packet | **Applies, in the case-study shape.** | Staging area is `content-drafts/case-studies/publish/`. Packet: the rendered copy as it will appear, a diff against the live version, and a one-page stage report with the screen results. |
| 2. Mechanical screens before Mike | **Applies**, with the X-list and the 13-item checklist; the provenance screen becomes "every sentence traces to the draft or a dated measurement". | The gate spec's confidential-marker list (NDA / GHN / internal and similar) is merged into X-7/X-4; the third-party roster stays outside the repo. |
| 3. Review on the card | **Applies.** Your review surface is the card. | |
| 4. Mike's verdict | **Applies.** Approve / approve-with-edits (re-stage) / reject. | |
| 5. Approval evidence | **Applies, in a three-part shape** (6.2). | The trio's `gate-state.json` is dropped for this surface; see 9.4. |
| 6. Commit, then push by Mike | **Applies.** Commit by the staging worker; `git push` by you unless the approval explicitly authorizes that one commit. | |
| 7. Verify live | **Applies.** Curl the page, compare served bytes to the commit, confirm no `/agents/` companion changed, run the suite, record on the card and in `KB/log.md`. | |
| 8. Register the drift detector | **Does not apply. Substituted.** | There is no detector, so there is nothing to register. The substitution is the asOf window plus the S-1 lint; write that sentence into the card so a later reviewer does not read step 8 as unmet (9.3). |
| §4 drift re-approval (digest compare, in-band stamp, 72h standing order) | **Does not apply.** | The page publishes no live claim, so there is no digest to bind and no drift to re-approve. The gate spec's own §4 is scoped to surfaces that publish live claims. |
| §5 unpublish procedure | **Applies in full, unchanged.** | Case A (content withdrawal): close the gate at the source, history line, `KB/log.md` delta, regenerate, delete in a gated commit, **410 middleware guard**, short edge TTL, prove the companion indexes are clean, never `git revert`. Case B (defect): revert plus normal gate. This is the incident playbook and it is the part of the gate spec I would not touch. |

### 6.2 Approval evidence for a case study

Three layers, fail-closed:

1. **Your words on the card.** Approve, approve-with-edits, or reject, naming what you looked at. Chat or verbal approval is not evidence.
2. **The committed frozen copy.** `content-drafts/case-studies/publish/agent-stack.md` plus the generated `site/src/content/case-studies/agent-stack.md` in one commit. The commit hash *is* the artifact digest; git content-addresses it, so a separate digest file would be a second copy of the same fact.
3. **A `KB/log.md` claim-delta line**, because the page asserts business facts (a fleet exists, it runs, it is one operator) that outlive the repo.

Dropped deliberately: `gate-state.json`, the in-band approved-digest stamp rendered into the page, and the 72h auto-withdrawal standing order. None of them has an object to bind on a page with no per-claim digest, and the page already carries its own honest freshness signal (the date).

### 6.3 Your one review question

R-3's test, per sentence: *does this reveal when a bot is not looking, or what it would fail to catch?* No pattern sees tense and truth at once; this is the review that cannot be delegated, and it is the one that catches a semantic leak through a rewrite and an open incident described as fixed.

### 6.4 The four site edits the input specs did not enumerate

Verified in source tonight. Publishing this case study is not a zero-code operation, and three cards each assumed it was:

1. `site/src/lib/case-studies.ts`: add the slug to `CASE_ORDER`. Without it the build throws "published case file has no slot in CASE_ORDER". One line, hard requirement.
2. `site/src/pages/work.astro`: `CASE_PROJECTS` currently maps exactly one case (`cases[0]`) to a Systems-index row, keyed by the case's `short` matching a project name. A pointer for this page is one more entry (D-4).
3. `site/src/pages/work.astro` line 25: the page description says "Three product design case studies". A fourth makes that string false. Either edit it or accept the false count; this is site copy, not the case study.
4. `KB/ai/how-mike-works.md`: one appended sentence under the KB gate (R-2). Text staged in the content model's §7, not applied.

Not required, and a reason the earlier specs overstated the work: no schema change to carry the page (the date lives in prose and receipts), no new route, no new template, no nav item, no index count change if `short` maps to the existing "Agent Executive Suite" row.

---

## 7. Non-goals

- No generator, no route, no template, no nav item, no second copy that drifts.
- No digest, no committed `digest.json`, no alarm, no nightly writer, no detector cron for this page.
- No `/agents/` cut in any form, now or as a curated second version.
- No change to `KB/ai/how-mike-works.md` beyond the one appended sentence.
- No sentence-level redactor for the registry, ever.
- No registry rewrite or "make it publishable" project. The registry is an operator document and stays one.
- No personal or family automation rows (pending D-2).
- No live numbers, no per-row counts, no schedule table, no run status.
- No production change of any kind under this card.

---

## 8. Decisions for you

| ID | Question | Recommendation | Default if you say nothing |
|---|---|---|---|
| D-1 | Repurpose `agent-stack.md`, or write fresh? | **Repurpose.** It is your voice, already says it belongs on `/work`, and the curation map is finite. | Nothing ships; the card stays a captured option. |
| D-2 | Does anything about your personal or family life appear? | **No.** Business and system automation only; personal jobs at most as an unnamed category ("logistics and reminders"). | No personal content; X-7 stays absolute. |
| D-3 | Do the honest failures go in? | **Yes, as classes.** "What I'd change" is what makes the page credible; the lessons are what a client buys. The open mail-triage instance stays out until the fix lands (R-4). | Failure classes out; the page loses its best section and its `diag` becomes decorative. |
| D-4 | Route and pointer. | **`/work/agent-stack` case study, plus one `CASE_PROJECTS` entry attaching it to the existing "Agent Executive Suite" row** (which also sets `short` to that name). Cheaper and more honest than a tenth system row: no "nine systems" copy churn, no new screenshot. | Case study only, unlinked from the Systems index; readers reach it from the `/work` case list. |
| D-5 | Does the case study carry an `asOf`, turning on the S-1 lint? | **Yes.** ~25 lines, it refuses a stale count at publish, and it is the only guard left once the detector is gone. | No guard: the page ships a dated count with nothing checking the date, and decay is unbounded. |
| D-6 | Does the live `add-friendly-agent` page keep its **one** job id inside a frozen receipt path? | **Grandfather frozen receipt paths as provenance; scope X-1 to live identifiers, and write the distinction into R-3.** Rationale: a receipt path in a dated citation is provenance, not an enumeration handle; re-publishing an otherwise-fine page to delete one hash costs more than it buys. The exposure is narrower than the inputs claimed: one hash, one page, no state paths (4.3). | The new page ships clean and the old one keeps an undocumented exception. |

---

## 9. Conflicts between the four inputs, and how I resolved them

Each entry: what disagreed, what the consolidated spec says, why. Nothing here is silently chosen; where I could not close it, it is in section 10.

**9.1 Drift detection: the gate spec builds it, R-5 drops it.** t_520c2740 specifies a digest-bound re-approval trigger with a registered detector, an in-band approved-digest stamp and a 72h auto-withdrawal order. R-5 drops exactly that machinery for this page. **Resolution:** R-5 is the decision for this surface; the gate spec's §4 is scoped to surfaces that publish live claims (its own variant table already contemplates both). Carried forward: its unpublish procedure in full, and its no-surgery rule. A future builder must not find "we need a drift alarm" and "no drift alarm" in the same document and pick at random; §6.1 is the resolution table.

**9.2 Gate step 0 versus publishing a curated page.** The gate spec's step 0 says nothing derived from the registry can publish until you flip the source marker or approve a dedicated public source. This page is authored prose that *checks against* the registry at staging, not a projection of it. **Resolution:** the prerequisite is your activation ruling, and the registry stays `public: no`. Flipping it would re-open the export problem to publish a page that needs nothing from it. **Flagged as a tradeoff:** a stricter gate owner could argue that publishing facts measured from a `public: no` document is a derivative publication. If you want the stricter reading, the fix is a curated `public: yes` source page, which is a bigger project and re-introduces the second-copy problem. I recommend against it.

**9.3 "Unmonitored public surface is a spec violation" versus no detector.** **Resolution:** the invariant is satisfied by publication of a *dated* claim plus the S-1 lint, not by a monitor. Write the substitution into the card explicitly (6.1, step 8), because otherwise the gate spec reads as unmet.

**9.4 The evidence trio versus the case-study gate.** The gate spec requires a committed `gate-state.json` binding `artifact_digest` and `source_window_digest`. A frozen-prose case study has no source window and its commit hash already content-addresses the artifact. **Resolution:** two layers plus the log delta (6.2). **Tradeoff, open:** without the state file there is no per-surface record you can query outside git history. If you want one later, it is a 10-line file, not a workflow change.

**9.5 "Strip Growth read" versus the gate script requiring it.** The memo's pre-mortem says strip; `publish-case-studies.mjs` refuses a copy missing that heading. **Resolution:** rewrite, not delete (3.1). Same for `Sources`, which cannot be emptied. Verified in source, not inferred from the content card.

**9.6 "No schema change required" versus S-1's `asOf` field.** The content model says the date lives in prose so no schema change is needed; the projection spec adds an optional `asOf` field. **Resolution:** both are true in different conditions. Carrying the page needs no schema change. *Enforcing* the date needs a machine-readable field, and a heuristic over prose is exactly how a lint becomes a pipeline. If D-5 is yes, add the one optional line; if no, add nothing.

**9.7 Two different `D-1..D-10` numbering schemes.** The memo's D-1..D-4 are your decisions; the projection spec's D-1..D-10 are deny-list entries; the dev-lead's note refers to "D-1 scoping conflict" meaning the job-id rule. Three meanings, one prefix. **Resolution:** your decisions are D-1..D-6; exclusions are X-1..X-12; the job-id question is D-6.

**9.8 The path rule: "no paths" versus "no credential or state paths".** R-3's wording is narrower than the deny-list's first draft, and your live pages cite working paths. **Resolution:** split as X-3a / X-3b (the dev-lead's proposed D-3a/D-3b), because a rule that fails your own shipped pages is a rule that gets waived at the first review. **Tradeoff, open:** X-3b publishes your directory layout. That is already live precedent in three pages, so this narrows no existing risk; it does mean the page must not drift toward citing `~/.openclaw/workspace/...` state directories, which is precisely what the draft does at line 85.

**9.9 The draft's "nearly clean" measurement.** See 4.4. **Resolution:** corrected count, and the whole `Sources` block is replaced rather than audited line by line.

**9.10 The Systems-index pointer is cheaper than the memo assumed.** The memo proposed "one row in the Systems index"; the index's rows come from `content.ts` and its case links from a name-keyed map. **Resolution:** attach to the existing row (D-4), one mapping line.

**9.11 Agent persona names: the memo allows them, the content model's sample drops them.** R-3 allows "role names"; the draft publishes both role and persona ("Alfred on finance", "Spock on product"); the content model's illustrative entries carry roles only ("Finance, content, design..."). Neither input says the personas are forbidden, and the inconsistency would be resolved arbitrarily by whoever stages the copy. **Resolution in this spec:** personas are allowed. They are Mike's own system names, they are not third-party data, not job ids, and not a per-profile count; the org chart with names is the most retellable fact on the page, and X-5 bans the topology, not the names. **Tradeoff, open:** if you read the eight names as "per-profile topology by another route", the page loses its best paragraph and its `diag` gets thin. One line of yours settles it; absent a ruling, keep the names.

---

## 10. Unresolved tradeoffs, stated rather than hidden

1. **No detector means decay is unbounded until someone reads the page.** The date makes staleness visible; it does not make anyone act. That is the price of R-5, and it is the right price for a page whose facts are quarter-scale, but it should be accepted knowingly, not discovered in 2027.
2. **D-6 leaves an inconsistency live either way.** Grandfather the three receipt ids and the rule has an exception; hold the rule absolute and an otherwise-fine page needs a re-publish. I recommend the exception, written down.
3. **X-3b publishes working paths.** Already true of three live pages; it is now a documented allowance instead of an accident.
4. **The count is wrong the moment it is written.** 32 at 23:36 tonight, 31 in the registry, 33 in the draft. The date is the only honest defence, and it will be wrong within a week of any measurement.
5. **The registry stays stale by construction.** That is a fact about the source's freshness contract, not a defect this page fixes; no page should be built that depends on it being current.
6. **A strict reading of gate step 0 could require a public source page** (9.2). I recommend against it; the stricter reading is defensible.
7. **The persona names are allowed by this spec and could be read as topology** (9.11). Keeping them publishes eight role-to-name mappings; dropping them costs the page its best paragraph. I chose keep; it is one line to reverse.
8. **`short` is load-bearing for the index link.** A display name that does not byte-match a `content.ts` row loses the pointer silently. That is a footgun in the existing site, not something this page introduces, and the checklist (11.7) is where it gets caught.

---

## 11. Go/no-go checklist

Use this if you later ask for the page. Every box is checkable, not a judgement call. **Any "no" stops the build, not the option.**

- [ ] **1. Activation.** You have said, on a card, that the page may be built and published. This card authorizes nothing.
- [ ] **2. Decisions closed.** D-1 through D-6 answered, or each defaulted with you knowing the default.
- [ ] **3. Draft curated.** `publish/agent-stack.md` exists, contains all six required headings with non-empty `Sources`, slug equals filename, no em dash in any frontmatter string.
- [ ] **4. Leaks gone, body included.** Grep the staged copy for `100.82.70.37`, `GHN`, `port 3333`, `Tailscale`, `~/.hermes/`, `~/.openclaw/`, `pipeline_health`, `feed-fidelity`, any job id, any cron expression, any third-party name. Zero hits, in prose as well as `Sources`. Confirmed by grep over the staged copy, not by memory and not by an earlier measurement (4.4).
- [ ] **5. Count measured.** The number in `navMark`, the ledger receipt and the prose sentence come from a store count taken in the same session, and all three carry the same date.
- [ ] **6. Failure story is a class.** No instance of the open mail-triage blind spot, no named candidate, no mailbox identity.
- [ ] **7. Site edits enumerated.** `CASE_ORDER` entry present (build fails without it), `CASE_PROJECTS` entry if D-4 is yes, `short` byte-matching the chosen `content.ts` row name if the pointer is on, and the "Three product design case studies" description string reconciled with the real count.
- [ ] **8. `asOf` per D-5.** If yes: field present, within two quarters, lint active, override flag not used; if no: the ledger records that the page ships undated-guarded.
- [ ] **9. Screens run before review.** The 13-item checklist and the X-list executed against the staged copy, results pasted into the review packet.
- [ ] **10. Your sentence test done.** You have read the rendered page and applied R-3's test sentence by sentence. This one is not delegable.
- [ ] **11. No new surface.** `site/public/agents/kb/**` and `site/public/llms.txt` unchanged; no route, no nav item, no digest file.
- [ ] **12. Build green.** Site build and the 206-test suite pass; the case-study gate script and `verify-case-render` both pass; committed, not pushed.
- [ ] **13. Withdrawal rehearsed.** The 410 path and the companion-index check are named in the card before the page ships, so the day it must come down is not the day it is designed.

---

## 12. Evidence: what I verified myself, what I inherited, what I assume

**Verified tonight by reading source or counting stores (my own runs):**

- The four job stores at 23:36 PT: default 26 records / 24 enabled; ops 4/4; dev-lead 2/2; roy 2/2. **Total 34 records, 32 enabled.** The registry page says 31.
- `site/scripts/publish-case-studies.mjs`: the `REQUIRED` heading list (six, including `Growth read`), the non-empty `Sources` refusal, the slug/filename check, frozen copy, `refused:` idiom, exit 1.
- `site/src/content.config.ts`: the case-study schema field by field, the em-dash refinement, `ledger` bounds 2..4.
- `site/src/lib/case-studies.ts`: `CASE_ORDER` and the build-time throw for a case file with no slot.
- `site/src/pages/work.astro`: the Systems index copies `content.ts` rows; `CASE_PROJECTS` maps `cases[0]` only, keyed by the case's `short`; the description string says "Three product design case studies" and the hint says "Nine systems".
- `site/src/lib/content.ts`: an "Agent Executive Suite" row exists ("multi-agent org structure: a chief-of-staff agent plus ops, sales and product agents..."), which is the natural Systems-index anchor for this page.
- `content-drafts/case-studies/agent-stack.md`: 99 lines; lines 29 and 67 carry the stale "33 jobs, 26 enabled"; line 67 cites `~/.hermes/cron/jobs.json`; line 85 cites a `~/.openclaw/workspace/...` cron-health log; line 86 the live Ollama endpoint; line 41 the body sentence "port 3333 over Tailscale"; lines 35 and 39 quote `pipeline_health: ok` and `feed-fidelity: OK`; line 39 names the eight agent personas; line 90 "Needs from Mike"; line 94 `GHN`.
- `content-drafts/case-studies/add-friendly-agent.md` (staging draft): lines 89, 90, 92 publish three job ids inside `~/.hermes/cron/output/<id>/` receipts, and further down it cites `~/.hermes/cron/jobs.json` and two `~/.hermes/skills/` paths. The **published** copy in `site/src/content/case-studies/` carries one of those ids and none of the state paths, and the live URL serves exactly that (curl, 2026-10-31). The draft is the leaky artifact; the site is not.
- `KB/ai/how-mike-works.md`: 53 lines, `public: yes`.

**Inherited from the input cards (not re-run by me):**

- The deny-list corpus counts for the registry (32 job ids, 12 card ids, 71 state-path tokens, 7 cron expressions, 93 run-status hits, 5 third-party names in 35 rows) and for the two other live case studies (0 hits each). I spot-checked the conclusions, not the counters.
- The 2026-10-30 incident mechanics, the 410 verification, and the 206-test suite result (t_c1a52c37).

**Assumptions, marked:**

- That `agent-stack.md` is the artifact you want repurposed (D-1).
- That the page's only date-bearing claim is the aggregate count. If it later carries more, one `asOf` is not enough and the lint needs a per-claim shape.
- S-1's line counts are estimates from reading the two scripts; nothing in it has been implemented or executed.

---

## 13. What this card did not do

No generator, no lint, no `asOf` field, no page, no staging, no publish, no commit to site source, no vault edit, no KB edit, no schema change, no route, no cron, no detector. This is a document, and the only thing it changes is what the next worker reads.

If you want the page, the smallest true next step is: answer D-1 to D-6, then hand a card to content for the curation pass with sections 3 and 4 attached, and to release for the site edits in 6.4. If you don't, the option stays captured here and nothing decays except the numbers, which are dated.

---

## 14. Root-card verification (t_a857b360), run independently after consolidation

This section was written by the root option card, not by the card that drafted sections 0-13. It exists because a consolidated spec inherits its siblings' errors, and two of the numbers below decide what Mike is being asked to rule on. Everything here was re-run from scratch on 2026-10-31, not read off an input document.

### 14.1 Re-verified, now with my own commands

| Claim | How I checked it | Result |
|---|---|---|
| The registry's count is stale | `jq` over the four job stores, 2026-10-31 | default 26 records / 24 enabled, ops 4/4, dev-lead 2/2, roy 2/2 = **34 records, 32 enabled**. Unchanged two hours after the 23:36 count in 5.2, so the gap is structural, not a snapshot artifact. Registry says 31. |
| Six required headings, non-empty `Sources`, frozen copy | read `site/scripts/publish-case-studies.mjs` | `REQUIRED = [The problem, What was actually blocking use, What I designed, What I'd change, Growth read, Sources]`. Confirmed: `Growth read` cannot be stripped, `Sources` cannot be emptied. |
| `CASE_ORDER` is build-enforced | read `site/src/lib/case-studies.ts` | Confirmed at lines 25-27: a published case file with no slot throws `published case file has no slot in CASE_ORDER`. |
| Systems index keys on `short` and maps one case | read `site/src/pages/work.astro` | `CASE_PROJECTS` maps `cases[0]` only, keyed by `short`; description string says "Three product design case studies"; hint says "Nine systems". |
| An "Agent Executive Suite" row exists to anchor to | read `site/src/lib/content.ts` | Confirmed, line 140, group "AI Systems & Agents". D-4 is a mapping line, not a new row. |
| Every leak 4.4 lists is in the draft | `grep -nE` over `content-drafts/case-studies/agent-stack.md` | All confirmed at the stated lines: 29 (33/26), 35 (`pipeline_health`), 39 (personas + `feed-fidelity`), 41 (port 3333, Tailscale), 67-71 (state paths), 79 (port 3333 again), 85 (`.openclaw` log), 86 (endpoint), 90/94 (Needs from Mike, GHN). Two more body hits than the input measurement claimed. |
| The withdrawal guard is live | `curl` the four withdrawn export paths | All four answer **410**, not 200 and not 404. The middleware's `REMOVED_EXPORTS` set covers exactly those names. |

### 14.2 One correction, carried into 4.2, 4.3, D-6 and 12

The inputs said the **live** `/work/add-friendly-agent` page publishes **three** job ids. It publishes **one**. Three is the count in the staging draft `content-drafts/case-studies/add-friendly-agent.md`; the published copy in `site/src/content/case-studies/` carries one of them (`577137c655f2`), and the served bytes at `https://mikejones.online/work/add-friendly-agent/` carry exactly that one, inside one `~/.hermes/cron/output/577137c655f2/` receipt. No state paths are served. `/work/distills` and `/work/neighborhoodshare` carry zero hex ids and zero paths (curl, 2026-10-31).

Why it matters: D-6 is the only decision on this list that touches a page already in public. Narrowed to one hash on one page, the "grandfather it and write the exception down" recommendation is clearly cheaper than a re-publish, and the reason the sibling cards over-weighted it was a measurement taken on the draft and labelled live. The general lesson is the one 4.4 already states: measure the artifact that ships, not the one in the drafts folder.

### 14.3 Residual risk, ranked as it stands tonight

1. **Nothing decay-checks the page once it ships** (R-5, tradeoff 1). The date is the whole defence. Accepted knowingly or not at all.
2. **The count will be wrong within a week of any measurement.** 32 tonight, 31 in the registry, 33 in the draft. Only a same-session count at staging is publishable.
3. **A rewrite can re-introduce a leak the screens do not name.** The per-sentence test (6.3) is the only control for that, and it is Mike's, not a machine's.
4. **One frozen receipt path stays live on an older page** (D-6). One hash, one page, documented either way.
5. **The persona names publish eight role-to-name mappings** (9.11, tradeoff 7). Reversible in one line if Mike reads them as topology.

### 14.4 What this root card did not do

No build, no staging, no publish, no site source change, no schema change, no route, no cron, no vault write, no KB edit — the only files touched are this document and its own corrections. The registry stays `public: no`; the four withdrawn export paths stay 410. Answering D-1 through D-6 is what turns this from a captured option into work.
