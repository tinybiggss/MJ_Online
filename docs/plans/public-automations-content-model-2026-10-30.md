# Public automations page: content model

**For:** Mike
**From:** Perkins (content)
**Date:** 2026-10-30
**Status:** spec only. Nothing published, nothing staged in `content-drafts/case-studies/publish/`, no production file touched. This card authorizes no build.
**Task:** kanban t_968ed76e. Parent decision memo: `docs/plans/public-automations-decision-2026-10-30.md` (rulings R-1 through R-5 carried here as decisions, not open questions).
**Downstream:** this document is an input to t_5153b4b5 (consolidated feature-option spec) and the root option card t_a857b360.

---

## 1. The answer in one paragraph

The public page is **one case study on `/work`** whose content model is the existing build-enforced case-study schema, filled by curating the held draft `content-drafts/case-studies/agent-stack.md`. There is no new row format, no table, no generator, and no `/agents/` copy. What one public entry says: what the automation does for Mike and his readers, which named role runs it, coarse cadence in prose, and a dated receipt where one exists — never how the scheduler is wired. The private registry stays the source of truth; the page is authored prose checked against the registry at staging time and dated with an asOf window. `KB/ai/how-mike-works.md` is complemented by one gated link sentence, not replaced.

---

## 2. The container and its schema

The page is a case study in the existing collection: `site/src/content/case-studies/`, schema in `site/src/content.config.ts`, frozen-prose copy from `content-drafts/case-studies/publish/` via `site/scripts/publish-case-studies.mjs`, build-validated.

Schema fields and what each must say for this page:

| Field | Schema | Content-model requirement |
|---|---|---|
| `title` | string | The public page title. Concrete, not a question; in the author's voice. |
| `slug` | `^[a-z0-9][a-z0-9-]*$` | `agent-stack`, and must equal the filename. |
| `kind` | literal `case-study` | Fixed. |
| `short` | string | Index display name ("The Agent Stack"). |
| `tag` | string | Category label, e.g. "personal automation". |
| `status` | string | A page-level state label without run bookkeeping: "live daily, one user", not "26 enabled". |
| `rowTitle` | string | The `/work` index row. Same disclosure rules as body prose. |
| `diag` | string | One-sentence diagnosis the whole page must be able to support. If there is no diagnosis, it is a brag list, not a page (memo R-5). |
| `navMark` | string | The headline stat for nav and index. This is where the one dated aggregate count lives. |
| `position` | string, min 1 | The one-line thesis the reader should be able to repeat. |
| `ledger` | array 2..4 strings | Receipts: only facts a reader could trust, each carrying whatever date the fact needs. Count-bearing receipts carry the asOf. |
| `plate`, `appendix` | optional | Plate reserved for a Mike-supplied asset. Appendix reserved for a failure-class list if Mike wants the detail without bloating the body. Not required by this spec. |

Two gate rules the schema enforces that this content model inherits:

- **No em dash anywhere in a frontmatter string.** Build fails otherwise. Sample blocks below comply.
- **The publish script requires six section headings** — `The problem`, `What was actually blocking use`, `What I designed`, `What I'd change`, `Growth read`, `Sources` — and refuses a copy when a heading is missing or `Sources` has no list items.

**One correction to the parent memo (pre-mortem item 4):** the memo says "strip Growth read". The gate *requires* the heading, so the strip is a **rewrite**, not a deletion: the Anthropic-application framing goes, and the section is rewritten for a general reader (the demand-signature observation is reusable; the qualification and growth-team pitch is not). Same for `Sources`: it cannot be empty, so the twenty lines of local paths become **scrubbed receipts** (see §5), not a removed section.

---

## 3. What one public entry says (the inventory unit)

The inventory is prose paragraphs in "What I designed" (and its echoes in the other five sections), one unit per automation category. Each unit carries exactly these parts:

1. **The category** — what the automation is (bold lead, published-case-study convention).
2. **The reader-facing effect** — what it does for Mike and for his readers; the reader should be able to picture using it.
3. **The named role(s) that run it** — role and agent names only (R-3 allows; the draft already publishes all eight).
4. **Coarse cadence in prose** — "every morning", "nightly". A single in-story clock time is allowed when it is part of the story ("a 9pm shutdown"); a schedule set is not.
5. **A dated receipt where one exists** — the same date discipline as the ledger.

And explicitly not (the negative form of the same field list): no wiring, no job id, no path, no per-row count, no run-status, no schedule set, no third-party data.

**The per-sentence test (R-3), applied at every edit:** *does the sentence tell a reader when a bot is not looking, or what it would fail to catch?* If yes, cut it. This test outranks any wording preference in this document.

---

## 4. Exclusion rules (mandatory)

A public entry is rejected on any of these, regardless of how the prose reads:

