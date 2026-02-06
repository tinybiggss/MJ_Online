# Change: Add Job Fit Analyzer Tool

## Why

Potential employers visiting mikejones.online often have specific job descriptions and need to quickly assess whether Mike is a good fit for their role. Currently, they must:
1. Read through multiple case studies and pages
2. Manually compare their requirements to Mike's experience
3. Contact Mike without knowing fit level

A **Job Fit Analyzer** tool provides:
1. **Instant fit assessment** - Upload job description, get immediate analysis
2. **Structured evaluation** - Clear breakdown of strengths, gaps, and discussion areas
3. **Lead qualification** - Helps both parties understand fit before initial conversation
4. **Portfolio demonstration** - Shows advanced AI implementation (semantic matching, structured analysis)
5. **Time savings** - Visitors get answers in 30 seconds instead of 30 minutes of reading

This feature targets the primary audience (employers/recruiters) and directly supports the career portfolio goal by making it easy to assess Mike's fit for specific roles.

## What Changes

- Add new page at `/fit-analyzer` (or similar URL)
- Create form with textarea for pasting job descriptions
- Implement backend RAG analysis comparing job requirements to Mike's knowledge base
- Use AI to generate structured fit analysis:
  - **Strong Matches:** Where Mike excels for this role
  - **Potential Gaps:** Where experience may not align
  - **Discussion Areas:** Aspects that need clarification or are stretch goals
  - **Overall Fit Score:** High/Medium/Low with explanation
- Display results in clear, scannable format with visual indicators
- Include CTA to schedule consultation or contact Mike
- Track analytics on job types submitted and fit scores

**Implementation Approach:**
- **Phase 1 (MVP):** Simple form, basic RAG matching, structured text output (1-2 weeks)
- **Phase 2 (Enhanced):** Visual fit indicators, PDF export, save/share results (1-2 weeks)
- **Phase 3 (Advanced):** Multi-job comparison, fit history, enhanced matching (2-3 weeks, optional)

**Architecture:** Same serverless approach as chatbot (Cloudflare Workers + OpenAI API)

**Cost Impact:**
- Cloudflare Workers: Free tier (shared with chatbot)
- OpenAI API: ~$0.05-0.10 per analysis (GPT-4 recommended for quality)
- Estimated: $5-15/month additional (assuming 50-150 analyses/month)

## Impact

### Affected Specs
- **NEW capability:** `job-fit-analyzer` - Creating new spec (no existing capabilities modified)
- **May reference:** `chatbot` capability (shared knowledge base and backend infrastructure)

### Affected Code
- New Ghost page: `/fit-analyzer` (custom page with embedded tool)
- Shared backend: Can reuse chatbot backend with new endpoint
- New components: Job description parser, fit scoring algorithm, results display

### Affected Content
- Knowledge base: `/Cowork/content/rag/knowledge.jsonl` (read-only, same as chatbot)
- May need additional entries focused on:
  - Skills taxonomy (programming languages, tools, methodologies)
  - Industry experience matrix (gaming, media, entertainment)
  - Role experience (PM, Director, Consultant)

### Dependencies
- OpenAI API (external service, same as chatbot)
- Cloudflare Workers (serverless platform, shared)
- Ghost CMS (page creation)
- Same knowledge base as chatbot

### User Experience Impact
- **Access:** Dedicated page linked from navigation (e.g., "Assess Fit" or "Hiring?")
- **Usage:** Single-use tool (paste JD → get analysis → contact or leave)
- **Time:** 30-60 seconds to get full analysis
- **Value:** Immediate clarity on fit without reading entire portfolio

### Migration Path
- No migration needed (net-new feature)
- Standalone page, can be disabled without affecting other features
- Can share backend infrastructure with chatbot if both exist

## Timeline

**Post-Launch Enhancement:** This feature is scheduled AFTER core website content is complete and live. Can be implemented in parallel with or after chatbot (Phase 7.6).

**Estimated Schedule:**
- Week 1: Page design and form implementation
- Week 2: Backend analysis logic (RAG + AI)
- Week 3: Results display and testing
- Week 4: Polish, analytics, launch

**Blocking Dependencies:**
- Core website content must be published first
- Knowledge base finalized (currently complete)
- Ghost Pro site accessible (currently live)
- Chatbot backend (optional - can share infrastructure)

