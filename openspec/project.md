# Project Context

## Purpose
MJ_Online (mikejones.online) is a personal website and career portfolio for Mike Jones that serves as a centralized hub for professional accomplishments, project showcases, and content syndication. The site enables visitors to explore Mike's 29-year career journey while providing subscription capabilities through ActivityPub federation.

**Primary Goals:**
- Career Portfolio: Demonstrate professional skills, accomplishments, and AI implementation expertise to potential employers
- Content Aggregation: Centralize feeds from SubStack publications (Resilient Tomorrow, Velocity Partners)
- Social Federation: Enable audience building through ActivityPub integration
- Skills Demonstration: Showcase web development, technical capabilities, and practical AI implementation

## Tech Stack
- **CMS Platform:** Ghost (managed hosting via Ghost Pro)
- **Language:** Node.js (Ghost core)
- **Database:** MySQL (Ghost-managed)
- **Frontend:** Ghost themes (Handlebars templates)
- **Hosting:** Ghost Pro managed service (mikejones.online)
- **Federation:** ActivityPub (Ghost native)
- **Analytics:** Ghost Analytics (built-in)
- **Email:** Ghost email delivery (included)

## Project Conventions

### Code Style
- Always use Python when possible for custom scripts/integrations (unless frontend requires JavaScript)
- Never use single-letter variable names
- Always use a virtual environment (./venv or ./env)
- Never use Conda
- Keep JavaScript minimal - only for necessary frontend enhancements

### Architecture Patterns
- **Ghost-First:** Leverage Ghost's built-in features before custom development
- **Static over Dynamic:** Prefer static content generation where possible
- **API Integration:** Use Ghost Content API for external integrations
- **Theme Customization:** Modify Ghost themes minimally; prefer code injection over theme forks
- **Serverless Functions:** Use Cloudflare Workers or Vercel Edge for custom backend needs

### Testing Strategy
- Prioritize integration testing over heavily mocked unit tests
- Only mock external dependencies when necessary
- Test at boundaries (external services), not internal components
- Manual testing for content and UI changes
- Automated testing for API integrations and custom code

### Git Workflow
- Don't summarize at the end; wait for user review before commit
- Background long-running processes (like dev servers)
- Commit messages follow conventional format
- Work in feature branches when appropriate

## Domain Context

### Mike's Background
- **29 years in tech** (started 1997 at Aviation Supplies & Academics, Microsoft 1999)
- **Professional title:** AI Implementation Expert and LLM Integration Specialist
- **Expertise:** AI implementation, LLM integration, Context Engineering, AI-Augmented Process Design (AAPD)
- Microsoft Xbox/Xbox 360 launch teams contributor (6 AAA titles)
- Xbox SDK patent holder (VINCE instrumentation tool)
- Director-level roles: Kabam, Livescribe, Kinoo
- Co-founder: 8 Circuit Studio (Web3 gaming)
- Top 1% ChatGPT user, top 3% for conversation volume
- **Business:** Jones Collaboration Company, LLC (parent company)
  - Velocity Partners (consulting: fractional PMO + AI implementation)
  - Resilient Tomorrow (publication: community resilience)

### Key Projects
- **OfflineAI / AI Memory System:** Cross-platform AI memory using JSONL ledger, context persistence
- **Local LLM Infrastructure:** Self-hosted AI (Ollama, OpenWebUI, MCP) for privacy and sovereignty
- **NeighborhoodShare:** Tool-sharing platform for hyperlocal community building
- **Resilient Tomorrow:** Substack publication on community resilience (7 Pillars framework)
- **Velocity Partners:** AI-augmented PMO consulting (AAPD methodology, PM Drowning framework)

