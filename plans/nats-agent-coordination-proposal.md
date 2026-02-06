# NATS Agent Coordination System for MJ_Online

## Analysis of Existing Agentic_SDLC System

Based on review of `/Users/michaeljones/Dev/Agentic_SDLC/agent_chat/`, here's what exists:

### Current Architecture

```
┌─────────────────┐
│   Agents        │
│  (Python SDK)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   FastAPI       │◄────►│    NATS      │
│   REST API      │      │  JetStream   │
│   Port: 8000    │      │  Port: 4222  │
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│   Web UI        │
│  (Dashboard)    │
└─────────────────┘
```

### Key Components

**NATS Server:**
- Running on `localhost:4222`
- JetStream enabled
- Stream: `AGENT_CHAT`
- Subjects: `agents.>` (wildcard for all agent messages)
- 30-day retention (720 hours)

**Channels:**
- `roadmap` 🗺️ - Project planning
- `coordination` 🔄 - Task distribution
- `errors` ⚠️ - Error reporting
- `general` 📢 - General chat

**FastAPI Server:**
- Port 8000
- REST API + WebSocket support
- Web dashboard at http://localhost:8000
- API docs at http://localhost:8000/docs

**Python Client Library:**
```python
from agent_chat.client import AgentChatClient

async with AgentChatClient("AgentName") as client:
    await client.register(description="Worker agent")
    await client.coordinate("Starting task X")
    await client.get_messages(channel="coordination", limit=50)
```

---

## Proposed Adaptation for MJ_Online

### Option A: Shared NATS, Separate Stream (RECOMMENDED)

**Architecture:**
```
                    ┌──────────────────┐
                    │   NATS Server    │
                    │   Port: 4222     │
                    │   (Shared)       │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐       ┌───────▼────────┐
        │ AGENT_CHAT     │       │ MJ_ONLINE_WORK │
        │ Stream         │       │ Stream         │
        │ (Agentic_SDLC) │       │ (MJ_Online)    │
        └───────┬────────┘       └───────┬────────┘
                │                         │
        ┌───────▼────────┐       ┌───────▼────────┐
        │   FastAPI      │       │   FastAPI      │
        │   Port: 8000   │       │   Port: 8001   │
        │ (Agentic_SDLC) │       │ (MJ_Online)    │
        └────────────────┘       └────────────────┘
```

**Benefits:**
- ✅ Reuse existing NATS server (no additional infrastructure)
- ✅ Separate streams prevent message mixing
- ✅ Different FastAPI ports (8000 vs 8001)
- ✅ Can monitor both projects from one NATS server
- ✅ Easy to set up (copy & modify existing code)

**Setup:**
1. Use existing NATS server on port 4222
2. Create new stream: `MJ_ONLINE_WORK`
3. New subject prefix: `mjwork.>` (instead of `agents.>`)
4. New FastAPI server on port 8001
5. Copy and adapt Python client library

**Channels for MJ_Online:**
- `tasks` - Task queue (available, claimed, completed)
- `coordination` - Agent coordination
- `errors` - Error reporting
- `status` - Agent health/heartbeat
- `results` - Task completion results

### Option B: Completely Separate NATS Instance

**Architecture:**
```
┌────────────────┐              ┌────────────────┐
│   NATS #1      │              │   NATS #2      │
│   Port: 4222   │              │   Port: 4223   │
│ (Agentic_SDLC) │              │  (MJ_Online)   │
└───────┬────────┘              └───────┬────────┘
        │                               │
        ▼                               ▼
┌───────────────┐              ┌────────────────┐
│   FastAPI     │              │   FastAPI      │
│   Port: 8000  │              │   Port: 8001   │
└───────────────┘              └────────────────┘
```

**Benefits:**
- ✅ Complete isolation between projects
- ✅ Independent configuration and tuning
- ✅ Can scale independently

**Drawbacks:**
- ❌ More resource usage (two NATS servers)
- ❌ More complex setup and management
- ❌ Overkill for development use case

---

## Recommended Implementation: Option A

**Why Option A:**
- Simpler setup (reuse existing NATS)
- Sufficient isolation via streams
- Easier monitoring (one NATS to watch)
- Cost-effective (single NATS process)

### Implementation Plan

#### Step 1: Create MJ_Online Agent Coordination Module

**Directory Structure:**
```
MJ_Online/
├── agent_coordination/
│   ├── __init__.py
│   ├── nats_client.py      # Adapted from Agentic_SDLC
│   ├── models.py           # Task-specific models
│   ├── client.py           # Python SDK for agents
│   ├── server.py           # FastAPI server (port 8001)
│   ├── task_queue.py       # Task queue management
│   ├── start_server.sh     # Startup script
│   ├── setup.sh            # Setup script
│   ├── requirements.txt    # Python deps
│   └── static/
│       └── index.html      # Web dashboard
```

