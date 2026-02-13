# Interactive Work Pattern for Autonomous Agents

**Created:** 2026-02-09
**Status:** ✅ Implemented in all agents

---

## Problem Solved

Agents were claiming tasks from NATS queue but couldn't execute real work because:
- Execute functions had placeholder logic (`await asyncio.sleep(2)`)
- Python async code cannot directly invoke Claude Code tools (Read, Write, WebSearch, etc.)
- No bridge between NATS coordination (Python) and actual work execution (Claude tools)

## Solution: Interactive Work Pattern

**Pattern:** Python async loop pauses and waits for agent to complete work using Claude Code tools, then captures results and reports to NATS.

### How It Works

#### 1. Task Detection & Instructions

When an agent's `listen_for_tasks()` loop detects a matching task, it calls the execute function:

```python
async for task in runner.listen_for_tasks():
    result = await execute_design_task(task, runner)  # or execute_html_conversion, execute_publishing_work
    await runner.complete_task(task["task_id"], result=result)
```

#### 2. Execute Function Pauses & Prompts

The execute function:
- Analyzes the task to understand work type
- Prints clear, specific instructions about what needs to be done
- Lists expected deliverables
- Pauses using `asyncio.get_event_loop().run_in_executor()` with `input()` prompts
- Waits for agent to respond

```python
async def execute_design_task(task, runner):
    # Update heartbeat
    await runner.heartbeat(status="busy", current_task=task_id)

    # Print specific instructions
    print("📋 WORK REQUIRED:")
    print("1. Read design system: /design/DESIGN-SYSTEM.md")
    print("2. Query RAG for accurate facts")
    print("3. Create PAGE_SPEC...")

    # Pause and wait for agent
    loop = asyncio.get_event_loop()
    work_summary = await loop.run_in_executor(None, input, "\n📝 Work summary: ")
    deliverables = await loop.run_in_executor(None, input, "📦 Deliverable paths: ")

    # Build result from responses
    result = {
        "summary": work_summary,
        "deliverables": deliverables.split(","),
        "ready_for_next_step": True
    }

    return result
```

#### 3. Agent Does Real Work

While the loop is paused, the agent (Debbie/Doc Brown/Alice) sees instructions in terminal and:
- Uses Claude Code tools (Read, Write, Grep, WebSearch, etc.)
- Reads design system, queries RAG, analyzes requirements
- Creates deliverables (PAGE_SPEC, HTML, published pages)
- Saves work using Write tool

#### 4. Agent Responds to Prompts

After completing work, agent types responses to the prompts:
- `Work summary`: Brief description of what was created
- `Deliverable paths`: File paths of created files (comma-separated)
- `Ready for next step`: Yes/no confirmation

#### 5. Loop Resumes & Reports

Python loop:
- Captures agent's responses
- Builds result dictionary
- Reports completion to NATS via `runner.complete_task()`
- Notifies next agent in workflow (Morgan orchestrates this)
- Returns to listening for next task

---

## Implementation Status

### ✅ Debbie (Web Design Agent)

**File:** `.claude/agents/web-design-agent.md`
**Function:** `execute_design_task(task, runner)`

**Prompts for:**
- Work summary
- Deliverable file paths (design specs)
- Ready for next step (yes/no)

**Instructions provided:**
- Read design system
- Query RAG for facts
- Create PAGE_SPEC
- Select images
- Save using Write tool

### ✅ Doc Brown (Mobiledoc/HTML Assembler)

**File:** `.claude/agents/mobiledoc-assembler.md`
**Function:** `execute_html_conversion(task, runner)`

**Prompts for:**
- Work summary
- Deliverable file paths (HTML files)
- Ready for publishing (yes/no)

**Instructions provided:**
- Locate and read PAGE_SPEC
- Convert to semantic HTML
- Validate HTML syntax
- Save to /content-drafts/
- Use only semantic elements

### ✅ Alice (Web Content Builder)

**File:** `.claude/skills/web-content-builder/SKILL.md`
**Function:** `execute_publishing_work(task, runner)`

**Prompts for:**
- Work summary
- Live page URL
- Number of images uploaded
- SEO metadata complete (yes/no)

**Instructions provided:**
- Read HTML from /content-drafts/
- Verify Ghost-hosted image URLs
- Load Ghost API credentials from .env
- Publish via Ghost Admin API with source=html
- Set SEO metadata (RAG-verified)
- Verify page is live

---

## Testing the Pattern

### Test 1: Design System Creation

```bash
# Terminal 1: Launch Debbie
# In Claude Code, tell Debbie: "Run autonomous mode"

# Terminal 2: Publish design task
cd /Users/michaeljones/Dev/MJ_Online/agent_coordination
python3 publish_test_task.py \
  --type design \
  --title "Create design system" \
  --description "Build complete design system for MikeJones.online"
```

**Expected behavior:**
1. Debbie claims task automatically
2. Prints instructions about what to create
3. Pauses and waits for input
4. You (Debbie) use Read/Write/WebSearch to create design system
5. You respond to prompts with what you created
6. Loop resumes, reports completion to NATS
7. Morgan publishes next task automatically

