# AI Chatbot Feature Specification - MJ_Online

**Feature Name:** Personal AI Assistant Chatbot
**Project:** MJ_Online (mikejones.online)
**Priority:** High (Post-Launch Enhancement)
**Created:** 2026-01-29
**Status:** Planning Phase

---

## 1. Executive Summary

Add an AI-powered chatbot to mikejones.online that allows visitors to ask questions about Mike Jones, his experience, projects, and services. The chatbot will be powered by the 70-entry RAG knowledge base created during the content extraction phase, providing accurate, contextual responses based on verified information.

### Key Benefits
- **24/7 Visitor Engagement:** Answers questions when Mike isn't available
- **Lead Qualification:** Assesses visitor fit using fit_assessment entries
- **Project Discovery:** Helps visitors explore Mike's work interactively
- **Content Leverage:** Utilizes existing 70-entry knowledge base
- **Portfolio Demonstration:** Shows practical AI implementation skills

---

## 2. Feature Requirements

### 2.1 Core Functionality

#### Chat Interface
- **Persistent widget** available on all pages
- **Minimized state:** Small icon in bottom-right corner
- **Expanded state:** Chat window (400px wide × 600px tall)
- **Mobile responsive:** Full-screen overlay on mobile devices
- **Position:** Fixed, doesn't scroll with page content

#### Conversation Capabilities
- Answer factual questions about Mike's career, skills, and experience
- Explain projects (OfflineAI, NeighborhoodShare, Resilient Tomorrow)
- Assess visitor fit for consulting services
- Provide technical details about implementations
- Direct visitors to relevant pages and contact options

#### Knowledge Base Integration
- Retrieves from 70-entry JSONL knowledge base
- Filters by topic, type, and confidence level
- Handles multiple entry types:
  - `fact` → Direct statements
  - `narrative` → Contextual explanations
  - `qa_pair` → Pre-formatted Q&A
  - `fit_assessment` → Client fit evaluation
  - `technical` → Technical details

---

## 3. User Experience Requirements

### 3.1 Visitor Interaction Flow

**First Visit:**
1. Visitor sees chat icon with subtle animation/badge
2. Optional: Auto-open with greeting after 5-10 seconds
3. Welcome message: "Hi! I'm Mike's AI assistant. I can answer questions about his work, experience, and projects. What would you like to know?"
4. Suggested questions displayed as clickable prompts

**Conversation:**
1. Visitor types question or clicks suggestion
2. Chatbot retrieves relevant knowledge entries
3. Response appears with typing indicator (1-2 second delay for realism)
4. Follow-up suggestions based on topic
5. Conversation history maintained during session

**Exit Options:**
- "Learn more" links to relevant pages
- "Contact Mike" button for direct outreach
- "Schedule a call" link to Cal.com booking

### 3.2 Suggested Questions (Initial Prompts)

- "What has Mike worked on?"
- "Tell me about the AI Memory System"
- "How does Mike help companies with process optimization?"
- "What are the 7 Pillars?"
- "Is Mike a good fit for my project?"

---

## 4. Technical Requirements

### 4.1 Architecture Options

#### Option A: Serverless AI Chatbot (Recommended for MVP)
**Stack:**
- Frontend: JavaScript widget embedded in Ghost theme
- Backend: Cloudflare Workers or Vercel Edge Functions
- AI Provider: OpenAI API (GPT-4 Turbo or GPT-3.5)
- Knowledge Base: JSONL hosted on CDN or embedded in function

**Pros:**
- Fast to implement (1-2 weeks)
- Low cost (~$5-20/month depending on traffic)
- No server management
- Scales automatically
- Works with Ghost Pro

**Cons:**
- API dependency (OpenAI)
- Recurring API costs
- Less privacy for visitor queries

#### Option B: Self-Hosted RAG Chatbot
**Stack:**
- Frontend: JavaScript widget
- Backend: Python FastAPI server
- Vector Database: ChromaDB or Qdrant
- AI Model: Local LLM via Ollama (Qwen 2.5:14B or similar)
- Hosting: Same VPS as Ghost (if self-hosted) or separate droplet

**Pros:**
- Full data sovereignty (aligns with Resilient Tomorrow values)
- No API costs after setup
- Privacy-first (visitor queries stay on your server)
- Demonstrates advanced AI implementation

**Cons:**
- More complex setup (3-4 weeks)
- Requires server management
- Higher initial cost ($10-30/month for VPS)
- Need to manage uptime and scaling

