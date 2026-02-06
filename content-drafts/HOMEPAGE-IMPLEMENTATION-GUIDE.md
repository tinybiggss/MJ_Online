# Homepage Implementation Guide
**Task 3.2 - Homepage Content**
**Agent:** Alice
**Date:** 2026-02-02
**Status:** READY FOR PUBLISHING

---

## Quick Start

All content is ready to publish to Ghost Pro. Follow the steps below to go live.

---

## Files Created

1. **`/content-drafts/homepage-draft.md`**
   - Initial draft with RAG verification notes
   - Use for reference and fact-checking

2. **`/content-drafts/homepage-ghost-ready.md`**
   - Ghost-ready content with formatting
   - SEO metadata and publishing checklist
   - **USE THIS FILE FOR PUBLISHING**

3. **`/assets/homepage-schema-org.json`**
   - Schema.org structured data (Person entity)
   - Inject in Ghost → Settings → Code Injection → Site Header

4. **`/content-drafts/HOMEPAGE-IMPLEMENTATION-GUIDE.md`** (this file)
   - Step-by-step publishing instructions

---

## Publishing to Ghost Pro (Step-by-Step)

### Option 1: Manual Publishing (Ghost Admin UI)

**Time Required:** 15-20 minutes

1. **Login to Ghost Admin**
   - Navigate to https://mikejones.ghost.io/ghost/
   - Login with admin credentials

2. **Create New Page**
   - Click "Pages" in left sidebar
   - Click "New Page" button
   - Copy content from `/content-drafts/homepage-ghost-ready.md` (section: "Page Content")
   - Paste into Ghost editor

3. **Configure Page Settings** (click settings gear icon)
   - **Title:** Mike Jones - Program Leader & AI Infrastructure Builder
   - **URL Slug:** leave blank (will auto-generate from title)
   - **Excerpt:** Building Better Systems for 29 Years. Program leader, systems thinker, and AI infrastructure builder.
   - **Meta Description:** Program leader, systems thinker, and AI infrastructure builder with 29 years of experience in gaming and entertainment. Building better systems through Velocity Partners.
   - **Featured Image:** Upload professional headshot (if available)

4. **Publish Page**
   - Click "Publish" button (top right)
   - Confirm publish

5. **Set as Homepage**
   - Go to Settings (gear icon in left sidebar)
   - Click "General"
   - Scroll to "Homepage"
   - Select the page you just created
   - Click "Save" at top right

6. **Inject Schema.org Code**
   - Go to Settings → Code Injection
   - In "Site Header" field, add:
   ```html
   <script type="application/ld+json">
   [PASTE CONTENT FROM /assets/homepage-schema-org.json]
   </script>
   ```
   - Click "Save"

7. **Verify**
   - Visit https://mikejones.online
   - Verify content displays correctly
   - Test all links
   - Check mobile view
   - Test Open Graph preview (paste URL in LinkedIn/Facebook)

---

### Option 2: Browser Automation (Claude in Chrome)

**Time Required:** 5-10 minutes (automated)

Use Claude in Chrome with browser automation tools to:
1. Navigate to Ghost Admin
2. Create page with content
3. Configure settings
4. Set as homepage
5. Inject Schema.org code
6. Publish

**Advantage:** Faster, less manual work
**Disadvantage:** Requires browser automation setup

---

### Option 3: Ghost Content API (Programmatic)

**Time Required:** 20-30 minutes (requires API setup)

Use Ghost Admin API to programmatically create and publish the page.

**Requirements:**
- Ghost Admin API key
- Python or Node.js script
- API endpoint: `https://mikejones.ghost.io/ghost/api/admin/`

**Advantage:** Fully automated, repeatable
**Disadvantage:** More complex setup, API learning curve

---

## Dependencies & Blockers

### Required Before Publishing:
- ✅ Ghost Pro account active (assumed complete from Phase 1)
- ✅ Custom domain configured (mikejones.online)
- ⚠️  **Professional headshot/photo** (mentioned in Task 3.1: Content Asset Gathering)