### Content Strategy
- **Hero tagline:** "I build systems that help people thrive"
- **Through-line:** 29 years creating better systems (warehouse → Xbox → process optimization → AI implementation)
- **Positioning:** AI implementation and LLM integration (NOT machine learning model training)
- **Context Engineering:** Industry shift from prompt engineering to context engineering (Gartner 2025)
- **7 Pillars Framework:** Food Sovereignty, Energy Autonomy, Local Wealth, Knowledge Stewardship, Communication Independence, Mutual Aid, Hyperlocal Community

### RAG Knowledge Base - SOURCE OF TRUTH

**CRITICAL: The RAG knowledge base is the ONLY authoritative source for Mike's information.**

**Location:** `/Cowork/content/rag/knowledge.jsonl`
**Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`
**Entries:** 100 verified entries (as of 2026-01-30)

**What it contains:**
- Career history (29 years, all positions, achievements)
- Professional positioning and terminology standards
- Technical projects (OfflineAI, NeighborhoodShare, etc.)
- Velocity Partners (AAPD methodology, services, results)
- Resilient Tomorrow (7 Pillars, articles, metrics)
- Skills, methodologies, and professional narrative
- Business structure and entities

**Entry types:**
- `fact` - Verified factual statements
- `narrative` - Story-based explanations with context
- `qa_pair` - Question and answer format
- `technical` - Technical specifications and details
- `fit_assessment` - Job fit criteria and evaluations

**Usage requirements:**
1. ✅ **ALWAYS** consult RAG before writing any content
2. ✅ Use exact terminology from RAG (especially professional title)
3. ✅ Verify all facts against RAG entries
4. ✅ Reference RAG entry IDs for traceability
5. ❌ **NEVER** guess or infer information not in RAG
6. ❌ **NEVER** use outdated terminology (e.g., "AI/ML Engineer")

**Quick queries:**
```bash
# Search for topics
grep "velocity_partners\|aapd\|context_engineering" /Cowork/content/rag/knowledge.jsonl

# Verify professional title
grep "AI Implementation Expert" /Cowork/content/rag/knowledge.jsonl

# Check experience years
grep "29 years" /Cowork/content/rag/knowledge.jsonl
```

**See CLAUDE.md for complete RAG usage guidelines.**

## Important Constraints

### Timeline
- Target launch: 1-2 weeks for core content
- Post-launch enhancements: Chatbot, additional features
- Maintenance: Minimal ongoing effort required

### Budget
- Ghost Pro: $25-50/month (managed hosting)
- Future integrations: $10-50/month (APIs, serverless functions)
- Keep solutions cost-effective and maintainable

### Philosophical Constraints
- **Code Preservation:** NEVER comment out existing features to "simplify for now"
- **Avoid Over-Engineering:** Only make changes directly requested or clearly necessary
- **Privacy-First:** Align with Resilient Tomorrow values (data sovereignty, self-hosting where possible)
- **Accessibility:** WCAG 2.1 Level AA compliance

## External Dependencies

### Required Services
- **Ghost Pro:** Managed Ghost hosting (active at mikejones.online)
- **DNS:** Domain configuration (MikeJones.online)
- **Email Delivery:** Ghost Pro default email (configured)
- **SSL/TLS:** Let's Encrypt via Ghost Pro (automated)

### Optional/Future Services
- **OpenAI API:** For chatbot implementation (GPT-4 Turbo or GPT-3.5)
- **Cloudflare Workers:** Serverless backend for chatbot
- **Cal.com:** Meeting scheduling integration
- **Plausible Analytics:** Privacy-focused analytics (alternative to Ghost Analytics)
- **SubStack RSS:** Content aggregation from Mike's publications

### Content Sources
- **RAG Knowledge Base:** `/Cowork/content/rag/knowledge.jsonl` (100 entries - authoritative source)
- **RAG Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`
- **Content Map:** `/Cowork/content/content_map_v1.md`
- **Requirements:** `/plans/requirements-specification.md`
- **Roadmap:** `/plans/roadmap.md` (consolidated, authoritative)
- **Archive:** `/archive/roadmap-vps-approach.md` (historical VPS approach, deprecated)
