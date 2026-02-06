# Design: Job Fit Analyzer Tool

## Context

The Job Fit Analyzer allows potential employers to paste a job description and receive an AI-powered analysis of Mike's fit for the role. This complements the chatbot (Phase 7.6) by providing a focused, task-specific tool rather than open-ended conversation.

**Background:**
- Primary audience: Employers and recruiters (60% of traffic per requirements)
- Problem: Manual assessment of fit is time-consuming
- Opportunity: Demonstrate AI expertise while qualifying leads
- Asset: Existing 70-entry knowledge base with career history, skills, projects

**Constraints:**
- Budget: $5-15/month additional cost (shared infrastructure with chatbot)
- Quality threshold: 90%+ accuracy in fit assessment
- Performance: < 60 seconds total analysis time
- Privacy: Job descriptions contain sensitive company info, handle carefully

**Stakeholders:**
- Primary: Employers/recruiters assessing Mike for roles
- Secondary: Mike (lead qualification, time savings)
- Tertiary: Hiring teams (shareable analysis results)

## Goals / Non-Goals

### Goals
- ✅ Accurate fit assessment (90%+ accuracy vs manual review)
- ✅ Fast analysis (< 60 seconds end-to-end)
- ✅ Clear, actionable results (strengths, gaps, discussion points)
- ✅ Lead qualification (filter high-fit vs low-fit opportunities)
- ✅ Portfolio demonstration (advanced AI implementation)
- ✅ User-friendly interface (minimal friction)

### Non-Goals
- ❌ Salary negotiation calculator
- ❌ Automated job application submission
- ❌ Multi-candidate comparison (only Mike vs job)
- ❌ Resume builder or optimizer
- ❌ Job search engine or aggregator

## Decisions

### Decision 1: Dedicated Page (Not Widget or Embedded Form)

**Choice:** Create standalone page at `/fit-analyzer` with full-page tool

**Rationale:**
- **Focused experience:** Users come specifically for this task
- **Space for results:** Detailed analysis needs room to display properly
- **SEO opportunity:** Page can rank for "assess job fit" searches
- **Easy to find:** Prominent link from navigation, Resume page, About page
- **Professional presentation:** Dedicated page feels more substantial

**Alternatives Considered:**
1. **Widget on every page (like chatbot)**
   - **Pros:** Always available, more discovery
   - **Cons:** Cluttered UI, results too complex for widget, competes with chatbot
   - **Decision:** Rejected - different use case than chatbot

2. **Embedded form on Resume page**
   - **Pros:** Contextual placement, fewer pages
   - **Cons:** Limited space, splits attention from resume content
   - **Decision:** Rejected - needs dedicated focus

### Decision 2: Structured JSON Analysis (Not Prose)

**Choice:** AI generates structured JSON with specific categories, frontend renders it

**Rationale:**
- **Consistency:** Every analysis has same structure (easy to compare)
- **Scannability:** Users can quickly find relevant sections
- **Visual design:** Can add icons, colors, progress bars for each category
- **Reliability:** Structured output easier to validate than freeform text
- **Reusability:** JSON can be exported, saved, shared

**Structure:**
```json
{
  "overall_fit": {
    "score": "high|medium|low",
    "reasoning": "2-3 sentence explanation",
    "recommendation": "Strong fit for this role" | "Proceed with discussion" | "Better opportunities elsewhere"
  },
  "strong_matches": [
    {
      "category": "skill|experience|industry|role_type",
      "item": "Specific skill or experience",
      "evidence": "Quote from knowledge base",
      "confidence": "high|medium|low"
    }
  ],
  "potential_gaps": [
    {
      "requirement": "From job description",
      "why_missing": "Explanation of gap",
      "severity": "high|medium|low",
      "mitigation": "How Mike might address this"
    }
  ],
  "discussion_areas": [
    {
      "topic": "Area needing clarification",
      "question": "Specific question to ask in conversation",
      "importance": "critical|important|nice_to_know"
    }
  ]
}
```

