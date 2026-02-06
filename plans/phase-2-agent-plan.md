# Phase 2 Agent Execution Plan

**Project Manager:** Project-Manager-Claude
**Date:** 2026-01-30
**Scope:** Phase 2.2-2.6 (Theme & Design Configuration)

---

## Phase 2 Task Overview

### Completed
- ✅ Phase 2.1: Theme Selection & Installation (Kyoto theme)

### Ready to Execute (All can run in parallel)

| Phase | Task | Effort | Type |
|-------|------|--------|------|
| 2.2 | Visual Design Customization | 2-4 hrs | Ghost Admin Config |
| 2.3 | Navigation & Menu Configuration | 30-60 min | Ghost Admin Config |
| 2.4 | ActivityPub Configuration | 30 min | Ghost Admin Config |
| 2.5 | Analytics Setup | 30 min-1 hr | Ghost Admin Config |
| 2.6 | Code Injection & Custom Features | 1-2 hrs | Custom Code |

**Additional:**
- Task #3: Review Agent-Gamma content drafts against RAG

---

## Existing Agent Analysis

### Available from Personal Level (`~/.claude/agents/`)

| Agent | Definition | Applicable? |
|-------|-----------|-------------|
| **Business-analyst.md** | ✅ Active | Yes - already registered |
| **Project-Manager.md** | ✅ Active | Yes - that's me! |
| notion-developer.md | Notion-specific | No |
| requirements-rubric-reviewer.md | Requirements review | No |
| web-requirements-collector.md | Requirements gathering | No |

### Available from Agentic SDLC (`~/Dev/Agentic_SDLC/agents/`)

| Agent | Capabilities | Applicable? |
|-------|--------------|-------------|
| **content_agent.py** | Documentation, content creation, validation | ✅ **YES** - Task #3 |
| coordinator_agent.py | Agent coordination | No (PM handles this) |
| database_agent.py | Database work | No |
| integration_agent.py | API integrations | Maybe - for analytics |
| logic_agent.py | Business logic | No |
| qa_agent.py | QA and testing | Maybe - Phase 5 |
| ui_agent.py | UI design | Partial - focuses on design, not Ghost config |

---

## Agent Mapping to Phase 2 Tasks

### ✅ Can Use Existing Skills & Agents

**1. Web Content Builder Skill** ⭐ PRIMARY AGENT
- **Location:** `.claude/skills/web-content-builder/`
- **Use for:** ALL Phase 2 tasks (2.2-2.6) + Task #3
- **Built-in capabilities:**
  - ✅ Ghost Pro expert (publishing, navigation, code injection)
  - ✅ RAG knowledge base integration (verifies Mike Jones facts)
  - ✅ Content strategy and SEO optimization
  - ✅ ActivityPub/Fediverse management
  - ✅ Professional terminology standards enforced
- **NATS Integration:** Can be wrapped as "Web-Content-Builder-Agent"

**Tasks this skill handles:**
- ✅ Task #3: Validate Agent-Gamma content (RAG verification built-in!)
- ✅ Phase 2.2: Visual Design Customization (Ghost theme config)
- ✅ Phase 2.3: Navigation Configuration (Ghost navigation expert)
- ✅ Phase 2.4: ActivityPub Configuration (Fediverse management)
- ✅ Phase 2.5: Analytics Setup (content strategy)
- ✅ Phase 2.6: Code Injection (CSS/JS for Ghost)

**Why This is Better:**
- Single agent handles all Phase 2 work (simpler coordination)
- RAG validation built-in (no separate content validation agent needed)
- Already knows Ghost Pro workflows
- Enforces Mike Jones terminology standards
- Proven skill in this codebase

### ⚠️ Optional: Specialized Agents (if web-content-builder needs help)

**2. UI/Design Specialist** (only if heavy CSS/design work needed)
- **Use:** `ui_agent.py` (Agentic SDLC)
- **Reason:** Complement web-content-builder for complex visual design

**3. QA/Testing Agent** (for Phase 5 - Testing)
- **Use:** `qa_agent.py` (Agentic SDLC)
- **Reason:** Test all configurations before launch

---

## Recommended Approach: Use Web Content Builder Skill