### Assumed Links (will 404 until created):
- `/projects` - Projects landing page (Task 3.10)
- `/projects/ai-memory-system` - AI Memory case study (Task 3.6)
- `/projects/local-llm-setup` - Local LLM case study (Task 3.7)
- `/projects/neighborhoodshare` - NeighborhoodShare case study (Task 3.8)
- `/resume` - Resume page (Task 3.4)
- `/contact` - Contact page (Task 3.5)

**Recommendation:** Publish homepage now with links, then create linked pages. Broken links acceptable during development.

### External Links (already live):
- ✅ https://resilienttomorrow.substack.com (Resilient Tomorrow Substack)

---

## Post-Publishing Checklist

After publishing, verify:

- [ ] Homepage loads at https://mikejones.online
- [ ] Hero section displays correctly
- [ ] Featured image (headshot) displays
- [ ] All sections render properly (Overview, Projects, Writing, CTA)
- [ ] Internal links work (or show 404 as expected until pages created)
- [ ] External Substack link works
- [ ] Mobile view looks good (test on phone)
- [ ] SEO meta tags present (view page source)
- [ ] Schema.org JSON-LD present in page source
- [ ] Open Graph preview works (test in LinkedIn/Facebook/Slack)
- [ ] Page loads fast (< 3 seconds)

---

## SEO Validation

After publishing, test with:

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Paste: https://mikejones.online
   - Verify Person schema detected

2. **Open Graph Debugger**
   - Facebook: https://developers.facebook.com/tools/debug/
   - LinkedIn: Share the URL and view preview
   - Verify image, title, description appear correctly

3. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Test: https://mikejones.online
   - Target: 90+ score on mobile and desktop

---

## Content Strategy Notes

### Positioning
- **Primary:** Program leader with 29 years of experience
- **Secondary:** AI infrastructure builder and systems thinker
- **Proof:** Xbox patent, director roles, top 1% ChatGPT user

### Target Audience
- Gaming, entertainment, media companies (50-500 employees)
- Teams stuck in "too many meetings, still no clarity"
- Decision makers looking for fractional PMO

### CTAs (Calls to Action)
1. **Primary:** View Projects (showcases AI skills)
2. **Secondary:** Get in Touch / Schedule Call (Velocity Partners)
3. **Tertiary:** View Resume (traditional job seekers)

### Tone
- Professional but approachable
- Concrete over abstract (specific metrics, tools, results)
- Action-oriented ("Building Better Systems" not "I build systems")

---

## Future Enhancements (Post-Launch)

Consider adding:
- **Testimonials section** (client quotes)
- **Recent Writing feed** (SubStack RSS integration - Phase 4)
- **Newsletter signup** (Ghost membership feature)
- **Video introduction** (personal welcome)
- **Case study preview cards** (with images)
- **Featured in / Press mentions** (if applicable)
- **Speaking engagements / Talks** (if applicable)

---

## RAG Verification Summary

All content verified against RAG knowledge base:

✅ 29 years of experience (rag-2026-01-30-080)
✅ Xbox launch team & SDK patent (rag-2026-01-27-002, 003)
✅ Director roles at Kabam, Livescribe, Kinoo (rag-2026-01-27-004)
✅ 8 Circuit Studios co-founder (rag-2026-01-27-005)
✅ Team sizes: 50-120+, budgets: $4M-$12M+ (rag-2026-01-27-007)
✅ Efficiency metrics: 80% delivery, 3x efficiency (rag-2026-01-27-006)
✅ Top 1% ChatGPT user (rag-2026-01-29-022)
✅ AI Memory System (rag-2026-01-27-018)
✅ Local LLM Setup (rag-2026-01-27-019)
✅ NeighborhoodShare (rag-2026-01-29-028)
✅ Resilient Tomorrow (rag-2026-01-27-021)
✅ Velocity Partners services (rag-2026-01-27-009)
✅ Jones Collaboration Company, LLC (rag-2026-01-27-008)

**No terminology errors. No unverified claims.**

---

## Questions or Issues?

Contact Alice (Web-Content-Builder-Agent) via NATS coordination channel or check:
- Dashboard: http://localhost:8001
- Roadmap: /plans/roadmap.md
- This task: Section 3.2 (Homepage Content)

---

**STATUS: READY FOR PUBLISHING** ✅
