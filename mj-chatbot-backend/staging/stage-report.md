# KB → RAG staged diff — for Mike's approval

Generated: 2026-10-02T18:07:40.173Z
Command: `node scripts/kb-to-rag.mjs --stage` (in `mj-chatbot-backend`)

## What this is

Pilot leg of the publication layer ([[publication-layer]]): the Obsidian KB
(`/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space/KB`) is read **directly** — no content duplication — and chunked into
the distill RAG JSONL schema that `mj-chatbot-backend` ingests
(`knowledge.jsonl` → `node src/knowledge-loader.js` → `src/knowledge-data.js`).
The live bot chain (mikejones.online → distill-chatbot-widget.js →
mj-chatbot-backend Worker) picks the new knowledge up on the next backend
deploy — **which has NOT happened**. Nothing live was modified.

## Stats

- Live entries today: **202** (last generated 2026-06-26)
- Staged entries from KB: **49**
- Types: {"narrative":49}
- Confidential pages excluded entirely: business/ghn-partnership.md (ghn), people/coach-ron.md (ghn), people/david-levy.md (internal)
- Confidential lines redacted inside public pages: **16** (see staging/stage-report.md appendix)
- KB bookkeeping excluded: SCHEMA.md, index.md, log.md, frontmatter, Sources/History sections, blockquotes

## Per-page

- ai/how-mike-works.md — 3 entries
- business/distills.md — 5 entries
- business/ghn-partnership.md — EXCLUDED (confidential: ghn)
- business/resilient-tomorrow.md — 6 entries
- business/velocity-partners.md — 4 entries
- company/jonesco.md — 5 entries
- concepts/ccar-f-certification.md — 4 entries
- concepts/north-star.md — 2 entries
- people/coach-ron.md — EXCLUDED (confidential: ghn)
- people/david-levy.md — EXCLUDED (confidential: internal)
- pipelines/generator-registry.md — 4 entries
- pipelines/publication-layer.md — 8 entries
- pipelines/rt-content-pipeline.md — 4 entries
- pipelines/task-system.md — 4 entries

## Redacted lines (confidential markers inside public pages)

Counts per page only — the lines themselves are dropped from the RAG and
deliberately NOT reproduced here (this repo is public; the report must not
re-import confidential text).

- `business/distills.md`: 1 line(s) redacted
- `business/velocity-partners.md`: 3 line(s) redacted
- `company/jonesco.md`: 2 line(s) redacted
- `concepts/ccar-f-certification.md`: 1 line(s) redacted
- `pipelines/publication-layer.md`: 9 line(s) redacted

## After you approve

```bash
cd ~/dev/MJ_Online/mj-chatbot-backend
cp staging/knowledge.jsonl knowledge.jsonl
cp staging/knowledge-data.js src/knowledge-data.js
npm run build        # regenerates src/knowledge-data.js from knowledge.jsonl
npm run deploy       # separate human step — deploys the Worker
```

Verify any time (no side effects): `node scripts/verify-staged.cjs` — loads the
staged module through the live retrieval engine and re-runs the retrieval
smoke test.

## Sample entries

### kb-ai-how-mike-works-1
{
  "id": "kb-ai-how-mike-works-1",
  "type": "narrative",
  "topic": "concept",
  "project": null,
  "title": "How Mike Works",
  "content": "How Mike Works How to collaborate with Mike (for any agent or collaborator): Direct, peer-level, opinionated. Say \"I'm not sure\" over a confident wrong answer. Disagree when warranted — he wants decisions made, not options surfaced. Systems thinker: frameworks and pipelines. One deciding factor beats a pros/cons list. Agents are teammates: named, with memory and continuity. Naming convention: {Task-Description}-{Number}, e.g. Manifesto-Draft-#15 — never opaque \"Agent #15\". Mistakes are learning opportunities; explain what broke before fixing. ADD-friendly session rules apply (hot spot at open, stubby list ≤3, capture don't hold, session close = state saved): see the add-friendly-core skill and ~/dev/add-friendly-agent/.",
  "confidence": "verified",
  "source": "KB/ai/how-mike-works.md",
  "tags": [
    "concept",
    "How Mike Works",
    "kb"
  ]
}

### kb-ai-how-mike-works-2
{
  "id": "kb-ai-how-mike-works-2",
  "type": "narrative",
  "topic": "concept",
  "project": null,
  "title": "Standing Conventions",
  "content": "PROJECT-MEMORY.json at each project root (Claude Code convention) — decisions with rationale, phases, changelog. TASKS.md alongside. Cross-project decision ledger: /Volumes/MacMini_Extended/llm-memory/memory.jsonl (append via the ledger tool, never direct writes). Voice reference for drafting Mike's prose: ~/.openclaw/workspace/Corvus/Voice/mike-voice.md",
  "confidence": "verified",
  "source": "KB/ai/how-mike-works.md",
  "tags": [
    "standing",
    "conventions",
    "concept",
    "How Mike Works",
    "kb"
  ]
}

### kb-ai-how-mike-works-3
{
  "id": "kb-ai-how-mike-works-3",
  "type": "narrative",
  "topic": "concept",
  "project": null,
  "title": "What This Page Is For",
  "content": "Any AI serving Mike across businesses should internalize this page first, then north-star for direction, then the business pages for context — starting from jonesco, the parent entity. This is also the template for the per-client \"how this client works\" page in the consulting product — every engagement starts by writing one.",
  "confidence": "verified",
  "source": "KB/ai/how-mike-works.md",
  "tags": [
    "what",
    "this",
    "page",
    "for",
    "concept",
    "How Mike Works",
    "kb"
  ]
}

---
Full machine diff: `staging/staged.diff`. This report is the human-readable summary.
