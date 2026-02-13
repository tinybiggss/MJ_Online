# PAGE_SPEC: Homepage - MikeJones.online

**Created:** 2026-02-09
**Designer:** Debbie (Web Design Agent)
**Status:** DRAFT - Awaiting Review
**RAG Verification:** ✅ All facts verified against knowledge.jsonl
**Design System:** ✅ Follows /design/DESIGN-SYSTEM.md guidelines

---

PAGE NAME: Mike Jones - AI Implementation Expert & LLM Integration Specialist
PRIMARY GOAL: Immediate clarity on who Mike is, what he does, why to hire him - convert visitors to project views or contact
PRIMARY CTA: "View My Work" → /projects/ (primary), "Contact Me" → /contact/ (secondary in final section)

---

## SECTIONS (Top to Bottom):

### Section 1: Hero Section (Above the Fold)
- **Intent:** Immediate impact - visitor knows who Mike is and what he does in 5 seconds
- **Content Requirements:**
  • H1: "Mike Jones"
  • Subtitle/Professional Title: "AI Implementation Expert and LLM Integration Specialist"
  • Value proposition (2-3 sentences): "Building better systems for 29 years—from Xbox launch teams to AI-augmented workflows. I help organizations implement AI that works for people, not against them."
  • Professional headshot (optional, right side on desktop): 400x400px, circular crop
  • Primary CTA button: "View My Work" → /projects/
  • Secondary text link: "Read my story" → /about/
- **Allowed Ghost Cards:** heading, paragraph, image, button
- **Design System Application:**
  • Typography: H1 (--font-size-6xl: 72px, font-weight 800, --color-text-primary white)
  • Typography: Subtitle (--font-size-2xl: 24px, font-weight 600, Neon Cyan #00D9FF to make it POP)
  • Typography: Value prop (--font-size-xl: 20px, --color-text-secondary light gray)
  • Spacing: --space-5xl (128px) top padding, --space-md (16px) between H1 and subtitle, --space-lg (24px) between subtitle and value prop, --space-xl (32px) between value prop and CTA, --space-5xl (128px) bottom
  • Colors: White H1, Neon Cyan subtitle (electric, signals AI/tech), light gray value prop, Indigo button
  • Components: Button Primary (Indigo background, white text, Neon Cyan hover)
- **Visual Flow Notes:** BOLD entry. Name huge, title in electric cyan (immediate AI positioning), value prop establishes 29 years + current focus. CTA earned immediately - visitor can explore work or read story. Mobile: stack vertically, slightly smaller type scale.

---

### Section 2: Featured Work (3 Projects)
- **Intent:** Show proof of expertise through real projects - NeighborhoodShare, Local LLM, Velocity Partners
- **Content Requirements:**
  • H2: "Featured Work"
  • Optional intro (1 sentence): "Real AI implementations solving real problems"
  • 3 project cards in grid (3 columns desktop, 2 tablet, 1 mobile):

    **Card 1: NeighborhoodShare**
    - Project thumbnail/screenshot (from /assets/projects/neighborhoodshare/): Home-Tool-Selection.png or Add-Tool-AI-2.png (400x300px)
    - H3: "NeighborhoodShare: AI-Powered Tool Sharing"
    - Description (2-3 sentences): "Community tool-sharing platform using GPT-4o Vision to automatically catalog items from photos. 170 active users across 20 zip codes building hyperlocal mutual aid networks."
    - Tech stack badges: Python, GPT-4o Vision, Django, Tailwind
    - Pillar badge: "Pillar 3: Access > Money" (Neon Cyan badge)
    - "Read Case Study →" link → /projects/neighborhoodshare/

    **Card 2: Local LLM Infrastructure**
    - Project thumbnail/screenshot: Architectural diagram or terminal screenshot if available in /assets/projects/local-llm/
    - H3: "Self-Hosted AI on Mac Mini"
    - Description (2-3 sentences): "Privacy-first AI infrastructure running Ollama and Open WebUI locally. Demonstrates enterprise-ready AI deployment without cloud dependencies."
    - Tech stack badges: Ollama, Llama 3.3, Open WebUI, Docker
    - Pillar badges: "Pillar 4: Knowledge Stewardship" + "Pillar 5: Communication Independence" (Neon Cyan badges)
    - "Read Case Study →" link → /local-llm-infrastructure-self-hosted-ai-on-mac-mini/

    **Card 3: Velocity Partners**
    - Project thumbnail: Velocity Partners logo or service visual (TBD - may need custom graphic)
    - H3: "Velocity Partners: AI-Augmented PMO"
    - Description (2-3 sentences): "Fractional PMO consulting using AI-Augmented Process Design (AAPD) methodology. Helping gaming/entertainment/media teams (50-1500 people) make work flow better."
    - Service tags: Fractional PMO, AAPD Methodology, Process Design, AI Implementation
    - "Learn More →" link → https://velocitypartners.io (external)

- **Allowed Ghost Cards:** heading, paragraph, image, markdown (for card grid structure), html (if needed for custom card layout)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: Project names/H3 (--font-size-xl: 20px, font-weight 600, white)
  • Typography: Descriptions (--font-size-base: 16px, --color-text-secondary)
  • Typography: Tech stack badges (--font-code JetBrains Mono, 14px, medium)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) bottom on H2, --space-2xl (48px) gap between cards
  • Spacing: Within cards: --space-md (16px) padding, --space-sm (12px) between elements
  • Colors: Card background Surface Dark (#1A1B1E), white H3, light gray descriptions, Neon Cyan pillar badges and link hover states
  • Components: Project Card component from design system - image top, content below, tech badges row, pillar badge(s), link with arrow
- **Visual Flow Notes:** This is THE proof section. Cards should feel substantial but scannable. Images draw eye first, project names second, descriptions third. Tech stacks signal credibility. Pillar badges connect to unified vision (explained on Projects page). Mobile: cards stack vertically with full width.

---

### Section 3: Who I Am (About Snippet)
- **Intent:** Build human connection, give personality preview, invite to full About page
- **Content Requirements:**
  • H2: "Who I Am"
  • Paragraph 1 (2-3 sentences): Quick personal intro - "I didn't start in tech. I studied political science because I was fascinated by SYSTEMS—how projects move through processes, how laws pass, how society is governed. That systems thinking led me from Xbox launch teams to building AI infrastructure today."
  • Paragraph 2 (2-3 sentences): Current focus - "Now I build AI systems that give people more agency and reduce dependency on fragile centralized infrastructure. Whether it's helping teams ship better products or building tools for hyperlocal community, it's always about creating systems that help people thrive."
  • Paragraph 3 (1 sentence + CTA): "Want the full story?"
  • Text link CTA: "Read my journey →" → /about/
- **Allowed Ghost Cards:** heading, markdown (for multi-paragraph with link)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: Body paragraphs (--font-size-base: 16px, line-height 1.75, --color-text-secondary)
  • Typography: Link (--font-size-base: 16px, Neon Cyan, hover underline)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) bottom on H2, --space-lg (24px) between paragraphs
  • Colors: White H2, light gray body, Neon Cyan link
  • Components: Standard content section with text link (not button - softer invite)