**REVISED RECOMMENDATION:** Use the existing `web-content-builder` skill instead of creating new agents.

### Primary Agent: Web-Content-Builder-Agent (wrapper for skill)

**How to Use:**
The web-content-builder skill can be invoked as an agent through the Skill tool, or we can create a simple Python wrapper that:
1. Loads the web-content-builder skill instructions
2. Registers with NATS as "Web-Content-Builder-Agent"
3. Claims Phase 2 tasks from the queue
4. Executes using skill's built-in Ghost Pro workflows
5. Reports back to Project Manager

**Advantages:**
- ✅ All-in-one: Handles content validation + Ghost config + code injection
- ✅ RAG verification built-in (no separate validation needed)
- ✅ Ghost Pro expert (navigation, ActivityPub, analytics, code injection)
- ✅ Terminology standards enforced
- ✅ Single terminal instead of 3
- ✅ Faster execution (no context switching between agents)

**Disadvantages:**
- Single point of failure (but can be restarted)
- Can't parallelize Phase 2 tasks (but they're sequential anyway in Ghost Admin)

---

## ALTERNATIVE: If New Agents Still Needed

### Agent 1: Ghost-Configuration-Agent (DEPRECATED - use web-content-builder instead)

**Purpose:** Configure Ghost Pro settings via admin interface

**Capabilities:**
- Browser automation for Ghost Admin panel
- Theme customization (colors, fonts, layouts)
- Navigation menu configuration
- ActivityPub/Fediverse settings
- Analytics integration

**Tasks:**
- Phase 2.2: Visual Design Customization
  - Configure brand colors, typography, dark mode
  - Upload assets (logo, cover images)
  - Set up color palette for AI-forward aesthetic

- Phase 2.3: Navigation Configuration
  - Set up primary navigation (Home, About, Projects, Resume, Contact)
  - Configure secondary navigation (footer)
  - Test mobile menu

- Phase 2.4: ActivityPub Configuration
  - Enable ActivityPub in Ghost settings
  - Configure @mike@MikeJones.online handle
  - Set up profile bio, avatar, header image

- Phase 2.5: Analytics Setup
  - Decide: Ghost built-in vs external (Plausible)
  - Configure analytics events
  - Verify GDPR compliance

**Tools Required:**
- Browser automation (Claude in Chrome MCP tools)
- Read/Write for documentation
- NATS coordination client

**Deliverables:**
- Ghost settings configured per Phase 2.2-2.5 specs
- Configuration documented in `/plans/ghost-configuration-log.md`
- Screenshots of settings for verification

**NATS Integration:**
```python
async with WorkerClient('Ghost-Configuration-Agent') as worker:
    await worker.register(
        description='Ghost Pro admin configuration specialist - theme, navigation, ActivityPub, analytics',
        capabilities=['browser-automation', 'ghost-admin', 'theme-customization', 'analytics-setup']
    )
```

---

### Agent 2: Custom-Code-Agent

**Purpose:** Create custom CSS/JS for Ghost code injection

**Capabilities:**
- CSS for AI project styling
- JavaScript for custom interactions
- Schema.org structured data
- Ghost code injection configuration

**Tasks:**
- Phase 2.6: Code Injection & Custom Features
  - Create custom CSS for AI project badges/tags
  - Add Schema.org Person structured data for Mike Jones
  - Inject custom fonts (if needed beyond theme)
  - Add any custom JavaScript for enhanced features
  - Document all code injection

**Tools Required:**
- Read/Write for code files
- Browser automation for testing
- NATS coordination client

**Deliverables:**
- CSS file: `/assets/custom-styles.css`
- JS file: `/assets/custom-scripts.js` (if needed)
- Schema.org JSON-LD for Person entity
- Code injection documented in `/plans/code-injection-guide.md`

**NATS Integration:**
```python
async with WorkerClient('Custom-Code-Agent') as worker:
    await worker.register(
        description='Custom CSS/JS and code injection for Ghost Pro site',
        capabilities=['css-development', 'javascript', 'schema-org', 'code-injection']
    )
```

---

## Agent Execution Strategy (REVISED)

### ✅ RECOMMENDED: Single Agent Approach

**Use web-content-builder skill for all Phase 2 work:**

