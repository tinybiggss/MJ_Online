# Public automations page: audience and scope decision

**For:** Mike
**From:** Spock (product)
**Date:** 2026-10-30
**Status:** recommendation. Nothing here is built, gated, or published. One ruling from you moves the four dependent cards.
**Task:** kanban t_cf4e6b4a, spawned from the feature-option card t_a857b360, which followed your ruling on t_c1a52c37.

---

## The answer in one paragraph

One page, for humans, published as a **case study on `/work`** through the gate that already exists. Not a cut for agents under `/agents/`, not a second cut beside it. It publishes **categories, roles, dated aggregate counts, and failure classes**, and never job ids, credential or state paths, a complete schedule set, run-status bookkeeping, or third-party personal data. It **links from** `KB/ai/how-mike-works.md` and does not replace or extend it. It is **authored prose from the held draft that already exists**, not a generated projection, and it needs no drift detector because it carries a frozen measurement window instead of a live claim.

The cheapest true version of this page is already written. `content-drafts/case-studies/agent-stack.md` (99 lines) is 80 percent of it, in your voice, and its own header says it belongs on `/work`. The work is curation and a gate, not a pipeline.

---

## Rulings

### R-1: Audience is humans, one cut, and the artifact class follows from that

The `/agents/` zone is a **claims register**: 1:1 projection of `public: yes` KB pages, digest-checked, cited by path, indexed in `index.json` and `llms.txt`. A fleet inventory is not a claim; it is a story about a system in motion. Putting it in the register means every paused job is a false claim that a daily alarm will chase, which is exactly the failure mode you just cleared.

An agent that needs to evaluate Mike needs capability, results, and how to engage. Those are already in the export. It does not need your firing schedule, and giving it one buys almost nothing while re-opening the zone that failed 18 hours ago under a different label.

**Rules out:** any `/agents/` cut, now or as a "second, curated one."

### R-2: Relation to `how-mike-works.md` is link, not replace, not augment

`how-mike-works` is a 53-line, `public: yes` collaboration-style page and the template for the per-client equivalent. Its subject is *how to work with Mike*. An inventory's subject is *what runs unattended*. Merging the second into the first fails three ways: it drops the inventory into the machine export by the back door, it converts a page with three history entries in five weeks (two of them marker flips) into a page edited weekly, and it hands an agent reading "how to collaborate" a scheduler table it cannot use.

**Action:** one sentence plus a pointer appended to `how-mike-works`, gated like any KB edit. That sentence is the only change to that page.

### R-3: Disclosure level: counts and coarse cadence yes, operator parameters no

Your own published prose already sets this line. `add-friendly-agent` publishes "29 consecutive runs, one user" and "31 protocols"; the held draft publishes "eight profiles", "33 cron jobs, 26 of them enabled", and names every agent and its lane. So counts with a date and role names are in your genre, not a new risk.

What stays out is not "numbers", it is **operational parameters and personal data**:

- No job ids. They are the enumeration handle for every card, log line and cron record.
- No credential or state paths (`secrets/linkedin.txt`, `~/.config/linkedin-mcp/tokens.json`, `~/.hermes/price-watches/*`). A local memory path is fine; a key path is not.
- No complete schedule set and no schedule column. Individual clock times are allowed when they are part of the story ("a 9pm shutdown", "a 03:00 pass"), as in your existing case studies. A table of every firing time is a map of when nobody is watching, and it is the operator detail readers skip anyway.
- No per-row counts and no run-status bookkeeping. One dated aggregate total ("31 enabled jobs across four agent profiles, as of October 2026"), refreshed at publish time, never maintained as a live number.
- No third-party personal data. No gift-watch row, no mailbox identity, no named mail-triage candidate.

**Test to apply to every sentence:** does it tell a reader when a bot is *not* looking, or what it would fail to catch? If yes, cut it.

### R-4: The mail-triage blind spot publishes as a class, not as an instance

The sentence you withheld (17:00 run, unreadable Kaiser candidate, 17:30 silent, message lost for good) is currently an *open* blind spot, and it involves someone's mail. Do not publish the instance while it is open.

Publish the class instead: "a job that cannot read a message body has to say so, and one that goes quiet because it already advanced its gate is the failure I designed the fidelity checks against." Same lesson, no third party, no live hole advertised. Once the fix lands, the specific story becomes publishable.

### R-5: No generator in v1, and the case study is the right container

The container already exists: `site/src/content/case-studies/` with a build-enforced schema (`title`, `slug`, `kind`, `short`, `tag`, `status`, `rowTitle`, `diag`, `navMark`, `position`, `ledger`, optional `plate`/`appendix`), frozen prose copied by `scripts/publish-case-studies.mjs` from `content-drafts/case-studies/publish/`, and a hard rule that no em dash may appear in any frontmatter string. That *is* the "agents stage, Mike approves" gate from `publication-layer.md`, already built and already used three times.

The schema is also the discipline the registry lacked: a case study must name a diagnosis and a ledger of receipts, and the site says so in the section hint ("the diagnosis, the decisions, and the honest residue"). If the fleet cannot produce a diagnosis, it is not a page; it is a brag list.

**Rules out:** a new `/automations` route with a new template and a new gate; a `kb-to-*` generator; a digest-plus-alarm drift check for this page. The measurement window ("as of October 2026") replaces all three. If a mechanism is ever wanted, the smallest sufficient one is a build-time warning when the case study's `asOf` is more than two quarters old. That is a lint, not a pipeline.

---

