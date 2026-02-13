# Phase 3.0.6 - Homepage - Workflow Status

**Date Started:** 2026-02-09
**Coordinator:** Morgan (Project Manager)
**Status:** 🟡 IN PROGRESS - Task #1 assigned to Debbie

---

## Workflow Steps

```
Debbie → Alice → Doc Brown → Alice
  ⏳       ⚪        ⚪          ⚪
```

---

## Overview

Phase 3.0.6 applies the validated workflow to create and publish the Homepage - the most critical page for first impressions. This is the fourth and final core page using the Design System → HTML → Ghost API workflow.

**Priority:** CRITICAL - Homepage is the first thing visitors see

**Validated Workflow:**
1. Debbie creates PAGE_SPEC following design system
2. Alice uploads images (hero image, project thumbnails if needed)
3. Doc Brown converts PAGE_SPEC → semantic HTML
4. Alice publishes HTML via Ghost Admin API with `source=html` parameter

---

## Step 1: Create PAGE_SPEC for Homepage ⏳ IN PROGRESS

**Agent:** Debbie (Web Design Agent)
**Task ID:** #1
**Status:** ⏳ IN PROGRESS (Assigned 2026-02-09)

**Inputs:**
- ✅ Design system at `/design/DESIGN-SYSTEM.md`
- ✅ RAG knowledge base at `/Cowork/content/rag/knowledge.jsonl`
- ✅ Completed PAGE_SPECs as reference:
  - `/design/PAGE_SPEC-About.md` (25KB)
  - `/design/PAGE_SPEC-Resume.md` (22KB)
  - `/design/PAGE_SPEC-Projects-Landing.md` (27KB)

**Requirements:**
- Hero section with AI Implementation Expert positioning
- Professional tagline: "AI Implementation Expert and LLM Integration Specialist"
- Value proposition (1-2 sentences compelling)
- Featured projects section (links to case studies)
- About summary (link to full About page)
- Contact CTA (prominent and clear)
- Social proof / credentials highlight (top 1%, 29 years, etc.)
- Clear navigation to all site sections
- Mobile responsive design considerations

**Deliverable:**
- PAGE_SPEC document at `/design/PAGE_SPEC-Homepage.md`
- Structured sections with content blocks
- Allowed Ghost cards specified
- Image requirements (hero image, project thumbnails)
- Visual flow and hierarchy defined

**Deliver To:** Alice (image uploads) or Doc Brown (HTML assembly if no new images needed)

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
- Professional headshot: https://www.mikejones.online/content/images/2026/02/headshot-professional.png (can reuse)
- Check `/assets/` for hero images, project thumbnails

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
4. Save to `/content-drafts/homepage.html`

**Quality Requirements:**
- ✅ Syntactically valid HTML
- ✅ Proper heading hierarchy (H1 → H2)
- ✅ All images with src and alt
- ✅ Content matches PAGE_SPEC exactly
- ✅ No inline CSS or scripts (minimal layout only)
- ✅ Hero section structure clear
- ✅ CTAs prominent and functional

**Note:** Homepage is most complex page - hero section and featured projects may need special attention

**Deliver To:** Alice (publishing)

---

## Step 4: Publish to Ghost ⚪ WAITING (Blocked by Task #3)

**Agent:** Alice (Web Content Builder)
**Task ID:** #4
**Status:** ⚪ WAITING FOR TASK #3

**Dependencies:**
- Blocked by: Task #3 (HTML must be ready before publishing)

**CRITICAL:** This will UPDATE the existing homepage at https://www.mikejones.online/

**Process:**
1. Read HTML from `/content-drafts/homepage.html`
2. Generate JWT token from `.env` credentials
3. Check existing Homepage page (may need to update, not create)
4. Publish via Ghost Admin API with `source=html` parameter
5. Verify page is live and displays correctly
6. **Set as site homepage** in Ghost settings if needed

**API Details:**
- Endpoint: `https://mikejones-online.ghost.io/ghost/api/admin/pages/?source=html`
- Method: PUT (update existing) or POST (create new)
- Auth: JWT token from GHOST_ADMIN_API_KEY

**Deliverable:**
- Live Homepage at https://www.mikejones.online/
- Completion report for Phase 3.0.6

**Success Criteria:**
- ✅ Page published successfully (HTTP 200/201)
- ✅ Homepage displays correctly
- ✅ All facts RAG-verified
- ✅ Matches design system aesthetic
- ✅ Strong first impression for visitors
- ✅ Clear navigation to all site sections
- ✅ Mobile responsive
- ✅ Fast load time (<3 seconds)

**Deliver To:** Mike (for review and feedback)

---

## Success Criteria

This phase completes the core page workflow rollout:

- ✅ Homepage published at https://www.mikejones.online/
- ✅ Strong first impression aligned with AI expertise positioning
- ✅ Clear navigation to all site sections (About, Resume, Projects, Contact)
- ✅ Mobile responsive hero section
- ✅ Fast page load (<3 seconds)
- ✅ SEO optimized (title, description, structured data)
- ✅ All facts verified against RAG knowledge base
- ✅ Workflow completed smoothly (4th successful application)

**When complete:**
- All core pages published (Homepage, About, Resume, Projects)
- Design system validated across 4 pages
- Workflow proven reliable and repeatable
- Ready for next phase: content enhancements, case studies

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

**Doc Brown Status:**
- ✅ Running autonomously (PID 37535)
- ✅ Listening for HTML conversion tasks
- ✅ Will claim Task #3 when ready

---

## Questions or Blockers?

**Debbie:** If you have questions about Homepage content or structure, consult:
1. RAG knowledge base first
2. Completed PAGE_SPECs (About, Resume, Projects) as reference
3. Design system page-specific guidelines for Homepage
4. Morgan via NATS coordination channel

**All agents:** Send coordination messages when:
- Task completed and ready for handoff
- Blocked or need clarification
- Found issues requiring attention

---

## Timeline

**Started:** 2026-02-09 (PM session)
**Estimated Duration:** 4-5 hours total (most complex page)
**Expected Completion:** Same day or next session

---

## Phase 3 Progress

After Phase 3.0.6 completion:
- ✅ Phase 3.0.3: About Page
- ✅ Phase 3.0.4: Resume Page
- ✅ Phase 3.0.5: Projects Landing Page
- ⏳ Phase 3.0.6: Homepage (IN PROGRESS)

**Core Pages:** 4/4 (100% upon completion)

---

**Last Updated:** 2026-02-09 (PM - Workflow initiated, tasks created, Debbie assigned)
