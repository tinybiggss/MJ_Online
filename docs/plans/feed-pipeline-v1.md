# Feed pipeline v1 — the notice loop, P1 slices, and the mirror direction

**Status:** build plan, executable. Author: Spock (product authority). Date: 2026-10-30.
**Supersedes:** `agent-feed-system/docs/spec/v1-publisher.md` §10 **P1 acceptance line only**
(see §5.2 — as written it would publish friends-only content at a public URL). Everything
else in the spec stands; where this plan is silent, the spec is law.
**Repo:** `/Users/michaeljones/Dev/MJ_Online`, branch `feed/p0` (2 commits, nothing pushed,
nothing deployed). Work lands as further commits on a branch; **only Mike ships.**
**Non-negotiable:** no runtime API, no database, no auth wall, no new dependencies, static
generation only, default-deny on audience, `confidential:` hard-blocks, and nothing
publishes unattended — a scheduled job may *detect and stage*, never publish and never
write into the vault.

---

## 1. The verdict in one paragraph

Build one scheduled script that answers a single question — *"would a rebuild change what
is published, and what has happened that the record doesn't know about?"* — and stages the
answers as copy-ready files plus one kanban card. Then finish the slice URL space so
audience tags actually drive feeds, and expose platform mirrors as item data. Do not build
tokens, canonical permalinks, or any platform integration. The notice loop is the product
here; the slices are the scaffolding it makes honest.

**Four decisions this plan is built on** (each with the deciding factor, no menu):

| # | Decision | Deciding factor |
|---|---|---|
| D1 | The **baseline is the committed artifact**, not a state file the detector keeps | No seeding, no first-run alarm storm, no state that can lie; "since the last feed build" means the build that shipped |
| D2 | KB change detection hashes the **published projection**, not file bytes | The vault's nightly pass rewrote three pipeline pages at 03:01 today and stamps each with `<!-- writer: kb-nightly … -->`; byte hashing would fire every morning and be ignored by Friday |
| D3 | Gated slices are **derived, declared, and withheld** — never emitted before P2 | An ungated `/feed/friends/feed.json` is a leak with a URL; the spec's own P1 acceptance line is the bug |
| D4 | Platforms stay **links in one stream**, never feeds of their own | Five platform streams is slice sprawl; the site is canonical only if it stays singular |

---

## 2. What P0 actually is (verified 2026-10-30, not assumed)

| Fact | Evidence |
|---|---|
| `feed-build.mjs` works on branch `feed/p0`: 618 lines, exports its helpers, 497-line vitest suite | `site/scripts/feed-build.mjs`, `site/scripts/feed-build.test.mjs` |
| It emits 20 items: 1 from the publication log, 19 passed through from the Substack RSS | `site/public/feed/index.json` → `published_log.items: 1`, `substack: {items: 20, merged: 19}` |
| Slices, mirrors, and audience beyond `public` are **not** in the output | `feed.json` items carry no audience/type/mirror fields; `index.json.slices` has one entry |
| Discovery links exist in `<head>` but there is **no visible subscribe affordance** anywhere | `site/src/layouts/Base.astro:41-42`; `/writing`'s CTA points at `resilient-tomorrow.com`, not at the feed |
| `/writing` already mirrors Substack by fetching it at build | `site/src/pages/writing.astro:4` (`getLatestEssays`) |
| The publication log has **one** note; its frontmatter carries Substack only, while its body records a Bluesky post from the same day | `Social/Published/2026-10-29-agentic-web-owning-discovery.md` (frontmatter `platforms:` vs. body line "2026-10-30 13:46 PDT — Bluesky post published") |
| 13 KB pages are `public: yes`; the exporter skips `SCHEMA.md` and publishes 12 | `grep -rl "^public: yes" KB` = 13; `public/agents/kb/index.json.pages.length` = 12 |
| **The published agent export is stale and contradicts a ruling Mike made.** It still says the RT pipeline is "content pipeline v2 pending"; Mike's 2026-10-29 one-home ruling superseded that | `git show main:site/public/agents/kb/kb-pipelines-publication-layer.md` vs `KB/pipelines/publication-layer.md:21` |
| The export publishes **internal writer stamps** (`<!-- writer: kb-nightly … -->`) and carries an **orphan file** not listed in its own index (`kb-pipelines-generator-registry.md`, superseded by `-part1`/`-part2`) | `grep -r "writer:" public/agents/kb/`; `index.json` lists part1/part2, disk has a third unlisted file |
| The nightly KB pass rewrote 3 pipeline pages at 03:01–03:02 today | `ls -lT KB/pipelines/` |
| `main` has **no** feed at all; nothing is deployed | `git ls-tree main site/public/feed/` → empty |