**Alternatives Considered:**
1. **Freeform essay-style analysis**
   - **Pros:** More natural, easier prompt engineering
   - **Cons:** Inconsistent structure, hard to scan, no visual design
   - **Decision:** Rejected - less useful for busy recruiters

### Decision 3: GPT-4 Turbo (Not GPT-3.5)

**Choice:** Use GPT-4 Turbo for analysis (despite higher cost)

**Rationale:**
- **Accuracy critical:** False positives/negatives hurt credibility
- **Complex task:** Requires nuanced understanding of job requirements and experience matching
- **Cost acceptable:** ~$0.05-0.10 per analysis, 50-150 analyses/month = $5-15/month
- **Quality difference:** GPT-4 significantly better at structured output and reasoning
- **Portfolio demonstration:** Using best model shows commitment to quality

**Cost Analysis:**
- GPT-4 Turbo: ~$0.05-0.10/analysis (2-4K tokens)
- GPT-3.5: ~$0.01-0.02/analysis
- Savings: $2-5/month if using GPT-3.5
- **Decision:** Quality worth the cost for this use case

**Alternatives Considered:**
1. **GPT-3.5 (cheaper)**
   - **Pros:** 5x cheaper
   - **Cons:** Lower accuracy, weaker structured output, more hallucination
   - **Decision:** Cost savings not worth quality risk

2. **Local LLM (Qwen 2.5:14B)**
   - **Pros:** Free API costs, privacy
   - **Cons:** Quality uncertain, slower, needs VPS setup
   - **Decision:** Save for Phase 3 if demand justifies it

### Decision 4: Weighted Scoring Algorithm

**Choice:** Use weighted algorithm combining multiple factors

**Scoring Factors:**
1. **Required Skills Match (40% weight)**
   - Extract required skills from JD (languages, tools, methodologies)
   - Match against Mike's skills in knowledge base
   - Count matches, calculate percentage

2. **Experience Level Match (30% weight)**
   - Extract years required and seniority level
   - Compare to Mike's 26+ years and director-level roles
   - Binary: matches or doesn't

3. **Industry Match (20% weight)**
   - Extract industry (gaming, entertainment, media, tech)
   - Match against Mike's background
   - Partial credit for adjacent industries

4. **Role Type Match (10% weight)**
   - Extract role (PM, Director, Consultant, IC)
   - Match against Mike's experience
   - Partial credit for similar roles

**Overall Score:**
- **High Fit (80%+):** Strong recommendation, schedule call
- **Medium Fit (60-79%):** Worth discussing, some gaps to address
- **Low Fit (<60%):** Significant misalignment, not recommended

**Rationale:**
- **Objective baseline:** Weighted scores provide consistent starting point
- **AI enhancement:** AI reasoning adds nuance and context
- **Explainability:** Can show which factors contributed to score
- **Calibration:** Weights can be adjusted based on real-world feedback

**Alternatives Considered:**
1. **Pure AI judgment (no algorithm)**
   - **Pros:** More flexible, considers intangibles
   - **Cons:** Inconsistent, hard to calibrate, less explainable
   - **Decision:** Hybrid approach better - algorithm + AI reasoning

### Decision 5: Privacy-First (Analyze and Discard)

**Choice:** Do not store job descriptions, only log aggregate metadata

**What We Store:**
- Analysis results (fit score, categories identified)
- Required skills mentioned (keywords)
- Industry and role type
- Timestamp
- CTA clicked (if any)

**What We Don't Store:**
- Full job description text
- Company name (if mentioned)
- Contact information (if included)
- Proprietary information

**Retention:**
- Aggregate analytics: Indefinite
- Individual analyses: Discard immediately after response sent
- Logs: 30 days maximum

**Rationale:**
- **Trust:** Job descriptions often contain confidential company info
- **GDPR compliance:** No personal data stored
- **Professional respect:** Competitors' job postings, internal role details
- **Less risk:** No sensitive data = no breach risk