## Rejected alternatives

| Option | Why not |
|---|---|
| Publish the registry itself in the export, refreshed | Already ruled out on t_c1a52c37, and the constraint has not changed: one table line means no sentence-level redaction, plus ids, key paths and a triage-loss instance |
| Registry in the export with a sentence redactor | The redactor was rejected as not worth the code in the same ruling; that verdict stands |
| Two cuts, `/agents/` plus a human page | Doubles the gate, the review surface and the decay path for a second cut with low reader value; the agent cut is the one that caused the incident |
| Augment `how-mike-works` with an inventory section | Back-doors the inventory into the export and turns a stable style page into a weekly-maintained one (see R-2) |
| Generate the page from the registry with a drift alarm | Re-creates the coupling that produced the 410 incident, and adds a gate, a digest, an edge-cache story and a nightly writer for a page whose facts are stable at category level |
| Standalone `/automations` page | New template, new nav item, no existing gate, no precedent, and it competes with a `/work` case study for the same job |
| Systems-index row only | A row cannot hold "all the automations"; keep it as the pointer, not the page (see below) |

---

## What this does to the four downstream cards

- **t_15229258 (dev-lead, projection spec):** premise overturned. No generator. If it proceeds at all, the scope is a build-time `asOf` staleness warning on the case-study collection, nothing more.
- **t_968ed76e (content, content model):** redirected. It is curating `agent-stack.md` into case-study schema, not inventing a public row format for the registry. It must satisfy `diag`, `rowTitle`, `status`, `ledger`, `position`, `navMark`, and the no-em-dash rule.
- **t_520c2740 (content, gate workflow):** mostly satisfied already by `publish-case-studies.mjs` and the frozen-prose convention. The genuine gap it should specify is the `asOf` date and who refreshes it at publish, not a re-approval trigger on registry drift.
- **t_5153b4b5 (product, consolidate):** should carry these five rulings as decisions, not open questions, and keep the card marked as a captured option, not a build order.

---

## Pre-mortem: how this fails

1. **It reads as a brag list.** Thirty one-line entries nobody would repeat to a colleague. *Smallest test:* write four paragraphs and read them aloud. If a paragraph has no fact a reader would retell, the page is not worth shipping; fold it to a résumé line.
2. **It decays into a false claim.** The page says 31 jobs; by spring it is 45. *Bounded* by the frozen window and the dated count, and by never stating a run status.
3. **A later card quietly re-generates it from the registry**, and the operator table returns with a friendlier face. *Bounded* by writing R-5 into the feature-option spec as a standing constraint, so the next worker inherits a ruling rather than an opinion.
4. **The draft's job-application framing leaks through.** `agent-stack.md` was written for an Anthropic application and carries a "Growth read" section plus an internal "Needs from Mike" block. Publishing it as-is exposes internal notes and reads like an application. *Fix:* strip both sections before staging; they are not site copy.
5. **The counts are already stale in the draft.** It says "33 cron jobs, 26 enabled"; the registry says 31 enabled across four profiles as of 2026-10-30. *Fix:* refresh at publish time from the registry, and date it.

---

## Evidence, and what I am assuming

**Read, not inferred:**
- `KB/pipelines/generator-registry.md` (144 lines, `public: no` since today, 31 enabled jobs across four profile stores).
- `KB/ai/how-mike-works.md` (53 lines, `public: yes`, no automation inventory, already exported as `/agents/kb/kb-ai-how-mike-works.md`).
- `KB/pipelines/publication-layer.md` (gated-publish rule, adapter state, KB→surface directionality).
- `site/public/llms.txt`, `site/public/_headers`, `site/public/agents/kb/` contents: the export is a flat 1:1 page projection plus index, search index, digest, and query endpoint.
- `site/src/content.config.ts`, `site/src/pages/work.astro`, `site/src/content/case-studies/*`, `content-drafts/case-studies/agent-stack.md`.
- t_c1a52c37 completion record: registry dropped at the source, export regenerated, four URLs now 410, 206 tests passing.

**Assumption, marked as such:**
- The list of "what made the registry unpublishable" in the feature-option card (ids, topology, schedule minutiae, the triage sentence) is the default profile's analysis of your ruling, not your words. Your words on that card were only that the page should be set to "no" for now and that an automations page is an interesting future option. If any item on that list is weaker than stated, R-3 gets looser, not tighter.
- I have not verified that `agent-stack.md` is the artifact you want repurposed. That is decision D-1 below.

---

## Decisions still yours

**D-1. Repurpose `agent-stack.md` or write fresh?**
*My recommendation:* repurpose. Strip "Growth read" and "Needs from Mike", refresh the counts, tighten to case-study length. It is already your voice and already says "this stays a system entry on `/work`".
*Default if you say nothing:* nothing ships; the card stays a captured option.

**D-2. Does anything about your personal or family life appear?**
*My recommendation:* no. Business and system automation only. Personal jobs appear as unnamed categories at most ("logistics and reminders"), never as rows.

**D-3. Do the honest failures go in?**
*My recommendation:* yes, as classes. The lessons are what a client is buying and what makes the page credible; the draft already carries several ("looks like garbage", the untrimmed ledger, the spec that never shipped). Hold only the currently-open mail-triage instance until the fix lands.

**D-4. Route and row: case study, plus a Systems-index pointer?**
*My recommendation:* `/work/<slug>` as a case study, and one row in the Systems index pointing at it. The case study carries the story; the index row is the discoverable pointer for a reader who never opens `/work/<slug>`.
