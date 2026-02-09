# Phase 3.0.3 - About Page Pilot Test - Workflow Status

**Last Updated:** 2026-02-09 21:06
**Coordinator:** Morgan (Project Manager)
**Status:** 🟡 IN PROGRESS - Step 4 of 4

---

## Workflow Steps

```
Debbie → Alice → Doc Brown → Alice
  ✅       ✅        ✅          ⏳
```

---

## Step 1: Design PAGE_SPEC ✅ COMPLETE

**Agent:** Debbie (Web Design Agent)
**Task:** Create PAGE_SPEC for About page using design system
**Status:** ✅ COMPLETE

**Deliverable:**
- PAGE_SPEC document (in Debbie's session)
- Design specifications following /design/DESIGN-SYSTEM.md
- Section layouts, content requirements, allowed Ghost cards
- Visual flow review and image requirements

**Delivered To:** Doc Brown (Mobiledoc Assembler)

---

## Step 2: Upload Images ✅ COMPLETE

**Agent:** Alice (Web Content Builder)
**Task:** Upload professional headshot to Ghost Pro
**Status:** ✅ COMPLETE (2026-02-09 20:17)

**Deliverable:**
- Ghost-hosted URL: `https://www.mikejones.online/content/images/2026/02/headshot-professional.png`
- Image verified accessible (HTTP 200)
- Size: 1.2MB PNG
- Source: `/assets/photos/headshot-professional.png`

**Delivered To:** Doc Brown (Mobiledoc Assembler)

---

## Step 3: Assemble Mobiledoc JSON ✅ COMPLETE

**Agent:** Doc Brown (Mobiledoc Assembler)
**Task:** Convert PAGE_SPEC into valid Mobiledoc JSON v0.3.2
**Status:** ✅ COMPLETE (2026-02-09 21:05)

**Inputs Available:**
1. **PAGE_SPEC from Debbie** (in Doc Brown's session)
2. **Ghost-hosted image URL from Alice:**
   - `https://www.mikejones.online/content/images/2026/02/headshot-professional.png`
3. **RAG knowledge base:** `/Cowork/content/rag/knowledge.jsonl` (for verification)
4. **Reference file:** `/PHASE-3.0.3-IMAGE-URLS.md`

**Deliverable Format:**
- Valid Mobiledoc JSON (v0.3.2)
- File location: `/content-drafts/about-page-mobiledoc.json`
- Ready to POST to Ghost Admin API

**Quality Requirements:**
- ✅ Mobiledoc version exactly "0.3.2"
- ✅ JSON syntactically valid
- ✅ All image cards have Ghost-hosted URLs (not local paths)
- ✅ Content matches PAGE_SPEC exactly (no additions/removals/modifications)
- ✅ Only allowed Ghost cards: heading, paragraph, image, markdown, html, button, divider, embed

**Deliver To:** Alice (for publishing via Admin API)

**How to Deliver:**
1. Save Mobiledoc JSON to `/content-drafts/about-page-mobiledoc.json`
2. Send coordination message: "Mobiledoc JSON ready for publishing at [file path]"
3. Notify Alice via NATS coordination channel

---

## Step 4: Publish to Ghost ⏳ READY TO START

**Agent:** Alice (Web Content Builder)
**Task:** Publish Mobiledoc JSON to Ghost Pro via Admin API
**Status:** ⏳ READY TO START (Doc Brown complete - Alice notified)

**Inputs Needed from Doc Brown:**
- Valid Mobiledoc JSON file
- File path location

**Task Details:**
- Method: POST to Ghost Admin API `/ghost/api/admin/pages/`
- Authentication: JWT token from `.env` (GHOST_ADMIN_API_KEY)
- Endpoint: `https://mikejones-online.ghost.io/ghost/api/admin/pages/`

**Deliverable:**
- Live About page at `https://mikejones.online/about`
- Page slug: `/about`
- Status: Published (not draft)

**Deliver To:** Mike (for review and feedback)

**How to Deliver:**
1. Publish page via Ghost Admin API
2. Verify page is accessible
3. Send coordination message with page URL
4. Report completion to NATS coordination channel

---

## Coordination Protocol

**All agents should:**
1. ✅ Monitor NATS coordination channel for updates
2. ✅ Send status updates when completing work
3. ✅ Ask questions via coordination channel if blocked
4. ✅ Report completion with deliverable details

**Morgan (PM) monitors:**
- Agent heartbeats and status
- Task completion messages
- Workflow handoffs
- Blockers or questions

---

## Questions or Blockers?

Send message to NATS coordination channel:
```
To: Morgan
Subject: [Your question/blocker]
```

Morgan will coordinate resolution with the team.

---

## Success Criteria

This pilot test validates:
- ✅ Design system creates consistent, professional pages
- ⏳ Mobiledoc JSON assembly from PAGE_SPEC works reliably
- ⏳ Image URLs are correctly referenced in Mobiledoc
- ⏳ API publishing is faster/more reliable than browser automation
- ⏳ Team coordination via NATS is effective

**When complete:**
- About page live and matches design intent
- Process documented for rollout to remaining pages (Phase 3.1+)
- Workflow questions answered (see `/plans/workflow-questions.md`)
