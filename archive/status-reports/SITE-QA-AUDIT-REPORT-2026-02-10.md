# MikeJones.online - Site QA & UX Audit Report

**Date:** 2026-02-10
**Auditor:** Site QA & UX Review Agent
**Overall Health Score:** 6.5/10

---

## Executive Summary

The site demonstrates strong technical fundamentals with excellent color contrast (WCAG AAA compliant), clean typography, and solid dark mode implementation. However, it significantly underutilizes visual content, has critical navigation issues (broken "Writing" menu link), and suffers from text-heavy presentation that diminishes engagement and comprehension.

**Top 3 Priorities:**

1. **Fix broken "Writing" navigation** (404 error) and add visual content strategy across all pages
2. **Add architecture diagrams and screenshots** to technical articles—currently zero images in article content
3. **Improve whitespace rhythm and visual hierarchy** to match successful Kyoto theme implementations

**Major Opportunities:**

- Transform text-heavy technical content into visually rich case studies with diagrams, screenshots, and workflows
- Leverage uploaded images that aren't appearing on site (offline_ai_architecture.png, offline_ai_session-workflow.png)
- Reduce content duplication and consolidate similar articles
- Add visual timeline, skill charts, and company logos to Resume page

---

## CRITICAL Issues

### 1. Broken Navigation Link ❌
**Issue:** "Writing" menu item leads to 404 error
**URL:** https://www.mikejones.online/writing/
**Impact:** Primary navigation is broken, creating poor user experience
**Fix:** Either create the /writing/ page or update navigation to point to /blog/

### 2. Missing Images Despite Upload ⚠️
**Issue:** User uploaded workflow diagrams for Local LLM article but they're not appearing
**Files:** offline_ai_architecture.png, offline_ai_session-workflow.png
**Impact:** Technical content lacks essential visual aids for comprehension
**Fix Required:** Verify images were successfully uploaded to Ghost media library and insert into article body

### 3. Zero Article Images 📷
**Issue:** All technical articles contain ZERO inline images, diagrams, or screenshots
**Pages Affected:**
- Local LLM Infrastructure article
- AI Memory System article
- NeighborhoodShare articles
- All blog posts

**Impact:** Complex technical concepts rely entirely on text description, significantly reducing comprehension and engagement

---

## HIGH Priority - Content

### Duplicate/Similar Content

**Confirmed duplicates needing consolidation:**

1. **Local LLM Articles:**
   - "Local LLM Infrastructure: Self-Hosted AI on Mac Mini" (full technical deep dive)
   - "Local LLM Setup: Self-Hosted AI Infrastructure" (404 - appears to be deleted/renamed)

2. **NeighborhoodShare Articles:**
   - "NeighborhoodShare: AI-Powered Community Tool Sharing Platform" (technical case study)
   - "NeighborhoodShare: Building Community Through Tool Sharing" (appears to be 404)

### Content Gaps

**About Page:**
- Repeats "building systems for 29 years" concept 3+ times without progressive revelation
- Voice shifts inconsistently between formal credentials and casual storytelling
- "7 Pillars framework" mentioned 3 times with minimal explanation

**Resume Page:**
- **Missing resume download button** despite analytics tracking "Track Resume Downloads" events!
- No education details beyond alumni affiliation
- No certifications or credentials listed

**Projects Page:**
- "Other Work" section feels disconnected from featured projects
- No project metrics visualizations

---

## HIGH Priority - UX/UI

### Typography Issues

✅ **What works:**
- Inter font with 1.75 line-height provides excellent readability
- Clear heading hierarchy
- Responsive scaling

⚠️ **Improvement opportunities:**

**Text Density:**
- About page: Long paragraphs create wall-of-text effect
- Career Highlights section needs bulleted formatting

**Hierarchy Clarity:**
- Projects page: All projects look identical - need visual differentiation

### Layout Issues

**Spacing & Flow Problems:**
- Inconsistent section rhythm across pages
- Missing visual containers (no card-based layouts)
- Site uses full-width text blocks almost exclusively