**Privacy Notice:**
"Your job description is analyzed privately and not stored. We log only aggregate metrics to improve the tool."

**Alternatives Considered:**
1. **Store for analysis improvement**
   - **Pros:** Could train custom model, better pattern detection
   - **Cons:** Privacy risk, trust issue, GDPR complexity
   - **Decision:** Rejected - trust more important than data

## Technical Stack

### Frontend
- **Page:** Ghost native page editor (Markdown + custom HTML/CSS)
- **Form:** HTML textarea + vanilla JavaScript (no framework)
- **Results:** Client-side rendering from JSON response
- **Styling:** CSS with visual indicators (icons, colors, cards)
- **Size:** < 30KB total (lightweight)

### Backend
- **Runtime:** Cloudflare Workers (shared with chatbot if exists)
- **Language:** JavaScript/TypeScript
- **AI Provider:** OpenAI GPT-4 Turbo
- **Storage:** None (ephemeral analysis)
- **Analytics:** Cloudflare Workers KV (aggregate metrics only)

### Data Flow
```
User pastes JD
    ↓
Frontend validation (500-5000 chars)
    ↓ POST /analyze-fit
Cloudflare Workers Endpoint
    ↓
Rate limit check (3/hour, 20/day per IP)
    ↓
Job Description Parser
    ├─ Extract requirements (skills, experience, industry, role)
    ├─ Structure into categories
    └─ Prepare for RAG retrieval
    ↓
RAG Retrieval
    ├─ Load knowledge.jsonl (cached)
    ├─ Match requirements to knowledge entries
    ├─ Rank by relevance
    └─ Select top 10-15 entries
    ↓
Weighted Scoring Algorithm
    ├─ Calculate skill match (40%)
    ├─ Calculate experience match (30%)
    ├─ Calculate industry match (20%)
    ├─ Calculate role match (10%)
    └─ Compute overall score (0-100)
    ↓
OpenAI GPT-4 Turbo
    ├─ System prompt (fit analyzer role)
    ├─ Context: JD + knowledge entries + preliminary score
    ├─ Task: Generate structured JSON analysis
    └─ Output: {overall_fit, strong_matches, potential_gaps, discussion_areas}
    ↓
Validation & Formatting
    ├─ Validate JSON structure
    ├─ Ensure all required fields present
    └─ Format for frontend display
    ↓
Response
    ├─ Log aggregate metrics (score, categories, timestamp)
    ├─ Discard JD text
    ├─ Return JSON to frontend
    └─ Frontend renders results
```

### Performance Targets
- **Form load:** < 500ms
- **Analysis time:** < 45 seconds (P95)
  - JD parsing: < 1s
  - RAG retrieval: < 500ms
  - Scoring algorithm: < 500ms
  - OpenAI API: 30-40s (largest component)
  - Response formatting: < 1s
- **Rate limit check:** < 10ms
- **Page weight:** < 500KB total

## Risks / Trade-offs

### Risk 1: Analysis Accuracy (False Positives/Negatives)
**Impact:** High (damages credibility)
**Likelihood:** Medium (AI hallucination risk)

**Mitigation:**
- Use GPT-4 (higher accuracy than GPT-3.5)
- Weighted algorithm provides objective baseline
- Test with 20+ real JDs before launch
- Manual review of first 50 analyses
- Feedback mechanism ("Was this helpful?")
- Conservative fit scoring (avoid over-promising)

**Acceptance Criteria:**
- < 10% false positives (claims fit when not a match)
- < 5% false negatives (misses good matches)
- 90%+ accuracy validated by manual review

### Risk 2: Job Description Privacy
**Impact:** High (legal/trust issue if JD leaked)
**Likelihood:** Low (with proper design)

**Mitigation:**
- Do not store JD text (analyze and discard)
- Log only aggregate metadata
- Clear privacy notice on page
- HTTPS required (Ghost Pro enforces)
- No third-party analytics on JD text

