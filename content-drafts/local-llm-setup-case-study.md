# Local LLM Setup Case Study
**Ghost Pro Ready**
**For Publishing to mikejones.online/projects/local-llm-setup**

---

## Meta Information

**Title:** Self-Hosted LLM Infrastructure: Building Local AI Capabilities
**URL Slug:** /projects/local-llm-setup (or /local-llm-infrastructure)
**Meta Description:** Self-hosted AI infrastructure running on Mac Mini. Ollama, Qwen 2.5:14B, OpenWebUI, automated startup, RAG integration. Private, offline AI without cloud dependencies. Built by Mike Jones.
**Excerpt:** Self-hosted AI infrastructure providing private, offline capabilities. No cloud dependencies, no subscriptions, complete data sovereignty.
**Tags:** AI, Projects, AI/ML, Infrastructure, Privacy, Featured

---

## Page Content (Ghost Editor Format)

---

# Local LLM Setup
## Self-Hosted LLM Infrastructure: Building Local AI Capabilities

**Project Type:** Personal Infrastructure | AI Implementation
**Status:** Production (2023-Present)
**Tech Stack:** Ollama, Qwen 2.5:14B, OpenWebUI, macOS LaunchAgents, RAG

---

## The Problem: Dependency and Privacy

If you use AI daily, you're dependent on someone else's infrastructure.

**The reality of cloud AI:**
- **Privacy concerns:** Every conversation sent to cloud servers
- **Subscription dependency:** Pay monthly or lose access
- **Internet requirement:** No connection = no AI
- **Data sovereignty:** Someone else controls your data
- **Service changes:** Features removed, prices raised, terms changed without notice
- **Platform risk:** What if the service shuts down?

For casual use, this is fine. For building systems, writing daily, or working with sensitive information—it's a problem.

**The question:** What if AI could run on **your** machine, with **your** data, under **your** control?

---

## The Approach: Take Control

The solution required meeting specific goals:

**1. Privacy:** Data stays on my machine. No one else has access.
**2. Offline:** Works without internet. No cloud dependency.
**3. Sovereignty:** I own the system. Can't be taken away.
**4. Quality:** Performance comparable to cloud LLMs (within reason).
**5. Integration:** Works with existing workflows (AI Memory System, MCP).

The answer: **Self-hosted LLM infrastructure on a Mac Mini.**

---

## The Solution: Offline AI Stack

The **Local LLM Setup** is a self-hosted AI infrastructure running on Mac Mini that provides private, offline AI capabilities.

### Architecture

**Hardware:**
- Mac Mini (M-series Apple Silicon for efficient inference)
- Local storage for models and data
- No cloud connectivity required

**Core Components:**

**1. Ollama (Port 11434)**
- Local model inference engine
- Runs large language models locally
- Primary model: **Qwen 2.5:14B** (14 billion parameters)
- Models stored locally, no cloud calls

**2. OpenWebUI (Port 3000)**
- ChatGPT-like web interface
- Clean, familiar UX for AI conversations
- Multi-model support
- Knowledge base integration (RAG)

**3. MCP Bridge (Port 11620)**
- Model Context Protocol filesystem access
- Enables AI to read/write local files
- Integration with AI Memory System

**Management:**
- Auto-starts via macOS LaunchAgents (survives reboots)
- Managed with custom `rtai` command
- Service monitoring and restart capabilities

---

## Technical Deep Dive

### Model Selection: Qwen 2.5:14B

**Why Qwen 2.5:14B?**
- **Size vs Performance:** 14B parameters balances quality and speed
- **Multilingual:** Trained on diverse dataset (English + others)
- **Instruction Following:** Strong performance on complex tasks
- **Runs Locally:** Efficiently runs on Apple Silicon
- **Open Weights:** Freely available, no licensing restrictions

**Performance:**
- Comparable to GPT-3.5 for many tasks
- Fast enough for interactive use
- Handles complex reasoning and code generation

### RAG Knowledge Base Integration

**Continuous Sync:**
- Watcher script monitors `/articles` folder
- Automatically uploads new/changed files to OpenWebUI knowledge base
- Enables RAG-powered responses about my writing and projects

**Use Cases:**
- "What did I write about community resilience?"
- "Summarize my Resilient Tomorrow articles on Pillar 3"
- "Find references to tool-sharing in my writing"

**Result:** Local AI that knows my work without manual context-loading.

### Auto-Start System

**macOS LaunchAgents:**
- Services start automatically on boot
- Survive system restarts
- Run in background (no manual intervention)

