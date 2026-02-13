# Alice ↔ Debbie: OG Image Creation Coordination

**Date:** 2026-02-11
**Task:** Create 7 Open Graph images for SEO implementation
**Priority:** HIGH (Phase 1 of 5-phase SEO plan)
**Estimated Time:** 2-3 hours

---

## Quick Summary

Hey Alice! 👋

I completed the SEO audit and identified a critical gap: **no og:image files exist for social media sharing**. This is causing our social sharing score to be 1/10 when it could be 10/10 (+900% improvement!).

I've spec'd out exactly what we need - 7 OG images (1200x630px) for all key pages. This is Phase 1 (CRITICAL) of the SEO implementation plan.

**What you need to do:**
1. Create 7 OG images following the specs below
2. Upload them to Ghost CDN
3. Document the CDN URLs in a JSON file
4. Test with social media debuggers

Everything you need is in this document!

---

## Image Specifications

### Technical Requirements

**Dimensions:** 1200x630px (EXACT - this is the optimal size for FB/LinkedIn/Twitter)

**Format:** PNG preferred (JPG acceptable)

**File Size:** Under 1MB each (optimize/compress if needed)

**Safe Area:** Keep critical text/visuals within center 1200x600px (Twitter crops top/bottom 15px)

**Color Mode:** RGB (for web)

**Resolution:** 72 DPI (web standard)

---

## Design Guidelines

### Typography

**Font:** Inter (our design system standard)
- Headline: Inter Bold, 72-96px
- Subheading: Inter Regular, 36-48px

**Text Color:** High contrast required
- White text on dark backgrounds, OR
- Dark text on light backgrounds
- NO low-contrast gray-on-gray

### Color Palette (Design System)

**Primary Colors:**
- **Neon Cyan:** #00D9FF (our signature color - use for accents, highlights, CTAs)
- **Charcoal:** #1A1A1A (dark backgrounds)
- **Off-White:** #F5F5F5 (light backgrounds)

**Secondary Colors:**
- **Indigo:** #4F46E5 (Velocity Partners brand - use sparingly)

### Layout Principles