**Comparison to Kyoto Best Practices:**

| Element | MikeJones.online | Kyoto Best Practice | Gap |
|---------|------------------|---------------------|-----|
| Project cards | Text-only, full-width | Thumbnail + title + description cards | Missing images |
| Visual rhythm | Text → HR → Text pattern | Images → Cards → Whitespace → Images | Too uniform |
| Portfolio imagery | Minimal/none | Strategic placement | Critical gap |

### Color/Contrast Issues

**✅ EXCELLENT NEWS: Dark cyan (#00D9FF) on black passes WCAG AAA!**

Calculated contrast ratio: **12.37:1**

- ✅ WCAG AA normal text: PASS (need 4.5:1)
- ✅ WCAG AA large text: PASS (need 3:1)
- ✅ WCAG AAA normal text: PASS (need 7:1)
- ✅ WCAG AAA large text: PASS (need 4.5:1)

**Link Visibility:**

⚠️ **Issue:** Links use color alone for identification (indigo #4F46E5)—no underlines on first visit

**Current behavior:**
- Default: Indigo color only
- Hover: Cyan color + underline appears

**Accessibility concern:** Users with color blindness may not identify links without hover

**Recommendation:** Add subtle underline to default link state (don't rely on color alone per WCAG AA)

---

## MEDIUM Priority - Visual Content Strategy

### Missing Images Summary

**Homepage:**
- Professional headshot in hero
- Project thumbnail screenshots
- Client/colleague testimonial headshots

**About Page:**
- Visual career timeline (1997-2026)
- Achievement metrics visualization
- Company/project logos

**Resume Page:**
- **Download PDF button** (CRITICAL - analytics already track this!)
- Company logos
- Skills proficiency visualization
- Career timeline diagram

**Projects Page:**
- Architecture diagrams for AI Memory System
- **Local LLM diagrams** (ALREADY UPLOADED - need to insert!)
- NeighborhoodShare product screenshots
- Project card thumbnails

**Local LLM Article:**
- Three-service architecture diagram (UPLOADED as offline_ai_architecture.png)
- Boot sequence timeline (UPLOADED as offline_ai_session-workflow.png)
- Memory system workflow
- MCP bridge translation diagram

### Detailed Visual Content Opportunities

**Example 1: Local LLM Article**

**Location:** After "Architecture Overview" heading
**Missing:** Three-service architecture diagram **[ALREADY UPLOADED]**
**Should show:** Boxes for Ollama (port 11434), Open WebUI (port 8080), mcpo bridge (port 8000) with arrows showing data flow
**Type:** System architecture diagram
**Purpose:** Reduce cognitive load—readers shouldn't mentally construct service relationships
**Note:** ⚠️ **Uploaded as offline_ai_architecture.png—needs to be inserted**

**Example 2: Resume Page**

**Location:** Header area
**Missing:** Download button
**Should show:** Prominent "Download PDF Resume" button with download icon
**Type:** CTA button
**Purpose:** Enable offline review and sharing
**Note:** ⚠️ **CRITICAL:** Analytics already track downloads but button doesn't exist!

**Example 3: About Page Career Timeline**

**Location:** Career timeline section
**Missing:** Visual timeline graphic
**Should show:** 29-year career progression from 1997-2026 with key milestones (Xbox launch, Director roles, patents, 8 Circuit Studios founding)
**Type:** Horizontal timeline infographic
**Purpose:** Make career progression scannable, highlight longevity and achievements
**Mike can create with:** Canva, Napkin, or Mermaid.live

---

## Quick Wins
*High impact, low effort fixes - complete in <1 hour total*

### 1. Fix "Writing" Navigation (5 minutes) 🔴 CRITICAL
- **Action:** Update navigation link from `/writing/` to `/blog/`
- **Impact:** Eliminates broken link
- **How:** Ghost Admin → Design → Navigation settings

### 2. Add Resume Download Button (15 minutes) 🔴 CRITICAL
- **Action:** Create PDF resume and add download button
- **Impact:** Critical functionality for job search
- **How:** Export PDF, upload to Ghost, add button with `.resume-download-btn` class
- **Note:** Analytics already track this—just need the button!

### 3. Insert Uploaded Workflow Diagrams (10 minutes) 🟡 HIGH
- **Action:** Insert offline_ai_architecture.png and offline_ai_session-workflow.png into Local LLM article
- **Impact:** Immediately improves technical content comprehension
- **Location:** After "Architecture Overview" and "Boot Sequence" sections

### 4. Convert "Career Highlights" to Bulleted List (10 minutes) 🟡 HIGH
- **Action:** Reformat About page section from paragraph to bullet points
- **Impact:** Improves scannability
- **Before:** Dense paragraph
- **After:**
  ```
  • 80% delivery improvement through AAPD methodology
  • Managed teams of 50-120+ people
  • Oversaw budgets of $4M-$12M+
  ```

### 5. Add Default Link Underline (2 minutes) 🟡 ACCESSIBILITY
- **Action:** Modify CSS to add underline to links in default state
- **Impact:** Improves accessibility for color-blind users
- **How:** Update CSS:
  ```css
  a {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }
  ```

### 6. Add Professional Headshot to Homepage (15 minutes) 🟢 MEDIUM
- **Action:** Repurpose About page headshot for homepage hero
- **Impact:** Humanizes expert positioning

### 7. Shorten About Page Opening (10 minutes) 🟢 MEDIUM
- **Action:** Edit "building systems for 29 years" repetition
- **Impact:** Tighter messaging

### 8. Add Email Link to Contact Page (5 minutes) 🟢 LOW
- **Action:** Make hello@mikejones.online a clickable mailto: link
- **Impact:** Reduces friction

---

## Future Enhancements

### Content Strategy
- Consolidate duplicate articles
- Develop visual asset library (diagrams, screenshots)
- Expand technical content with visuals
- Implement related content system

### Design Enhancements
- Testimonial section activation (collect quotes + headshots)
- Portfolio gallery for NeighborhoodShare
- Interactive resume timeline
- Dark mode image optimization

### Technical Improvements
- Image loading optimization
- SEO enhancement with rich snippets
- Full accessibility audit
- Analytics & conversion tracking

---

## Kyoto Theme Best Practices Research

Based on analysis of successful Kyoto implementations:

**Layout Patterns:**
- Card-based project presentation (750×400px thumbnails)
- Visual rhythm: Image → Text → Cards → Whitespace pattern
- Testimonial cards with portraits + quotes

**Typography:**
- Shorter paragraphs (2-4 lines vs. current 5-8)
- More bulleted lists for scannability
- Visual breaks between text sections

**Spacing:**
- Featured projects: 96px gap
- Secondary projects: 64px gap
- Diagram margins: 48-64px top/bottom

**Component Patterns:**
- Publication logos section (company associations)
- Stats/metrics cards (large number + description)
- CTA button hierarchy (gradient primary, outline secondary)

---

## Technical Validation

### Pages Tested
✅ Homepage, About, Resume, Projects, Local LLM article, AI Memory System article, NeighborhoodShare article, Contact
❌ Writing page (404 error - broken)

### Color Contrast Validation
**Dark cyan (#00D9FF) on black:** 12.37:1 ratio
**Compliance:** WCAG AAA (exceeds all requirements)

---

## Closing Summary

**Strengths:**
- ✅ Excellent accessibility (color contrast)
- ✅ Clean typography system
- ✅ Solid dark mode implementation
- ✅ Strong technical content

**Critical Gaps:**
- ❌ Broken navigation
- ❌ Zero inline images in technical articles
- ❌ Missing resume download functionality
- ⚠️ Missing uploaded diagrams

**The site has excellent bones—it needs visual flesh to bring it to life.**

**Recommendation:** Complete Quick Wins (#1-5) immediately, then work with Debbie on visual content strategy and layout improvements.

---

**Report Generated:** 2026-02-10
**Agent:** Site QA & UX Review
**Scope:** Full site audit (technical QA + UX/UI + visual content strategy)
