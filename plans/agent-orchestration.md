# Agent Orchestration System for MJ_Online

## Overview

This document describes how to run multiple autonomous agents in parallel to work through the roadmap tasks.

## How It Works

### Task Management
- Roadmap items are converted to **Task items** (using TaskCreate)
- Each task has:
  - **Subject**: Brief title
  - **Description**: Full details of what to do
  - **Status**: pending → in_progress → completed
  - **Owner**: Which agent claimed the task
  - **Dependencies**: Tasks that must complete first (blockedBy)

### Agent Behavior
Each autonomous agent:
1. **Checks task list** (TaskList) for available work
2. **Finds unclaimed tasks** with no blockers (status: pending, no owner, blockedBy is empty)
3. **Claims the task** by setting owner and status: in_progress
4. **Executes the task** (reads instructions from description)
5. **Marks complete** (status: completed)
6. **Loops back** to find next available task

### Parallel Execution
- Multiple agents can run simultaneously
- Agents coordinate through the task list (shared state)
- Dependencies prevent work from happening out of order
- Each agent works autonomously without central coordination

## Launching Agents

### Option 1: Background Agents with Monitoring
Launch agents in background and monitor their progress:

```
# Launch Agent 1 (background)
Use Task tool with run_in_background=true, subagent_type="general-purpose"
Prompt: "You are an autonomous worker agent for the MJ_Online project..."

# Monitor Agent 1
Use TaskOutput tool to check progress
```

### Option 2: Multiple Terminal Windows
For better visibility, launch each agent in its own context:

```
# Terminal 1: Agent "Alpha"
Launch agent named "Alpha" to work on roadmap tasks

# Terminal 2: Agent "Beta"
Launch agent named "Beta" to work on roadmap tasks

# Terminal 3: Agent "Gamma"
Launch agent named "Gamma" to work on roadmap tasks
```

## Agent Instructions

### Autonomous Worker Agent Prompt

When launching an agent, use this prompt:

```
You are an autonomous worker agent for the MJ_Online project (Ghost Pro website launch).

Your job is to continuously:
1. Check the task list for available work (TaskList)
2. Find unclaimed tasks where:
   - status = "pending"
   - owner is empty
   - blockedBy is empty (no dependencies blocking)
3. Claim a task by:
   - TaskUpdate: set owner="[your-agent-name]", status="in_progress"
4. Read the full task details (TaskGet with taskId)
5. Execute the task following the instructions in the description
6. Mark complete: TaskUpdate status="completed"
7. Check for next available task (loop back to step 1)

Important rules:
- ALWAYS claim a task before starting work (set owner + in_progress)
- NEVER start a task that is blockedBy another task
- If no tasks are available, wait or report completion
- Document your work as you go (create files, take notes)
- If you encounter blockers, update task description with notes
- Work autonomously - don't ask for permission unless truly stuck

Your agent name: [ASSIGN NAME: Alpha, Beta, Gamma, etc.]

Roadmap file: /Users/michaeljones/Dev/MJ_Online/plans/roadmap-ghost-pro.md
Current phase: Phase 1 (Ghost Pro Setup)

Start by checking the task list and claiming your first task.
```

## Current Task Queue

### Phase 1: Ghost Pro Setup (Active)
- Task #1: Set up Ghost Pro account (READY - no blockers)
- Task #2: Configure custom domain (BLOCKED by Task #1)
- Task #3: Configure email delivery (BLOCKED by Task #1)
- Task #4: Configure initial settings (BLOCKED by Task #1)

### Phase 2: Theme & Design (Coming Soon)
- Will be added after Phase 1 completes

### Phase 3: Content Creation (Coming Soon)
- Will be added after Phase 2 completes

## Monitoring Agents

### Check Task List
```
Use TaskList tool to see:
- Which tasks are available (pending, no blockers)
- Which tasks are in progress (and by whom)
- Which tasks are completed
```

### Check Specific Task
```
Use TaskGet with taskId to see:
- Full task description
- Current owner
- Status
- Dependencies
```

### Check Agent Progress
If agent is running in background:
```
Use TaskOutput with agent's task_id to see recent output
```

## Parallelization Strategy

### Phase 1: Sequential (1 agent sufficient)
- Task 1 must complete before 2, 3, 4
- After Task 1 completes, 3 agents can run in parallel on Tasks 2, 3, 4

### Phase 2: High Parallelization (4-5 agents)
- Theme selection, design, navigation, ActivityPub, analytics can all run in parallel

### Phase 3: Maximum Parallelization (6-8 agents)
- Content creation tasks are highly parallel
- Homepage, About, Resume, Contact, multiple case studies

## Adding More Tasks

As phases progress, add new tasks:

```
Use TaskCreate for each roadmap item
Set dependencies with TaskUpdate (addBlockedBy)
Agents will automatically pick up new tasks as they become available
```

## Example: Launching 3 Agents

```
# Agent Alpha - Start immediately
Task tool:
  subagent_type: "general-purpose"
  prompt: "[Autonomous worker prompt with agent name: Alpha]"
  run_in_background: true

# Agent Beta - Start immediately (will wait for available tasks)
Task tool:
  subagent_type: "general-purpose"
  prompt: "[Autonomous worker prompt with agent name: Beta]"
  run_in_background: true

# Agent Gamma - Start immediately (will wait for available tasks)
Task tool:
  subagent_type: "general-purpose"
  prompt: "[Autonomous worker prompt with agent name: Gamma]"
  run_in_background: true
```

Once Task 1 completes, Tasks 2, 3, 4 become available and all 3 agents can work in parallel.

## Benefits of This Approach

✅ **Autonomous**: Agents work independently without manual coordination
✅ **Visible**: Task list shows clear progress
✅ **Parallel**: Multiple agents work simultaneously when possible
✅ **Coordinated**: Dependencies prevent work happening out of order
✅ **Scalable**: Add more agents as more parallel work becomes available
✅ **Resumable**: If agent stops, another can pick up the work

## Current Status

**Phase 1 Active**
- Task #1: Ready for pickup (no blockers)
- Tasks #2-4: Waiting for Task #1 to complete

**Ready to launch agents!**
