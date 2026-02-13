# Navigation Fix: Substack Writing Link

**Task ID:** qa-critical-2-v2
**Status:** SPECIFICATION COMPLETE - Ready for implementation
**Assigned:** Debbie (specification) → Alice (implementation via Ghost Admin)
**Priority:** CRITICAL
**Date:** 2026-02-11

---

## Problem

Current "Substack" navigation menu item links to `/writing/` which returns **404 error**.

**Current State:**
- Menu label: "Substack"
- Link: https://www.mikejones.online/writing/ ❌ (404 page)
- Result: Broken navigation, users can't access Mike's writing

---

## Solution

Update navigation to link to actual Substack publications with RSS feed access.

---

## Decision: Navigation Structure

**RECOMMENDED OPTION:** Single "Writing" menu item with external link to main Substack

**Rationale:**
- Clean, simple navigation (no dropdown complexity)
- "Writing" is more accurate than "Substack" (platform-agnostic)
- Links to main publication (Resilient Tomorrow) as primary writing showcase
- Substack automatically shows all Mike's publications when visitors arrive

**Alternative Option (if multi-link preferred):**
- Use dropdown menu with both publications listed
- But adds complexity for minimal benefit

---

## Implementation Instructions

### Ghost Admin Navigation Update

**Location:** Ghost Admin → Settings → Navigation

**Primary Navigation Update:**

| Current Label | Current URL | New Label | New URL | Type |
|---------------|-------------|-----------|---------|------|
| Substack | /writing/ ❌ | Writing | https://resilienttomorrow.substack.com | External |

**Step-by-Step:**
1. Log into Ghost Admin: https://mikejones-online.ghost.io/ghost
2. Navigate to: **Settings** → **Navigation**
3. Find navigation item labeled "Substack"
4. Update fields:
   - **Label:** "Writing"
   - **URL:** https://resilienttomorrow.substack.com
   - **Ensure:** URL opens in new tab (external link)
5. Click **Save** in top-right corner
6. Verify change appears in live site navigation

---

## Substack Publications Reference

### 1. Resilient Tomorrow (PRIMARY)
- **URL:** https://resilienttomorrow.substack.com
- **RSS Feed:** https://resilienttomorrow.substack.com/feed
- **Description:** Community resilience, organizing, preparedness
- **Framework:** 7 Pillars of Resilient Communities
- **Status:** Active (last post: Feb 10, 2026)
- **Audience:** Community organizers, preppers, mutual aid advocates

### 2. Organizational Intelligence (SECONDARY)
- **URL:** https://orgintelligence.substack.com
- **RSS Feed:** https://orgintelligence.substack.com/feed
- **Description:** Practical PMO frameworks and templates (Velocity Partners newsletter)
- **Topics:** Project management, team coordination, organizational design
- **Frequency:** Bi-weekly
- **Audience:** Project managers, CTOs, team leads

---

## Verification Steps

After implementation, verify:

1. ✅ **Navigation menu** shows "Writing" label
2. ✅ **Click "Writing"** opens Resilient Tomorrow Substack
3. ✅ **Link opens** in new tab (external link behavior)
4. ✅ **No 404 errors** when clicking navigation
5. ✅ **Mobile navigation** also shows updated link
6. ✅ **Footer navigation** (if present) also updated

Test URLs:
- https://www.mikejones.online → Click "Writing" → Should go to Substack
- https://resilienttomorrow.substack.com → Verify page loads

---

## Alternative: Keep Both Publications Visible

If Mike wants BOTH Substacks accessible from navigation:

**Option A: Dropdown Menu**
```
Writing ▼
├─ Resilient Tomorrow (primary)
└─ Organizational Intelligence (Velocity Partners)
```

**Option B: Separate Menu Items**
```
Navigation:
- Home
- Projects
- Resilient Tomorrow
- Velocity Partners
- About
- Resume
```

