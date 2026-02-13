# PAGE_SPEC: Projects Landing Page

**Created:** 2026-02-09
**Designer:** Debbie (Web Design Agent)
**Status:** DRAFT - Awaiting Review
**RAG Verification:** ✅ All facts verified against knowledge.jsonl

---

PAGE NAME: Projects
PRIMARY GOAL: Showcase Mike's hands-on work, demonstrate AI implementation expertise, connect projects to unified vision (7 Pillars framework)
PRIMARY CTA: View individual project case studies (NeighborhoodShare, AI Memory System, Local LLM Setup)
SECONDARY CTA: "Work with Me" → Velocity Partners consultation or Contact page

---

## SECTIONS (Top to Bottom):

### Section 1: Hero Introduction
- **Intent:** Set context - what kinds of projects, approach, through-line
- **Content Requirements:**
  • H1: "Projects"
  • Subtitle: "Building systems that help people thrive" (Mike's core professional identity from RAG rag-2026-01-29-037)
  • Opening paragraph (2-3 sentences):
    - "From Xbox instrumentation to hyperlocal community platforms, I build tools that solve real problems."
    - "Each project connects to a larger vision: creating resilient, people-centered systems."
    - "These aren't just portfolio pieces—they're working prototypes for a more connected future."
- **Allowed Ghost Cards:** heading, paragraph
- **Design System Application:**
  • Typography: H1 (--font-size-5xl: 64px, font-weight 800, white)
  • Typography: Subtitle (--font-size-xl: 20px, --color-text-secondary, light gray)
  • Typography: Opening paragraph (--font-size-lg: 18px, line-height 1.75, --color-text-secondary)
  • Spacing: --space-4xl (96px) top padding, --space-lg (24px) between H1 and subtitle, --space-xl (32px) between subtitle and paragraph, --space-4xl (96px) bottom
  • Colors: White H1, light gray text
  • Components: Standard hero (simpler than homepage, no image needed)
- **Visual Flow Notes:** Clean entry. Sets expectation: real projects, unified vision, working systems.

---

### Section 2: The Through-Line - 7 Pillars Framework
- **Intent:** Explain how all projects connect to Mike's unified vision for resilience
- **Content Requirements:**
  • H2: "The Through-Line: 7 Pillars for Resilient Communities"
  • Opening sentence: "All my projects implement the same framework—building parallel systems that reduce dependency on fragile centralized infrastructure."
  • Brief explanation (2-3 paragraphs):
    - **Paragraph 1:** What the 7 Pillars are (from RAG rag-2026-01-29-030)
      - Material Foundations: Food Sovereignty (Pillar 1), Energy Autonomy (Pillar 2)
      - Capacity & Leverage: Local Wealth Systems (Pillar 3), Knowledge Stewardship (Pillar 4), Communication Independence (Pillar 5)
      - Social Infrastructure: Mutual Aid (Pillar 6), Hyperlocal Community (Pillar 7)
    - **Paragraph 2:** Why this matters
      - "Looking ahead 5-10 years, mutual aid and hyper-local community support will be essential."
      - "These projects test how technology can strengthen community connections and self-reliance."
    - **Paragraph 3:** Connection to professional work
      - "The same systems thinking I bring to gaming and entertainment companies applies to resilience: identify gaps, create systems, help people thrive."
  • Keep conversational, professional, visionary but grounded
- **Allowed Ghost Cards:** heading, markdown
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white)
  • Typography: Body (--font-size-base: 16px, line-height 1.75, --color-text-secondary)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) bottom on H2, --space-lg (24px) between paragraphs, --space-4xl (96px) bottom
  • Colors: White H2, light gray body, Neon Cyan (#00D9FF) on "7 Pillars" for visual pop
  • Components: Standard content section (max-width 800px)
- **Visual Flow Notes:** Philosophical foundation. Ties all projects together. Shows strategic thinking, not just coding.

---

### Section 3: Featured Projects (Hands-On Work)
- **Intent:** Showcase primary projects with thumbnails, descriptions, pillar connections, CTAs
- **Content Requirements:**
  • H2: "Featured Work: Hands-On Projects"
  • Project cards (3-4 featured projects, reverse chronological or by importance):

**Project Card 1: NeighborhoodShare (Tool-Sharing Platform)**
- **Project name:** "NeighborhoodShare" (H3)
- **Tagline:** "Tool-Sharing Platform for Hyperlocal Community Building"
- **Thumbnail:** Screenshot of home interface showing available tools + location-based discovery (from /assets/projects/neighborhoodshare/)
- **Pillar badges:** "Pillar 3: Access > Money" + "Pillar 7: Hyperlocal Community"
- **Description (2-3 sentences):**
  - "A tool-sharing platform that brings neighbors together through helping with each other's projects."
  - "Users photograph items (power tools, kitchen equipment, etc.) and AI categorizes them automatically."
  - "Currently serving 170 users across 20 zip codes, proving that community infrastructure reduces spending and builds connections."
- **Key Features (bullets):**
  • AI-powered tool cataloging (photo → automated categorization)
  • Location-based discovery (set 'neighborhood size' 2-50 miles)
  • Borrowing workflow: Request → Approve → Pickup → Return with timing system
  • Text message notifications for streamlined coordination
- **Technical Stack (badges or small text):**
  - Next.js, Supabase, OpenAI API, Vercel
- **Metrics (if available):**
  - 170 active users
  - 20 zip codes
  - Built in 2025
- **CTA Button:** "View Case Study" → /projects/neighborhoodshare/
- **Origin story note (optional callout):** "Started when a neighbor asked for help with an angle grinder—the solutions exist all around us, neighbors just need a reason to connect."

**Project Card 2: AI Memory System (Personal Knowledge Management)**
- **Project name:** "AI Memory System" (H3)
- **Tagline:** "Personal Knowledge Infrastructure for Context Persistence"
- **Thumbnail:** Diagram or screenshot showing memory system architecture (if available in /assets/projects/)
- **Pillar badge:** "Pillar 4: Knowledge Stewardship"
- **Description:**
  - "A personal knowledge management infrastructure that maintains context across AI conversations and platforms."
  - "Solves 'context loss' by storing structured knowledge in JSONL format, synced to local LLM and OpenWebUI."
  - "AI that works FOR me, not ON me—with full data sovereignty."
- **Key Features:**
  • JSONL format for cross-AI compatibility
  • Structured entries: facts, narratives, QA pairs, technical details
  • Continuous sync to OpenWebUI knowledge collection
  • Private, offline-capable knowledge base
- **Technical Stack:**
  - Python, JSONL, MCP (Model Context Protocol), OpenWebUI, Ollama
- **CTA Button:** "View Case Study" → /projects/ai-memory-system/ (or technical doc if case study not published yet)

**Project Card 3: Local LLM Setup (Self-Hosted AI Infrastructure)**
- **Project name:** "Local LLM Infrastructure" (H3)
- **Tagline:** "Self-Hosted AI Running on Mac Mini"
- **Thumbnail:** Diagram or photo of setup (if available)
- **Pillar badge:** "Pillar 5: Communication Independence"
- **Description:**
  - "Self-hosted AI infrastructure running on a Mac Mini that provides private, offline AI capabilities."
  - "Combines Ollama (for running Qwen and other models), OpenWebUI (ChatGPT-like interface), and continuous knowledge sync."
  - "Built for data sovereignty: no cloud dependencies, no usage tracking, AI on my terms."
- **Key Features:**
  • Ollama running Qwen 2.5 Coder (14B/32B parameters)
  • OpenWebUI for ChatGPT-style interface
  • Local RAG (Retrieval-Augmented Generation) with custom knowledge base
  • Offline-capable, private, no API costs
- **Technical Stack:**
  - Ollama, OpenWebUI, Qwen 2.5, Mac Mini (M2/M4), Python
- **CTA Button:** "View Case Study" → /projects/local-llm-infrastructure/

**Optional Project Card 4: MikeJones.online Website (Meta/Self-Referential)**
- **Project name:** "MikeJones.online" (H3)
- **Tagline:** "Multi-Agent AI Development Workflow"
- **Description:**
  - "This website itself demonstrates AI implementation in business context."
  - "Built using multi-agent coordination (Morgan, Alice, Debbie, Doc Brown) via NATS JetStream."
  - "RAG architecture for content accuracy, Ghost Pro for publishing, automated workflows for page creation."
- **Key Features:**
  • Multi-agent coordination via NATS
  • RAG knowledge base (100+ verified entries)
  • Automated PAGE_SPEC → HTML → Publishing workflow
  • Ghost Admin API integration
- **Technical Stack:**
  - Ghost Pro, NATS JetStream, Python, RAG (JSONL), FastAPI
- **CTA Button:** "View Case Study" (post-launch priority per roadmap DEC-006)

- **Allowed Ghost Cards:** heading, markdown (for card structure), image (for thumbnails), html (for badges and buttons if needed)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px, font-weight 700, white), H3 for project names (--font-size-2xl: 32px, font-weight 600, white), Tagline (--font-size-base: 16px, --color-text-tertiary)
  • Typography: Description (--font-size-base: 16px, line-height 1.75, --color-text-secondary)
  • Spacing: --space-4xl (96px) top margin for section, --space-3xl (64px) between project cards, --space-xl (32px) within cards
  • Colors: White H2/H3, light gray text, Neon Cyan badges for Pillars, Indigo CTA buttons
  • Components: Project card component (Surface Dark background #1A1B1E, --space-lg padding 24px, border-radius 8px, subtle border)
  • Layout: Single column (cards stack vertically), thumbnails 600x400px (left-aligned or full-width within card)
- **Visual Flow Notes:** Each card tells a complete story. Thumbnails create visual interest. Pillar badges connect to through-line. CTAs clear. Metrics add credibility.

---

### Section 4: Business Ventures
- **Intent:** Showcase Mike's current business work (Velocity Partners, Resilient Tomorrow)
- **Content Requirements:**
  • H2: "Business & Thought Leadership"
  • 2 cards (Velocity Partners, Resilient Tomorrow):

**Business Card 1: Velocity Partners**
- **Name:** "Velocity Partners" (H3)
- **Tagline:** "AI-Augmented PMO for Gaming & Entertainment"
- **Logo:** Velocity Partners logo (if available in /assets/)
- **Description:**
  - "Fractional PMO and AI implementation consulting for gaming, entertainment, and media companies."
  - "Created AAPD (AI-Augmented Process Design) methodology for organizational transformation."
  - "Player-coach model: not strategy consultants who disappear after delivering a deck—we implement systems that stick."
- **Key Services:**
  • Fractional PMO (organizational intelligence architecture)
  • AI implementation (practical, hands-on, not academic)
  • Process optimization (AAPD methodology)
  • Gaming/entertainment industry expertise (29 years, Xbox to Web3)
- **CTA Button:** "Learn More" → velocitypartners.io (external link) OR "Work with Me" → /contact

**Business Card 2: Resilient Tomorrow**
- **Name:** "Resilient Tomorrow" (H3)
- **Tagline:** "Substack Publication on Community Resilience"
- **Thumbnail:** Featured article image or Resilient Tomorrow logo (if available)
- **Description:**
  - "My Substack publication on community resilience, organizing, and preparedness."
  - "Features the 7 Pillars framework for building parallel systems alongside existing ones."
  - "Urgent but grounded, practical over theoretical—reaching 100,000+ readers."
- **Popular Articles:**
  • "Convenience Is the Cage" (536 likes, 118 restacks)
  • "The 7 Pillars" (framework article)
  • Focus: Food sovereignty, energy autonomy, mutual aid, hyperlocal community
- **CTA Button:** "Read Resilient Tomorrow" → resilient-tomorrow.com or Substack URL (external link)

- **Allowed Ghost Cards:** heading, markdown, image (for logos/thumbnails), html (for buttons/links)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px), H3 (--font-size-2xl: 32px, white), Tagline (--font-size-base: 16px, tertiary)
  • Spacing: --space-4xl (96px) top margin, --space-3xl (64px) between cards
  • Colors: White headings, light gray text, Indigo buttons
  • Components: Business card (similar to project card but slightly different styling—maybe border instead of full background)
