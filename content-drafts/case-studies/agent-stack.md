# The Agent Stack: A Personal AI System I Designed, Shipped, and Live In

> **Held. Not a portfolio case study.** This stays a system entry on `/work` and does not ship with the Anthropic portfolio, per the October 2026 decision to lead with NeighborhoodShare, Distills, and ADD-Friendly. The `## Needs from Mike` section below is internal and stays that way.


**Case study for Anthropic Senior Product Designer, Growth**
**Author:** Mike Jones

---

## The problem

By 2026 I was running several AI systems at once. Hermes, an always-on agent runtime. Claude Code for engineering work. Codex for a second opinion. Corvus, my long-running OpenClaw agent, mostly talking to me over Telegram. A local Ollama server running Qwen models on my own hardware. An Obsidian vault with ten thousand markdown files that held my tasks, my notes, and my writing.

Each of those was fine on its own. The problem lived between them.

I was the transport layer. When Claude Code finished something, I copy-pasted a note into Corvus by hand. When Corvus found something overnight, I carried it back the same way. Context did not carry between sessions or between models unless I carried it myself. When something needed a decision, I had to know that it existed, and I learned that by scrolling.

I wrote this down in June 2026, in a project scope doc for what became Mission Control: "I manage 6+ AI agents, 22+ cron jobs, and dozens of tasks across Telegram. The signal-to-noise ratio is brutal. I miss things I should respond to."

That was the honest framing. The real problem was that my tools had no memory of each other, and I had no surface that showed me what the fleet was doing while I was asleep.

## What was actually blocking use

Three things, in the order they actually bit.

**Memory was per-model and per-session.** Claude Code knew what Claude Code knew. Corvus knew what Corvus knew. Neither knew the other, and neither remembered yesterday. The fix I had already written, the JSONL ledger at `/Volumes/MacMini_Extended/llm-memory/memory.jsonl`, had a deeper problem: every agent was allowed to write to it in its own shape, which meant a silent bad write could poison the shared context for everyone. The ledger had grown to 390 lines across 2.3 MB, and nothing in it was trustworthy by default.

**Scheduled work was unverified.** I had 33 cron jobs in Hermes, 26 of them enabled. A job that reports success can still leave a broken artifact behind. Nothing checked the artifact. I learned to distrust my own scheduler, and a scheduler you distrust stops being useful.

**There was no operating surface.** Not a monitoring system, not a project tracker. A place that answered one question: what needs me right now, and what can run without me.

## What I designed

The stack is four pieces that I made hold together, not four products I assembled.

**A shared memory layer with a deterministic writer.** Agents supply semantics, never structure. `ledger_append.py` derives the reserved envelope, validates the payload, locks and fsyncs the append, and injects provenance. A write that does not validate does not land. The schema is fixed in `cross-mem/CLAUDE.md`, and 264 unit tests run against it. The nightly Dreaming pass at 03:00 PT is not summarization, it is pattern-finding over session evidence plus SHA-256-changed Obsidian documents, and it only counts as successful when the health check reports `pipeline_health: ok` against the pending manifest, the ledger, and the rendered note. The Phase 2b activation gate on July 20, 2026 required three consecutive green unattended runs before Codex and Claude Code were allowed to write at all. Today the ledger holds entries from Corvus, Claude Code, Codex, and Hermes, 222 session summaries and 120 consolidations, dated 2026-05-21 through 2026-10-21.

**A runtime with an org chart.** Hermes runs eight profiles, each with a role and a name: Alfred on finance, Perkins on content, Norman on design, Daedalus on dev lead, Don on marketing, Callimachus on ops, Spock on product, Scotty on release. Ownership lanes are explicit, money fields are approval-gated, and Spock is the product authority that Mike only escalates to when something is genuinely unanswerable. The morning brief is the daily bridge: it promotes up to five cards from the week file, runs the day planner against a real capacity file, and appends the feed section verbatim with a delivery-fidelity check that has to print `feed-fidelity: OK` before the brief sends. I built the daily brief to be the one artifact I read every morning, so I made it the place where the rest of the system reports in.