**The motivating true positive, and the reason this plan exists:** the site's public fact
sheet has been asserting a superseded claim for two days and no surface told anyone. That
is exactly what Mike asked for — *"notice when my knowledge base updates"* and *"notice that
things need to get pushed"* — and it is currently nobody's job.

---

## 3. Design law for this stage

1. **The artifact is the baseline.** Everything the detector compares against is a file
   already committed under `site/public/`. No hidden state, no seeding run, no "last seen"
   database of the world. If a clone of the branch can't reproduce the detector's view, the
   detector is wrong.
2. **A finding is a fact plus a proposal.** Every finding carries the evidence that produced
   it (paths, URLs, digests) and, where an action is wanted, a ready-to-approve file. No
   finding may consist only of a conclusion.
3. **The detector writes in exactly two places**: `site/content.staging/feed-notice/`
   (gitignored) and the kanban board. Never the vault, never `public/`, never a commit.
4. **Silence is a valid output.** A run with nothing to say writes nothing, cards nothing,
   exits 0. A detector that speaks daily about nothing is a detector that gets filtered to
   trash, and this one is only valuable if it is believed.
5. **Fail closed on audience.** Anything the taxonomy can't name is a hard failure in a
   local build, not a warning. `confidential:` is never counted, never listed, never hinted.
6. **It is not wired into `astro:build:start`.** Builds must never create cards or stage
   proposals. The notice loop is its own entry point.

---

## 4. The notice loop

### 4.1 Shape

One script, `site/scripts/feed-notice.mjs`, no new dependencies, reusing `feed-build.mjs`'s
exported helpers (`normaliseUrl`, `titleSlug`, `summarise`, `parseSubstackRss`,
`mergeItems`) — the same merge logic that already decides what is one post.

```
node scripts/feed-notice.mjs                 # normal run (network on)
node scripts/feed-notice.mjs --dry           # compute + print, write nothing, card nothing
node scripts/feed-notice.mjs --no-net        # skip Substack; F1/F2/F4-with-cache arms only
node scripts/feed-notice.mjs --json          # machine summary to stdout
```

Environment: `VAULT_DIR` (default `/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space`),
`HERMES_BIN`, `FEED_NOTICE_ASSIGNEE` (default `content`), `FEED_NOTICE_BOARD` (default
`default`), and `FEED_NOTICE_PRIORITY` (default 40).

Exit codes, which the scheduler keys on: **0** nothing to report · **10** findings staged
(and a card attempted) · **1** detector error (unreadable vault, unparsable log) · **2**
vault absent (CI or a machine without the vault — a silent, non-alarming no-op, the same
fallback `feed-build.mjs` and `kb-to-agents.mjs` already make).

### 4.2 The five findings

Every finding is `{kind, severity, id, title, detail, evidence[], proposal|null}`. Ids are
stable strings used for dedupe: `unlogged:<piece-slug>`, `surface:<piece-slug>:<platform>`,
`kb:<page-id>`, `drift:<artifact-path>`, `source:substack`.

**F1 — `unlogged_publication` (high). Did Mike publish to Substack something the log doesn't have?**

Rule: fetch the Substack RSS; take items with `date_published >= NOTICE_SINCE`
(`'2026-10-30'`, a named constant with a one-line comment). For each, compute the identity
keys `identityKeys()` already uses (normalised URL, title slug) and check them against every
`Social/Published/*.md` entry's `platforms[].url`, `piece`, and title. No match ⇒ finding,
with a proposal: a copy-ready `Social/Published/<piece>.md` note in the log's own schema.

