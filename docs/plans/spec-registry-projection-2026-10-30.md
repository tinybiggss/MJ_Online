# Spec: registry-to-public projection, with drift detection

**For:** Mike
**From:** Daedalus (dev-lead)
**Date:** 2026-10-30
**Task:** kanban t_15229258, child of the audience decision t_cf4e6b4a. Companion to `public-automations-decision-2026-10-30.md`.
**Status:** design of record for a **declined** option. No generator is authorized. One build-ready slice (S-1) is specified at build standard; it also needs your go-ahead (D-5).

---

## 0. What this document is

The card asked for a design spec for generating the public automations page as a projection from `KB/pipelines/generator-registry.md`, with digest and drift detection, deny-lists, and acceptance checks proving no forbidden field can leak. Eighteen hours before it was dispatched, the parent card declined that whole shape (R-5: no generator, no drift alarm, container is the existing case-study collection).

I am not going to hand you a build spec for something you already decided against, and I am not going to quietly bury the card either. The projection was rejected on evidence that the next worker will not have in front of them, and the memo that carries the ruling is a decision document, not a technical one. So this file has three jobs:

1. **Record the design that was declined, at reviewable resolution.** If the option is ever revisited, nobody should have to re-derive the deny-list or rediscover why the digest idea fails. This is the standing constraint the pre-mortem asked for (item 3: "a later card quietly re-generates it from the registry").
2. **Put the rejection on technical grounds, not taste.** Section 1 carries a fact I verified tonight that is stronger than anything in the memo: the registry was already wrong by one live job on the day it was declared current.
3. **Specify the one slice the ruling leaves standing.** S-1, a publish-time `asOf` staleness lint. Section 3. It is a lint, roughly twenty lines, and it is the only mechanism here I would defend spending an hour on.

Part A (sections 1 to 2) is the declined design. Part B (section 3) is S-1. Sections 4 to 9 apply to both, because failure modes, review points and leak tests are properties of the disclosure, not of the pipeline that produces it.

---

# Part A: the declined projection

## 1. Why it fails, technically

### 1.1 The registry has no field boundary to project through

The source is one markdown table per section, one row per generator, cells packed with operator prose. A single Alive row currently carries, in one line: a job id, a schedule expression, a profile name, a state-file path, a run-status history, an incident note, and a delivery channel.

That one structural fact decides the whole design. A projection needs to select fields and drop the rest. Here there is nothing to select: the unit of extraction is a row, and the unit of publication is a sentence. Any transform that publishes a row's meaning has to **rewrite** the cell, not filter it. Rewriting is authorship, and authorship is the expensive thing your ruling was trying to avoid paying for. The cheap mental model of "a generator that projects the table" does not survive contact with the table.

This is not new information: it is the same fact that killed the sentence redactor on t_c1a52c37. Line-level redaction of a one-line row deletes the row, not the sentence inside it.

### 1.2 The source is behind its own truth by construction (verified tonight)

The registry says, in its own words, "31 enabled as of 2026-10-30". I counted the four stores it cites at 23:32 tonight:

| store | enabled | records |
|---|---|---|
| default `~/.hermes/cron/jobs.json` | 24 | 26 |
| `profiles/ops` | 4 | 4 |
| `profiles/dev-lead` | 2 | 2 |
| `profiles/roy` | 2 | 2 |
| **total** | **32** | **34** |

Three default-store records are absent from the page entirely, and two of them were created **today, after the 03:00 pass that last verified it**: `RT Bluesky publish (post-title-test)` at 12:09 (disabled) and `Agentic feed (T1)` at 13:24 (**enabled**). The third, `andromeda-research-wake (one-shot)` (2026-10-28), is also unlisted and disabled.

So the page is short one live job, ten hours after it was verified, and short three records. The registry's designated owner is a nightly pass; the fleet grows mid-day. That is not a bug to fix before building, it is the source's freshness contract, and any projection inherits it. A generator built this morning would ship a knowingly incomplete inventory, and a drift alarm built beside it would fire on its first comparison. Not as a false positive. As the truth.

The consequence for this spec: **there is no version of the projection that is correct at build time without a second, faster correctness mechanism for the registry itself.** That mechanism is a bigger project than the page.

