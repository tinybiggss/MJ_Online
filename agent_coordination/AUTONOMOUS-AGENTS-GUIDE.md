# Autonomous Agents Guide

Guide for running agents in autonomous NATS mode where they listen for work and automatically execute tasks.

## Overview

**Autonomous mode** allows agents to:
- Run as long-lived processes in terminal windows
- Connect to NATS and listen for work assignments
- Automatically claim and execute tasks matching their capabilities
- Report completion back to Morgan (PM)
- Notify the next agent in the workflow
- Send heartbeats every 30 seconds for health monitoring

## Architecture

```
Terminal 1: Debbie (listening)
Terminal 2: Doc Brown (listening)
Terminal 3: Alice (listening)
Terminal 4: Morgan/PM (orchestrating)

Morgan creates task → Publishes to NATS
  ↓
Debbie sees task → Claims it → Executes → Reports completion
  ↓
Morgan notifies Doc Brown
  ↓
Doc Brown sees notification → Claims task → Executes → Reports
  ↓
Morgan notifies Alice
  ↓
Alice publishes to Ghost → Reports completion
  ↓
Morgan updates roadmap
```

## Quick Start

### 1. Start NATS Infrastructure

```bash
# Terminal: NATS Server
nats-server -js

# Terminal: FastAPI Coordinator
cd /Users/michaeljones/Dev/MJ_Online/agent_coordination
./start_server.sh

# Verify running
curl http://localhost:8001/health
```

### 2. Test with Demo Agent

```bash
cd /Users/michaeljones/Dev/MJ_Online/agent_coordination

# Start demo agent (simulates Debbie)
python demo_autonomous_agent.py --agent debbie

# You should see:
# ✅ Debbie registered with NATS
# 💓 Heartbeat loop started for Debbie
# 🎧 Debbie ready and listening for work...
```

### 3. Publish a Test Task

In another terminal or via Morgan:

```python
from agent_coordination.client import TaskPublisher
import asyncio

async def publish_test():
    async with TaskPublisher() as pub:
        await pub.publish_task({
            "task_id": "design-001",
            "title": "Design About page layout",
            "description": "Create visual design for About page with hero section",
            "type": "design",  # Debbie watches for this type
            "status": "available",
            "priority": "high"
        })

asyncio.run(publish_test())
```

Debbie should automatically:
1. See the task
2. Claim it
3. Execute the work
4. Report completion
5. Notify the next agent (Doc Brown)

## How It Works

### Agent Configuration (`agent_configs.py`)

Each agent has a config defining:
- **Task types** - Explicit types to watch for (`design`, `mobiledoc`, `publishing`)
- **Keywords** - Terms to match in task title/description
- **Next agent** - Who to notify after completion

```python
AGENT_CONFIGS = {
    "debbie": {
        task_types: ["design", "page_spec"],
        keywords: ["design", "page", "layout", "visual"],
        next_agent: "mobiledoc-assembler"
    }
}
```

### Agent Runner Library (`agent_runner.py`)

Provides the autonomous listening loop:

```python
from agent_coordination.agent_runner import AgentRunner

runner = AgentRunner("debbie")
await runner.start()  # Connect to NATS, start heartbeat

# Listen for matching tasks
async for task in runner.listen_for_tasks():
    # Do the work
    result = await do_design_work(task)

    # Report completion (auto-notifies next agent)
    await runner.complete_task(task["task_id"], result)
```

## Integrating with Real Agents

### Option 1: Agent Definition Integration (Recommended)

Add startup instructions to agent `.md` files:

```markdown
# Agent: Debbie

## Autonomous Mode Startup

When started in autonomous mode, execute this code:

\`\`\`python
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.agent_runner import AgentRunner
import asyncio

async def run_autonomous():
    runner = AgentRunner("debbie")
    await runner.start()

    async for task in runner.listen_for_tasks():
        # Execute normal design work
        result = await execute_design_task(task)
        await runner.complete_task(task["task_id"], result)

asyncio.run(run_autonomous())
\`\`\`

## Work Execution Logic

When a task arrives, execute these steps:
1. Read task description and requirements
2. Query RAG knowledge base
3. Create design specification
4. Save deliverables
5. Return result
```

### Option 2: Wrapper Script

