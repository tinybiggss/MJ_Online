# Archive Quick Reference

**Created:** 2026-02-12
**Purpose:** Quick lookup guide for archived files

---

## Where Did My File Go?

### Phase Reports & Completion Docs
**Location:** `/archive/phase-reports/`
**Examples:**
- PHASE-2.X-COMPLETE.md
- PHASE-3.0.X-COMPLETION-REPORT.md
- IMPLEMENTATION-READY.md
- LAUNCH-PORTFOLIO-FINAL.md
- ENV-SETUP-COMPLETE.md

### Status Snapshots
**Location:** `/archive/status-reports/`
**Examples:**
- FINAL-STATUS-*.md
- PM-STATUS-REPORT-*.md
- QA-TASKS-STATUS-*.md
- SEO-AUDIT-REPORT-*.md
- SITE-QA-AUDIT-*.md

### Agent Work Sessions
**Location:** `/archive/agent-sessions/`
**Examples:**
- ALICE-AUTONOMOUS-SESSION-REPORT.md
- DEBBIE-AUTONOMOUS-*.md
- DOC-BROWN-AUTONOMOUS-STATUS.md
- TED-RAG-UPDATE-SUMMARY.md

### Agent Coordination & Handoffs
**Location:** `/archive/coordination/`
**Examples:**
- ALICE-DEBBIE-OGIMAGE-COORDINATION.md
- ALICE-TASK-*.md
- OG-IMAGE-IMPLEMENTATION-*.md
- NAVIGATION-FIX-*.md

### Python Scripts
**Location:** `/archive/scripts-deprecated/`
**Examples:**
- alice_*.py (38 scripts)
- debbie_*.py (12 scripts)
- publish_*.py
- update_*.py
- upload_*.py

### ActivityPub Docs
**Location:** `/archive/activitypub-docs/`
**Examples:**
- ACTIVITYPUB-*.md
- activitypub-*.md
- verify_activitypub.py

### Analytics Docs
**Location:** `/archive/analytics-docs/`
**Examples:**
- ANALYTICS-*.md
- GHOST-ANALYTICS-GUIDE.md
- README-ANALYTICS.md

---

## Still in Root (Active Files)

**Documentation:**
- CLAUDE.md (Project instructions)
- LAUNCH-CHECKLIST.md (Launch status)
- RAG-ERRORS-TO-FIX.md (Current issues)
- COMPREHENSIVE-QA-AUDIT-PRE-LAUNCH.md (Active QA)
- PERFORMANCE-AUDIT-REPORT-2026-02-12.md (Latest audit)
- REPO-CLEANUP-REPORT-2026-02-12.md (This cleanup)

**Memory Files:**
- ALICE-MEMORY.json
- DEBBIE-MEMORY.json
- NATS-TROUBLESHOOTER-MEMORY.json
- PROJECT-MEMORY.json

**Infrastructure:**
- ghost_api_helper.py (Reusable utility)

---

## Search Tips

### Find a specific file
```bash
# Search archive by filename
find /Users/michaeljones/Dev/MJ_Online/archive -name "*keyword*"

# Search archive by content
grep -r "search term" /Users/michaeljones/Dev/MJ_Online/archive/
```

### Browse by category
```bash
# List all phase reports
ls /Users/michaeljones/Dev/MJ_Online/archive/phase-reports/

# List all Alice scripts
ls /Users/michaeljones/Dev/MJ_Online/archive/scripts-deprecated/alice_*
```

### Count files in archive
```bash
# Total archived files
find /Users/michaeljones/Dev/MJ_Online/archive -type f | wc -l

# Files by category
ls /Users/michaeljones/Dev/MJ_Online/archive/*/ | wc -l
```

---

## Quick Stats

**Total Files Archived:** 189
**Archive Categories:** 7
**Root Files (before):** ~200+
**Root Files (after):** 11
**Reduction:** 95%

---

## Need to Restore a File?

If you need to bring a file back to active use:

```bash
# Copy (don't move) from archive
cp /Users/michaeljones/Dev/MJ_Online/archive/category/filename.ext /Users/michaeljones/Dev/MJ_Online/

# Or if you need to reference it in place
cat /Users/michaeljones/Dev/MJ_Online/archive/category/filename.ext
```

**Note:** Files in archive are read-only references. Don't delete archive files unless certain they're no longer needed.

---

## Archive Maintenance

**When to archive new files:**
- After completing a major phase
- After generating status reports
- After agent autonomous sessions complete
- When scripts become deprecated

**Keep in root only:**
- Active documentation (CLAUDE.md, LAUNCH-CHECKLIST.md, etc.)
- Current issues/audits
- Agent memory files (continuity)
- Project memory (living document)
- Reusable infrastructure code

**Archive everything else:** Reports, completions, one-off scripts, coordination docs
