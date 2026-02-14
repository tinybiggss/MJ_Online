# RAG-Powered AI Chatbot - Execution Plan
**Project Manager:** Morgan
**Created:** 2026-02-13
**Status:** Ready for Approval and Execution
**Phase:** 7.6 (Post-Launch Enhancement)

---

## Executive Summary

This plan details the execution strategy for implementing a RAG-powered AI chatbot on MikeJones.online. The chatbot will use the existing 190-entry knowledge base to answer visitor questions about Mike's work, experience, and services. This feature demonstrates practical AI implementation while providing 24/7 visitor engagement and lead qualification.

**Timeline:** 3-4 weeks for MVP (Phase 1)
**Cost:** **$1-10/month** (OpenAI GPT-3.5-turbo API only, Cloudflare Workers free tier)
**Risk Level:** LOW (proven architecture, no theme modifications)
**Strategic Value:** HIGH (demonstrates AI expertise, portfolio piece)

**Infrastructure Confirmed:**
- ✅ Cloudflare Workers: FREE tier (100k requests/day - more than sufficient)
- ✅ OpenAI API: GPT-3.5-turbo (cheapest option, $0.50-$1.50 per 1M tokens)
- ✅ Both ChatGPT and Claude API available (can switch providers if needed)

---

## Project Context

### Current Project Status
- **Website:** 90-95% complete, in pre-launch polish phase
- **RAG Knowledge Base:** 190 verified entries (recently expanded 42%)
- **Core Pages:** About, Resume, Projects, Homepage all published
- **Design System:** Established and applied consistently
- **Next Phase:** Post-launch enhancements (Phase 7)

### Why This Feature Matters
1. **Portfolio Demonstration:** Shows practical AI implementation (not just theory)
2. **Visitor Engagement:** 24/7 interactive Q&A about Mike's work
3. **Lead Qualification:** Assesses visitor fit using structured knowledge base
4. **Knowledge Leverage:** Utilizes existing 190-entry RAG database
5. **Meta-Narrative:** Building AI features WITH AI agents (compelling case study)

### Dependencies (All Met ✅)
- ✅ Core website content published and live
- ✅ RAG knowledge base complete (190 entries)
- ✅ Ghost Pro site accessible
- ✅ Design system established
- ✅ Feature specification documented

---

## Implementation Strategy

### Phase 1: MVP Chatbot (3-4 weeks)
**Goal:** Launch working chatbot with basic functionality

**Architecture Decision:** Serverless (Cloudflare Workers + OpenAI API)
- Fast to implement (2-3 weeks vs 4-6 weeks for self-hosted)
- Low cost ($10-30/month vs $40-60/month for VPS)
- No server management (aligns with Ghost Pro approach)
- Auto-scales with traffic
- Can migrate to self-hosted later if needed

**Key Features:**
- Persistent chat widget on all pages (minimized by default)
- Answers questions using 190-entry knowledge base
- Keyword-based RAG retrieval (sufficient for 190 entries)
- OpenAI GPT-3.5 or GPT-4 Turbo for responses
- Rate limiting: 10 messages/visitor/hour, 100/IP/day
- Anonymous conversation logging (30-day retention)
- Mobile responsive (full-screen on mobile)
- Accessible (keyboard nav, screen reader compatible)

### Phase 2: Enhanced Features (1-2 weeks)
**Goal:** Improve UX and conversion

**Enhancements:**
- Cal.com integration for scheduling
- "Learn more" links to relevant pages
- Improved suggested questions based on analytics
- A/B test greeting messages
- Knowledge base expansion (20-30 new entries from unhandled questions)

### Phase 3: Self-Hosted Option (Optional, 2-3 weeks)
**Goal:** Privacy-first, zero API costs

**Migration Path:**
- Set up local LLM (Ollama) on VPS
- Implement vector database (ChromaDB)
- Python FastAPI backend
- Test quality vs OpenAI baseline
- Gradual traffic migration (10% → 50% → 100%)

---

## Detailed Task Breakdown

### Week 1: Backend Foundation
**Agent:** General-purpose development agent or specialized backend agent
**Duration:** 5-7 days

**Tasks:**
1. **Project Setup** (Day 1)
   - [ ] Create new repository: `mj-online-chatbot-backend`
   - [ ] Set up Cloudflare Workers project
   - [ ] Configure environment variables (OpenAI API key, CORS)
   - [ ] Set up local development environment
   - [ ] Initialize Git repository and first commit

