# IMAGE REQUEST: AI Memory System Workflow Diagram

**Requested by:** Debbie (Web Design Agent)
**Date:** 2026-02-11
**For:** AI Memory System case study
**Status:** Requested - Awaiting creation

---

## Purpose

Visualize the cross-platform AI Memory System workflow showing how context persists across Claude MCP, ChatGPT, and local LLMs using a JSONL ledger format.

This diagram will help readers understand:
- How the memory system works across different AI platforms
- The JSONL ledger structure and flow
- Memory entry creation and retrieval process
- Cross-platform integration points

---

## Type

**Workflow Diagram / System Architecture Infographic**

A technical workflow diagram that shows data flow between components with clear visual hierarchy and process steps.

---

## Suggested Tool

**Primary Recommendation:** Mermaid.live
**Alternative:** Canva (if you want more polished/branded style)

**Mermaid.live** is ideal because:
- Perfect for technical workflow diagrams
- Clean, professional output
- Supports flowcharts with decision points
- Easy to edit and iterate
- Export to PNG/SVG

**If using Canva:** Use a "Process Flow" or "System Diagram" template

---

## Specifications

### Size
- **Recommended:** 1400x900px (wide landscape for detailed workflow)
- **Minimum:** 1200x800px
- **Format:** PNG (for web compatibility)

### Style
- **Background:** Dark (#0A0B0D - matches design system)
- **Visual Aesthetic:** Clean, minimal, technical
- **Line Style:** Solid connecting lines with arrows showing data flow
- **Node Style:** Rounded rectangles for components, sharp diamonds for decision points
- **Emphasis:** Use Neon Cyan (#00D9FF) for active data flows, Indigo (#4F46E5) for platforms

### Content

**Components to Show:**

1. **Three AI Platforms (top row):**
   - Claude Code (with MCP badge)
   - ChatGPT (OpenAI logo)
   - Local LLM (Ollama icon)

2. **Central JSONL Ledger:**
   - File icon labeled "memory.jsonl"
   - Show example entry structure: `{"id": "...", "type": "fact", "content": "..."}`

3. **Workflow Steps:**
   - **Write Operation:** Platform → Memory Entry → JSONL Ledger (append)
   - **Read Operation:** Platform → Query → JSONL Ledger → Retrieved Entries
   - **Cross-Platform Sync:** All three platforms accessing same ledger file

4. **Key Features (callout boxes):**
   - "Platform Agnostic" (JSONL works everywhere)
   - "Persistent Context" (survives session restarts)
   - "Top 1% User" (credibility badge)

**Data Flow:**
- Use arrows to show:
  - Writing memory entries
  - Reading/retrieving entries
  - Cross-platform access
- Color code flows: Neon Cyan for active operations, gray for dormant

**Labels:**
- Platform names clearly labeled
- "memory.jsonl" central file
- "Create Memory", "Retrieve Context" action labels
- "JSONL Format" callout

### Colors (Design System Aligned)

- **Background:** #0A0B0D (Black Pearl - dark base)
- **Primary Flow Lines:** #00D9FF (Neon Cyan - makes it POP)
- **Platform Boxes:** #1A1B1E (Surface Dark) with #4F46E5 (Indigo) borders
- **Text:** #FFFFFF (white) for labels, #A0AEC0 (light gray) for secondary text
- **Accent/Highlight:** #00D9FF (Neon Cyan) for active data flows
- **Callout Boxes:** #252629 (Surface Medium) with Indigo borders

### Typography

- **Headings/Labels:** JetBrains Mono (monospace for technical feel)
- **Body Text (if any):** Inter (clean, readable)
- **Font Sizes:**
  - Platform names: 18px bold
  - Action labels: 14px regular
  - Callouts: 12px

---

## Placement

**Where this diagram will go:**
- AI Memory System case study page
- Section: "How It Works" or "System Architecture"
- Position: After problem statement, before technical details
- Visibility: Above the fold on desktop (readers see it immediately)

**Purpose in context:**
- Gives readers immediate visual understanding before diving into text
- Shows technical sophistication (cross-platform integration)
- Demonstrates practical AI implementation expertise

---

## Example / Inspiration

**Visual Style:**
- Think "technical flowchart" meets "modern infographic"
- Similar to software architecture diagrams but with design system aesthetics
- Clean, minimal, professional (not overly decorative)

**Reference Examples:**
- Mermaid.live "Flowchart" examples (basic structure)
- GitHub README diagrams (clean technical style)
- API documentation workflow diagrams (clear data flow)

**Avoid:**
- Overly complex diagrams with too many elements
- Decorative elements that don't serve the workflow
- Inconsistent colors/styles outside design system

---

## Priority

**Medium-High**

This diagram enhances the AI Memory System case study significantly:
- ✅ Helps readers understand the technical architecture
- ✅ Demonstrates cross-platform integration expertise
- ✅ Makes abstract concept (memory system) concrete and visual
- ✅ Improves professional presentation of case study

**Not blocking launch** (case study can launch without it), but **highly recommended** for full impact.

**Suggested Timeline:**
- Nice-to-have before soft launch review
- Can be added post-launch if needed

---

## Deliverable

Once created:
1. **Export as PNG** (1400x900px or similar)
2. **Save to:** `/assets/projects/ai-memory/AI-Memory-Workflow-Diagram.png`
3. **Notify Debbie** - I'll add it to the AI Memory System case study via API
4. **Update:** I'll handle the Ghost upload and post update (same workflow as Tasks #1 and #2)

---

## Notes

**Why this diagram matters:**
- AI Memory System is a unique, differentiating project
- Visual explanation makes it more accessible to recruiters/CTOs
- Demonstrates system thinking and cross-platform integration skills
- Shows practical AI implementation (not just theory)

**Alternative if time-constrained:**
- Could use a simpler text-based workflow in the case study
- But visual diagram significantly enhances professional presentation

---

**Status:** ⏸️ Awaiting creation
**Next Step:** Mike creates diagram using Mermaid.live or Canva
**Then:** Debbie adds to case study via Ghost API (automated workflow)

---

**Debbie's Note:** I can add this diagram to the case study as soon as it's created! The workflow is proven (Tasks #1 and #2 both succeeded). Just save the PNG to `/assets/projects/ai-memory/` and I'll handle the rest autonomously. 🎨