| Agent | Tasks | Estimated Time | Terminal |
|-------|------|----------------|----------|
| Web-Content-Builder-Agent | Task #3: Validate Agent-Gamma content | 30 min | Terminal 1 |
| Web-Content-Builder-Agent | Phase 2.2: Visual Design | 2-4 hrs | Terminal 1 (sequential) |
| Web-Content-Builder-Agent | Phase 2.3: Navigation | 30-60 min | Terminal 1 (sequential) |
| Web-Content-Builder-Agent | Phase 2.4: ActivityPub | 30 min | Terminal 1 (sequential) |
| Web-Content-Builder-Agent | Phase 2.5: Analytics | 30 min-1 hr | Terminal 1 (sequential) |
| Web-Content-Builder-Agent | Phase 2.6: Code Injection | 1-2 hrs | Terminal 1 (sequential) |

**Total Execution:**
- 1 terminal
- Wall clock time: 5-8 hours (all sequential)
- Simpler coordination (Project Manager just monitors one agent)

**Workflow:**
1. Start web-content-builder agent in Terminal 1
2. Agent registers with NATS as "Web-Content-Builder-Agent"
3. Agent claims and executes tasks in order: 3 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6
4. Project Manager monitors and updates roadmap as each task completes

---

### ⚠️ ALTERNATIVE: Multi-Agent Approach (if parallelization required)

**Only use if user prefers faster wall clock time with multiple terminals:**

| Agent | Task | Estimated Time | Terminal |
|-------|------|----------------|----------|
| Web-Content-Builder-Agent | Task #3 + Phase 2.2-2.5 | 4-6 hrs | Terminal 1 |
| Custom-Code-Agent | Phase 2.6: Code Injection | 1-2 hrs | Terminal 2 |

**Total Parallelization:**
- 2 terminals running simultaneously
- Wall clock time: 4-6 hours (longest path)
- More complex coordination

---

## Agent Definition Files to Create

### ✅ RECOMMENDED: Web-Content-Builder-Agent Wrapper

**Only one file needed!**

**Location:** `/Users/michaeljones/Dev/MJ_Online/agent_coordination/web_content_builder_agent.py`

**Purpose:** Python wrapper that:
1. Loads web-content-builder skill instructions
2. Connects to NATS coordination system
3. Claims Phase 2 tasks from queue
4. Executes using skill's Ghost Pro workflows
5. Reports progress to Project Manager

**Template:**
```python
"""
Web Content Builder Agent - Ghost Pro specialist with NATS integration.

Uses the web-content-builder skill instructions with NATS coordination.
Handles all Phase 2 configuration tasks and content validation.
"""

import asyncio
from agent_coordination.client import WorkerClient

class WebContentBuilderAgent:
    """Ghost Pro configuration and content expert."""

    def __init__(self, agent_name: str = "Web-Content-Builder-Agent"):
        self.agent_name = agent_name

    async def run(self):
        async with WorkerClient(self.agent_name) as worker:
            # Register
            await worker.register(
                description='Ghost Pro expert: content validation, theme config, navigation, ActivityPub, analytics, code injection',
                capabilities=['ghost-pro', 'rag-validation', 'content-strategy', 'browser-automation']
            )

            # Claim and execute tasks (implementation uses web-content-builder skill logic)
            # [Implementation details here]

if __name__ == "__main__":
    agent = WebContentBuilderAgent()
    asyncio.run(agent.run())
```

---

### ⚠️ ALTERNATIVE: Separate Agent Files (only if not using skill)

**If user prefers separate specialized agents instead:**

1. **Ghost-Configuration-Agent.md** - Ghost admin configuration
2. **Custom-Code-Agent.md** - Code injection
3. **content_validation_agent.py** - RAG validation

**(Not recommended - web-content-builder skill handles all of this)**

---

## NATS Integration Requirements

All agents must:

1. **Register on startup:**
   ```python
   from agent_coordination.client import WorkerClient

   async with WorkerClient('Agent-Name') as worker:
       await worker.register(
           description='Agent role description',
           capabilities=['capability1', 'capability2']
       )
   ```

