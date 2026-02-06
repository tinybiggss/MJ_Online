# Agent Creation Checklist

**For Project Manager and Agent Developers**

This checklist ensures all new agents meet the coordination system requirements.

---

## Pre-Creation Checklist

Before creating a new agent, verify:

- [ ] NATS server is running (localhost:4222)
- [ ] FastAPI server is running (localhost:8001)
- [ ] JetStream stream MJ_ONLINE_WORK exists
- [ ] Virtual environment is activated
- [ ] `agent_coordination` package is importable

---

## Required Agent Components

Every agent MUST include these components:

### 1. Import Required Modules ✅

```python
import asyncio
from agent_coordination.client import WorkerClient
```

### 2. Agent Registration ✅

```python
async with WorkerClient("Agent-Unique-Name") as worker:
    await worker.register(
        description="Clear description of agent role",
        capabilities=["capability-1", "capability-2"]
    )
```

**Naming Convention:**
- Use descriptive names: `Web-Content-Builder`, `Project-Manager-Claude`
- Avoid generic names: `Agent-1`, `Worker`
- Use hyphens, not underscores: `NATS-Troubleshooter` ✅ not `NATS_Troubleshooter` ❌

### 3. ⚠️ HEARTBEAT MONITORING (MANDATORY) ✅

**CRITICAL:** All new agents MUST implement heartbeat monitoring.

```python
# Send initial heartbeat on startup
await worker.heartbeat(status="active", current_task=None)

# During work loop - send heartbeat every 30 seconds
while True:
    # Do work...

    # Send heartbeat
    await worker.heartbeat(
        status="busy" if has_task else "active",
        current_task=current_task_id if has_task else None
    )

    await asyncio.sleep(30)
```

**Heartbeat Statuses:**
- `active` - Agent is running and ready for work
- `idle` - Agent is waiting for tasks
- `busy` - Agent is actively working on a task
- `offline` - Agent is shutting down or errored

**Heartbeat Frequency:** Every 30 seconds (maximum)

### 4. Task Claiming ✅

```python
# Get available tasks
tasks = await worker.get_available_tasks()

# Claim task before starting work
for task in tasks:
    try:
        await worker.claim_task(task['task_id'])

        # Update heartbeat with current task
        await worker.heartbeat(status="busy", current_task=task['task_id'])

        # Do work...
        result = await execute_task(task)

        # Complete task
        await worker.complete_task(task['task_id'], result)

    except Exception as e:
        # Report error
        await worker.report_error(str(e))
```

### 5. Coordination Messages ✅

```python
# On startup
await worker.send_coordination_message("Agent-Name starting up, ready for work")

# During work (milestones)
await worker.send_coordination_message("Task X: 50% complete - milestone reached")

# On completion
await worker.send_coordination_message("Task X completed: summary of results")
```

### 6. Error Reporting ✅

```python
try:
    # Work...
    pass
except Exception as e:
    # Report error to coordination system
    await worker.report_error(f"Error in task {task_id}: {str(e)}")

    # Update heartbeat to offline status
    await worker.heartbeat(status="offline", current_task=task_id)

    # Re-raise or handle
    raise
```

### 7. Graceful Shutdown ✅

```python
try:
    # Main agent logic
    while True:
        # Work...
        pass

except KeyboardInterrupt:
    # Send shutdown message
    await worker.send_coordination_message("Agent-Name shutting down gracefully")

    # Send offline heartbeat
    await worker.heartbeat(status="offline", current_task=None)

    # Clean up resources
    cleanup()
```

---

## Complete Agent Template

Use this template for all new agents:

```python
"""
Agent Name: [Agent-Name]
Description: [What this agent does]
Capabilities: [List of capabilities]
"""

import asyncio
import sys
from datetime import datetime
from pathlib import Path

# Import coordination client
sys.path.insert(0, str(Path(__file__).parent.parent))
from agent_coordination.client import WorkerClient


async def run_agent():
    """Main agent execution function."""

    agent_id = "Agent-Name"

    print(f"\\n{'='*80}")
    print(f"  {agent_id.upper()} - INITIALIZING")
    print(f"{'='*80}\\n")

    async with WorkerClient(agent_id, "http://localhost:8001") as worker:
        # 1. Register
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Registering agent...")
        await worker.register(
            description="Agent role description",
            capabilities=["capability-1", "capability-2"]
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Registration successful\\n")

        # 2. Send initial heartbeat
        await worker.heartbeat(status="active", current_task=None)

        # 3. Announce startup
        await worker.send_coordination_message(
            f"{agent_id} starting up, ready for work"
        )

        print(f"[{datetime.now().strftime('%H:%M:%S')}] Agent ready and monitoring\\n")

        try:
            # Main work loop
            while True:
                # Get available tasks
                tasks = await worker.get_available_tasks(limit=10)

                if tasks:
                    for task in tasks:
                        # Check if blocked
                        if task.get('blocked_by'):
                            continue

                        # Claim task
                        await worker.claim_task(task['task_id'])

                        # Update heartbeat
                        await worker.heartbeat(
                            status="busy",
                            current_task=task['task_id']
                        )

                        # Announce claim
                        await worker.send_coordination_message(
                            f"{agent_id} claimed task {task['task_id']}: {task['title']}"
                        )

                        try:
                            # DO THE WORK HERE
                            result = await execute_task(task)

                            # Complete task
                            await worker.complete_task(task['task_id'], result)

                            # Announce completion
                            await worker.send_coordination_message(
                                f"{agent_id} completed task {task['task_id']}"
                            )

                        except Exception as e:
                            # Report error
                            await worker.report_error(
                                f"Error in task {task['task_id']}: {str(e)}"
                            )
                            print(f"Error: {e}")

                        # Clear current task
                        await worker.heartbeat(status="active", current_task=None)

                else:
                    # No tasks available, send idle heartbeat
                    await worker.heartbeat(status="idle", current_task=None)

                # Wait before next check (and send heartbeat)
                await asyncio.sleep(30)

        except KeyboardInterrupt:
            print(f"\\n[{datetime.now().strftime('%H:%M:%S')}] Shutting down...")
            await worker.send_coordination_message(f"{agent_id} shutting down")
            await worker.heartbeat(status="offline", current_task=None)
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Goodbye!")


async def execute_task(task):
    """
    Execute the task logic.

    Args:
        task: Task dictionary from queue

    Returns:
        Result dictionary with status, summary, deliverables, etc.
    """
    # YOUR TASK EXECUTION LOGIC HERE

    return {
        "status": "completed",
        "summary": "Task completed successfully",
        "deliverables": [],
        "ready_for_testing": False
    }


if __name__ == "__main__":
    asyncio.run(run_agent())
```

---

## Post-Creation Verification

After creating an agent, verify:

- [ ] Agent registers successfully (check dashboard)
- [ ] Agent appears in agent list: `curl http://localhost:8001/api/agents`
- [ ] Heartbeat is being sent (check `last_heartbeat` field)
- [ ] Agent status updates correctly (`active`, `busy`, `idle`)
- [ ] Tasks are claimed and completed correctly
- [ ] Coordination messages appear in dashboard
- [ ] Errors are reported properly (test with intentional error)

---

## Common Mistakes to Avoid

❌ **Forgetting heartbeat monitoring**
- Agent won't be detected if it crashes
- Tasks can become stuck

❌ **Not updating heartbeat during long operations**
- System will think agent is dead
- Send heartbeat at least every 30 seconds

❌ **Not clearing current_task in heartbeat after completion**
- Dashboard will show wrong status
- Always set `current_task=None` when idle

❌ **Not reporting errors**
- Silent failures are hard to debug
- Always use `worker.report_error()`

❌ **Not sending coordination messages**
- Other agents and PM can't track progress
- Send messages at key milestones

❌ **Claiming tasks without checking blocked_by**
- Agent will be stuck waiting for dependencies
- Always check `task.get('blocked_by')` before claiming

---

## Testing New Agents

1. **Run agent in isolation**
   ```bash
   python agent_coordination/your_new_agent.py
   ```

2. **Verify registration**
   ```bash
   curl http://localhost:8001/api/agents | python3 -m json.tool
   ```

3. **Check heartbeat**
   Wait 30 seconds, then verify `last_heartbeat` updated:
   ```bash
   curl http://localhost:8001/api/agents | python3 -m json.tool | grep -A 5 "Your-Agent-Name"
   ```

4. **Publish test task**
   ```bash
   python agent_coordination/publish_task.py "test-1" "Test Task" "Testing new agent"
   ```

5. **Verify task claim**
   Check dashboard or API to see if agent claimed task

6. **Monitor coordination messages**
   ```bash
   curl http://localhost:8001/api/messages/coordination | python3 -m json.tool | tail -20
   ```

---

## Quick Reference

**Minimum Required Code:**
```python
async with WorkerClient("Agent-Name") as worker:
    # 1. Register
    await worker.register(description="...")

    # 2. Send heartbeat every 30s
    while True:
        await worker.heartbeat(status="active", current_task=None)
        await asyncio.sleep(30)
```

**Full Agent Workflow:**
1. Import `WorkerClient`
2. Register agent
3. Send initial heartbeat
4. Announce startup
5. Loop: Get tasks → Claim → Update heartbeat → Work → Complete → Update heartbeat
6. Send heartbeat every 30 seconds
7. Report errors if any
8. Announce shutdown gracefully

---

## Support

**Dashboard:** http://localhost:8001
**API Docs:** http://localhost:8001/docs
**NATS-Troubleshooter-Agent:** Available for assistance

For questions or issues, send coordination message to `@NATS-Troubleshooter-Agent` or `@Project-Manager-Claude`.

---

**Last Updated:** 2026-01-30
**Maintained By:** NATS-Troubleshooter-Agent