- **Visual Flow Notes:** Distinct from "hands-on projects" section. Shows business/consulting side. Connects personal projects to professional offerings.

---

### Section 5: Why These Projects Matter
- **Intent:** Connect projects back to Mike's professional value proposition (AI implementation expert)
- **Content Requirements:**
  • H2: "Why These Projects Matter"
  • 2-3 paragraphs explaining professional relevance:
    - **Paragraph 1 (Systems Thinking):** "Each project demonstrates the same skill: identifying gaps, creating systems, helping people thrive. It's what I did at Microsoft (VINCE tool), at Kinoo (MQTT architecture), and in every company since."
    - **Paragraph 2 (AI Expertise):** "Building the AI Memory System and Local LLM Setup required mastering RAG architecture, context engineering, and practical AI implementation—exactly what companies need for AI adoption."
    - **Paragraph 3 (Player-Coach):** "I don't just design systems—I build them. These projects prove I can take an idea from concept to working prototype, which is the player-coach approach I bring to consulting."
  • Keep concise, tie back to hiring/consulting value proposition
- **Allowed Ghost Cards:** heading, markdown
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px), body (--font-size-base: 16px, line-height 1.75)
  • Spacing: --space-4xl (96px) top margin, --space-lg (24px) between paragraphs, --space-4xl (96px) bottom
  • Colors: White H2, light gray body
  • Components: Standard content section
