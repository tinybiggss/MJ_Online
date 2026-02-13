# MJ_Online Development Roadmap - Ghost Pro Edition

**Project:** MJ_Online Personal Website & Portfolio
**Domain:** MikeJones.online
**Platform:** Ghost Pro (Managed Hosting)
**Target Launch:** 1-2 weeks from start (revised estimate pending pilot test)
**Last Updated:** 2026-02-06

**IMPORTANT:** Phase 3 workflow revised 2026-02-06 - now using Design System → Mobiledoc → API Publishing approach (see Phase 3.0-3.0.2)

---

## Overview

This roadmap is optimized for **Ghost Pro managed hosting**, eliminating all server management and infrastructure tasks. The focus is on configuration, content creation, and launch - allowing agents to work on high-value tasks rather than server administration.

**Key Advantages of Ghost Pro Approach:**
- ✅ No server provisioning or management
- ✅ SSL, backups, email delivery included
- ✅ Automatic Ghost updates
- ✅ Week faster to launch
- ✅ Agents focus on content and configuration

**Migration Path:** This roadmap assumes Ghost Pro at launch. Phase 8 covers optional migration to self-hosted VPS when you're ready to manage infrastructure alongside other projects.

**Coordination:** Project managed via NATS coordination system. Dashboard: http://localhost:8001

---

## Phase 1: Ghost Pro Setup & Domain Configuration ✅ ARCHIVED

**Status:** ✅ COMPLETE (2026-01-28)
**Phases 1.2, 1.3, 1.4:** Archived to plans/completed/roadmap-archive.md

All Phase 1 work is complete. Ghost Pro is fully configured and operational at MikeJones.online.

---

## Phase 2: Theme & Design Configuration

**Priority:** CRITICAL (Blocking content display)
**Dependencies:** Phase 1 (Ghost Pro setup complete)
**Duration:** 2-4 days
**Parallelization:** HIGH - most tasks can run concurrently

**Progress:** 6/6 complete (100%) - ✅ PHASE 2 COMPLETE!
- ✅ 2.1 Theme Selection (archived 2026-01-28)
- ✅ 2.2 Visual Design (archived 2026-01-30)
- ✅ 2.3 Navigation Config (archived 2026-01-30)
- ✅ 2.4 ActivityPub Config (archived 2026-01-30)
- ✅ 2.5 Analytics Setup (archived 2026-01-30)
- ✅ 2.6 Code Injection (archived 2026-01-30)

### 2.1 Theme Selection & Installation ✅ ARCHIVED

**Status:** ✅ COMPLETE (2026-01-28)
**Completed by:** Manual execution (User)
**Notes:** Kyoto theme ($89) purchased, installed, and activated
**Archived to:** plans/completed/roadmap-archive.md

---

### 2.2 Visual Design Customization ✅ ARCHIVED

**Status:** ✅ COMPLETE (2026-01-30 23:32:34)
**Completed by:** Web-Content-Builder-2
**Notes:** Indigo accent color, Onyx dark mode, professional AI-forward aesthetic
**Archived to:** plans/completed/roadmap-archive.md

---

### 2.3 Navigation & Menu Configuration ✅ ARCHIVED

**Status:** ✅ COMPLETE (2026-01-30 23:47:44)
**Completed by:** Web-Content-Builder-2
**Notes:** 5 primary menu items, 3 secondary footer items, mobile menu functional
**Archived to:** plans/completed/roadmap-archive.md

---

### 2.4 ActivityPub Configuration ✅ ARCHIVED

**Status:** ✅ COMPLETE (2026-01-30 23:02:57)
**Completed by:** Web-Content-Builder-Agent
**Notes:** ActivityPub enabled, @mike@MikeJones.online configured, federation active
**Archived to:** plans/completed/roadmap-archive.md

---

### 2.5 Analytics Setup ✅ ARCHIVED

**Status:** ✅ COMPLETE (2026-01-30 23:02:57)
**Completed by:** Web-Content-Builder-Agent
**Notes:** Ghost built-in analytics (included with Ghost Pro), GDPR compliant, already active
**Archived to:** plans/completed/roadmap-archive.md

---

### 2.6 Code Injection & Custom Features ✅ ARCHIVED

**Status:** ✅ COMPLETE (2026-01-30 23:02:57)
**Completed by:** Web-Content-Builder-Agent
**Notes:** Custom CSS, Schema.org structured data, code injection tested and working
**Archived to:** plans/completed/roadmap-archive.md

---

## Phase 3: Core Content Creation
**Priority:** CRITICAL (Launch blocking)
**Dependencies:** Phase 2 (Theme & design ready)
**Duration:** 5-8 days (revised estimate pending pilot test)
**Parallelization:** HIGH - content writing can be distributed (6-8 agents)

---

## ✅ VALIDATED WORKFLOW (2026-02-09)

**Major Process Change:** Successfully transitioned from browser automation to API-based HTML publishing workflow.

**Validated Approach:**
1. **Debbie** (Design System Architect) → Creates PAGE_SPEC from design system
2. **Alice** (Image Uploader) → Uploads images to Ghost, provides URLs
3. **Doc Brown** (HTML Assembler) → Converts PAGE_SPEC to semantic HTML
4. **Alice** (Publisher) → Publishes HTML via Ghost Admin API with `source=html` parameter (Ghost auto-converts to Lexical)

**Why this works:**
- Browser automation with Ghost editor unreliable (complex iframe structure)
- API-based publishing stable, repeatable, version-controllable
- Design system ensures consistency across all pages
- HTML is simpler than Mobiledoc/Lexical JSON (Ghost converts automatically)
- **Critical discovery:** Ghost 5.x uses Lexical format, but accepts HTML with `source=html` parameter

**Phases:**
- ✅ **Phase 3.0:** Design System Creation (COMPLETE)
- ✅ **Phase 3.0.1:** Create HTML Assembler Agent (COMPLETE - was "Mobiledoc Assembler", updated to HTML)
- ✅ **Phase 3.0.2:** Implement Global CSS (COMPLETE)
- ✅ **Phase 3.0.3:** Pilot Test New Workflow on About Page (COMPLETE - SUCCESSFUL!)
- ✅ **Phase 3.0.4:** Resume Page (COMPLETE)
- ✅ **Phase 3.0.5:** Projects Landing Page (COMPLETE)
- ✅ **Phase 3.0.6:** Homepage (COMPLETE - All core pages published!)

**Pilot Test Result:** About page published successfully at https://www.mikejones.online/about/ - User feedback: "This page is so much better!" Workflow proven and ready for rollout.

**See:** `/content-drafts/PHASE-3.0.3-COMPLETION-REPORT.md` for complete pilot test results and lessons learned.

---

### 3.0 Design System Creation ✅ COMPLETE
**Status:** ✅ COMPLETE (2026-02-06)
**Completed by:** Debbie (Web Design Agent)
**Duration:** ~3 hours

