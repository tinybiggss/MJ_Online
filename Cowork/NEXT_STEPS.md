# MJ_Online - Next Steps

**Priority:** Draft Ghost-ready content for website pages

---

## Immediate Actions

### 1. Draft Homepage Content
Using RAG entries, create Ghost-ready content including:
- Hero section with tagline: "I build systems that help people thrive"
- Brief intro (2-3 sentences from through-line)
- Featured projects (3-4): OfflineAI, NeighborhoodShare, Resilient Tomorrow
- Consulting CTA

**Key RAG entries to reference:**
- `rag-2026-01-29-049` (hero tagline)
- `rag-2026-01-29-016` (through-line)
- `rag-2026-01-29-037` (unified vision)

### 2. Draft About Page
Sections needed:
- Origin story (childhood → political science → tech → Microsoft)
- The through-line (26+ years of creating better systems)
- AI transition (top 1% ChatGPT user, context is key)
- What I'm building now (7 Pillars projects)
- Values (people-centered, efficiency, making invisible visible)

**Key RAG entries to reference:**
- `rag-2026-01-29-015` (origin story)
- `rag-2026-01-29-016` (through-line)
- `rag-2026-01-29-017` (what drives Mike)
- `rag-2026-01-29-021` (AI transition)
- `rag-2026-01-29-019` (Insight Float - shows values)

### 3. Draft Project Pages

#### OfflineAI / AI Memory System
- What it is (cross-platform AI memory)
- Why built it (context loss frustration)
- How it works (JSONL, cross-AI compatibility)
- Challenges and lessons
- Connection to 7 Pillars (4 & 5)

**Key RAG entries:** `rag-2026-01-29-023` through `rag-2026-01-29-026`, `rag-2026-01-29-036`

#### NeighborhoodShare
- The angle grinder origin story
- How it works (AI categorization, SMS workflow)
- The bigger vision (mutual aid, 5-10 year outlook)
- Connection to 7 Pillars (3 & 7)

**Key RAG entries:** `rag-2026-01-29-027` through `rag-2026-01-29-029`

#### Resilient Tomorrow
- Thesis ("build parallel systems")
- 7 Pillars framework
- Key articles (with engagement metrics)
- Additional projects (Offramp Assistant, Community Defense Playbook, Solar)

**Key RAG entries:** `rag-2026-01-29-030` through `rag-2026-01-29-048`

---

## Lower Priority Actions

### Content Gaps to Fill (Interview Mike)
1. **Kabam stories** - Release process, beta testing, tech debt, central services (marked "<<<FLESH THIS OUT>>>" in source docs)
2. **LiveScribe stories** - "Making Matt Awesome", Build & Release department
3. **Career dates** - Specific years for each role

### Assets Needed
- [ ] Professional headshot
- [ ] Architecture diagrams (Mike wants different approach than Mermaid)
- [ ] Screenshots of systems in action

### RAG Chatbot Integration
Once pages exist, integrate knowledge.jsonl to power an "Ask me anything" chatbot on the site.

---

## File Locations

```
/Dev/MJ_Online/
├── PROJECT_STATUS.md      # Overall project status
├── NEXT_STEPS.md          # This file
├── content/
│   ├── content_map_v1.md  # Detailed coverage matrix
│   ├── rag/
│   │   ├── knowledge.jsonl    # 70 RAG entries
│   │   └── RAG_SCHEMA.md      # Schema documentation
│   └── diagrams/
│       └── *.mermaid          # Architecture diagrams (need revision)
└── .claude/
    └── skills/
        └── mj-content-extractor/  # Claude Code skill
```

---

## Ghost Publishing Workflow

1. Draft content as Markdown
2. Open Ghost admin (mikejones.online/ghost)
3. Create new page
4. Paste Markdown or use rich editor
5. Configure SEO, featured image
6. Publish

---

*Ready to execute - all source content is in the RAG*