**Management Command:**
```bash
rtai start   # Start all services
rtai stop    # Stop all services
rtai status  # Check service health
rtai restart # Restart services
```

**Reliability:** System runs 24/7, always available when needed.

---

## Integration with AI Memory System

The Local LLM Setup integrates seamlessly with the [AI Memory System](/projects/ai-memory-system):

**Shared Context:**
- Local LLM reads memory.jsonl for project context
- Writes new memories back to ledger
- Same structured format as Claude/ChatGPT

**Workflow:**
1. Start conversation in Claude (cloud AI)
2. Switch to local LLM for sensitive work
3. All context preserved via memory.jsonl
4. Continue conversation offline

**Privacy Benefit:** Sensitive discussions stay local while leveraging cross-platform context.

---

## The Results: AI That Works For Me

**Impact:**

**Data Sovereignty:**
- 100% of conversations stay on my machine
- No third-party access to my data
- No cloud logs or training data concerns
- Complete control over what gets stored

**Offline Capability:**
- AI works without internet connection
- No dependency on cloud services
- Travel, outages, privacy-sensitive work—always available

**Cost Savings:**
- $0/month ongoing costs (vs $20-80/month for cloud AI)
- One-time hardware investment (Mac Mini)
- No subscription lock-in

**Performance:**
- Fast enough for interactive use
- Handles complex tasks (code, analysis, writing)
- Quality comparable to GPT-3.5 for most use cases
- Trade-off: Slightly slower than cloud GPT-4, but acceptable

**Integration:**
- Works with AI Memory System for cross-platform context
- RAG integration for my writing and projects
- MCP filesystem access for file operations

---

## Why This Matters

### For Me: Privacy and Resilience

