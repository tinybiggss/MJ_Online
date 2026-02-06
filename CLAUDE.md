<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MJ_Online** is a personal web publishing platform - a "personal web view" that allows publishing content that others can subscribe to. Think of it as owning your own corner of the internet with built-in subscription/syndication capabilities.

**Status**: New project - architecture and tech stack to be determined.

## Project Vision

- Personal website as the canonical source for published content
- Subscription mechanism for followers (RSS, email newsletter, ActivityPub, or similar)
- Content publishing tools integrated into the site
- Modern, clean interface

## Potential Architecture Patterns

These are options to consider, not decisions yet made:

**Static Site + Headless CMS**: Astro/Hugo/11ty + subscription service
**Full-Stack**: Next.js/SvelteKit with database
**IndieWeb Stack**: Microformats + Webmentions + RSS
**Fediverse Integration**: ActivityPub for decentralized social

## RAG Knowledge Base - SOURCE OF TRUTH

**CRITICAL: All agents working in this repository MUST use the RAG knowledge base as the authoritative source for information about Mike Jones, his work, experience, and projects.**

### Knowledge Base Location
- **File:** `/Cowork/content/rag/knowledge.jsonl`
- **Schema:** `/Cowork/content/rag/RAG_SCHEMA.md`
- **Entries:** 100 verified entries (as of 2026-01-30)

### What the RAG Contains

**Verified information about:**
- Mike's 29 years of career history (Microsoft Xbox, Kabam, Livescribe, Kinoo, 8 Circuit Studios)
- Professional positioning: "AI Implementation Expert and LLM Integration Specialist"
- Technical projects: AI Memory System, Local LLM Setup, NeighborhoodShare
- Resilient Tomorrow publication (7 Pillars framework, articles, engagement metrics)
- Velocity Partners consulting service (AAPD methodology, PM Drowning framework, services)
- Skills, achievements, methodologies, and professional narrative
- Business structure: Jones Collaboration Company, LLC (parent company)

### When to Use the RAG

**ALWAYS use the RAG when:**
- Writing content for any page (About, Resume, Projects, Homepage, etc.)
- Creating page descriptions, meta tags, or SEO content
- Drafting professional taglines or headlines
- Documenting Mike's experience, skills, or projects
- Answering questions about Mike's background
- Creating case studies or portfolio entries
- Designing features that display Mike's information

**The RAG is the ONLY authoritative source. Do NOT:**
- Guess or infer information not in the RAG
- Use outdated information from old documents
- Make assumptions about Mike's experience or skills
- Create content without verifying against the RAG first

### How to Query the RAG

**Reading the knowledge base:**
```bash
# View all entries
cat /Cowork/content/rag/knowledge.jsonl

# Search for specific topics
grep "velocity_partners" /Cowork/content/rag/knowledge.jsonl
grep "AI Memory System" /Cowork/content/rag/knowledge.jsonl

# Count entries by type
grep -o '"type":"[^"]*"' /Cowork/content/rag/knowledge.jsonl | sort | uniq -c
```

**Entry types in the RAG:**
- `fact` - Verified factual statements
- `narrative` - Story-based explanations with context
- `qa_pair` - Question and answer format
- `technical` - Technical specifications and details
- `fit_assessment` - Job fit criteria and evaluations

### RAG Schema (JSONL Format)

Each entry follows this structure:
```json
{
  "id": "rag-YYYY-MM-DD-###",
  "type": "fact|narrative|qa_pair|technical|fit_assessment",
  "topic": "career_history|skills|projects|etc",
  "project": "MikeCareer|VelocityPartners|OfflineAI|etc",
  "content": "The actual information...",
  "confidence": "verified|inferred",
  "source": "Document name or source",
  "tags": ["keyword1", "keyword2", "verified"]
}
```

**Additional fields for specific types:**
- `qa_pair`: includes `question` and `answer`
- `narrative`: includes `title`
- `technical`: includes `title`
- `fit_assessment`: includes `fit_type`, `criteria`, `explanation`

### Guidelines for Adding New RAG Entries

**Before adding new entries:**
1. Read existing entries to avoid duplicates
2. Verify information with Mike or source documents
3. Use consistent terminology (see Terminology Standards below)
4. Follow the schema format exactly

**When creating new entries:**
- Use next sequential ID: `rag-YYYY-MM-DD-###`
- Set confidence: `verified` (from Mike/docs) or `inferred` (logical conclusion)
- Include descriptive tags: always include `verified` or `inferred`
- Add source attribution
- Use consistent topic and project names

