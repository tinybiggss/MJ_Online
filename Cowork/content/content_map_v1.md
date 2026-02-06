# MJ_Online Content Map v1.1

**Generated:** 2026-01-27
**Updated:** 2026-01-29 (Interview Prep Documents Added)

**Source Documents Analyzed:**
- RT-Assistant README.md
- Knowledge Base README.md
- mike_career_prompt.md
- OfflineAI_Ops_CheatSheet.md
- AUTOSTART_SETUP.md
- chatgpt-memory-template.md
- Resilient Tomorrow Article Writing System Prompt
- **NEW:** Amazon Interview Crib Sheet.md
- **NEW:** Amazon Interview Prep and Notes.md
- **NEW:** Amazon Writing Assessment.md
- **NEW:** Interview Prep - 2k.md
- **NEW:** Interview Prep - FTF (For the Future).md
- **NEW:** Interview Preparation.md

---

## Coverage Matrix

| Section | Coverage | Confidence | Key Gaps | Questions Needed |
|---------|----------|------------|----------|------------------|
| **Homepage** | 85% | High | Hero tagline, photo reference | 2 |
| **About Page** | 70% | Medium | Personal origin story, values articulation | 3 |
| **Resume/CV** | 95% | High | Specific dates, education/certifications | 2 |
| **AI Memory System** | 70% | High | Architecture diagram, "aha" moment, lessons | 4 |
| **Local LLM Setup** | 80% | High | Why self-host motivation, daily workflow | 3 |
| **NeighborhoodShare** | 20% | Low | Full case study content | 6 |
| **Resilient Tomorrow** | 40% | Medium | Connection to AI work, reader impact | 3 |
| **Home Management** | 10% | Low | Full case study content | 6 |
| **Career Stories (NEW)** | 90% | High | Kabam details need fleshing out | 1 |

---

## Section-by-Section Analysis

### Homepage

**What We Have:**
- ✅ Professional positioning: "AI-Augmented Organizational Intelligence Architect"
- ✅ Target market: 50-500 employees, gaming/entertainment/media
- ✅ Service offerings: 3 tiers ($4k-$18k/month)
- ✅ Key metrics: 80% delivery improvement, 3x efficiency
- ✅ Career highlights: Xbox, Microsoft patent, Kabam, etc.

**What's Missing:**
- ❌ Hero tagline (punchy one-liner for the banner)
- ❌ Elevator pitch (2-3 sentences)
- ❌ Photo/headshot reference
- ❌ Which 3-4 projects to feature (need prioritization)

**Interview Questions:**
1. "What's the one thing you want people to know about you within 5 seconds of landing on your site?"
2. "Do you have a professional headshot we can reference, or do we need to plan for one?"

---

### About Page

**What We Have:**
- ✅ Professional journey overview (24+ years PM/PgM)
- ✅ Current positioning and expertise areas
- ✅ Parallel projects list (RT, NeighborhoodShare, OfflineAI)
- ✅ Business entity: Jones Collaboration Company, LLC
- ✅ Target industries and ICP

**What's Missing:**
- ❌ Personal background story (before tech)
- ❌ The transition into AI/ML (narrative arc)
- ❌ What gets you excited now
- ❌ Values and working philosophy
- ❌ Photo reference

**Interview Questions:**
1. "What first got you interested in technology? Paint me a picture of that moment."
2. "Walk me through the turning point when you decided to go deep into AI/ML."
3. "What's the through-line connecting all your different roles over 24 years?"
4. "What gets you out of bed excited to work on right now?"

---

### Resume/CV

**What We Have:**
- ✅ Complete career timeline (Microsoft, Xbox, Kabam, Livescribe, Kinoo, 8 Circuit)
- ✅ Key achievements with metrics
- ✅ Microsoft patent reference
- ✅ Team sizes (50-120+) and budgets ($4M-$12M+)
- ✅ Service offerings and pricing
- ✅ Core skills list
- ✅ 2022-2025 "entrepreneurial R&D phase" framing

**What's Missing:**
- ❌ Specific dates for each role (years)
- ❌ Education/certifications list
- ❌ Recent AI-specific training/courses

**Interview Questions:**
1. "Can you confirm the years for each major role? Xbox was approximately 2004-2006?"
2. "What formal education do you have, and any AI/ML certifications or courses?"

---

### AI Memory System Case Study (FLAGSHIP)

**What We Have:**
- ✅ System overview and purpose (dual-AI, cross-AI compatibility)
- ✅ Directory structure documentation
- ✅ Memory ledger schema (JSONL format, all fields)
- ✅ Entry types (decision, milestone, insight, etc.)
- ✅ AI system integration (Claude, OpenWebUI, ChatGPT)
- ✅ Naming conventions
- ✅ Workflow documentation (starting/ending sessions)
- ✅ Version history (v1.0 Jan 2025, v2.0 Sep 2025)