- **Generous white space** (don't cram content)
- **Left or center-aligned** text (easier to read)
- **Professional polish** (no stock photo clichés like handshakes or generic tech imagery)
- **Brand consistency** across all 7 images (similar style/feel)

---

## 7 Images to Create

### 1. Homepage OG Image
**File:** `og-image-homepage.png`
**Page:** https://www.mikejones.online/

**Content:**
- **Headline:** "Mike Jones - AI Implementation Expert"
- **Subheading:** "29 Years in Tech | LLM Integration Specialist"

**Visual Style:**
- Professional, modern, tech-forward aesthetic
- Use Neon Cyan (#00D9FF) prominently
- Dark background (Charcoal #1A1A1A) with bright text
- Optional: Subtle tech pattern or gradient background

**Mood:** Confident, expert, cutting-edge

---

### 2. About Page OG Image
**File:** `og-image-about.png`
**Page:** https://www.mikejones.online/about/

**Content:**
- **Headline:** "About Mike Jones"
- **Subheading:** "AI Implementation Expert & LLM Integration Specialist"

**Visual Style:**
- Professional portrait-style
- If headshot available in /assets/, use it (positioned left or right with text opposite)
- If no headshot, use text-focused design with personal/approachable feel
- Lighter feel than homepage (could use Off-White background)

**Mood:** Approachable, credible, personal

---

### 3. Resume Page OG Image
**File:** `og-image-resume.png`
**Page:** https://www.mikejones.online/resume/

**Content:**
- **Headline:** "Mike Jones - Resume"
- **Subheading:** "29 Years | Xbox, Kabam, Livescribe | AI Expert"

**Visual Style:**
- Career timeline or achievement highlights
- Could incorporate subtle icons: Xbox logo, tech company logos (if allowed)
- Professional, credible, achievement-focused
- Traditional resume colors (navy, white) acceptable but prefer design system colors

**Mood:** Accomplished, credible, professional

---

### 4. Projects Page OG Image
**File:** `og-image-projects.png`
**Page:** https://www.mikejones.online/projects/

**Content:**
- **Headline:** "Projects - Mike Jones"
- **Subheading:** "AI Memory System | Local LLM | NeighborhoodShare"

**Visual Style:**
- Grid or showcase of 3 project screenshots/logos (if available in /assets/projects/)
- OR text-focused with project names prominently displayed
- Tech-forward, innovative feel
- Neon Cyan accents for modern tech vibe

**Mood:** Innovative, technical, portfolio showcase

---

### 5. NeighborhoodShare Case Study OG Image
**File:** `og-image-neighborhoodshare.png`
**Page:** https://www.mikejones.online/neighborhoodshare/ (or similar)

**Content:**
- **Headline:** "NeighborhoodShare"
- **Subheading:** "Community Tool Lending Platform | React + Node.js"

**Visual Style:**
- Community-focused, warm feel
- Could use screenshots from /assets/projects/neighborhoodshare/ if available
- OR use icons representing sharing/community (tools, people, neighborhood)
- Warmer color palette (less stark than homepage)

**Mood:** Community, practical, approachable

**Background:** This is a tool lending app for neighborhoods - helps people share tools instead of everyone buying their own. Resilient Tomorrow theme.

---

### 6. Local LLM Setup Case Study OG Image
**File:** `og-image-local-llm.png`
**Page:** https://www.mikejones.online/local-llm/ (or similar)

**Content:**
- **Headline:** "Offline AI System Setup"
- **Subheading:** "Complete Local LLM Configuration Guide"

**Visual Style:**
- Technical, practical feel
- Could use terminal/code aesthetic (dark background, syntax highlighting colors)
- OR use diagrams/architecture visuals from /assets/projects/local-llm/ if available
- Techy, hacker-friendly vibe

**Mood:** Technical, educational, practical

**Background:** Guide to running AI models locally without internet - complete offline AI setup.

---

### 7. AI Memory System Case Study OG Image
**File:** `og-image-ai-memory.png`
**Page:** https://www.mikejones.online/ai-memory/ (or similar)

**Content:**
- **Headline:** "AI Memory System"
- **Subheading:** "RAG-Powered Persistent Context for Claude"

**Visual Style:**
- Innovative, AI-forward aesthetic
- Could use data flow diagrams or memory/brain metaphors
- OR use screenshots/diagrams from /assets/projects/ai-memory/ if available
- Futuristic, cutting-edge feel
- Neon Cyan prominently featured

**Mood:** Innovative, technical, breakthrough

**Background:** RAG (Retrieval Augmented Generation) system that gives Claude Code persistent memory across sessions. Very technical, very cool.

---

## Asset Sources

**Check these directories for existing assets:**

```bash
/assets/                           # Root assets directory
/assets/brand/VP v2 Final.png     # Velocity Partners logo
/assets/projects/                  # Project-specific assets
/assets/projects/neighborhoodshare/
/assets/projects/local-llm/
/assets/projects/ai-memory/
```

**If you find:**
- Mike's headshot → Use for About page
- Project screenshots → Use for Projects page + case study pages
- Diagrams/architecture visuals → Use for technical case studies

**If assets don't exist:**
- Text-focused designs are perfectly acceptable
- Use design system colors and typography
- Keep it professional and clean

---

## Tools Recommended

**Option 1: Canva Pro** (Easiest)
- Search for "Open Graph" templates (1200x630px)
- Customize with our colors and text
- Export as PNG

**Option 2: Figma** (Design system consistency)
- Create 1200x630px frames
- Use Inter font (Google Fonts)
- Apply design system colors
- Export as PNG (2x for quality)

**Option 3: Adobe Photoshop/Illustrator** (If you have it)
- Create 1200x630px canvas
- Design with layers
- Export optimized PNG

**Use whatever tool you're most comfortable with!**

---

## Upload to Ghost CDN

### Method 1: Ghost Admin API (Programmatic)

```bash
# Upload via API
curl -X POST https://mikejones-online.ghost.io/ghost/api/admin/images/upload/ \
  -H "Authorization: Ghost $GHOST_ADMIN_API_KEY" \
  -F "file=@og-image-homepage.png"

# Response will include CDN URL:
# {"images": [{"url": "https://cdn.ghost.io/.../og-image-homepage.png"}]}
```

### Method 2: Ghost Admin UI (Manual)

1. Log into Ghost Admin: https://mikejones-online.ghost.io/ghost/
2. Settings → Labs
3. Scroll to "Upload images"
4. Drag and drop each PNG file
5. Copy the CDN URL from the response

**Choose whichever method you prefer!**

---

## Document CDN URLs

After uploading all 7 images, create this file:

**File:** `/og-images-cdn-urls.json`

```json
{
  "homepage": "https://cdn.ghost.io/.../og-image-homepage.png",
  "about": "https://cdn.ghost.io/.../og-image-about.png",
  "resume": "https://cdn.ghost.io/.../og-image-resume.png",
  "projects": "https://cdn.ghost.io/.../og-image-projects.png",
  "neighborhoodshare": "https://cdn.ghost.io/.../og-image-neighborhoodshare.png",
  "local-llm": "https://cdn.ghost.io/.../og-image-local-llm.png",
  "ai-memory": "https://cdn.ghost.io/.../og-image-ai-memory.png"
}
```

**This JSON file is critical** - I'll need these URLs for Phase 2 (adding OG meta tags to pages).

---

## Testing

Once uploaded, test each image URL with these tools:

### 1. Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

- Enter page URL (e.g., https://www.mikejones.online/)
- Click "Scrape Again" to see how Facebook sees it
- After Phase 2 (meta tags added), this will show your OG image

### 2. LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

- Enter page URL
- See how LinkedIn previews the page
- Verify image appears correctly

### 3. Twitter Card Validator
https://cards-dev.twitter.com/validator

- Enter page URL
- Preview Twitter card
- Verify image displays

**For now (before Phase 2):** Just verify the CDN URLs load the images correctly in a browser.

**After Phase 2:** Re-test with these tools to see full social preview.

---

## Quality Checklist

Before calling this complete, verify:

- [ ] All 7 images created
- [ ] All images exactly 1200x630px
- [ ] All file sizes under 1MB
- [ ] Text readable at small size (test by viewing at 200px wide)
- [ ] Consistent branding/style across all 7
- [ ] High contrast text (passes accessibility check)
- [ ] No typos in text
- [ ] Professional polish (no design mistakes)
- [ ] All 7 uploaded to Ghost CDN
- [ ] All 7 CDN URLs documented in `/og-images-cdn-urls.json`
- [ ] CDN URLs tested (images load in browser)

---

## Time Estimate Breakdown

**Image Creation:** 1.5-2 hours
- 7 images × 15-20 minutes each
- Includes design, iteration, export

**Upload + Documentation:** 30 minutes
- Upload to Ghost CDN (7 files)
- Collect URLs
- Create JSON file

**Testing:** 30 minutes
- Verify uploads
- Check image quality
- Test URLs

**Total: 2-3 hours**

---

## What Happens After This

**Phase 2:** Add OG Meta Tags (Debbie or Alice)
- Add `<meta property="og:image">` tags to all 7 pages
- Use your CDN URLs from `/og-images-cdn-urls.json`
- Implementation via Ghost Code Injection

**Phase 3:** Add WebSite Schema.org (site-wide)

**Phase 4:** Validation testing (Google Rich Results, social debuggers)

**Phase 5:** Documentation and completion report

**But first:** We need these 7 OG images! This is the foundation.

---

## Questions?

**If you have questions about:**
- **Design direction:** Go with your best judgment - professional and on-brand
- **Missing assets:** Text-focused designs are fine if no screenshots available
- **Technical issues:** Document in your completion report
- **Time constraints:** Create simpler text-based designs (faster)

**Priority:** Getting this done is more important than perfection. Professional, clean, on-brand images that meet specs = success!

---

## Debbie's Notes

Alice, this is high-priority work that will have huge impact on our social media presence. Right now when people share links to Mike's site, social platforms show **nothing** - just a blank preview. With these OG images, every share will look professional and compelling.

**Impact:** +900% improvement in social sharing score (from 1/10 to 10/10)

Take your time to make them look good, but don't overthink it. Clean, professional, on-brand is the goal. You've got this! 🎨

Let me know if you need anything or want me to review drafts before upload.

— Debbie

---

**Created:** 2026-02-11
**Task Type:** Design + Implementation
**Phase:** 1 of 5 (SEO Implementation)
**Status:** Ready to start
**Next:** Phase 2 (OG meta tags) - blocked until this completes