2. **Knowledge Base Integration** (Day 2)
   - [ ] Copy `/Cowork/content/rag/knowledge.jsonl` to backend repo
   - [ ] Implement JSONL parser and loader
   - [ ] Create indexing function (topics, types, tags)
   - [ ] Build filtering by topic, type, confidence
   - [ ] Test with sample queries

3. **RAG Retrieval System** (Day 3-4)
   - [ ] Implement question parsing (extract keywords)
   - [ ] Build keyword-based retrieval algorithm
   - [ ] Create entry ranking and selection (top 3-5 most relevant)
   - [ ] Format retrieved entries for AI context injection
   - [ ] Handle edge cases (no matches, multiple topics)
   - [ ] Unit tests for retrieval accuracy

4. **AI Integration** (Day 5-6)
   - [ ] Set up OpenAI API client
   - [ ] Create system prompt with chatbot behavior guidelines
   - [ ] Implement context injection from RAG entries
   - [ ] Build response generation function
   - [ ] Add error handling and fallback responses
   - [ ] Test response quality with 20+ sample questions

5. **API Endpoint** (Day 7)
   - [ ] Create POST /chat endpoint
   - [ ] Implement request validation
   - [ ] Add CORS headers for mikejones.online
   - [ ] Implement rate limiting (Cloudflare Workers KV)
   - [ ] Add anonymous logging for analytics
   - [ ] Integration tests for endpoint

**Deliverables:**
- Working backend API endpoint
- RAG retrieval tested and validated
- Response quality verified
- Rate limiting functional
- Documentation for API usage

---

### Week 2: Frontend Widget
**Agent:** General-purpose development agent or specialized frontend agent
**Duration:** 5-7 days

**Tasks:**
1. **Widget Structure** (Day 1-2)
   - [ ] Create HTML structure (minimized and expanded states)
   - [ ] Build CSS styles matching site design
   - [ ] Implement JavaScript widget initialization
   - [ ] Add conversation state management
   - [ ] Build message rendering (user and bot messages)
   - [ ] Add typing indicator animation

2. **User Interface** (Day 3-4)
   - [ ] Design chat icon (bottom-right corner)
   - [ ] Create expand/collapse animations
   - [ ] Implement input field and send button
   - [ ] Add suggested questions display
   - [ ] Build message history scrolling
   - [ ] Add privacy disclosure footer
   - [ ] Theme matching (light/dark mode support)