**What's Missing:**
- ❌ Architecture diagram (visual)
- ❌ The problem/pain that sparked this (specific incident)
- ❌ Decision rationale (why JSONL? why this structure?)
- ❌ Challenges encountered and how solved
- ❌ Daily usage - how has workflow actually changed?
- ❌ Lessons learned and what you'd do differently
- ❌ Screenshots of the system in action

**Interview Questions:**
1. "What was broken about how you worked with AI before building this? What specific incident made you say 'I need to fix this'?"
2. "Why JSONL for the memory ledger instead of a database? Walk me through that decision."
3. "What was the hardest technical problem to solve while building this?"
4. "How has your actual daily workflow changed since implementing this system?"

**Assets Needed:**
- [ ] Architecture diagram showing data flow
- [ ] Screenshot of memory.jsonl structure
- [ ] Screenshot of OpenWebUI with memory loaded
- [ ] Before/after workflow comparison

---

### Local LLM Setup Case Study (FLAGSHIP)

**What We Have:**
- ✅ Complete infrastructure documentation
- ✅ Services list (Ollama port 11434, OpenWebUI port 3000, mcpo port 11620)
- ✅ Docker configuration and volumes
- ✅ LaunchAgent auto-start setup
- ✅ Management tools (rtai command)
- ✅ OpenWebUI container configuration
- ✅ MCP filesystem bridge details
- ✅ Troubleshooting guide

**What's Missing:**
- ❌ Motivation narrative (why self-host?)
- ❌ Privacy/security angle articulation
- ❌ How you decide which AI to use for which task
- ❌ Model selection rationale (why Qwen 2.5:14B?)
- ❌ Operational lessons from real usage
- ❌ What would you tell someone starting from scratch?

**Interview Questions:**
1. "Why self-host AI instead of just using Claude/ChatGPT? What can you do locally that you can't do with cloud AI?"
2. "How did you decide on Qwen 2.5:14B as your local model? What were the alternatives?"
3. "What breaks most often and how do you fix it? What's the maintenance burden like?"

**Assets Needed:**
- [ ] System architecture diagram
- [ ] Screenshot of OpenWebUI interface
- [ ] Hardware spec photo (Mac Mini setup)

---

### NeighborhoodShare

**What We Have:**
- ✅ Project exists in registry
- ✅ Tags: `neighborhood_share`, `community_coordination`, `platform`
- ✅ Workspace: `projects/NeighborhoodShare/`

**What's Missing:**
- ❌ Everything else (full case study content)

**Interview Questions:**
1. "What's the elevator pitch for NeighborhoodShare?"
2. "What problem in your community inspired this?"
3. "Where is it in development and what's the vision?"
4. "What's the tech stack?"
5. "What have you learned building it?"
6. "How does this connect to your consulting positioning?"

---

### Resilient Tomorrow

**What We Have:**
- ✅ Article writing system prompt (shows editorial approach)
- ✅ Focus: community resilience, organizing, preparedness
- ✅ Tone: urgent but grounded, practical over theoretical
- ✅ Part of RT-Assistant knowledge base

**What's Missing:**
- ❌ What is it? (Substack publication)
- ❌ Target reader
- ❌ Connection to AI work (how AI helps create content?)
- ❌ Traction/metrics (subscribers, popular articles)

**Interview Questions:**
1. "What's your thesis for Resilient Tomorrow? What are you trying to achieve?"
2. "Who's your target reader? What do they care about?"
3. "How does AI fit into your content creation workflow for RT?"

---

### Home Management System

**What We Have:**
- ✅ Mentioned as project in requirements spec
- ✅ Tagged as potential case study

**What's Missing:**
- ❌ Everything (full case study content)

**Interview Questions:**
1. "What family problem were you solving with the Home Management System?"
2. "What AI components are involved?"
3. "How does your family actually use it day-to-day?"
4. "What makes this worth showcasing on a professional portfolio?"
5. "What did you learn building something for your family vs. for work?"
6. "Any screenshots or demo available?"

---

## Priority Interview Sessions

Based on the coverage matrix, I recommend these interview sessions in order:

### Session 1: About Page Deep Dive (20-30 min)
- Personal story and journey
- AI transition narrative
- Values and philosophy
- **Output:** About page draft

### Session 2: AI Memory System Technical (30-45 min)
- Problem/trigger story
- Architecture walkthrough
- Decision rationale
- Challenges and lessons
- **Output:** Flagship case study draft

### Session 3: Local LLM Setup (20-30 min)
- Motivation and privacy angle
- Model selection
- Operational lessons
- **Output:** Flagship case study draft

