# Design: RAG-Powered AI Chatbot

## Context

The chatbot provides interactive visitor engagement using Mike's existing 70-entry knowledge base created during content extraction. This design focuses on the MVP implementation (Phase 1) using serverless architecture.

**Background:**
- Ghost Pro platform (no custom backend available)
- Existing JSONL knowledge base with 5 entry types (fact, narrative, qa_pair, fit_assessment, technical)
- Need for low-maintenance, cost-effective solution
- Alignment with portfolio goals (demonstrate AI expertise)

**Constraints:**
- Budget: $10-30/month for API costs
- No theme modification (use code injection only)
- Privacy considerations (log responsibly)
- Performance: < 2s response time target

**Stakeholders:**
- Primary: Site visitors seeking information
- Secondary: Mike (content owner, analytics consumer)
- Tertiary: Potential employers/clients (portfolio evaluators)

## Goals / Non-Goals

### Goals
- ✅ Answer 90%+ of questions about Mike's career, projects, and services
- ✅ Qualify leads using fit_assessment entries
- ✅ Demonstrate practical AI implementation skills
- ✅ Low maintenance (< 1 hour/month after launch)
- ✅ Privacy-compliant conversation logging
- ✅ Accessible to keyboard and screen reader users

### Non-Goals
- ❌ General-purpose chatbot (only Mike-specific questions)
- ❌ Transactional capabilities (scheduling, payments)
- ❌ Multi-language support (English only for MVP)
- ❌ Voice interface
- ❌ Chat history across sessions (MVP resets on page refresh)

## Decisions

### Decision 1: Serverless Architecture (Cloudflare Workers + OpenAI)

**Choice:** Use Cloudflare Workers for backend with OpenAI GPT-3.5/4 Turbo

**Rationale:**
- **Fast to market:** 2-3 weeks vs 4-6 weeks for self-hosted
- **Low cost:** $10-30/month vs $40-60/month for VPS + maintenance
- **No server management:** Aligns with Ghost Pro managed approach
- **Proven quality:** OpenAI models provide excellent response quality
- **Scalability:** Auto-scales with Cloudflare Workers free tier

**Alternatives Considered:**
1. **Self-hosted with local LLM (Ollama)**
   - **Pros:** Privacy, no API costs, aligns with Resilient Tomorrow values
   - **Cons:** 4-6 weeks to implement, VPS costs, maintenance burden, quality uncertain
   - **Decision:** Save for Phase 3 (optional upgrade path)

2. **Claude API (Anthropic)**
   - **Pros:** Excellent quality, strong context handling
   - **Cons:** Higher cost (~2-3x OpenAI), smaller context window for GPT-3.5 equivalent
   - **Decision:** Rejected for MVP, consider for Phase 2

3. **Vercel Edge Functions**
   - **Pros:** Similar to Cloudflare, good developer experience
   - **Cons:** Cloudflare has better free tier, more generous limits
   - **Decision:** Cloudflare preferred

### Decision 2: Keyword-Based RAG (Not Vector Embeddings)

**Choice:** Use keyword matching and topic filtering for retrieval

**Rationale:**
- **Simplicity:** 70 entries small enough for brute-force filtering
- **Explainable:** Can trace why entries were selected
- **No dependencies:** Avoids vector database complexity
- **Fast:** < 50ms retrieval time on small dataset
- **Good enough:** Initial testing shows 85%+ relevance

**Implementation:**
```javascript
function retrieveEntries(question, knowledgeBase) {
  // 1. Extract keywords from question
  const keywords = extractKeywords(question);

  // 2. Filter by topic (career, projects, services, etc.)
  const topicMatches = knowledgeBase.filter(entry =>
    keywords.some(kw => entry.topic.includes(kw) ||
                        entry.tags.includes(kw))
  );

  // 3. Rank by entry type priority (qa_pair > fact > narrative)
  const ranked = rankByType(topicMatches);

  // 4. Return top 3-5 entries
  return ranked.slice(0, 5);
}
```

**Alternatives Considered:**
1. **Vector embeddings (Pinecone/ChromaDB)**
   - **Pros:** Semantic search, better relevance
   - **Cons:** Added complexity, costs, 70 entries too small to benefit
   - **Decision:** Over-engineering for dataset size, save for future if knowledge base grows to 200+ entries

### Decision 3: Ghost Code Injection (Not Theme Fork)

**Choice:** Embed widget via Ghost Admin → Code Injection

**Rationale:**
- **No theme lock-in:** Can change themes without losing chatbot
- **Easy updates:** Change widget without redeploying theme
- **Maintainable:** Ghost Pro manages theme updates separately
- **Reversible:** Can disable by removing code injection