#### Step 2: Configuration

**NATS Stream Setup:**
```bash
# Create MJ_ONLINE_WORK stream
nats stream add MJ_ONLINE_WORK \
    --subjects "mjwork.>" \
    --storage file \
    --retention limits \
    --max-age=168h \
    --defaults
```

**Subject Structure:**
```
mjwork.tasks.available       # Queue of available tasks
mjwork.tasks.claimed         # Tasks being worked on
mjwork.tasks.completed       # Completed tasks
mjwork.coordination          # Agent coordination messages
mjwork.errors                # Error messages
mjwork.heartbeat.{agentId}   # Agent health checks
```

#### Step 3: Task Queue Workflow

**Publishing Tasks:**
```python
# From main orchestrator (you/Claude Code)
from agent_coordination.client import TaskPublisher

publisher = TaskPublisher()
await publisher.publish_task({
    "task_id": "5",
    "title": "Research Ghost themes",
    "description": "...",
    "blocked_by": [],
    "priority": "high"
})
```

**Agents Claiming Tasks:**
```python
# In autonomous agent
from agent_coordination.client import WorkerClient

async with WorkerClient("Agent-Alpha") as worker:
    # Register
    await worker.register(description="Research specialist")

    # Subscribe to available tasks
    async for task in worker.watch_tasks():
        # Claim task
        await worker.claim_task(task["task_id"])

        # Do work
        result = await do_task_work(task)

        # Mark complete
        await worker.complete_task(task["task_id"], result)
```

**Monitoring Progress:**
```python
# Check task status
from agent_coordination.client import MonitorClient

monitor = MonitorClient()
status = await monitor.get_task_status("5")
# Returns: {"status": "in_progress", "owner": "Agent-Alpha", "started_at": "..."}
```

#### Step 4: Web Dashboard

**URL:** http://localhost:8001

**Features:**
- Real-time task queue visualization
- Agent status and heartbeats
- Task completion progress
- Error logs
- Message history

#### Step 5: Agent Integration

**Launch Autonomous Agents with NATS:**
```python
# Modified agent prompt
prompt = """
You are Agent Alpha for MJ_Online project.

Your workflow:
1. Connect to task queue via NATS (http://localhost:8001)
2. Watch for available tasks on channel "mjwork.tasks.available"
3. When task appears, claim it by publishing to "mjwork.tasks.claimed"
4. Execute the task
5. Publish results to "mjwork.tasks.completed"
6. Loop back to step 2

NATS connection:
- Use WorkerClient from agent_coordination.client
- Your agent name: "Agent-Alpha"
- Register on startup
- Send heartbeats every 30 seconds

Start by connecting to NATS and watching for tasks.
"""
```

---

## Key Differences from Agentic_SDLC

### Agentic_SDLC (Chat System):
- **Purpose:** Agent-to-agent communication
- **Model:** Chat/messaging (Slack-like)
- **Channels:** roadmap, coordination, errors, general
- **Use Case:** Collaborative discussion

### MJ_Online (Task Queue):
- **Purpose:** Work distribution and coordination
- **Model:** Task queue + pub/sub
- **Channels:** tasks.*, coordination, errors, heartbeat
- **Use Case:** Autonomous task execution

### Adapted Components:

**Keep Same:**
- NATS JetStream infrastructure
- FastAPI server architecture
- Python client pattern
- Web dashboard concept
- Stream-based persistence

**Change:**
- Stream name: `AGENT_CHAT` → `MJ_ONLINE_WORK`
- Subject prefix: `agents.>` → `mjwork.>`
- Port: 8000 → 8001
- Channels: chat-focused → task-focused
- Models: Message → Task

---

## Implementation Time Estimates

**Setup NATS Stream:** 5 minutes
```bash
nats stream add MJ_ONLINE_WORK --subjects "mjwork.>" --storage file --retention limits --max-age=168h --defaults
```

**Copy & Adapt Code:** 30-45 minutes
- Copy agent_chat directory → agent_coordination
- Modify models.py for Task model
- Update nats_client.py with new subjects
- Adapt client.py for task queue operations
- Update server.py (change port to 8001)
- Modify dashboard UI for task visualization

**Test Integration:** 15-30 minutes
- Publish test task
- Launch test agent
- Verify claim/complete workflow
- Check dashboard

**Total:** 1-1.5 hours for full setup

---

