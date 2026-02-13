# Phase 3.0.4 - Resume Page - Workflow Status

**Date Started:** 2026-02-09
**Date Completed:** 2026-02-09 (same day)
**Coordinator:** Morgan (Project Manager)
**Status:** ✅ COMPLETE - All 4 steps finished, Resume page live

---

## Workflow Steps

```
Debbie → Alice → Doc Brown → Alice
  ✅       ✅        ✅          ✅
```

---

## Overview

Phase 3.0.4 applies the validated workflow from Phase 3.0.3 (About page) to create and publish the Resume page. This is the second page using the new Design System → HTML → Ghost API workflow.

**Validated Workflow:**
1. Debbie creates PAGE_SPEC following design system
2. Alice uploads images (if needed) via Ghost API
3. Doc Brown converts PAGE_SPEC → semantic HTML
4. Alice publishes HTML via Ghost Admin API with `source=html` parameter

---

## Step 1: Create PAGE_SPEC for Resume ⏳ IN PROGRESS

**Agent:** Debbie (Web Design Agent)
**Task ID:** #1
**Status:** ⏳ IN PROGRESS (Started 2026-02-09)

**Inputs:**
- ✅ Design system at `/design/DESIGN-SYSTEM.md`
- ✅ RAG knowledge base at `/Cowork/content/rag/knowledge.jsonl`
- ✅ About page PAGE_SPEC as reference at `/design/PAGE_SPEC-About.md`

**Requirements:**
- Professional title: "AI Implementation Expert and LLM Integration Specialist"
- 29 years experience (started 1997 at Aviation Supplies & Academics)
- Career timeline: Microsoft Xbox (1999-2007) → Kabam → Livescribe → Kinoo → 8 Circuit Studios
- Key achievements: 80% delivery improvement, 3x efficiency gains, managed teams 50-120+, budgets $4M-$12M+
- Skills: AI implementation, LLM integration, Context Engineering, AAPD methodology
- All facts verified against RAG

**Deliverable:**
- PAGE_SPEC document at `/design/PAGE_SPEC-Resume.md`
- Structured sections with content blocks
- Allowed Ghost cards specified
- Image requirements (if any)

**Deliver To:** Alice (image uploads) or Doc Brown (HTML assembly if no images needed)

---

## Step 2: Upload Images ⚪ WAITING (Blocked by Task #1)

**Agent:** Alice (Web Content Builder)
**Task ID:** #2
**Status:** ⚪ WAITING FOR TASK #1

**Dependencies:**
- Blocked by: Task #1 (PAGE_SPEC must be complete first)

**Process:**
1. Read image requirements from PAGE_SPEC
2. Upload images via Ghost Admin API
3. Collect Ghost-hosted URLs
4. Create handoff document for Doc Brown

**Available Assets:**
- Professional headshot already uploaded: https://www.mikejones.online/content/images/2026/02/headshot-professional.png

**Deliver To:** Doc Brown (HTML assembly)

---

## Step 3: Convert to HTML ⚪ WAITING (Blocked by Task #2)

**Agent:** Doc Brown (HTML Assembler)
**Task ID:** #3
**Status:** ⚪ WAITING FOR TASK #2

**Dependencies:**
- Blocked by: Task #2 (Image URLs needed before HTML assembly)

**Process:**
1. Read PAGE_SPEC from Debbie
2. Read image URLs from Alice (if any)
3. Convert to clean semantic HTML
4. Save to `/content-drafts/resume-page.html`

**Quality Requirements:**
- ✅ Syntactically valid HTML
- ✅ Proper heading hierarchy (H1 → H2)
- ✅ All images with src and alt
- ✅ Content matches PAGE_SPEC exactly
- ✅ No inline CSS or scripts

**Deliver To:** Alice (publishing)

---

## Step 4: Publish to Ghost ⚪ WAITING (Blocked by Task #3)

**Agent:** Alice (Web Content Builder)
**Task ID:** #4
**Status:** ⚪ WAITING FOR TASK #3

**Dependencies:**
- Blocked by: Task #3 (HTML must be ready before publishing)

**Process:**
1. Read HTML from `/content-drafts/resume-page.html`
2. Generate JWT token from `.env` credentials
3. Check if Resume page exists (slug: /resume/)
4. Publish via Ghost Admin API with `source=html` parameter
5. Verify page is live

**API Details:**
- Endpoint: `https://mikejones-online.ghost.io/ghost/api/admin/pages/?source=html`
- Method: POST (create) or PUT (update)
- Auth: JWT token from GHOST_ADMIN_API_KEY

**Deliverable:**
- Live Resume page at https://www.mikejones.online/resume/
- Completion report for Phase 3.0.4

**Deliver To:** Mike (for review)

---

## Success Criteria

This phase validates the workflow can be repeated for multiple pages:

- ✅ Resume page published at https://www.mikejones.online/resume/
- ✅ All facts verified against RAG knowledge base
- ✅ Content matches design system aesthetic
- ✅ Professional quality CV page showcasing 29-year career
- ✅ Workflow completed smoothly with clear agent handoffs
- ✅ Process documented for future pages (Projects, Homepage)

---

## Coordination Protocol

**Task Tracking:**
- Task IDs: #1, #2, #3, #4
- Dependencies configured (sequential workflow)
- Current owner: Debbie (Task #1)

**Agent Communication:**
- NATS coordination channel: `mjwork.coordination`
- Dashboard: http://localhost:8001
- Agents send status updates when completing tasks
- Morgan monitors progress and unblocks dependencies

---

## Questions or Blockers?

**Debbie:** If you have questions about Resume content or structure, consult:
1. RAG knowledge base first
2. About page PAGE_SPEC as reference
3. Morgan via NATS coordination channel

**All agents:** Send coordination messages when:
- Task completed and ready for handoff
- Blocked or need clarification
- Found issues requiring attention

---

## Timeline

**Started:** 2026-02-09 (PM session)
**Estimated Duration:** 3-4 hours total
**Expected Completion:** Same day or next session

---

**Last Updated:** 2026-02-09 (PM - Workflow initiated, Debbie assigned Task #1)