Create a Python script that the agent runs:

```python
# agents/debbie_autonomous.py

import asyncio
from agent_coordination.agent_runner import AgentRunner

async def execute_design_work(task):
    """Execute Debbie's design work."""
    # Agent's actual work logic here
    return {"summary": "Design completed", "files": [...]}

async def main():
    runner = AgentRunner("debbie")
    await runner.start()

    async for task in runner.listen_for_tasks():
        result = await execute_design_work(task)
        await runner.complete_task(task["task_id"], result)

if __name__ == "__main__":
    asyncio.run(main())
```

Then launch via Task tool:
```
Task tool → "Run agents/debbie_autonomous.py"
```

## Morgan/PM Workflow Orchestration

Morgan needs to:

1. **Publish Tasks** when work is ready
2. **Monitor Completions** via coordination channel
3. **Update Roadmap** when tasks complete
4. **Notify Next Agent** in workflow

Example Morgan code:

```python
from agent_coordination.client import TaskPublisher, MonitorClient
import asyncio

async def orchestrate_workflow():
    async with TaskPublisher() as pub, MonitorClient() as mon:
        # Publish design task
        await pub.publish_task({
            "task_id": "about-page-design",
            "title": "Design About page",
            "type": "design",
            "status": "available"
        })

        # Wait for completion (via coordination messages)
        # Then publish next task
        await pub.publish_task({
            "task_id": "about-page-mobiledoc",
            "title": "Convert About page design to Mobiledoc",
            "type": "mobiledoc_conversion",
            "status": "available"
        })
```

## Dashboard Monitoring

Open dashboard to see real-time status:
- **URL:** http://localhost:8001
- **Agents:** Shows registered agents, heartbeats, current tasks
- **Tasks:** Shows queue status (available, claimed, completed)
- **Messages:** View coordination and error messages

## Workflow Example

### Complete About Page Workflow

**Setup (4 terminals):**
```bash
# Terminal 1
python demo_autonomous_agent.py --agent debbie

# Terminal 2
python demo_autonomous_agent.py --agent mobiledoc-assembler

# Terminal 3
python demo_autonomous_agent.py --agent web-content-builder

# Terminal 4
# Run Morgan/PM agent
```

**Workflow:**
1. Morgan publishes design task
2. Debbie claims → designs → reports completion
3. Debbie notifies Doc Brown
4. Doc Brown claims → converts → reports completion
5. Doc Brown notifies Alice
6. Alice claims → publishes → reports completion
7. Morgan updates roadmap

**All automatic - no manual intervention needed!**

## Troubleshooting

### Agent not seeing tasks

Check:
- ✅ NATS server running (`nats-server -js`)
- ✅ FastAPI coordinator running (http://localhost:8001/health)
- ✅ Task type matches agent's filter
- ✅ Task status is "available" (not already claimed)

### Heartbeat warnings

If dashboard shows missing heartbeats:
- Agent may have crashed
- Check agent terminal for errors
- Restart agent if needed

### Tasks stuck in "claimed" state

- Agent claimed but didn't complete
- Check agent terminal for errors
- Manually update task status if needed

## Testing Checklist

Before rolling out to production:

- [ ] Demo agent can connect and listen
- [ ] Demo agent can claim and execute task
- [ ] Heartbeats appear in dashboard
- [ ] Completion notifications work
- [ ] Next agent receives notification
- [ ] Error handling works (simulate failure)
- [ ] Multiple agents can run simultaneously
- [ ] Roadmap updates after completion

## Next Steps

1. Test demo agent thoroughly
2. Integrate with one real agent (Debbie)
3. Test end-to-end: Morgan → Debbie → Doc Brown → Alice
4. Update agent definitions with autonomous mode instructions
5. Document for team
6. Roll out to all agents

## Files

- **agent_configs.py** - Agent capability definitions
- **agent_runner.py** - Autonomous listening loop library
- **demo_autonomous_agent.py** - Test/demo agent
- **AUTONOMOUS-AGENTS-GUIDE.md** - This guide

## Support

For issues or questions:
- Check dashboard: http://localhost:8001
- View logs in agent terminal
- Check NATS messages: http://localhost:8001/messages.html
- Review agent_coordination/server.log
