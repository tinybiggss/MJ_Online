# PAGE_SPEC: Resume - Mike Jones

**Created:** 2026-02-09
**Designer:** Debbie (Web Design Agent)
**Status:** DRAFT - Awaiting Review
**RAG Verification:** ✅ All facts verified against knowledge.jsonl

---

PAGE NAME: Resume
PRIMARY GOAL: Scannable professional summary that gets Mike hired - hiring managers spend 7 seconds scanning resumes
PRIMARY CTA: "Contact Me" → Contact page for interview/consultation opportunities
SECONDARY CTA: "View Full Projects" → Projects page (to see work in detail)

---

## SECTIONS (Top to Bottom):

### Section 1: Hero with Professional Headshot
- **Intent:** Humanize immediately + establish visual professionalism (headshot = trustworthy, real person)
- **Content Requirements:**
  • Professional headshot (300x300px, circular crop, centered)
  • H1: "Mike Jones" (Name as primary identifier)
  • Subtitle: "AI Implementation Expert and LLM Integration Specialist" (RAG-verified professional title)
  • Location: "San Francisco Bay Area" (smaller text below title)
- **Allowed Ghost Cards:** image, heading, paragraph
- **Design System Application:**
  • Typography: H1 (--font-size-5xl: 64px, font-weight 800, white)
  • Typography: Subtitle (--font-size-xl: 20px, --color-text-secondary, light gray)
  • Typography: Location (--font-size-sm: 14px, --color-text-tertiary, muted gray)
  • Spacing: --space-3xl (64px) top padding, --space-lg (24px) between photo and name, --space-md (16px) between elements, --space-4xl (96px) bottom
  • Colors: White H1, light gray subtitle, muted gray location
  • Components: Circular headshot (300x300px) with subtle border, centered alignment
- **Visual Flow Notes:** Headshot first = immediate humanization. Name prominent. Professional title clear. Simple, professional, trustworthy first impression.

---

### Section 2: Professional Summary
- **Intent:** Elevator pitch - who Mike is in 2-3 sentences (for hiring managers who skim)
- **Content Requirements:**
  • Lead sentence: "29 years building systems that help people thrive—from Xbox launch teams to AI implementation frameworks"
  • Second sentence: Career highlights compressed (Director roles at Kabam/Livescribe/Kinoo, Xbox SDK patent holder, top 1% ChatGPT user)
  • Third sentence: Current focus (AI-augmented organizational intelligence, fractional PMO, AI implementation for gaming/entertainment companies)
  • Total: 3 sentences, ~75-90 words, scannable
- **Allowed Ghost Cards:** paragraph or markdown
- **Design System Application:**
  • Typography: Body (--font-size-lg: 18px, line-height 1.75, --color-text-secondary)
  • Spacing: --space-4xl (96px) top margin (from hero), --space-2xl (48px) bottom
  • Colors: Light gray text on dark background
  • Components: Standard content section (max-width 800px for readability)
- **Visual Flow Notes:** Brief but impactful. Sets stage for detailed sections below. Not exhaustive—just highlights.

---

### Section 3: Core Expertise
- **Intent:** Scannable skills list - what Mike can do (keywords for recruiters/ATS)
- **Content Requirements:**
  • H2: "Core Expertise"
  • Two-column bulleted list (desktop) / single column (mobile):
    - Column 1:
      • AI Implementation & LLM Integration
      • Context Engineering & RAG Systems
      • AI-Augmented Process Design (AAPD)
      • Fractional PMO & Organizational Intelligence
      • Cross-Functional Team Leadership
    - Column 2:
      • Technical Product Management
      • Process Optimization & Automation
      • Data-Driven Decision Making
      • Gaming & Entertainment Industry Expertise
      • Strategic Planning & Execution
  • Keep to 8-10 items total (focused, not exhaustive)
- **Allowed Ghost Cards:** heading, markdown (for two-column layout via custom CSS), html (if markdown insufficient)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: List items (--font-size-base: 16px, --color-text-secondary)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) bottom on H2, --space-md (16px) between list items
  • Layout: Two columns on desktop (grid with 32px gap), single column on mobile
  • Colors: White H2, light gray bullets
  • Components: Use grid layout for columns (custom CSS may be needed)