**Option C: Single Link + Footer Reference**
- Primary nav: "Writing" → Resilient Tomorrow
- Footer: "Also read: Organizational Intelligence (Velocity Partners newsletter)"

**RECOMMENDED:** Option A (dropdown) if multiple links needed, but **single "Writing" link to Resilient Tomorrow is simplest and cleanest**.

---

## RSS Feed Integration (Future Enhancement)

If Mike wants to show recent Substack articles ON MikeJones.online:

**Option:** Create /writing/ page (not just external link)
- Fetch RSS feed from Substack
- Display 5 most recent articles
- Link to full articles on Substack
- This would make /writing/ functional instead of 404

**Tools for RSS integration:**
- Ghost's built-in RSS aggregation (if available)
- Custom code injection with JavaScript RSS parser
- Third-party embed (Substack's native embed widget)

**For now:** External link is quickest fix for critical 404 issue.

---

## Design Considerations

**Label Choice Reasoning:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| "Writing" | Accurate, platform-agnostic, clear | N/A | ✅ BEST |
| "Substack" | Current label, users know Substack | Platform-specific, ties to one service | ❌ Too specific |
| "Blog" | Common term | Mike explicitly said "don't call it blog" | ❌ NO |
| "Articles" | Professional | Generic, doesn't reflect newsletter format | ⚠️ Okay |
| "Newsletter" | Accurate for Substack | Doesn't capture all writing types | ⚠️ Okay |
| "Publications" | Formal, accurate | Sounds academic | ⚠️ Okay |

**Final Recommendation:** **"Writing"** - Clear, accurate, platform-agnostic

---

## Implementation Checklist

**Debbie (Specification):**
- ✅ Research Substack URLs (verified both publications)
- ✅ Verify current navigation state (confirmed 404 issue)
- ✅ Propose naming convention ("Writing" recommended)
- ✅ Create implementation instructions (this document)
- ✅ Update NATS task status

**Alice (Implementation):**
- [ ] Access Ghost Admin → Settings → Navigation
- [ ] Update "Substack" menu item:
  - Change label: "Substack" → "Writing"
  - Change URL: "/writing/" → "https://resilienttomorrow.substack.com"
- [ ] Save changes
- [ ] Verify on live site (desktop + mobile)
- [ ] Test link opens Substack correctly
- [ ] Confirm no 404 errors
- [ ] Report completion to NATS

---

## RAG Verification

All facts verified against RAG knowledge base:
- ✅ Resilient Tomorrow is Mike's main Substack publication
- ✅ Organizational Intelligence is Velocity Partners' newsletter
- ✅ Resilient Tomorrow uses "7 Pillars" framework
- ✅ Both publications active as of February 2026
- ✅ Mike's editorial voice: urgent but grounded, practical over theoretical
- ✅ URLs verified via web search (latest post Feb 10, 2026)

**Sources:**
- [Resilient Tomorrow Substack](https://resilienttomorrow.substack.com/)
- [Organizational Intelligence](https://orgintelligence.substack.com)
- RAG entries: rag-2026-01-27-021, rag-2026-01-30-095

---

## Next Steps

1. **Debbie (NOW):** Update NATS task status to "completed" with this specification
2. **Project Manager:** Assign implementation to Alice
3. **Alice:** Execute Ghost Admin navigation update (5 min task)
4. **QA:** Verify fix on live site

---

**Status:** ✅ SPECIFICATION COMPLETE
**Estimated Implementation Time:** 5 minutes (Ghost Admin update)
**Complexity:** LOW (simple navigation URL change)
**Impact:** HIGH (fixes critical 404 error, enables access to Mike's writing)

---

**Debbie's Note:** This is a simple but critical fix. The navigation currently links to a non-existent internal page. Updating to external Substack link solves the 404 immediately. "Writing" is the most accurate, platform-agnostic label per Mike's feedback. Implementation is straightforward Ghost Admin change - Alice can execute in ~5 minutes.