**Append new entries (don't overwrite):**
```bash
cat >> /Cowork/content/rag/knowledge.jsonl << 'EOF'
{"id":"rag-2026-01-30-101","type":"fact",...}
EOF
```

### Terminology Standards (CRITICAL)

**Correct terminology to use:**
- **Professional title:** "AI Implementation Expert and LLM Integration Specialist"
- **NOT:** "AI/ML Engineer", "ML Researcher", "Machine Learning Engineer"
- **Experience:** "29 years in tech" (started 1997)
- **Expertise areas:** "AI implementation and LLM integration", "Context engineering", "AI-Augmented Process Design (AAPD)"
- **What Mike does:** Works with LLMs and AI implementation (NOT machine learning model training)

**Business entities:**
- **Parent company:** Jones Collaboration Company, LLC
- **Consulting service:** Velocity Partners
- **Publication:** Resilient Tomorrow (Substack)

### Validation Before Publishing

**Before publishing any page content:**
1. ✅ Check RAG for factual accuracy
2. ✅ Verify professional title and terminology
3. ✅ Confirm experience years (29 years as of 2026)
4. ✅ Use correct business entity names
5. ✅ Cite specific RAG entry IDs for reference

**Example validation:**
```bash
# Verify current professional title
grep -A 5 "professional title\|AI Implementation Expert" /Cowork/content/rag/knowledge.jsonl

# Check experience years
grep "29 years\|experience" /Cowork/content/rag/knowledge.jsonl | head -5

# Verify project details
grep "AI Memory System\|OfflineAI" /Cowork/content/rag/knowledge.jsonl | head -10
```

### Data Consistency Requirements

**All agents must ensure:**
- **Consistency:** Same facts appear the same way across all pages
- **Accuracy:** All statements traceable to RAG entries
- **Currency:** Use most recent verified information
- **Completeness:** Don't omit important context from RAG entries
- **Traceability:** Reference RAG entry IDs when documenting sources

**If you find conflicting information:**
1. Check the RAG for authoritative version
2. If RAG has conflict, note it and ask Mike for clarification
3. Do NOT guess which version is correct
4. Do NOT proceed with content creation until resolved

### Quick Reference: Key Facts

**Mike Jones:**
- 29 years in tech (started 1997 at Aviation Supplies & Academics)
- Professional title: AI Implementation Expert and LLM Integration Specialist
- Expertise: AI implementation, LLM integration, Context Engineering, AI-Augmented Process Design (AAPD)
- Top 1% ChatGPT user, top 3% for conversation volume
- Patent holder: Xbox SDK instrumentation method (VINCE tool)

**Companies/Projects:**
- Jones Collaboration Company, LLC (parent company)
- Velocity Partners (consulting: fractional PMO + AI implementation)
- Resilient Tomorrow (Substack: community resilience, 7 Pillars framework)
- OfflineAI (AI Memory System, Local LLM Setup)
- NeighborhoodShare (tool-sharing platform)

**Career Highlights:**
- Microsoft Xbox & Xbox 360 launch teams (6 AAA titles)
- Director roles: Kabam, Livescribe, Kinoo
- Co-founder: 8 Circuit Studios (Web3 gaming)
- Achievements: 80% delivery improvement, 3x efficiency gains
- Managed teams: 50-120+ people, budgets: $4M-$12M+

## Available Skills

### Project Manager (`/.claude/agents/project-manager.md`)

**Role:** Roadmap management, agent orchestration, and institutional knowledge capture.

**Critical responsibilities:**
- Maintain `/plans/roadmap.md` and archive completed work
- Coordinate multiple agents via NATS JetStream
- Update `PROJECT-MEMORY.json` after each milestone
- Verify content against RAG knowledge base
- Make strategic planning decisions

**PROJECT-MEMORY.json System:**
- Location: `/Users/michaeljones/Dev/MJ_Online/PROJECT-MEMORY.json`
- Purpose: Comprehensive project documentation for institutional knowledge and case study material
- Update after: Major decisions, phase completions, challenges overcome, agent workflow changes
- Contains: Decisions, rationale, challenges, solutions, timeline, metrics, agent workflows

**See:** `/.claude/agents/project-manager.md` for complete PM guidelines and responsibilities.

---

### Web Content Builder (`/.claude/skills/web-content-builder/`)

Expert agent for creating, editing, and publishing web content across Mike Jones' web properties.

**Use when:**
- Creating or editing web pages (About, Resume, Projects, Landing pages)
- Publishing content to Ghost Pro
- Planning content strategy or site structure
- Writing copy for any Mike Jones web property
- Optimizing content for SEO or accessibility
- Creating case studies or portfolio content

**Reference files include:**
- Site-specific configs (mikejones-online, velocity-partners, resilient-tomorrow, etc.)
- Design specifications
- Content patterns and templates
- Ghost Pro feature reference

**Critical:** Always verify facts against the RAG knowledge base before publishing.

---

## Development Commands

*To be filled in once tech stack is chosen*

```bash
# Install dependencies
# npm install / pip install -r requirements.txt

# Run development server
# npm run dev / python manage.py runserver

# Build for production
# npm run build

# Run tests
# npm test / pytest
```

## Project Conventions

### Code Style
- Always use Python when possible (unless frontend requires JS)
- Never use single-letter variable names
- Always use a virtual environment (./venv or ./env)
- Never use Conda

### Testing
- Prioritize integration testing over heavily mocked unit tests
- Only mock external dependencies when necessary
- Test at boundaries (external services), not internal components

### Planning & Documentation
- Requirements and plans go in `/plans`
- Save devlog entries in `/devlog` under feature name

### Git Workflow
- Don't summarize at the end; wait for user review before commit
- Background long-running processes (like dev servers)

### Code Preservation
- NEVER comment out existing features to "simplify for now"
- Create separate test files for isolated testing
- Maintain all existing features while adding new ones

## Agent Coordination via NATS JetStream

**CRITICAL: All agents working in this repository MUST use the NATS JetStream system for coordination, status reporting, and communication.**

### System Overview

**Location:** `/agent_coordination/`
**NATS Server:** `localhost:4222`
**FastAPI Server:** `localhost:8001`
**Dashboard:** http://localhost:8001
**Stream:** `MJ_ONLINE_WORK`
**Subject Prefix:** `mjwork.>`

### Required Agent Behaviors

**Every agent MUST:**

1. **Connect to NATS on startup**
   ```python
   from agent_coordination.client import WorkerClient

   async with WorkerClient("Agent-Name") as worker:
       await worker.register(description="Agent role description")
   ```

2. **Identify what they're working on**
   - Claim tasks from `mjwork.tasks.available`
   - Publish claim to `mjwork.tasks.claimed`
   - This prevents duplicate work

3. **Check for required communication**
   - Subscribe to coordination channel: `mjwork.coordination`
   - Listen for messages from other agents
   - Respond when dependencies are mentioned

4. **Report status regularly (REQUIRED)**
   - **CRITICAL:** Send heartbeat every 30 seconds to `mjwork.heartbeat.{agentId}`
   - Update task status as work progresses
   - Publish completion to `mjwork.tasks.completed`

   **⚠️ HEARTBEAT MONITORING IS MANDATORY FOR ALL NEW AGENTS**

   Without heartbeat monitoring:
   - System cannot detect crashed agents
   - Tasks can become stuck indefinitely
   - Agent health status is unknown
   - Automatic recovery is impossible

### NATS Channels

**Task Queue:**
- `mjwork.tasks.available` - Queue of available tasks (watch this!)
- `mjwork.tasks.claimed` - Tasks being worked on (publish when claiming)
- `mjwork.tasks.completed` - Completed tasks (publish when done)

**Communication:**
- `mjwork.coordination` - Agent-to-agent coordination messages
- `mjwork.errors` - Error reporting (publish errors here)
- `mjwork.heartbeat.{agentId}` - Health checks (send every 30s)
- `mjwork.roadmap` - Roadmap updates (Project Manager publishes here)

### Agent Workflow

**Standard agent workflow WITH HEARTBEAT MONITORING:**
```python
from agent_coordination.client import WorkerClient
import asyncio

async with WorkerClient("Agent-Alpha") as worker:
    # 1. Register on startup
    await worker.register(description="Research specialist")

    # 2. Send initial heartbeat
    await worker.heartbeat(status="active", current_task=None)

    # 3. Watch for available tasks
    async for task in worker.watch_tasks():
        # 4. Claim task (prevents others from taking it)
        await worker.claim_task(task["task_id"])

        # 5. Send heartbeat with current task
        await worker.heartbeat(status="busy", current_task=task["task_id"])

        # 6. Check coordination channel for dependencies
        messages = await worker.get_messages(channel="coordination", limit=10)
        for msg in messages:
            if task["task_id"] in msg["content"]:
                # Task has dependencies, coordinate with other agents
                await worker.coordinate(f"Working on task {task['task_id']}, need X from Agent-Beta")

        # 7. Do the work (with periodic heartbeats during long operations)
        result = await execute_task_with_heartbeat(task, worker)

        # 8. Report completion
        await worker.complete_task(task["task_id"], result)
        await worker.coordinate(f"Completed task {task['task_id']}: {result['summary']}")

        # 9. Send heartbeat showing task complete
        await worker.heartbeat(status="active", current_task=None)


async def execute_task_with_heartbeat(task, worker):
    """Execute task with periodic heartbeat monitoring."""
    last_heartbeat = asyncio.get_event_loop().time()

    # Your task execution logic here
    while working_on_task:
        # Do work...
        await do_work()

        # Send heartbeat every 30 seconds
        now = asyncio.get_event_loop().time()
        if now - last_heartbeat > 30:
            await worker.heartbeat(
                status="busy",
                current_task=task["task_id"]
            )
            last_heartbeat = now

    return result
```

**IMPORTANT:** The WorkerClient does NOT automatically send heartbeats. You MUST manually call `worker.heartbeat()` every 30 seconds.

### Heartbeat Monitoring (MANDATORY)

**⚠️ CRITICAL REQUIREMENT: All new agents MUST implement heartbeat monitoring**

Heartbeat monitoring allows the system to:
- Detect crashed or unresponsive agents
- Automatically reclaim tasks from dead agents
- Display real-time agent health status
- Enable automatic recovery mechanisms

**Implementation Pattern:**

```python
import asyncio
from agent_coordination.client import WorkerClient

async def run_agent():
    async with WorkerClient("Agent-Name") as worker:
        # Register
        await worker.register(description="Agent role description")

        # Send initial heartbeat
        await worker.heartbeat(status="active", current_task=None)

        try:
            # Main work loop
            while True:
                # Get and process tasks
                tasks = await worker.get_available_tasks()

                for task in tasks:
                    # Update heartbeat with current task
                    await worker.heartbeat(status="busy", current_task=task['task_id'])

                    # Do work...
                    result = await execute_task(task)

                    # Clear current task from heartbeat
                    await worker.heartbeat(status="active", current_task=None)

                # If no tasks, send idle heartbeat
                await worker.heartbeat(status="idle", current_task=None)
                await asyncio.sleep(30)

        except Exception as e:
            # Send error status in heartbeat
            await worker.heartbeat(status="offline", current_task=None)
            await worker.report_error(str(e))
            raise
```

**Heartbeat Frequency:** Every 30 seconds minimum
**Heartbeat Statuses:** `active`, `idle`, `busy`, `offline`

**Without heartbeat monitoring, agents will NOT be considered production-ready.**

### Status Reporting Requirements

**Agents MUST report:**

**On Start:**
```python
await worker.register(description="Your role")
await worker.heartbeat(status="active", current_task=None)
await worker.coordinate("Agent-Alpha starting up, ready for work")
```

**During Work:**
```python
# REQUIRED: Send heartbeat every 30 seconds manually
await worker.heartbeat(status="busy", current_task="task-5")

# Also send coordination messages when milestones reached:
await worker.coordinate("Task 5: 50% complete - theme research done, writing summary")
```

**Example heartbeat loop pattern:**
```python
import asyncio
from datetime import datetime

async def agent_with_heartbeat():
    async with WorkerClient("Agent-Name") as worker:
        await worker.register(description="Agent role")

        # Main work loop
        while True:
            # Do work...
            await do_work()

            # Send heartbeat every 30 seconds
            await worker.heartbeat(
                status="active",
                current_task=current_task_id if has_task else None
            )
            await asyncio.sleep(30)
```

**On Completion:**
```python
await worker.complete_task(task_id, {
    "status": "completed",
    "summary": "Brief summary of what was done",
    "deliverables": ["file1.md", "file2.md"],
    "ready_for_testing": True
})
```

**On Error:**
```python
await worker.report_error(task_id, {
    "error": "Error description",
    "traceback": "...",
    "needs_help": True
})
```

### Project Manager Agent Responsibilities

**The Project Manager agent MUST:**

1. **Monitor task completions**
   - Subscribe to `mjwork.tasks.completed`
   - When agent reports completion, update roadmap status

2. **Update roadmap on completion**
   ```python
   # When task completion message received
   async def on_task_completed(task_id, result):
       # Update roadmap file
       update_roadmap_task_status(task_id, "completed", result)

       # Publish roadmap update
       await publisher.publish_roadmap_update({
           "task_id": task_id,
           "status": "completed",
           "timestamp": datetime.now(),
           "updated_by": "Project-Manager"
       })
   ```

3. **Update roadmap when ready for testing**
   ```python
   # When agent reports ready_for_testing: true
   async def on_ready_for_testing(task_id, deliverables):
       # Mark task as "Testing" in roadmap
       update_roadmap_task_status(task_id, "testing")

       # Notify on coordination channel
       await publisher.coordinate(f"Task {task_id} ready for testing: {deliverables}")
   ```

4. **Track blocked dependencies**
   - Monitor `mjwork.tasks.claimed` to see what's in progress
   - Publish available tasks when dependencies clear
   - Coordinate with agents when blockers are resolved

5. **Maintain PROJECT-MEMORY.json** ⭐
   - Update `/Users/michaeljones/Dev/MJ_Online/PROJECT-MEMORY.json` after each milestone
   - Capture all decisions, rationale, and alternatives considered
   - Document challenges encountered and solutions implemented
   - Record agent workflows, coordination patterns, and improvements
   - Update timeline data, metrics, and strategic evolution
   - Ensure completeness before case study creation
   ```python
   # When milestone completes
   async def on_milestone_completed(phase_id, details):
       # Update roadmap
       update_roadmap_task_status(phase_id, "completed", details)

       # Update PROJECT-MEMORY.json
       update_project_memory({
           "milestone": phase_id,
           "completion_date": datetime.now(),
           "decisions_made": details.get("decisions", []),
           "challenges": details.get("challenges", []),
           "solutions": details.get("solutions", []),
           "deliverables": details.get("deliverables", [])
       })

       # Publish update
       await publisher.coordinate(f"Milestone {phase_id} complete - roadmap and PROJECT-MEMORY.json updated")
   ```

   **See:** `/.claude/agents/project-manager.md` for complete PROJECT-MEMORY.json guidelines

### Monitoring and Debugging

**Web Dashboard:** http://localhost:8001
- Real-time task queue visualization
- Agent status and heartbeats
- Task completion progress
- Error logs
- Message history

**Manual Monitoring:**
```bash
# Check task status
curl http://localhost:8001/tasks

# View coordination messages
curl http://localhost:8001/messages/coordination

# Check agent health
curl http://localhost:8001/agents
```

**NATS CLI:**
```bash
# View stream
nats stream info MJ_ONLINE_WORK

# Subscribe to all messages
nats sub "mjwork.>"

# Publish test message
nats pub mjwork.coordination "Test message"
```

### Starting the NATS System

**Before running agents:**
```bash
# Terminal 1: Start NATS server (if not already running)
nats-server -js

# Terminal 2: Start FastAPI coordinator
cd /Users/michaeljones/Dev/MJ_Online/agent_coordination
./start_server.sh

# Terminal 3: Verify system
curl http://localhost:8001/health
```

**Dashboard:** Open http://localhost:8001 to monitor

### Quick Reference

**Agent Startup Checklist:**
- ✅ Import WorkerClient from agent_coordination.client
- ✅ Register with descriptive name
- ✅ Subscribe to mjwork.tasks.available
- ✅ Enable heartbeat (automatic in WorkerClient)
- ✅ Claim tasks before starting work
- ✅ Report completion with results
- ✅ Publish to coordination channel for major updates

**Project Manager Checklist:**
- ✅ Subscribe to mjwork.tasks.completed
- ✅ Update roadmap file when tasks complete
- ✅ Publish roadmap updates to mjwork.roadmap
- ✅ Mark tasks as "testing" when ready_for_testing: true
- ✅ Coordinate with team on coordination channel
- ✅ Monitor errors channel and help blocked agents

### Example: Complete Agent Implementation

See `/agent_coordination/test_agent.py` for a working example of an agent that:
1. Connects to NATS
2. Registers itself
3. Claims tasks
4. Reports progress
5. Completes tasks
6. Handles errors gracefully

**Documentation:** `/agent_coordination/QUICKSTART.md`
