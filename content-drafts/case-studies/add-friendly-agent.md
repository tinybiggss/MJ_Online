# ADD-Friendly Agent: Turning a Book Into an Agent Protocol

**Case study for Anthropic Senior Product Designer, Growth**
**Author:** Mike Jones

---

## The problem

The book is *ADD-Friendly Ways to Organize Your Life* (Kolberg and Nadeau, Routledge 2017, 2nd edition). Its thesis is that strategies fail without structure and support around them, so it delivers a framework, not a tip list. I have ADHD. I read it, liked it, and did not use any of it.

That is the whole problem, and it is the one a growth team will recognize the moment I say it plainly. The strategies are correct and they do not survive contact with a bad week. Advice that depends on remembering to apply it is advice for a brain that is not the one asking.

The book's own answer points at the gap. If a strategy needs structure and support, and the person needs externalized memory, then the scaffolding is software. I built the scaffolding first and the book second. The book is source material; the agent is the delivery.

## What was actually blocking use

I built a 31-protocol catalog in `PROTOCOLS.md`, each entry carrying a source citation, the agent behavior it requires, an enforcement mechanism, and a support level (21 SELF, 9 ASSISTED, 1 HUMAN). Then I wired it to a nightly cron and a Sunday cron. Four weeks later I can say where it failed, and no failure was in the protocol text.

**The ritual held. The handoff did not.** On 2026-10-04 my weekly review recorded 0 completions in 10 straight days, with the same 3 items restarted as "tomorrow's first action" nightly. The one row carrying `staged=#11` is a P3, so its counter was informational. The system worked perfectly and produced nothing. Staging is agent-side. Starting is human-side, and a note in a file is not a hard block.

**Capture happened in the wrong place.** The commitments ledger was created 2026-09-24 and stayed header-only for 27 days. The 10-11 and 10-18 reviews both had to hand-name 3, then 4 to 5, real commitments living unlogged in master-list notes and card titles. The protocol existed. The capture path did not.

**The weekly review proposed repairs instead of making them.** The 10-18 review says it plainly: the D1 auto-log repair was designed on 10-11, proposed again on 10-18, and sat pending ratify for 7 days. The finding is three weeks old and still unshipped.

**The write path silently corrupted numbers.** Dollar figures collapsed three times, on 10-03 and twice on 10-16, each arriving as `9→49` where the real figure was `$99→$149`. The shell ate the `$` and the number behind it.

**And one ritual did not survive a bad night.** The 2026-10-22 shutdown run ended with the agent reporting it had stopped retrying after five `read_file` attempts with no progress. `hot-spot.md` records Wed and Thu rotation nights missed, and Friday 10-23's first three were restaged by hand at 09:45.

## What I designed

The agent is the external memory and the structure; the rituals are where the habits live.

**Session open.** Read the hot spot (max 5 items, any live deadline under 24 hours) and lead with it if not empty. Then present a stubby list of at most 3 items, never the backlog. The master list is the backlog; the stubby list is the session.

**Capture, do not hold.** Anything I mention mid-task gets one line into `master-list.csv` and a "captured" acknowledgment.

**The 21:00 shutdown.** State saved, hot spot rotated, master list updated, tomorrow's first three staged, one factual line in `log.md`. The protocol calls it the restaurant-server close: a server never leaves the mess.

**The 18:00 Sunday review.** Ledger, ripening sweep, 5-minute queue restock, factual wins, and exactly one system repair proposed. The cap is deliberate: a review that returns findings is a report, and reports change nothing.

**The hard block.** The fix for chronic re-staging was a move counter: each nightly re-stage increments `staged=#N` on the master row, and at N of 3 or more on a P1 the item is promoted into the morning first-three. The 10-11 review records it working: a punch list hit staged-3 and was promoted at the 10-10 shutdown.

**The write transport.** Every ledger write goes through `pipeline/ledger-write.py`, which stages exact text to a file and passes the path, so Python never expands `$`. It takes an exclusive lock, re-reads under the lock, backs up, writes byte-exact, reads the file back and compares bytes, and on a verification failure exits 3 keeping the backup rather than blindly restoring over a concurrent writer's change. Its suite is 27 checks, passing.

**The agent protocol at the moment of failure.** This is the part I care about most for this role. A claim of completion is a premature stamp until proven otherwise. The shutdown probes the artifact where it actually lives (published URL, Sent folder, file on disk) and reopens the card with the probe attached. Two live catches produced that rule: the inbox sweep card, flipped resolved with no completion note while 16 loose notes remained, caught 10-19; and the Andromeda card, flipped blocked to resolved at 16:31 while the work was undone, caught 10-21. The system corrects its own optimism.