**Implementation:**
```html
<!-- Ghost Admin → Settings → Code Injection → Site Footer -->
<div id="mj-chatbot-widget"></div>
<script src="https://cdn.mikejones.online/chatbot/widget.js"></script>
<script>
  MJChatbot.init({
    apiEndpoint: 'https://chat-api.mikejones.online/chat',
    theme: 'auto', // Matches site light/dark mode
    greeting: "Hi! I'm Mike's AI assistant. I can answer questions about his work, experience, and projects.",
    suggestedQuestions: [
      "What has Mike worked on?",
      "Tell me about the AI Memory System",
      "How does Mike help with process optimization?",
      "What are the 7 Pillars?"
    ]
  });
</script>
```

**Alternatives Considered:**
1. **Theme modification (footer.hbs)**
   - **Pros:** Slightly cleaner integration
   - **Cons:** Theme lock-in, harder to update, lost on theme change
   - **Decision:** Code injection more flexible

### Decision 4: Conversation Logging for Analytics

**Choice:** Log conversations anonymously with 30-day retention

**What We Log:**
- Visitor question (anonymized)
- Retrieved knowledge entries
- AI response
- Conversation topic
- Timestamp
- CTA clicks (contact/schedule)

**What We Don't Log:**
- IP addresses (use hashed session ID)
- Personal data volunteered by visitor
- Browser fingerprints

**Rationale:**
- **Improvement:** Identify unhandled questions for knowledge base expansion
- **Quality:** Track response accuracy and helpfulness
- **Privacy:** Anonymous, short retention, transparent disclosure

**Privacy Disclosure:**
"This chatbot uses AI to answer questions about Mike's work. Conversations are logged anonymously to improve responses. [Privacy Policy]"

**Alternatives Considered:**
1. **No logging**
   - **Pros:** Maximum privacy
   - **Cons:** Can't improve chatbot, no analytics
   - **Decision:** Rejected, need data for improvement

2. **Full logging with PII**
   - **Pros:** Better analytics
   - **Cons:** Privacy risk, GDPR complexity
   - **Decision:** Rejected, unnecessary for goals

### Decision 5: Rate Limiting Strategy

**Choice:** 10 messages per visitor per hour, 100 messages per IP per day

**Rationale:**
- **Abuse prevention:** Stops bot spam and API cost attacks
- **User experience:** Legitimate users rarely hit these limits
- **Cost control:** Caps OpenAI API costs at ~$100/day worst case

**Implementation:**
- Use Cloudflare Workers KV for rate limit tracking
- Session-based limits (cookie/localStorage)
- IP-based fallback for cookie-less visitors
- Graceful error message when limit hit

**Alternatives Considered:**
1. **No rate limiting**
   - **Pros:** Simpler implementation
   - **Cons:** Open to abuse, uncapped costs
   - **Decision:** Rejected, financial risk too high

2. **Stricter limits (5 messages/hour)**
   - **Pros:** Lower costs
   - **Cons:** May frustrate legitimate users exploring Mike's projects
   - **Decision:** Start with 10, adjust based on data

## Risks / Trade-offs

### Risk 1: OpenAI API Costs Spike
**Impact:** High (budget constraint)
**Likelihood:** Medium (if viral traffic or bot abuse)

**Mitigation:**
- Strict rate limiting (10 msg/visitor/hour, 100/IP/day)
- Set Cloudflare Workers budget alerts ($50/month)
- Monitor daily costs, disable if exceeds $100/month
- Fallback: Temporarily disable chatbot or switch to GPT-3.5 (cheaper)

### Risk 2: Poor Response Quality
**Impact:** High (portfolio demonstration failure)
**Likelihood:** Medium (LLM hallucination risk)

**Mitigation:**
- Strict RAG retrieval (only use verified knowledge base entries)
- System prompt emphasizes "Only answer from provided context"
- Test with 50+ sample questions before launch
- Add thumbs up/down feedback to identify quality issues
- Human review of logged conversations weekly

**Fallback:**
"I don't have that information in my knowledge base. I'm focused on Mike's professional experience and projects. You can contact Mike directly at [contact link]."

