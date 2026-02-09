# NATS Agent Integration Task - Enable Autonomous Work Claiming

**Assigned to:** NATS-Troubleshooter Agent
**Priority:** MEDIUM (infrastructure improvement, not blocking current work)
**Estimated Time:** 3-5 hours
**Status:** ✅ COMPLETE (2026-02-07)
**Implementation:** See `agent_coordination/AUTONOMOUS-AGENTS-IMPLEMENTATION-SUMMARY.md`

---

## Current State vs. Desired State

### Current State (How It Works Now)
- **Task Management:** TaskCreate/TaskUpdate tools track work for PM/human visibility
- **Agent Invocation:** User launches agents via Task tool with specific instructions in prompt
- **NATS Infrastructure:** Running and operational (localhost:4222, localhost:8001)
- **Agent NATS Connection:** ✅ Agents already register and send heartbeats (TED, Debbie confirmed)
- **Agent Behavior:** Agents execute what's in their launch prompt, report status, but don't watch queue
- **Limited Autonomy:** Agents connected to NATS but don't monitor `mjwork.tasks.available`

**Analogy:** Drivers have radios and are checking in (heartbeats), but aren't listening to dispatch channel for new jobs.

### Desired State (Goal)
- **Agent Autonomy:** Agents watch `mjwork.tasks.available` and claim work matching their role
- **Auto-Assignment:** When PM creates a task, eligible agents see it and claim it
- **Coordination:** Agents communicate progress via NATS channels
- **Heartbeat Monitoring:** Agents send health status every 30s
- **Task Handoffs:** Debbie completes → Doc Brown sees it → claims next step → etc.

---

## Verification of Current NATS Integration

**Confirmed via `curl http://localhost:8001/api/agents`:**
```json
[
  {
    "agent_id": "TED",
    "last_heartbeat": "2026-02-04T21:59:53",
    "status": "idle"
  },
  {
    "agent_id": "Debbie",
    "last_heartbeat": "2026-02-06T00:13:29",
    "status": "active",
    "current_task": "Projects page review complete - moving to NeighborhoodShare case study"
  }
]
```

**This proves:**
- ✅ Agents successfully connect to NATS
- ✅ Agents register with agent ID and description
- ✅ Agents send periodic heartbeats
- ✅ Agents report current task and status
- ✅ Dashboard displays agent health in real-time

**So the infrastructure works - we just need task queue monitoring.**

---

## The Integration Gap