**A design constraint from my own brain.** Mission Control was scoped in June 2026 around one rule: never show more than three things at once. Three panels, a "Three Things" attention widget, a brain-dump box that turns free text into a card, and an activity feed that always shows failures and pending decisions while batching routine chatter into a digest. Phase 0 shipped as a lightweight command center on port 3333 over Tailscale, session monitoring against the OpenClaw gateway, SSE updates on a 2-second refresh. The full upstream application was cloned for reference, and its custom panels were never built. I chose adopt over build, and I did not finish the part I designed.

**Obsidian as the durable substrate.** 408 task cards, 163 AI session notes (88 of them consolidations), 131 weekly and daily plan files, a 22-file knowledge base. All task reads and writes go through one CLI, never direct file edits, and the weekly planning skill opens with the week rather than a list because I do not trust a backlog to represent what I actually care about this week.

## What I'd change

The dreaming output was the first thing I would fix. In August 2026 I wrote that it "looks like garbage" and that it was "actively eroding trust." Pattern-finding over thin sessions produces confident nonsense, and a system that confidently narrates is worse than no system. I would gate dreaming on evidence density and let it say nothing.

Second, the ledger still has no trimming. Entries older than 90 days are planned for `llm-memory/archive/`, and the archive directory is empty. A 390-line ledger is fine. A 40,000-line ledger is a pile of unstructured text, and retrieval quality collapses before volume becomes a problem anyone notices.

Third, I would kill the parts of the stack that never earned their keep. Agent Bus is a written design spec from July 17, 2026, a real analysis of the three different agent clocks, and it is still a spec. Specs I have not implemented are aspirations, and treating them as progress has cost me more than it saved.

Fourth, I have no idea whether the brief I read every morning is any good. I read it. I have never measured whether it changed a decision, and a system I only trust by habit is a system I will eventually stop opening.

## Growth read

The qualification I am applying for asks whether I have defined AI-powered workflows for myself or my team. I have, and the useful part is not the stack. It is the sequence.

I noticed a break. I designed the fix. I shipped it. I live in it daily. That loop has run roughly thirty times, and each pass produced the same class of artifact: a spec with a named owner, a build gate, an adversarial review, and a date.

The thing I would tell a growth team is this. The demand for agent products is not evenly distributed. It is concentrated in the people who already tried to make agents work and hit a wall. When a person builds their own stack, they discover which problems are structural and which are personal. The structural ones are the market. Here they were: memory that does not carry across models, scheduled work that does not verify itself, and an interface that shows everything instead of what matters.

The people who will need Anthropic's next product in eighteen months are the people currently writing their own glue and hitting the same three walls. I am one of them, and I can name the walls because I hit them. That is the demand signature, and I have been living inside it for a year.

## Sources