1. **No job ids.** No hashes, no store names, no enumeration handles for cards, logs, or cron records.
2. **No credential or state locations.** Banned class includes `secrets/linkedin.txt`, `~/.config/linkedin-mcp/tokens.json`, `~/.hermes/price-watches/*`, `~/.hermes/state.db`, `~/.hermes/kanban.db`, `~/.hermes/cron/jobs.json`, cron output directories. A local memory path is fine; a key path is not.
3. **No scheduler topology.** The count of profiles is allowed ("across four profiles"); per-store and per-profile job counts are not.
4. **No complete schedule set and no schedule column.** One in-story clock time permitted; a firing-time table is a map of when nobody is watching.
5. **No run-status bookkeeping.** Describe designed checks in the abstract ("the delivery check must pass or the brief does not send"); never quote a run's result, a pass/fail string, a last-run time, or an enabled/paused state.
6. **No per-row counts.** Exactly one dated aggregate count exists on the page, in `navMark` and echoed at most twice in prose ("31 enabled jobs across four profiles, as of October 2026"). Refreshed at staging; never maintained live.
7. **No third-party personal data.** No mailbox identity, no named mail-triage candidate, no named client in an automation context, and no "gift watch for Anna"-style rows — anything identifying a human other than Mike.
8. **No personal-life instance rows.** Business and system automation only. Personal jobs appear at most as an unnamed category ("logistics and reminders"), never as rows (memo D-2 recommendation, unruled by Mike).
9. **No instances of currently-open blind spots.** Failure stories publish as classes; the specific story waits until the fix lands (R-4).
10. **No line-redaction of the existing registry table — ever.** There is no mechanical transform from the registry to this page, no redactor, no lifted table line. The public version is authored prose, a projection whose facts are *checked* against the private registry at staging (R-5). This rule is standing: if a later card proposes regenerating this page from the registry, the premise is dead on arrival.
11. **No operator Sources.** The `Sources` section on this page carries public-safe receipts only; no local file paths, no job-output directories, no database paths.
12. **No `/agents/` copy.** The page never enters the claims register: not in the export, `llms.txt`, `index.json`, or the query endpoint (R-1).

