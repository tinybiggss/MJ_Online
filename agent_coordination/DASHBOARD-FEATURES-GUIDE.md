# Dashboard Features Guide

**For Agent Developers**

This guide explains how to use the new dashboard features that provide real-time visibility into agent status and task progress.

---

## ✨ New Features

### 1. Current Task Medallion ⚡

A **prominent purple badge** that shows what task an agent is currently working on. It:
- Appears when agent starts working on a task
- Updates in real-time when task changes
- Disappears when task completes
- Pulses with a subtle animation
- Shows task title (human-readable)

### 2. Approval/Attention Flag 🚨

A **blinking orange/red flag** that appears when an agent needs user attention or approval. It:
- Blinks to grab attention
- Shows an approval message explaining what's needed
- Is clickable (placeholder for future approval mechanism)
- Disappears when agent clears the flag
- Works whether agent is working on a task or idle

---

## 📖 How to Use These Features

### Basic Heartbeat (No Task)

When your agent is idle or just starting:

```python
await worker.heartbeat(
    status="idle",
    current_task=None,
    current_task_title=None
)
```

**Dashboard shows:** Agent status badge only, "No current task"

---

### Working on a Task (Show Medallion)

When your agent claims and starts working on a task:

```python
await worker.heartbeat(
    status="busy",
    current_task="task-5",  # Task ID
    current_task_title="Research Ghost Themes"  # Human-readable title
)
```

**Dashboard shows:**
- ⚡ **Purple pulsing medallion** with "Research Ghost Themes"
- Status badge shows "BUSY"

---

### Switching Tasks (Update Medallion)

When your agent switches to a different task:

```python
await worker.heartbeat(
    status="busy",
    current_task="task-6",
    current_task_title="Draft About Page Content"
)
```

**Dashboard shows:** Medallion updates to show new task title

---

### Task Complete (Hide Medallion)

When your agent completes a task:

```python
await worker.heartbeat(
    status="active",
    current_task=None,  # Clear task
    current_task_title=None
)
```

**Dashboard shows:** Medallion disappears, status changes to "ACTIVE"

---

### Request User Approval (Show Flag)

When your agent needs user input or approval:

```python
await worker.heartbeat(
    status="busy",  # Can be any status
    current_task="task-6",
    current_task_title="Draft About Page Content",
    needs_approval=True,  # 🚨 SHOW FLAG
    approval_message="Please review About page content before publishing"
)
```

**Dashboard shows:**
- 🚨 **Blinking approval flag** with "NEEDS APPROVAL"
- Approval message below the flag
- Current task medallion (if working on a task)

---

### Clear Approval Flag

After user provides approval (or issue is resolved):

```python
await worker.heartbeat(
    status="busy",
    current_task="task-6",
    current_task_title="Draft About Page Content",
    needs_approval=False,  # Clear flag
    approval_message=None
)
```

**Dashboard shows:** Approval flag disappears

---

## 🎨 Visual Guide

### Agent States Visualization

```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 My-Agent-Name                       [BUSY]               │
│ ─────────────────────────────────────────────────────────   │
│ Description: Content creation specialist                    │
│                                                              │
│ ⚡ Research Ghost Themes  ← CURRENT TASK MEDALLION          │
│                                                              │
│ 🚨 NEEDS APPROVAL  ← ATTENTION FLAG (if set)                │
│ 📋 Please review content before publishing                  │
│                                                              │
│ Last seen: 1/30/2026, 4:04:23 PM                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Best Practices

### 1. Always Provide Task Titles

**Do:**
```python
await worker.heartbeat(
    status="busy",
    current_task="task-5",
    current_task_title="Research Ghost Themes"  # ✅ Human-readable
)
```

**Don't:**
```python
await worker.heartbeat(
    status="busy",
    current_task="task-5",
    current_task_title=None  # ❌ Will show "task-5" instead
)
```

### 2. Clear Tasks When Complete

Always set `current_task=None` when finishing:

```python
# Task complete
await worker.complete_task(task_id, result)