**And the fix that moved capture to the layer where the data already exists.** `pipeline/d1-auto-log.py` reads the master list, finds open rows that name me as owner of a decision or review, and appends one ledger row per owner-commitment with the "what leaves to make room" answer. It is idempotent, and the shutdown cron runs it as step 1b. The ledger went from 0 rows ever to 21 rows across 10-21 and 10-22: twenty-seven days of nothing, then two days of a working capture path, because the repair stopped asking me to log and started reading what I had written.

## What I'd change

The quarterly ritual never shipped, and it has never been run by hand either. Protocol D3 exists, `data/defaults.md` names it, and no quarterly job sits in `jobs.json`. Two of three rituals are live and the third is a line in a file. The honest reason is that I have not completed a quarter with this system yet, so I cannot tell you whether that ritual is worth scheduling or whether I invented it for a person who has not needed it.

The version skew is worth naming. The installed skill at `~/.hermes/skills/productivity/add-friendly-core/SKILL.md` is v0.9.0 and 394 lines. The repo copy at `skills/add-friendly-core/SKILL.md` is v0.1.0 and 55 lines. Seven role profiles carry v0.3.1, release carries v0.1.0. The executable truth lives in my home directory and the published artifact is a fossil. The protocol count disagrees with itself: `TASKS.md` and `PROJECT-MEMORY.json` still say 24 protocols, the catalog holds 31.

The 07:00 brief is where the stubby-list discipline breaks. The 2026-10-23 brief reported 40 open todo cards and planned 45 tasks worth 53h30m against a 3-hour Friday window, over by roughly 50 hours. The cap of 3 holds at session open and dissolves in the brief. If the brief is the activation surface, it needs that cap.

The 5-minute queue is worse. The 10-18 review trimmed it to 9 live picks under a cap of 10. The master list now carries the `5min` tag on 49 rows, 19 still open. A queue holding 19 open rows is a backlog wearing a label.

## Growth read

For a behavioral product the growth question is whether it survives the bad week, not whether people want it. I can answer the first with data and only guess at the second.

The rituals hold. The nightly shutdown produced 29 consecutive run outputs from 2026-09-24 through 2026-10-22, and `data/log.md` carries 36 dated entries across 28 distinct days with no gap. Four weekly reviews ran on 9-27, 10-04, 10-11, and 10-18, and those Sunday reviews found the zero-completion streak, the empty ledger, and the re-staging loop.

Where it breaks is the seam between the agent and the human, and the fix pattern repeats: move the action to the layer where the data already exists. The re-staging loop needed a counter on the row. The empty ledger needed an auto-log instead of a reminder. The $99 figure needed a transport instead of careful shell quoting. Three failures, one move: stop asking the human to carry it.

The expansion story is thinner and I would rather say so. The skill is installed in 8 Hermes role profiles, one per named agent (Spock on product, Norman on design, Daedalus on dev lead, Perkins on content, Alfred on finance, Don on marketing, Callimachus on ops, Scotty on release), all reading the same `data_dir`. That is a protocol that survives being handed to another agent. It is not a team of humans. The repo has 6 commits and no remote, and public packaging is open in `TASKS.md`. One user, eight agents, zero outside users.

What I would bring to a growth team is failure-path thinking. Anthropic's products are used on good days by most people and on bad days by some. The people on bad days are the ones standard onboarding optimizes away, and they are exactly the people whose adoption decides retention. A protocol that says "repair the system, not the person" and then holds itself to that at 21:00, unattended, with a byte-level write transport and a rule that reopens a card when the agent's optimism outran the evidence, is the shape of product I want.

## Sources