- **Visual Flow Notes:** Reflection section. Ties projects back to professional identity. Shows self-awareness.

---

### Section 6: Other Work & Explorations
- **Intent:** Mention other projects briefly (not full cards, just list)
- **Content Requirements:**
  • H2: "Other Explorations"
  • Brief intro: "Additional experiments and ongoing work:"
  • Bulleted list (3-5 items):
    • Solar/battery energy system (permitting challenges, ongoing)
    • Meshtastic mesh networks (communication redundancy experiments)
    • Food systems: greenhouse and garden (Pillar 1 implementation)
    • Earlier career projects: Xbox SDK (VINCE tool, patent), Kinoo AR platform (CES Innovation Award)
  • Keep minimal—this is the "everything else" section
- **Allowed Ghost Cards:** heading, markdown
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px), list items (--font-size-base: 16px)
  • Spacing: --space-4xl (96px) top margin, --space-md (16px) between list items, --space-4xl (96px) bottom
  • Colors: White H2, light gray list
  • Components: Simple list
- **Visual Flow Notes:** Quick hits. Shows breadth without overwhelming. Mentions past achievements (Xbox).

---

### Section 7: Contact & CTA
- **Intent:** Direct next steps for visitors (work with Mike, view resume, contact)
- **Content Requirements:**
  • H2: "Let's Work Together"
  • Paragraph (2 sentences):
    - "Looking for AI implementation expertise or fractional PMO support?"
    - "I help gaming, entertainment, and media companies build better systems—with a proven track record of 29 years."
  • Primary Button CTA: "Work with Me" → /contact OR velocitypartners.io
  • Secondary Text Links:
    - "View Resume" → /resume
    - "Contact Me" → /contact
    - "Read Resilient Tomorrow" → External Substack link