Why the horizon exists, stated in the report itself: `Social/Published/README.md` rule 5
forbids bulk backfill. Nineteen RSS items predate the log and are *supposed* to be unlogged.
A detector that demands nineteen log notes on its first run is asking Mike to break his own
rule. The report says so in one line — "watching since 2026-10-30; 19 earlier RSS items are
pre-horizon and intentionally unrecorded" — so the silence reads as deliberate.

**F2 — `unrecorded_surface` (medium). Did a surface go live that the log's frontmatter doesn't know about?**

This is Mike's Facebook/LinkedIn/Instagram ask, answered without a single platform API.
For each log note's **body**, collect http(s) URLs whose host is in an allowlist —
`bsky.app`, `linkedin.com`, `facebook.com`, `instagram.com`, `x.com`, `twitter.com`,
`tiktok.com` — and that do **not** appear (by `normaliseUrl`) in that note's frontmatter
`platforms[].url`. Emit a finding per missing surface, with a proposal patch: the YAML
block to add under `platforms:`.

`youtube.com` is **excluded from the allowlist on purpose.** The one existing log note
embeds a class video and explicitly says it "is not logged here as a platform of this
article" — that is the false positive that would have taught Mike to ignore this arm. When
a URL is genuinely a surface, the log says so in prose and the platform name appears on the
same line; the allowlist plus the frontmatter diff is enough at this volume.

**F3 — `kb_drift` (medium). Which public KB pages changed since the published export?**

Precondition (item S1): `kb-to-agents.mjs` gains `--digest`, and writes
`public/agents/kb/digest.json` at build time:

```json
{ "generated_at": "...", "pages": { "kb-pipelines-publication-layer": { "digest": "sha256:…", "updated": "2026-10-30", "files": ["kb-pipelines-publication-layer.md"] } },
  "orphans": ["kb-pipelines-generator-registry.md"] }
```

The digest is `sha256` over the page's **rendered, redacted body chunks** (the same strings
`renderPage()` emits), with HTML comments stripped and whitespace collapsed **before**
hashing. Two reasons, both evidenced: the vault's nightly pass appends
`<!-- writer: kb-nightly … -->` to the body of every page it touches (that line is currently
being published — S1 fixes that too), and `updated:`/History churn is bookkeeping, not
content. Hashing bytes would make F4/`kb_drift` fire every night about nothing.

The detector runs `kb-to-agents.mjs --digest --json` against the vault and compares to the
committed `digest.json`. Changed pages ⇒ one finding per page, naming the page title and its
public URL. Orphans in the committed export ⇒ folded into the same finding class, because an
orphan is a page that *was* published and no longer is.

**F4 — `rebuild_would_change_output` (high when non-empty). Do things need to get pushed?**

The headline, and Mike's third clause verbatim. Run both generators with output redirected
to a temp dir (`FEED_OUT_DIR`, `KB_OUT_DIR`) and compare, field by field, against the
committed `public/feed/*` and `public/agents/kb/*`, ignoring volatile fields only
(`generated_at`, `generatedAt`). Any difference ⇒ finding listing the artifact paths and a
one-line summary of what changed ("+1 item", "12→13 pages", "digest changed on 3 pages").

If the Substack fetch fails, F4 is skipped for the feed half (it would manufacture drift) and
reported as **F5**.

Also in F4: `git status --porcelain -- site/public/feed site/public/agents` non-empty ⇒
severity note "the baseline on disk is not what shipped" (low). Cheap, and it is the
discipline failure that produced today's stale export.

**F5 — `source_unreachable` (low).** RSS fetch failed, or returned zero usable items, or the
KB export's `digest.json` is missing. Always reported, never escalated, and it must never be
spelled as "no new post" — a network blip is not editorial silence. `feed-build.mjs` already
learned this lesson ("Substack unavailable — keeping existing feed output").

### 4.3 Output: staged, not written

```
site/content.staging/feed-notice/            (gitignored via content.staging/)
  ledger.json                                dedupe + nag memory, one file, survives runs
  <YYYY-MM-DDTHH-MM>/
    notice.json                              machine: findings[], counts, delivered{}
    report.md                                human: one paragraph, then one line per finding, then "Do this:"
    proposals/<piece>.md                     byte-for-byte a valid Social/Published note
    patches/<piece>.platforms.yaml           the platforms: block to paste
```

`report.md` template, fixed:

```
# feed notice — 2026-10-30 14:20 PT
3 finding(s): 1 high, 2 medium.

Rebuild would change what is published: /feed/feed.json (+1 item),
/agents/kb/kb-pipelines-publication-layer.md (claim superseded 2026-10-29).

## Do this
1. Approve the log note: cp content.staging/feed-notice/2026-10-30T14-20/proposals/… Social/Published/
2. Add the Bluesky surface: patch below
3. Rebuild + commit both public/feed and public/agents together

## Findings
### F4 rebuild_would_change_output (high) — drift:site/public/agents/kb
…evidence…
```

Retention: keep the 14 newest dated directories, prune the rest. Unbounded staging
directories become a second library, which is the failure the vault already paid for once.

### 4.4 Dedupe, nagging, and the card

`ledger.json` holds `{version: 1, seen: {"<kind>:<id>": {first_seen, last_seen, last_carded, runs}}}`.

- A finding absent from the ledger is **new**.
- A finding present is silent unless it is **high severity and `last_carded` is ≥ 7 days old**.
- A finding that disappears from the current result is **removed** from the ledger, so if it
  returns it fires again.

Card: one per run that deserves one, written with the proven contract from
`~/Dev/resilient-tomorrow-site/scripts/bill-watch/bill-watch.mjs:616` —
`hermes kanban --board <board> create --assignee <role> --priority 40 --idempotency-key
feed-notice-<YYYY-MM-DD> --body-file <report.md> --json "<title>"`. Title:
`feed notice 2026-10-30 — 3 finding(s) [drift, unlogged, surface]`. Body: `report.md` inline
plus the absolute staging path. **One card per day, not one per finding** — five cards for
one piece is nagging; one card listing five things is one decision.

Assignee `content` (Perkins): it owns `Social/` under the Write-Access Policy and is the
profile that would write the log note. Verified on-disk (`~/.hermes/profiles/content`), so
the dispatcher will not skip it — the `hermes` phantom-assignee failure from 2026-10-27 is
the precedent for checking.

Card write failure is **not** a detector failure: the finding stays in `report.md`, the
exit code stays 10, and the ledger does not record the card as delivered. Never lose the
finding to a delivery error.

### 4.5 What the notice loop never does

Never writes into `VAULT_DIR`. Never commits, never pushes, never runs `git` beyond
`status --porcelain` on two paths. Never stages a proposal for a `confidential:` page or a
`public: no` page. Never calls a platform API. Never edits a KB page. Never cards twice for
the same finding inside seven days. Never runs from `astro:build:start`.

### 4.6 Scheduling

A user LaunchAgent, matching the machine's existing `com.jones-co.*` pattern (there are two
working content jobs already, `com.jones-co.rt-substack-daily-pull` at 23:30 and
`…-stats-pull` at 23:45):

`~/Library/LaunchAgents/com.jones-co.mikejones-feed-notice.plist`
`StartCalendarInterval` 07:10 daily · `WorkingDirectory /Users/michaeljones/Dev/MJ_Online/site`
· `ProgramArguments [/opt/homebrew/bin/node, scripts/feed-notice.mjs]` ·
`EnvironmentVariables { PATH: /opt/homebrew/bin:/usr/bin:/bin, HERMES_BIN:
/Users/michaeljones/.hermes/hermes-agent/.hermes/bin/hermes }` · stdout/stderr to
`~/Library/Logs/mikejones-feed-notice.{out,err}.log` · `RunAtLoad false`.

`HERMES_BIN` is set explicitly because launchd's PATH does not include it and
`bill-watch`'s resolver would fall through to a bare `hermes` that isn't there. 07:10 sits
after the 03:00/03:01 nightly KB pass and the 06:05 task rollover, so the report reflects the
finished night.

---

## 5. P1 slices

### 5.1 What is served

`feed-build.mjs` gains slice derivation, and the emitted set is deliberately **one** slice:

| Slug | Served at P1 | Files |
|---|---|---|
| `public` | yes | `/feed/public/feed.json`, `/feed/public/atom.xml` (alias of the canonical feed, self-referential `feed_url`) |
| `work`, `friends`, `family` | no | declared in `index.json` with `emitted: false, token_required: true`, counts derived but withheld |
| `agents` | no | `emitted: false`, `token_required: "per-item"`; `/feed/index.json` and `/llms.txt` already are the agent surface |