## Migration from Current Task Tools

**Current (Not Working):**
```python
# Agents try to use TaskList, TaskGet, TaskUpdate
# These tools don't exist in subagent context
```

**New (NATS-based):**
```python
# Agents use NATS pub/sub
from agent_coordination.client import WorkerClient

async with WorkerClient("Agent-Alpha") as worker:
    await worker.register()

    # Watch for tasks (subscribes to mjwork.tasks.available)
    async for task in worker.watch_tasks():
        # Automatically publishes claim to mjwork.tasks.claimed
        await worker.claim_task(task["task_id"])

        # Do work...
        result = execute_task(task)

        # Publishes to mjwork.tasks.completed
        await worker.complete_task(task["task_id"], result)
```

**Orchestrator (You/Claude Code):**
```python
# Publish tasks from roadmap
from agent_coordination.client import TaskPublisher

publisher = TaskPublisher()

# Publish Phase 1 tasks
for task in phase_1_tasks:
    await publisher.publish_task(task)

# Monitor progress
monitor = MonitorClient()
status = await monitor.get_all_tasks()
# Returns: {
#   "available": [task5, task6, task7],
#   "in_progress": [task2],
#   "completed": [task1, task3, task4]
# }
```

---

## Advantages of NATS Approach

### vs. File-Based Queue:
- ✅ No file locking issues
- ✅ Real-time updates (no polling)
- ✅ Built-in persistence
- ✅ Message ordering guaranteed
- ✅ Scales to many agents

### vs. Direct Task Tools:
- ✅ Agents can access (HTTP API)
- ✅ Language-agnostic (any client can connect)
- ✅ Real-time monitoring
- ✅ Message replay capabilities
- ✅ Distributed coordination

### vs. Database Queue:
- ✅ Lower latency
- ✅ No database setup
- ✅ Stream-based processing
- ✅ Built-in pub/sub
- ✅ Lighter weight

---

## Next Steps

### 1. Decide on Option A or B
**Recommendation:** Option A (shared NATS, separate stream)

### 2. If Option A - Quick Setup:
```bash
cd /Users/michaeljones/Dev/MJ_Online

# Create agent coordination module
mkdir -p agent_coordination

# Copy base structure from Agentic_SDLC
cp -r /Users/michaeljones/Dev/Agentic_SDLC/agent_chat/nats_client.py agent_coordination/
cp -r /Users/michaeljones/Dev/Agentic_SDLC/agent_chat/models.py agent_coordination/
cp -r /Users/michaeljones/Dev/Agentic_SDLC/agent_chat/client.py agent_coordination/

# Create MJ_ONLINE_WORK stream
nats stream add MJ_ONLINE_WORK --subjects "mjwork.>" --storage file --retention limits --max-age=168h --defaults

# Adapt code for task queue (will do this next)
```

### 3. Create Custom Components:
- `task_queue.py` - Task queue management logic
- `server.py` - FastAPI server on port 8001
- `client.py` - Adapted for task operations
- Web dashboard - Task visualization UI

### 4. Test:
```bash
# Terminal 1: Start server
cd agent_coordination
./start_server.sh

# Terminal 2: Publish test task
python publish_task.py --task-id 1 --title "Test Task"

# Terminal 3: Launch test agent
python test_agent.py "Agent-Alpha"

# Browser: Monitor at http://localhost:8001
```

### 5. Launch Real Agents:
```python
# Agents connect to NATS and self-coordinate
# No need for TaskList/TaskGet/TaskUpdate tools
# Everything via NATS pub/sub
```

---

## Questions to Answer

1. **Do you want to proceed with Option A (shared NATS)?** ✅ Recommended
2. **Should I create the agent_coordination module now?**
3. **Do you want to see NATS in action first before full implementation?**
4. **Should we test with the Agentic_SDLC system first to familiarize?**

---

## Conclusion

**Best Path Forward:**
1. ✅ Use Option A (shared NATS, separate stream)
2. ⏱️ 1-1.5 hours to set up agent_coordination module
3. 🚀 Launch autonomous agents that coordinate via NATS
4. 📊 Monitor progress via web dashboard at http://localhost:8001
5. 🎯 Agents work through MJ_Online roadmap tasks autonomously

**This gives you:**
- True autonomous agent coordination
- Real-time visibility into progress
- Scalable architecture (can add more agents easily)
- Professional dev practice (NATS is industry-standard)
- Portfolio-worthy implementation
- Reusable for future projects

**Ready to implement?** Let me know if you want me to:
- Create the agent_coordination module now
- Test with existing Agentic_SDLC system first
- Start with a simpler approach and add NATS later