### Risk 3: Cost Spike (Viral Usage)
**Impact:** Medium (budget constraint)
**Likelihood:** Low (niche tool)

**Mitigation:**
- Strict rate limiting (3/hour, 20/day per IP)
- Cost monitoring with alerts ($50/month threshold)
- Can temporarily disable if costs exceed budget
- GPT-4 Turbo cheaper than GPT-4 standard

**Cost Estimates:**
- Low usage: 50 analyses/month = $2.50-5/month
- Medium usage: 150 analyses/month = $7.50-15/month
- High usage: 500 analyses/month = $25-50/month (unlikely for niche tool)

### Risk 4: Knowledge Base Staleness
**Impact:** Medium (outdated analysis)
**Likelihood:** Medium (as Mike's experience evolves)

**Mitigation:**
- Knowledge base version control (Git)
- Quarterly review process
- Update when new projects/skills added
- Analytics track "gap" frequency (might indicate missing info)

### Risk 5: User Confusion (Complex Results)
**Impact:** Medium (abandonment, frustration)
**Likelihood:** Medium (detailed analysis can overwhelm)

**Mitigation:**
- Clear visual hierarchy (most important first)
- Progressive disclosure (expandable sections)
- Visual indicators (icons, colors) for quick scanning
- Plain language explanations (avoid jargon)
- Include interpretation guide
- User testing with 5+ people before launch

## Migration Plan

### Phase 1: MVP Launch (Weeks 1-4)
1. Build dedicated page with form
2. Implement backend analysis logic
3. Design and implement results display
4. Test with real job descriptions
5. Deploy to production
6. Monitor usage and accuracy

### Phase 2: Enhanced Features (Weeks 5-6)
1. Add visual enhancements (gauges, charts)
2. Implement PDF export
3. Add lead capture (optional email)
4. Improve analysis depth based on feedback

### Phase 3: Advanced Features (Optional, Weeks 7-10)
1. Multi-job comparison
2. Enhanced semantic matching
3. Fit history and trends
4. Integration with chatbot

### Rollback Plan
If critical issues arise:
1. Unpublish `/fit-analyzer` page in Ghost (instant disable)
2. Investigate and fix issue
3. Republish after testing

## Open Questions

### Decided
- ✅ **Location:** Dedicated page at `/fit-analyzer`
- ✅ **Analysis format:** Structured JSON (not prose)
- ✅ **AI model:** GPT-4 Turbo (quality over cost)
- ✅ **Privacy:** Analyze and discard (don't store JDs)

### Still Open
- [ ] **Analysis depth:** Quick overview (200 words) vs detailed (500+ words)?
  - **Recommendation:** Medium depth (300-400 words) - scannable but thorough

- [ ] **Scoring display:** Show numeric score (0-100) or just High/Medium/Low?
  - **Recommendation:** Both - show category + number (e.g., "High Fit: 85/100")

- [ ] **Lead capture:** Require email to see results, or fully anonymous?
  - **Recommendation:** Anonymous for MVP, optional email in Phase 2

- [ ] **Navigation link:** Where to add link? Main nav, footer, Resume page only?
  - **Recommendation:** All three - main nav ("Hiring?"), footer, Resume CTA

- [ ] **Example JD:** Provide example, or require user to bring their own?
  - **Recommendation:** Provide collapsible example to reduce friction

## References

- **Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl`
- **RAG Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`
- **Chatbot Feature:** `/openspec/changes/add-rag-chatbot/` (shared infrastructure)
- **OpenAI API:** https://platform.openai.com/docs/api-reference/chat
- **Requirements:** `/plans/requirements-specification.md` (Section 2.2: Employers)

## Approval

- [ ] Reviewed by: Mike Jones
- [ ] Architecture approved
- [ ] Open questions resolved
- [ ] Ready for implementation

**Last Updated:** 2026-01-29
