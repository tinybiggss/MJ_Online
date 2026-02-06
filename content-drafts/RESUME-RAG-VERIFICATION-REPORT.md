# Resume/CV RAG Verification Report

**Date:** 2026-01-30
**Reviewed By:** Web-Content-Builder-Agent
**Source File:** `/content-drafts/resume-cv.md`
**RAG Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl` (100 verified entries)

---

## Executive Summary

The existing resume draft at `/content-drafts/resume-cv.md` is a **template with placeholder text** that contains critical factual errors and missing information. Similar to the About page issue, this resume cannot be published without complete rewrite using RAG-verified facts.

**Status:** ❌ **NOT READY FOR PUBLICATION** - Template placeholders and incorrect professional positioning

---

## Critical Issues Identified

### 1. ❌ **Incorrect Professional Title**

**Current (line 11):**
```
**AI Engineer and Developer** | Specializing in LLM Integration, Process Automation, and AI-Driven Systems
```

**Problem:** Mike is NOT an AI/ML Engineer. This misrepresents his background and expertise.

**RAG Source (rag-2026-01-30-080):**
> "Mike Jones founded Velocity Partners bringing 29 years of industry expertise. Career highlights: Xbox launch team member and SDK patent holder, PMO leadership at Kabam during hypergrowth..."

**RAG Source (rag-2026-01-27-011):**
> "Mike positions himself as an 'AI-Augmented Organizational Intelligence Architect' who combines traditional PMO/process design (RACI, cadences, value streams) with modern automation..."

**Correct Positioning:**
- Program/Project Management with AI Implementation expertise
- "AI-Augmented Organizational Intelligence Architect"
- 29 years in program management, NOT machine learning engineering

---

### 2. ❌ **Professional Summary Missing Key Context**

**Current (lines 15-17):**
```
Accomplished AI engineer and systems architect with [X] years of experience designing, building, and deploying AI-augmented workflows...
```

**Problems:**
- Uses placeholder "[X] years"
- Incorrectly positions as "AI engineer"
- Missing the actual value proposition: program management + AI implementation

**RAG Source (rag-2026-01-30-092):**
> "We're not strategy consultants who disappear after delivering a deck. We're organizational intelligence architects who roll up our sleeves and implement systems that actually work—combining 29 years of industry experience with modern AI tools."

**What's Missing:**
- 29 years of experience (not placeholder)
- Core expertise: Program management, process design, organizational intelligence
- AAPD methodology (AI-Augmented Process Design)
- Gaming/entertainment/media industry specialization
- Velocity Partners positioning (consulting, not job-seeking)

---

### 3. ❌ **Empty Professional Experience Section**

**Current (lines 22-118):** Entire section is placeholder templates like:
```
**[Job Title]** | [Company Name] | [Location] | [Dates]
```

**Problems:**
- No actual career history
- Missing all major companies and achievements
- No dates, roles, or accomplishments

**RAG-Verified Career History:**

**Microsoft Xbox & Xbox 360** (1999+)
- Launch team member (6 AAA titles)
- Created VINCE instrumentation tool (Xbox SDK patent)
- Invented data visualization that led to Halo's "Kill Cam" feature

**Kabam** (Director)
- PMO leadership during hypergrowth
- Established workflows for distributed teams
- Managed teams building top-grossing mobile games

**Livescribe** (Director)

**Kinoo** (Director)
- AR communication platform (10 awards including CES Innovation Award)
- Created C3PO production process
- Led technical decisions (MQTT for OTA updates)
- Managed cross-functional teams (FW, HW, SW, creative, QA)

**8 Circuit Studios** (Co-Founder)
- Web3 gaming company
- Wrote white paper and 8Bit Token design
- Built proto-metaverse vision

**Verizon** (Consultant, Go90 team)
- Content pipeline transformation: 24-36 hours → 2-4 hours
- $2M+ annual cost savings
- Process automation across 5 business groups

**Velocity Partners** (2025-present)
- Founded consulting service (division of Jones Collaboration Company, LLC)
- Fractional PMO + AI implementation
- Gaming/entertainment/media focus

---

### 4. ❌ **Missing Key Achievements and Metrics**

**Current:** Generic bullet points with placeholders

**RAG-Verified Achievements:**

**RAG Source (rag-2026-01-27-006):**
> "Mike achieved 80% improvement in delivery predictability and 3x operational efficiency improvements in past roles."

**RAG Source (rag-2026-01-27-007):**
> "Mike has managed teams of 50-120+ people and budgets of $4M-$12M+."

**RAG Source (rag-2026-01-29-012):**
> "Kinoo's AR gaming/communication platform won 10 awards including the CES Innovation Award."

**RAG Source (rag-2026-01-29-021):**
> "His 2025 ChatGPT report showed he was in the top 1% of users and top 3% for conversations."

**RAG Source (rag-2026-01-29-002):**
> "At Verizon... Within 3 months: reduced to under 24 hours. By 6 months: hit 'overnight' target of 8 hours. By 9 months: under 6 hours. Within a year: fully automated process delivering in 2-4 hours for most content. This resulted in over $2 million annual cost savings."

**What's Missing:**
- Xbox SDK patent (VINCE tool)
- 80% delivery improvement, 3x efficiency gains
- Managed teams of 50-120+ people
- Managed budgets of $4M-$12M+
- Top 1% ChatGPT user
- 10 awards for Kinoo platform
- $2M+ cost savings at Verizon

---

### 5. ❌ **Technical Skills Section Incomplete**

**Current (lines 120-152):** Generic AI/ML skills list

**Problems:**
- Focuses too heavily on ML engineering skills (not Mike's expertise)
- Missing program management tools and methodologies
- Missing AAPD methodology
- Missing context engineering and AI implementation focus

**RAG Source (rag-2026-01-30-081):**
> "AI-Augmented Process Design (AAPD) is Mike's signature methodology that treats AI as an execution multiplier - one that only works when the underlying process is sound."

**RAG Source (rag-2026-01-29-011):**
> "Kinoo's AR communication platform used: Unity Game Engine (C++), Twilio for data conferencing, Photon for networking, Auth0 for OAuth, Computer Vision... Backend: AWS (DynamoDB, S3, Redshift)... MQTT for OTA updates."

**What Should Be Emphasized:**
- AAPD (AI-Augmented Process Design) methodology
- Context engineering and prompt design
- LLM integration (Claude, ChatGPT, OpenWebUI/Ollama)
- Process automation (n8n, webhooks, AI agents)
- PMO tools (JIRA, SmartSheets, Miro, Notion)
- Gaming tech stack (Unity, AWS, Photon, Twilio)
- Organizational memory systems

---

### 6. ❌ **Education Section Missing**

**Current (lines 154-164):** Placeholder templates

**RAG Source (rag-2026-01-29-015):**
> "In college, he pursued political science... he enrolled at University of Washington for computer science, where he met someone working at Microsoft Games."

**Known Education:**
- Political Science degree (college)
- University of Washington - Computer Science (enrolled, met Microsoft contact)

**Note:** Need to clarify completion status and exact degrees

---

### 7. ❌ **Missing Projects Section**

**Current:** No projects section

**RAG-Verified Projects:**

**AI Memory System** (rag-2026-01-27-018)
> "Personal knowledge management infrastructure that maintains context across AI conversations and platforms... structured JSONL ledger... continuous project context across Claude, ChatGPT, and local AI."

**Local LLM Setup** (rag-2026-01-27-019)
> "Self-hosted AI infrastructure running on a Mac Mini... combines Ollama, OpenWebUI, and MCP bridge... demonstrates hands-on AI infrastructure expertise."

**NeighborhoodShare** (rag-2026-01-27-027)
> "Tool-sharing platform for local communities. Part of the 7 Pillars of Resilience framework."

**Resilient Tomorrow** (Substack)
> "Essays on technology, resilience, and building sustainable systems. 7 Pillars of Personal Resilience framework."

---

### 8. ❌ **Missing Professional Positioning Context**

**Current:** Resume implies job-seeking

**RAG Source (rag-2026-01-30-100):**
> "Velocity Partners is Mike's consulting service focused on fractional PMO with AI implementation... Both are divisions of Jones Collaboration Company, LLC."

**Critical Context:**
- Mike runs Velocity Partners (not seeking employment)
- Resume should position for consulting clients, not employers
- Focus on proven results and methodology (AAPD)
- Emphasize player/coach implementation model

---

## Recommendations

### Must Fix Before Publishing:

1. ✅ **Rewrite Professional Summary**
   - Correct title: "AI-Augmented Organizational Intelligence Architect"
   - 29 years experience in program/project management
   - Gaming/entertainment/media specialization
   - AAPD methodology
   - Velocity Partners positioning

2. ✅ **Complete Professional Experience Section**
   - Microsoft Xbox (VINCE tool, patent, 6 AAA titles)
   - Kabam (director, PMO hypergrowth)
   - Livescribe (director)
   - Kinoo (director, 10 awards, C3PO process)
   - 8 Circuit Studios (co-founder, Web3 gaming)
   - Verizon (consultant, $2M savings)
   - Velocity Partners (current, consulting)
   - Include specific dates, achievements, metrics

3. ✅ **Add Key Achievements Section**
   - 80% delivery improvement
   - 3x operational efficiency
   - Teams: 50-120+ people
   - Budgets: $4M-$12M+
   - Top 1% ChatGPT user
   - Xbox SDK patent holder
   - 10 awards (Kinoo)

4. ✅ **Correct Technical Skills**
   - AAPD methodology
   - Context engineering
   - LLM integration (not ML model training)
   - Process automation
   - PMO tools
   - Gaming tech stack

5. ✅ **Add Projects Section**
   - AI Memory System
   - Local LLM Setup
   - NeighborhoodShare
   - Resilient Tomorrow

6. ✅ **Clarify Education**
   - Political Science degree
   - University of Washington CS coursework
   - (Verify completion status)

---

## RAG Sources Referenced

**Career History:**
- rag-2026-01-27-001 through rag-2026-01-27-007 (career facts)
- rag-2026-01-29-001 through rag-2026-01-29-008 (career narratives)
- rag-2026-01-30-080 (29 years experience)

**Professional Positioning:**
- rag-2026-01-27-011 (differentiation)
- rag-2026-01-30-092 (Velocity Partners positioning)

**Skills and Achievements:**
- rag-2026-01-27-006 (metrics: 80%, 3x)
- rag-2026-01-27-007 (team size, budgets)
- rag-2026-01-29-012 (Kinoo awards)
- rag-2026-01-29-021 (ChatGPT top 1%)

**Methodology:**
- rag-2026-01-30-081 through rag-2026-01-30-094 (AAPD)

**Projects:**
- rag-2026-01-27-018 (AI Memory)
- rag-2026-01-27-019 (Local LLM)

**Education:**
- rag-2026-01-29-015 (origin story)

---

## Next Steps

1. Create new resume content using RAG-verified facts
2. Position for consulting (Velocity Partners), not employment
3. Emphasize AAPD methodology and proven results
4. Include specific achievements with metrics
5. Publish to Ghost Pro at `/resume` or `/cv`
6. Mark Task #2 complete and notify PM

---

**Report Generated:** 2026-01-30
**Agent:** Web-Content-Builder-Agent
**Status:** Ready to create corrected resume content
