# Autonomous Agents - Complete Setup Guide

## Quick Start

### Launch All Agents

```bash
# Terminal 1: Debbie (Design Agent)
python3 /Users/michaeljones/Dev/MJ_Online/agent_coordination/launch_debbie_autonomous.py

# Terminal 2: Doc Brown (Mobiledoc Assembler)
python3 /Users/michaeljones/Dev/MJ_Online/agent_coordination/launch_docbrown_autonomous.py

# Terminal 3: Alice (Web Content Builder)
python3 /Users/michaeljones/Dev/MJ_Online/agent_coordination/launch_alice_autonomous.py

# Terminal 4: Morgan (Project Manager/Orchestrator)
python3 /Users/michaeljones/Dev/MJ_Online/agent_coordination/launch_morgan_autonomous.py
```

### Test the Workflow

```bash
# Publish a design task
cd /Users/michaeljones/Dev/MJ_Online/agent_coordination
python3 publish_test_task.py \
  --type design \
  --title "Design About page" \
  --description "Create visual design for About page"
```

**What should happen:**
1. Debbie sees task → claims it → executes → reports completion
2. Morgan sees completion → publishes mobiledoc conversion task
3. Doc Brown sees task → claims it → converts → reports completion
4. Morgan sees completion → publishes publishing task
5. Alice sees task → claims it → publishes to Ghost → reports completion
6. Workflow complete!

---

## Architecture & Execution Model

### Current Status: Workflow Coordination ✅

**What Works:**
- ✅ Agents connect to NATS and listen for tasks
- ✅ Agents automatically claim matching tasks
- ✅ Agents report completion and notify next agent
- ✅ Workflow orchestration (Debbie → Doc Brown → Alice)
- ✅ Heartbeat monitoring every 30 seconds
- ✅ Dashboard shows real-time status

### Architectural Challenge: Real Work Execution ⚠️

**The Problem:**

The autonomous mode scripts run in **Python async loops**, but agents' actual work requires **Claude Code tools** (Read, Write, WebSearch, Grep, etc.) which aren't accessible from Python.

```
Python Script (autonomous_launcher.py)
├─ Can: Listen to NATS, claim tasks, report results
└─ Cannot: Use Read, Write, WebSearch, or other Claude Code tools
```

**Current State:**
- Agents have **placeholder execution** (simulates work with `await asyncio.sleep(2)`)
- Workflow coordination works perfectly
- Actual content creation requires manual execution

### Solution Options

#### Option A: Hybrid Manual Execution (Current Recommendation)

**How it works:**
1. Autonomous script claims task and prints work requirements
2. Agent (you or Debbie in interactive mode) sees the requirements
3. Agent executes work using Claude Code tools manually
4. Saves results to specified location
5. Autonomous script reports completion

**Pros:**
- ✅ Workflow coordination is automatic
- ✅ Agents know what to work on
- ✅ Work quality remains high (human-in-loop or interactive Claude)
- ✅ Simple architecture

**Cons:**
- ❌ Not fully autonomous (requires manual execution step)

#### Option B: Exit-and-Execute Pattern

**How it works:**
1. Autonomous script claims task
2. Saves task details to file (`.debbie_current_task.json`)
3. Exits to clear context
4. Launches Debbie in execution mode (via Task tool or separate session)
5. Debbie reads task file, does work using Claude Code tools
6. Saves results and reports completion
7. Relaunches autonomous mode to listen for next task

**Pros:**
- ✅ Context management (fresh context per task)
- ✅ Real tool execution possible

**Cons:**
- ❌ Complex orchestration
- ❌ Requires relaunch between tasks

#### Option C: Task File + Watcher Pattern

**How it works:**
1. Autonomous script claims task, writes to `.current_task.json`
2. Keeps running, monitoring for `.task_complete.json`
3. Separate Debbie session (interactive) watches for `.current_task.json`
4. Executes work when task file appears
5. Writes `.task_complete.json` when done
6. Autonomous script sees completion, reports to NATS

**Pros:**
- ✅ Autonomous loop stays running
- ✅ Real work execution possible
- ✅ Clean separation of concerns

**Cons:**
- ❌ Requires two sessions per agent
- ❌ File-based coordination

---

## Current Implementation: Placeholder Execution

All autonomous launchers currently use **placeholder execution**:

```python
# Simulated work
await asyncio.sleep(2)

result = {
    "summary": "Task completed (placeholder)",
    "deliverables": ["output-file.md"],
    "note": "Placeholder execution - real work needs implementation"
}
```