### Risk 3: Knowledge Base Becomes Outdated
**Impact:** Medium (incorrect information)
**Likelihood:** Medium (as Mike's work evolves)

**Mitigation:**
- Document knowledge base update workflow
- Review unhandled questions monthly for content gaps
- Set calendar reminder to review knowledge base quarterly
- Version control knowledge.jsonl in Git

### Risk 4: Accessibility Issues
**Impact:** Medium (excludes users with disabilities)
**Likelihood:** Low (testing planned)

**Mitigation:**
- WCAG 2.1 AA compliance testing
- Screen reader testing (NVDA, VoiceOver)
- Keyboard navigation support
- Color contrast validation
- ARIA labels and roles

### Risk 5: Privacy Compliance (GDPR)
**Impact:** High (legal risk)
**Likelihood:** Low (transparent disclosure)

**Mitigation:**
- Clear privacy disclosure in widget footer
- Anonymous logging only (no PII collection)
- 30-day data retention policy
- Right to deletion (contact Mike to request)
- Update privacy policy page

## Technical Stack

### Frontend
- **Widget:** Vanilla JavaScript (no framework, minimize bundle size)
- **Styling:** CSS with CSS variables for theming
- **Build:** Rollup or esbuild for bundling
- **CDN:** Cloudflare R2 or GitHub Pages for static assets
- **Size target:** < 50KB gzipped

### Backend
- **Runtime:** Cloudflare Workers (V8 isolates)
- **Language:** JavaScript/TypeScript
- **Storage:** Cloudflare Workers KV (rate limiting, analytics)
- **AI Provider:** OpenAI GPT-4 Turbo (cost-effective) or GPT-3.5 (cheaper)
- **Deployment:** Wrangler CLI

### Data Flow
```
Visitor Question
    ↓
Frontend Widget (JS)
    ↓ POST /chat
Cloudflare Workers Endpoint
    ↓
RAG Retrieval (keyword-based)
    ├─ Load knowledge.jsonl (cached)
    ├─ Filter by keywords/topics
    └─ Rank and select top 3-5 entries
    ↓
OpenAI API
    ├─ System prompt (behavior guidelines)
    ├─ Context injection (RAG entries)
    └─ Generate response
    ↓
Response
    ├─ Log conversation (anonymous, KV storage)
    ├─ Return to frontend
    └─ Display to visitor
```

### Performance Targets
- **Widget load:** < 500ms (async, non-blocking)
- **Chat response:** < 2s (P95)
- **Rate limit check:** < 10ms
- **RAG retrieval:** < 50ms (70 entries, keyword matching)
- **OpenAI API:** 1-2s (external dependency)

## Migration Plan

### Phase 1: MVP Launch (Weeks 1-4)
1. Build and deploy serverless backend
2. Develop and test frontend widget
3. Integrate via Ghost code injection
4. Soft launch: Test with small traffic
5. Monitor for 1 week, fix issues
6. Full launch: Add to all pages

### Phase 2: Enhanced Features (Weeks 5-6)
1. Add Cal.com integration for scheduling
2. Improve suggested questions based on analytics
3. Add "Learn more" page links
4. A/B test greeting messages
5. Expand knowledge base (20-30 new entries)

### Phase 3: Self-Hosted Option (Optional, Weeks 7-10)
1. Provision VPS and install Ollama
2. Build vector database with embeddings
3. Implement Python FastAPI backend
4. Test quality vs OpenAI baseline
5. Gradual migration (10% → 50% → 100%)

### Rollback Plan
If critical issues arise:
1. Remove code injection from Ghost (instant disable)
2. Redeploy previous widget version
3. Investigate and fix issue
4. Re-enable after testing

## Open Questions

### Decided (From Proposal Review)
- [ ] **Architecture:** Serverless (Cloudflare + OpenAI) ✅
- [ ] **Privacy:** Anonymous logging with 30-day retention ✅
- [ ] **Rate limits:** 10 msg/visitor/hour, 100/IP/day ✅

### Still Open
- [ ] **AI model:** GPT-4 Turbo ($0.01/conv) or GPT-3.5 ($0.002/conv)?
  - **Recommendation:** Start with GPT-3.5, upgrade to GPT-4 if quality issues

- [ ] **Conversation persistence:** Reset on page refresh or save in localStorage?
  - **Recommendation:** Reset for MVP (simpler), add persistence in Phase 2 if requested

- [ ] **Analytics detail level:** Track individual messages or conversation summaries only?
  - **Recommendation:** Track both (full messages for quality review, summaries for analytics)

- [ ] **Suggested questions:** Which 4-5 to display initially?
  - **Recommendation:** Test these 4:
    1. "What has Mike worked on?"
    2. "Tell me about the AI Memory System"
    3. "How does Mike help with process optimization?"
    4. "What are the 7 Pillars?"

## References

- **Feature Specification:** `/plans/chatbot-feature-specification.md`
- **Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl`
- **RAG Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`
- **OpenAI API Docs:** https://platform.openai.com/docs/api-reference/chat
- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

## Approval

- [ ] Reviewed by: Mike Jones
- [ ] Architecture approved
- [ ] Open questions resolved
- [ ] Ready for implementation

**Last Updated:** 2026-01-29