- **Visual Flow Notes:** This section humanizes. Not a resume - a glimpse of personality. "Political science → systems thinking → AI" is memorable narrative hook. Keeps it brief - full story on About page. Link feels like invitation, not hard sell.

---

### Section 4: Core Expertise (Skills Showcase)
- **Intent:** Scannable expertise overview for hiring managers/CTOs - what can Mike do?
- **Content Requirements:**
  • H2: "Core Expertise"
  • Optional intro (1 sentence): "What I bring to your team or project"
  • Two-column grid (desktop), single column (mobile), 8-10 key skills:
    - AI Implementation & LLM Integration
    - Context Engineering & Prompt Architecture
    - AI-Augmented Process Design (AAPD)
    - Enterprise AI Infrastructure
    - Fractional PMO & Program Management
    - Multi-Agent System Orchestration
    - Process Optimization & Workflow Design
    - Technical Leadership (teams 50-120+ people)
  • Each skill as clean list item with subtle bullet or checkmark icon
- **Allowed Ghost Cards:** heading, markdown (for two-column list)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: Skills list (--font-size-base: 16px, --color-text-secondary)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) bottom on H2, --space-md (16px) between list items, --space-2xl (48px) gap between columns
  • Colors: White H2, light gray skills, Neon Cyan checkmark icons or bullets
  • Components: Two-column skill grid with icons
- **Visual Flow Notes:** Quick scan for "does this person have what I need?" Not exhaustive (full list on Resume). Just enough to signal broad AI implementation expertise + PMO leadership. Icons add visual interest without clutter.

---

