# 🚀 Agent Coordination System - Quick Start

## ✅ System is LIVE and OPERATIONAL!

**Dashboard:** http://localhost:8001
**API Docs:** http://localhost:8001/docs
**Health Check:** http://localhost:8001/health

---

## What Just Got Built

A complete NATS JetStream-based agent coordination system that allows autonomous agents to:
1. Subscribe to a task queue via NATS
2. Claim tasks autonomously
3. Execute work
4. Report completion
5. Coordinate with other agents

All in real-time with persistent storage!

---

## Quick Test (3 Commands)

### Terminal 1: View Dashboard
```bash
open http://localhost:8001
# Watch tasks appear and get claimed in real-time!
```

### Terminal 2: Publish Tasks
```bash
cd agent_coordination
source venv/bin/activate

# Publish roadmap tasks
python publish_task.py "5" "Research Ghost themes" "Research and document Ghost theme options"
python publish_task.py "6" "Draft About page" "Draft About page content with AI emphasis"
python publish_task.py "7" "Draft Resume" "Draft Resume/CV structure"
```

### Terminal 3: Launch Agent
```bash
cd agent_coordination
source venv/bin/activate

python test_agent.py "Agent-Alpha"
# Watch it claim and complete tasks!
```

---

## Launch Autonomous Agents (The Real Deal)

Now that the infrastructure works, launch autonomous Claude Code agents:

```python
# In Claude Code, use Task tool:

prompt = """
You are Agent Alpha for MJ_Online.

Connect to the coordination system:
1. Import: from agent_coordination.client import WorkerClient
2. Base URL: http://localhost:8001

Your workflow:
async with WorkerClient("Agent-Alpha", "http://localhost:8001") as client:
    # Register
    await client.register(description="Research and documentation specialist")

    # Get available tasks
    tasks = await client.get_available_tasks()

    # For each task:
    for task in tasks:
        # Check not blocked
        if task['blocked_by']:
            continue

        # Claim it
        await client.claim_task(task['task_id'])

        # Execute the work in task['description']
        # ... do the actual work ...

        # Complete it
        await client.complete_task(
            task['task_id'],
            result={"status": "done", "output": "..."}
        )

    # Send status updates
    await client.send_coordination_message("Finished my work!")

Start by connecting and looking for available tasks.
"""

# Launch multiple agents in parallel!
```

---

## System Architecture

```
┌──────────────┐
│   NATS       │  ← Message broker (port 4222)
│  JetStream   │  ← 7-day persistent storage
└──────┬───────┘
       │
┌──────▼───────┐
│   FastAPI    │  ← REST API (port 8001)
│   Server     │  ← Agent coordination logic
└──────┬───────┘
       │
       ├─→ Dashboard (http://localhost:8001)
       ├─→ API Docs (http://localhost:8001/docs)
       │
       └─→ Agents (via Python client library)
```

---

## What's Running Right Now

**NATS Server:** localhost:4222 ✅
**FastAPI Server:** localhost:8001 ✅
**Stream:** MJ_ONLINE_WORK ✅
**Subjects:**
- mjwork.tasks.available
- mjwork.tasks.claimed
- mjwork.tasks.completed
- mjwork.coordination
- mjwork.errors

---

## Publishing Tasks from Roadmap

```python
from agent_coordination.client import TaskPublisher
from agent_coordination.models import Task
import asyncio

async def publish_roadmap_tasks():
    async with TaskPublisher() as publisher:
        # From plans/roadmap-ghost-pro.md
        tasks = [
            {
                "task_id": "5",
                "title": "Research Ghost themes",
                "description": "Research and document Ghost theme options...",
                "status": "available",
                "blocked_by": [],
                "priority": "high"
            },
            {
                "task_id": "6",
                "title": "Draft About page",
                "description": "Draft About page content emphasizing AI/ML...",
                "status": "available",
                "blocked_by": [],
                "priority": "high"
            },
            # ... more tasks
        ]

        for task_data in tasks:
            task = Task(**task_data)
            await publisher.publish_task(task.model_dump(mode='json'))
            print(f"Published: {task.title}")

asyncio.run(publish_roadmap_tasks())
```

---

## Monitoring

### Web Dashboard
- **URL:** http://localhost:8001
- **Auto-refreshes** every 5 seconds
- Shows:
  - Available tasks count
  - In-progress tasks
  - Completed tasks
  - Active agents
  - Task history

### API Endpoints
```bash
# Get all tasks
curl http://localhost:8001/api/tasks

# Get available tasks only
curl http://localhost:8001/api/tasks/available

# Get specific task
curl http://localhost:8001/api/tasks/5

# Get registered agents
curl http://localhost:8001/api/agents

# Health check
curl http://localhost:8001/health
```

### NATS CLI
```bash
# View stream info
nats stream info MJ_ONLINE_WORK

# Subscribe to all messages
nats sub "mjwork.>"

# Subscribe to tasks only
nats sub "mjwork.tasks.>"

# View message history
nats stream view MJ_ONLINE_WORK
```

---

## Next Steps

### 1. Publish All Roadmap Tasks
Create a script to publish all Phase 1-3 tasks from the roadmap.

### 2. Launch Multiple Agents
Launch Agent Alpha, Beta, Gamma in parallel to work through tasks.

### 3. Monitor Progress
Watch the dashboard at http://localhost:8001 as agents work.

### 4. Iterate
- Tasks get claimed
- Agents execute
- Results get published
- New tasks become available
- Agents continue automatically

---

## Stopping the System

```bash
# Stop FastAPI server
pkill -f "python server.py"

# Stop NATS server (if you want to)
pkill -f "nats-server"
```

## Restarting

```bash
cd agent_coordination
./start_server.sh
# That's it! System is back up.
```

---

## Files Created

```
agent_coordination/
├── __init__.py           # Package init
├── models.py             # Data models (Task, Message, etc.)
├── nats_client.py        # NATS JetStream client
├── client.py             # Python SDK (WorkerClient, TaskPublisher, MonitorClient)
├── server.py             # FastAPI server
├── setup.sh              # Initial setup
├── create_stream.sh      # Create NATS stream
├── start_server.sh       # Start system
├── test_agent.py         # Test agent example
├── publish_task.py       # Task publishing script
├── requirements.txt      # Python dependencies
├── static/
│   └── index.html        # Web dashboard
├── venv/                 # Virtual environment
├── server.log            # Server logs
├── README.md             # Full documentation
└── QUICKSTART.md         # This file
```

---

## Success! 🎉

You now have a production-ready agent coordination system using:
- ✅ NATS JetStream for messaging
- ✅ FastAPI for REST API
- ✅ Python client library for agents
- ✅ Web dashboard for monitoring
- ✅ 7-day message persistence
- ✅ Real-time task queue
- ✅ Multi-agent coordination

**Total setup time:** ~1.5 hours
**Result:** Autonomous agent infrastructure ready for MJ_Online project!

---

**Open the dashboard now:** http://localhost:8001