### 1.3 A digest over the projection measures the wrong quantity

Two ways to digest a projection, both already in this repo's vocabulary:

- **Hash everything a reader receives** (`kb-to-agents.mjs`'s rule: hash the projection, not the vault file). Nightly bookkeeping then churns the digest even when no published claim moved, because the registry's History grows daily, counts shift, and run-status text is corrected by hand. Loud where the page did not change.
- **Hash only the fields that reach output.** Stable by design, because categories, role names, one dated count and coarse cadence are quarter-scale facts. Quiet where the page did change meaning, because a claim can go false with no byte changing: a job is deleted, the count is now wrong, the page is byte-identical.

Neither catches the only thing you would actually want caught: *is the sentence a reader is looking at still true today?* That question is answered by re-measurement at publish, or not at all. The digest machinery buys change detection on a page whose risks are decay and semantics.

### 1.4 The claims-register collision

`/agents/` is a digest-checked register: 1:1 projection of `public: yes` KB pages, cited by path, with `feed-notice.mjs` running `kb-to-agents.mjs --digest` daily and firing `kb_drift` when a published page's projection moves. A fleet inventory in that zone turns every paused, completed or deleted job into a false claim the alarm chases, and turns every correction into a drift event. That is the failure shape that produced the 410 incident on t_c1a52c37, and it is the reason R-1 rules out an agent-facing cut at all.

---

## 2. The design, on the record (not authorized)

Written so it can be reviewed or re-litigated without redoing the work. If a future decision reverses R-5, this is the starting draft, and it is still not sufficient: sections 1.2 and 1.3 are properties of the source, not of the spec.

### 2.1 Extraction inputs and what each column is allowed to become

Default is deny. A column that is not named here does not reach the transform at all.

| Source | Admissible as | Notes |
|---|---|---|
| Alive, `Generator` | role name (A-1) | normalized to a function. Never the job name. |
| Alive, `What it does` | **input to a rewrite**, never verbatim | T-1..T-4. This is the authorship cost from 1.1. |
| Alive, `Writes to` | write class from a closed enum of three (A-3) | vault writes / report only / host-side. The path itself is never read into output. |
| Alive, `Schedule` | cadence band (A-4), or nothing | deny as a field. A monitor-gated watch gets **no** band: a band for a gated watcher implies a schedule that does not exist. |
| Paused / ended | failure class or ended-work class (A-5) | never as a row, never with a date. |
| Dead | **nothing** | a dead scheduler's inventory is history, not a page about what runs now. |
| Frontmatter (`public`, `confidential`, `type`) | **nothing** | the projection is not a KB page and must not inherit a `public:` marker. It publishes under the site's gate, not the KB's. |
| History | **nothing** | this is where the ids, paths, profile breakdowns and incident instances live. |
| Sources | provenance only | not an input to any claim; it is the one place where a working path may appear (D-3b), because a receipt is provenance rather than content. |

### 2.2 Allow-list: the only six things that can reach output

- **A-1 role name** normalized to a function ("mail triage", not "hermes important-mail monitor").
- **A-2 one-sentence description** in your voice.
- **A-3 write class**, closed enum of three.
- **A-4 cadence band**, closed enum of four: several times an hour / a few times a day / weekly / monthly or rarer.
- **A-5 failure class**, closed list, fixed or generic only. Open incidents are excluded (R-4).
- **A-6 one dated aggregate count** plus its `asOf` month.

The extractor is an allow-list filter. The deny-list in 2.4 is a **second, independent net**, and the leak tests in section 6 assert over the net rather than trusting the filter. Both exist because a single layer that is trusted is a single layer that rots.

### 2.3 Transformation rules

- **T-1 role, not product.** `hermes rt-bill-watch-nightly` becomes "bill tracking for three states". The reader buys the function.
- **T-2 outcome, not mechanism.** Drop script names, flags, file paths, model names, delivery channels. "Opens one review card" survives as "puts one decision in front of me"; "`--no-agent`, telegram failure-only" does not survive at all.
- **T-3 one claim per row.** The claim must be checkable at aggregate level only. If a row can only be described by stating a parameter, the row does not publish.
- **T-4 no negation of a live incident.** A job that is currently failing publishes as a class, never as "we fixed X". This is R-4 as a transform rule, and it is the rule a mechanical transform will break first.
- **T-5 cadence band, two hard rules.** (a) monitor-gated jobs get no band; (b) at most one explicit clock time in the whole page, and only where it is the story ("a 3am pass"). A table of firing times is a map of when nobody is watching.
- **T-6 ended work stays ended.** Paused and removed rows publish as ended-work classes or failure classes, never as rows, and never with a date that lets a reader reconstruct the schedule.

### 2.4 Deny-list

Applied to the transform's output *and* asserted over the built HTML. Patterns are illustrative, not exhaustive; the config lives beside the extractor, and the roster stays outside the repo.

| ID | Denies | Pattern | Live corpus today |
|---|---|---|---|
| D-1 | Hermes job ids **as identifiers**: a row key, a table column, anything that lets a reader correlate a live scheduler record. Not a frozen receipt path (see 2.7). | `\b[0-9a-f]{12}\b` | 32 unique in the registry; 3 in the **already-published** `add-friendly-agent.md` |
| D-2 | kanban card ids, always | `\bt_[0-9a-z]{8}\b` | 12 unique in the registry; 0 in any draft |
| D-3a | **state and credential paths**: `secrets/`, `tokens.json`, `.config/`, `.hermes/`, `price-watches/`, `jobs.json`, `.prune-ledger`, `state.db` | those literals | 71 hits in the registry; 0 in the case-study drafts |
| D-3b | **allowed, deliberately**: a working path cited as provenance (`~/Dev/<repo>/FILE.md`, a mount containing a memory ledger). R-3's own wording: "a local memory path is fine; a key path is not." | none | 23 hits in `add-friendly-agent.md`, 13 in `distills.md`, 29 in `agent-stack.md`, all `~/Dev/...` receipts |
| D-4 | credentials | `secret`, `token`, `PAT`, `api key`, `password`, `oauth`, `secrets/`, `tokens.json` | 26 hits in the registry |
| D-5 | scheduler topology | any 5-field cron expression; `jobs.json`; `profile store`; a per-store breakdown of the form `23 + 4 + 2 + 2`. **Aggregate profile count is allowed** ("across four agent profiles"); the per-store matrix is not. | 7 unique cron expressions in the registry |
| D-6 | run-status bookkeeping | `enabled=`, `disabled`, `state: completed`, `repeat 1/1`, `last_status`, `never run`, `auto-disabled`, `job record deleted` | 93 hits in the registry |
| D-7 | third-party personal data | roster check against a file kept outside the repo: family names, clients, candidates, mail subjects, calendar entries, gift items. R-3 puts this out of scope entirely (memo D-2). | `Anna` x3, `Kaiser` x2 in the registry; `GHN` in `agent-stack.md` line 94 |
| D-8 | host and network identity | IPv4 literals, `:\d{4,5}` ports, `.local` hostnames, `local.mike.` launchd labels, Tailscale references | 0 in the registry; `100.82.70.37:11434` in `agent-stack.md` line 86 |
| D-9 | delivery channels | `telegram`, `bot-chat`, `deliver all`, `origin` as a channel name. The channel map is an operator detail. | 35 hits in the registry |
| D-10 | site rule | em dash in any frontmatter string | already build-enforced by `site/src/content.config.ts` |

D-3 is split because the absolute form of it is wrong, and I would rather correct that here than ship a rule the live site already breaks. R-3 says credential and state paths, not all paths; the published corpus cites working files as receipts and that is the genre. A rule that fails your own three shipped case studies is a rule that gets waived at the first review, which is worse than a narrower rule that holds.

D-1 carries a live conflict I cannot resolve alone. R-3 says no job ids, full stop. `content-drafts/case-studies/add-friendly-agent.md` publishes three, inside `~/.hermes/cron/output/<id>/` receipts, and that page is live on `/work` right now. Either R-3 is absolute and the existing page is a latent problem, or the receipt-path form is grandfathered. My recommendation is below (D-6), and it does not block the new page: category-level prose needs no id at all.

### 2.5 Output formats: the card asks for both, the ruling says one

R-1 rules out the agent-facing cut, and it should stay ruled out. The useful thing for the record is *why the second cut is not a second format of the same data*:

| | human cut | agent cut (declined) |
|---|---|---|
| Container | `/work/<slug>` case study | `/agents/` claims register |
| Gate | `publish-case-studies.mjs` + your commit | digest + `kb_drift` alarm |
| Freshness | frozen window, dated count | must be true at every digest run |
| Failure semantics | a stale date is visible to a reader | a stale row is a false claim to a machine |
| Owner | you, at publish | nobody, nightly |

The agent variant would have to be a **claim set with per-claim digests**, which is the register shape that already failed. It is a different product with a different owner, not a serialization of the human page. If it is ever wanted it does not share this pipeline, and it does not start from the registry.

### 2.6 Digest and drift: three candidates, and the ruling among them

| Option | Catches | Cost | How it dies |
|---|---|---|---|
| (a) Projection digest + committed `digest.json` + daily compare, `kb_drift` shape | any change to the emitted page | one more nightly writer, a committed artifact, edge-cache TTL story | fires on registry bookkeeping, gets muted, then misses the real change |
| (b) Field-scoped semantic digest (A-1..A-6 only, normalized, no clock, no mtime) | a published claim changing value | same as (a), plus a normalization contract to maintain | silent when a claim goes false without changing bytes; that is the common case here |
| (c) Frozen `asOf` + publish-time lint (R-5) | decay, at the moment a reader could be misled | twenty lines | none that matter: it does not claim to detect change |

**The rule for the next worker:** (a) and (b) detect *change*; (c) detects *decay*. This page's risk is decay, plus semantics that no digest can see. That asymmetry is the whole argument, and it is why the alarm is not "deferred" or "simplified", it is dropped.

---

## 2.7 What the net hits today, measured

Run against the real sources at 23:35 on 2026-10-30, with the patterns above. Numbers are unique matches unless marked.

| Corpus | D-1 | D-2 | D-3a | cron | status text | roster | net |
|---|---|---|---|---|---|---|---|
| `KB/pipelines/generator-registry.md` | 32 | 12 | 71 | 7 | 93 | 5 | 0 |
| `content-drafts/case-studies/agent-stack.md` | 0 | 0 | 0 | 0 | 0 | 1 | 2 |
| `content-drafts/case-studies/add-friendly-agent.md` (**published**) | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| `content-drafts/case-studies/distills.md` (**published**) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `content-drafts/case-studies/neighborhoodshare.md` (**published**) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Three things fall out of that table, and they are the reason to keep this document even though the projection is declined:

1. **The registry cannot be published by any transform that preserves its language.** 32 job ids, 12 card ids, 71 state-path tokens, 7 cron expressions and five third-party names sit inside 35 rows of prose. There is no filter that removes those without removing the sentence they live in, which is 1.1 with numbers.
2. **The draft that is 80 percent of the page is nearly clean already.** Two real leaks: the live Ollama endpoint `100.82.70.37:11434` at line 86, which is an address on your private network, and a `GHN` reference at line 94 inside the "Needs from Mike" block that gets stripped anyway. Everything else it cites is a working-path receipt, which is the genre. That is a good sign for the curation path and a bad sign for the "we need a machine to do the disclosure work" theory: the prose that already exists is more publishable than the operator table it would have been generated from.
3. **A shipped page already breaks the strict reading of D-1.** Recorded above. It is Mike's call (D-6), and it is not a reason to loosen the new page, which needs no ids.

---

# Part B: S-1, the slice that survives

## 3. `asOf` staleness lint

### 3.1 What it is

A case study that publishes an aggregate count must declare **when that count was measured**. At publish, a stale measurement is refused. At build, it is warned. That is the entire mechanism. No registry read, no generator, no digest, no alarm, no card, no write outside `site/`.

`asOf` is the date the numbers were **read**, not the date the page was published. If those differ, both appear in the ledger line, because the whole point is that a reader can tell how old the claim is.

### 3.2 Changes

1. `site/src/content.config.ts`: add `asOf: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional()`.
   Optional in the schema, because three published case studies carry no aggregate count and a required field would break them for no reason.
2. `site/scripts/publish-case-studies.mjs`: a one-line allow-list at the top, `const STALENESS_TRACKED = new Set(["agent-stack"])`. For a slug in that set, the draft must declare `asOf`, and `asOf` must be within the last two calendar quarters. On failure, `refused:` and `process.exitCode = 1`, matching the script's existing refusal idiom (missing section, empty Sources, slug mismatch). A `--allow-stale` flag overrides, printing the `asOf` it is overriding so the decision is in the log.
   The allow-list is deliberately a literal array, not a heuristic over prose. Heuristics over prose are how a lint becomes a pipeline.
3. `site/scripts/verify-case-render.mjs`: after the frozen-copy checks, one line per tracked slug. Stale prints `STALE: /work/<slug> asOf 2025-01 is more than two quarters old`. A warning, never a build failure: a content fact must not break a cloud build where nobody can act on it.

None of those three stops F-10: a bumped month passes the lint. The lint measures the age of a declaration, not its truth. The truth check is a fresh count in the same session, and it belongs to RP-4 because it is the one thing a machine cannot do for you here: it requires meaning it.

### 3.3 Who refreshes it, and when

The publisher, in the same session as the publish, by reading the live job stores the way section 1.2 reads them. Not the nightly KB pass: the registry's owner keeps the registry current, and the case study is not the registry. Not a cron job: a job that updates a number nobody approved is a generator with extra steps.

### 3.4 Cost

Roughly fifteen lines in `publish-case-studies.mjs`, eight in `verify-case-render.mjs`, one schema line, and a three-case test (fresh, stale, missing). It needs `asOf` in the draft's frontmatter, which is a content change on a draft that is still unshipped, so it costs nothing you have to undo.

### 3.5 What would reopen the projection

Only these, and each is a decision, not a drift:

- you want per-job public pages, not a system narrative;
- the case-study container is retired or stops being gated;
- a second reader surface appears that must be machine-checkable;
- the registry gains a structured, field-level public representation (it will not; its shape is the thing that broke it).

---

# Shared: failure modes, review, and proof

## 4. Failure modes

Applies to the declined projection (F-1..F-9) and to S-1 (F-10).

| ID | Failure | Detection | Blast radius |
|---|---|---|---|
| F-1 | **Partial row leak.** A rewrite carries an id, a path or a cron expression inside a sentence. | D-1..D-10 scan over built HTML (AC-2), canary corpus (AC-3) | public, permanent: crawled, cached, archived |
| F-2 | **Cry wolf.** Digest fires on bookkeeping, gets muted, then misses a real change. | none; this is the failure mode itself | the alarm's credibility, then the page's truth |
| F-3 | **Source lag.** Page is wrong at build because the registry is behind. Verified live in 1.2, not hypothetical. | re-count at publish (S-1's `asOf` is the honest response) | a stale-but-dated claim, which is survivable |
| F-4 | **Paused row reads as live claim** (agent cut only). | `kb_drift` noise, then mute | the claims register's meaning |
| F-5 | **Semantic leak through a rewrite.** A rewritten sentence re-introduces a name the lexeme list has never seen. This is the failure that defeats any mechanical design. | roster check (AC-9) + human read (RP-4). **Not detectable by regex.** | public, and it is a third party's privacy |
| F-6 | **Open incident published as fixed** (violates R-4). | RP-4 only; no pattern sees tense and truth at once | credibility, and a live hole advertised |
| F-7 | **Digest right, surface stale.** Edge cache serves the old page while the digest says new. | cache TTL check at review (RP-3) | reader sees a claim nobody is checking |
| F-8 | **Silent parse degradation.** A registry edit (new column, wrapped cell, merged row) drops rows; the failure surfaces as a shorter page, not an error. | row-count assertion against the source table (AC-4), not against the output | a quietly partial inventory |
| F-9 | **The generator becomes the source of truth by habit.** Page keeps publishing, registry rots, nobody notices the direction reversed. | no automated detection; this is a rule, not a check | the registry's only job |
| F-10 | **The date gets bumped, the numbers do not.** Someone hits the `asOf` refusal, edits the month to pass, and never re-reads the stores. This is the failure S-1 invites, by design. | RP-4 spot check: does the count in the prose match a fresh count taken in the same session? | a dated claim that is confidently wrong, which is worse than an obviously old one |

## 5. Review points

Order matters: run the suite before a human reads it, so nobody spends attention on a draft that cannot pass.

- **RP-1, content author.** Every published sentence traces to an override entry (AC-10). A sentence with no entry behind it does not ship.
- **RP-2, dev-lead.** Deny-list coverage, AC suite green, and the mutation test actually bites (AC-5). A suite that passes with the guard removed is decoration.
- **RP-3, release.** Build-output scan, edge cache TTL, and that no new route or export surface appeared (`git diff` on `site/public/agents/kb` and `llms.txt` must be empty, AC-11).
- **RP-4, Mike, one question.** R-3's test, per sentence: does this reveal when a bot is not looking, or what it would fail to catch? This is the only review that cannot be delegated, and it is the only one that catches F-5 and F-6.

## 6. Acceptance checks that prove no forbidden field can leak

Two design constraints, both lifted from the repo's existing belt-and-suspenders habit rather than invented here:

- **Assertions run over emitted bytes**, not over the transform. `site/scripts/kb-to-agents.mjs:376` sets the precedent: after rendering, every emitted chunk is re-scanned and the process aborts with `ABORT: confidential token survived redaction` if one survives. The transform is not trusted; the output is checked.
- **The suite must fail when the guard is removed.** Otherwise it is a passing test of nothing.

| ID | Asserts | How it fails |
|---|---|---|
| AC-1 | **Allow-list closure.** Every published field is one of A-1..A-6; no key exists outside the set. | extractor emits an unknown key |
| AC-2 | **Lexeme scan over built HTML.** Zero hits for D-1, D-2, D-3a, D-4..D-9 across every emitted page, including `<title>`, meta tags, JSON-LD and the sitemap entry. D-3b is an explicit pass. | any hit, with file and offset printed |
| AC-3 | **Canary injection.** A synthetic registry row carrying a job id, a token path, a cron expression and a third-party name is fed through the extractor in CI. | build completes instead of aborting |
| AC-4 | **Negative corpus from live data.** All rows of the current registry transform, and the row count equals the source table's row count minus the explicitly excluded sections. | any row dropped without an exclusion reason (F-8) |
| AC-5 | **Mutation test.** Empty the deny-list, re-run the canary corpus, assert AC-2 fails. | AC-2 still passes, meaning the scan never matched anything |
| AC-6 | **Determinism.** Same input twice gives byte-identical output: no clock, no mtime, no unordered iteration. | any byte differs between runs |
| AC-7 | **Freshness.** Every tracked slug declares `asOf` within two calendar quarters (S-1). | missing, malformed, or stale beyond the window |
| AC-8 | **Cadence cardinality.** At most one explicit clock time on the page; no 5-field cron expression; no cadence band on a monitor-gated job. | any count over the limit |
| AC-9 | **Roster.** Zero hits against the third-party roster, which lives outside the repo. | any hit |
| AC-10 | **Traceability.** Every published sentence maps to an override entry, and every override entry is used. | an orphan in either direction |
| AC-11 | **No new surface.** `site/public/agents/kb/**` and `site/public/llms.txt` are byte-identical to HEAD. | any diff |

**Which of these are load-bearing:** AC-2 without AC-5 is theater, because nothing proves the scan matches. AC-3 without AC-4 is theater, because a canary can pass while the real corpus drops rows. AC-11 is the only check that enforces R-1 mechanically; everything else enforces R-3. If the projection is ever built, those four are the minimum, and they are cheap because three of them already exist in this repo's idiom.

**What none of them can prove:** that a rewritten sentence does not leak something a regex has never seen (F-5), or that a described failure is honestly described (F-6). Those are RP-4. Any spec that claims its tests cover them is lying, and this one is the reason a generator was never the right shape.

## 7. Non-goals

- No generator, no route, no template, no nav item.
- No digest, no committed `digest.json`, no alarm, no nightly writer for this page.
- No `/agents/` cut, in any form, now or as a curated second version.
- No change to `KB/ai/how-mike-works.md` beyond the one-sentence pointer R-2 allows, made under the normal gate.
- No sentence-level redactor for the registry. Ruled out on t_c1a52c37; the row-shape argument in 1.1 still holds.
- S-1 does not read the registry. It reads a date.

## 8. Decisions still yours

Inherited from the memo, unchanged: **D-1** repurpose `agent-stack.md` or write fresh (rec: repurpose). **D-2** any personal or family automation content (rec: none; this is what makes D-7 in the deny-list absolute). **D-3** failure classes in or out (rec: in, as classes, mail-triage instance held while open). **D-4** `/work/<slug>` plus a Systems-index pointer (rec: both).

New here:

- **D-5. Does the case study carry an `asOf`?** If yes, S-1 is the whole implementation and it goes on the same card as the curation. If no, the page ships with a dated count and no guard, which means the date is decoration and decay is unbounded. *Rec: yes.* *Default if you say nothing:* no guard ships, and section 3 stays unbuilt.
- **D-6. Does the live `add-friendly-agent` page keep its three job ids?** It publishes `~/.hermes/cron/output/<id>/` receipts today, which is a stricter reading of D-1 than R-3's wording allows. *Options:* (a) R-3 is absolute, and that page needs the ids swapped for a description of the output, which costs a re-publish of a page that is otherwise fine; (b) a frozen receipt path is provenance, not an enumeration handle, and only live-row ids are banned. *Rec: (b), and write the distinction into R-3 so the next reviewer is not guessing.* *Default if you say nothing:* the new page ships clean and the old one keeps its ids as an undocumented exception.

## 9. Evidence, and what I am assuming

**Verified tonight, by reading:**

- `KB/pipelines/generator-registry.md` (144 lines, `public: no` since 2026-10-30, Alive + Paused/ended + Dead sections, one table line per generator including ids, paths, cron text and run status).
- The four job stores, counted at 23:32 PT on 2026-10-30: 24/26 default, 4/4 ops, 2/2 dev-lead, 2/2 roy, so 32 enabled against the page's 31, with three unlisted default records and two of them created today after the 03:00 pass (section 1.2).
- `site/src/content.config.ts` (case-study schema; no `asOf` field, em-dash refinement at build time).
- `site/scripts/publish-case-studies.mjs` (45 lines; required-heading and Sources-item refusals, slug/filename match, prose frozen, `refused:` idiom, exit 1).
- `site/scripts/verify-case-render.mjs` (130 lines; frozen-copy assertions against `dist/`, exit 1 on mismatch).
- `site/scripts/kb-to-agents.mjs` (546 lines; default-deny on `public:`, line-level `CONF_PATTERNS` redaction, the post-render `ABORT` belt at line 376, digest of the projection rather than the vault file, "same input, same bytes").
- `site/scripts/feed-notice.mjs` (`kb_drift` as detector F3; compares the live `--digest` against committed `digest.json`; "comparing against nothing would manufacture drift").
- `content-drafts/case-studies/agent-stack.md` (99 lines; the two stale numbers: "33 cron jobs, 26 of them enabled", and a Sources line citing "33 jobs, 26 enabled").
- `docs/plans/public-automations-decision-2026-10-30.md` (R-1..R-5, D-1..D-4).

**Measured tonight, not estimated (section 2.7):** the deny-list patterns were run over the registry and all four case-study drafts with `grep -oE` counters. The registry returns 32 unique job ids, 12 unique card ids, 71 state-path tokens, 7 unique cron expressions, 93 run-status hits and 5 third-party name hits. The published `add-friendly-agent.md` returns 3 job ids and 23 working-path hits. `agent-stack.md` returns `100.82.70.37:11434` and one `GHN` reference, and no other deny hits. Those numbers are the evidence behind sections 1.1, 2.4 and 2.7.

**Assumption, marked:**

- I have not implemented or executed anything in S-1. The line counts in 3.4 are estimates from reading the two scripts, not measurements.
- I am assuming the case study's aggregate count is the only number that needs a window. If the page later carries more than one date-bearing claim, one `asOf` stops being sufficient and the lint needs a per-claim shape. That is a different, larger discussion, and it belongs to whoever writes the prose.