### Session 4: Quick Hits - Other Projects (30 min)
- NeighborhoodShare overview
- Resilient Tomorrow connection
- Home Management if relevant
- **Output:** Standard case study drafts

---

## Asset Checklist

**Required Before Launch:**
- [ ] Professional headshot
- [ ] AI Memory System architecture diagram
- [ ] Local LLM Setup architecture diagram
- [ ] OpenWebUI interface screenshot
- [ ] Memory ledger structure visualization

**Nice to Have:**
- [ ] Mac Mini setup photo
- [ ] Before/after workflow comparison
- [ ] Demo video of system in action
- [ ] Code snippet screenshots (styled)

---

## Next Steps

1. **Review this map** - Does the coverage assessment feel accurate?
2. **Schedule Session 1** - About Page interview (voice-friendly, 20-30 min)
3. **Identify existing assets** - Do you have any screenshots/diagrams already?
4. **Prioritize projects** - Which 3-4 should be featured on homepage?

---

## Interview Prep Documents Analysis (Added 2026-01-29)

The 6 interview prep documents from ~2 years ago contain **extremely rich STAR-format career stories** with detailed metrics and outcomes. These have been extracted into the RAG knowledge base.

### Key Stories Extracted

**Microsoft (Flagship Innovation):**
- ✅ **VINCE Tool / Kill Cam Patent** - Full STAR format, detailed metrics (300+ deaths in 30 min), industry impact (became Halo 2 feature, now gaming standard)

**Kinoo (Most Comprehensive):**
- ✅ **MQTT Firmware Update Decision** - Technical decision-making under pressure
- ✅ **C3PO Production Process** - Process creation and workflow documentation
- ✅ **Hardware Testing Crisis** - 400+ hours testing in 8 weeks, stepping up under pressure
- ✅ **Planning Resistance (Dave story)** - Coaching/leadership, finding the right tools
- ✅ **Technical Stack** - Unity, AWS, TensorFlow ML, ESP32 hardware
- ✅ **CES Innovation Award** - Key achievement
- ✅ **JIRA Roadmaps Failure** - Learning from mistakes

**8 Circuit Studios (Web3/Founder):**
- ✅ **Founding Vision** - Proto-metaverse concept, what Roblox became
- ✅ **Customer Communication Document** - Market segmentation innovation
- ✅ **Alien Arsenal vs Project Genesis** - Difficult prioritization decision
- ✅ **Web3 Integration** - Making blockchain transparent to players

**Verizon (Consulting/Process):**
- ✅ **Content Pipeline Transformation** - 24-36 hrs → 2-4 hrs, $2M+ savings, 5 departments

**Kabam:**
- ⚠️ Stories mentioned but marked "<<<FLESH THIS OUT>>>" in original docs
- Release process improvements
- Beta testing / user experience program
- Tech debt addressing
- Central services team

**LiveScribe:**
- ⚠️ Relatively thin details
- "Making Matt Awesome" (coaching story)
- Build & Release department, CI/CD

### Content Gaps Identified

**Marked as Needing Clarification in Source Docs:**
1. Kabam stories are outline-only, need full STAR details
2. LiveScribe stories are thin
3. Dates for career timeline still missing

**Items NOT in Interview Prep (Still Need Interview):**
1. Personal origin story (before tech career)
2. AI/ML transition narrative
3. NeighborhoodShare full case study
4. Resilient Tomorrow deeper context
5. Home Management System details
6. AI Memory System motivation ("aha" moment)
7. Local LLM Setup motivation (why self-host?)

### RAG Knowledge Base Update

Added 14 new entries (rag-2026-01-29-001 through rag-2026-01-29-014):
- 8 narrative entries (major career stories)
- 4 qa_pair entries (leadership style, technical approach, process, innovation)
- 2 technical/fact entries (Kinoo stack, CES award)

**Total RAG entries:** 35

---

## Revised Priority Interview Sessions

Based on new content, sessions can be shorter and more focused:

### Session 1: About Page + Missing Personal Context (15-20 min)
- Personal origin story (before tech)
- AI/ML transition narrative
- Values and philosophy articulation
- Hero tagline ideation

### Session 2: AI Memory System Deep Dive (20-30 min)
- What triggered building this? Specific incident?
- Why JSONL vs database?
- Challenges and lessons
- Daily workflow changes

### Session 3: Kabam + LiveScribe Gap Fill (15-20 min)
- Flesh out Kabam stories (release process, beta testing, tech debt)
- LiveScribe details (Matt story, B&R department)

### Session 4: Current Projects Quick Hits (20-30 min)
- NeighborhoodShare elevator pitch
- Resilient Tomorrow thesis
- Local LLM motivation
- Home Management if relevant

---

*Generated by mj-content-extractor skill*
*Updated 2026-01-29 after interview prep document analysis*