The canonical pair stays at `/feed/feed.json` and `/feed/atom.xml` (spec §6) — the spec's
discovery links and `llms.txt` line must not break. `/feed/public/` exists so that
"a slice lives at `/feed/<slug>/`" is true for the one audience that can be served ungated,
and so P2 is a directory that starts being written, not a URL scheme invented late.

`agents` is not emitted because a slice earns its file only when its content differs from
`public` — otherwise it is the fifth empty feed the spec's own §12 warns about.

### 5.2 Why the spec's P1 acceptance line is wrong

The spec says P1's acceptance is `/feed/friends/feed.json` exists "and contains exactly the
friends-tagged items", with tokens deferred to P2. Those two clauses cannot both hold: a
served `friends` feed with no token is friends-only content at a public URL, discoverable by
`index.json` — a leak, and precisely the one that stays unnoticed until it matters.

This plan keeps the *derivation* (the part that is real work and needs tests) and withholds
the *emission* until the token exists. P2's acceptance then becomes a one-line config change
plus a token path, which is what a phase boundary should feel like.

### 5.3 `index.json` v2 contract

```jsonc
{
  "generated_at": "…",
  "canonical": "https://mikejones.online/feed/feed.json",
  "spec": "https://jsonfeed.org/version/1.1",
  "slices": [
    { "slug": "public", "label": "Public", "feed_url": "…/feed/public/feed.json",
      "atom_url": "…/feed/public/atom.xml", "item_count": 20,
      "token_required": false, "emitted": true },
    { "slug": "work", "label": "Clients and collaborators", "feed_url": null,
      "atom_url": null, "item_count": 0, "token_required": true, "emitted": false,
      "note": "P2 — capability-token path not built" }
    // then friends, family, agents — all five present, in AUDIENCES order
  ],
  "sources": { /* unchanged from P0 */ },
  "totals": { "items": 20, "by_type": { "essay": 20 },
              "by_audience": { "public": 20 } },
  "note": "P1: audience tags drive slices; only public is served until tokens ship (P2)."
}
```

`item_count` on a gateable slice is an aggregate disclosure ("N private items exist"). It is
included because the spec asks index.json to carry counts, because it is aggregated with no
titles, dates, or URLs, and because **today every gated count is 0** — nothing in the log or
the RSS is tagged `work`/`friends`/`family`. If Mike ever wants it dark, it is one boolean.

### 5.4 Build assertions (fail closed)

Local builds, where the vault is present, must abort on:

1. An item declaring an audience slug outside `AUDIENCES` — spec §5 rule 1 says fail loudly,
   and P0 currently only warns. The message names the file and the bad slug. This cannot
   break CI (no vault there) and the fix is a one-word edit.
2. Any served slice containing an item whose `audience` lacks that slice's slug.
3. `public`'s `item_count` differing from the canonical feed's item count.
4. Any directory under `public/feed/` that is not `public/` and was not in this run's emit
   set — delete it and log. A gated slice left behind by a later build must never survive
   into a shipped `dist/`.

`confidential:` continues to hard-block before all of this, and a blocked item is never
counted in any slice.

### 5.5 Mirrors as item data

Every item gains a JSON Feed extension object (JSON Feed 1.1 permits `_`-prefixed fields):

```jsonc
"_mj": {
  "audience": ["public"],
  "type": "essay",
  "mirrors": [ { "platform": "bluesky", "url": "https://bsky.app/…", "date": "2026-10-30" } ]
}
```

`mirrors` is every logged platform **except** the item's primary (which is `url`);
omitted entirely when empty. Atom gets one `<link rel="related" type="text/html" href="…"/>`
per mirror — `related` is defined by RFC 4287, and a second `alternate` would confuse readers
about which URL is canonical.

`_mj.source` (the vault path) is deliberately **not** emitted: no reader needs it, and it
advertises vault structure for nothing.

This is what makes "the site is the feed, platforms are mirrors" *data* rather than a
sentence. It is also why the loop closes: F2 notices the Bluesky post that today exists only
in the log's prose, Mike pastes the patch, and the next build ships that post as a mirror of
the Substack piece.