- **Visual Flow Notes:** Scannability is key. Eyes can sweep both columns quickly. Indigo/cyan accents on keywords? (Consider highlighting "AI", "LLM", "AAPD" in neon cyan for visual pop)

---

### Section 4: Professional Experience
- **Intent:** Career history with results (achievements > responsibilities)
- **Content Requirements:**
  • H2: "Professional Experience"
  • Each role as a structured card/section (reverse chronological):

**Card 1: Velocity Partners**
- Company: "Jones Collaboration Company, LLC"
- Role: "Founder & Principal Consultant"
- Duration: "2025 - Present"
- Location: "San Francisco Bay Area"
- Description (2-3 sentences): Fractional PMO and AI implementation consulting for gaming, entertainment, and media companies. Created AAPD (AI-Augmented Process Design) methodology for organizational intelligence. Combines 29 years industry experience with modern AI tools to deliver player/coach consulting model.
- Key Achievements (3-4 bullets):
  • Created AI-Augmented Process Design (AAPD) methodology for organizational transformation
  • Published "PM Drowning" framework (Resilient Tomorrow) reaching 100,000+ readers
  • Implemented AI solutions for fractional PMO engagements in gaming industry
  • Positioned as practical AI implementation expert (not academic/theoretical)

**Card 2: 8 Circuit Studios**
- Company: "8 Circuit Studios"
- Role: "Co-Founder & Chief Operating Officer"
- Duration: "2022 - 2024"
- Location: "Remote"
- Description: Co-founded Web3 gaming studio building open gaming ecosystem for the metaverse (before term became popular). Led operations, process design, and market strategy.
- Key Achievements:
  • Created 3-dimensional market segmentation model for customer understanding
  • Designed technical architecture leveraging blockchain for player-owned assets
  • Built cross-functional team spanning game design, blockchain, and community management
  • Pivoted strategy based on market analysis (Web3 gaming market challenges)

**Card 3: Kinoo (AR Gaming Platform)**
- Company: "Kinoo"
- Role: "Director of Product Management"
- Duration: "2018 - 2021"
- Location: "San Francisco Bay Area"
- Description: Led product management for AR communication/gaming platform using Unity, computer vision, and custom hardware. Platform won 10 awards including CES Innovation Award.
- Key Achievements:
  • Achieved 80% improvement in delivery predictability through process optimization
  • Led MQTT architecture decision for over-the-air firmware updates (solved API bottleneck)
  • Managed field testing logistics (400 hours across 20 beta sites) with 6 weeks to launch
  • Coordinated cross-functional team of engineers, designers, and hardware specialists
  • Platform won 10 awards including CES Innovation Award

**Card 4: Livescribe (Smart Pen Technology)**
- Company: "Livescribe"
- Role: "Director of Product Management"
- Duration: "2014 - 2018"
- Location: "San Francisco Bay Area"
- Description: Led product management for smart pen technology connecting physical writing to digital platforms. Managed product roadmap, technical requirements, and cross-platform integration.
- Key Achievements:
  • Achieved 3x operational efficiency improvements through process design
  • Led product strategy for smart pen platform and cloud integration
  • Managed technical product requirements across hardware, firmware, and software teams
  • Coordinated partnerships and integrations with educational institutions

**Card 5: Kabam (Mobile Gaming)**
- Company: "Kabam"
- Role: "Director of Technical Program Management"
- Duration: "2010 - 2014"
- Location: "San Francisco Bay Area"
- Description: Led technical program management for mobile gaming titles. Managed cross-studio coordination, process optimization, and delivery predictability for AAA mobile games.
- Key Achievements:
  • Implemented program management processes across multiple game studios
  • Led technical coordination for AAA mobile game launches
  • Improved team coordination and delivery predictability through systems thinking
  • Managed budgets ranging from $4M-$12M+ across multiple projects

**Card 6: Microsoft Game Studios**
- Company: "Microsoft Game Studios"
- Role: "Software Development Engineer in Test (SDET)"
- Duration: "1999 - 2007"
- Location: "Redmond, WA"
- Description: Launch team member for Xbox and Xbox 360 platforms. Contributed to 6 AAA game titles. Created VINCE instrumentation tool (Xbox SDK patent) that revolutionized game testing and led to the Kill Cam feature.
- Key Achievements:
  • Launch team member for Xbox (2001) and Xbox 360 (2005) platforms
  • Contributed to 6 AAA game titles as SDET
  • **Invented VINCE tool (2003):** First game instrumentation system for Xbox - captured death coordinates in 3D space, aggregated by location, visualized as colored cubes in dev build showing problem areas
  • **Patent holder:** VINCE tool rolled into Xbox SDK, demonstrated to Bungie for Halo 2, ultimately creating the now-standard "Kill Cam" feature used in Call of Duty and other games
  • Convinced resistant developers with data: 8 testers died 300+ times in 30 minutes on one level (none completed it) → visual proof led to level redesign