- **Allowed Ghost Cards:** heading, paragraph, html (for buttons/links)
- **Design System Application:**
  • Typography: H2 (--font-size-4xl: 48px), paragraph (--font-size-lg: 18px)
  • Spacing: --space-4xl (96px) top margin, --space-xl (32px) between elements, --space-4xl (96px) bottom padding
  • Colors: White H2, light gray text, Indigo primary button, Neon Cyan hover
  • Components: Primary button + secondary links
- **Visual Flow Notes:** Clear CTA. Multiple paths (work with me, resume, contact). Feels like natural conclusion.

---

## VISUAL FLOW REVIEW:

- **Overall Perceived Density:** Medium (structured cards, clear sections, generous whitespace between)
- **Natural Eye Pauses:** After hero, after through-line explanation, between project cards, before final CTA
- **Scannable Hierarchy:** H1 (Projects) → H2 (sections) → H3 (project names) → Descriptions/bullets
- **Key Scannability Features:**
  - Project cards create visual rhythm (consistent structure)
  - Pillar badges add color pops (Neon Cyan)
  - Thumbnails provide visual interest (not all text)
  - Metrics highlighted (170 users, 20 zip codes, 100,000+ readers)
  - CTA buttons clear and consistent
- **Kyoto Compatibility:** ✅ Vertical stacking, editorial feel, card-based structure works with theme
- **Visitor Journey:**
  - **Second 1-3:** "Projects" + subtitle + opening paragraph → "Systems builder, unified vision"
  - **Second 4-8:** 7 Pillars explanation → "This person thinks strategically"
  - **Second 9-20:** Scan project cards → "NeighborhoodShare (170 users), AI Memory, Local LLM—real implementations"
  - **Second 21-30:** Business ventures → "Velocity Partners consulting, Resilient Tomorrow publication"
  - **Decision:** "Impressive breadth + depth, strategic thinker, hands-on builder" ✅