- `~/.hermes/cron/jobs.json` (33 jobs, 26 enabled) and `~/.hermes/config.yaml` (profile, model alias, dashboard, skill config)
- `~/.hermes/profiles/*/profile.yaml` (8 role profiles with named display names and ownership lanes)
- `~/.hermes/state.db` and `~/.hermes/profiles/*/state.db` (1,131 sessions across the default profile and the 8 role profiles; 52,152 messages in the default profile alone)
- `~/.hermes/kanban.db` (107 task rows, 104 done, 2 blocked, 1 archived)
- `~/.hermes/skills/` (225 SKILL.md files across 33 skill categories)
- `/Volumes/MacMini_Extended/llm-memory/memory.jsonl` (390 entries, 2.3 MB, dated 2026-05-21 to 2026-10-21; type and environment counts computed from the file)
- `~/Dev/cross-mem/CLAUDE.md` (ledger schema, writer contract, capture and Dreaming schedules, 02:45 PT and 03:00 PT)
- `~/Dev/cross-mem/PHASE-2B-REQUIREMENTS.md` and `~/Dev/cross-mem/phase-2b-activation-receipt.json` (July 20, 2026 activation after three green unattended runs)
- `~/Dev/cross-mem/tests/` (`python3 -m unittest discover -s tests`: 264 tests, OK)
- `~/Dev/agent-bus/docs/specs/2026-07-17-agent-bus-design.md` and `~/Dev/agent-bus/TASKS.md` (three-clock analysis, status still awaiting review)
- `~/Dev/agent-feed-system/README.md`, `AGENTS.md`, `TASKS.md`, `docs/spec/v0-spec.md` (design law, dual adversarial gate, T1 dogfood shipped 2026-10-21 07:00, python 290 and node 27 suites)
- `~/Dev/Obsidian/Mike_Thinking_Space/Projects/Mission-Control/PROJECT-SCOPE.md` (2026-06-09: 6+ agents, 22+ cron jobs, three panels, "never show more than 3 things at once")
- `~/Dev/Obsidian/Mike_Thinking_Space/Projects/Mission-Control/Phase0-Setup-Report.md` (port 3333, Tailscale auth, 197 sessions detected, 2-second SSE refresh)
- `~/Dev/Obsidian/Mike_Thinking_Space/Projects/Mission-Control` and `~/Dev/mission-control/docs/meisner-data-model.md` (adopted data model reference)
- `~/Dev/Obsidian/Mike_Thinking_Space/Operations/ADHD-Planning-Model.md` (2026-08-17: icebox, three-cycle surfacing rule, dreaming output eroding trust)
- `~/Dev/Obsidian/Mike_Thinking_Space/` (10,889 markdown files; Tasks 408 task cards; AI Sessions 163 notes with 88 consolidation notes; Week and Daily Plans 131 files; KB 22 files)
- `~/dev/add-friendly-agent/data/hot-spot.md` (max five items, first three staged nightly)
- `~/.openclaw/workspace/Corvus/Operations/model-tier-system.md` (2026-07-29: seven model aliases, measured 38 to 154 tok/s)
- `~/.openclaw/workspace/Corvus/Operations/Cron-Health/cron-health-log.jsonl` and `~/Dev/Obsidian/Mike_Thinking_Space/Projects/Local AI/Local AI server build.md` (2026-10-03 R9700 decision, qwen3.8:27b target)
- `http://100.82.70.37:11434/api/tags` and `ollama list` (live local models: qwen3.8:27b Q4_K_M, 262144 context; qwen2.5:14b and qwen3.5:27b on the local box)
- `~/Dev/MJ_Online/site/src/lib/content.ts` (29 years since 1997, 120+ largest team, $12M+ budgets, 6 AAA launches, Xbox SDK patent, Top 1% ChatGPT user, CCAR-F issued 2026-08-28)
- `~/Dev/MJ_Online/content-drafts/ai-memory-system-case-study.md` and `~/Dev/MJ_Online/content-drafts/local-llm-setup-case-study.md` (earlier case studies in this set)

## Needs from Mike

1. Time saved per day. I have no measurement of what the stack saves me. I can describe the workflow, not the delta. Roughly what did the old manual copy-paste-and-scroll process cost per day before the ledger and the brief?
2. Is the morning brief actually changing decisions? I never instrumented whether the brief I read every morning changed what I did that day, versus being a ritual I would notice the absence of. Any recollection of a specific day the brief changed a decision would be worth more than a number.
3. How many people have used this stack. The honest answer today is one. If any GHN cohort member, a Velocity Partners client, or a fellow coach has run the ledger, the task CLI, or the brief, how many, and what did they stop doing because of it?
4. Did anyone else hit the same three walls independently? The growth argument depends on the walls being structural rather than personal. Have students or clients described the same breaks (no cross-model memory, unverified scheduled work, no attention surface) in their own words?
5. What the ledger is worth. 390 entries over five months, with the archive still empty. Is the shared context something I would be genuinely angry to lose, or something I have not tested losing yet?
6. Agent Bus. Did I ever decide to build it, or was the spec the honest end of that thread? I want to describe the design thinking as design thinking rather than as an unfinished project, and the honest framing depends on which one it is.
7. The custom Mission Control panels. Was the decision to stop at a command center a deliberate scope call I would make again, or drift I should name as drift? The case study as written calls it adopt over build and I would rather say the true thing.
8. The three names a hiring manager should hear. I have led teams of 120+ and shipped on Xbox and Xbox 360, but the case study deliberately stays on the stack. Which specific colleague or artifact would be the strongest evidence that these workflows hold up outside my own head?