- `/Users/michaeljones/Dev/add-friendly-agent/PROTOCOLS.md` (31 protocols; 21 SELF, 9 ASSISTED, 1 HUMAN; A1 stubby list, A2 hot spot, A3 capture, A4 restaurant-server close, A5 first-decisions staging, D1 over-commitment exchange, D3 quarterly review, F1 sympathetic encourager, F2 three levels of support, F3 CHAOS escalation, F4 perfectionism reframe)
- `/Users/michaeljones/Dev/add-friendly-agent/README.md` (meta-framework, quickstart, source licensing, v0.1 scaffold status)
- `/Users/michaeljones/Dev/add-friendly-agent/TASKS.md` (24-protocol v0.1 line; open audiobook and public-packaging items; dollar-bug fix marked done)
- `/Users/michaeljones/Dev/add-friendly-agent/PROJECT-MEMORY.json` (DEC-001 to DEC-003; ARCH-001 and ARCH-002 with the three dollar recurrences; phase-3 public GitHub packaging still pending)
- `/Users/michaeljones/Dev/add-friendly-agent/data/log.md` (36 dated entries, 9-24 to 10-21; 10-04 chronic 10-day zero-completion finding; 10-09 overwrite losing 23 rows; 10-16 dollar recurrence; 10-19 and 10-21 premature stamps caught; 10-21 D1 auto-log shipped)
- `/Users/michaeljones/Dev/add-friendly-agent/data/weekly-review-2026-10-04.md` (A4 chronic, the move-counter repair, 5-minute queue first restock)
- `/Users/michaeljones/Dev/add-friendly-agent/data/weekly-review-2026-10-11.md` (ledger 0 rows 17 days after creation; the D1 auto-log repair proposed)
- `/Users/michaeljones/Dev/add-friendly-agent/data/weekly-review-2026-10-18.md` (4 to 5 unlogged commitments; repair pending ratify 7 days; "the proposals are now what's slipping")
- `/Users/michaeljones/Dev/add-friendly-agent/data/master-list.csv` (74 data rows: open 38, done 31, parked 5; `staged=#11` on the RT content pipeline row, a P3 the note marks counter-only; 49 rows carry the `5min` queue tag and 19 of those are still open)
- `/Users/michaeljones/Dev/add-friendly-agent/data/commitments-ledger.csv` (21 rows: 14 dated 10-21, 7 dated 10-22)
- `/Users/michaeljones/Dev/add-friendly-agent/data/hot-spot.md` (first three restaged Fri 10-23 09:45 after 10-22 cron blowups; 2 carried live; SMB send block on its 4th staging)
- `/Users/michaeljones/Dev/add-friendly-agent/pipeline/ledger-write.py` (transport contract, dollar-recurrence dates, flock and read-back rules) and `pipeline/test-dollar-fixtures.py` (27/27 checks pass, run 2026-10-23)
- `/Users/michaeljones/Dev/add-friendly-agent/pipeline/d1-auto-log.py` (owner-marker patterns, idempotency key, D1 rationale)
- `/Users/michaeljones/Dev/add-friendly-agent/integration/hermes.md` and `integration/claude-code.md` (install paths, ritual schedules, portable protocol block)
- `/Users/michaeljones/Dev/add-friendly-agent/data/defaults.md` (quarterly audit named here and unscheduled)
- `~/.hermes/cron/output/577137c655f2/` (29 ADD shutdown runs, 9-24 to 10-22; the 10-22 run that ended with the agent stopping after five `read_file` attempts)
- `~/.hermes/cron/output/9d75d55e3c75/` (4 weekly review runs: 9-27, 10-04, 10-11, 10-18)
- `~/.hermes/cron/jobs.json` (33 jobs, 2 named ADD rituals, the 21:00 shutdown and the 18:00 Sunday review; no quarterly job)
- `~/.hermes/cron/output/ab3f9d65b878/2026-10-23_07-10-17.md` (morning brief: 40 open todo, 45 tasks and 53h30m planned against a 3h window, over by about 50h30m)
- `~/.hermes/skills/productivity/add-friendly-core/SKILL.md` (v0.9.0, 394 lines, including the probe-and-reopen rule, the mandatory transport, and the canonical queue-tag enum) and `~/.hermes/profiles/*/skills/productivity/add-friendly-core/SKILL.md` (8 role profiles pointing at the same `data_dir`, 7 at v0.3.1 and release at v0.1.0)
- `/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/Operations/Briefings/2026-10-23-money-path-decision-sheet.md` (Friday restage after the missed rotation nights; 4th staging of the SMB send block; master list open 40 to 38)


## What I would measure next

1. Minutes per week the nightly ritual actually costs, and whether I read the three-line report when it arrives. I have 29 run outputs and no honest measure of the ritual's price, which is the one number that would tell me whether the design is affordable.
2. Time from commitment captured to commitment closed, now that the auto-log step writes ledger rows from the master list without asking me.
3. Any second user. There is no remote and no public listing, so the only adoption number that exists is one, and one is not adoption.

## Scope and status

- One user, eight agents, zero outside users. Confirmed, not assumed: nobody besides me has installed the skill, run a shutdown, or used `master-list.csv`, and the skill has never been published broadly.
- The repo stays private for now. Public packaging is an open checkbox in `TASKS.md`, and this case study does not claim a path to outside adoption that exists today.
- The quarterly audit has never run. I have not completed a quarter with this system, so it is a protocol in a file rather than a third live ritual, and the case study does not imply otherwise.

## Still open

- The 2026-10-22 shutdown failure. The run output shows the agent stopping after five `read_file` attempts with no progress and never states why the reads failed, so whether that becomes a retry-limit rule or a read-strategy rule is unresolved.
- Whether to publish the repo at all, which is the difference between a personal system and a product with a growth story.
