# MJ_Online Project Status

**Last Updated:** 2026-01-29
**Status:** Content Collection Complete, Ready for Page Drafting

---

## Quick Summary

Building mikejones.online - a personal website for Mike Jones featuring:
- Professional positioning (26+ years systems/PM experience)
- Project showcases (OfflineAI, NeighborhoodShare, Resilient Tomorrow)
- Consulting services (Jones Collaboration Company, LLC)

**Platform:** Ghost (hosted, already configured at mikejones.online)
**Next Step:** Draft page content and paste into Ghost

---

## What's Been Completed

### Content Collection ✅
- **70 RAG entries** in `content/rag/knowledge.jsonl`
- Origin story, career through-line, AI transition narrative
- AI Memory System case study content
- NeighborhoodShare case study content
- Resilient Tomorrow thesis + 7 Pillars framework
- 15 RT articles analyzed and key themes extracted
- Hero tagline finalized: **"I build systems that help people thrive"**

### Interviews Completed ✅
1. **About Page** - Origin story, through-line, values, AI transition
2. **AI Memory System** - Trigger, why JSONL, challenges, workflow impact
3. **Current Projects** - NeighborhoodShare, RT, Local LLM motivation

### Key Files Created
| File | Purpose |
|------|---------|
| `content/rag/knowledge.jsonl` | 70 RAG entries for website + chatbot |
| `content/content_map_v1.md` | Coverage matrix and gap analysis |
| `content/diagrams/*.mermaid` | Architecture diagrams (need revision) |
| `.claude/skills/mj-content-extractor/` | Claude Code skill for content extraction |

---

## What's Still Pending

### Content Gaps (Low Priority)
- [ ] Kabam stories - need full STAR details (currently outline-only)
- [ ] LiveScribe details - "Making Matt Awesome", B&R department
- [ ] Career timeline - specific dates for each role
- [ ] Mermaid diagrams - Mike wants different approach

### Ready to Execute
- [ ] **Draft Homepage content** for Ghost
- [ ] **Draft About Page** for Ghost
- [ ] **Draft Project pages** (OfflineAI, NeighborhoodShare, RT)
- [ ] **Integrate RAG chatbot** on website

---

## Site Structure (Proposed)

| Page | Content Ready? | Notes |
|------|---------------|-------|
| **Homepage** | ✅ 85% | Hero tagline done, need featured projects selection |
| **About** | ✅ 70% | Origin, through-line, AI transition captured |
| **Resume/CV** | ✅ 95% | Career stories, metrics, achievements |
| **Projects** | ✅ 80% | NeighborhoodShare, OfflineAI, RT all documented |
| **Writing/Blog** | ✅ | Links to RT Substack |
| **Contact** | ❌ | Need preferred contact method, consulting CTA |

---

## Key Content Assets

### Hero Tagline
> **"I build systems that help people thrive"**

### The Through-Line (26+ Years)
Creating better systems - from warehouse optimization to Xbox instrumentation (VINCE tool patent) to process transformation ($2M+ savings at Verizon) to AI infrastructure. Always people-centered: hearing problems, filling gaps, creating opportunities.

### Origin Story
- Age 10-14: Dreamed of making video games
- College: Political science (fascinated by systems, not politics)
- Early 90s: Learned networking to play multiplayer Doom
- First tech job: Aviation Supplies and Academics (tech support → QA)
- 1999: Microsoft Games Organization (dream job)

### AI Transition
- Top 1% ChatGPT users, top 3% for conversations
- AI helps make big ideas actionable, create "straight lines" others can follow
- Key insight: "It's all about context"
- 2.5 years deep into AI, building prototypes, "there was no stopping it"

### 7 Pillars Framework (Resilient Tomorrow)
1. Food Sovereignty
2. Energy Autonomy
3. Local Wealth Systems (Access > Money)
4. Knowledge Stewardship
5. Communication Independence
6. Mutual Aid
7. Hyperlocal Community

### Project Connections to 7 Pillars
- **NeighborhoodShare** → Pillars 3 & 7
- **OfflineAI / Memory System** → Pillars 4 & 5
- **Resilient Tomorrow** → The thesis tying it all together

---

## How to Continue This Work

### Option 1: New Claude Session
1. Read this file (`PROJECT_STATUS.md`)
2. Read `content/content_map_v1.md` for detailed gaps
3. Read `content/rag/knowledge.jsonl` for all content
4. Draft Ghost-ready content for specific pages

### Option 2: Claude Code Agent
1. Use the `mj-content-extractor` skill in `.claude/skills/`
2. Reference RAG entries for drafting
3. Output Markdown ready for Ghost

### Option 3: Mike Drafts Manually
1. Use RAG entries as source material
2. Copy/paste into Ghost editor
3. Format as needed

---

## Ghost Setup Notes

- **URL:** mikejones.online (resolves to Ghost)
- **Status:** Theme configured, backend done, YouTube connected
- **Ready for:** Content pasting
- **Format:** Ghost accepts Markdown or rich text

---

## RAG Knowledge Base Structure

The `knowledge.jsonl` file contains 70 entries with these types:
- `fact` - Verified facts (career dates, metrics, awards)
- `narrative` - Stories and case studies (VINCE tool, Verizon pipeline, etc.)
- `qa_pair` - Question/answer format for chatbot
- `technical` - Technical details (Kinoo stack, memory schema)
- `fit_assessment` - Client fit criteria

Topics covered:
- `career_history` - 26+ years of experience
- `about` - Origin story, values, through-line
- `project_ai_memory` - AI Memory System
- `project_local_llm` - Local LLM infrastructure
- `project_neighborhood_share` - NeighborhoodShare
- `project_resilient_tomorrow` - RT thesis, 7 Pillars, articles
- `homepage` - Hero tagline, positioning

---

## Contact

Mike Jones
- Email: mejones73@pm.me
- Business: Jones Collaboration Company, LLC
- Current tagline: "Consulting | Community | Creative Solutions"

---

*Generated 2026-01-29 by Claude during content extraction session*