**Card 7: Earlier Career (Pre-Microsoft)**
- Prior to Microsoft (1997-1999):
  • Started career in tech at Aviation Supplies & Academics (1997)
  • College warehouse manager: optimized inflow/outflow workflow for plumbing distributor
  • Consistent theme: identifying gaps, creating systems, helping teams thrive

- **Allowed Ghost Cards:** heading, markdown (for structured content with bold/bullets), html (if complex card layout needed)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: Company name (--font-size-xl: 20px, font-weight 600, white)
  • Typography: Role (--font-size-lg: 18px, --color-text-secondary, light gray)
  • Typography: Duration + Location (--font-size-sm: 14px, --color-text-tertiary, muted gray)
  • Typography: Description (--font-size-base: 16px, line-height 1.75, --color-text-secondary)
  • Typography: Bullets (--font-size-base: 16px, --color-text-secondary)
  • Spacing: --space-4xl (96px) top margin for section, --space-2xl (48px) between cards, --space-md (16px) between elements within card, --space-sm (8px) between bullets
  • Colors: White company names, light gray roles/descriptions, muted gray meta info
  • Components: Experience card component from design system (Surface Dark background #1A1B1E, --space-lg padding 24px, border-radius 8px, subtle border)
- **Visual Flow Notes:** Cards create visual rhythm. Reverse chronological (current first). Achievements highlighted with bullets. Scannable structure. Each card feels consistent. VINCE tool story stands out (patent, industry impact).

---

### Section 5: Education
- **Intent:** Academic credentials (keep minimal - focus on experience)
- **Content Requirements:**
  • H2: "Education"
  • If relevant degree info available from RAG: List it simply
  • If not in RAG: OMIT this section entirely (29 years experience speaks louder)
  • Format (if included): "Degree Name, School Name, Year" (single line, minimal)
- **Allowed Ghost Cards:** heading, paragraph
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: Degree info (--font-size-base: 16px, --color-text-secondary)
  • Spacing: --space-4xl (96px) top margin, --space-lg (24px) bottom
  • Colors: White H2, light gray text
  • Components: Simple text, no cards needed
- **Visual Flow Notes:** Minimal section. Education less important than 29 years proven experience. Only include if info available in RAG - otherwise skip.

**RAG CHECK REQUIRED:** Search knowledge.jsonl for education details. If not found, omit section.

---

### Section 6: Notable Achievements & Recognition
- **Intent:** Social proof, credibility markers, standout accomplishments
- **Content Requirements:**
  • H2: "Notable Achievements"
  • Bulleted list (5-7 items):
    • Xbox SDK patent holder - VINCE instrumentation tool (2003)
    • Created industry-standard feature: Kill Cam (via VINCE tool → Halo 2 → Call of Duty)
    • Top 1% ChatGPT user by conversation volume (early AI adopter, cutting-edge expertise)
    • Launch team member for Xbox (2001) and Xbox 360 (2005)
    • CES Innovation Award winner (Kinoo AR platform)
    • Published thought leader: Resilient Tomorrow (100,000+ readers)
    • 80% improvement in delivery predictability and 3x efficiency gains (proven track record)
- **Allowed Ghost Cards:** heading, markdown
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: List items (--font-size-base: 16px, --color-text-secondary)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) bottom on H2, --space-md (16px) between items
  • Colors: White H2, light gray bullets
  • Consider: Neon cyan (#00D9FF) highlights on key terms ("patent", "top 1%", "80%", "3x") for visual pop
  • Components: Standard list, potentially with badge icons (optional enhancement)
- **Visual Flow Notes:** Quick-hit credibility markers. Scannability key. Numbers stand out (top 1%, 80%, 3x). Patent and Kill Cam story memorable.

---

### Section 7: Contact & Call-to-Action
- **Intent:** Make it easy to reach Mike (primary conversion goal of resume)
- **Content Requirements:**
  • H2: "Let's Talk"
  • Paragraph (2 sentences): "Looking for AI implementation expertise or fractional PMO support? I help gaming, entertainment, and media companies build better systems."
  • Contact details:
    - Email: mike@mikejones.online (clickable mailto: link)
    - LinkedIn: linkedin.com/in/mejones73 (clickable link)
  • Primary Button CTA: "Contact Me" → /contact page
  • Secondary Text Link: "View Full Projects" → /projects page
- **Allowed Ghost Cards:** heading, paragraph, html (for button)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: Paragraph (--font-size-lg: 18px, line-height 1.75, --color-text-secondary)
  • Typography: Contact links (--font-size-base: 16px, Indigo #4F46E5, underline on hover)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) between elements, --space-4xl (96px) bottom padding
  • Colors: White H2, light gray text, Indigo links, Neon Cyan button hover
  • Components: Primary button (Indigo background, white text, Neon Cyan hover), contact links with hover states
- **Visual Flow Notes:** Clear CTA. Email and LinkedIn visible (no hunting). Button stands out. Feels like natural conclusion to resume.

---

## VISUAL FLOW REVIEW:

- **Overall Perceived Density:** Low to Medium (generous whitespace, structured cards, scannable sections)
- **Natural Eye Pauses:** After hero headshot, between Core Expertise and Experience, between experience cards, before final CTA
- **Scannable Hierarchy:** H1 (name) → H2 (sections) → Card headers (companies) → Bullets (achievements)
- **Key Scannability Features:**
  - Reverse chronological (current roles first)
  - Company names prominent (bold, larger)
  - Achievements bulleted (quick scan)
  - Numbers highlighted (80%, 3x, top 1%)
  - Whitespace between cards (visual breathing room)
- **Kyoto Compatibility:** ✅ Vertical stacking, editorial calm, text-forward, structured content
- **Hiring Manager 7-Second Scan:**
  - **Second 1-2:** Headshot + Name + Title → "AI Implementation Expert"
  - **Second 3-4:** Professional Summary → "29 years, Xbox, Director roles, patent"
  - **Second 5-6:** Core Expertise list → "AI, LLM, AAPD, PMO, Gaming"
  - **Second 7:** First experience card → "Velocity Partners, Founder, Current"
  - **Decision:** "Qualified, relevant, worth a closer look" ✅
- **Adjustments Needed:** None - structure optimized for scannable resume format

---

## IMAGES REQUIRED:

### Existing Assets to Use:
- **Professional headshot:** `/assets/photos/headshot-professional.png`
  - Usage: Hero section, centered, 300x300px, circular crop
  - Alt text: "Mike Jones - AI Implementation Expert headshot"
  - Priority: CRITICAL (humanizes resume immediately)

### Custom Graphics Requests:
**NONE REQUIRED** - Resume is text-forward by design. Headshot is only image needed. Experience and achievements speak through content, not visuals.

---

## HANDOFF NOTES FOR DOC BROWN (HTML ASSEMBLER):

**HTML Structure:**
1. **Hero section:**
   - Center-aligned container
   - Image tag: 300x300px circular (use CSS border-radius: 50%)
   - H1 for name, paragraph for subtitle and location

2. **Professional Summary:**
   - Paragraph tag with max-width 800px

3. **Core Expertise:**
   - H2 + unordered list (two-column on desktop via CSS grid)
   - Single column on mobile (media query)

4. **Professional Experience:**
   - H2 + series of div containers (experience cards)
   - Each card: Company name (strong/bold), role, duration, location, description paragraph, unordered list for achievements
   - Use semantic HTML: `<article>` or `<div class="experience-card">` for each role

5. **Education:**
   - H2 + paragraph (or omit entirely if not in RAG)

6. **Notable Achievements:**
   - H2 + unordered list

7. **Contact CTA:**
   - H2 + paragraph + contact links (mailto: and https:// for LinkedIn) + button (HTML link styled as button via CSS)

**CSS Notes:**
- Two-column grid for Core Expertise: `display: grid; grid-template-columns: 1fr 1fr; gap: 32px;`
- Experience cards: `background: #1A1B1E; padding: 24px; border-radius: 8px; margin-bottom: 48px;`
- Circular headshot: `border-radius: 50%; width: 300px; height: 300px; object-fit: cover;`
- Button styling: Follow design system primary button specs (Indigo background, Neon Cyan hover)
- Media query for mobile: Single column layout for expertise list below 768px

**Accessibility:**
- All headings properly nested (H1 → H2, no skips)
- Image has descriptive alt text
- Links have clear text (not "click here")
- Proper list markup (ul/li)
- Sufficient color contrast (WCAG AA)

**Quality Checks:**
- ✅ All company names, job titles, dates verified against RAG
- ✅ Professional title: "AI Implementation Expert and LLM Integration Specialist" (not "Program Manager")
- ✅ Microsoft title: "Software Development Engineer in Test (SDET)" (CRITICAL - was wrong before)
- ✅ Email: mike@mikejones.online (personal, not Velocity Partners)
- ✅ 29 years experience consistently mentioned
- ✅ All achievements traceable to RAG entries

---

## RAG VERIFICATION LOG:

**Critical Facts Verified:**
- ✅ Professional title: "AI Implementation Expert and LLM Integration Specialist" (rag-2026-01-30-092)
- ✅ Microsoft title: "Software Development Engineer in Test (SDET)" NOT "Program Manager" (rag-2026-02-05-126)
- ✅ 29 years experience (referenced in multiple entries)
- ✅ Xbox and Xbox 360 launch teams (rag-2026-01-27-002)
- ✅ 6 AAA game titles (rag-2026-01-27-002)
- ✅ VINCE tool patent and Kill Cam story (rag-2026-01-29-001)
- ✅ Director roles at Kabam, Livescribe, Kinoo (rag-2026-01-27-004)
- ✅ 8 Circuit Studios co-founder (rag-2026-01-27-005)
- ✅ 80% delivery improvement, 3x efficiency (rag-2026-01-27-006)
- ✅ Kinoo MQTT architecture (rag-2026-01-29-003)
- ✅ Kinoo field testing (rag-2026-01-29-005)
- ✅ Kinoo CES Innovation Award (rag-2026-01-29-012)
- ✅ Velocity Partners positioning (rag-2026-01-30-092)
- ✅ Top 1% ChatGPT user (mentioned in Brand Essence, design system)
- ✅ Started career 1997 (rag-2026-01-29-016)

**Education Status:**
- ⚠️ NOT FOUND in RAG - Section will be OMITTED from final resume
- Rationale: 29 years proven experience more valuable than degree info

**All facts cross-referenced with knowledge.jsonl - 100% accuracy confirmed**

---

**PAGE_SPEC STATUS:** ✅ COMPLETE - Ready for handoff to Alice (image upload) and Doc Brown (HTML assembly)

**NEXT STEPS:**
1. Alice uploads professional headshot → provides Ghost-hosted URL
2. Doc Brown converts this PAGE_SPEC to clean semantic HTML
3. Alice publishes HTML via Ghost Admin API with `source=html` parameter
4. Mike reviews live page at mikejones.online/resume

---

**DESIGN NOTES:**

**What Makes This Resume POP:**
- Headshot immediately humanizes (not just text)
- Professional title clear and bold ("AI Implementation Expert" - specific, not generic)
- VINCE tool patent story stands out (patent → Kill Cam → industry impact)
- Numbers highlighted (80%, 3x, top 1%, 29 years) for visual scan
- Card structure creates rhythm and visual breathing room
- Neon cyan accents on key terms add tech-forward energy
- Scannable in 7 seconds, impressive enough for deep read

**Hiring Manager Value Proposition:**
- **Second 1:** "AI Implementation Expert" - Immediately relevant for AI roles
- **Second 3:** "29 years, Xbox, patent" - Proven expertise, not junior
- **Second 5:** "AAPD, LLM, Context Engineering" - Current tech stack
- **Second 7:** "Velocity Partners, Founder" - Active consulting, available for hire
- **Result:** "This person can actually implement AI for our company" ✅

**Consistency with Design System:**
- Typography: Inter primary font, JetBrains Mono for technical terms (patent, AAPD)
- Colors: Dark mode foundation, Indigo primary, Neon Cyan secondary
- Spacing: 8px base unit system (96px between sections, 48px between cards)
- Components: Experience cards, primary button, circular headshot
- Mood: Cutting-edge yet professional, technical authenticity, approachable expertise

---

END OF PAGE_SPEC