### 5.6 The missing subscribe affordance

The feed has existed as committed files since 2026-10-30 (branch `feed/p0`, nothing deployed)
with discovery links in `<head>` and no human affordance anywhere on the site — the spec calls
this "the single highest-value one-hour change in this document" and P0 didn't do it. Add to `/writing`'s existing CTA block
(`site/src/pages/writing.astro:71-77`): one quiet second line under the Substack button —
"or follow the site feed: JSON · Atom" — and the same link pair in the home page footer.
No component, no JS, no visual weight competing with the Substack CTA.

---

## 6. Platforms as mirrors: the smallest version that exists before P2

**What exists after this plan, and nothing more:**

1. One canonical stream. Every post appears once, in `/feed/feed.json`, keyed by an
   immutable id.
2. Every surface a piece went live on is recorded in `Social/Published/<piece>.md`
   frontmatter `platforms:` — the schema already in `Published/README.md`, under-used
   until now (`url: null` is explicitly allowed for an unlogged publish).
3. That record is emitted as data (`_mj.mirrors`), so an agent or a reader who finds the
   Substack copy can see the piece also exists on LinkedIn and Bluesky, and vice versa.
4. `feed-notice` notices the moment a surface exists in prose but not in the record, and
   stages the patch. Mike's three verbs map one-to-one: *notice a Substack publish* = F1,
   *notice a KB change* = F3 (with F4 saying whether it shipped), *notice that things need
   pushing* = F4. F2 is the mirror arm — the site learning that a piece also went out
   somewhere it didn't host.

**What must NOT be built yet, and why:**