2. **Claim tasks from queue:**
   ```python
   tasks = await worker.get_available_tasks(limit=10)
   for task in tasks:
       if task['task_id'] in ['2.2', '2.3', '2.4', '2.5', '2.6', '3']:
           await worker.claim_task(task['task_id'])
   ```

3. **Report progress:**
   ```python
   await worker.send_coordination_message(
       f"Agent-Name: Starting Phase 2.2 - Visual Design Customization"
   )
   ```

4. **Complete tasks:**
   ```python
   await worker.complete_task(task_id, result={
       'status': 'completed',
       'deliverables': ['file1.md', 'file2.css'],
       'notes': 'Configuration complete and tested'
   })
   ```

5. **Send heartbeats** (every 30s - automatic in WorkerClient)

---

## Task Queue Publishing

Project Manager will publish these tasks to NATS queue:

```python
# Task for Content Validation Agent
await publisher.publish_task({
    'task_id': '3',
    'title': 'Review and validate Agent-Gamma content drafts',
    'description': 'Validate /content-drafts/about-page.md and resume-cv.md against RAG knowledge base',
    'status': 'available',
    'priority': 'high',
    'blocked_by': []
})

# Task for Ghost Configuration Agent
await publisher.publish_task({
    'task_id': '2.2',
    'title': 'Visual Design Customization',
    'description': 'Configure Ghost brand colors, typography, dark mode. See roadmap Phase 2.2.',
    'status': 'available',
    'priority': 'high',
    'blocked_by': []
})

# [Repeat for 2.3, 2.4, 2.5, 2.6]
```

---

## User Action Items

### Step 1: Review This Plan
- ✅ Approve agent definitions
- ✅ Confirm parallelization strategy
- ✅ Verify NATS integration approach

### Step 2: Create Agent Definition Files

Create these files with full definitions (provided separately):

1. `/Users/michaeljones/.claude/agents/Ghost-Configuration-Agent.md`
2. `/Users/michaeljones/.claude/agents/Custom-Code-Agent.md`
3. `/Users/michaeljones/Dev/MJ_Online/agent_coordination/content_validation_agent.py`

### Step 3: Start Agent

**✅ RECOMMENDED: Single Terminal Approach**

**Terminal 1: Web Content Builder Agent**
```bash
cd /Users/michaeljones/Dev/MJ_Online

# Option A: Use Skill tool directly in Claude Code
# "Use the web-content-builder skill to claim and execute Phase 2 tasks"

# Option B: Use Python wrapper (if created)
source agent_coordination/venv/bin/activate
python agent_coordination/web_content_builder_agent.py
```

**OR ⚠️ ALTERNATIVE: Multiple Terminal Approach**

**Terminal 1: Web Content Builder (Phases 2.2-2.5 + Task 3)**
```bash
# Use skill or wrapper
python agent_coordination/web_content_builder_agent.py
```

**Terminal 2: Custom Code Agent (Phase 2.6)**
```bash
# Use Custom-Code-Agent definition if created separately
```

### Step 4: Monitor via Dashboard

**Dashboard:** http://localhost:8001
- Watch agents register
- Monitor task claims
- Track completion progress

### Step 5: Project Manager Coordinates

- Publishes tasks to queue
- Monitors agent status
- Updates roadmap as work completes
- Helps resolve blockers

---

## Success Criteria

**Phase 2 Complete When:**

- ✅ All 5 tasks completed (2.2, 2.3, 2.4, 2.5, 2.6)
- ✅ Task #3 (content validation) complete
- ✅ Ghost site fully configured with Kyoto theme
- ✅ @mike@MikeJones.online ActivityPub handle active
- ✅ Analytics tracking live
- ✅ Custom CSS/JS injected and tested
- ✅ Agent-Gamma content validated and corrected
- ✅ All configuration documented

**Ready for Phase 3:** Core Content Creation

---

## Next Steps

**Immediate (Now):**
1. User reviews this plan
2. User approves agent definitions
3. PM provides full agent definition files

**Next (After Approval):**
1. User creates agent definition files
2. PM publishes tasks to NATS queue
3. User starts agents in terminals
4. Agents register and claim tasks
5. PM coordinates and tracks progress

---

**Status:** ✅ Plan complete - awaiting user approval

**Project Manager:** Ready to provide full agent definition files upon approval.