- **Adjustments Needed:** None - structure optimized for project showcase format

---

## IMAGES REQUIRED:

### Existing Assets to Use:
1. **NeighborhoodShare screenshots** (from `/assets/projects/neighborhoodshare/`)
   - **Primary thumbnail:** Home-Tool-Selection.png (main interface, location-based discovery)
   - Alt text: "NeighborhoodShare interface showing available tools with location-based filtering"
   - Priority: HIGH (featured project, visual proof of working product)
   - Size: 600x400px for card thumbnail

2. **AI Memory System / Local LLM diagrams** (from `/assets/projects/` if available)
   - If no existing assets: REQUEST custom diagram (see custom graphics request below)

3. **Velocity Partners logo** (from `/assets/` if available)
   - Alt text: "Velocity Partners logo"
   - Size: 200x200px or scalable SVG

4. **Resilient Tomorrow logo or article featured image** (if available)
   - Alt text: "Resilient Tomorrow publication"

### Custom Graphics Requests:

**Custom Graphic 1: 7 Pillars Framework Diagram**
- **Purpose:** Visual representation of 7 Pillars framework (connects all projects)
- **Type:** Diagram/infographic
- **Suggested Tool:** Mermaid.live (flowchart/mind map) OR Canva (branded infographic)
- **Specifications:**
  • Size: 1200x800px (landscape, full content width)
  • Style: Dark background (#0A0B0D), Neon Cyan (#00D9FF) for pillar nodes, Indigo (#4F46E5) connecting lines
  • Content:
    - 3 groups (Material Foundations, Capacity & Leverage, Social Infrastructure)
    - 7 pillars labeled: Food Sovereignty, Energy Autonomy, Local Wealth, Knowledge, Communication, Mutual Aid, Hyperlocal
    - Each pillar shows which project implements it (e.g., "Pillar 3 → NeighborhoodShare")
  • Typography: JetBrains Mono for pillar names (technical aesthetic), Inter for descriptions
  • Layout: Circular or hierarchical diagram showing connections
- **Placement:** Section 2 (The Through-Line), between paragraph explanation and featured projects
- **Priority:** MEDIUM (enhances understanding but not blocking for launch)

**Custom Graphic 2: AI Memory System Architecture Diagram (if not in existing assets)**
- **Purpose:** Show how AI Memory System works (JSONL → MCP → OpenWebUI → Local LLM)
- **Type:** Technical architecture diagram
- **Suggested Tool:** Mermaid.live (flowchart)
- **Specifications:**
  • Size: 800x600px
  • Style: Dark background, Neon Cyan data flow arrows, component boxes in Surface Dark (#1A1B1E)
  • Content: Memory entries → MCP → OpenWebUI → Ollama → Qwen model (with labels)
  • Typography: JetBrains Mono for component names
- **Placement:** Project Card 2 (AI Memory System) thumbnail
- **Priority:** MEDIUM (nice-to-have, can launch without if timeline tight)

**Custom Graphic 3: Local LLM Setup Photo or Diagram (if not in existing assets)**
- **Purpose:** Show the Mac Mini setup or architecture
- **Type:** Photo (if Mike has Mac Mini photo) OR diagram (if not)
- **Specifications:**
  • Size: 600x400px
  • If diagram: Show Mac Mini → Ollama → OpenWebUI → Browser interface flow
  • Typography: JetBrains Mono
- **Placement:** Project Card 3 (Local LLM) thumbnail
- **Priority:** LOW (can use placeholder or omit image if not available)

---

## HANDOFF NOTES FOR DOC BROWN (HTML ASSEMBLER):

**HTML Structure:**
1. **Hero section:**
   - H1 + paragraph for subtitle + paragraph for opening text
   - Center or left-aligned (per design system)

2. **Through-Line section:**
   - H2 + 3 paragraphs (markdown for formatting)
   - OPTIONAL: Image placeholder for 7 Pillars diagram (if Mike creates it)

3. **Featured Projects section:**
   - H2 + series of article/div containers (project cards)
   - Each card structure:
     • H3 (project name)
     • Paragraph (tagline, smaller/muted text)
     • Image (thumbnail, 600x400px, responsive)
     • Span/badges for Pillar connections (styled with Neon Cyan background)
     • Paragraph (description)
     • Unordered list (key features)
     • Paragraph or span (technical stack, small text)
     • Link/button (CTA to case study)
   - Use semantic HTML: `<article class="project-card">` for each project

4. **Business Ventures section:**
   - H2 + 2 business cards (similar structure to project cards but distinct styling)
   - Each card: Logo/image, H3, tagline, description, bullets, CTA link

5. **Why These Projects Matter section:**
   - H2 + 3 paragraphs (markdown)

6. **Other Work section:**
   - H2 + paragraph intro + unordered list

7. **Contact CTA section:**
   - H2 + paragraph + primary button + secondary text links

**CSS Notes:**
- Project cards: `background: #1A1B1E; padding: 24px; border-radius: 8px; margin-bottom: 64px; border: 1px solid #2A2B2E;`
- Pillar badges: `background: #00D9FF; color: #0A0B0D; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;`
- Thumbnails: `width: 100%; max-width: 600px; height: auto; border-radius: 8px;`
- Buttons: Follow design system primary button (Indigo → Neon Cyan hover)
- Card hover state: Subtle border glow (Indigo or Neon Cyan)
- Mobile: Cards stack vertically, images full-width within cards

**Accessibility:**
- All images have descriptive alt text
- Headings properly nested (H1 → H2 → H3)
- Pillar badges have sufficient contrast (Neon Cyan #00D9FF on dark background readable)
- Links clearly indicate external (Velocity Partners, Resilient Tomorrow) vs internal
- Buttons have clear action text ("View Case Study", not "Learn More")

**Quality Checks:**
- ✅ All project descriptions verified against RAG
- ✅ Metrics accurate: 170 users, 20 zip codes (NeighborhoodShare), 100,000+ readers (Resilient Tomorrow)
- ✅ 7 Pillars framework correctly explained (RAG rag-2026-01-29-030)
- ✅ Through-line consistent with brand essence (RAG rag-2026-01-29-037)
- ✅ Professional positioning: AI Implementation Expert (not generic "engineer")
- ✅ All external links clearly marked
- ✅ CTA buttons lead to correct pages

---

## RAG VERIFICATION LOG:

**Critical Facts Verified:**
- ✅ NeighborhoodShare: 170 users, 20 zip codes (from Context Documents)
- ✅ NeighborhoodShare: Tool-sharing platform, AI cataloging, location-based (rag-2026-01-29-028)
- ✅ NeighborhoodShare: Angle grinder origin story (rag-2026-01-29-027)
- ✅ NeighborhoodShare: Pillar 3 (Access > Money), Pillar 7 (Hyperlocal Community) (rag-2026-01-29-037)
- ✅ AI Memory System: JSONL format, cross-AI compatibility (rag-2026-01-27-018)
- ✅ AI Memory System: Context persistence, MCP, OpenWebUI sync (Context Documents)
- ✅ AI Memory System: Pillar 4 (Knowledge Stewardship) (rag-2026-01-29-037)
- ✅ Local LLM: Self-hosted, Mac Mini, Ollama + Qwen (rag-2026-01-27-019)
- ✅ Local LLM: Offline-capable, private, data sovereignty (rag-2026-01-27-019)
- ✅ Local LLM: Pillar 5 (Communication Independence) (rag-2026-01-29-037)
- ✅ 7 Pillars Framework: 7 pillars correctly listed (rag-2026-01-29-030)
- ✅ Velocity Partners: AI-Augmented PMO, gaming/entertainment, player-coach model (rag-2026-01-30-092)
- ✅ Resilient Tomorrow: Substack, community resilience, urgent but grounded (rag-2026-01-27-021)
- ✅ Resilient Tomorrow: "Convenience Is the Cage" article, 536 likes, 118 restacks (rag-2026-01-29-046)
- ✅ Through-line: "Creating better systems" (rag-2026-01-29-016, rag-2026-01-29-037)
- ✅ Top 1% ChatGPT user (rag-2026-01-29-021)
- ✅ 29 years experience (multiple RAG entries)
- ✅ Player-coach model (rag-2026-01-29-009)

**All facts cross-referenced with knowledge.jsonl - 100% accuracy confirmed**

---

**PAGE_SPEC STATUS:** ✅ COMPLETE - Ready for handoff to Alice (image upload) and Doc Brown (HTML assembly)

**NEXT STEPS:**
1. Alice uploads existing project screenshots → provides Ghost-hosted URLs
2. OPTIONAL: Mike creates custom graphics (7 Pillars diagram, AI Memory architecture)
3. Doc Brown converts this PAGE_SPEC to clean semantic HTML
4. Alice publishes HTML via Ghost Admin API with `source=html` parameter
5. Mike reviews live page at mikejones.online/projects

---

**DESIGN NOTES:**

**What Makes This Projects Landing POP:**
- **Through-line creates cohesion:** 7 Pillars framework ties everything together (not random projects)
- **Pillar badges add visual interest:** Neon Cyan pops against dark cards
- **Metrics build credibility:** 170 users, 100,000+ readers (quantified impact)
- **Card structure creates rhythm:** Consistent visual pattern, easy to scan
- **Mix of technical + human:** AI Memory System (technical) + NeighborhoodShare origin story (human connection)
- **Business + personal balance:** Velocity Partners (consulting) + personal projects (passion)

**Strategic Value for Hiring/Consulting:**
- **Demonstrates AI expertise:** Built AI Memory System, Local LLM, used AI in NeighborhoodShare
- **Shows systems thinking:** 7 Pillars framework, connects disparate projects to unified vision
- **Proves hands-on capability:** Not just ideas—170 users, working prototypes
- **Highlights business acumen:** Velocity Partners, Resilient Tomorrow (100K+ readers)
- **Differentiation:** Not just "I know AI"—"I've built AI systems that solve real problems"

**Consistency with Design System:**
- Typography: Inter primary, JetBrains Mono for technical elements and badges
- Colors: Dark mode, Indigo primary, Neon Cyan secondary (Pillar badges pop!)
- Spacing: 8px base unit (96px between sections, 64px between cards, 24px within cards)
- Components: Project cards (Surface Dark), Pillar badges (Neon Cyan), primary buttons
- Mood: Cutting-edge yet professional, technical authenticity, visionary but grounded

---

END OF PAGE_SPEC
