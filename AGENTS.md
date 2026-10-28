# AGENTS.md — MJ_Online (MikeJones.online)

Portable rules for any agent working in this repo (Hermes, Claude Code, Codex, OpenCode).
Detailed state: `PROJECT-MEMORY.json`. Pre-2026-10-09 rules preserved at
`.claude/CLAUDE-pre-2026-10-09.md`.

## Current state
Personal site ("personal web view" — publishing + subscription). **In flight: migration
away from Ghost Pro to self-hosted static (Astro) on Cloudflare Pages.** Theme: Kyoto
(premium, in `kyoto/`). Chatbot deployed via jsDelivr. Domain: MikeJones.online.
Do NOT build new surfaces on the Ghost API — the platform is being replaced.

## RAG knowledge base — SOURCE OF TRUTH (still applies)
All content about Mike, his career, and his projects comes from the RAG KB:
- Data: `Cowork/content/rag/knowledge.jsonl` (schema: `Cowork/content/rag/RAG_SCHEMA.md`)
- ALWAYS verify facts against the RAG before writing any page content, meta tags,
  taglines, case studies, or anything displaying Mike's information.
- Never guess/infer facts not in the RAG; on conflict, the RAG wins; if the RAG
  conflicts with itself, stop and ask Mike. Cite RAG entry IDs when documenting.

## Terminology (validated 2026-01, re-check date on reuse)
- Title: "AI Implementation Expert and LLM Integration Specialist" — never
  "AI/ML Engineer" or "ML Researcher".
- "29 years in tech" (started 1997). Xbox + 360 launch teams, VINCE/Xbox SDK patent,
  director roles: Kabam, Livescribe, Kinoo, co-founder 8 Circuit Studios.
- Entities: **Jones Collaboration Company LLC** (parent) · **Velocity Partners**
  (consulting, AAPD) · **Resilient Tomorrow** (Substack) · **OfflineAI** (AI Memory
  System, Local LLM Setup) · **NeighborhoodShare** (tool-sharing platform).

## Conventions
- Python where possible; no single-letter variable names; venv only, never conda.
- Integration tests prioritized over heavily mocked unit tests; test at boundaries.
- Requirements and plans go in `/plans`; devlog entries in `/devlog/<feature>/`.
- NEVER comment out existing features to "simplify for now"; preserve all existing
  features while adding new ones.
- Git: don't auto-commit — wait for Mike's review. Background long-running dev servers.
- Legacy NATS/JetStream coordination (`agent_coordination/`) was a January-era
  experiment — not standing policy; don't adopt it for new work.

## Open work (2026-10-09)
- Ghost → Astro/Cloudflare Pages migration.
- GHN course-interest ballot re-run (first tally 2026-08-24: only 2 real responses).