#### Option C: Hybrid Approach (Recommended for Production)
**Stack:**
- Frontend: JavaScript widget
- Backend: Cloudflare Workers
- Primary AI: OpenAI API for speed/quality
- Fallback: Local LLM for privacy-sensitive queries
- Knowledge Base: JSONL on GitHub or CDN with cache

**Pros:**
- Best of both worlds
- Fast initial implementation
- Privacy option available
- Cost-effective

**Cons:**
- More complex architecture
- Two systems to maintain

---

### 4.2 Data Flow

```
Visitor Question
    ↓
Frontend Widget (JS)
    ↓
API Endpoint (Cloudflare Workers / FastAPI)
    ↓
RAG Retrieval System
    ├─ Parse question
    ├─ Filter knowledge.jsonl by topic/type
    ├─ Rank entries by relevance
    └─ Select top 3-5 entries
    ↓
AI Model (OpenAI / Local LLM)
    ├─ System prompt with chatbot behavior guidelines
    ├─ Inject retrieved knowledge entries as context
    └─ Generate response
    ↓
Response to Frontend
    ↓
Display to Visitor
```

---

### 4.3 Ghost Integration

**Embedding the Widget:**

**Method 1: Theme Modification (Preferred)**
- Edit Ghost theme footer.hbs
- Add `<script>` tag loading chatbot widget
- Widget initializes on page load

**Method 2: Code Injection (Ghost Pro Compatible)**
- Ghost Admin → Settings → Code Injection
- Add widget script to Site Footer
- No theme modification required

**Widget Structure:**
```html
<!-- In Ghost footer or code injection -->
<div id="mj-chatbot-widget"></div>
<script src="https://your-cdn.com/chatbot-widget.js"></script>
<script>
  MJChatbot.init({
    apiEndpoint: 'https://api.mikejones.online/chat',
    theme: 'dark', // Match site theme
    position: 'bottom-right',
    greeting: "Hi! I'm Mike's AI assistant...",
    suggestedQuestions: [
      "What has Mike worked on?",
      "Tell me about the AI Memory System"
    ]
  });
</script>
```

---

## 5. Knowledge Base Management

### 5.1 Current State
- **Location:** `/Users/michaeljones/dev/MJ_Online/Cowork/content/rag/knowledge.jsonl`
- **Entries:** 70 total
- **Format:** JSONL (JSON Lines)
- **Schema:** Defined in `RAG_SCHEMA.md`

### 5.2 Deployment Strategy

**For Serverless (Option A/C):**
1. Upload `knowledge.jsonl` to CDN (Cloudflare R2, AWS S3, or GitHub)
2. Backend fetches and caches on startup
3. Periodic refresh (hourly or on-demand)

**For Self-Hosted (Option B):**
1. Include `knowledge.jsonl` in backend repository
2. Load into vector database on startup
3. Rebuild embeddings when file changes

### 5.3 Update Workflow
1. Edit `knowledge.jsonl` locally (add/modify entries)
2. Validate with schema checker
3. Commit to Git repository
4. Deploy to production (triggers reload)

---

## 6. Chatbot Behavior Guidelines

### 6.1 Tone and Voice
- **Professional but approachable:** Matches Mike's style
- **Direct and helpful:** No unnecessary fluff
- **Honest about limitations:** If information isn't in knowledge base, say so
- **Action-oriented:** Offers next steps (contact, schedule, read more)

### 6.2 Response Patterns

**For Factual Questions:**
```
Question: "What companies has Mike worked for?"
Response: "Mike has worked at Microsoft (Xbox and Xbox 360 teams),
Kabam, Livescribe, and Kinoo in director-level roles. He also
co-founded 8 Circuit Studio, a Web3 gaming company. Want to know
more about any of these experiences?"
```

**For Project Questions:**
```
Question: "What is the AI Memory System?"
Response: "The AI Memory System is Mike's personal knowledge management
infrastructure that maintains context across AI conversations and platforms.
It uses a JSONL ledger that both humans and AI can read/write, solving the
'context loss' problem where each new AI session starts fresh.

It's designed for cross-platform compatibility between Claude, ChatGPT,
and local AI systems. Would you like to know why Mike built it or how
it works technically?"
```

**For Fit Assessment:**
```
Question: "Should I hire Mike for my startup?"
Response: "Mike works best with companies of 50-500 employees in gaming,
entertainment, or media industries. His ideal clients are experiencing
'too many meetings, not enough clarity' - typically moving from ad hoc
processes to repeatable delivery.

Can you tell me more about your company size and what challenges you're
facing? That will help me determine if Mike's services are a good fit."
```