## Success Metrics

**Launch Metrics (First 3 Months):**
- 5-15% of visitors use the tool (higher engagement than chatbot due to specificity)
- Average analysis time: < 60 seconds
- 30-50% of analyses result in "High Fit" score
- 15-25% of tool users click "Contact Mike" or "Schedule Call"
- High satisfaction (if feedback mechanism added)

**Quality Metrics:**
- Analysis accuracy validated against manual review
- False positive rate < 10% (claiming fit when not a good match)
- False negative rate < 5% (missing good matches)
- User feedback indicates analysis was helpful

**Business Impact:**
- Higher quality inbound inquiries (pre-qualified leads)
- Reduced time spent on unfit opportunities
- Demonstrates AI expertise to technical employers

## Decisions Made

1. **Page Location & Results Display:**
   - **Input form:** Embedded in multiple locations (About page, Resume page, navigation link)
   - **Results display:** Dedicated results page at `/fit-analyzer/results` or similar
   - **Flow:** Visitor pastes JD anywhere → analysis runs → redirects to dedicated results page
   - **Benefit:** Easy access from multiple touchpoints, focused results experience

2. **Analysis Depth (Progressive Disclosure):**
   - **Initial view:** Quick overview summary ("Here's a quick overview...")
   - **Detailed breakdown:** Click button/expand to generate/show full detailed analysis
   - **Progressive enhancement:** Start with fast overview, load detail on demand
   - **UX benefit:** Fast initial results, deep dive available for interested visitors

3. **Scoring System:**
   - **Format:** Categorical scoring with 4 levels:
     - **Perfect** (100% match - all requirements met)
     - **High** (strong fit, minor gaps)
     - **Medium** (decent fit, some gaps)
     - **Low** (significant misalignment)
   - **Granularity:** Each area of the job gets its own score (e.g., Technical Skills: High, Industry Experience: Perfect, Management Experience: Medium)
   - **Overall score:** Aggregate of area scores with reasoning
   - **Visual:** Color-coded badges (green for Perfect/High, yellow for Medium, orange for Low)

4. **Privacy & Logging:**
   - **Log 100% of job descriptions** submitted
   - **Retention:** Full job description text, timestamp, analysis results, fit scores
   - **Purpose:** Understand what roles visitors are assessing, improve matching algorithm, identify trends
   - **Analytics focus:** Job types, industries, seniority levels, common requirements, fit score distribution

5. **Access Control & Lead Capture:**
   - **Free tier (no email required):**
     - Paste job description and run analysis
     - See quick overview summary
     - See first 2-3 lines of each section (Strong Matches, Potential Gaps, Discussion Areas)
   - **Full access (email required):**
     - Complete detailed breakdown for all sections
     - Full scoring details for each area
     - Specific evidence/examples from knowledge base
     - CTA to schedule call or contact Mike
   - **Gating mechanism:** Email form appears after initial results, before detailed breakdown
   - **Value exchange:** Quick preview proves value, full analysis captures lead

6. **Multi-Job Support (Comparison Feature):**
   - **Phase 2/3 enhancement:** Allow comparing multiple job descriptions
   - **Expected usage:** Low (not heavily utilized)
   - **Decision:** Yes, implement as Phase 2 or 3 feature
   - **Use case:** Visitors comparing multiple opportunities, recruiters assessing fit across roles
   - **Implementation:** Side-by-side comparison table showing fit scores, shared strengths, unique gaps

## References

- **Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl` (70 entries, shared with chatbot)
- **RAG Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`
- **Project Status:** `/Cowork/PROJECT_STATUS.md`
- **Requirements:** `/plans/requirements-specification.md` (Section 2.2: Target Audiences - Employers)
- **Chatbot Feature:** `/openspec/changes/add-rag-chatbot/` (related feature, shared infrastructure)

## Related Features

**Chatbot (Phase 7.6):**
- Both use same knowledge base
- Both use RAG retrieval + AI analysis
- Can share backend infrastructure
- Complementary: Chatbot for exploration, Fit Analyzer for specific roles

**Potential Synergy:**
- Chatbot could link to Fit Analyzer: "I can analyze a specific job description for you"
- Fit Analyzer results could link to chatbot: "Ask me questions about Mike's experience"
- Shared analytics platform for both tools