### Test 2: Full Workflow (Design → HTML → Publishing)

```bash
# Terminal 1: Debbie in autonomous mode
# Terminal 2: Doc Brown in autonomous mode
# Terminal 3: Alice in autonomous mode
# Terminal 4: Morgan in autonomous mode

# Terminal 5: Publish design task
python3 publish_test_task.py \
  --type design \
  --title "Design About page" \
  --description "Create visual design for About page"

# Watch the workflow execute:
# Debbie → claims → pauses → you work → completes → Morgan publishes HTML conversion task
# Doc Brown → claims → pauses → you work → completes → Morgan publishes publishing task
# Alice → claims → pauses → you work → completes → workflow done!
```

---

## Benefits

### ✅ Single Session Per Agent
- One terminal per agent
- Can communicate directly with user in same session
- Full conversation context maintained

### ✅ Real Work Execution
- Agents use actual Claude Code tools
- No placeholder logic
- Real files created, real API calls made

### ✅ Automatic Coordination
- Python handles NATS messaging
- Task claiming automatic
- Workflow handoffs automatic
- Heartbeat monitoring automatic

### ✅ Developer Experience
- Clear instructions printed for each task
- Agent knows exactly what to create
- Simple prompts for capturing results
- Immediate feedback loop

### ✅ Flexible & Extensible
- Easy to add new agents
- Simple to modify work instructions
- Can add validation, error handling
- Scales to complex workflows

---

## Code Pattern for New Agents

When creating a new autonomous agent, follow this pattern:

```python
async def execute_YOUR_WORK(task, runner):
    """
    Execute your specific work for a task.

    Bridges Python async NATS coordination with Claude Code tool usage.
    """
    task_id = task["task_id"]
    task_title = task["title"]
    task_description = task.get("description", "")

    # Update heartbeat
    await runner.heartbeat(
        status="busy",
        current_task=task_id,
        current_task_title=task_title
    )

    # Print task details
    print("\n" + "=" * 60)
    print("🔧 YOUR WORK NEEDED")
    print("=" * 60)
    print(f"\nTask ID: {task_id}")
    print(f"Title: {task_title}")
    print(f"Description: {task_description}\n")

    # Provide specific work instructions
    print("📋 WORK REQUIRED:")
    print("1. Step one - use Read tool to...")
    print("2. Step two - use WebSearch to...")
    print("3. Step three - use Write tool to...")
    print("\nExpected deliverable: /path/to/output.md\n")

    # Pause and wait for agent to complete work
    print("=" * 60)
    print("⏸️  LOOP PAUSED - Waiting for you to complete the work")
    print("=" * 60)

    # Collect responses
    loop = asyncio.get_event_loop()
    work_summary = await loop.run_in_executor(None, input, "\n📝 Work summary: ")
    deliverables = await loop.run_in_executor(None, input, "📦 Deliverables (comma-separated): ")
    ready = await loop.run_in_executor(None, input, "✅ Ready for next step? (yes/no): ")

    # Build result
    result = {
        "summary": work_summary or f"Completed {task_title}",
        "deliverables": [d.strip() for d in deliverables.split(",") if d.strip()],
        "ready_for_next_step": ready.lower().startswith("y"),
        "task_id": task_id,
        "completed_by": "Your-Agent-Name"
    }

    # Report completion
    print(f"\n✅ Work captured! Reporting completion to NATS...")
    return result
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  NATS JetStream (localhost:4222)                            │
│  Task Queue: mjwork.tasks.available                         │
└─────────────────────────────────────────────────────────────┘
                          ▲           ▼
                          │           │
                   claims │           │ publishes
                          │           │ next task
┌─────────────────────────┴───────────┴─────────────────────┐
│  Morgan (Project Manager - Orchestrator)                   │
│  - Monitors completions                                    │
│  - Publishes next tasks in workflow                        │
└────────────────────────────────────────────────────────────┘
                          ▲
                          │ reports completion
                          │
┌─────────────────────────┴─────────────────────────────────┐
│  Agent Terminal Session (Debbie / Doc / Alice)            │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Python Async NATS Loop                              │ │
│  │  - Connects to NATS                                  │ │
│  │  - Claims tasks automatically                        │ │
│  │  - Calls execute function                            │ │
│  │  - Reports completion                                │ │
│  └───────────────┬──────────────────────────────────────┘ │
│                  │ pauses                                 │
│                  ▼                                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Interactive Work Execution                          │ │
│  │  - Prints instructions                               │ │
│  │  - Waits for input (prompts)                         │ │
│  │                                                       │ │
│  │  You (Agent) use Claude Code tools:                  │ │
│  │  - Read, Write, Grep, WebSearch                      │ │
│  │  - Do actual work                                    │ │
│  │  - Respond to prompts                                │ │
│  │                                                       │ │
│  │  Loop resumes, captures responses                    │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Test the pattern** with a real design task
2. **Iterate on instructions** if agents need more clarity
3. **Add validation** to execute functions (check files exist, validate content)
4. **Enhance prompts** to capture more metadata if needed
5. **Document learnings** in agent memory files

---

**Status:** Ready for production use! 🚀