**When Information Missing:**
```
Question: "What's Mike's favorite color?"
Response: "I don't have that information in my knowledge base. I'm focused
on Mike's professional experience, projects, and services. Is there something
specific about his work I can help you with?"
```

---

## 7. Privacy and Security

### 7.1 Data Collection
- **Conversation logs:** Store for analytics (optional)
- **Visitor identification:** Anonymous by default
- **No personal data collection:** Unless visitor volunteers it
- **GDPR compliance:** Privacy policy disclosure

### 7.2 Privacy Policy Disclosure
Display in chat widget footer:
"This chatbot uses AI to answer questions about Mike's work. Conversations may be logged for quality improvement. [Privacy Policy]"

### 7.3 Rate Limiting
- 10 messages per visitor per hour
- 100 messages per IP per day
- Prevents abuse and controls API costs

---

## 8. Analytics and Metrics

### 8.1 Track These Metrics
- **Conversation volume:** Messages per day/week/month
- **Popular topics:** What visitors ask about most
- **Engagement rate:** % of visitors who interact
- **Question types:** Career, projects, services, fit assessment
- **Conversion:** Clicks to contact/schedule from chat
- **Unhandled queries:** Questions the bot couldn't answer (for knowledge base expansion)

### 8.2 Analytics Tools
- **Option 1:** Custom logging in backend
- **Option 2:** Plausible Analytics events
- **Option 3:** PostHog for session replay + analytics

---

## 9. Implementation Roadmap

### Phase 1: MVP Chatbot (2-3 weeks)
**Goal:** Get basic chatbot live with existing knowledge base

**Tasks:**
1. Choose architecture (recommend Option A - Serverless)
2. Set up backend API (Cloudflare Workers + OpenAI)
3. Build frontend widget (JavaScript)
4. Integrate knowledge.jsonl retrieval
5. Implement RAG prompt engineering
6. Test conversation quality
7. Deploy to staging
8. Integrate into Ghost theme
9. Launch on production

**Deliverables:**
- Working chatbot on all pages
- Answers questions from knowledge base
- Mobile responsive
- Basic analytics

### Phase 2: Enhanced Features (1-2 weeks)
**Goal:** Improve UX and capabilities

**Tasks:**
1. Add suggested questions
2. Implement conversation history
3. Add "Learn more" page links
4. Integrate Cal.com scheduling
5. Add typing indicators
6. Improve error handling
7. A/B test greeting messages

**Deliverables:**
- Smoother conversation flow
- Better conversion to contact/schedule
- Improved analytics

### Phase 3: Advanced Features (2-3 weeks, optional)
**Goal:** Self-hosted, privacy-first implementation

**Tasks:**
1. Set up self-hosted RAG backend
2. Deploy local LLM (Ollama)
3. Migrate knowledge base to vector database
4. Implement embedding-based retrieval
5. Test response quality vs. OpenAI
6. Gradual traffic migration

**Deliverables:**
- Fully self-hosted chatbot
- No API dependencies
- Privacy-first architecture
- Demonstrates advanced AI implementation

---

## 10. Cost Estimates

### Serverless Option (Option A)
- **Cloudflare Workers:** Free tier (100k requests/day)
- **OpenAI API:** ~$0.002 per conversation (GPT-3.5) or $0.01 (GPT-4)
- **Estimated monthly cost:** $10-50 (assuming 500-2500 conversations/month)

### Self-Hosted Option (Option B)
- **VPS (2GB RAM):** $12-18/month (DigitalOcean/Linode)
- **No API costs**
- **Setup time:** 20-30 hours (higher initial investment)

### Hybrid Option (Option C)
- **Cloudflare + OpenAI:** $10-30/month for API
- **Optional VPS:** $12-18/month if adding self-hosted fallback
- **Total:** $10-50/month

---

## 11. Open Questions and Decisions Needed

### Technical Decisions
- [ ] **Architecture choice:** Serverless (A), Self-hosted (B), or Hybrid (C)?
- [ ] **AI provider:** OpenAI GPT-4/3.5, Claude API, or local LLM?
- [ ] **Hosting:** Cloudflare Workers, Vercel, or dedicated VPS?
- [ ] **Analytics:** What level of conversation logging is acceptable?

### Design Decisions
- [ ] **Visual style:** Match Ghost theme exactly or distinct branding?
- [ ] **Chat icon:** Simple message bubble or custom design?
- [ ] **Color scheme:** Dark mode, light mode, or auto-detect?
- [ ] **Personality:** Formal assistant vs. friendly helper tone?