### What Exists ✅
1. NATS JetStream infrastructure (server, streams, channels)
2. FastAPI coordinator with task queue API
3. WorkerClient library (`agent_coordination/client.py`)
4. Dashboard for monitoring (http://localhost:8001)
5. Documentation (QUICKSTART.md, AGENT-CREATION-CHECKLIST.md)
6. **Agents already register with NATS** (TED, Debbie confirmed registered)
7. **Agents already send heartbeats** (Debbie last heartbeat: 2026-02-06, status: active)
8. **Agents already report current task** (visible on dashboard)

### What's Missing ❌
1. **Task watching logic:** Agents don't subscribe to `mjwork.tasks.available` channel
2. **Work claiming behavior:** Agents don't autonomously claim tasks from queue
3. **Task polling loop:** Agents don't check queue for new work periodically

---

## Implementation Task

### Objective
Add task queue monitoring to existing agents (Debbie, Doc Brown, Alice, Morgan) so they can autonomously watch `mjwork.tasks.available`, claim matching tasks, and execute work without explicit Task tool invocation.

**Note:** Agents already have NATS integration (register, heartbeat, status reporting). This task adds the missing piece: autonomous work claiming.

### Agents to Modify

**Priority 1 (Pilot Test Workflow):**
1. **Debbie** (Web Design Agent) - Claims design tasks
2. **Doc Brown** (Mobiledoc Assembler) - Claims Mobiledoc conversion tasks
3. **Alice** (Web Content Builder) - Claims publishing tasks

**Priority 2 (Coordination):**
4. **Morgan** (Project Manager) - Watches completions, updates roadmap

### Required Changes Per Agent

**Option A: Add NATS Integration to Agent Definitions**
Modify each agent's `.md` file to include startup instructions:
- Connect to NATS via WorkerClient on launch
- Subscribe to relevant task channels
- Implement task watching loop with heartbeats
- Claim tasks matching agent role
- Report completion back to queue

**Option B: Create Wrapper/Launcher Script**
Build a generic agent launcher that:
- Loads agent definition
- Connects to NATS
- Watches for tasks matching agent role
- Invokes agent via Task tool when work claimed
- Reports results back to NATS

**Option C: Hybrid Approach**
- Keep direct Task tool invocation working (current workflow)
- Add optional NATS mode for autonomous operation
- Agents can run in either mode depending on how they're launched

### Technical Requirements

**Agent Startup Pattern:**
```python
from agent_coordination.client import WorkerClient
import asyncio

async def run_agent(agent_name, agent_role):
    async with WorkerClient(agent_name) as worker:
        # 1. Register with NATS
        await worker.register(description=agent_role)

        # 2. Initial heartbeat
        await worker.heartbeat(status="active", current_task=None)

        # 3. Watch for relevant tasks
        async for task in worker.watch_tasks():
            # Filter for tasks matching this agent's role
            if task_matches_role(task, agent_role):
                # Claim task
                await worker.claim_task(task["task_id"])
                await worker.heartbeat(status="busy", current_task=task["task_id"])

                # Execute task (invoke agent logic)
                result = await execute_agent_work(task)

                # Report completion
                await worker.complete_task(task["task_id"], result)
                await worker.heartbeat(status="active", current_task=None)

                # Coordinate with team
                await worker.coordinate(f"Completed {task['task_id']}: {result['summary']}")
```

**Heartbeat Loop (runs in background):**
```python
async def heartbeat_loop(worker, task_id=None):
    while True:
        status = "busy" if task_id else "active"
        await worker.heartbeat(status=status, current_task=task_id)
        await asyncio.sleep(30)  # Every 30 seconds
```

**Task Filtering Logic:**
- **Debbie:** Tasks with type="design" or phase contains "design"
- **Doc Brown:** Tasks with type="mobiledoc_conversion" or mentions "PAGE_SPEC"
- **Alice:** Tasks with type="publishing" or phase contains "publish"
- **Morgan:** Watches all completions, updates roadmap

### Integration Points

**Where NATS Integration Hooks In:**
1. **Agent Launch:** When user launches agent, optionally connect to NATS
2. **Task Claiming:** Agent watches queue, claims matching work
3. **Execution:** Agent does its normal work (current logic unchanged)
4. **Completion:** Agent reports back via NATS, updates TaskList
5. **Coordination:** Agent publishes status to coordination channel

**Backward Compatibility:**
- Direct Task tool invocation still works (no NATS connection)
- NATS mode is additive, not replacement
- User can choose: "Task tool with prompt" OR "autonomous NATS mode"

---

## Success Criteria

### Phase 1: Basic Integration ✅
- [ ] Debbie can connect to NATS and send heartbeat
- [ ] Debbie can claim a design task from queue
- [ ] Debbie executes work and reports completion
- [ ] TaskList shows task status updated by agent (not PM)

### Phase 2: Full Workflow ✅
- [ ] PM creates task → publishes to `mjwork.tasks.available`
- [ ] Debbie claims design task, completes, publishes result
- [ ] Doc Brown sees completed design task, claims Mobiledoc conversion
- [ ] Alice sees Mobiledoc ready, claims publishing task
- [ ] All agents send heartbeats throughout workflow

### Phase 3: Production Ready ✅
- [ ] Crashed agent detected via missing heartbeats
- [ ] Tasks auto-reclaimed if agent dies mid-work
- [ ] Dashboard shows real-time agent health and task flow
- [ ] Documentation updated with autonomous mode instructions

---

## Design Decisions You Need to Make

1. **Integration Approach:** Option A (modify agents), B (launcher script), or C (hybrid)?
2. **Task Filtering:** How should agents determine which tasks match their role?
3. **Backward Compatibility:** Keep Task tool invocation working? Or replace entirely?
4. **Error Handling:** What happens when agent crashes mid-task?
5. **Testing Strategy:** How to test without disrupting current work?

---

## Constraints

**Don't Break Current Work:**
- Debbie is running About page pilot test in another terminal
- Current Task tool workflow must keep working
- Don't require NATS for agents to function

**Keep It Simple:**
- Start with one agent (Debbie) as proof of concept
- Validate approach before rolling out to all agents
- Incremental integration, not big-bang replacement

**Maintain Flexibility:**
- User should be able to launch agents with or without NATS
- Direct prompts still valuable for one-off tasks
- Autonomous mode optional, not mandatory

---

## Recommended Approach

**Suggested Implementation Plan:**

1. **Create Agent Launcher Script** (`agent_coordination/autonomous_agent.py`)
   - Generic launcher that connects any agent to NATS
   - Takes agent name and role as parameters
   - Implements watch/claim/execute/report loop
   - Invokes agent work via function call (not Task tool)

2. **Test with Debbie** (after pilot test completes)
   - Launch Debbie in autonomous mode: `python autonomous_agent.py --agent debbie`
   - PM creates design task via TaskCreate
   - Verify Debbie claims and completes task
   - Check heartbeat monitoring and dashboard

3. **Expand to Workflow** (if successful)
   - Add Doc Brown autonomous mode
   - Add Alice autonomous mode
   - Test full pipeline: Design → Mobiledoc → Publishing
   - Validate handoffs work automatically

4. **Document and Deploy**
   - Update CLAUDE.md with autonomous agent instructions
   - Create user guide for launching agents in NATS mode
   - Add to Project Manager responsibilities (monitor autonomous agents)

---

## Deliverables

1. **Code:** Agent launcher script or agent definition modifications
2. **Documentation:** How to run agents in autonomous mode
3. **Testing:** Proof that one agent can claim and complete work autonomously
4. **Dashboard:** Verify real-time visibility of autonomous agent activity
5. **Report:** Findings, challenges, recommendations for full rollout

---

## Questions to Answer

1. Is Option A, B, or C the right approach for integration?
2. How should task filtering work (by type, by phase, by content)?
3. What's the migration path from current workflow to autonomous mode?
4. How do we test without disrupting active work (Debbie's pilot test)?
5. Should all agents run autonomously, or only when explicitly needed?

---

## Context

- **Current Phase:** 3.0.3 (About page pilot test with Debbie)
- **NATS Status:** Infrastructure operational, agents not connected
- **Priority:** Medium (nice-to-have, not blocking current work)
- **User Request:** "Can you assign work and have agents pick it up autonomously?"
- **Answer:** Not yet, but this task will make it possible

---

**Ready to implement? Let me know your design decisions and I'll get started.**
