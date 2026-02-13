# Alice - Task Instructions for Autonomous Mode

**Date:** 2026-02-11
**Coordinator:** Morgan (Project Manager)
**Status:** ✅ Ready for autonomous execution

---

## 🎯 Your Mission

Complete 6 QA and image tasks in priority order to bring site from 80% → 95%+ launch ready.

**Estimated time:** 2.5-3.5 hours total

---

## 📋 Task Execution Order

### Phase 1: CRITICAL FIXES (Do First!)

**Task 1: qa-critical-2-v2**
- **What:** Fix broken navigation link - Link to Substack RSS feeds
- **Mike's feedback:** Don't call it "blog" - it links to Substack publications
- **Suggested names:** "Substack Writings", "Publications", or propose better term
- **Substack pubs:** Resilient Tomorrow (main), Operational Intelligence
- **Action:** Update Ghost navigation via Admin settings
- **Status:** AVAILABLE NOW - Start here!

**Task 2: qa-critical-1**
- **What:** Add resume download button to Resume page
- **Issue:** Analytics track it but button doesn't exist!
- **Action:** Create PDF, upload to Ghost, add download button
- **Status:** AVAILABLE NOW - Do second!

---

### Phase 2: LOCAL LLM IMAGES (Unblock After Phase 1)

**Task 3: qa-img-1-v2**
- **What:** Upload OfflineAI-Session-Workflow.png to Ghost CDN
- **Source:** /assets/projects/local-llm/OfflineAI-Session-Workflow.png (841KB)
- **Action:** Upload via Ghost Admin API, record CDN URL
- **Status:** BLOCKED - Will appear after Phase 1 completes

**Task 4: qa-img-2-v2**
- **What:** Insert Local LLM diagrams into article
- **Article:** https://www.mikejones.online/local-llm-infrastructure/
- **Images:** Architecture (already uploaded) + Workflow (from Task 3)
- **Action:** Edit article via Ghost Admin API with source=html
- **Status:** BLOCKED by Task 3

---

### Phase 3: NEIGHBORHOODSHARE IMAGES (Unblock After Phase 1)

**Task 5: qa-img-3-v2**
- **What:** Upload 5 NeighborhoodShare screenshots to Ghost CDN
- **Source:** /assets/projects/neighborhoodshare/
- **Screenshots:** Home-Tool-Selection, Add-Tool-AI-2, Admin-Prod-4-AIMonitoring, Tool-Detail-Owner, LandingPage
- **Action:** Upload via Ghost Admin API, record all URLs
- **Status:** BLOCKED - Will appear after Phase 1 completes

**Task 6: qa-img-4-v2**
- **What:** Insert NeighborhoodShare screenshots into article
- **Article:** https://www.mikejones.online/neighborhoodshare/
- **Goal:** Transform text-heavy article into visual case study
- **Action:** Edit article via Ghost Admin API with source=html
- **Status:** BLOCKED by Task 5

---

## 🤖 Autonomous Workflow

**Your autonomous loop:**

```python
while True:
    # Get available tasks from NATS
    tasks = await get_available_tasks()

    if not tasks:
        # All done!
        break

    # Claim highest priority task
    task = tasks[0]
    await claim_task(task.id)

    # Do the work
    result = await execute_task(task)

    # Complete and report
    await complete_task(task.id, result)

    # Next task will automatically unblock if dependencies cleared
```

**As you complete tasks:**
- Phase 1 completes → Tasks 3 & 5 automatically become available
- Task 3 completes → Task 4 automatically becomes available
- Task 5 completes → Task 6 automatically becomes available

---

## 📊 Progress Tracking

**Report after each task:**
```python
await complete_task(task_id, result={
    "status": "completed",
    "summary": "Brief description of what was done",
    "deliverables": ["file1.html", "url1", "url2"],
    "ghost_urls": ["https://..."] if applicable,
    "issues_encountered": "none" or "description",
    "ready_for_next": True
})
```

---

## 🔧 Technical Details

**Ghost Admin API credentials:**
- Location: `/.env` (in project root)
- Variables: GHOST_ADMIN_API_KEY, GHOST_API_URL

**Image upload endpoint:**
```
POST https://mikejones.online/ghost/api/admin/images/upload/
Authorization: Ghost {token}
Content-Type: multipart/form-data
```

**Page edit via API:**
```
PUT https://mikejones.online/ghost/api/admin/pages/{id}/
Authorization: Ghost {token}
Body: {"pages": [{"html": "...", "updated_at": "..."}]}
Query: ?source=html
```

**Navigation update:**
- Via Ghost Admin UI: Settings → Navigation
- Or via API: PUT /ghost/api/admin/settings/

---

## ✅ Success Criteria

**Phase 1 complete when:**
- ✅ Navigation link works (no 404)
- ✅ Navigation name is accurate (not "blog", not just "Writing")
- ✅ Resume download button exists and works
- ✅ Resume PDF uploaded to Ghost CDN

**Phase 2 complete when:**
- ✅ OfflineAI-Session-Workflow.png on Ghost CDN
- ✅ Both diagrams visible in Local LLM article
- ✅ Images have descriptive alt text

**Phase 3 complete when:**
- ✅ 5 NeighborhoodShare screenshots on Ghost CDN
- ✅ 4-5 screenshots inserted in article
- ✅ Article transformed from text-heavy to visual case study

---

## 🚨 If You Get Stuck

**Report issues via coordination channel:**
```python
await send_coordination_message(
    "Alice: Stuck on {task_id} - {issue description}. Need help from Morgan or Mike."
)
```

**Common issues:**
- Ghost API auth errors → Check .env file credentials
- Image upload fails → Check file exists and size <5MB
- Page edit fails → May need to get current page state first

---

## 📈 Expected Outcome

**Before:** Site health score 6.5/10, launch ready 80%
**After:** Site health score 8.5-9.0/10, launch ready 95%+

**Site improvements:**
- ✅ All critical navigation issues fixed
- ✅ Resume downloadable (analytics now make sense!)
- ✅ Technical articles have visual aids
- ✅ Case studies use screenshots effectively

---

## 🎬 Ready to Start!

**Dashboard:** http://localhost:8001
**Current available tasks:** 2 (both critical)
**Next available after Phase 1:** 2 (image uploads)

**Mike's waiting for you to finish Phase 1, then you'll see Phase 2/3 tasks automatically appear!**

**Go Alice! 🚀**