This is sufficient for:
- ✅ Testing workflow coordination
- ✅ Verifying NATS integration
- ✅ Validating task handoffs
- ✅ Monitoring agent health

But NOT sufficient for:
- ❌ Actually creating design systems
- ❌ Actually converting to Mobiledoc
- ❌ Actually publishing to Ghost

---

## Recommended Workflow (Current State)

### 1. Use Autonomous Mode for Coordination

Launch all agents in autonomous mode to handle:
- Task claiming
- Workflow orchestration
- Status reporting
- Heartbeat monitoring

### 2. Execute Real Work Interactively

When an agent claims a task, you see the requirements printed. Then:

**For Debbie (Design Work):**
```
Terminal 1: Debbie autonomous (claims task, prints requirements)
Terminal 2: Debbie interactive (you tell her to do the actual design work)
```

**For Doc Brown (Mobiledoc Conversion):**
```
Terminal: Doc Brown autonomous (claims task, prints requirements)
You: Open Doc Brown's agent definition, give him the PAGE_SPEC to convert
```

**For Alice (Publishing):**
```
Terminal: Alice autonomous (claims task, prints requirements)
You: Open Alice's session, tell her to publish the Mobiledoc JSON
```

### 3. Manual Completion Reporting

After work is done manually, the result file exists. Autonomous script detects it and reports completion.

OR: Skip autonomous mode for execution-heavy tasks and just use Morgan to coordinate + agents to execute interactively.

---

## Alternative: Simplified Workflow

**Terminal 1: Morgan (Interactive)**
- You chat with Morgan
- Morgan publishes tasks to NATS

**Terminal 2: Debbie (Interactive)**
- You tell Debbie to watch for design tasks
- She claims and executes using her tools
- Reports completion to Morgan

**Terminal 3: Doc Brown (Interactive)**
- Watches for mobiledoc tasks
- Executes and reports

**Terminal 4: Alice (Interactive)**
- Watches for publishing tasks
- Executes and reports

This hybrid approach:
- Uses NATS for coordination
- Uses interactive sessions for execution
- Best of both worlds

---

## Files Created

```
agent_coordination/
├── launch_debbie_autonomous.py      # Debbie autonomous launcher
├── launch_debbie_autonomous_v2.py   # V2 with workflow outlines
├── launch_docbrown_autonomous.py    # Doc Brown autonomous launcher
├── launch_alice_autonomous.py       # Alice autonomous launcher
├── launch_morgan_autonomous.py      # Morgan orchestrator
├── publish_test_task.py             # Test task publisher
└── AUTONOMOUS-AGENTS-USAGE.md       # This file
```

---

## Next Steps

### Immediate (Testing)

1. ✅ Launch all agents in autonomous mode
2. ✅ Publish test task
3. ✅ Verify workflow coordination
4. ✅ Confirm agents claim and report tasks
5. ✅ Validate Morgan orchestrates next steps

### Short-Term (Real Work Integration)

Choose one of the solution options above and implement:

**Option A (Recommended):** Keep autonomous mode for coordination, execute work interactively
**Option B:** Implement exit-and-execute pattern with context management
**Option C:** Implement task file watcher pattern

### Long-Term (Full Automation)

Research ways to:
- Bridge Python async code with Claude Code tool execution
- Create agent subprocess invocation mechanism
- Develop Claude Code API for programmatic agent control

---

## Support

**Dashboard:** http://localhost:8001
**Task Queue:** `curl http://localhost:8001/api/tasks`
**Agent Status:** `curl http://localhost:8001/api/agents`
**Messages:** http://localhost:8001/messages.html

For questions or issues, refer to:
- `/agent_coordination/AUTONOMOUS-AGENTS-GUIDE.md`
- `/agent_coordination/AUTONOMOUS-AGENTS-IMPLEMENTATION-SUMMARY.md`
- This file

---

## Summary

**What's Working:**
- ✅ Full autonomous workflow coordination
- ✅ Task claiming and distribution
- ✅ Agent-to-agent handoffs
- ✅ Heartbeat monitoring
- ✅ Dashboard visibility

**What Needs Work:**
- ⚠️ Real work execution (architectural challenge)
- ⚠️ Tool integration (Python ↔ Claude Code bridge)
- ⚠️ Context management for long-running sessions

**Bottom Line:**
The autonomous coordination infrastructure is **production-ready**. Actual work execution requires either manual steps or architectural enhancements to bridge Python and Claude Code tools.