### Section 5: Final CTA - Let's Work Together
- **Intent:** Convert visitor to contact - clear next action
- **Content Requirements:**
  • H2: "Let's Work Together"
  • Paragraph (2-3 sentences): "Looking for AI implementation expertise or fractional PMO leadership? I help organizations build AI systems that actually work and teams that ship better products faster."
  • Two CTA buttons side-by-side:
    - Primary: "Contact Me" → /contact/
    - Secondary: "View Resume" → /resume/
  • Optional: Small text below buttons: "San Francisco Bay Area • Available for consulting and full-time roles"
- **Allowed Ghost Cards:** heading, paragraph, button, html (for side-by-side button layout)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: Paragraph (--font-size-xl: 20px, --color-text-secondary) - slightly larger for CTA impact
  • Typography: Small text (--font-size-sm: 14px, --color-text-tertiary)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) bottom on H2, --space-lg (24px) between paragraph and buttons, --space-5xl (128px) bottom padding
  • Colors: White H2, light gray paragraph, Indigo primary button, Indigo outline secondary button, Neon Cyan hovers
  • Components: Button Primary + Button Secondary (side-by-side with --space-md gap on desktop, stacked on mobile)
- **Visual Flow Notes:** Strong finish. Visitor has seen work, knows who Mike is, understands expertise. Now: clear action. Two options (contact or resume) gives choice without dilution. Location + availability signals readiness to work.

---

## VISUAL FLOW REVIEW:

**Overall Perceived Density:** Low - generous spacing (96-128px between sections), clean single-column layout (except expertise grid), ample whitespace
**Natural Eye Pauses:** After hero CTA, between project cards, after About snippet, after skills grid, at final CTA
**Pacing:** BOLD hero → visual proof (project cards) → human connection (about) → credentials (skills) → action (CTA). Follows classic conversion flow.
**Mobile Experience:** All cards/grids stack to single column, type scale reduces slightly, spacing compresses to 64-96px sections, buttons full-width
**Kyoto Compatibility:** ✅ Vertical editorial flow, one primary idea per section, images as content not decoration, text-forward with visual breaks

**Adjustments Needed:** None - this structure follows design system and homepage best practices. Clean, professional, conversion-focused.

---

## IMAGES REQUIRED:

### Existing Assets to Use:

**Professional Headshot (Hero Section - OPTIONAL):**
- File: /assets/photos/headshot-professional.png (1.2MB, confirmed available)
- Usage: Hero section, right side desktop, 400x400px circular crop
- Priority: MEDIUM (homepage can launch without it, but adds human touch)

**NeighborhoodShare Project Card:**
- Option 1: /assets/projects/neighborhoodshare/Home-Tool-Selection.png (main interface)
- Option 2: /assets/projects/neighborhoodshare/Add-Tool-AI-2.png (AI cataloging feature)
- Usage: Featured Work section, Card 1 thumbnail
- Size: 400x300px (16:9 aspect ratio)
- Priority: HIGH (proof of work - need visual)

**Local LLM Project Card:**
- Check: /assets/projects/local-llm/ directory for screenshots
- Preferred: Terminal output, Open WebUI interface, or architecture diagram
- Usage: Featured Work section, Card 2 thumbnail
- Size: 400x300px
- Priority: HIGH (proof of work - need visual)

**Velocity Partners Project Card:**
- Option 1: Velocity Partners logo from /assets/projects/velocity-partners/ (if exists)
- Option 2: Request custom service visual (see Custom Graphics below)
- Usage: Featured Work section, Card 3 thumbnail
- Size: 400x300px
- Priority: MEDIUM (can use placeholder or simple logo treatment)

---

### Custom Graphics Requests:

**7 Pillars Pillar Badges (for Project Cards):**
- **Purpose:** Visual badges connecting projects to 7 Pillars framework
- **Type:** Small badge graphics with pillar number + name
- **Suggested Tool:** Canva or simple CSS/SVG (can be implemented in code)
- **Specifications:**
  • Size: Small inline badges (~80-100px wide, 24-28px tall)
  • Style: Rounded rectangle, Neon Cyan (#00D9FF) background, dark text or outline style
  • Content:
    - "Pillar 3: Access > Money" (NeighborhoodShare)
    - "Pillar 4: Knowledge Stewardship" (Local LLM)
    - "Pillar 5: Communication Independence" (Local LLM)
  • Colors: Neon Cyan (#00D9FF) primary, can use transparent background with cyan border + text
  • Typography: Inter, 12-14px, SemiBold
- **Placement:** Below project description, above "Read Case Study" link in each project card
- **Example/Inspiration:** GitHub topic tags, but with pillar branding
- **Priority:** MEDIUM (can launch without, but adds valuable framework connection)
- **Alternative:** Simple CSS badges (faster implementation, no graphic needed)

**Velocity Partners Service Visual (OPTIONAL):**
- **Purpose:** Visual representation for Velocity Partners card (if logo not sufficient)
- **Type:** Service/consulting visual or icon-based graphic
- **Suggested Tool:** Canva
- **Specifications:**
  • Size: 400x300px
  • Style: Clean, minimal, matches design system dark mode aesthetic
  • Content: Visual metaphor for "AI-Augmented PMO" or "Making work flow" - could be workflow diagram, process visualization, or abstract representation
  • Colors: Dark background (#0A0B0D or #1A1B1E), Indigo (#4F46E5) and Neon Cyan (#00D9FF) accents
  • Typography: Inter for any text, minimal text preferred
- **Placement:** Velocity Partners project card thumbnail
- **Priority:** LOW (can use logo or simple color block as placeholder)

---

## HANDOFF NOTES FOR DOC BROWN (HTML Assembler):

**HTML Structure Requirements:**

1. **Hero Section:**
   - Use semantic header tag `<header class="homepage-hero">`
   - H1 for name, paragraph for subtitle (apply .subtitle class for Neon Cyan styling)
   - Value prop in standard paragraph tag
   - Primary CTA: `<a href="/projects/" class="btn btn-primary">View My Work</a>`
   - Secondary CTA: `<a href="/about/" class="link-secondary">Read my story →</a>`
   - Optional headshot: `<img src="[URL from Alice]" alt="Mike Jones - Professional headshot" class="hero-headshot" />`

2. **Featured Work Cards:**
   - Use CSS Grid or Flexbox for 3-column layout (responsive to 2-col, 1-col)
   - Each card structure:
     ```html
     <article class="project-card">
       <img src="[URL]" alt="[Project name] screenshot" class="project-thumbnail" />
       <h3>[Project Name]</h3>
       <p class="project-description">[Description]</p>
       <div class="tech-stack">
         <span class="badge badge-tech">[Tech 1]</span>
         <span class="badge badge-tech">[Tech 2]</span>
         ...
       </div>
       <div class="pillar-badges">
         <span class="badge badge-pillar">[Pillar X: Name]</span>
       </div>
       <a href="[URL]" class="link-arrow">Read Case Study →</a>
     </article>
     ```
   - Apply design system card styling (Surface Dark background, rounded corners, padding)

3. **About Snippet:**
   - Standard content section
   - Use `<section class="about-snippet">` wrapper
   - H2 + markdown paragraphs
   - Link with arrow: `<a href="/about/" class="link-arrow">Read my journey →</a>`

4. **Core Expertise:**
   - Two-column grid on desktop: CSS Grid with `grid-template-columns: 1fr 1fr` (single column on mobile)
   - List items with checkmark icons (can use Unicode ✓ or SVG)
   - Structure:
     ```html
     <ul class="expertise-grid">
       <li><span class="checkmark">✓</span> AI Implementation & LLM Integration</li>
       <li><span class="checkmark">✓</span> Context Engineering & Prompt Architecture</li>
       ...
     </ul>
     ```

5. **Final CTA:**
   - Two buttons side-by-side on desktop (flexbox), stacked on mobile
   - Structure:
     ```html
     <div class="cta-buttons">
       <a href="/contact/" class="btn btn-primary">Contact Me</a>
       <a href="/resume/" class="btn btn-secondary">View Resume</a>
     </div>
     <p class="availability">San Francisco Bay Area • Available for consulting and full-time roles</p>
     ```

**Accessibility:**
- All images need alt text
- Buttons/links need proper semantic markup
- Headings follow proper hierarchy (H1 → H2 → H3, no skipping)
- Focus states for keyboard navigation (use design system focus ring)

**CSS Classes to Apply:**
- Use design system variables: `--font-size-*`, `--space-*`, `--color-*`
- Card styling: `.project-card` with Surface Dark background
- Button styling: `.btn-primary`, `.btn-secondary` from design system
- Badge styling: `.badge-tech` (JetBrains Mono), `.badge-pillar` (Neon Cyan)
- Link styling: `.link-arrow` for links with → symbol, Neon Cyan on hover

**Responsive Breakpoints:**
- Desktop: 1024px+ (3-column project grid, 2-column expertise)
- Tablet: 768-1023px (2-column project grid, 1-column expertise)
- Mobile: <768px (1-column everything, full-width buttons, reduced spacing)

**Content Source:**
- All copy provided in Section content requirements above
- All facts RAG-verified (29 years, Xbox, professional title, project details)
- Tech stacks confirmed from RAG project entries

**Testing:**
- Verify all internal links work (/projects/, /about/, /contact/, /resume/, case study URLs)
- Verify Velocity Partners external link (https://velocitypartners.io)
- Check mobile layout stacks properly
- Validate hover states on buttons, links, cards

---

## RAG VERIFICATION LOG:

✅ **Professional Title:** "AI Implementation Expert and LLM Integration Specialist" (RAG entry verified, consistent with About/Resume pages)

✅ **Experience:** 29 years in tech, started 1997 (RAG entry 2026-01-27-001 verified)

✅ **Career Highlights:**
- Xbox & Xbox 360 launch teams (RAG entry 002 verified)
- 6 AAA titles at Microsoft (RAG entry 002 verified)
- Director roles at Kabam, Livescribe, Kinoo (RAG entries verified)
- 8 Circuit Studios co-founder (RAG entries verified)

✅ **NeighborhoodShare:**
- GPT-4o Vision for cataloging (RAG entry 073 verified)
- 170 active users (RAG entry 048 verified)
- 20 zip codes (RAG entry 048 verified)
- Pillar 3 + Pillar 7 connection (RAG entry 057 verified)

✅ **Local LLM:**
- Mac Mini M4 Pro (RAG entry 090 verified)
- Ollama + Open WebUI (RAG entry 091, 092 verified)
- Pillar 4 + Pillar 5 connection (RAG entry 057 verified)

✅ **Velocity Partners:**
- Fractional PMO consulting (RAG entry 071 verified)
- AAPD methodology (RAG entry 016 verified)
- Gaming/entertainment/media teams (RAG entry 071 verified)
- 50-1500 person team sizes (RAG entry 022 verified)

✅ **Personal Background:**
- Political science degree (RAG entry 035 verified)
- Systems thinking focus (RAG entry 036 verified)
- Current positioning around AI + agency (RAG entries 042-047 verified)

✅ **Contact Information:**
- Email: mike@mikejones.online (verified)
- Location: San Francisco Bay Area (RAG entry verified)

✅ **Factual Accuracy:** 100% - All facts verified against RAG knowledge base

---

## DESIGN DECISIONS & RATIONALE:

### Decision 1: Neon Cyan for Professional Title in Hero
**What:** Apply Neon Cyan (#00D9FF) to "AI Implementation Expert and LLM Integration Specialist" subtitle
**Why:**
- Makes professional positioning immediately visible and memorable
- Electric color signals cutting-edge AI expertise
- Creates visual hierarchy: Name (white, huge) → Title (cyan, prominent) → Value prop (gray, supporting)
- Differentiates from typical portfolio sites (usually all white text)
- Aligns with design system's "make it POP" directive
**Impact:** Visitor instantly associates Mike with AI expertise, site feels modern/tech-forward

### Decision 2: Three Featured Projects (Not More)
**What:** Limit Featured Work to 3 projects: NeighborhoodShare, Local LLM, Velocity Partners
**Why:**
- Design system recommends "3 max" for homepage
- Reduces cognitive load - visitor can process 3 easily
- Each represents different aspect: Community tech (NeighborhoodShare), Infrastructure (Local LLM), Consulting (Velocity Partners)
- Shows breadth without overwhelming
- Clean grid: 3 columns desktop, 2 tablet, 1 mobile (elegant responsive flow)
**Impact:** Focused proof of work, easier decision-making for visitor ("which project interests me?")

### Decision 3: Pillar Badges on Project Cards
**What:** Add visual Pillar badges (e.g., "Pillar 3: Access > Money") to each project card
**Why:**
- Signals unified vision - not random projects, coherent framework
- Invites curiosity - "What are the 7 Pillars?" → drives traffic to Projects page
- Visual differentiation - each card has unique pillar connection
- Reinforces brand identity (7 Pillars from Resilient Tomorrow)
- Neon Cyan badges add visual POP without clutter
**Impact:** Projects feel strategically connected, not ad-hoc portfolio pieces. Drives deeper engagement.

### Decision 4: About Snippet (Not Full Bio)
**What:** Brief 3-paragraph "Who I Am" section, not comprehensive About content
**Why:**
- Homepage goal: conversion (view work, contact), not life story
- Teaser approach: enough personality to humanize, but leaves visitor wanting more
- "Political science → systems thinking → AI" is memorable hook
- Respects visitor time - quick read, clear invite to full About page if interested
- Design system: homepages should be "clarity over completeness"
**Impact:** Humanizes without slowing conversion. Visitors who want depth click to About page.

### Decision 5: Two-Column Expertise Grid
**What:** Display Core Expertise in 2-column grid (desktop), not bulleted list
**Why:**
- Scannable format - hiring managers sweep both columns quickly (7-second resume rule applies here)
- Maximizes space - 8-10 skills fit in compact area
- Visual balance - two columns feel organized, not cramped
- Checkmark icons add subtle visual interest
- Mobile: stacks to single column automatically (responsive)
**Impact:** Skills section feels professional, credible, easy to scan for "do they have what I need?"

### Decision 6: Dual CTA (Contact + Resume)
**What:** Final section offers two buttons: "Contact Me" (primary) and "View Resume" (secondary)
**Why:**
- Different visitor intents: Some want to talk now (Contact), some want credentials first (Resume)
- Primary/secondary button styling guides preference (Contact is main action)
- No third option - avoids decision paralysis
- Both actions are conversion-positive (either leads to hiring consideration)
- Location + availability text signals readiness without seeming desperate
**Impact:** Clear next steps, accommodates different decision-making styles, maximizes conversion paths

### Decision 7: Skills Before Final CTA (Not After About)
**What:** Order: Hero → Projects → About → **Skills** → CTA (not Hero → Projects → Skills → About → CTA)
**Why:**
- Conversion flow logic: Proof (projects) → Human (about) → Credentials (skills) → Action (CTA)
- Skills section is "hire me" content - belongs near CTA
- About section builds connection - better placed mid-page to break up "selling"
- Skills → CTA creates momentum: "Here's what I can do" immediately followed by "Let's work together"
- Pacing: projects (visual) → about (text) → skills (scannable) → CTA (action) - alternates density
**Impact:** More natural conversion funnel, skills section primes visitor for CTA decision

---

## NEXT STEPS:

1. **Alice (Image Uploader):**
   - Upload professional headshot: /assets/photos/headshot-professional.png → Get Ghost URL
   - Upload NeighborhoodShare thumbnail (choose between Home-Tool-Selection.png or Add-Tool-AI-2.png) → Get Ghost URL
   - Check /assets/projects/local-llm/ for screenshot → Upload if available → Get Ghost URL
   - Check /assets/projects/velocity-partners/ for logo → Upload if available → Get Ghost URL (or note if custom graphic needed)
   - Provide all image URLs to Doc Brown

2. **Doc Brown (HTML Assembler):**
   - Receive image URLs from Alice
   - Convert this PAGE_SPEC to semantic HTML following structure notes above
   - Apply design system CSS classes and variables
   - Ensure responsive layout (3-col → 2-col → 1-col for project cards)
   - Validate all internal/external links
   - Output clean HTML ready for Ghost Admin API

3. **Alice (Publisher):**
   - Receive HTML from Doc Brown
   - Publish to homepage via Ghost Admin API with `source=html` parameter
   - Set SEO metadata:
     - Title: "Mike Jones - AI Implementation Expert & LLM Integration Specialist"
     - Meta description: "Building better systems for 29 years—from Xbox launch teams to AI-augmented workflows. I help organizations implement AI that works for people, not against them."
     - URL slug: / (homepage)
   - Featured image: Professional headshot (if uploaded)
   - Verify publication success

4. **Debbie (Review):**
   - Review published homepage on live site
   - Check mobile responsiveness (test on actual mobile device or responsive view)
   - Verify all links work
   - Verify design system styling applied correctly
   - Check visual hierarchy and spacing
   - Confirm Neon Cyan accents POP appropriately
   - Test hover states on buttons/links
   - Document any iteration needs

---

**READY FOR HANDOFF** ✅

This PAGE_SPEC is complete, RAG-verified, and ready for the workflow:
1. Alice uploads images
2. Doc Brown converts to HTML
3. Alice publishes via API
4. Debbie reviews live site

**Estimated Timeline:**
- Image upload: 15-20 minutes
- HTML assembly: 45-60 minutes
- Publishing: 5-10 minutes
- Review: 15-20 minutes
**Total: ~1.5-2 hours from start to published homepage**
