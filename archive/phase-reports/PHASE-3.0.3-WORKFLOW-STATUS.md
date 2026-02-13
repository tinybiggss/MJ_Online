# Phase 3.0.3 - About Page Pilot Test - Workflow Status

**Last Updated:** 2026-02-09 (COMPLETE)
**Coordinator:** Morgan (Project Manager)
**Status:** ✅ COMPLETE - All 4 steps finished, page live

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

## Step 3: Assemble HTML ✅ COMPLETE (UPDATED FORMAT)

**Agent:** Doc Brown (HTML Assembler - formerly Mobiledoc Assembler)
**Task:** Convert PAGE_SPEC into clean semantic HTML
**Status:** ✅ COMPLETE (2026-02-09 22:05)

**⚠️ FORMAT CHANGE:** Ghost uses Lexical format, not Mobiledoc. Workflow updated to use HTML with `source=html` parameter. Ghost automatically converts HTML → Lexical.

**Inputs Used:**
1. **PAGE_SPEC from Debbie:** `/design/PAGE_SPEC-About.md` (25KB)
2. **Ghost-hosted image URL from Alice:**
   - `https://www.mikejones.online/content/images/2026/02/headshot-professional.png`
3. **RAG knowledge base:** `/Cowork/content/rag/knowledge.jsonl` (for verification)
4. **Reference file:** `/PHASE-3.0.3-IMAGE-URLS.md`

**Deliverable Format:**
- Clean semantic HTML (NOT Mobiledoc JSON)
- File location: `/content-drafts/about-page.html`
- Size: 6.6KB
- Ready to POST to Ghost Admin API with `source=html` parameter

**Quality Requirements:**
- ✅ HTML syntactically valid
- ✅ Proper heading hierarchy (H1 → H2)
- ✅ All images have src (Ghost URLs) and alt attributes
- ✅ Content matches PAGE_SPEC exactly (9 sections translated)
- ✅ Semantic HTML only: h1, h2, p, img, ul, li, strong
- ✅ No inline CSS or scripts

**Deliver To:** Alice (for publishing via Admin API with source=html)

**How to Deliver:**
1. Save HTML to `/content-drafts/about-page.html`
2. Send coordination message: "HTML ready for publishing at [file path]"
3. Notify Alice via NATS coordination channel

---

## Step 4: Publish to Ghost ✅ COMPLETE

**Agent:** Alice (Web Content Builder)
**Task:** Publish HTML to Ghost Pro via Admin API with source=html parameter
**Status:** ✅ COMPLETE (2026-02-09)

**Inputs Available from Doc Brown:**
- ✅ Clean semantic HTML file: `/content-drafts/about-page.html` (6.6KB)
- ✅ All quality checks passed
- ✅ Ghost-hosted image URLs included

**Task Details:**
- Method: POST to Ghost Admin API `/ghost/api/admin/pages/?source=html`
- **CRITICAL:** Must include `?source=html` query parameter!
- Authentication: JWT token from `.env` (GHOST_ADMIN_API_KEY)
- Endpoint: `https://mikejones-online.ghost.io/ghost/api/admin/pages/?source=html`

**Request Body Format:**
```json
{
  "pages": [{
    "title": "About",
    "slug": "about",
    "html": "<h1>About Mike Jones</h1>...",
    "status": "published"
  }]
}
```

**What Happens:**
1. Alice posts HTML to Ghost with source=html parameter
2. Ghost automatically converts HTML → Lexical format internally
3. Page updated on mikejones.online/about

**Deliverable:**
- Live About page at `https://mikejones.online/about`
- Content updated (NOT showing old Jan 27 version)
- Page slug: `/about`
- Status: Published (not draft)

**Deliver To:** Mike (for review and feedback)

**How to Deliver:**
1. Read HTML from `/content-drafts/about-page.html`
2. Publish page via Ghost Admin API with source=html parameter
3. Verify page updated successfully (shows new content)
4. Send coordination message with page URL
5. Report completion to NATS coordination channel

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
- ✅ HTML assembly from PAGE_SPEC works reliably (simpler than Mobiledoc/Lexical JSON)
- ✅ Image URLs are correctly referenced in HTML
- ⏳ API publishing with source=html is faster/more reliable than browser automation
- ✅ Team coordination via NATS is effective
- ✅ Format compatibility resolved (HTML → Lexical conversion)

**When complete:**
- About page live and matches design intent
- Content actually updated (not showing old Jan 27 version)
- Ghost converts HTML → Lexical successfully
- Process documented for rollout to remaining pages (Phase 3.1+)
- Workflow questions answered (see `/plans/workflow-questions.md`)