| Not built | Why |
|---|---|
| Any platform API client, cross-poster, or posting helper | It is an unattended publish of Mike's voice on a surface he did not approve in that moment. The gate exists because "a typo must not go live on six domains". |
| Platform tokens, cookies, session reuse | Credentials in a repo that builds on Cloudflare Pages; there is no version of that which is safe. |
| Per-platform feeds (`/feed/linkedin/`) | Mirrors are links, not streams. A second stream makes the site a hub-and-spoke aggregator and re-opens the "two sources of truth" failure in spec §12. |
| `/notes/<slug>/` canonical pages per item | Open question 2 (where is an article canonical) is Mike's, not mine. Building permalinks on his domain silently answers it and rewrites his SEO posture. |
| Token gating, private pods, revocation | P2. Nothing worth gating exists yet (0 gated items today). |
| Full-text `content_html` | Open question 3. `content_text` equal to the summary keeps the feed valid without answering it (already P0's choice, keep it). |
| WebSub hub, Micropub, IndieAuth, MCP subscribe manifest | P3/P4, on demonstrated need. |
| Analytics, per-reader counting, pixels | v1 non-goal; the kill metric is opens, nothing finer. |
| Backfilling 31 RT pieces into the log | `Social/Published/README.md` rule 5 forbids exactly this, and it is the accumulation the vault already had to freeze and archive once. |
| Rewriting `/writing` to render from the feed instead of fetching Substack | It works, it costs a build-order dependency, and it buys consistency rather than capability. Note it; don't do it. |

---

## 7. Sequence and acceptance criteria

Ordered; S1–S3 are independent of S4–S8 and can land first. Every acceptance is a command a
builder can run and a reviewer can re-run.

**S1 — `kb-to-agents --digest` + export hygiene.** *Files: `site/scripts/kb-to-agents.mjs`,
its tests, `public/agents/kb/`. Unblocks F3 and F4.*
- `--digest --json` prints `{pages: {id: {digest, updated, files}}, orphans: [...]}` from the
  vault and writes nothing.
- A `KB_OUT_DIR` override (default `public/agents/kb`) so the detector or a test can render a
  full export into a temp dir without touching the committed one.
- A normal run also writes `public/agents/kb/digest.json` with the same shape, and the digest
  excludes HTML comments and frontmatter-derived fields.
- HTML comments are stripped from emitted `.md` bodies: `grep -r "writer: kb-nightly"
  public/agents/kb/` returns nothing.
- Files not referenced by `index.json` are removed on write (the
  `kb-pipelines-generator-registry.md` orphan disappears; `-part1`/`-part2` survive).
- `npx vitest run` green; `npm run build` green; page count still 12. **Acceptance:** running
  `--digest` twice against an unchanged vault returns identical digests; touching a page's
  mtime, its `updated:` field, or appending a writer stamp changes **no** digest; editing one
  word of body prose changes exactly one.

**S2 — P1 slices and mirrors in `feed-build.mjs`.** *Files: `feed-build.mjs`,
`feed-build.test.mjs`, `public/feed/*`.*
- `/feed/public/feed.json` and `/feed/public/atom.xml` exist after a build; their item sets
  are identical to the canonical feed, and their `feed_url`/`self` links point at themselves.
- No directory exists under `public/feed/` other than `public/`.
- `index.json` carries all five slices with `emitted`, `token_required`, `item_count`, and
  `totals.by_type` / `totals.by_audience`.
- Every item carries `_mj.audience`, `_mj.type`, and `_mj.mirrors` when the log records more
  than one platform; Atom carries `rel="related"` for each mirror.
- Tests: a fixture item tagged `["friends"]` appears in **no** served file and in **no**
  emitted directory; a fixture item tagged `["public","friends"]` appears in `public` only; a
  fixture item with `audience: ["publc"]` aborts the build with a message naming the file.
- `npx vitest run` green, `npm run build` green, `dist/feed/` populated. **Acceptance:**
  `curl`-equivalent check on `dist/` plus the three fixture tests.

**S3 — subscribe affordance.** *Files: `src/pages/writing.astro`, `src/pages/index.astro`.*
- Both pages render a link pair to `/feed/feed.json` and `/feed/atom.xml`; the Substack CTA
  remains the primary action and keeps its position.
- No new dependency, no client JS. **Acceptance:** `npm run build` green; the built HTML
  contains both hrefs on both pages; a keyboard-only pass reaches them in document order.

**S4 — `feed-notice.mjs`, detectors only.** *Files: `scripts/feed-notice.mjs` (new),
`package.json` (`feed:notice` script).*
- F1–F5 implemented per §4.2, `--dry`/`--no-net`/`--json`, exit codes 0/10/1/2.
- Staging tree per §4.3, retention 14.
- `--dry` writes nothing anywhere: `.feed-notice` tree and vault mtimes unchanged.
- **Acceptance:** against today's vault, a real run reports `kb_drift` for at least
  `kb-pipelines-publication-layer` (its published copy still says "content pipeline v2
  pending", superseded 2026-10-29) and `unrecorded_surface` for the Bluesky URL in the
  existing log note — with zero `unlogged_publication` findings, because the one Substack
  post in the horizon is already logged, and zero findings for the YouTube link in that same
  note (the log says explicitly it is not a surface of the article).

**S5 — delivery.** *Files: `scripts/feed-notice.mjs`.*
- One card per day, `feed-notice-<YYYY-MM-DD>`, assignee `content`, priority 40, body =
  `report.md`, via `HERMES_BIN` with an assignee-existence guard that warns loudly instead of
  writing to a phantom profile.
- Failure to write a card keeps exit 10 and leaves the finding staged.
- **Acceptance:** two runs in a row on the same day produce one card (idempotency key); a run
  with `FEED_NOTICE_ASSIGNEE=bogus` prints the guard warning and still stages.

**S6 — tests.** *Files: `scripts/feed-notice.test.mjs` (new).*
- Fixture vaults in a temp dir (no network in tests): one with a new RSS post absent from the
  log, one with a post already logged under a differently-normalised URL, one with a KB page
  changed vs. its committed digest, one with a prose-only platform URL, one with a
  `confidential: ghn` page that must never appear.
- **Acceptance:** `npx vitest run` green; the suite asserts (a) exactly one finding per
  fixture case, (b) zero writes outside the temp staging dir, (c) `Social/Published` mtime and
  file count unchanged after a run.

**S7 — scheduling.** *Files: `~/Library/LaunchAgents/com.jones-co.mikejones-feed-notice.plist`.*
- `launchctl load` succeeds; `launchctl list | grep mikejones-feed-notice` shows it; a manual
  `launchctl start` writes the log files and exits 0 or 10.
- **Acceptance:** before scheduling, run once from Terminal (which holds the disk-access
  grant) and confirm the vault read works; if launchd's run logs `EPERM`, stop and report
  rather than chasing it — TCC grants are Mike's to give.

**S8 — documentation.** *Files: `site/DEPLOY.md`, the commit message.*
- `site/DEPLOY.md` gains a paragraph: feed and agents are two generators writing into
  `public/`, they must be committed together or not at all, and `npm run feed:notice` is the
  detector (never wired into the build).
- The commit message names the one spec line this plan overrides (P1 acceptance) and why, and
  whoever ships appends the claim delta to `KB/log.md` per the Write-Access Policy — the
  notice loop itself never writes the vault.
- **Acceptance:** a reviewer reading only `DEPLOY.md` knows the two generators are coupled
  and where the detector runs from.

---

## 8. Risks, named

- **`js-yaml` is an undeclared import.** `feed-build.mjs` imports it; `package.json` doesn't
  declare it; it resolves because `astro` depends on it (4.2.0, hoisted). P1 adds no new
  fragility here — but if an astro upgrade drops it, both generators break at once. Do not
  touch the manifest for this (the constraint is no new dependencies, and a lockfile bump to
  declare an already-present transitive is a build-artifact change for no capability). If it
  ever breaks, the fix is one line in `dependencies`.
- **Two generators, one `public/`.** A partial `git add` leaves artifacts that disagree —
  observed today: the committed feed's `index.json` reports `kb.last_modified`
  2026-10-30T19:09 while the committed KB export was generated 2026-10-28T17:12. S8's DEPLOY
  note plus F4's dirty-tree check are the whole mitigation.
- **Prose parsing (F2) can miss.** A surface recorded without a link (or on a host not in the
  allowlist) is invisible. Accepted: the failure mode is a missed suggestion, never a wrong
  claim, and the alternative — asking Mike to maintain structured data by hand — is what the
  schema already tried and lost.
- **Substack RSS shape.** F5 covers fetch failure and zero items; a silently reshaped feed
  that still parses as XML but loses `pubDate` would drop items and look like silence. S6
  includes a fixture asserting the report always states the fetched item count.
- **`date_published` from RSS is Substack's, not Mike's log date.** F1 compares dates only
  against `NOTICE_SINCE`; identity matching is URL/title, never date. Keep it that way.

## 9. Judgment calls taken where the spec was silent

D1–D4 above, plus: the `NOTICE_SINCE` horizon (spec silent, `Published/README` rule 5
decides it); digest-of-projection rather than of bytes (§4.2 F3); publishing
`digest.json` as a small new public artifact rather than keeping a private baseline
(a cloned branch must be able to reproduce the detector's view); KB change = notice and
rebuild recommendation, **not** an auto-proposed feed item (a fact page is not a post; "one
item = one post" is the item model's spine); one daily digest card to `content` rather than a
card per finding; `/feed/public/` as an alias; `agents` declared but not emitted; gated
`item_count` published while gated feeds are withheld; `youtube.com` excluded from the
platform allowlist; `_mj.source` withheld; launchd rather than a Hermes cron job (the machine's
own content jobs are LaunchAgents, and a scheduled detector is infrastructure, not
conversation); 14-directory staging retention; and the manual copy step for proposals, with
no `--apply` helper until volume proves the need.

## 10. Sources

- `agent-feed-system/docs/spec/v1-publisher.md` — the spec this plan implements.
- `site/scripts/feed-build.mjs`, `site/scripts/feed-build.test.mjs` — P0 as built.
- `site/scripts/kb-to-agents.mjs` — the exporter S1 extends.
- `site/src/layouts/Base.astro`, `site/src/pages/writing.astro`, `site/astro.config.mjs`.
- `KB/pipelines/publication-layer.md` — the gate; `Social/README.md`,
  `Social/Published/README.md` — the log's schema and rule 5; `Social/Published/2026-10-29-agentic-web-owning-discovery.md` — the one record.
- `Operations/Write-Access Policy.md` — `Social/` is stage-only; who owns what.
- `Operations/content-pipeline.md` — the human steps this loop exists to stop losing.
- `~/Dev/resilient-tomorrow-site/scripts/bill-watch/bill-watch.mjs` — the proven
  card-writing and assignee-guard pattern.