# Clear task from heartbeat
await worker.heartbeat(
    status="active",
    current_task=None,  # ✅ Clear
    current_task_title=None
)
```

### 3. Use Descriptive Approval Messages

**Do:**
```python
approval_message="Please review About page content before publishing to mikejones.online"
```

**Don't:**
```python
approval_message="Need approval"  # Too vague
```

### 4. Clear Approval Flags Promptly

Once the issue is resolved, clear the flag:

```python
# After user provides input or issue resolves
await worker.heartbeat(
    status="busy",
    current_task=task_id,
    current_task_title=title,
    needs_approval=False,  # ✅ Clear immediately
    approval_message=None
)
```

---

## 🔄 Real-Time Updates

The dashboard **auto-refreshes every 5 seconds**, so:
- Medallion appears within 5 seconds of setting `current_task`
- Medallion disappears within 5 seconds of clearing `current_task`
- Approval flag appears/disappears within 5 seconds
- Status badges update in real-time

**No action needed** - just update your heartbeat and the dashboard will reflect the changes automatically!

---

## 📋 Complete Example

Here's a complete agent workflow using all features:

```python
import asyncio
from agent_coordination.client import WorkerClient

async def run_agent():
    async with WorkerClient("My-Agent") as worker:
        # 1. Register
        await worker.register(description="Content specialist")

        # 2. Start idle
        await worker.heartbeat(status="idle")

        # 3. Get and claim task
        tasks = await worker.get_available_tasks()
        task = tasks[0]
        await worker.claim_task(task['task_id'])

        # 4. Show working on task (medallion appears)
        await worker.heartbeat(
            status="busy",
            current_task=task['task_id'],
            current_task_title=task['title']
        )

        # 5. Do work...
        result = await do_work(task)

        # 6. Need approval (flag appears)
        await worker.heartbeat(
            status="busy",
            current_task=task['task_id'],
            current_task_title=task['title'],
            needs_approval=True,
            approval_message="Please review output before finalizing"
        )

        # Wait for user input (simulated)
        await asyncio.sleep(30)

        # 7. Approval received, clear flag
        await worker.heartbeat(
            status="busy",
            current_task=task['task_id'],
            current_task_title=task['title'],
            needs_approval=False,
            approval_message=None
        )

        # 8. Complete task (medallion disappears)
        await worker.complete_task(task['task_id'], result)
        await worker.heartbeat(
            status="active",
            current_task=None,
            current_task_title=None
        )
```

---

## 🎯 When to Use Each Feature

### Current Task Medallion

**Use when:**
- Agent claims a task
- Agent switches to a different task
- You want to show real-time progress to user

**Clear when:**
- Task completes (success or failure)
- Agent goes idle
- Agent pauses work

### Approval Flag

**Use when:**
- Agent needs user to review content
- Agent needs permission to proceed
- Agent encounters ambiguous requirements
- Agent wants user to choose between options
- Agent needs confirmation before destructive action

**Clear when:**
- User provides approval/input
- Issue is resolved
- Agent decides to proceed without approval
- Task is abandoned

---

## 🚀 Try It Yourself

Run the demo agent to see all features in action:

```bash
cd /Users/michaeljones/Dev/MJ_Online
source agent_coordination/venv/bin/activate
python agent_coordination/demo_agent_features.py
```

Open http://localhost:8001 while the demo runs to see:
- Medallion appearing and updating
- Approval flag blinking
- Real-time status changes
- Auto-refresh behavior

---

## 🔧 API Reference

### WorkerClient.heartbeat()

```python
async def heartbeat(
    self,
    status: str = "active",
    current_task: Optional[str] = None,
    current_task_title: Optional[str] = None,
    needs_approval: bool = False,
    approval_message: Optional[str] = None
) -> dict
```

**Parameters:**
- `status` - Agent status: `"active"`, `"idle"`, `"busy"`, `"offline"`
- `current_task` - Task ID being worked on (or `None`)
- `current_task_title` - Human-readable task title (or `None`)
- `needs_approval` - Whether agent needs user attention (default: `False`)
- `approval_message` - Message explaining what needs approval (optional)

**Returns:** `{"success": True}`

---

## 📊 Dashboard URL

**Live Dashboard:** http://localhost:8001

The dashboard shows:
- Task queue status
- All registered agents
- Current task medallions
- Approval flags
- Agent heartbeat status
- Auto-refreshes every 5 seconds

---

**Last Updated:** 2026-01-30
**Created By:** NATS-Troubleshooter-Agent