3. **Responsive Design** (Day 5)
   - [ ] Desktop layout (400px × 600px window)
   - [ ] Mobile layout (full-screen overlay)
   - [ ] Tablet breakpoints
   - [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
   - [ ] Performance optimization (< 50KB bundle size)

4. **Accessibility** (Day 6)
   - [ ] Keyboard navigation (Tab, Enter, Esc)
   - [ ] ARIA labels and roles
   - [ ] Focus management
   - [ ] Color contrast validation (WCAG AA)
   - [ ] Screen reader testing (NVDA/VoiceOver)

5. **API Integration** (Day 7)
   - [ ] Implement fetch() to backend endpoint
   - [ ] Handle loading states
   - [ ] Error handling and retry logic
   - [ ] Timeout handling
   - [ ] Rate limit feedback to user
   - [ ] End-to-end testing

**Deliverables:**
- Fully functional frontend widget
- Mobile responsive design
- Accessible interface
- API integration working
- Cross-browser compatibility verified

---

### Week 3: Ghost Integration & Testing
**Agent:** Alice (Web-Content-Builder) + QA testing agent
**Duration:** 5-7 days

**Tasks:**
1. **Asset Hosting** (Day 1)
   - [ ] Choose CDN (Cloudflare R2, GitHub Pages, or S3)
   - [ ] Upload JavaScript bundle
   - [ ] Upload CSS styles
   - [ ] Configure CORS headers
   - [ ] Test asset loading from CDN

2. **Ghost Integration** (Day 2)
   - [ ] Access Ghost Admin → Settings → Code Injection
   - [ ] Add widget script tag to Site Footer
   - [ ] Configure widget initialization settings
   - [ ] Test on Ghost staging environment
   - [ ] Verify no conflicts with Kyoto theme

3. **Configuration** (Day 3)
   - [ ] Set API endpoint URL
   - [ ] Configure theme colors to match site
   - [ ] Set greeting message
   - [ ] Define suggested questions (4-5 initial prompts)
   - [ ] Set widget position and behavior

4. **Functional Testing** (Day 4-5)
   - [ ] Test all suggested questions
   - [ ] Verify response accuracy against RAG knowledge base
   - [ ] Test conversation flow and follow-ups
   - [ ] Validate fit assessment logic
   - [ ] Test "I don't know" fallback responses
   - [ ] Test rate limiting (simulate 10+ messages/hour)
   - [ ] Test mobile responsiveness
   - [ ] Cross-browser testing

5. **Analytics Setup** (Day 6)
   - [ ] Track conversation volume (daily/weekly)
   - [ ] Log popular topics asked
   - [ ] Track engagement rate (% visitors who interact)
   - [ ] Monitor question types (career/projects/services/fit)
   - [ ] Log unhandled queries for knowledge base expansion
   - [ ] Set up performance monitoring (response times, errors)
   - [ ] Set up cost monitoring (OpenAI API usage)

6. **Documentation** (Day 7)
   - [ ] Create privacy policy section for chatbot
   - [ ] Document data collection practices
   - [ ] Add FAQ about chatbot capabilities
   - [ ] Create knowledge base update workflow
   - [ ] Document deployment process
   - [ ] Create troubleshooting guide

**Deliverables:**
- Chatbot integrated into Ghost
- All tests passing
- Analytics tracking functional
- Documentation complete
- Ready for production launch

---

### Week 4: Launch & Monitoring
**Agent:** Morgan (PM) + Alice (Web-Content-Builder)
**Duration:** 3-5 days

**Tasks:**
1. **Pre-Launch Checklist** (Day 1)
   - [ ] Verify all tests passing
   - [ ] Verify analytics tracking
   - [ ] Verify rate limiting functional
   - [ ] Verify privacy disclosure present
   - [ ] Verify mobile responsiveness
   - [ ] Verify accessibility compliance
   - [ ] Verify error handling and fallbacks
   - [ ] Test with 50+ sample questions

2. **Soft Launch** (Day 2)
   - [ ] Deploy to production (limited visibility)
   - [ ] Test with small traffic sample
   - [ ] Monitor for 24 hours
   - [ ] Check error rates and response times
   - [ ] Verify conversation quality
   - [ ] Fix any critical issues

3. **Full Launch** (Day 3)
   - [ ] Enable on all pages
   - [ ] Monitor initial traffic closely
   - [ ] Track conversation volume and topics
   - [ ] Monitor OpenAI API costs
   - [ ] Collect initial feedback
   - [ ] Document any issues

4. **Post-Launch Monitoring** (Day 4-5)
   - [ ] Daily monitoring for first week
   - [ ] Review conversation logs for quality
   - [ ] Analyze unhandled questions
   - [ ] Monitor performance metrics
   - [ ] Adjust rate limits if needed
   - [ ] Plan Phase 2 enhancements

5. **Roadmap Update** (Day 5)
   - [ ] Mark Phase 7.6 complete in roadmap
   - [ ] Update PROJECT-MEMORY.json with chatbot implementation
   - [ ] Document decisions, challenges, solutions
   - [ ] Plan Phase 2 enhancements based on data
   - [ ] Archive OpenSpec change (`openspec archive add-rag-chatbot`)

**Deliverables:**
- Chatbot live on all pages
- Monitoring and analytics running
- Initial feedback collected
- Phase 2 plan drafted
- Roadmap and PROJECT-MEMORY.json updated

---

## Agent Assignments

### Recommended Agent Strategy

**Option A: Single General-Purpose Agent (Recommended for MVP)**
- **Agent Type:** `general-purpose` development agent
- **Rationale:** Can handle full stack (backend + frontend + integration)
- **Duration:** 3-4 weeks full-time focus
- **Pros:** Single point of coordination, faster decision-making
- **Cons:** Longer timeline (sequential work)

**Option B: Parallel Specialists (Faster but more coordination)**
- **Backend Agent:** Handles Cloudflare Workers + RAG + OpenAI integration
- **Frontend Agent:** Handles JavaScript widget + CSS + accessibility
- **Alice (Web-Content-Builder):** Handles Ghost integration + content
- **Duration:** 2-3 weeks with parallel work
- **Pros:** Faster delivery, specialist expertise
- **Cons:** More coordination overhead, potential integration issues

**Option C: Phased Approach (Recommended for Risk Mitigation)**
- **Week 1-2:** Backend agent builds and tests API
- **Week 2-3:** Frontend agent builds widget (can start after backend API spec ready)
- **Week 3:** Alice integrates into Ghost
- **Week 4:** Morgan coordinates launch and monitoring
- **Pros:** Clear handoffs, lower risk, easier debugging
- **Cons:** Slightly longer timeline

### Morgan's Recommendation: **Option C (Phased Approach)**
**Rationale:**
- Lower risk (each phase validates before next starts)
- Clear handoffs and deliverables
- Easier to debug (isolate issues by phase)
- Aligns with project's methodical approach
- Only adds 1 week vs parallel approach
- Much more maintainable

---

## NATS Coordination Strategy

### Task Publishing
Morgan will publish tasks to NATS for agent claiming:

**Backend Phase Tasks:**
```json
{
  "task_id": "chatbot-backend-1",
  "title": "Build Cloudflare Workers backend with RAG retrieval",
  "description": "Implement knowledge base integration, RAG retrieval, OpenAI API integration, rate limiting, and POST /chat endpoint",
  "agent_type": "general-purpose",
  "priority": "high",
  "estimated_duration": "5-7 days",
  "dependencies": [],
  "deliverables": [
    "Working API endpoint",
    "RAG retrieval tested",
    "Response quality validated",
    "Rate limiting functional"
  ]
}
```

**Frontend Phase Tasks:**
```json
{
  "task_id": "chatbot-frontend-1",
  "title": "Build JavaScript chat widget with responsive design",
  "description": "Create widget UI, handle conversation state, implement API integration, ensure accessibility and mobile responsiveness",
  "agent_type": "general-purpose",
  "priority": "high",
  "estimated_duration": "5-7 days",
  "dependencies": ["chatbot-backend-1"],
  "deliverables": [
    "Functional frontend widget",
    "Mobile responsive",
    "Accessible interface",
    "API integration working"
  ]
}
```

**Integration Phase Tasks:**
```json
{
  "task_id": "chatbot-integration-1",
  "title": "Integrate chatbot into Ghost and test thoroughly",
  "description": "Deploy assets to CDN, add code injection to Ghost, configure settings, run all tests, set up analytics",
  "agent_type": "web-content-builder",
  "priority": "high",
  "estimated_duration": "5-7 days",
  "dependencies": ["chatbot-frontend-1"],
  "deliverables": [
    "Chatbot integrated into Ghost",
    "All tests passing",
    "Analytics functional",
    "Documentation complete"
  ]
}
```

### Heartbeat Monitoring
All agents MUST send heartbeat every 30 seconds:
```python
await worker.heartbeat(
    status="busy",
    current_task="chatbot-backend-1"
)
```

### Progress Updates
Agents should publish to `mjwork.coordination` at key milestones:
- Backend: "RAG retrieval working, tested with 20 queries - 85% relevance"
- Frontend: "Widget UI complete, testing API integration"
- Integration: "Ghost integration complete, running functional tests"

---

## Success Metrics

### Phase 1 Launch Metrics (First 3 Months)
- **Engagement:** 10-20% of visitors interact with chatbot
- **Conversation length:** Average 3-5 messages per conversation
- **Response quality:** < 10% "I don't know" responses
- **Conversion:** 5-10% of conversations end with contact/schedule click
- **Performance:** < 2s response time (P95)
- **Uptime:** 99.5%+ availability
- **Cost:** Stay within $10-30/month budget

### Quality Indicators
- Response accuracy validated against RAG knowledge base
- Visitor feedback (thumbs up/down on responses)
- Unhandled question topics inform knowledge base expansion
- No privacy complaints or GDPR issues
- No security incidents or rate limit abuse

### Strategic Indicators
- Demonstrates AI expertise to portfolio visitors
- Provides clear portfolio piece for case studies
- Generates leads for consulting services
- Reduces Mike's time answering common questions
- Provides data for future AI feature development

---

## Risk Management

### Risk 1: OpenAI API Costs Spike
**Impact:** High (budget constraint)
**Likelihood:** Medium (viral traffic or bot abuse)

**Mitigation:**
- Strict rate limiting (10 msg/visitor/hour, 100/IP/day)
- Set Cloudflare Workers budget alerts ($50/month)
- Monitor daily costs, disable if exceeds $100/month
- Fallback: Switch to GPT-3.5 (cheaper) or temporarily disable

### Risk 2: Poor Response Quality
**Impact:** High (portfolio demonstration failure)
**Likelihood:** Medium (LLM hallucination risk)

**Mitigation:**
- Strict RAG retrieval (only use verified knowledge base entries)
- System prompt emphasizes "Only answer from provided context"
- Test with 50+ sample questions before launch
- Add thumbs up/down feedback
- Human review of logged conversations weekly

### Risk 3: Integration Conflicts with Ghost Theme
**Impact:** Medium (visual bugs, functionality issues)
**Likelihood:** Low (code injection method tested)

**Mitigation:**
- Use code injection (not theme modification)
- Test thoroughly on staging environment
- Verify no CSS conflicts with Kyoto theme
- Test across browsers and devices
- Easy rollback: remove code injection

### Risk 4: Knowledge Base Becomes Outdated
**Impact:** Medium (incorrect information)
**Likelihood:** Medium (as Mike's work evolves)

**Mitigation:**
- Document knowledge base update workflow
- Review unhandled questions monthly for content gaps
- Set calendar reminder to review quarterly
- Version control knowledge.jsonl in Git

### Risk 5: Privacy Compliance Issues
**Impact:** High (legal risk)
**Likelihood:** Low (transparent disclosure)

**Mitigation:**
- Clear privacy disclosure in widget footer
- Anonymous logging only (no PII collection)
- 30-day data retention policy
- Right to deletion (contact Mike to request)
- Update privacy policy page

---

## Cost Analysis

### Phase 1 MVP Costs
**Setup Costs (One-Time):**
- Development time: 3-4 weeks (agent time)
- CDN setup: $0 (Cloudflare R2 free tier or GitHub Pages)
- Testing: Included in development time

**Monthly Operating Costs:**
- Cloudflare Workers: $0 (free tier, 100k requests/day)
- OpenAI API (GPT-3.5): ~$0.002 per conversation
- OpenAI API (GPT-4 Turbo): ~$0.01 per conversation
- Estimated traffic: 500-2500 conversations/month
- **Total: $10-50/month** (depending on model and traffic)

### Phase 2 Enhanced Costs
- Same as Phase 1 (no additional infrastructure)
- May add $5-10/month for Cloudflare KV storage if adding conversation persistence

### Phase 3 Self-Hosted Costs (Optional)
- VPS (2GB RAM): $12-18/month
- No API costs after setup
- Setup time: 20-30 hours
- **Total: $12-18/month** (lower if sharing VPS with other projects)

### Cost Optimization Strategies
1. Start with GPT-3.5 (5x cheaper than GPT-4 Turbo)
2. Aggressive caching of common questions
3. Rate limiting prevents abuse
4. Monitor daily costs and adjust
5. Migrate to self-hosted if traffic scales significantly

---

## Quality Assurance

### Pre-Launch Testing Checklist
- [ ] **Functional Tests**
  - [ ] All suggested questions work correctly
  - [ ] Response accuracy verified against RAG
  - [ ] Conversation flow and follow-ups work
  - [ ] Fit assessment logic validated
  - [ ] "I don't know" fallbacks work
  - [ ] Rate limiting prevents abuse

- [ ] **Integration Tests**
  - [ ] Widget loads on all pages
  - [ ] No conflicts with Ghost theme
  - [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
  - [ ] Mobile responsiveness (iOS/Android)
  - [ ] Performance (< 2s response time)

- [ ] **Security Tests**
  - [ ] Rate limiting effective
  - [ ] CORS configured correctly
  - [ ] No sensitive data leakage
  - [ ] Input sanitization working
  - [ ] Privacy compliance verified

- [ ] **Accessibility Tests**
  - [ ] Keyboard navigation works
  - [ ] Screen reader compatible
  - [ ] ARIA labels present
  - [ ] Color contrast compliant (WCAG AA)
  - [ ] Focus management works

### Post-Launch Monitoring
**Daily (First Week):**
- Conversation volume and topics
- Error rates and types
- Response times (P50, P95, P99)
- OpenAI API costs
- Unhandled questions

**Weekly (First Month):**
- Engagement rate (% visitors who interact)
- Conversion rate (contact/schedule clicks)
- Response quality review (sample 20-30 conversations)
- Identify knowledge base gaps
- Performance trends

**Monthly (Ongoing):**
- Aggregate analytics review
- Knowledge base expansion planning
- Cost optimization review
- Feature enhancement planning
- Phase 2 prioritization

---

## Documentation Requirements

### User-Facing Documentation
- [ ] **Privacy Policy Update**
  - Chatbot data collection practices
  - Anonymous logging disclosure
  - 30-day retention policy
  - Right to deletion process

- [ ] **FAQ Section** (optional)
  - What can the chatbot answer?
  - How does it work?
  - Is my conversation private?
  - What if it doesn't know the answer?

### Technical Documentation
- [ ] **API Documentation**
  - POST /chat endpoint specification
  - Request/response formats
  - Error codes and handling
  - Rate limiting rules

- [ ] **Knowledge Base Update Workflow**
  - How to add new entries
  - How to edit existing entries
  - How to test changes
  - How to deploy updates

- [ ] **Deployment Documentation**
  - How to deploy backend updates
  - How to deploy frontend updates
  - How to update Ghost code injection
  - How to rollback if needed

- [ ] **Troubleshooting Guide**
  - Common issues and solutions
  - How to check logs
  - How to monitor performance
  - Who to contact for help

---

## Phase 2 & 3 Planning

### Phase 2: Enhanced Features (1-2 weeks)
**Trigger:** 1 month after Phase 1 launch + data analysis complete

**Potential Enhancements (prioritize based on data):**
1. **Cal.com Integration**
   - "Schedule a call" button appears contextually
   - Direct booking from chat interface
   - Reduces friction for qualified leads

2. **Improved Suggested Questions**
   - Based on actual visitor question patterns
   - A/B test different question sets
   - Rotate questions based on page context

3. **"Learn More" Links**
   - Chatbot suggests relevant pages
   - "Read more about this on the Projects page"
   - Drives visitors deeper into site

4. **Knowledge Base Expansion**
   - Analyze unhandled questions (first month data)
   - Add 20-30 new entries to fill gaps
   - Improve fit_assessment entries based on actual queries

5. **Enhanced Analytics**
   - Session replay integration (PostHog)
   - Advanced topic clustering
   - Conversion funnel analysis

### Phase 3: Self-Hosted Option (2-3 weeks, optional)
**Trigger:** IF any of these conditions:
- OpenAI API costs exceed $50/month consistently
- Privacy concerns from visitors
- Want to demonstrate self-hosted AI expertise
- Traffic scales significantly (5000+ conversations/month)

**Migration Path:**
1. Provision VPS and install Ollama (local LLM)
2. Set up vector database (ChromaDB or Qdrant)
3. Build Python FastAPI backend
4. Implement embedding-based RAG retrieval
5. Test response quality vs OpenAI baseline
6. Gradual traffic migration (10% → 50% → 100%)

**Benefits:**
- Zero API costs (after setup)
- Full data sovereignty
- Privacy-first architecture
- Demonstrates advanced AI implementation

**Trade-offs:**
- Higher initial setup time (20-30 hours)
- Server management required
- Need to monitor uptime and performance
- Response quality may vary from OpenAI

---

## Decision Points

### Decisions Needed Before Starting

1. **Architecture Approval**
   - [x] **Approved:** Serverless (Cloudflare Workers + OpenAI API) for MVP
   - Why: Fast to implement, low cost, no server management, can migrate later

2. **AI Provider Choice**
   - [ ] **Pending:** OpenAI GPT-3.5 or GPT-4 Turbo?
   - **Recommendation:** Start with GPT-3.5 (5x cheaper), upgrade if quality issues
   - GPT-3.5: $0.002/conversation, GPT-4: $0.01/conversation
   - Decision impacts: Cost ($10-15/month vs $40-50/month for 2000 conversations)

3. **Conversation Persistence**
   - [ ] **Pending:** Reset on page refresh or save in localStorage?
   - **Recommendation:** Reset for MVP (simpler), add persistence in Phase 2 if requested
   - Trade-off: Simpler implementation vs better UX

4. **Analytics Detail Level**
   - [ ] **Pending:** Track individual messages or conversation summaries only?
   - **Recommendation:** Track both (full messages for quality, summaries for analytics)
   - Privacy impact: Minimal (anonymous logging with 30-day retention)

5. **✅ DECIDED: Suggested Questions (2026-02-13)**
   - **Top 5 Initial Questions:**
     1. "Tell me about Mike's AI implementation experience"
     2. "What has Mike worked on?"
     3. "Tell me about the AI Memory System"
     4. "What are the 7 Pillars of Resilient Tomorrow?"
     5. "How does Mike help companies with process optimization?"

   - **Rationale:**
     - Q1: Targets primary positioning ("AI Implementation Expert and LLM Integration Specialist")
     - Q2: Broad career overview (most common visitor question)
     - Q3: Concrete technical project demonstration (OfflineAI showcase)
     - Q4: Thought leadership and values (Resilient Tomorrow publication)
     - Q5: Lead qualification for consulting services (Velocity Partners)
   - Can adjust based on analytics after launch

### Decisions for Later (Phase 2+)

6. **Cal.com Integration**
   - When: Phase 2 (after analyzing conversation-to-contact conversion rate)
   - Depends on: Actual visitor behavior data

7. **Self-Hosted Migration**
   - When: IF costs exceed $50/month OR traffic scales significantly
   - Depends on: Actual usage and cost data

---

## Next Steps

### Immediate Actions (This Week)
1. **Mike:** Review and approve this execution plan
2. **Mike:** Make decisions on pending items (AI provider, persistence, analytics, questions)
3. **Morgan:** Update roadmap with detailed chatbot tasks
4. **Morgan:** Publish backend task to NATS (Phase 7.6.1)
5. **Morgan:** Identify agent for backend implementation

### Week 1 Start
6. **Backend Agent:** Claim task from NATS and begin implementation
7. **Morgan:** Monitor progress, provide coordination support
8. **Morgan:** Prepare frontend task specification for Week 2

### Communication Plan
- **Daily standups:** Backend agent reports progress via NATS coordination channel
- **End of week:** Demo working components to Mike
- **Blockers:** Report immediately on coordination channel
- **Milestones:** Celebrate completion of each phase

---

## Approval Sign-Off

**Created by:** Morgan (Project Manager Agent)
**Date:** 2026-02-13
**Status:** ⏳ Awaiting Mike's Approval

**Decisions Made:**
- [x] **Overall execution plan:** APPROVED (2026-02-13)
- [x] **LLM Provider:** OpenAI GPT-3.5-turbo (cheapest option, $1-10/month)
- [x] **Infrastructure:** Cloudflare Workers free tier (100k requests/day)
- [x] **Conversation persistence:** Reset on page refresh (stateless approach)
- [x] **Analytics detail level:** Full conversation logging (anonymous, 30-day retention)
- [x] **Suggested questions:** Top 5 finalized (see below)

**Pending:**
- [ ] Final approval of suggested questions
- [ ] Approve: Start backend implementation Week 1?

**Sign-Off:**
- [ ] **Mike Jones:** Plan approved, ready to proceed
- [ ] **Morgan (PM):** Ready to coordinate execution
- [ ] **Backend Agent:** (TBD - to be assigned)
- [ ] **Frontend Agent:** (TBD - to be assigned)
- [ ] **Alice:** Ready for Week 3 Ghost integration

---

## Appendix

### Related Documentation
- **Feature Specification:** `/plans/chatbot-feature-specification.md`
- **OpenSpec Proposal:** `/openspec/changes/add-rag-chatbot/proposal.md`
- **Design Document:** `/openspec/changes/add-rag-chatbot/design.md`
- **Task Breakdown:** `/openspec/changes/add-rag-chatbot/tasks.md`
- **Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl` (190 entries)
- **RAG Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`
- **Roadmap:** `/plans/roadmap.md` (Phase 7.6)
- **PROJECT-MEMORY:** `/PROJECT-MEMORY.json`

### Agent Profiles
- **Morgan (PM):** Methodical, organized, coordination specialist
- **Alice (Web-Content-Builder):** Creative, detail-focused, Ghost expert
- **Backend Agent:** (TBD - full-stack developer, Cloudflare Workers experience)
- **Frontend Agent:** (TBD - JavaScript/CSS expert, accessibility specialist)

### OpenSpec Validation
```bash
# Verify OpenSpec change is valid
cd /Users/michaeljones/Dev/MJ_Online
openspec validate add-rag-chatbot --strict --no-interactive
# Status: ✅ Valid (as of 2026-01-29)
```

---

**End of Execution Plan**
**Version:** 1.0
**Last Updated:** 2026-02-13