### Content Decisions
- [ ] **Greeting message:** What should the chatbot say on first interaction?
- [ ] **Suggested questions:** Which 4-5 prompts to display?
- [ ] **Knowledge gaps:** What topics need more RAG entries?
- [ ] **Out-of-scope topics:** What should the bot explicitly not answer?

### Privacy Decisions
- [ ] **Conversation logging:** Store for analytics or delete immediately?
- [ ] **Visitor identification:** Anonymous sessions or optional name collection?
- [ ] **Data retention:** How long to keep conversation logs?
- [ ] **GDPR compliance:** What disclosures are needed?

---

## 12. Success Metrics

### Launch Metrics (First 3 Months)
- **Engagement:** 10-20% of visitors interact with chatbot
- **Conversation length:** Average 3-5 messages per conversation
- **Helpfulness:** < 10% "I don't know" responses
- **Conversion:** 5-10% of conversations end with contact/schedule click

### Long-Term Indicators
- Growing conversation volume as traffic increases
- Positive feedback from visitors
- Lead qualification effectiveness (visitors self-identify fit)
- Knowledge base expansion based on unhandled questions
- Chatbot demonstrates AI expertise to potential employers/clients

---

## 13. Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI generates incorrect information | High | Strict RAG retrieval, only use verified entries |
| High API costs from abuse | Medium | Rate limiting, caching, conversation length limits |
| Poor response quality | High | Thorough prompt engineering, testing, fallback responses |
| Knowledge base outdated | Medium | Regular content reviews, easy update workflow |
| Visitor privacy concerns | Medium | Clear privacy disclosure, minimal data collection |
| Integration breaks Ghost theme | Low | Use code injection method, test thoroughly |

---

## 14. Related Documents

- **Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl` (70 entries)
- **Schema Documentation:** `/Cowork/content/rag/RAG_SCHEMA.md`
- **Project Status:** `/Cowork/PROJECT_STATUS.md`
- **Next Steps:** `/Cowork/NEXT_STEPS.md`
- **Content Map:** `/Cowork/content/content_map_v1.md`
- **Main Requirements:** `/plans/requirements-specification.md`
- **Roadmap:** `/plans/roadmap-ghost-pro.md`

---

## 15. Appendix: Sample Conversations

### Example 1: Career Question
**Visitor:** "What's Mike's background?"

**Chatbot:** "Mike has 26+ years of experience in program and project management, specializing in gaming, entertainment, and media. His career includes work at Microsoft (Xbox and Xbox 360 launch teams), director-level roles at Kabam, Livescribe, and Kinoo, and co-founding 8 Circuit Studio, a Web3 gaming company.

He's particularly known for creating systems that make work visible and teams more efficient. For example, at Microsoft he patented the VINCE instrumentation tool that became the foundation for the 'Kill Cam' feature in games like Halo 2.

Would you like to know more about his work at a specific company or see examples of systems he's built?"

### Example 2: Project Question
**Visitor:** "Tell me about NeighborhoodShare"

**Chatbot:** "NeighborhoodShare is Mike's tool-sharing platform designed to build community connections. It started when a neighbor needed to cut a bike post and had never heard of an angle grinder - the realization that neighbors have the solutions to each other's problems but don't connect.

The platform works by letting users photograph items (tools, equipment, etc.), with AI automatically categorizing them. Users can search within their chosen neighborhood radius, request to borrow items via text message, and arrange pickup/return.

The bigger vision: it's a prototype for mutual aid and hyperlocal community support, addressing Resilient Tomorrow's Pillar 3 (Access > Money) and Pillar 7 (Hyperlocal Community).

Interested in learning more about how it works or the technology behind it?"

### Example 3: Fit Assessment
**Visitor:** "I run a 100-person gaming studio and we're drowning in meetings. Can Mike help?"

**Chatbot:** "That sounds like an excellent fit for Mike's expertise! Here's why:

✅ **Team size:** You're in his sweet spot (50-500 people)
✅ **Industry:** Gaming is his background (Xbox, Kabam experience)
✅ **Problem:** 'Drowning in meetings with unclear outcomes' is exactly what Mike specializes in solving

Mike helps teams like yours by:
- Mapping workflows to identify bottlenecks
- Implementing visibility systems (JIRA workflows, dashboards)
- Reducing meeting overhead through better processes
- Automating status updates and reporting

His typical engagement starts with a 2-week Workflow Assessment ($4k-$12k) that includes systems audit, RACI design, and metrics specification.

Would you like to schedule a call with Mike to discuss your specific challenges? I can connect you to his calendar."

---

**Document Version:** 1.0
**Created By:** Claude Code (Project Manager Agent)
**Date:** 2026-01-29
**Status:** Ready for Review and Decision