**Precedent conflict, flagged for the gate owner (not this card's ruling):** the *published* case studies predate R-3 and carry Sources lines with local paths, including one cron-output path with a run-id-like hash in `add-friendly-agent`. This spec forbids that class only for new automation-inventory content. Whether to tighten the existing pages at their next gated edit is a separate call.

---

## 5. Sample scrubbed entries

Illustrative prose in the voice of the published case studies; each annotated with the exclusion rules it must still pass. Values marked [r] are **refresh-at-staging** from the private registry.

**Frontmatter (illustrative, build-clean):**

```yaml
---
title: "The Agent Stack: automation I designed, shipped, and live in"
slug: agent-stack
kind: case-study
short: The Agent Stack
tag: "personal automation"
status: "live daily, one user"
rowTitle: "The agent stack: eight named roles, one operator"
diag: "My tools had no memory of each other, and I was the transport layer."
navMark: "31 enabled jobs, October 2026"
position: "Each piece was fine on its own. The problem lived between them, and so did the fix."
ledger:
  - "one shared memory ledger, every write validated or rejected"
  - "eight named agent profiles, one role each"
  - "31 enabled jobs across four profiles, as of October 2026" [r]
  - "a morning brief read every morning since June 2026"
---
```

**Entry 1, the daily artifact** (passes 1, 2, 3, 4, 5, 7, 12):

> **The morning brief.** The one thing I read before work. It takes the week's plan, promotes up to five things into the day, and reports what broke overnight before anything else. The delivery check behind it has to prove it delivered what it claims, or the brief does not send.

**Entry 2, shared memory** (passes 1, 2, 3, 5, 6, 12; the ledger path may appear per R-3, the ledger stats must be dated at staging):

> **One shared memory.** Every agent writes session evidence into the same ledger through a single writer that validates or rejects the write, and a write that does not validate does not land. There is a nightly pass that looks for patterns in all of it, and it is allowed to find nothing.

**Entry 3, the org chart** (passes 1, 2, 3, 4, 5, 7, 8, 12):

> **Eight named roles.** Finance, content, design, dev lead, marketing, operations, product, release. Money moves only behind an approval the seat can grant, and the product seat is the authority I only escalate to when a question is genuinely unanswerable by me.

**Entry 4, the publish gate** (passes 1, 2, 3, 4, 5, 6, 7, 12):

> **A publish gate instead of a reflex.** Content moves from draft to published through a check that stages the copy and holds the ship until the artifacts match the source, and nothing goes live without a human pass. That gate exists because I have been my own transport layer, carrying decisions at whatever hour I happened to be awake.

**Entry 5, a failure class, not an instance** (passes 5, 7, 9; the R-4 pattern in one paragraph):

> **The failure class I design against.** A job that cannot read what it was sent has to say so out loud, and a job that goes quiet because it already advanced its gate is the failure the fidelity checks exist to catch. I have lost real messages to exactly this shape, and the class is what publishes while the hole is open. The specific story waits for the fix.

**Scrubbed Sources replacement shape** (satisfies the script's non-empty-Sources rule without operator paths):

> ## Sources
> - The published case studies on this site: the memory system, the local model setup, the ADD-Friendly agent protocol
> - The private automation registry, measured 2026-10-30 [r]
> - The knowledge-base page this case study links from, `KB/ai/how-mike-works.md`

**Full curation map for `agent-stack.md`** (the staging-time work, pending Mike's D-1 call):

| Section of the draft | Action |
|---|---|
| Anthropic header, held-draft blockquote, author line | Drop |
| The problem | Carry |
| What was actually blocking use | Carry; refresh dated counts; drop network addressing (ports, VPN hostnames, SSE intervals) with the scheduler details |
| What I designed | Carry as the inventory units (§3 shape); drop infrastructure and scheduler wiring |
| What I'd change | Carry; failures publish as classes |
| Growth read | **Rewrite for a general reader** — keep the demand-signature insight, drop the qualification and growth-team framing (gate requires the heading) |
| Sources | Replace whole 20-line path list with the scrubbed shape above (gate requires non-empty) |
| Needs from Mike | Drop — internal notes, not site copy |
| All counts | Refresh at staging from the registry (draft's "33 cron jobs, 26 enabled" is stale; parent card measured 31 enabled across four profile stores on 2026-10-30) |

---

## 6. Unsafe-row rejection checklist

Run at staging time, per entry, before the copy lands in `publish/`. Any **yes** means rewrite to class form or drop the entry.

1. Does the entry name a job id, store name, or per-store/per-profile count?
2. Does it name a credential, token, or state-file path? (Local memory path is the only path class allowed.)
3. Does it describe scheduler wiring rather than the automation's effect?
4. Does it give a complete schedule set or a schedule column? (One in-story clock time is still allowed.)
5. Does it quote a run result, last-run time, or enabled/paused state instead of describing a designed check?
6. Could a sentence tell a reader when a bot is not looking, or what it would fail to catch?
7. Is any person other than Mike named or identifiable (mailbox identity, gift row, named candidate, named client)?
8. Is a personal-life automation published as a row rather than at most an unnamed category?
9. Is a currently-open blind spot published as an instance instead of a class?
10. Was any line lifted from the registry table (redaction by another name)?
11. Does the page exist anywhere under `/agents/` (export, index, llms.txt, query endpoint)? It must not.
12. Does the page carry exactly one dated aggregate count, with the date, and no undated volume claims with it?
13. Build gate: no em dash in any frontmatter string; all six required headings present; `Sources` non-empty; `slug` equals the filename.

Plus the retell test from the memo's pre-mortem: if a paragraph has no fact a reader would repeat to a colleague, fold it to a resume line.

---

## 7. Relation to `KB/ai/how-mike-works.md`

**Decision (memo R-2): complement, link only. Never replace, never augment with an inventory section.**

The page, verified today: 54 lines, frontmatter `public: yes`, three history entries in five weeks (two are publication-marker flips), subject is *how to collaborate with Mike*, template for the per-client equivalent, and it exports 1:1 into the agent register at `/agents/kb/`.

The three reasons replacement fails, from the memo and unchanged: it drops an inventory into the machine export by the back door; it converts a stable style page into a weekly-edited one; and it hands an agent reading a collaboration page a scheduler table it cannot use.

**The only change to that page is one appended sentence**, added under the normal KB gate (that edit belongs to the gate-workflow card, not this one). Proposed text, staged here for approval, not applied:

> For what actually runs unattended, see the agent-stack case study on /work; this page stays about collaboration.

D-4 adds a second possible pointer (one Systems-index row). That pointer is Mike's call and is not part of the content model; the model above supports either answer.

---

## 8. The asOf window and who refreshes

The page is a frozen measurement, not a live claim. Rules:

- The public page states its window in prose exactly once near the aggregate: "as of October 2026".
- `navMark` and the count-bearing ledger receipt carry the same dated aggregate as the prose sentence.
- **Whoever stages the `publish/` copy refreshes exactly three dated values on the staging date**: `navMark`, the ledger receipt, and the prose sentence — reading the numbers from the private registry, then writing the staging date into the registry receipt in `Sources`. No live numbers, no counters, no drift alarm (R-5). The build-time staleness lint, if it is ever wanted, belongs to the projection-spec card's scope (build-time warning when `asOf` is more than two quarters old), not to this content model.
- No schema change is required: the asOf lives in prose and in dated receipt strings, so the existing build-enforced schema stays untouched.

---

## 9. What this card did not do

Nothing published, nothing staged, no KB edit, no schema change, no route, no generator. Four decisions remain Mike's, from the parent memo: D-1 repurpose `agent-stack.md` versus write fresh (recommendation: repurpose, per the curation map above); D-2 any personal or family automation content (recommendation: none); D-3 failure stories in as classes (recommendation: yes); D-4 the Systems-index pointer in addition to the case study (recommendation: yes). This spec binds only what the parent ruled (R-1 through R-5). Until Mike rules on D-1, nothing from §5 or the curation map is staged anywhere.