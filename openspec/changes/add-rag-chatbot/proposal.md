# Change: Add RAG-Powered AI Chatbot

## Why

Visitors to mikejones.online need an interactive way to explore Mike's background, projects, and services beyond static page content. A chatbot powered by the existing 70-entry RAG knowledge base (created during content extraction) provides:

1. **24/7 engagement** - Answers visitor questions when Mike isn't available
2. **Lead qualification** - Assesses visitor fit using structured fit_assessment entries
3. **Portfolio demonstration** - Shows practical AI implementation skills to employers
4. **Content leverage** - Utilizes existing, verified knowledge base without additional content creation

This aligns with the site's goal to demonstrate AI/ML expertise while providing immediate value to visitors.

## What Changes

- Add persistent chat widget on all website pages
- Implement serverless RAG retrieval backend (Cloudflare Workers + OpenAI API)
- Integrate 70-entry JSONL knowledge base (`/Cowork/content/rag/knowledge.jsonl`)
- Embed chatbot via Ghost code injection (no theme modification required)
- Add analytics tracking for conversation topics and visitor engagement
- Provide suggested questions and conversation flow guidance
- Include "Contact Mike" and "Schedule Call" CTAs based on conversation context

**Implementation Approach:**
- **Phase 1 (MVP):** Serverless chatbot with OpenAI API (2-3 weeks)
- **Phase 2 (Enhanced):** Improved UX, Cal.com integration (1-2 weeks)
- **Phase 3 (Optional):** Self-hosted RAG with local LLM (2-3 weeks)

**Cost Impact:**
- Cloudflare Workers: Free tier (100k requests/day)
- OpenAI API (GPT-4o): ~$10-30/month for estimated traffic (significantly cheaper than Claude API)
- Storage: $0 (stateless, reset on refresh)
- Total: $10-30/month ongoing (can migrate to self-hosted LLM if costs scale)

## Impact

### Affected Specs
- **NEW capability:** `chatbot` - Creating new spec (no existing capabilities modified)

### Affected Code
- Ghost theme: Code injection in site footer (non-destructive)
- New repository: Chatbot backend (separate from main site)
- New assets: JavaScript widget, CSS styles

### Affected Content
- Knowledge base: `/Cowork/content/rag/knowledge.jsonl` (read-only, no modifications)
- May expand knowledge base based on analytics of unhandled questions

### Dependencies
- OpenAI API (external service)
- Cloudflare Workers (serverless platform)
- Ghost Code Injection feature (already available)

### User Experience Impact
- Minimal: Widget appears in bottom-right corner, minimized by default
- Accessibility: Widget is keyboard navigable, screen-reader compatible
- Performance: Async loading, no blocking of page render
- Mobile: Full-screen overlay on small screens

### Migration Path
- No migration needed (net-new feature)
- Can be disabled via code injection without theme rollback
- Future self-hosted option maintains same frontend interface

## Timeline

**Post-Launch Enhancement:** This feature is scheduled AFTER core website content is complete and live.

**Estimated Schedule:**
- Week 1-2: Backend implementation (RAG retrieval, OpenAI integration)
- Week 3: Frontend widget development and testing
- Week 4: Integration, testing, and launch

**Blocking Dependencies:**
- Core website content must be published first
- Knowledge base finalized (currently complete)
- Ghost Pro site accessible (currently live)

## Success Metrics

**Launch Metrics (First 3 Months):**
- 10-20% of visitors interact with chatbot
- Average 3-5 messages per conversation
- < 10% "I don't know" responses
- 5-10% of conversations end with contact/schedule click

**Quality Metrics:**
- Response accuracy validated against knowledge base
- Visitor feedback (thumbs up/down on responses)
- Unhandled question topics inform knowledge base expansion

## Decisions Made

1. **Privacy & Logging:**
   - **Initial implementation:** Log full conversations (questions + answers) for analytics
   - **Future enhancement:** Add visitor identification (timestamps, Google ID, advertiser ID, cross-site interactions, session data) for deeper analytics
   - **Short-term focus:** Basic conversation logging to understand usage patterns

2. **AI Provider:**
   - **Launch:** OpenAI GPT-4o (most cost-effective at $3/$15 per 1M tokens vs Claude API at $15/$75 per 1M tokens)
   - **Note:** Claude Max subscription ($20/month) does NOT include API credits - Claude API would be separate billing
   - **Future migration:** If usage scales significantly, migrate to self-hosted LLM (Ollama/OpenWebUI on cloud or local infrastructure)
   - **Decision flexibility:** Can switch between OpenAI/Claude without frontend changes

3. **Conversation Persistence:**
   - **Reset on page refresh** (stateless approach)
   - **Technical rationale:** No storage costs, simpler implementation, better privacy, no session management complexity
   - **Tradeoff accepted:** Users lose context on refresh, but can ask follow-up questions naturally
   - **Future option:** Can add session persistence if user feedback demands it (~$5-10/month additional cost for Cloudflare KV storage)

4. **Rate Limiting:**
   - **Initial limit:** 15 messages per hour per visitor
   - **Monitoring:** Track actual usage patterns and adjust based on analytics
   - **Anti-abuse:** IP-based blocking for excessive requests beyond hourly limit

## References

- **Feature Specification:** `/plans/chatbot-feature-specification.md` (detailed 400+ line spec)
- **Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl` (70 entries)
- **Schema Documentation:** `/Cowork/content/rag/RAG_SCHEMA.md`
- **Project Status:** `/Cowork/PROJECT_STATUS.md`
- **Requirements:** `/plans/requirements-specification.md` (Section 3.4: User Interaction)