This setup implements two pillars from my [7 Pillars framework](https://resilienttomorrow.substack.com):

**Pillar 4 (Knowledge Stewardship):**
> "Systems that don't require permission. Knowledge management infrastructure you control."

**Pillar 5 (Communication Independence):**
> "Own your channels. AI built to work for you, not on you. Data sovereignty."

**Philosophy:** Building systems that reduce dependency on fragile centralized infrastructure while still living in the world as it is.

### For AI Implementation: Hands-On Infrastructure

This project demonstrates **practical AI infrastructure skills**:
- Self-hosted model deployment
- Service orchestration and management
- RAG (Retrieval-Augmented Generation) integration
- Auto-start and reliability engineering
- Local-first architecture design
- MCP integration for filesystem access
- Performance optimization for Apple Silicon

**Real-world application:** Not just theory—production system running 24/7 for real work.

---

## Lessons Learned

**Start with Quality Models:** Qwen 2.5:14B hits the sweet spot for local inference. Smaller models (7B) feel limiting; larger models (70B+) are slow on consumer hardware.

**Auto-Start is Essential:** Manual service management gets old fast. LaunchAgents make the system reliable and maintainable.

**RAG Adds Huge Value:** Local knowledge base integration transforms generic AI into personalized assistant that knows your work.

**Local ≠ Weak:** With the right model and hardware, local LLMs can match cloud AI for many tasks. Not every conversation needs GPT-4.

**Privacy is Freedom:** Once you experience AI that doesn't phone home, it's hard to go back. The peace of mind is worth the setup effort.

**Cloud Still Has a Place:** Local LLMs complement cloud AI, they don't replace it. I use both, depending on the task and privacy needs.

---

## The Bigger Picture

The Local LLM Setup is part of my broader **OfflineAI infrastructure**, which includes:
- **AI Memory System:** Cross-platform context management (JSONL ledger)
- **Local LLM:** Self-hosted inference (this project)
- **RAG Knowledge Base:** Continuous sync for my writing
- **MCP Integration:** Filesystem access for AI tools

Together, these projects form a **local-first AI workflow** that prioritizes:
- Privacy
- Sovereignty
- Resilience
- Integration
- Practical utility

**Goal:** AI that works for me, not on me, with data where it belongs—on my machine.

---

## Want to Learn More?

**Related Projects:**
- [AI Memory System →](/projects/ai-memory-system) - Cross-platform knowledge management
- [NeighborhoodShare →](/projects/neighborhoodshare) - Tool-sharing with AI categorization

**Writing:**
- [Resilient Tomorrow](https://resilienttomorrow.substack.com) - Community resilience and parallel systems
- [Velocity Partners](/contact) - Fractional PMO with AI-augmented workflows

**Get in Touch:**
Interested in self-hosted AI infrastructure for your team? [Let's talk](/contact).

---

## Project Details

**Timeline:** 2023-Present (Production system)
**Development:** Solo project, iterative refinement
**Open Source:** Personal infrastructure (setup documented for others)
**Inspiration:** Privacy concerns, desire for offline capability, data sovereignty

**Tech Stack:**
- **Model:** Qwen 2.5:14B (14 billion parameters)
- **Inference:** Ollama (port 11434)
- **Interface:** OpenWebUI (port 3000)
- **Integration:** MCP Bridge (port 11620)
- **Auto-start:** macOS LaunchAgents
- **Management:** Custom `rtai` command
- **RAG:** Knowledge base sync for articles
- **Hardware:** Mac Mini (Apple Silicon)

**Performance:**
- Interactive response times
- Comparable to GPT-3.5 quality
- Handles code generation, analysis, writing
- Offline operation (no internet required)

---

## SEO & Structured Data

### Open Graph Tags
```html
<meta property="og:title" content="Self-Hosted LLM Infrastructure: Building Local AI Capabilities">
<meta property="og:description" content="Self-hosted AI infrastructure on Mac Mini. Ollama, Qwen 2.5:14B, OpenWebUI, automated startup. Private, offline AI with complete data sovereignty.">
<meta property="og:type" content="article">
<meta property="og:url" content="https://mikejones.online/projects/local-llm-setup">
<meta property="og:image" content="https://mikejones.online/content/images/local-llm-architecture.jpg">
```

### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Self-Hosted LLM Infrastructure: Building Local AI Capabilities">
<meta name="twitter:description" content="Private, offline AI running on Mac Mini. No cloud dependencies, complete data sovereignty.">
<meta name="twitter:image" content="https://mikejones.online/content/images/local-llm-architecture.jpg">
```

### Schema.org Project Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Local LLM Setup",
  "description": "Self-hosted AI infrastructure providing private, offline capabilities without cloud dependencies",
  "url": "https://mikejones.online/projects/local-llm-setup",
  "applicationCategory": "AI Infrastructure",
  "operatingSystem": "macOS",
  "author": {
    "@type": "Person",
    "name": "Mike Jones",
    "url": "https://mikejones.online"
  },
  "datePublished": "2023",
  "keywords": "AI, self-hosted, local LLM, Ollama, OpenWebUI, Qwen, privacy, offline AI, data sovereignty, infrastructure"
}
```

---

## Publishing Checklist

1. [ ] Create post in Ghost Admin → Posts → New Post
2. [ ] Set title: "Self-Hosted LLM Infrastructure: Building Local AI Capabilities"
3. [ ] Paste content into Ghost editor
4. [ ] Set URL slug to "/projects/local-llm-setup" or "/local-llm-infrastructure"
5. [ ] Add tags: "AI", "Projects", "AI/ML", "Infrastructure", "Privacy", "Featured"
6. [ ] Add featured image (architecture diagram or Mac Mini setup)
7. [ ] Set excerpt and meta description
8. [ ] Inject Schema.org JSON-LD
9. [ ] Publish post
10. [ ] Verify at https://mikejones.online/projects/local-llm-setup
11. [ ] Test internal links

---

## Image Suggestions

**Featured Image:**
- Mac Mini with OpenWebUI interface screenshot
- Architecture diagram showing Ollama + OpenWebUI + MCP
- Concept: "Self-Hosted AI Infrastructure"

**Inline Images:**
- OpenWebUI interface screenshot (ChatGPT-like UI)
- `rtai status` command output showing running services
- RAG knowledge base interface
- Architecture diagram with ports and components

---

## RAG Verification

✅ Local LLM Setup description (rag-2026-01-27-019)
✅ Three services: Ollama, OpenWebUI, MCP (rag-2026-01-27-016)
✅ Qwen 2.5:14B model (rag-2026-01-27-019)
✅ Auto-start via LaunchAgents, managed with 'rtai' (rag-2026-01-27-016)
✅ RAG knowledge base integration (rag-2026-01-27-017)
✅ Privacy and sovereignty motivation (rag-2026-01-29-036)
✅ Connection to 7 Pillars (Pillar 4, Pillar 5) (rag-2026-01-29-036)
✅ Part of OfflineAI infrastructure (rag-2026-01-27-020)
✅ Integration with AI Memory System (rag-2026-01-27-019)
✅ All technical details verified

---

**STATUS: READY FOR PUBLISHING** ✅