**Deliverables:**
- ✅ Complete design system document at `/design/DESIGN-SYSTEM.md` (1,687 lines)
- ✅ Brand Essence: AI Implementation Expert positioning, cutting-edge yet professional
- ✅ Color Palette: Indigo (#4F46E5) + Neon Cyan (#00D9FF) accents on dark mode
- ✅ Typography System: Inter (primary) + JetBrains Mono (technical elements)
- ✅ Spacing System: 8px base unit, generous whitespace (96-128px sections)
- ✅ Visual Hierarchy: Bold headlines, scannable content, clear emphasis
- ✅ Component Library: Hero sections, cards, buttons, badges, navigation
- ✅ Page-Specific Guidelines: Homepage, About, Resume, Projects, Case Studies, Contact
- ✅ Implementation CSS: Ready for Ghost Code Injection
- ✅ Research-backed: Multiple 2026 trend sources cited

**Outcome:** Comprehensive, professional design system ready for implementation. Reflects Mike's AI expertise with tech-forward aesthetic (neon cyan, dark mode, monospace accents). Ready to approve and implement.

---

### 3.0.1 Create Mobiledoc Assembler Agent ✅ COMPLETE
**Status:** ✅ COMPLETE (2026-02-06)
**Completed by:** Mike (user created agent definition)
**Enhanced by:** Morgan (PM - added clarifications)

**Deliverables:**
- ✅ Agent definition at `/.claude/agents/mobiledoc-assembler.md`
- ✅ Agent name: Doc Brown (Mobiledoc Assembler)
- ✅ YAML frontmatter configured
- ✅ Input specification: PAGE_SPEC from Debbie + Image URLs from Alice
- ✅ Output specification: Valid Mobiledoc JSON only (no prose)
- ✅ Mobiledoc v0.3.2 format documented
- ✅ Allowed Ghost cards: heading, paragraph, image, markdown, html, button, divider, embed
- ✅ Error reporting with @tags (Debbie, Alice, Morgan)
- ✅ Failure protocol: Fail loudly, no guessing

**Enhancements:**
- ✅ Clarified image URL workflow (Alice uploads first)
- ✅ RAG verification assumption (content pre-verified by Debbie)
- ✅ Input format flexibility (TBD in pilot test)
- ✅ Mobiledoc version verification note (validate in pilot)

**Outcome:** Doc Brown ready for pilot test. Mechanical translator with scientific precision approach.

---

### 3.0.1a Enhance Debbie with PAGE_SPEC Output Format ✅ COMPLETE
**Status:** ✅ COMPLETE (2026-02-06)
**Completed by:** Morgan (PM)

**Updates to Debbie's Agent Definition:**
- ✅ Added explicit PAGE_SPEC output format specification
- ✅ Enhanced Information Architecture responsibilities (visual pacing, density, CTA timing)
- ✅ Documented Kyoto theme constraints (vertical stacking, editorial, text-forward)
- ✅ Created PAGE_SPEC example (About page)
- ✅ Added PAGE_SPEC handoff process (Debbie → Doc Brown → Alice)
- ✅ Clarified UX/IA stays with Debbie (no separate UXIA agent)
- ✅ **Added custom graphics request authority** with toolset (Canva, Napkin, Gamma, Mermaid.live)
- ✅ IMAGE REQUEST format for custom charts, diagrams, infographics, branded visuals

**Key Addition:**
Debbie now empowered to request custom graphics Mike can create using:
- Canva (professional graphics, infographics)
- Napkin (sketches, diagrams)
- Gamma (presentation-style visuals)
- Mermaid.live (flowcharts, timelines)

**Outcome:** Debbie has complete authority and clear output format. Ready to implement global CSS and design About page for pilot.

---

### 3.0.2 Implement Global CSS ✅ COMPLETE
**Status:** ✅ COMPLETE (2026-02-06)
**Completed by:** Debbie (Web Design Agent)
**Duration:** ~2 hours

**Tasks Completed:**
- ✅ Add custom CSS to Ghost Code Injection (Header)
  - ✅ Google Fonts import (Inter, JetBrains Mono)
  - ✅ Typography overrides (H1-H6, body, code)
  - ✅ Color variables and link styles
  - ✅ Button styles (primary, secondary)
  - ✅ Card styles with hover states
  - ✅ Badge styles (category, tech, metric)
  - ✅ Spacing utilities
  - ✅ Responsive breakpoints
- ✅ Tested on existing pages:
  - ✅ Contact page
  - ✅ Homepage
  - ✅ Projects Landing page
- ✅ Verified no conflicts with Kyoto theme
- ✅ Checked mobile responsiveness (375px, 768px, 1440px)
- ✅ Tested hover states and interactions

**Deliverables:**
- ✅ Global CSS implemented in Ghost Code Injection
- ✅ Existing 3 pages improved with design system styling
- ✅ Design system validated in production environment
- ✅ CSS works cleanly with Kyoto theme

**Outcome:** Design system CSS successfully deployed to production. All existing pages now use consistent typography (Inter/JetBrains Mono), color palette (Indigo/Neon Cyan), and spacing. Mobile responsive across all breakpoints. Foundation validated and ready for About page pilot test.

---

### 3.0.3 Pilot Test: About Page with New Workflow ✅ COMPLETE
**Status:** ✅ COMPLETE (2026-02-09)
**Completed by:** Debbie, Alice, Doc Brown, Morgan (coordinated team effort)
**Duration:** 3 days (includes critical format discovery and workflow pivot)
**Priority:** HIGH - Validated complete Design → HTML → API workflow

**Process Executed:**
1. ✅ **Debbie:** Designed About page using approved design system
   - Output: PAGE_SPEC document at `/design/PAGE_SPEC-About.md` (25KB)
2. ✅ **Alice:** Uploaded professional headshot via Ghost API
   - Output: Ghost-hosted URL: https://www.mikejones.online/content/images/2026/02/headshot-professional.png
3. ✅ **Doc Brown (HTML Assembler):** Converted PAGE_SPEC → semantic HTML
   - Output: Clean HTML at `/content-drafts/about-page.html` (6.6KB)
   - **CRITICAL FORMAT CHANGE:** Ghost 5.x uses Lexical, not Mobiledoc - workflow updated to use HTML with `source=html` parameter
4. ✅ **Alice:** Published HTML via Ghost Admin API with `source=html` parameter
   - Output: Live About page at https://www.mikejones.online/about/
   - Ghost automatically converted HTML → Lexical format
5. ✅ **Mike:** Reviewed published page
   - Feedback: "This page is so much better!" - validates quality and approach

**Critical Discovery:**
- **Issue:** Ghost 5.x uses Lexical format (current editor), not Mobiledoc v0.3.2 (deprecated)
- **Problem:** Initial Mobiledoc JSON accepted with HTTP 200 but silently failed to update content
- **Research:** Morgan researched Ghost docs/forums - found `source=html` parameter solution
- **Solution:** Workflow updated to use HTML format instead of Mobiledoc/Lexical JSON
- **Impact:** Simpler workflow (HTML easier than JSON schemas), prevents silent failures, future-proof

**Workflow Questions Answered:**
- ✅ PAGE_SPEC format: Markdown document with sections, content, allowed Ghost cards, image requirements
- ✅ Image uploads: Alice uploads first via Ghost API, provides URLs to Doc Brown for HTML assembly
- ✅ RAG verification: Happens during Debbie's PAGE_SPEC creation (facts pre-verified before handoff)
- ✅ Published output review: Mike reviews live page, provides feedback for iteration
- ✅ Speed/reliability: API-based publishing 2-3x faster than browser automation (estimated)

**Deliverables:**
- ✅ About page published at https://www.mikejones.online/about/
- ✅ PAGE_SPEC format defined and documented
- ✅ HTML assembly process validated (Doc Brown agent)
- ✅ Publishing script created: `/publish_about_page.py` (reusable for future pages)
- ✅ Completion report: `/content-drafts/PHASE-3.0.3-COMPLETION-REPORT.md`
- ✅ Workflow documented: `PHASE-3.0.3-PUBLISHING-HANDOFF-UPDATED.md`
- ✅ Agents updated: Doc Brown (HTML output), Alice (source=html publishing)

**Success Criteria Met:**
- ✅ About page matches design intent and RAG facts
- ✅ Process is repeatable and fully documented
- ✅ Faster and more reliable than browser automation
- ✅ Team confident in rolling out to remaining pages (Resume, Projects, Homepage)
- ✅ User validated quality: "This page is so much better!"

**Lessons Learned:**
- Always verify API format compatibility - don't trust HTTP status codes alone
- Silent failures dangerous - verify actual content changes, not just API responses
- Simpler solutions often exist - HTML simpler than complex JSON formats
- Pilot testing catches critical issues before they affect all pages
- Design system produces high-quality, consistent pages

**Outcome:** Workflow validated and proven. Ready for production rollout to Resume, Projects, Homepage pages, plus image additions to case studies.

---

### 3.0.4 Resume Page ✅ COMPLETE
**Status:** ✅ COMPLETE (2026-02-09)
**Completed by:** Debbie, Doc Brown, Alice (autonomous agents)
**Priority:** HIGH - Core page for employment positioning
**Duration:** Same day (autonomous execution)

**Workflow Executed:**
1. ✅ **Debbie:** Created PAGE_SPEC (404 lines) at `/design/PAGE_SPEC-Resume.md`
2. ✅ **Alice:** Reused professional headshot from Phase 3.0.3 (no new uploads needed)
3. ✅ **Doc Brown:** Converted PAGE_SPEC → semantic HTML (7.3KB) at `/content-drafts/resume-page.html`
4. ✅ **Alice:** Published HTML via Ghost Admin API with `source=html` parameter

**Deliverables:**
- ✅ Live Resume page at https://www.mikejones.online/resume/
- ✅ PAGE_SPEC document: 404 lines, RAG-verified content
- ✅ Semantic HTML: 7.3KB, clean structure
- ✅ All facts verified against RAG knowledge base
- ✅ Professional presentation aligned with design system
- ✅ 29 years experience, correct professional title, all achievements documented

**Key Achievement:** Second successful application of validated Design → HTML → API workflow. Autonomous agents completed all steps independently.

---

### 3.0.5 Projects Landing Page ✅ COMPLETE
**Status:** ✅ COMPLETE (2026-02-09)
**Completed by:** Debbie, Doc Brown, Alice (autonomous agents)
**Duration:** Same day (autonomous execution)

**Workflow Executed:**
1. ✅ **Debbie:** Created PAGE_SPEC at `/design/PAGE_SPEC-Projects-Landing.md` (27KB)
2. ✅ **Alice:** Uploaded project thumbnails/images
3. ✅ **Doc Brown:** Converted PAGE_SPEC → semantic HTML
4. ✅ **Alice:** Published HTML via Ghost Admin API with `source=html` parameter

**Deliverables:**
- ✅ Live Projects page at https://www.mikejones.online/projects/
- ✅ Project showcase with case study links
- ✅ Professional portfolio presentation
- ✅ All facts RAG-verified
- ✅ Design system applied consistently

**Key Achievement:** Third consecutive successful workflow execution - confirms repeatability and reliability

---

### 3.0.6 Homepage ✅ COMPLETE
**Status:** ✅ COMPLETE (2026-02-10)
**Completed by:** Debbie, Morgan (images/publishing), Doc Brown
**Duration:** ~2 hours (streamlined execution)

**Workflow Executed:**
1. ✅ **Debbie:** Created PAGE_SPEC (26.8KB) at `/design/PAGE_SPEC-Homepage.md`
2. ✅ **Morgan:** Uploaded 3 images (NeighborhoodShare, Local LLM, VP logo) to Ghost CDN
3. ✅ **Doc Brown:** Converted PAGE_SPEC → semantic HTML (3.9KB) at `/content-drafts/homepage.html`
4. ✅ **Morgan:** Published HTML via Ghost Admin API with `source=html` parameter

**Deliverables:**
- ✅ Live Homepage at https://www.mikejones.online/home/
- ✅ 5 sections: Hero, Featured Work (3 projects), Who I Am, Core Expertise, Final CTA
- ✅ 4 images integrated (NeighborhoodShare, Local LLM diagram, VP logo, headshot available)
- ✅ All content RAG-verified
- ✅ Design system applied consistently
- ✅ SEO optimized (meta tags complete)
- ✅ Mobile responsive

**Key Achievement:** Fourth and final core page complete - all main navigation targets now published. Workflow proven across 4 consecutive successful executions.

---

### 3.1 Content Asset Gathering & Preparation ✅ COMPLETE
**Status:** 🟡 In Progress (User gathering assets manually)
**Agent Type:** manual / general-purpose
**Dependencies:** None (can start during Phase 1/2)
**Can Parallel With:** All Phase 2 work

**Tasks:**
- [ ] Gather content assets:
  - Professional headshot/photo (high resolution)
  - SubStack RSS feed URLs:
    - Resilient Tomorrow: [URL needed]
    - Operational Intelligence: [URL needed]
  - AI project materials:
    - AI Memory System: screenshots, architecture diagrams, demo videos
    - Local LLM Setup: architecture diagrams, screenshots, config examples
  - Other project materials:
    - NeighborhoodShare: screenshots, visuals
    - Home Management System: screenshots
    - Other projects: gather available assets
- [ ] Optimize all images:
  - Resize to appropriate dimensions
  - Compress for web (TinyPNG or similar)
  - Convert to WebP format (or PNG/JPG if Ghost Pro handles conversion)
  - Add descriptive filenames
- [ ] Upload images to Ghost:
  - Access Ghost admin → Content → Files
  - Upload all optimized images
  - Organize in Ghost media library
  - Note image URLs for use in content
- [ ] Document all assets and their locations

**Deliverables:**
- All images collected and optimized
- Images uploaded to Ghost media library
- SubStack feed URLs documented
- Asset inventory complete

**Estimated Time:** 2-4 hours (depending on asset availability)

---

### 3.2 Homepage Content 🟡 IN PROGRESS
**Status:** 🟡 Alice working now (2026-02-04)
**Agent:** Alice
**Agent Type:** web-content-builder (browser automation)
**Dependencies:** 2.2 (Design configured ✅), 3.1 (Assets ready ✅)
**Can Parallel With:** 3.3, 3.4, 3.5

**Tasks:**
- [ ] Create Homepage page in Ghost:
  - Access Ghost admin → Pages → New Page
  - Set as Homepage (Settings → General → Homepage = this page)
- [ ] Write Hero Section:
  - Professional tagline emphasizing AI implementation and LLM integration expertise
    - Example: "AI Engineer & Builder | Creating Practical AI Solutions"
  - Elevator pitch (1-2 sentences):
    - Example: "I build real-world AI systems, from self-hosted LLM infrastructure to intelligent workflow automation. My focus is practical AI implementation that solves tangible problems."
  - Add professional headshot image
  - Add primary CTA button: "View AI Projects" (links to /projects)
- [ ] Create Featured Projects Section:
  - Add section heading: "Featured Work" or "AI Projects"
  - Create 3-4 project cards:
    - **AI Memory System** (with AI badge/tag)
    - **Local LLM Setup** (with AI badge/tag)
    - **NeighborhoodShare** (or another project)
    - One more project for breadth
  - Each card includes:
    - Project title
    - Brief description (2-3 sentences)
    - Thumbnail image
    - Link to full case study
    - AI project visual indicator (badge, icon, or tag)
- [ ] Create Professional Summary Section:
  - Heading: "Skills & Expertise"
  - Key skills list with AI implementation prominently featured:
    - AI Implementation & LLM Integration
    - Prompt Engineering & AI Workflow Automation
    - Self-Hosted AI Infrastructure
    - Python Development
    - Web Development & Full Stack
  - Specific callouts for AI capabilities
  - Link to full resume: "View Full Resume →"
- [ ] Create Recent Content Section (optional at launch):
  - Placeholder for Activity Feed (post-launch)
  - Or link to SubStack content
  - "Follow on Fediverse" CTA with @mike@MikeJones.online
- [ ] Add Contact CTA Section:
  - Heading: "Let's Connect"
  - Brief text: "Interested in AI projects, consulting, or just want to chat?"
  - Contact button: "Get in Touch" (links to /contact)
  - Cal.com link/button: "Schedule a Meeting"
- [ ] Add SEO metadata:
  - Meta title: "Mike Jones - AI Engineer & Developer"
  - Meta description: "Portfolio and projects of Mike Jones, focusing on practical AI implementations, self-hosted LLM infrastructure, and intelligent automation."
  - Open Graph image (headshot or hero image)
- [ ] Publish Homepage
- [ ] Set as site homepage in Settings
- [ ] Review on desktop and mobile
- [ ] Iterate on design/content as needed

**Deliverables:**
- Homepage published with all sections
- AI expertise prominently highlighted
- Professional presentation
- SEO optimized
- Mobile responsive

**Estimated Time:** 3-5 hours (content writing + design iteration)

---

### 3.3 About Page 🟡 ASSIGNED

**Status:** 🟡 Assigned to Alice (draft complete, needs publishing)
**NATS Task ID:** 3.3
**Agent:** Alice
**Agent Type:** web-content-builder (browser automation)
**Dependencies:** 3.1 (Headshot ready), 2.2 (Design ready)
**Can Parallel With:** 3.2, 3.4, 3.5

**Tasks:**
- [ ] Create About page in Ghost:
  - Access Ghost admin → Pages → New Page
  - Title: "About" or "About Mike"
- [ ] Write About page content (suggested structure):
  - **Introduction paragraph:**
    - Who you are
    - Current focus on AI implementation
    - What drives your work
  - **Professional Journey section:**
    - Career background overview
    - Transition into AI implementation and context engineering work
    - Key experiences and growth areas
    - Emphasis on practical AI implementation
  - **Current Focus section:**
    - AI implementation exploration and learning
    - Practical AI implementations (LLM workflows, automation)
    - Self-hosted AI infrastructure projects
    - Projects you're working on
  - **Technical Expertise section:**
    - AI and LLM frameworks and tools
    - Programming languages (Python primary)
    - Infrastructure and DevOps skills
    - Web development capabilities
  - **Beyond Work section (optional):**
    - Personal interests
    - Community involvement (Burning Man, etc.)
    - Other passions
  - **Clear Statement for Employers:**
    - "I'm actively building hands-on AI implementation and LLM integration expertise through practical projects and self-hosted infrastructure. If you're looking for someone who can implement real AI solutions, let's talk."
- [ ] Add visuals:
  - Professional headshot (prominent placement)
  - Optional: timeline of career journey
  - Optional: photos of projects or events
- [ ] Add links:
  - Social profiles (LinkedIn, GitHub, Twitter/X)
  - SubStack publications:
    - Resilient Tomorrow
    - Operational Intelligence for Velocity Partners
  - Fediverse/Mastodon: @mike@MikeJones.online
- [ ] Add SEO metadata:
  - Meta title: "About Mike Jones - AI Engineer & Developer"
  - Meta description: "Learn about Mike Jones's journey into AI implementation, practical AI projects, and professional background in technology and development."
  - Open Graph image (headshot)
- [ ] Publish About page
- [ ] Review on desktop and mobile
- [ ] Iterate on content for clarity and impact

**Deliverables:**
- About page published
- AI expertise and transition emphasized
- Professional background clear
- Social links included
- SEO optimized

**Estimated Time:** 2-4 hours (personal content writing)

---

### 3.4 Resume/CV Page ⚪ ASSIGNED
**Status:** ⚪ Assigned to Alice
**Agent:** Alice
**Agent Type:** web-content-builder (browser automation)
**Dependencies:** 2.2 (Design ready)
**Can Parallel With:** 3.2, 3.3, 3.5

**Tasks:**
- [ ] Create Resume/CV page in Ghost:
  - Access Ghost admin → Pages → New Page
  - Title: "Resume" or "CV"
  - URL slug: /resume or /cv
- [ ] Write Resume content (suggested structure):
  - **Professional Summary:**
    - Brief overview (3-4 sentences)
    - Emphasize AI implementation focus and practical implementation skills
  - **Skills & Technologies section:**
    - **AI & LLM Integration (prominently featured):**
      - LLM Integration & Prompt Engineering
      - AI Workflow Automation
      - Self-Hosted AI Infrastructure
      - AI & LLM Frameworks: LangChain, OpenAI API, local LLM deployment
      - Practical AI Application Development
    - **Programming Languages:**
      - Python (primary)
      - JavaScript/Node.js
      - Other languages as relevant
    - **Technologies & Tools:**
      - Web frameworks
      - Databases
      - DevOps tools
      - Other relevant tech
  - **Professional Experience:**
    - Job history with AI implementation and context engineering work highlighted
    - Focus on accomplishments and impact
    - Quantify results where possible
  - **Projects (brief list, link to /projects for details):**
    - AI Memory System
    - Local LLM Setup
    - Other significant projects
  - **Education & Certifications:**
    - Formal education
    - AI-related training or courses
    - Certifications
  - **Additional sections as relevant:**
    - Publications (SubStacks)
    - Speaking engagements
    - Community involvement
- [ ] Visual emphasis on AI capabilities:
  - Use headings, bold text, or visual indicators
  - Consider badges or icons for key skills
  - Ensure AI section is prominent (top of skills)
- [ ] Create downloadable PDF version:
  - Design PDF resume in separate tool (Google Docs, Canva, etc.)
  - Export as PDF
  - Upload PDF to Ghost media library
  - Add download button/link on Resume page: "Download PDF Resume"
  - Track downloads via analytics (custom event)
- [ ] Add Schema.org structured data:
  - Access Ghost admin → Settings → Code injection
  - Add Person schema to Resume page header (or site-wide if not done)
  - Include: name, job titles, skills, education, contact info
  - Validate with Google Rich Results Test
- [ ] Add SEO metadata:
  - Meta title: "Resume - Mike Jones | AI Engineer & Developer"
  - Meta description: "Mike Jones's professional resume highlighting AI implementation and LLM integration expertise, LLM integration, self-hosted AI infrastructure, and practical AI development."
  - Open Graph image (professional headshot)
- [ ] Publish Resume page
- [ ] Test PDF download
- [ ] Review formatting on desktop and mobile
- [ ] Verify structured data with testing tools

**Deliverables:**
- Resume page published with AI skills prominently featured
- Downloadable PDF available
- Schema.org structured data implemented
- SEO optimized
- Download tracking configured

**Estimated Time:** 3-4 hours (resume writing + PDF creation + structured data)

---

### 3.5 Contact Page ⚪ ASSIGNED
**Status:** ⚪ Assigned to Alice
**Agent:** Alice
**Agent Type:** web-content-builder (browser automation)
**Dependencies:** 1.3 (Email configured), 2.2 (Design ready)
**Can Parallel With:** 3.2, 3.3, 3.4

**Tasks:**
- [ ] Create Contact page in Ghost:
  - Access Ghost admin → Pages → New Page
  - Title: "Contact" or "Get in Touch"
  - URL slug: /contact
- [ ] Add contact form (Ghost Pro native forms):
  - Ghost has built-in membership forms, but for custom contact form:
  - Option 1: Use Ghost native form (limited customization)
  - Option 2: Embed external form service (Formspree, Tally, Google Forms)
  - Option 3: Use code injection to create custom form
  - **Recommended: Use Formspree (free tier) or Tally for full control**
- [ ] Configure contact form fields:
  - Name (required)
  - Email (required)
  - Subject (optional)
  - Message (required, textarea)
- [ ] Implement spam protection:
  - Formspree/Tally have built-in spam protection
  - Or add reCAPTCHA if custom form
  - Or use honeypot field (hidden field to catch bots)
- [ ] Configure email routing:
  - Set form to send submissions to Mike's email address
  - Configure email notification settings
  - Set up auto-reply (optional): "Thanks for reaching out! I'll respond soon."
- [ ] Add success/error messaging:
  - Success: "Thank you! Your message has been sent. I'll get back to you soon."
  - Error: "Oops! Something went wrong. Please try again or email me directly at [email]."
- [ ] Add privacy notice:
  - Brief statement: "Your information is only used to respond to your inquiry and is never shared."
- [ ] Integrate Cal.com for meeting scheduling:
  - Sign up for Cal.com account (free tier available)
  - Create meeting types (e.g., "30-min Coffee Chat", "Consultation Call")
  - Get Cal.com embed code or link
  - Add Cal.com to Contact page:
    - Option 1: Embed Cal.com widget inline
    - Option 2: Add button/link to Cal.com scheduling page
  - Configure Cal.com settings (availability, meeting types)
  - Test scheduling flow
- [ ] Add additional contact information:
  - Email address (displayed for direct contact)
  - Social media links
  - Fediverse: @mike@MikeJones.online
  - LinkedIn, GitHub, etc.
- [ ] Write Contact page intro text:
  - Example: "I'd love to hear from you! Whether you have a project idea, want to collaborate, or just want to chat about AI, feel free to reach out."
  - Emphasize openness to opportunities, collaboration, consulting
- [ ] Add SEO metadata:
  - Meta title: "Contact Mike Jones - AI Engineer"
  - Meta description: "Get in touch with Mike Jones to discuss AI projects, consulting opportunities, or collaborations. Schedule a meeting or send a message."
  - Open Graph image
- [ ] Publish Contact page
- [ ] Test contact form submission (send test message)
- [ ] Verify email delivery to your inbox
- [ ] Test Cal.com scheduling flow
- [ ] Test spam protection
- [ ] Review on desktop and mobile

**Deliverables:**
- Contact page published
- Contact form functional and tested
- Email delivery confirmed
- Cal.com integration working
- Spam protection active
- Privacy notice included

**Estimated Time:** 2-3 hours (form setup + Cal.com integration + testing)

---

### 3.6 AI Memory System Case Study ⏸️ DEFERRED TO POST-LAUNCH
**Status:** ⏸️ DEFERRED - Not required for initial launch
**Priority:** Phase 7 (Post-Launch Enhancements)
**Reason:** Local LLM case study already covers memory systems and AI infrastructure
**Agent:** Ted (when post-launch work begins)
**Agent Type:** technical-research (documentation specialist)
**Dependencies:** Post-launch decision
**Note:** Can be added later to showcase cross-platform memory system

**Tasks:**
- [ ] Create case study post in Ghost:
  - Access Ghost admin → Posts → New Post
  - Title: "AI Memory System: Building Personal AI Workflow Automation"
  - URL slug: /ai-memory-system or /projects/ai-memory-system
  - Tags: "AI", "Projects", "AI/ML", "Featured" (for filtering/display)
- [ ] Write case study content following template:

  **1. Introduction/Summary (2-3 paragraphs):**
  - What is the AI Memory System?
  - Why did you build it?
  - What problem does it solve?
  - Quick overview of impact/results

  **2. Problem Section:**
  - Challenge or need that prompted the project
  - Pain points with existing solutions
  - Specific use case or scenario

  **3. Approach Section:**
  - Strategy and methodology
  - Research and planning
  - Technology selection rationale
  - Design decisions

  **4. Solution Section:**
  - Implementation details
  - Architecture overview
  - Technologies used (LLMs, frameworks, languages)
  - Key features and capabilities
  - How it works (user perspective)

  **5. AI & LLM Integration Components Section (CRITICAL for demonstrating expertise):**
  - Specific models used (GPT-4, local LLMs, etc.)
  - Training approaches or fine-tuning (if applicable)
  - AI tooling and frameworks (LangChain, etc.)
  - Prompt engineering techniques
  - LLM integration architecture
  - Challenges overcome in AI implementation
  - Model selection rationale

  **6. Results Section:**
  - Outcomes and impact
  - Metrics or measurable improvements
  - Learnings and insights
  - What worked well
  - What you'd do differently

  **7. Technical Details Section:**
  - Architecture diagrams (add images)
  - Code samples (where appropriate, use syntax highlighting)
  - Configuration examples
  - Deployment approach
  - Infrastructure notes

  **8. Visuals Throughout:**
  - Hero image (screenshot or diagram)
  - Architecture diagrams
  - Screenshots of interface/workflow
  - Demo videos or GIFs (if available)
  - Before/after comparisons

  **9. Conclusion:**
  - Summary of project
  - Future plans or iterations
  - Key takeaways

  **10. Links & Resources:**
  - GitHub repository (if public)
  - Live demo (if available)
  - Related blog posts or documentation
  - Technologies used (with links)

- [ ] Add images and media:
  - Upload images from 3.1 asset collection
  - Add descriptive alt text to all images (accessibility + SEO)
  - Use image captions to add context
  - Ensure images are optimized and load quickly
- [ ] Add AI project badge/tag:
  - Use Ghost tag: "AI/ML" or "Featured AI Project"
  - Or add visual badge via HTML/CSS in content
  - Ensure AI emphasis is clear throughout
- [ ] Add SEO metadata:
  - Meta title: "AI Memory System: Personal AI Workflow Automation | Mike Jones"
  - Meta description: "Case study on building an AI Memory System using LLMs for personal workflow automation. Covers implementation details, prompt engineering, and practical AI integration."
  - Open Graph image (hero image or diagram)
  - Focus keyword: "AI memory system", "LLM workflow automation"
- [ ] Add Schema.org CreativeWork structured data:
  - Add to post header via code injection
  - Include: title, description, author, date, image
  - Validate with Google Rich Results Test
- [ ] Set post as Featured (Ghost feature):
  - Mark post as "Featured" in Ghost editor
  - This allows it to be highlighted on homepage/projects page
- [ ] Publish case study
- [ ] Review formatting on desktop and mobile
- [ ] Verify all images load correctly
- [ ] Test all links
- [ ] Share for feedback (optional)

**Deliverables:**
- AI Memory System case study published
- Comprehensive technical details included
- AI implementation and LLM integration expertise clearly demonstrated
- SEO optimized
- Structured data implemented
- Featured on Projects page

**Estimated Time:** 4-6 hours (in-depth writing + technical content)

**Note:** This case study is CRITICAL for demonstrating AI expertise to potential employers. Invest time in making it comprehensive and technically detailed.

---

### 3.7 Local LLM Setup Case Study 🟡 ALICE ASSIGNED (NEXT)
**Status:** 🟡 ASSIGNED TO ALICE (2026-02-05) - Ted's doc ready
**Technical Doc:** ✅ Complete - Ted's 1,705-line doc + 13 RAG entries ready
**Source:** /content-drafts/local-llm-technical-doc.md
**Next Agent:** Alice (Web-Content-Builder) - STARTING NOW
**Current Activity:** Alice converting Ted's technical documentation to Ghost case study
**Agent Type:** technical-research (documentation specialist)
**Dependencies:** 3.1 (AI project assets ✅), 2.2 (Design ready ✅)
**Can Parallel With:** 3.6, 3.8, 3.9

**Ted's RAG Review Task ✅ COMPLETE (2026-02-04):**
- ✅ Reviewed existing RAG entries for Local LLM and AI Memory
- ✅ Added 13 new comprehensive entries (IDs 108-120)
- ✅ Total RAG entries: 123 (was 110)
- ✅ Comprehensive technical details for case study creation
- ✅ Includes: hardware, models, mcpo bridge, auto-start, Docker, RAG, automation, performance, costs, learning outcomes, challenges, future plans
- ✅ Ready for Alice to use as authoritative source

**Tasks:**
- [ ] Create case study post in Ghost:
  - Title: "Self-Hosted LLM Infrastructure: Building Local AI Capabilities"
  - URL slug: /local-llm-setup or /projects/local-llm-infrastructure
  - Tags: "AI", "Projects", "AI/ML", "Infrastructure", "Featured"
- [ ] Write case study following same template as 3.6:

  **Key sections to emphasize:**
  - **Problem:** Need for self-hosted AI infrastructure (privacy, cost, control)
  - **Approach:** Infrastructure planning, hardware selection, deployment strategy
  - **Solution:** Specific LLM models deployed, serving infrastructure, optimization
  - **AI & LLM Integration Components:**
    - LLM models used (Llama, Mistral, etc.)
    - Serving infrastructure (Ollama, vLLM, TGI, etc.)
    - Model optimization (quantization, pruning)
    - Performance tuning
    - Resource management
  - **Results:**
    - Performance metrics (tokens/sec, latency)
    - Cost comparison vs. API services
    - Capabilities unlocked
    - Use cases enabled
  - **Technical Details:**
    - Hardware specs
    - Architecture diagrams (GPU, networking, storage)
    - Configuration examples
    - Deployment process
    - Monitoring and maintenance

- [ ] Add visuals:
  - Architecture diagrams (system design, data flow)
  - Screenshots (monitoring dashboards, CLI output)
  - Hardware photos (optional but compelling)
  - Performance graphs/charts (if available)
- [ ] Add AI project badge/tag
- [ ] Add SEO metadata:
  - Meta title: "Self-Hosted LLM Infrastructure: Local AI Setup | Mike Jones"
  - Meta description: "Technical case study on building self-hosted LLM infrastructure with local AI models. Covers deployment, optimization, and practical AI infrastructure expertise."
  - Focus keyword: "self-hosted LLM", "local AI infrastructure"
- [ ] Add Schema.org structured data
- [ ] Set as Featured post
- [ ] Publish case study
- [ ] Review and test

**Deliverables:**
- Local LLM Setup case study published
- AI infrastructure expertise demonstrated
- Technical depth and practical implementation shown
- SEO optimized

**Estimated Time:** 4-6 hours (technical writing + diagrams)

---

### 3.8 NeighborhoodShare Case Study ✅ COMPLETE
**Status:** ✅ COMPLETE - Published to Ghost Pro (2026-02-05)
**Completed by:** Alice (Web-Content-Builder)
**Source:** Ted's 2,826-line technical doc + 10 RAG entries
**Agent Type:** web-content-builder
**Dependencies:** 3.1 (Assets ready ✅), Ted's doc complete ✅, Design ready ✅
**Priority:** HIGH - First case study to publish (after Alice finishes current work)
**Instructions Ready:** ALICE-TASK-3.8-INSTRUCTIONS.md + ALICE-NEW-ASSIGNMENT-MESSAGE.md

**Phase 1 Tasks (Ted - Technical Documentation) ✅ COMPLETE:**
- ✅ Conduct structured technical interview with Mike
- ✅ Document full-stack architecture (React + TypeScript + Node.js + PostgreSQL)
- ✅ Capture AI-powered tool categorization (OpenAI GPT-4o Vision)
- ✅ Document dual-authentication state machine (prevents disputes)
- ✅ Detail multi-service integrations (email, SMS, notifications)
- ✅ Explain beta expansion system with Captain governance
- ✅ Record security incident response (API key theft + monitoring)
- ✅ Frame technical success vs. market validation learning
- ✅ Create technical documentation: /content-drafts/neighborhoodshare-technical-doc.md (2,826 lines)
- ✅ Update RAG knowledge base (10 new verified entries)
- ✅ Ready for Alice handoff

**Phase 2 Tasks (Alice - Case Study Creation):**
- [ ] Convert technical doc to compelling Ghost case study
- [ ] Create case study post in Ghost
- [ ] Write case study emphasizing:
  - Full-stack development capabilities
  - Professional engineering practices (test/prod separation)
  - Multi-service integration sophistication
  - Scalability forethought
  - Learning from market validation
- [ ] Add 19 screenshots + 2 logos with descriptions
- [ ] Optimize images with alt text
- [ ] Add SEO metadata
- [ ] Add Schema.org structured data
- [ ] Publish case study

**Key Framing:**
Technical sophistication demonstrated despite market validation showing need for pivot. Showcases full-stack capabilities, integration expertise, and professional development practices.

**Deliverables:**
- Technical documentation (Ted): /content-drafts/neighborhoodshare-technical-doc.md
- Published case study (Alice): /projects/neighborhoodshare
- Demonstrates breadth beyond AI: full-stack, community platform, integrations

**Estimated Time:**
- Ted interview + doc: 1-2 hours
- Alice case study: 3-4 hours
- Total: 4-6 hours

---

### 3.9 MikeJones.online Website & AI Chatbot Case Study ⏸️ POST-LAUNCH (PRIORITY)
**Status:** ⏸️ POST-LAUNCH - Phase 7 (after chatbot implementation)
**Decision Date:** 2026-02-04
**Priority:** Phase 7 - HIGH PRIORITY (after chatbot built in Phase 7.3)
**Dependencies:** Chatbot implementation (Phase 7.3), site complete and live, PROJECT-MEMORY.json completed and refined
**Agent:** Ted (Technical Research) → Alice (Case Study Creation)
**Agent Type:** technical-research → web-content-builder

**Project:** MikeJones.online - Personal Website with AI Integration
**Why this is brilliant:** Meta case study - they're viewing the site ON the site it's about. Demonstrates practical AI implementation in business context.

**What it showcases:**
- RAG knowledge base architecture (123+ verified entries)
- AI chatbot implementation (knowledge base powered)
- Agent coordination and multi-agent workflows
- Content strategy and information architecture
- Ghost Pro platform and theme customization
- SEO and technical optimization
- Project management and execution
- PROJECT-MEMORY.json system (institutional knowledge capture)

**Post-Launch Tasks (Phase 7):**
- [ ] Complete chatbot implementation (Phase 7.3)
- [ ] PROJECT-MEMORY.json maintenance (PM - ongoing after each milestone)
  - Capture all decisions, phases, workflows, challenges, solutions
  - Document technical details of RAG, NATS coordination, Ghost integration
  - Record timeline, metrics, and strategic evolution
  - Refine and complete before Ted's interview (source material)
- [ ] Ted interviews Mike about:
  - Why build a personal site with AI integration
  - RAG knowledge base architecture and curation
  - Agent coordination system (NATS, multiple agents)
  - Ghost Pro platform decisions
  - Chatbot design and knowledge integration
  - Content strategy (case studies, positioning)
  - PROJECT-MEMORY.json system (institutional knowledge)
  - Technical challenges and solutions
- [ ] Document complete tech stack and architecture
- [ ] Create technical documentation
- [ ] Update RAG knowledge base
- [ ] Alice converts to Ghost case study
- [ ] Publish to /projects/mikejones-online or /projects/personal-website-ai-chatbot

**Value when added:**
- Demonstrates AI implementation in practice (not just theory)
- Shows RAG architecture and knowledge curation
- Meta/self-referential (compelling storytelling)
- Real business application of AI
- Project management and execution
- Institutional knowledge capture (PROJECT-MEMORY.json)

**Estimated Time (when executed):**
- Ted interview + doc: 2-3 hours (more complex project)
- Alice case study: 3-4 hours
- Total: 5-7 hours

---

### 3.10 Home Media Server Case Study ⏸️ POST-LAUNCH
**Status:** ⏸️ DEFERRED - Moved to Phase 7 (Post-Launch Enhancements)
**Decision Date:** 2026-02-04
**Priority:** Phase 7 (lower priority than website case study)
**Reason:** Launch with 2 strong AI-focused case studies, add infrastructure projects post-launch
**Agent:** Ted (Technical Research) → Alice (Case Study Creation)
**Agent Type:** technical-research → web-content-builder

**Project:** Home Media Server
**Why defer:** Prioritize speed to launch with laser-focused AI positioning (2 comprehensive AI case studies). Home Media Server showcases different skills (infrastructure/self-hosting) and can be added post-launch.

**Interview script prepared:** `/Users/michaeljones/.claude/agents/Technical-Research-Agent-HomeMediaServer.md` (ready when post-launch work begins)

**Post-Launch Tasks:**
- [ ] Ted conducts technical interview with Mike
- [ ] Document home media server setup and architecture
- [ ] Create technical documentation
- [ ] Update RAG knowledge base
- [ ] Alice converts to Ghost case study
- [ ] Publish to /projects/home-media-server

**Value when added:** Demonstrates infrastructure/systems administration expertise beyond AI projects

**Estimated Time (when executed):**
- Ted interview + doc: 1-2 hours
- Alice case study: 2-3 hours
- Total: 3-5 hours

**Estimated Time:** 3-4 hours per case study

---

### 3.10 Projects Landing Page 🟡 IN PROGRESS
**Status:** 🟡 Alice working now (2026-02-04) - Publishing ahead of case studies
**Agent:** Alice
**Agent Type:** web-content-builder (browser automation)
**Dependencies:** 3.6, 3.7, 3.8 (case studies published) - Working in parallel
**Note:** Can be updated later when case studies are ready

**Tasks:**
- [ ] Create Projects landing page in Ghost:
  - Access Ghost admin → Pages → New Page
  - Title: "Projects" or "Work"
  - URL slug: /projects
- [ ] Design page layout (options):
  - **Option 1:** Use Ghost Collections feature to auto-display posts tagged "Projects"
  - **Option 2:** Manually curate project cards with links to case studies
  - **Option 3:** Use theme's built-in portfolio layout (if available)
  - **Recommended:** Use Ghost Collections for automatic updates as new projects are added
- [ ] Configure Projects display:
  - Filter by tag: "Projects" or "Featured"
  - Show project cards with:
    - Project title
    - Featured image/thumbnail
    - Brief excerpt (auto-generated or custom)
    - "Read More" link to full case study
- [ ] Create AI Projects section/filter:
  - **Option 1:** Add section heading "AI & Machine Learning Projects" with filtered list
  - **Option 2:** Add filter/tab for "AI Projects" vs "All Projects"
  - **Option 3:** Use tags to allow filtering (if theme supports)
  - Ensure AI projects (Memory System, LLM Setup) are prominently featured at top
- [ ] Add visual indicators for AI projects:
  - Badge or tag visible on project cards
  - Icon or color coding
  - "AI/ML" label
- [ ] Write Projects page introduction:
  - Brief overview: "Here's a selection of projects I've built, with a focus on practical AI implementations and full-stack development."
  - Emphasize AI work for employers
- [ ] Organize projects by importance/category:
  - Featured AI projects first
  - Other projects below
  - Consider categories: AI/ML, Web Development, Community Projects, etc.
- [ ] Add SEO metadata:
  - Meta title: "Projects - AI & Development Work by Mike Jones"
  - Meta description: "Portfolio of AI projects, self-hosted LLM infrastructure, and full-stack development work by Mike Jones, including AI Memory System and local AI setups."
  - Open Graph image (project collage or hero image)
- [ ] Publish Projects page
- [ ] Add to navigation (already done in 2.3, verify link works)
- [ ] Review layout on desktop and mobile
- [ ] Test filtering/navigation between projects
- [ ] Verify all case study links work

**Deliverables:**
- Projects landing page published
- AI projects featured prominently with visual indicators
- Easy navigation to all case studies
- SEO optimized
- Mobile responsive

**Estimated Time:** 2-3 hours (layout configuration + content)

---

## Phase 4: Integrations & Features
**Priority:** HIGH (Important for launch, not blocking)
**Dependencies:** Phase 3 (Core content created)
**Duration:** 3-5 days
**Parallelization:** HIGH - most tasks independent (4-5 agents)

### 4.1 SubStack RSS Integration - Resilient Tomorrow
**Agent Type:** general-purpose or Plan (depending on approach complexity)
**Dependencies:** 3.1 (RSS feed URL), 2.2 (Design ready)
**Can Parallel With:** 4.2, 4.3, 4.4

**Tasks:**
- [ ] Choose integration approach for SubStack feeds:

  **Option 1: Ghost Native Embeds (Easiest)**
  - Use Ghost's bookmark card to embed SubStack links
  - Limited automation, manual updates

  **Option 2: Ghost Custom Integration (Medium)**
  - Use Ghost's Public API to fetch posts
  - Create custom page template to display external feeds
  - Requires theme modification

  **Option 3: Zapier/n8n Automation (No-code)**
  - Use automation tool to fetch RSS and create Ghost posts
  - Automated but may cost extra

  **Option 4: Python Script (Post-launch)**
  - Write Python script to parse RSS and create Ghost posts via API
  - Most control, deferred to Phase 7

  **Recommended for launch: Option 1 (Ghost embeds) or Option 2 (custom page)**

- [ ] Implement chosen approach:

  **If Option 1 (Ghost Embeds):**
  - [ ] Create Resilient Tomorrow page in Ghost
  - [ ] Add introduction text about the publication
  - [ ] Use Ghost bookmark cards to embed recent SubStack posts (manual links)
  - [ ] Add "Read More on SubStack" link
  - [ ] Style with custom CSS if needed

  **If Option 2 (Custom Integration):**
  - [ ] Get SubStack RSS feed URL for Resilient Tomorrow
  - [ ] Create custom page template in Ghost theme
  - [ ] Use JavaScript to fetch and parse RSS feed on page load
  - [ ] Display feed content: titles, dates, excerpts, links
  - [ ] Implement caching (localStorage or server-side)
  - [ ] Style feed display to match site design

  **If Option 3 (Automation):**
  - [ ] Set up Zapier or n8n account
  - [ ] Create automation: RSS feed → Ghost posts
  - [ ] Configure to create posts with SubStack tag
  - [ ] Test automation
  - [ ] Set update schedule (daily)

- [ ] Create dedicated page:
  - URL: /resilient-tomorrow or /writing/resilient-tomorrow
  - Title: "Resilient Tomorrow"
  - Add description of publication
  - Display feed content (per chosen method)
- [ ] Add error handling for feed unavailability
- [ ] Test feed display and updates
- [ ] Add to navigation (if not already done in 2.3)
- [ ] Add SEO metadata:
  - Meta title: "Resilient Tomorrow - SubStack by Mike Jones"
  - Meta description: "Latest articles from Resilient Tomorrow, Mike Jones's SubStack publication on [topics]."
  - Canonical links back to SubStack (important for SEO)
- [ ] Publish SubStack page
- [ ] Verify feed content displays correctly
- [ ] Test on mobile

**Deliverables:**
- Resilient Tomorrow feed integrated and displayed
- Page published and accessible
- Feed updating (manually or automatically depending on approach)
- SEO optimized with canonical links

**Estimated Time:** 2-4 hours (depending on approach complexity)

---

### 4.2 SubStack RSS Integration - Operational Intelligence
**Agent Type:** general-purpose or Plan
**Dependencies:** 3.1 (RSS feed URL), 2.2 (Design ready)
**Can Parallel With:** 4.1, 4.3, 4.4

**Tasks:**
- [ ] Follow same approach as 4.1 (Resilient Tomorrow)
- [ ] Create Operational Intelligence page
- [ ] Get SubStack RSS feed URL
- [ ] Implement feed display (same method as 4.1)
- [ ] Ensure separate branding/styling from Resilient Tomorrow:
  - Different color accents if applicable
  - Distinct introduction text
  - Separate navigation placement if needed
- [ ] URL: /operational-intelligence or /writing/operational-intelligence
- [ ] Add error handling
- [ ] Test feed display
- [ ] Add to navigation
- [ ] Add SEO metadata with canonical links
- [ ] Publish page
- [ ] Test on mobile

**Deliverables:**
- Operational Intelligence feed integrated
- Page published with distinct branding
- Feed updating correctly
- SEO optimized

**Estimated Time:** 2-4 hours (reuse approach from 4.1)

---

### 4.3 SEO & Schema.org Implementation
**Agent Type:** general-purpose
**Dependencies:** Phase 3 (All content created)
**Can Parallel With:** 4.1, 4.2, 4.4, 4.5

**Tasks:**
- [ ] Audit all pages for SEO completeness:
  - Homepage, About, Resume, Contact, Projects
  - All case studies
  - SubStack pages
- [ ] Ensure meta descriptions on all pages (unique, compelling, 150-160 chars)
- [ ] Verify Open Graph tags on all pages:
  - og:title
  - og:description
  - og:image (high quality, 1200x630px recommended)
  - og:url
  - og:type
- [ ] Verify Twitter Card tags (if applicable):
  - twitter:card
  - twitter:title
  - twitter:description
  - twitter:image
- [ ] Implement comprehensive Schema.org structured data:

  **Site-wide (add to Ghost Settings → Code Injection → Site Header):**
  - [ ] Person schema (Mike Jones):
    - name, url, image, jobTitle, description
    - sameAs (social profiles)
    - knowsAbout (skills, AI/ML)
  - [ ] WebSite schema:
    - name, url, description
    - potentialAction (SearchAction if site has search)

  **Per-page schemas (add to individual page code injection):**
  - [ ] Article schema for case studies:
    - headline, author, datePublished, dateModified, image, articleBody
  - [ ] CreativeWork schema for projects
  - [ ] ProfilePage schema for About page

  **Resume page:**
  - [ ] Enhanced Person schema with:
    - education, skills, workHistory (if supported)
    - Or use Resume schema if available

- [ ] Create XML sitemap:
  - Ghost auto-generates sitemap at /sitemap.xml
  - [ ] Verify sitemap is accessible
  - [ ] Check that all pages are included
  - [ ] Submit to Google Search Console
  - [ ] Submit to Bing Webmaster Tools
- [ ] Configure robots.txt:
  - Ghost has default robots.txt
  - [ ] Access at /robots.txt
  - [ ] Verify it allows indexing
  - [ ] Add sitemap reference if not present
- [ ] Set up canonical URLs for SubStack content:
  - When displaying SubStack excerpts, use canonical links back to original SubStack posts
  - Prevent duplicate content issues
- [ ] Verify heading hierarchy across all pages:
  - H1 (page title, one per page)
  - H2, H3, H4 in logical order
  - No skipped levels
- [ ] Test structured data:
  - Use Google Rich Results Test: https://search.google.com/test/rich-results
  - Test Person schema
  - Test Article schemas on case studies
  - Fix any errors or warnings
- [ ] Submit sitemap to search engines:
  - Google Search Console
  - Bing Webmaster Tools
- [ ] Verify site is indexable (no noindex tags)
- [ ] Document SEO implementation

**Deliverables:**
- All pages have complete meta descriptions and Open Graph tags
- Schema.org structured data implemented and validated
- XML sitemap accessible and submitted
- Robots.txt configured
- Canonical URLs set for syndicated content
- SEO checklist complete

**Estimated Time:** 3-4 hours (audit + implementation + testing)

---

### 4.4 AEO (ActivityPub/Fediverse Engagement Optimization)
**Agent Type:** general-purpose
**Dependencies:** 2.4 (ActivityPub configured), Phase 3 (Content published)
**Can Parallel With:** 4.1, 4.2, 4.3, 4.5

**Tasks:**
- [ ] Optimize ActivityPub actor profile (@mike@MikeJones.online):
  - Access Ghost admin → Settings → Membership → Fediverse
  - Complete profile bio (compelling, mentions AI implementation and LLM integration)
  - Upload high-quality avatar (headshot)
  - Upload header image (professional banner)
  - Add website link
  - Set profile as "discoverable" (if option exists)
- [ ] Develop hashtag strategy for Fediverse content discovery:
  - Research relevant hashtags:
    - #AI, #MachineLearning, #LLM, #SelfHosted
    - #WebDev, #Python, #IndieWeb
    - #Portfolio, #Projects
  - Create hashtag list for different content types:
    - AI projects: #AI #MachineLearning #LLM #PromptEngineering
    - General projects: #WebDev #Projects #IndieWeb
    - Personal updates (post-launch): #TechLife #Building
  - Document hashtag strategy for future content
- [ ] Optimize Fediverse post previews:
  - Ensure Open Graph images are compelling for Fediverse shares
  - Test how posts appear when shared to Mastodon
  - Adjust image dimensions if needed (Mastodon preview is 1200x628px)
- [ ] Configure post formatting for Fediverse display:
  - Ghost auto-publishes posts to Fediverse
  - Review how Ghost content translates to ActivityPub
  - Check character limits for previews
  - Ensure links, images, and formatting display correctly
- [ ] Verify WebFinger configuration:
  - WebFinger allows discovery via @mike@MikeJones.online
  - Ghost Pro handles this automatically
  - [ ] Test WebFinger by searching for @mike@MikeJones.online on Mastodon
  - [ ] Verify profile appears in Fediverse search
- [ ] Optimize profile completeness for discoverability:
  - All profile fields filled
  - Profile searchable/discoverable
  - Links to website and social profiles
- [ ] Create initial Fediverse introduction post (for Phase 5 testing):
  - Draft introduction post to publish when live:
    - "Hi Fediverse! I'm Mike, an AI engineer and builder. I focus on practical AI implementations, self-hosted LLM infrastructure, and intelligent automation. Check out my work at MikeJones.online #AI #MachineLearning #Introduction"
  - Save as draft for publishing at launch
- [ ] Document Fediverse optimization:
  - Profile settings
  - Hashtag strategy
  - Best practices for content publishing
  - How to monitor Fediverse engagement

**Deliverables:**
- ActivityPub profile complete and optimized
- Hashtag strategy documented
- Fediverse post previews optimized
- WebFinger verified and working
- Profile discoverable on Fediverse
- Introduction post drafted for launch

**Estimated Time:** 2-3 hours (profile optimization + strategy)

---

### 4.5 Performance Optimization
**Agent Type:** general-purpose
**Dependencies:** Phase 3 (Content created with images)
**Can Parallel With:** 4.1, 4.2, 4.3, 4.4

**Tasks:**
- [ ] Audit image optimization:
  - Review all uploaded images in Ghost media library
  - Ensure images are appropriately sized (not oversized)
  - Ghost Pro may auto-optimize, but verify:
    - Images are compressed
    - Responsive images served (different sizes for different screens)
    - Lazy loading enabled (Ghost default behavior)
  - Re-optimize any oversized images if needed
- [ ] Test page load times:
  - Use Google PageSpeed Insights: https://pagespeed.web.dev/
  - Test key pages: Homepage, About, Resume, AI Memory System case study
  - Test on mobile and desktop
  - Target: < 3 seconds load time on 4G connection
  - Note performance scores for each page
- [ ] Run Lighthouse audits:
  - Use Chrome DevTools → Lighthouse
  - Test key pages on mobile and desktop
  - Target scores: 90+ on all metrics:
    - Performance: 90+
    - Accessibility: 90+
    - Best Practices: 90+
    - SEO: 90+
  - Document scores and any issues
- [ ] Address performance bottlenecks:
  - Review Lighthouse recommendations
  - Common issues to check:
    - Image file sizes (compress further if needed)
    - Unused CSS/JS (Ghost Pro optimizes, but check theme)
    - Render-blocking resources
    - Font loading (ensure fonts are optimized)
  - Fix critical issues
  - Re-test after fixes
- [ ] Optimize for mobile performance:
  - Test on actual mobile device if possible
  - Verify images load quickly
  - Check touch targets are appropriately sized (minimum 44px)
  - Ensure text is readable without zooming
  - Test mobile menu performance
- [ ] Verify Ghost Pro CDN is active:
  - Ghost Pro includes CDN (Cloudflare)
  - [ ] Verify images are served from CDN
  - [ ] Check response headers for CDN cache
  - [ ] Confirm CDN is distributing content globally
- [ ] Configure browser caching (if not automatic):
  - Ghost Pro handles caching, but verify:
  - [ ] Check cache headers on static assets
  - [ ] Verify aggressive caching for images, CSS, JS
  - [ ] Check cache-control headers in browser dev tools
- [ ] Minify CSS/JS (if not automatic):
  - Ghost Pro minifies by default in production
  - [ ] Verify minification is active
  - [ ] Check that theme assets are minified
- [ ] Set up performance monitoring:
  - Use Ghost Pro built-in monitoring (if available)
  - Or set up external monitoring:
    - Google Search Console (free, tracks Core Web Vitals)
    - Lighthouse CI for ongoing monitoring (optional)
  - Document monitoring setup
- [ ] Document performance baselines:
  - Record Lighthouse scores for all key pages
  - Note load times
  - Create performance baseline for future comparison
  - Track improvements over time

**Deliverables:**
- All images optimized for web
- Page load times < 3 seconds on 4G
- Lighthouse scores 90+ on all metrics for key pages
- Ghost Pro CDN verified active
- Performance monitoring configured
- Performance baseline documented

**Estimated Time:** 3-4 hours (testing + optimization + monitoring setup)

---

## Phase 5: Testing & Quality Assurance
**Priority:** CRITICAL (Pre-launch blocking)
**Dependencies:** Phases 1-4 (All features complete)
**Duration:** 2-4 days
**Parallelization:** MEDIUM-HIGH - testing tasks can be distributed (4-6 agents)

### 5.1 Cross-Browser Testing
**Agent Type:** general-purpose (browser automation)
**Dependencies:** All content and features complete
**Can Parallel With:** 5.2, 5.3, 5.4

**Tasks:**
- [ ] Test on Chrome/Chromium (latest version):
  - Navigate all pages (Home, About, Resume, Contact, Projects, case studies, SubStack pages)
  - Test navigation (primary, footer, mobile menu)
  - Test contact form submission
  - Test all interactive elements (buttons, links, forms)
  - Test dark mode toggle (if implemented)
  - Verify images display correctly
  - Test responsive design (resize browser)
  - Document any issues
- [ ] Test on Firefox (latest version):
  - Repeat all Chrome tests
  - Pay attention to CSS differences
  - Test form behavior
  - Verify fonts render correctly
  - Document any Firefox-specific issues
- [ ] Test on Safari (latest version, macOS):
  - Repeat all tests
  - Check for Safari-specific CSS issues
  - Test form inputs (Safari handles forms differently)
  - Verify images and media
  - Test responsive behavior
  - Document any Safari-specific issues
- [ ] Test on Edge (latest version):
  - Quick verification (Edge uses Chromium, should match Chrome)
  - Test key pages and functionality
- [ ] Fix browser-specific issues:
  - Address CSS inconsistencies
  - Fix any JavaScript compatibility issues
  - Ensure forms work across all browsers
  - Use CSS vendor prefixes if needed
  - Test fixes in all browsers
- [ ] Re-test after fixes to verify resolution
- [ ] Document browser compatibility:
  - List tested browsers and versions
  - Note any known issues or limitations
  - Confirm cross-browser compatibility

**Deliverables:**
- Site tested on Chrome, Firefox, Safari, Edge
- All functionality works across browsers
- Browser-specific issues resolved
- Cross-browser compatibility confirmed

**Estimated Time:** 2-3 hours (testing across browsers + fixes)

---

### 5.2 Mobile Responsiveness Testing
**Agent Type:** general-purpose (browser automation + manual testing)
**Dependencies:** All content complete
**Can Parallel With:** 5.1, 5.3, 5.4

**Tasks:**
- [ ] Test on mobile screen sizes (320px - 768px):
  - Use Chrome DevTools responsive mode
  - Test common phone sizes:
    - iPhone SE (375x667)
    - iPhone 12/13/14 (390x844)
    - Samsung Galaxy S21 (360x800)
    - Small phone (320px width)
  - Navigate all pages
  - Test mobile menu (hamburger)
  - Verify content reflows correctly
  - Check image scaling
  - Test form inputs on mobile
  - Verify touch targets are large enough (minimum 44x44px)
  - Test scrolling behavior
  - Document mobile issues
- [ ] Test on tablet sizes (768px - 1024px):
  - iPad (768x1024)
  - iPad Pro (1024x1366)
  - Test in portrait and landscape
  - Verify layout adapts appropriately
  - Test navigation behavior
- [ ] Test on desktop sizes (1024px+):
  - Standard desktop (1366x768)
  - Large desktop (1920x1080)
  - Ultra-wide (2560x1440)
  - Verify max-width containers work (content shouldn't stretch too wide)
  - Test navigation behavior
- [ ] Test on actual mobile devices (if possible):
  - iOS device (iPhone):
    - Test in Safari
    - Test touch interactions
    - Verify forms work
    - Test contact form
    - Test Cal.com scheduling
  - Android device:
    - Test in Chrome Mobile
    - Verify all functionality
    - Test forms and interactions
- [ ] Verify responsive design elements:
  - Navigation switches to hamburger menu on mobile
  - Images resize appropriately
  - Text remains readable (no horizontal scrolling)
  - Typography scales correctly (font sizes)
  - Cards/grids reflow (project cards stack on mobile)
  - Forms are usable on small screens
  - Buttons/CTAs are easy to tap (size and spacing)
  - Footer layout adapts
- [ ] Test mobile-specific features:
  - Touch interactions (tap, swipe)
  - Form input zoom behavior (iOS Safari)
  - Orientation change (portrait <-> landscape)
  - Mobile dark mode
- [ ] Fix responsive issues:
  - Adjust CSS media queries if needed
  - Fix any layout breaks
  - Ensure touch targets meet minimum size
  - Fix any mobile form issues
  - Re-test after fixes
- [ ] Document mobile compatibility:
  - List tested devices and screen sizes
  - Note any known mobile limitations
  - Confirm responsive design works across all sizes

**Deliverables:**
- Site fully responsive across all screen sizes (320px - 2560px+)
- Mobile UX optimized
- Touch targets appropriately sized
- Tested on actual devices (iOS and Android)
- Responsive issues resolved

**Estimated Time:** 3-4 hours (extensive testing + fixes)

---

### 5.3 Accessibility Testing
**Agent Type:** general-purpose
**Dependencies:** All content complete
**Can Parallel With:** 5.1, 5.2, 5.4

**Tasks:**
- [ ] Run automated accessibility audit:
  - Use Chrome DevTools → Lighthouse → Accessibility
  - Run on key pages: Home, About, Resume, Projects, case study
  - Target score: 90+ on all pages
  - Note any issues flagged
  - Use axe DevTools extension for detailed scan (optional but recommended)
  - Document automated audit results
- [ ] Verify WCAG 2.1 Level AA compliance manually:

  **Semantic HTML:**
  - [ ] Check proper use of HTML5 semantic elements (<header>, <nav>, <main>, <article>, <footer>)
  - [ ] Verify forms use <label> elements correctly
  - [ ] Check tables use proper markup (if any tables present)

  **Heading Hierarchy:**
  - [ ] Verify H1-H6 hierarchy is logical and not skipped
  - [ ] One H1 per page (page title)
  - [ ] H2 for main sections, H3 for subsections, etc.
  - [ ] Use headings for structure, not just styling

  **Alt Text:**
  - [ ] Verify all images have descriptive alt text
  - [ ] Decorative images should have empty alt="" (not missing)
  - [ ] Alt text is descriptive and meaningful
  - [ ] Logo and icons have appropriate alt text

  **Keyboard Navigation:**
  - [ ] Test navigation using Tab key only (no mouse)
  - [ ] Verify all interactive elements are reachable (links, buttons, forms)
  - [ ] Check focus indicators are visible (outline or custom styling)
  - [ ] Test form submission via keyboard (Enter key)
  - [ ] Ensure no keyboard traps (can escape modals/menus)
  - [ ] Verify tab order is logical

  **Color Contrast:**
  - [ ] Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
  - [ ] Check all text against backgrounds (minimum 4.5:1 for normal text, 3:1 for large text)
  - [ ] Check link colors against backgrounds
  - [ ] Check button text against button backgrounds
  - [ ] Test in dark mode (if implemented)
  - [ ] Fix any contrast failures

  **Skip Navigation Links:**
  - [ ] Add "Skip to main content" link at top of page (hidden until focused)
  - [ ] Verify skip link works (jumps to main content)
  - [ ] Test with keyboard navigation

  **ARIA Labels:**
  - [ ] Check that ARIA labels are used where appropriate:
    - aria-label for icon buttons without text
    - aria-labelledby for complex widgets
    - aria-describedby for form hints
  - [ ] Verify ARIA doesn't override native semantics unnecessarily
  - [ ] Check that ARIA is used correctly (not misused)

- [ ] Test with screen reader:
  - **Mac: VoiceOver (built-in)**
    - [ ] Enable VoiceOver (Cmd+F5)
    - [ ] Navigate homepage with VoiceOver
    - [ ] Test navigation menu
    - [ ] Test reading a case study
    - [ ] Test form interaction (contact form)
    - [ ] Verify all content is accessible
    - [ ] Check that images are described
    - [ ] Ensure links are descriptive
  - **Windows: NVDA (free download)** (if Windows available)
    - [ ] Install NVDA
    - [ ] Repeat VoiceOver tests
    - [ ] Compare experience between screen readers
  - [ ] Document screen reader experience
  - [ ] Fix any screen reader issues
- [ ] Verify form accessibility:
  - [ ] All inputs have associated labels
  - [ ] Error messages are announced (aria-live or role="alert")
  - [ ] Required fields are indicated (aria-required or required attribute)
  - [ ] Form validation is accessible
  - [ ] Success messages are announced
- [ ] Check for accessibility best practices:
  - [ ] Links are descriptive ("Read case study" not "Click here")
  - [ ] Focus management for modals/popups (if any)
  - [ ] No auto-playing media (videos/audio)
  - [ ] Animations respect prefers-reduced-motion
- [ ] Fix accessibility issues:
  - Address Lighthouse/axe findings
  - Fix contrast issues
  - Add missing alt text
  - Improve keyboard navigation
  - Add skip links if missing
  - Re-test with screen reader
- [ ] Document accessibility compliance:
  - WCAG 2.1 Level AA checklist
  - Lighthouse scores
  - Screen reader testing notes
  - Any known limitations or exceptions

**Deliverables:**
- WCAG 2.1 Level AA compliance achieved
- Lighthouse Accessibility score 90+ on all pages
- Screen reader testing passed (VoiceOver/NVDA)
- Keyboard navigation fully functional
- Color contrast meets standards
- Accessibility documentation complete

**Estimated Time:** 3-4 hours (thorough accessibility testing + fixes)

---

### 5.4 ActivityPub Federation Testing
**Agent Type:** general-purpose (browser automation + manual testing)
**Dependencies:** 2.4 (ActivityPub configured), Phase 3 (Content published)
**Can Parallel With:** 5.1, 5.2, 5.3

**Tasks:**
- [ ] Create test Mastodon account (for testing federation):
  - Join a Mastodon instance (mastodon.social or another)
  - Create account for testing purposes
  - Verify account is active
- [ ] Test following from Mastodon:
  - [ ] In Mastodon, search for @mike@MikeJones.online
  - [ ] Verify profile appears in search results
  - [ ] Click "Follow" button
  - [ ] Confirm follow request is accepted
  - [ ] Verify you're now following the Ghost account
- [ ] Test WebFinger lookup:
  - [ ] Use WebFinger checker: https://webfinger.net/
  - [ ] Look up mike@MikeJones.online
  - [ ] Verify WebFinger returns correct ActivityPub actor URL
  - [ ] Confirm profile information is correct
- [ ] Publish test post from Ghost:
  - [ ] Create new post in Ghost (or use existing case study)
  - [ ] Publish post
  - [ ] Wait for federation (may take a few minutes)
  - [ ] Check Mastodon timeline to see if post appears
  - [ ] Verify post content displays correctly in Mastodon
  - [ ] Check images, links, and formatting
  - [ ] Verify post is clickable and links back to Ghost site
- [ ] Test Fediverse engagement:
  - [ ] From Mastodon test account, like the federated post
  - [ ] Boost (reblog) the post
  - [ ] Reply to the post
  - [ ] Wait for sync (may take minutes)
  - [ ] Check Ghost post page for engagement display:
    - Verify likes are shown
    - Verify boosts are counted
    - Verify replies appear (if Ghost displays them)
- [ ] Verify follower count display:
  - [ ] Check if Ghost shows follower count
  - [ ] Verify count includes test Mastodon account
- [ ] Test federation with other ActivityPub platforms (optional but recommended):
  - Pixelfed (if accessible)
  - Friendica
  - Other platforms
  - Verify cross-platform federation works
- [ ] Test profile display on Mastodon:
  - [ ] View @mike@MikeJones.online profile from Mastodon
  - [ ] Verify avatar displays
  - [ ] Verify header image displays
  - [ ] Verify bio is shown
  - [ ] Verify website link works
  - [ ] Check post history appears
- [ ] Test post filtering (if configured to only federate tagged posts):
  - [ ] Publish post without federation tag
  - [ ] Verify it does NOT appear in Mastodon timeline
  - [ ] Publish post with federation tag
  - [ ] Verify it DOES appear in Mastodon timeline
- [ ] Document any federation issues:
  - Posts not appearing (check Ghost config)
  - Engagement not syncing (check ActivityPub settings)
  - Profile information incorrect (update Ghost settings)
  - Delays in federation (note latency)
- [ ] Fix federation issues if found:
  - Review Ghost ActivityPub settings
  - Check DNS and domain configuration
  - Verify HTTPS is working
  - Re-test after fixes
- [ ] Create documentation for Fediverse usage:
  - How followers can subscribe (@mike@MikeJones.online)
  - What content gets federated
  - How to engage from Fediverse platforms
  - Known limitations or behaviors

**Deliverables:**
- ActivityPub federation fully functional
- Posts appearing in Fediverse timelines (Mastodon verified)
- Engagement (likes, boosts, replies) syncing correctly
- Profile discoverable via WebFinger
- Follower count displaying
- Federation tested across platforms (if possible)
- Fediverse usage documented

**Estimated Time:** 2-3 hours (federation testing + fixes)

---

### 5.5 Contact Form & Email Testing
**Agent Type:** general-purpose
**Dependencies:** 3.5 (Contact page), 1.3 (Email configured)
**Can Parallel With:** 5.1, 5.2, 5.3, 5.4

**Tasks:**
- [ ] Test contact form with valid data:
  - [ ] Navigate to /contact page
  - [ ] Fill in form with test data:
    - Name: "Test User"
    - Email: valid email address
    - Subject: "Test Submission"
    - Message: "This is a test message to verify form functionality."
  - [ ] Submit form
  - [ ] Verify success message appears
  - [ ] Check email inbox (Mike's email) for form submission
  - [ ] Verify email received with correct information
  - [ ] Check email formatting and readability
- [ ] Test form validation (required fields):
  - [ ] Try submitting with empty Name field → should show error
  - [ ] Try submitting with empty Email field → should show error
  - [ ] Try submitting with invalid email format → should show error
  - [ ] Try submitting with empty Message → should show error
  - [ ] Verify validation messages are clear and helpful
- [ ] Test spam protection:
  - [ ] Verify honeypot field is hidden (if using honeypot)
  - [ ] Or verify reCAPTCHA appears (if using reCAPTCHA)
  - [ ] Test form submission with spam protection active
  - [ ] Verify legitimate submissions get through
  - [ ] Simulate spam (if using honeypot, fill honeypot field) → should be blocked
- [ ] Test from multiple browsers:
  - [ ] Test contact form in Chrome
  - [ ] Test in Firefox
  - [ ] Test in Safari
  - [ ] Verify form works consistently across browsers
- [ ] Test from mobile devices:
  - [ ] Test form on iOS Safari (actual device if possible)
  - [ ] Test form on Chrome Mobile
  - [ ] Verify mobile keyboard behavior
  - [ ] Check form usability on small screens
  - [ ] Ensure submit button is accessible
- [ ] Test Cal.com integration:
  - [ ] Navigate to Cal.com section on /contact page
  - [ ] Click "Schedule a Meeting" button/link
  - [ ] Verify Cal.com interface loads correctly
  - [ ] Select a meeting time (use test mode if available)
  - [ ] Complete scheduling flow
  - [ ] Verify confirmation email is sent
  - [ ] Check calendar for test meeting (then delete)
  - [ ] Verify mobile experience for Cal.com
- [ ] Test error scenarios:
  - [ ] Temporarily break form (e.g., wrong email service config)
  - [ ] Verify error message displays to user
  - [ ] Fix configuration
  - [ ] Re-test to ensure form works again
- [ ] Verify email deliverability:
  - [ ] Check that emails don't go to spam folder
  - [ ] If emails are in spam, review SPF/DKIM configuration (Ghost Pro should handle this)
  - [ ] Send test email to different providers (Gmail, Outlook, etc.)
  - [ ] Verify delivery across providers
- [ ] Document contact form setup:
  - Form configuration
  - Email routing
  - Spam protection method
  - Cal.com integration
  - Known issues or limitations

**Deliverables:**
- Contact form fully functional and tested
- Form validation working correctly
- Email delivery confirmed to Mike's inbox
- Spam protection active and tested
- Cal.com integration working
- Tested across browsers and devices
- Email deliverability verified

**Estimated Time:** 2-3 hours (comprehensive form/email testing)

---

### 5.6 Security Verification
**Agent Type:** general-purpose
**Dependencies:** Phase 1 (Infrastructure), all features complete
**Can Parallel With:** 5.1, 5.2, 5.3

**Tasks:**
- [ ] Verify HTTPS on all pages:
  - [ ] Navigate to MikeJones.online (HTTP)
  - [ ] Verify automatic redirect to HTTPS
  - [ ] Check all pages load via HTTPS
  - [ ] Verify browser shows secure padlock icon
  - [ ] Check for mixed content warnings (none should appear)
- [ ] Test SSL certificate:
  - [ ] Use SSL Labs test: https://www.ssllabs.com/ssltest/
  - [ ] Enter domain: MikeJones.online
  - [ ] Run test
  - [ ] Verify A or A+ rating
  - [ ] Check certificate validity and expiration date
  - [ ] Verify certificate is issued by Let's Encrypt (Ghost Pro uses Let's Encrypt)
  - [ ] Confirm auto-renewal is configured (Ghost Pro handles this)
- [ ] Check for mixed content:
  - [ ] Open browser dev tools → Console
  - [ ] Navigate all pages
  - [ ] Look for mixed content warnings (HTTP resources on HTTPS page)
  - [ ] If found, update to HTTPS URLs
  - [ ] Re-test to verify no warnings
- [ ] Verify form security:
  - [ ] Check contact form uses HTTPS (should be automatic)
  - [ ] Verify CSRF protection is active (Ghost Pro handles this)
  - [ ] Confirm spam protection is working (tested in 5.5)
  - [ ] Check that sensitive data is not exposed in URLs
- [ ] Test security headers:
  - [ ] Use securityheaders.com: https://securityheaders.com/
  - [ ] Enter domain: MikeJones.online
  - [ ] Run scan
  - [ ] Review security header report
  - [ ] Ghost Pro sets some headers by default:
    - X-Content-Type-Options
    - X-Frame-Options
    - X-XSS-Protection
  - [ ] Note security grade (A, B, C, etc.)
  - [ ] Consider improvements (Ghost Pro may limit customization)
  - [ ] Document security header configuration
- [ ] Verify Ghost Pro backup system:
  - [ ] Access Ghost Pro admin → Settings
  - [ ] Verify automatic backups are enabled (Ghost Pro default)
  - [ ] Check backup frequency (daily)
  - [ ] Confirm backups include:
    - Database (all content)
    - Media files (images, uploads)
    - Theme files
  - [ ] Note backup retention policy
  - [ ] Verify ability to restore from backup (read Ghost Pro docs, don't actually restore)
  - [ ] Document backup configuration
- [ ] Test Ghost Pro security features:
  - [ ] Verify Ghost admin login requires strong password
  - [ ] Check if 2FA is available (enable if so)
  - [ ] Review admin user permissions (if multiple users)
  - [ ] Verify Ghost is up to date (Ghost Pro auto-updates)
- [ ] Check for common vulnerabilities:
  - [ ] Verify admin panel is not publicly accessible without auth (/ghost/ requires login)
  - [ ] Check that sensitive files are not exposed (e.g., config files, .env)
  - [ ] Verify database is not publicly accessible (Ghost Pro handles this)
  - [ ] Confirm no directory listing is enabled
- [ ] Document security configuration:
  - HTTPS and SSL status
  - Security headers configuration
  - Backup system details
  - Ghost admin security settings
  - Any security recommendations or limitations

**Deliverables:**
- HTTPS enabled and verified on all pages
- SSL certificate valid with A/A+ rating
- No mixed content warnings
- Security headers configured
- Ghost Pro backups verified
- Security best practices followed
- Security documentation complete

**Estimated Time:** 2-3 hours (security testing + documentation)

---

### 5.7 Launch Checklist Verification
**Agent Type:** general-purpose
**Dependencies:** All Phase 5 testing tasks (5.1 - 5.6)

**Tasks:**
- [ ] Verify Launch Checklist - ALL ITEMS MUST BE CHECKED:

**Content Complete:**
- [ ] Homepage published and polished
- [ ] About page published
- [ ] Resume/CV page published with PDF download
- [ ] Contact page published with working form
- [ ] AI Memory System case study published
- [ ] Local LLM Setup case study published
- [ ] Projects landing page published
- [ ] At least 1-2 additional case studies published (NeighborhoodShare + one more)
- [ ] SubStack feeds integrated (Resilient Tomorrow + Operational Intelligence)

**Technical Configuration:**
- [ ] Domain (MikeJones.online) pointing to Ghost Pro
- [ ] SSL certificate active and valid (A+ rating)
- [ ] HTTPS redirect working (HTTP → HTTPS)
- [ ] DNS fully propagated
- [ ] Email delivery configured and tested
- [ ] Contact form working and emails routing correctly
- [ ] Cal.com integration working

**Design & UX:**
- [ ] Theme installed and customized
- [ ] Navigation configured (primary and footer)
- [ ] Mobile responsive design verified
- [ ] Dark mode functional (if implemented)
- [ ] AI project visual indicators in place
- [ ] Professional appearance across all pages

**SEO & Discovery:**
- [ ] All pages have unique meta descriptions
- [ ] Open Graph tags on all pages
- [ ] Schema.org structured data implemented
- [ ] XML sitemap accessible (/sitemap.xml)
- [ ] Sitemap submitted to Google Search Console
- [ ] Sitemap submitted to Bing Webmaster Tools
- [ ] Robots.txt configured correctly

**ActivityPub & Federation:**
- [ ] ActivityPub enabled and configured
- [ ] Profile complete (@mike@MikeJones.online)
- [ ] Federation tested with Mastodon
- [ ] Posts appearing in Fediverse timelines
- [ ] WebFinger working
- [ ] Fediverse engagement displaying

**Performance:**
- [ ] Page load time < 3 seconds on 4G
- [ ] Lighthouse Performance score 90+ on key pages
- [ ] Lighthouse Accessibility score 90+
- [ ] Lighthouse Best Practices score 90+
- [ ] Lighthouse SEO score 90+
- [ ] Images optimized (WebP, compressed, lazy loading)
- [ ] Ghost Pro CDN verified active

**Testing:**
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive tested (320px - 2560px+)
- [ ] Accessibility tested (WCAG 2.1 Level AA)
- [ ] Screen reader tested (VoiceOver or NVDA)
- [ ] Keyboard navigation verified
- [ ] Contact form tested and emails received
- [ ] Cal.com scheduling tested
- [ ] ActivityPub federation verified

**Security:**
- [ ] HTTPS on all pages
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Security headers configured
- [ ] Ghost Pro backups verified
- [ ] Form security verified (CSRF, spam protection)

**Analytics & Monitoring:**
- [ ] Analytics configured and tracking
- [ ] Uptime monitoring configured (Ghost Pro or external)
- [ ] SSL expiration monitoring (Ghost Pro auto-renews)
- [ ] Backup notifications configured

**Content Quality:**
- [ ] All content proofread (no typos)
- [ ] All images have alt text
- [ ] All links tested and working
- [ ] 404 page configured (Ghost Pro default)
- [ ] AI expertise prominently featured throughout

- [ ] Create final launch readiness report:
  - Checklist completion status
  - Any outstanding issues or exceptions
  - Performance baseline metrics
  - Launch recommendation (GO / NO-GO)
- [ ] Document launch date target
- [ ] Create pre-launch backup (Ghost Pro automatic)

**Deliverables:**
- Complete launch checklist with all items verified
- Launch readiness report
- All testing documented
- Pre-launch backup confirmed
- Launch approval (GO / NO-GO decision)

**Estimated Time:** 2-3 hours (comprehensive checklist verification + documentation)

---

## Phase 6: Launch
**Priority:** CRITICAL (The big moment!)
**Dependencies:** Phase 5 (All testing complete, launch checklist verified)
**Duration:** 1-2 days

### 6.1 Pre-Launch Final Verification
**Agent Type:** general-purpose
**Dependencies:** 5.7 (Launch checklist complete)

**Tasks:**
- [ ] Final content review:
  - [ ] Read through all pages one more time
  - [ ] Check for typos, grammatical errors
  - [ ] Verify all links work (use link checker tool or manual check)
  - [ ] Ensure all images display correctly
  - [ ] Check that all CTAs are clear and functional
- [ ] Final test of critical user paths:

  **Path 1: Employer browsing portfolio**
  - [ ] Homepage → Projects page → AI Memory System case study
  - [ ] Verify smooth navigation
  - [ ] Check that AI expertise is clear throughout
  - [ ] Verify CTAs work ("Contact", "View Resume")

  **Path 2: Employer reviewing qualifications**
  - [ ] Homepage → Resume page → Download PDF
  - [ ] Verify resume displays correctly
  - [ ] Test PDF download
  - [ ] Check that AI implementation skills are prominent

  **Path 3: Visitor contacting**
  - [ ] Homepage → Contact page → Submit form / Schedule meeting
  - [ ] Test contact form one more time
  - [ ] Test Cal.com scheduling
  - [ ] Verify emails arrive

  **Path 4: Content subscriber**
  - [ ] Homepage → SubStack feed pages → External SubStack link
  - [ ] Verify SubStack content displays
  - [ ] Test links to full articles on SubStack
  - [ ] Check Fediverse follow option

- [ ] Final performance check:
  - [ ] Run Lighthouse on homepage one more time
  - [ ] Verify scores are still 90+
  - [ ] Check page load time
  - [ ] Test on mobile device
- [ ] Final security check:
  - [ ] Verify HTTPS is working
  - [ ] Check SSL certificate is valid
  - [ ] Run quick security headers check
- [ ] Final mobile check:
  - [ ] Test on actual iOS device
  - [ ] Test on actual Android device
  - [ ] Verify all functionality works on mobile
- [ ] Verify monitoring is active:
  - [ ] Check that analytics is tracking
  - [ ] Verify uptime monitoring is configured
  - [ ] Confirm backup system is running
- [ ] Create final pre-launch backup:
  - [ ] Verify Ghost Pro automatic backup is recent
  - [ ] Export content manually as extra precaution (Ghost admin → Labs → Export)
  - [ ] Store export file safely
- [ ] Final review with stakeholder (Mike):
  - [ ] Walk through site
  - [ ] Get final approval to launch
  - [ ] Address any last-minute feedback
  - [ ] Confirm launch timing

**Deliverables:**
- Site verified and ready for public launch
- All critical paths tested and working
- Final backup created
- Stakeholder approval obtained
- Launch timing confirmed

**Estimated Time:** 2-4 hours (thorough final checks)

---

### 6.2 Launch Execution
**Agent Type:** general-purpose
**Dependencies:** 6.1 (Pre-launch verification complete)

**Tasks:**
- [ ] Make site publicly accessible:
  - Ghost Pro sites are public by default
  - [ ] Verify site is not in maintenance mode or password-protected
  - [ ] Confirm site is accessible at MikeJones.online
  - [ ] Remove any "Coming Soon" or placeholder content if present
- [ ] Submit to search engines:

  **Google Search Console:**
  - [ ] Sign up for Google Search Console (if not already done)
  - [ ] Add property: MikeJones.online
  - [ ] Verify ownership (DNS or HTML verification)
  - [ ] Submit sitemap: https://MikeJones.online/sitemap.xml
  - [ ] Request indexing for key pages (homepage, about, resume, top case studies)

  **Bing Webmaster Tools:**
  - [ ] Sign up for Bing Webmaster Tools
  - [ ] Add site: MikeJones.online
  - [ ] Verify ownership
  - [ ] Submit sitemap
  - [ ] Request indexing

- [ ] Publish Fediverse introduction post:
  - [ ] Access Ghost admin
  - [ ] Create new post (or publish draft from Phase 4.4)
  - [ ] Title: "Hello, Fediverse!" or "Introducing MikeJones.online"
  - [ ] Content: Introduction to site, what you do (AI implementation focus), invitation to follow
  - [ ] Include hashtags: #Introduction #AI #MachineLearning #NewWebsite #IndieWeb
  - [ ] Publish post
  - [ ] Verify it federates to Fediverse (check from Mastodon test account)
  - [ ] Engage with any early responses
- [ ] Announce on personal social media:

  **LinkedIn:**
  - [ ] Create post announcing new portfolio site
  - [ ] Emphasize AI implementation focus and projects
  - [ ] Include link: MikeJones.online
  - [ ] Tag relevant contacts or companies if appropriate
  - [ ] Use hashtags: #AI #MachineLearning #Portfolio #WebDevelopment
  - [ ] Post and monitor engagement

  **Twitter/X (if applicable):**
  - [ ] Tweet announcement with link
  - [ ] Highlight AI projects
  - [ ] Use relevant hashtags

  **Other platforms as relevant:**
  - Personal blog
  - Relevant Slack/Discord communities
  - Professional networks

- [ ] Update social media profiles with website link:
  - [ ] LinkedIn: Add MikeJones.online to profile website field
  - [ ] Twitter/X: Add to bio
  - [ ] GitHub: Add to profile
  - [ ] Other profiles: Update as applicable
- [ ] Email announcement to personal network (optional):
  - [ ] Draft email announcing site launch
  - [ ] Send to close contacts, former colleagues, mentors
  - [ ] Keep it brief and personal
  - [ ] Include link and invitation to check it out
- [ ] Monitor for immediate issues:
  - [ ] Watch analytics for traffic spike
  - [ ] Monitor contact form for submissions
  - [ ] Check for any error reports
  - [ ] Monitor Fediverse for engagement
  - [ ] Be ready to respond to feedback or issues quickly
- [ ] Respond to launch day activity:
  - [ ] Reply to comments on social media
  - [ ] Engage with Fediverse responses
  - [ ] Respond to any contact form submissions promptly
  - [ ] Thank people for feedback and shares
- [ ] Document launch:
  - [ ] Record launch date and time
  - [ ] Take screenshots of site at launch
  - [ ] Document initial metrics (analytics baseline)
  - [ ] Note any immediate feedback or issues
  - [ ] Create launch announcement post for devlog (optional)

**Deliverables:**
- Site publicly launched and accessible
- Search engines notified (sitemap submitted)
- Fediverse introduction post published
- Social media announcements made
- Personal network notified
- Social profiles updated with website link
- Launch documented

**Estimated Time:** 3-4 hours (launch activities + monitoring)

---

### 6.3 Post-Launch Monitoring Setup
**Agent Type:** general-purpose
**Dependencies:** 6.2 (Launch complete)

**Tasks:**
- [ ] Set up uptime monitoring:

  **Option 1: Ghost Pro Built-in (if available)**
  - [ ] Check Ghost Pro dashboard for uptime monitoring
  - [ ] Configure alert notifications if available

  **Option 2: UptimeRobot (free tier)**
  - [ ] Sign up for UptimeRobot account
  - [ ] Add monitor: MikeJones.online (HTTPS)
  - [ ] Set check interval (5 minutes recommended)
  - [ ] Configure alert contacts (email, SMS)
  - [ ] Test alert by pausing site briefly (or use test mode)
  - [ ] Document monitoring setup

  **Option 3: Other service** (Pingdom, StatusCake, etc.)
  - [ ] Choose and configure monitoring service
  - [ ] Set up alerts

- [ ] Configure SSL certificate expiration alerts:
  - Ghost Pro auto-renews Let's Encrypt certificates
  - [ ] Verify auto-renewal is active (Ghost Pro handles this)
  - [ ] Optional: Use external SSL monitoring (SSL Labs, Uptime Robot SSL check)
  - [ ] Set alert threshold (e.g., warn 30 days before expiration)
  - [ ] Document SSL monitoring
- [ ] Set up backup success notifications:
  - [ ] Access Ghost Pro admin → Settings
  - [ ] Check for backup notification options
  - [ ] Enable email notifications for backup failures (if available)
  - [ ] Verify daily backup schedule is active
  - [ ] Set up calendar reminder to check backups monthly
  - [ ] Document backup monitoring process
- [ ] Configure ActivityPub federation health monitoring:
  - [ ] Create process to periodically check federation:
    - Weekly: Search for @mike@MikeJones.online from Mastodon
    - Verify profile is discoverable
    - Check that recent posts are appearing in Fediverse
  - [ ] Set up calendar reminder for weekly federation check
  - [ ] Document federation monitoring process
  - [ ] Consider automated monitoring (future enhancement)
- [ ] Set up analytics review schedule:
  - [ ] Create recurring calendar event: "Review website analytics"
  - [ ] Frequency: Weekly (first month), then bi-weekly or monthly
  - [ ] Checklist for analytics review:
    - Check traffic levels
    - Review popular pages
    - Identify traffic sources
    - Track resume downloads
    - Monitor contact form submissions
    - Review search terms (if available)
    - Check for any errors or issues
  - [ ] Document analytics review process
- [ ] Create monitoring dashboard (centralized view):
  - [ ] Compile links to all monitoring tools:
    - Ghost Pro admin dashboard
    - Analytics dashboard
    - Uptime monitoring
    - Google Search Console
    - Bing Webmaster Tools
    - Mastodon/Fediverse account
  - [ ] Bookmark all dashboards for easy access
  - [ ] Create simple document with:
    - Dashboard links
    - Login credentials (stored securely)
    - Monitoring schedule
    - Alert notification methods
  - [ ] Keep dashboard list updated
- [ ] Configure alert notification preferences:
  - [ ] Ensure all monitoring services have correct email/phone for alerts
  - [ ] Set alert severity levels (critical, warning, info)
  - [ ] Configure notification frequency (immediate for critical, daily digest for warnings)
  - [ ] Test alert delivery (send test alert from each service)
  - [ ] Document notification setup
- [ ] Create incident response plan:
  - [ ] Document steps to take if site goes down:
    1. Check Ghost Pro status page
    2. Verify DNS is resolving
    3. Check SSL certificate status
    4. Contact Ghost Pro support if needed
    5. Post status update on social media if extended outage
  - [ ] Document steps for other common issues:
    - Contact form not working
    - Email delivery failures
    - Federation issues
    - Performance degradation
  - [ ] Keep incident response documentation accessible
- [ ] Document all monitoring configurations:
  - List of monitoring tools and services
  - Alert configurations
  - Review schedules
  - Dashboard links
  - Incident response procedures
  - Contact information for support (Ghost Pro, domain registrar, etc.)

**Deliverables:**
- Comprehensive uptime monitoring active
- SSL certificate monitoring configured
- Backup success monitoring in place
- ActivityPub federation monitoring process established
- Analytics review schedule created
- Alert notifications configured and tested
- Monitoring dashboard compiled
- Incident response plan documented
- All monitoring documentation complete

**Estimated Time:** 2-3 hours (monitoring setup + documentation)

---

## Phase 7: Post-Launch Enhancements
**Priority:** MEDIUM (Ongoing improvements after successful launch)
**Dependencies:** Phase 6 (Site launched and stable)
**Duration:** Ongoing
**Parallelization:** HIGH - independent feature additions (3-5 agents)

### 7.1 Remaining Project Case Studies
**Agent Type:** general-purpose (API or browser automation)
**Dependencies:** Launch complete
**Can Parallel With:** 7.2, 7.3, 7.4

**Projects to Complete:**
- Home Management System
- Resilient Tomorrow (SubStack and associated work)
- AirPusher/AirShip involvement
- Burning Man projects
- Any other projects Mike wants to showcase

**Tasks (per case study):**
- [ ] Follow same case study template from Phase 3
- [ ] Write comprehensive case study
- [ ] Add visuals and media
- [ ] Optimize images
- [ ] Add SEO metadata
- [ ] Add Schema.org structured data
- [ ] Publish case study
- [ ] Add to Projects page (automatic if using Ghost Collections)
- [ ] Announce on Fediverse (optional)

**Deliverables:**
- Complete project portfolio published
- All major projects documented
- Comprehensive body of work showcased

**Estimated Time:** 3-4 hours per case study

**Priority:** Complete over time (no rush, add as time permits)

---

### 7.2 Activity Feed Implementation
**Agent Type:** Plan → general-purpose (browser automation)
**Dependencies:** Launch complete, established audience
**Can Parallel With:** 7.1, 7.3, 7.4

**Note:** This is the social media replacement feature for personal updates.

**Tasks:**

**Planning Phase:**
- [ ] Plan Activity Feed architecture:
  - Use Ghost posts with specific tag (e.g., "Activity Feed" or "Update")
  - Create dedicated Activity Feed page or use homepage recent posts
  - Design topic-based filtering approach
  - Plan ActivityPub integration for feed posts
- [ ] Design Activity Feed page layout:
  - Simple chronological feed
  - Compact post format (title, excerpt, date)
  - Filter/tabs for topics
  - RSS feed for Activity Feed specifically
- [ ] Define content types for Activity Feed:
  - Short updates (1-2 paragraphs)
  - Project milestones
  - Personal life updates
  - Links with context
  - Photos/media posts (Instagram-style)

**Implementation Phase:**
- [ ] Create Activity Feed page in Ghost:
  - URL: /activity or /feed or /updates
  - Use Ghost Collections to auto-display posts tagged "Activity"
  - Configure layout for feed display
- [ ] Implement topic-based filtering:
  - Create tags for topics:
    - "Personal" (personal life updates)
    - "ResilientTomorrow" (Resilient Tomorrow content)
    - "VelocityPartners" (Operational Intelligence)
    - "Tech" or "AI" (general tech/AI work)
  - Set up filter/tab interface (may require theme customization or JavaScript)
  - Allow users to view all posts or filter by topic
  - Create RSS feeds per topic (Ghost supports multiple RSS feeds)
- [ ] Configure ActivityPub auto-publishing for Activity Feed:
  - Ensure posts tagged "Activity" federate to Fediverse
  - Test federation for activity feed posts
  - Verify posts appear in followers' timelines
  - Configure hashtags for different topics
- [ ] Set up Ghost mobile app for quick posting:
  - Download Ghost mobile app (iOS/Android)
  - Log in with Ghost Pro credentials
  - Configure for quick post creation
  - Create template or format for activity feed posts
  - Test posting from mobile app
  - Verify posts federate and display correctly
- [ ] Create posting workflow documentation:
  - When to use Activity Feed vs. case study
  - How to tag posts for filtering
  - Hashtag strategy for Fediverse distribution
  - Mobile posting tips
  - Best practices for engagement
- [ ] Add Activity Feed to navigation:
  - Update primary or secondary navigation
  - Link to /activity or /feed
  - Highlight for visitors
- [ ] Create initial activity posts:
  - Write 5-10 initial posts to populate feed
  - Mix of topics (personal, AI work, projects)
  - Test topic filtering
  - Verify federation
- [ ] Add subscription options on Activity Feed page:
  - RSS feed link (all posts or per-topic)
  - Fediverse follow CTA (@mike@MikeJones.online)
  - Email newsletter option (Ghost built-in)
- [ ] Test Activity Feed functionality:
  - Post from web interface
  - Post from mobile app
  - Verify posts appear on Activity Feed page
  - Test topic filtering
  - Check Fediverse federation
  - Test RSS feeds
- [ ] Publish Activity Feed page and announce:
  - Make page public
  - Announce on Fediverse
  - Encourage followers to subscribe to specific topics
  - Begin regular posting cadence

**Deliverables:**
- Activity Feed page live and functional
- Topic-based filtering working
- ActivityPub integration for feed posts verified
- Ghost mobile app configured for quick posting
- Posting workflow documented
- Initial activity posts published
- Subscription options available
- Social media replacement active

**Estimated Time:** 8-12 hours (planning, implementation, testing, initial content)

**Priority:** High for social media replacement, but post-launch timing is flexible

---

### 7.3 Python Integration for SubStack Enhancement
**Agent Type:** general-purpose (Python development)
**Dependencies:** 4.1, 4.2 (SubStack feeds working via Ghost)
**Can Parallel With:** 7.1, 7.2, 7.4

**Note:** This enhances SubStack RSS integration beyond basic Ghost embeds.

**Tasks:**
- [ ] Set up Python development environment:
  - Create Python virtual environment (venv or virtualenv)
  - Install dependencies: feedparser, requests, ghost-api (or similar)
  - Set up Git repository for Python scripts (if not already)
- [ ] Develop Python RSS parser for SubStack:
  - Write script to fetch SubStack RSS feeds
  - Parse feed XML/RSS
  - Extract: title, link, publication date, excerpt/summary, author
  - Handle errors and feed unavailability gracefully
- [ ] Implement advanced caching mechanism:
  - Cache parsed feed content locally (JSON file or database)
  - Set cache expiration (e.g., 24 hours)
  - Only fetch new content when cache expires
  - Reduce API calls and improve performance
- [ ] Integrate with Ghost Admin API:
  - Authenticate with Ghost API (use Ghost API key)
  - Create or update posts in Ghost programmatically
  - Tag posts with "SubStack" and publication name
  - Set canonical URL to original SubStack post
  - Include excerpt and link to full article
- [ ] Add content analysis or enhancement features (optional):
  - Summarize long SubStack posts (use LLM for summarization)
  - Extract keywords or topics
  - Categorize posts automatically
  - Add related posts suggestions
- [ ] Create automation scripts for feed updates:
  - Script to fetch and sync SubStack RSS to Ghost
  - Run on schedule (daily via cron job or task scheduler)
  - Log sync activity (successful updates, errors)
  - Send notification if sync fails
- [ ] Set up scheduled execution:
  - Create cron job (Linux/Mac) or Task Scheduler (Windows) entry
  - Run Python script daily (e.g., 6am)
  - Ensure script runs in virtual environment
  - Log output to file for debugging
- [ ] Test Python integrations:
  - Run script manually and verify Ghost posts are created/updated
  - Test caching behavior
  - Test error handling (simulate feed unavailable)
  - Verify scheduled execution works
  - Check logs for issues
- [ ] Document Python scripts and setup:
  - README with setup instructions
  - Script usage documentation
  - Cron job configuration
  - Troubleshooting guide
  - Code comments for maintainability

**Deliverables:**
- Python RSS parser for SubStack feeds
- Advanced caching implemented
- Ghost API integration working
- Automated scheduled feed syncing
- Enhanced SubStack integration beyond Ghost defaults
- Scripts documented and maintainable

**Estimated Time:** 8-12 hours (development + testing + automation setup)

**Priority:** Medium - nice enhancement but not critical (Phase 4 Ghost embeds sufficient for launch)

---

### 7.4 Additional Integrations & Features
**Agent Type:** Plan → general-purpose
**Dependencies:** Launch complete
**Can Parallel With:** 7.1, 7.2, 7.3

**Future Integrations (prioritize based on need):**

**Bluesky Cross-Posting:**
- [ ] Research Bluesky AT Protocol integration
- [ ] Sign up for Bluesky account
- [ ] Explore cross-posting options (API, third-party tools)
- [ ] Implement cross-posting from Ghost to Bluesky
- [ ] Test and document

**GitHub Integration:**
- [ ] Display GitHub repositories on Projects page or homepage
- [ ] Use GitHub API to fetch public repos
- [ ] Show contribution graph or activity
- [ ] Link to GitHub profile prominently
- [ ] Implement and test

**LinkedIn Cross-Posting:**
- [ ] Research LinkedIn API or automation tools
- [ ] Set up LinkedIn cross-posting for professional updates
- [ ] Configure selective posting (not all Activity Feed posts)
- [ ] Test and document

**Enhanced Calendar/Booking:**
- [ ] Expand Cal.com integration
- [ ] Add multiple meeting types
- [ ] Integrate with Google Calendar or other calendars
- [ ] Embed calendar availability on site
- [ ] Test and document

**Newsletter Features:**
- [ ] Activate Ghost's built-in newsletter functionality
- [ ] Design newsletter template
- [ ] Set up email sequences or campaigns
- [ ] Grow newsletter subscribers
- [ ] Track newsletter metrics

**Search Functionality:**
- [ ] Implement site search (Ghost has basic search)
- [ ] Configure search to index all content
- [ ] Add search bar to navigation
- [ ] Test search relevance
- [ ] Document search setup

**Comment System:**
- [ ] Evaluate comment options:
  - Ghost native comments
  - Disqus
  - Commento
  - Fediverse comments (via ActivityPub)
- [ ] Implement chosen comment system
- [ ] Test and moderate
- [ ] Document comment policy

**Tasks (per integration):**
- [ ] Plan integration approach
- [ ] Research tools/APIs
- [ ] Implement integration
- [ ] Test functionality thoroughly
- [ ] Document setup and usage
- [ ] Announce new feature

**Deliverables:**
- Additional integrations implemented based on priority
- Enhanced platform connectivity
- Broader audience reach
- Improved site functionality

**Estimated Time:** Varies by integration (4-12 hours each)

**Priority:** Flexible - add based on user need and strategic value

---

### 7.5 Content & SEO Optimization
**Agent Type:** general-purpose
**Dependencies:** Launch complete, analytics data available (3+ months)
**Can Parallel With:** 7.1, 7.2, 7.3, 7.4

**Tasks:**
- [ ] Review analytics for insights:
  - Access Ghost Analytics or external analytics dashboard
  - Review 3+ months of traffic data
  - Identify popular content (most viewed pages/posts)
  - Identify underperforming pages (high bounce rate, low time on page)
  - Analyze traffic sources (organic search, social, referral, direct)
  - Review user behavior (pages per session, navigation patterns)
  - Track goal completions (contact form, resume downloads)
- [ ] Optimize content based on user behavior:
  - **For popular content:**
    - Enhance with more detail or updates
    - Add related content links (internal linking)
    - Ensure CTAs are prominent (contact, other projects)
    - Create similar content to capitalize on interest
  - **For underperforming content:**
    - Analyze why it's underperforming (boring topic, bad SEO, poor presentation)
    - Improve content quality
    - Enhance SEO (better keywords, meta descriptions)
    - Consider consolidating or removing if not valuable
- [ ] Enhance SEO based on search data:
  - Review Google Search Console data:
    - Keywords driving traffic
    - Impression share (pages shown in search but not clicked)
    - Click-through rates
    - Average search position
  - Identify keyword opportunities (high impressions, low clicks)
  - Optimize pages for target keywords:
    - Update titles and headings
    - Improve meta descriptions to increase CTR
    - Add relevant content for keyword coverage
    - Build internal links with keyword-rich anchor text
  - Track ranking improvements over time
- [ ] Improve internal linking:
  - Audit internal links across site
  - Add contextual links between related content:
    - Link from About page to AI projects
    - Link from case studies to related projects
    - Link from homepage to deep content
  - Use descriptive anchor text (not "click here")
  - Create content hub structure (pillar pages + related posts)
  - Improve navigation to important pages
- [ ] Expand AI project showcases:
  - As new AI projects are developed:
    - Create new case studies following established template
    - Emphasize technical details and AI expertise
    - Link to existing AI content
    - Tag appropriately for filtering
  - Update existing AI case studies with new learnings
  - Add demo videos or interactive elements
  - Ensure AI projects remain prominently featured
- [ ] Regular content updates and refreshes:
  - Set up quarterly content review process
  - Update outdated information (technologies, tools, project status)
  - Add new accomplishments to About and Resume pages
  - Refresh homepage with latest projects or updates
  - Maintain content accuracy and relevance
- [ ] Create additional content types (as needed):
  - Write technical blog posts (deep dives on AI topics)
  - Create tutorials or guides (how-to content)
  - Publish project updates (Activity Feed)
  - Share learning and insights
  - Build content library to attract organic traffic
- [ ] Build backlinks and external visibility:
  - Share content on relevant platforms (Reddit, HN, Dev.to)
  - Guest post on other blogs or publications
  - Participate in communities and link to portfolio
  - Get listed in directories (AI implementation portfolios, developer showcases)
  - Track backlinks via Google Search Console
- [ ] Monitor and iterate:
  - Continue monthly analytics reviews
  - Track SEO progress (rankings, traffic, conversions)
  - A/B test CTAs and messaging (if traffic sufficient)
  - Gather user feedback (contact form, social media)
  - Continuously improve content and SEO

**Deliverables:**
- Ongoing content optimization based on data
- Improved search rankings and organic traffic
- Enhanced user engagement (lower bounce rate, more pageviews)
- Expanded content library
- Stronger internal linking structure
- Regular content updates and freshness
- Growing portfolio of AI projects

**Estimated Time:** 4-8 hours per quarter (ongoing activity)

**Priority:** Ongoing maintenance and optimization for long-term success

---

### 7.6 RAG-Powered AI Chatbot
**Agent Type:** Plan → general-purpose (or specialized development agent)
**Dependencies:** Core website content published and live
**OpenSpec Change:** `add-rag-chatbot` (see `/openspec/changes/add-rag-chatbot/`)
**Can Parallel With:** 7.1, 7.2, 7.3, 7.4, 7.5

**Overview:**
Add an AI-powered chatbot widget that answers visitor questions about Mike's work, experience, and projects using the 70-entry RAG knowledge base created during content extraction. Demonstrates practical AI implementation skills while providing 24/7 visitor engagement and lead qualification.

**Implementation Phases:**

**Phase 1: MVP (2-3 weeks)**
- [ ] Review and approve OpenSpec proposal (`/openspec/changes/add-rag-chatbot/proposal.md`)
- [ ] Decide on architecture (recommended: Serverless with Cloudflare Workers + OpenAI API)
- [ ] Decide on AI provider (OpenAI GPT-3.5 or GPT-4 Turbo recommended for MVP)
- [ ] Answer open questions (privacy level, conversation persistence, rate limits)
- [ ] Backend implementation:
  - [ ] Set up Cloudflare Workers project
  - [ ] Integrate 70-entry JSONL knowledge base
  - [ ] Implement RAG retrieval system (keyword-based for MVP)
  - [ ] Integrate OpenAI API for response generation
  - [ ] Add rate limiting (10 messages/visitor/hour, 100/IP/day)
  - [ ] Create POST /chat endpoint
  - [ ] Test backend thoroughly
- [ ] Frontend widget development:
  - [ ] Build chat widget (minimized and expanded states)
  - [ ] Implement conversation UI (messages, input, send button)
  - [ ] Add suggested questions display
  - [ ] Make responsive (desktop 400x600px, mobile full-screen)
  - [ ] Ensure WCAG 2.1 AA accessibility compliance
  - [ ] Test across browsers and devices
- [ ] Ghost integration:
  - [ ] Add widget via Ghost Admin → Code Injection (Site Footer)
  - [ ] Configure widget settings (API endpoint, theme, greeting)
  - [ ] Test on staging environment
  - [ ] Deploy to production
- [ ] Analytics setup:
  - [ ] Track conversation volume and topics
  - [ ] Log unhandled questions for knowledge base expansion
  - [ ] Monitor CTA clicks (contact/schedule)
  - [ ] Set up performance monitoring (response times, error rates)
- [ ] Launch MVP:
  - [ ] Deploy backend to Cloudflare Workers (production)
  - [ ] Deploy widget to CDN
  - [ ] Enable on mikejones.online
  - [ ] Monitor first 24 hours closely
  - [ ] Collect initial feedback

**Phase 2: Enhanced Features (1-2 weeks, post-MVP)**
- [ ] UX improvements:
  - [ ] Add "Learn more" links to relevant pages
  - [ ] Integrate Cal.com for direct scheduling from chat
  - [ ] Improve conversation context awareness
  - [ ] Add conversation history (optional, localStorage)
  - [ ] A/B test greeting messages
- [ ] Analytics enhancements:
  - [ ] Build analytics dashboard
  - [ ] Add advanced topic clustering
  - [ ] Conversion funnel analysis
- [ ] Knowledge base expansion:
  - [ ] Analyze unhandled questions from Phase 1
  - [ ] Add 20-30 new RAG entries based on gaps
  - [ ] Improve fit_assessment entries
  - [ ] Add more qa_pair entries for common questions

**Phase 3: Self-Hosted Option (Optional, 2-3 weeks)**
- [ ] Infrastructure setup:
  - [ ] Provision VPS (can share with Ghost if self-hosted)
  - [ ] Install Ollama and local LLM (Qwen 2.5:14B)
  - [ ] Set up vector database (ChromaDB or Qdrant)
  - [ ] Build Python FastAPI backend
  - [ ] Implement embedding-based RAG retrieval
- [ ] Migration:
  - [ ] Test response quality vs OpenAI baseline
  - [ ] Implement gradual traffic migration
  - [ ] Monitor performance and accuracy
  - [ ] Document cost savings
  - [ ] Update documentation for self-hosted approach

**Deliverables:**
- **Phase 1:** Working chatbot on all pages, answers questions from knowledge base, mobile responsive, basic analytics
- **Phase 2:** Enhanced UX, Cal.com integration, expanded knowledge base, improved analytics
- **Phase 3:** Fully self-hosted chatbot with no API dependencies (optional)

**Estimated Time:**
- Phase 1 (MVP): 2-3 weeks
- Phase 2 (Enhanced): 1-2 weeks
- Phase 3 (Self-hosted): 2-3 weeks

**Cost Estimate:**
- Cloudflare Workers: Free tier (100k requests/day)
- OpenAI API: ~$10-30/month (estimated for normal traffic)
- Total MVP cost: $10-30/month ongoing
- Self-hosted (Phase 3): One-time setup, $0/month API costs (VPS shared with other projects)

**Success Metrics (First 3 Months):**
- 10-20% of visitors interact with chatbot
- Average 3-5 messages per conversation
- < 10% "I don't know" responses
- 5-10% of conversations end with contact/schedule click

**Priority:** High post-launch enhancement - demonstrates AI expertise, provides visitor value, leverages existing knowledge base

**Documentation:**
- **OpenSpec Proposal:** `/openspec/changes/add-rag-chatbot/proposal.md`
- **Implementation Tasks:** `/openspec/changes/add-rag-chatbot/tasks.md`
- **Design Document:** `/openspec/changes/add-rag-chatbot/design.md`
- **Spec (Requirements):** `/openspec/changes/add-rag-chatbot/specs/chatbot/spec.md`
- **Feature Specification:** `/plans/chatbot-feature-specification.md`
- **Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl`
- **RAG Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`

**Validation:**
```bash
# Verify OpenSpec change is valid
cd /Users/michaeljones/dev/MJ_Online
openspec validate add-rag-chatbot --strict --no-interactive
# Status: ✅ Valid
```

**Next Steps:**
1. Review OpenSpec proposal and approve
2. Make architecture and AI provider decisions
3. Begin Phase 1 implementation (backend development)
4. Track progress via OpenSpec tasks.md checklist

---

### 7.7 Job Fit Analyzer Tool
**Agent Type:** Plan → general-purpose (or specialized development agent)
**Dependencies:** Core website content published and live
**OpenSpec Change:** `add-job-fit-analyzer` (see `/openspec/changes/add-job-fit-analyzer/`)
**Can Parallel With:** 7.1, 7.2, 7.3, 7.4, 7.5, 7.6 (or implement after chatbot to share infrastructure)

**Overview:**
Add a dedicated page (`/fit-analyzer`) where potential employers can paste a job description and receive an AI-powered analysis of Mike's fit for the role. Provides structured breakdown of strengths, gaps, and discussion areas. Demonstrates advanced AI capabilities while qualifying leads before initial contact.

**Key Features:**
- Dedicated page with simple form (paste JD → get analysis)
- Structured analysis output:
  - **Overall Fit Score:** High/Medium/Low (80%+, 60-79%, <60%)
  - **Strong Matches:** Where Mike excels (skills, experience, industry, role type)
  - **Potential Gaps:** Missing requirements with severity levels
  - **Discussion Areas:** Topics needing clarification with suggested questions
- Contextual CTAs based on fit score (Schedule Call, Contact, Explore Projects)
- Privacy-first: Job descriptions analyzed and discarded (not stored)
- Fast analysis: < 60 seconds end-to-end

**Implementation Phases:**

**Phase 1: MVP (3-4 weeks)**
- [ ] Review and approve OpenSpec proposal (`/openspec/changes/add-job-fit-analyzer/proposal.md`)
- [ ] Answer open questions (analysis depth, scoring display, lead capture, navigation links)
- [ ] Decide on shared vs standalone backend (can share with chatbot if exists)
- [ ] Page design and frontend:
  - [ ] Create `/fit-analyzer` page in Ghost
  - [ ] Design form with textarea (500-5000 chars)
  - [ ] Design results display (4 sections: overall, matches, gaps, discussion)
  - [ ] Add visual indicators (colors, icons, badges)
  - [ ] Ensure WCAG 2.1 AA accessibility
  - [ ] Test across browsers and devices
- [ ] Backend implementation:
  - [ ] Create job description parser (extract requirements)
  - [ ] Build RAG retrieval (match JD to knowledge base)
  - [ ] Implement weighted scoring algorithm (skills 40%, exp 30%, industry 20%, role 10%)
  - [ ] Integrate OpenAI GPT-4 Turbo (recommended for accuracy)
  - [ ] Generate structured JSON analysis
  - [ ] Add rate limiting (3/hour, 20/day per IP)
  - [ ] Test with 20+ real job descriptions
- [ ] Ghost integration:
  - [ ] Publish page on production site
  - [ ] Add navigation links (main nav, Resume page, About page)
  - [ ] Configure analytics tracking
- [ ] Launch MVP:
  - [ ] Deploy backend to Cloudflare Workers
  - [ ] Enable on mikejones.online
  - [ ] Monitor first 50 analyses
  - [ ] Validate accuracy manually

**Phase 2: Enhanced Features (1-2 weeks, post-MVP)**
- [ ] Visual enhancements:
  - [ ] Add fit score gauge/chart
  - [ ] Create skill match matrix
  - [ ] Improve results layout with tabs or cards
  - [ ] Add animations for results reveal
- [ ] Export and sharing:
  - [ ] Implement PDF export of analysis
  - [ ] Add "Email Results" feature
  - [ ] Generate shareable link (for hiring teams)
  - [ ] Print-friendly stylesheet
- [ ] Lead capture (optional):
  - [ ] Add optional email field
  - [ ] Track lead quality (fit score vs conversion)

**Phase 3: Advanced Features (Optional, 2-3 weeks)**
- [ ] Multi-job comparison (save multiple analyses, compare side-by-side)
- [ ] Enhanced semantic matching (vector embeddings, not just keywords)
- [ ] Fit history and trends (aggregate patterns)
- [ ] Integration with chatbot ("Ask me about [specific experience]")

**Deliverables:**
- **Phase 1:** Working fit analyzer on dedicated page, accurate structured analysis, privacy-compliant, mobile responsive
- **Phase 2:** Visual enhancements, PDF export, optional lead capture
- **Phase 3:** Advanced features (multi-job comparison, enhanced matching)

**Estimated Time:**
- Phase 1 (MVP): 3-4 weeks
- Phase 2 (Enhanced): 1-2 weeks
- Phase 3 (Advanced): 2-3 weeks (optional)

**Cost Estimate:**
- Cloudflare Workers: Free tier (shared with chatbot)
- OpenAI API (GPT-4 Turbo): ~$0.05-0.10 per analysis
- Estimated traffic: 50-150 analyses/month
- Total: $5-15/month additional (on top of chatbot costs)

**Success Metrics (First 3 Months):**
- 5-15% of visitors use the tool
- Average analysis time: < 60 seconds
- 30-50% of analyses result in "High Fit" score
- 15-25% of tool users click "Contact Mike" or "Schedule Call"
- 90%+ accuracy (validated by manual review)
- Higher quality inbound inquiries (pre-qualified)

**Priority:** High post-launch enhancement - directly serves primary audience (employers), demonstrates AI expertise, qualifies leads

**Documentation:**
- **OpenSpec Proposal:** `/openspec/changes/add-job-fit-analyzer/proposal.md`
- **Implementation Tasks:** `/openspec/changes/add-job-fit-analyzer/tasks.md` (120+ tasks)
- **Design Document:** `/openspec/changes/add-job-fit-analyzer/design.md`
- **Spec (Requirements):** `/openspec/changes/add-job-fit-analyzer/specs/job-fit-analyzer/spec.md`
- **Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl` (shared with chatbot)
- **RAG Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`

**Validation:**
```bash
# Verify OpenSpec change is valid
cd /Users/michaeljones/dev/MJ_Online
openspec validate add-job-fit-analyzer --strict --no-interactive
# Status: ✅ Valid
```

**Synergy with Chatbot (Phase 7.6):**
- Both use same 70-entry knowledge base
- Both use RAG retrieval + AI analysis
- Can share backend infrastructure (same Cloudflare Workers)
- Complementary tools:
  - Chatbot: Exploratory conversation, general questions
  - Fit Analyzer: Specific task, job-focused assessment
- Cross-promotion: Chatbot can suggest fit analyzer, fit analyzer can link to chatbot

**Next Steps:**
1. Review OpenSpec proposal and approve
2. Make architecture decisions (shared vs standalone backend)
3. Begin Phase 1 implementation (page design first)
4. Track progress via OpenSpec tasks.md checklist

---

## Phase 8: Optional VPS Migration (Future)
**Priority:** LOW (Only when ready to manage infrastructure)
**Dependencies:** Ghost Pro running successfully, ready to take on server management
**Duration:** 1-2 weeks

**Note:** This phase is OPTIONAL and only relevant when Mike decides to migrate from Ghost Pro to self-hosted VPS (e.g., to manage multiple projects on one server, reduce costs long-term, or gain more control).

### 8.1 VPS Migration Planning
**Agent Type:** Plan
**Dependencies:** Decision to migrate made

**Tasks:**
- [ ] Evaluate reasons to migrate:
  - Cost savings long-term (VPS cheaper than Ghost Pro for multiple sites)
  - Need for custom server configuration
  - Running additional projects on same server
  - Learning/skill development (server management)
- [ ] Plan migration approach:
  - Set up new VPS (DigitalOcean, Linode, etc.)
  - Install Ghost on VPS following Phase 1 tasks from original roadmap
  - Export content from Ghost Pro
  - Import to self-hosted Ghost
  - Switch DNS to point to new VPS
  - Test thoroughly before cutting over
- [ ] Identify risks and mitigation:
  - Downtime during migration (minimize with careful planning)
  - Data loss (ensure complete backups)
  - Email delivery issues (reconfigure)
  - SSL certificate transition (Let's Encrypt on new server)
- [ ] Create migration timeline and checklist
- [ ] Document migration plan

**Deliverables:**
- Migration plan with steps and timeline
- Risk assessment and mitigation strategies
- Decision to proceed or stay on Ghost Pro

**Estimated Time:** 2-4 hours (planning)

---

### 8.2 VPS Setup & Ghost Installation
**Agent Type:** Bash + general-purpose
**Dependencies:** 8.1 (Migration plan approved)

**Tasks:**
- Follow original roadmap Phase 1 (Foundation & Infrastructure):
  - [ ] Provision VPS server
  - [ ] Configure server security
  - [ ] Install Node.js, MySQL/SQLite
  - [ ] Install Ghost CMS
  - [ ] Configure Nginx
  - [ ] Set up SSL certificate (Let's Encrypt)
  - [ ] Configure email delivery (SendGrid, Mailgun, or SMTP)
  - [ ] Set up backup system
- [ ] Test new Ghost installation
- [ ] Verify all infrastructure is working

**Deliverables:**
- VPS server running Ghost CMS
- Infrastructure configured and tested
- Ready for content migration

**Estimated Time:** 1 week (server setup, following original Phase 1 roadmap)

---

### 8.3 Content & Configuration Migration
**Agent Type:** general-purpose
**Dependencies:** 8.2 (New Ghost installed on VPS)

**Tasks:**
- [ ] Export content from Ghost Pro:
  - Access Ghost Pro admin → Settings → Labs
  - Click "Export your content"
  - Download JSON export file
  - Verify export includes all posts, pages, tags, users
- [ ] Import content to self-hosted Ghost:
  - Access new Ghost admin → Settings → Labs
  - Click "Import content"
  - Upload JSON export file
  - Verify import completes successfully
  - Review imported content for completeness
- [ ] Migrate theme and customizations:
  - Download theme from Ghost Pro (if custom theme)
  - Upload theme to self-hosted Ghost
  - Reapply any code injections (Settings → Code injection)
  - Reapply design customizations
- [ ] Reconfigure integrations:
  - Set up ActivityPub (should work automatically)
  - Reconfigure analytics
  - Reconfigure email delivery
  - Set up SubStack RSS integrations
  - Test all integrations
- [ ] Verify content migration:
  - Check all pages and posts
  - Verify images migrated correctly
  - Test navigation and links
  - Review SEO settings (should migrate with content)

**Deliverables:**
- All content migrated to self-hosted Ghost
- Theme and customizations replicated
- Integrations reconfigured and tested
- Content verified complete

**Estimated Time:** 1-2 days (migration + verification)

---

### 8.4 DNS Cutover & Go-Live
**Agent Type:** general-purpose
**Dependencies:** 8.3 (Content migrated and tested)

**Tasks:**
- [ ] Final testing on new VPS Ghost instance:
  - Test all pages and functionality
  - Verify HTTPS working
  - Test contact form and email delivery
  - Test ActivityPub federation
  - Run performance tests
- [ ] Plan DNS cutover:
  - Choose low-traffic time for cutover
  - Prepare rollback plan (can point DNS back to Ghost Pro if issues)
  - Communicate any expected downtime
- [ ] Update DNS records:
  - Change A record to point to VPS IP address (instead of Ghost Pro)
  - Wait for DNS propagation (can take up to 48 hours, often faster)
  - Monitor DNS propagation (use tools like whatsmydns.net)
- [ ] Monitor cutover:
  - Watch for traffic on new server (analytics, server logs)
  - Verify site accessible at MikeJones.online
  - Test functionality post-cutover
  - Monitor for any errors or issues
- [ ] Verify SSL and HTTPS:
  - Confirm SSL certificate is valid on new server
  - Verify HTTPS redirect working
  - Test across browsers
- [ ] Test all functionality on live site:
  - Contact form
  - Cal.com integration
  - ActivityPub federation
  - SubStack feeds
  - All links and pages
- [ ] Decommission Ghost Pro (after stable on VPS):
  - Keep Ghost Pro active for 1-2 weeks as backup
  - Verify all traffic is on new VPS
  - Cancel Ghost Pro subscription (after safe migration confirmed)

**Deliverables:**
- DNS cutover complete
- Site live on self-hosted VPS
- All functionality verified
- Ghost Pro decommissioned
- Migration successful

**Estimated Time:** 2-3 days (cutover + monitoring + verification)

---

### 8.5 Post-Migration Monitoring & Optimization
**Agent Type:** general-purpose
**Dependencies:** 8.4 (Migration complete)

**Tasks:**
- [ ] Set up comprehensive monitoring on VPS:
  - Server monitoring (CPU, RAM, disk usage)
  - Uptime monitoring (UptimeRobot or similar)
  - Log monitoring (error logs, access logs)
  - Security monitoring (fail2ban, firewall logs)
- [ ] Optimize VPS performance:
  - Configure server caching
  - Optimize Nginx configuration
  - Set up CDN (Cloudflare free tier or similar)
  - Optimize database performance
- [ ] Establish maintenance routine:
  - Weekly: Review server logs, check backups
  - Monthly: Apply security updates, optimize database
  - Quarterly: Review performance, adjust resources as needed
- [ ] Document server management:
  - Server credentials and access
  - Backup procedures
  - Update procedures
  - Troubleshooting guides
  - Incident response plan

**Deliverables:**
- VPS fully monitored and optimized
- Maintenance routine established
- Server management documented
- Self-hosted Ghost running smoothly

**Estimated Time:** 1 week (setup + documentation)

---

## Summary: Ghost Pro vs. VPS Migration

### Start with Ghost Pro (Recommended):
- ✅ Fast launch (1-2 weeks)
- ✅ No server management
- ✅ Professional infrastructure
- ✅ $25/month
- ✅ Focus on content and features

### Migrate to VPS Later (Optional, when ready):
- ✅ Cost savings long-term ($15-20/month)
- ✅ Full control over server
- ✅ Can host multiple projects
- ✅ Learning opportunity
- ⚠️ Requires server management skills
- ⚠️ Ongoing maintenance responsibility
- ⚠️ 1-2 weeks migration effort

**Migration makes sense when:**
- Running multiple Ghost sites (share one VPS)
- Need custom server configuration
- Want to reduce costs long-term
- Ready to manage server infrastructure
- Have time for maintenance

---

## Agent Assignment Summary (Ghost Pro Edition)

### general-purpose Agent (90% of work):
- All Ghost Pro setup and configuration
- Content creation (pages, case studies)
- Browser automation for Ghost admin
- Integrations (SubStack, ActivityPub, analytics)
- Testing (cross-browser, mobile, accessibility)
- Launch activities
- Post-launch enhancements
- Content optimization

### Plan Agent (5% of work):
- Complex integration planning (if needed for SubStack or Activity Feed)
- VPS migration planning (Phase 8, if pursued)

### Bash Agent (< 5% of work):
- Git operations (if tracking content in Git)
- Minimal command-line work (Ghost Pro eliminates most Bash needs)
- Python script execution (Phase 7.3)

### code-reviewer Agent (Optional):
- Review custom theme modifications
- Review Python integration scripts
- Security review if custom code added

---

## Timeline Estimate (Ghost Pro)

**Week 1:**
- Phase 1: Ghost Pro setup (1 hour)
- Phase 2: Theme & design configuration (2-4 days)
- Phase 3: Start content creation (About, Resume, Contact)

**Week 2:**
- Phase 3: Finish content (case studies, homepage, projects page)
- Phase 4: Integrations (SubStack, SEO, performance)
- Phase 5: Start testing

**Week 3 (or end of Week 2):**
- Phase 5: Complete testing and QA
- Phase 6: Launch!
- Phase 6: Post-launch monitoring

**Post-Launch (Ongoing):**
- Phase 7: Enhancements as time permits
- (Phase 8: VPS migration only if/when decided)

**Total to Launch: 1-2 weeks** (Ghost Pro enables fast timeline)

---

## Success Metrics Reminder

**At Launch:**
- ✅ Site live on MikeJones.online with HTTPS
- ✅ All critical content published (Home, About, Resume, Contact, 3-4 case studies)
- ✅ AI projects prominently featured (Memory System, LLM Setup)
- ✅ Contact form and Cal.com working
- ✅ ActivityPub federation active (@mike@MikeJones.online)
- ✅ Mobile responsive, cross-browser compatible
- ✅ Lighthouse scores 90+ (Performance, Accessibility, Best Practices, SEO)

**First 3 Months:**
- 🎯 500+ unique visitors
- 🎯 50+ ActivityPub/Fediverse followers
- 🎯 5-10 quality contact form inquiries
- 🎯 Resume downloads tracked
- 🎯 AI project pages driving engagement

**Long-Term:**
- 🎯 Professional opportunities generated (especially AI implementation roles)
- 🎯 Growing Fediverse audience
- 🎯 Regular content publishing (Activity Feed)
- 🎯 Site demonstrates AI implementation and LLM integration expertise effectively
- 🎯 Low maintenance overhead maintained
- 🎯 Recognition as AI practitioner through project showcases

---

**End of Ghost Pro Roadmap**

**Next Steps:**
1. Review and approve this roadmap
2. Sign up for Ghost Pro account
3. Begin Phase 1: Ghost Pro Setup
4. Let the agents work through the phases!

Good luck with the launch! 🚀
