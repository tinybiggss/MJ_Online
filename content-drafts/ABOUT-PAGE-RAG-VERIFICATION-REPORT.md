# About Page RAG Verification Report

**Date:** 2026-01-30
**Reviewer:** web-content-builder agent
**Status:** ❌ MAJOR DISCREPANCIES FOUND

---

## Executive Summary

The existing About page draft (`/content-drafts/about-page.md`) contains **critical factual errors** that contradict the RAG knowledge base. The draft cannot be published without a complete rewrite.

---

## Critical Issues Found

### 1. ❌ WRONG Professional Positioning

**Draft says:**
> "I'm Mike Jones, an AI engineer and developer"

**RAG says:**
- Mike has **29 years of experience in program and project management**
- He's a **systems thinker** who creates better processes
- He's **NOT** a machine learning engineer or AI developer
- His expertise is **AI implementation and integration**, not ML engineering

**Source:** rag-2026-01-27-001, rag-2026-01-30-080, rag-2026-01-29-016

### 2. ❌ Missing Experience Duration

**Draft says:**
> "Over the past several years, I've deliberately shifted my focus toward artificial intelligence"

**RAG says:**
- Mike has **29 years in tech** (started 1997 at Aviation Supplies & Academics)
- The draft makes it sound like he's early in his career - completely wrong

**Source:** rag-2026-01-30-080, rag-2026-01-30-100

### 3. ❌ Vague Career History

**Draft:** Generic statements about "diverse roles in software development"

**RAG has specific achievements:**
- Microsoft Xbox & Xbox 360 launch teams (6 AAA titles)
- **Xbox SDK patent holder** (VINCE instrumentation tool)
- Director roles at Kabam, Livescribe, Kinoo
- Co-founder of 8 Circuit Studios (Web3 gaming)
- Top 1% ChatGPT user, top 3% for conversation volume

**Source:** rag-2026-01-27-002, rag-2026-01-27-003, rag-2026-01-29-022

### 4. ❌ Missing Business Context

**Draft:** Positions Mike as job-seeking ("If you're looking for someone...")

**RAG says:**
- Mike has **Velocity Partners** consulting service (fractional PMO + AI implementation)
- Jones Collaboration Company, LLC is the parent company
- He's **offering consulting services**, not seeking employment

**Source:** rag-2026-01-30-071, rag-2026-01-30-100

### 5. ❌ Missing "Creating Better Systems" Through-Line

**Draft:** Doesn't mention the consistent career thread

**RAG says:**
- **"Across 26+ years, Mike's career has one consistent thread: creating better systems"**
- This started even before tech (warehouse manager optimizing workflows)
- Examples: VINCE tool at Microsoft, process improvements at Kabam, etc.

**Source:** rag-2026-01-29-016

### 6. ❌ Wrong Publication Name

**Draft says:**
> "Operational Intelligence for Velocity Partners"

**RAG says:**
- Correct name: **"Organizational Intelligence"** newsletter
- Serves Velocity Partners clients and prospects

**Source:** rag-2026-01-30-100

### 7. ❌ Missing Key Achievements

**Not mentioned in draft:**
- Top 1% ChatGPT user (2025 report)
- AI-Augmented Process Design (AAPD) methodology
- 7 Pillars framework for resilience
- Insight Float (flotation center venture, 2016)
- 80% delivery predictability improvement
- 3x operational efficiency improvements

**Source:** Multiple RAG entries

### 8. ❌ Missing Origin Story

**RAG has compelling origin story:**
- Childhood dream of making video games (age 10-14)
- Political science degree (fascinated by systems, not politics)
- Accidentally discovered tech talent through roommate's MS networking certification
- Hacked college network for multiplayer Doom
- Got Microsoft Games job within 6 weeks of meeting someone there

**Source:** rag-2026-01-29-015

---

## What the About Page SHOULD Include

### Based on RAG Entries (topic: "about"):

1. **Introduction:**
   - 29 years in tech
   - Creating better systems (consistent through-line)
   - Program/project management with AI implementation expertise

2. **Origin Story:**
   - Childhood dream of video games
   - Political science → systems thinking
   - Path to Microsoft Games

3. **The Through-Line:**
   - Creating better systems (from warehouse to Xbox to AI)
   - People-centered approach
   - Making invisible work visible (VINCE tool example)

4. **Career Highlights:**
   - Microsoft Xbox launch team + patent
   - Director roles at Kabam, Livescribe, Kinoo
   - 8 Circuit Studios (Web3 gaming)
   - Top 1% ChatGPT user

5. **AI Transition:**
   - Started 2.5 years ago
   - AI helps organize systems thinking into actionable plans
   - Top 1% ChatGPT user, mastered prompting and context engineering

6. **Current Work:**
   - Velocity Partners consulting (fractional PMO + AI implementation)
   - Resilient Tomorrow publication
   - AI Memory System and Local LLM infrastructure
   - AAPD methodology

7. **Projects & Vision:**
   - How projects connect through 7 Pillars framework
   - NeighborhoodShare, OfflineAI projects
   - Knowledge stewardship and communication independence

8. **Beyond Work:**
   - Burning Man community
   - Insight Float venture (2016)
   - Creator economy advocacy (8CS motivation)

---

## Recommendation

**ACTION REQUIRED:** Complete rewrite of About page using RAG-verified facts.

**DO NOT** publish the existing draft - it misrepresents Mike's professional background and positioning.

---

## Verified Sources

All claims verified against:
- `/Cowork/content/rag/knowledge.jsonl` (100 entries)
- Schema: `/Cowork/content/rag/RAG_SCHEMA.md`
- Topic: "about" (8 narrative entries, 1 Q&A)
- Topic: "career_history" (19 fact entries)
- Topic: "velocity_partners" (16 entries)

---

**Next Steps:**
1. ✅ Create new About page from scratch using RAG facts
2. ✅ Verify every claim against RAG knowledge base
3. ✅ Get user approval before publishing
