# Project Manager: Instruction Gap Analysis
**Date:** 2026-01-30
**Reviewer:** Project-Manager-Claude

---

## Executive Summary

Comparing Project-Manager.md instructions to actual behavior reveals significant additions (NATS integration) but critical gaps (roadmap maintenance).

---

## What the Instructions Say

### Core Functions (Per Instructions)
1. Decompose features into atomic, agent-executable phases
2. Organize phases into parallelizable batches
3. **Maintain the roadmap as the single source of truth**
4. Dispatch work to agents and track completion
5. Archive completed work

### 4 Workflow Modes Defined

#### 1. Planning Mode
- Summarize implementation scope
- Identify affected systems
- Decompose into phases
- Group into batches
- **Create roadmap in plans/roadmap.md**
- Create detailed plans for complex phases

#### 2. Dispatch Mode
- **Update roadmap: Mark phases as 🟡 In Progress, assign agent**
- Prepare context for agents
- Dispatch to agents
- **Log dispatch in roadmap**

#### 3. Tracking Mode
- Query agent status
- **Update task checkboxes as work completes**
- **When phase completes:**
  - Move to completed/roadmap-archive.md
  - Remove from roadmap.md
  - Check if blocked phases unblocked

#### 4. Archive Mode
- Copy phase to completed/roadmap-archive.md under today's date
- Add completion metadata
- **Delete phase from roadmap.md**
- Review batch status

### Key Rules
- **"Roadmap is truth"**: All active work lives in roadmap.md, completed work in archive
- **"Archive immediately"**: The moment work completes, move it out of active roadmap
- **Status icons**: ⚪ Not Started, 🟡 In Progress, 🟢 Complete, 🔴 Blocked

---

## What I'm Actually Doing

### ✅ ADDED Capabilities (Not in Instructions)

#### 1. NATS Coordination System Integration
**What I do:**
- Register with NATS as "Project-Manager-Claude"
- Publish tasks to NATS JetStream queue
- Monitor coordination channel for agent messages
- Send messages to agents via coordination channel
- Track agent heartbeats and registration status
- Monitor task claims and completions via NATS

**Where it's documented:**
- CLAUDE.md "Agent Coordination via NATS JetStream" section
- MJ_Online specific addition, not in generic PM instructions

**Gap:** Instructions say "dispatch to agents" but don't specify HOW. I'm using NATS queue.

---

#### 2. Queue Management & Infrastructure
**What I do:**
- Debug and fix NATS task deduplication issues
- Clean up stale tasks from queue
- Verify queue accuracy and consistency
- Republish tasks with correct timestamps
- Monitor queue health via dashboard (http://localhost:8001)

**Gap:** Instructions don't mention queue management or infrastructure debugging at all.

---

#### 3. OpenSpec Review Workflow
**What I do:**
- Review business analysis reports from Business-Analyst-Agent
- Approve/reject feature specifications
- Create implementation tasks from approved specs
- Document approval decisions in /devlog/

**Gap:** Instructions don't mention specification review process.

---

#### 4. Agent Communication
**What I do:**
- Send detailed messages to agents via NATS coordination channel
- Provide task assignments with full context via messages
- Respond to agent questions/reports via coordination channel
- Format messages with headers, sections, and formatting

**Gap:** Instructions say "prepare context" but don't specify communication method.

---

### ❌ MISSING Capabilities (Should Be Doing, But Not)

#### 1. Roadmap Maintenance
**What instructions say I should do:**
- Update roadmap.md when agents claim tasks (mark 🟡 In Progress)
- Update roadmap.md when agents complete tasks (mark 🟢 Complete)
- Update task checkboxes [ ] → [x] as work progresses
- Assign agent names to phases in roadmap

**What I'm actually doing:**
- ❌ NOT updating roadmap.md status icons
- ❌ NOT updating task checkboxes
- ❌ NOT assigning agent names in roadmap
- ✅ Only tracking status via NATS queue

**Impact:** Roadmap.md is stale and doesn't reflect current work status

---

#### 2. Archive Completed Work
**What instructions say I should do:**
- When phase completes, copy to completed/roadmap-archive.md
- Add completion metadata (agent, date, notes)
- DELETE completed phase from roadmap.md
- Archive immediately (moment work completes)

**What I'm actually doing:**
- ❌ NOT archiving completed work
- ❌ NOT removing completed phases from roadmap.md
- ❌ completed/roadmap-archive.md doesn't exist yet

**Impact:** Roadmap accumulates completed work instead of showing only active work

---

#### 3. Proper Dispatch Mode Usage
**What instructions say I should do:**
- Update roadmap with status and agent assignment FIRST
- Then dispatch to agents
- Log dispatch in roadmap

**What I'm actually doing:**
- Publishing tasks to NATS queue (not updating roadmap)
- Sending NATS messages to agents (not logging in roadmap)
- Tracking via NATS, not roadmap

**Impact:** Roadmap doesn't show who's working on what

---

#### 4. Tracking Mode Checkboxes
**What instructions say I should do:**
- Update task checkboxes as work completes
- Query agent status and update roadmap to reflect current state

**What I'm actually doing:**
- Querying NATS for agent status (correct)
- ❌ NOT updating checkboxes in roadmap.md

**Impact:** Roadmap tasks all show [ ] instead of [x] for completed items

---

## Gap Analysis Summary

### Architecture Mismatch

**Instructions assume:**
- Roadmap.md is the single source of truth
- Agents report to PM, PM updates roadmap
- Roadmap drives all coordination

**Actual implementation:**
- NATS JetStream queue is the source of truth
- Agents register with NATS and claim tasks from queue
- Roadmap.md is reference documentation, not live state
- Dashboard (http://localhost:8001) shows live state

### What This Means

**Current state:**
- ✅ NATS coordination working well (agents register, claim tasks, report)
- ✅ Queue management working (tasks published, claimed, completed)
- ✅ Agent communication working (coordination messages sent)
- ❌ Roadmap.md is **STALE** and doesn't reflect current work
- ❌ No archive of completed work
- ❌ Can't see work status by reading roadmap alone

---

## Recommendations

### Option 1: Follow Instructions (Roadmap-First)
**Change behavior to:**
1. Update roadmap.md whenever NATS task status changes
2. Archive completed work to completed/roadmap-archive.md
3. Use roadmap as source of truth, NATS as implementation detail

**Pros:**
- Matches PM instructions exactly
- Roadmap always current
- Clear audit trail in archive

**Cons:**
- Dual maintenance (NATS + roadmap)
- More work on every status change
- Potential for NATS/roadmap to get out of sync

---

### Option 2: Update Instructions (NATS-First)
**Revise Project-Manager.md to:**
1. Document NATS as primary coordination mechanism
2. Make roadmap.md a planning document (not live state)
3. Use dashboard for live status tracking
4. Optional: Periodically sync roadmap from NATS

**Pros:**
- Matches current behavior
- Single source of truth (NATS)
- Dashboard provides live view

**Cons:**
- Instructions diverge from generic PM pattern
- Roadmap becomes less useful for status tracking
- Need to check dashboard for current state

---

### Option 3: Hybrid Approach (Recommended)
**Combine both:**
1. **Planning & Reference**: Use roadmap.md for planning and high-level structure
2. **Execution**: Use NATS queue for task execution and agent coordination
3. **Status Sync**: Update roadmap.md status periodically (daily or when batch completes)
4. **Archive**: Archive completed batches (not individual phases) to keep roadmap clean

**Workflow:**
- When planning: Create/update roadmap.md
- When dispatching: Publish to NATS + update roadmap with agent assignment
- During execution: Track via NATS/dashboard (don't update roadmap for every checkbox)
- When batch completes: Update roadmap, archive completed batch
- Daily: Quick sync of major status changes to roadmap

**Pros:**
- Best of both worlds
- Roadmap stays readable (not cluttered with constant updates)
- NATS provides real-time coordination
- Archive captures completed work

**Cons:**
- Still some dual maintenance
- Need discipline to sync periodically

---

## Current Gaps to Address

### Immediate (This Session)
1. ✅ Create completed/roadmap-archive.md
2. ✅ Archive Phase 1 completed work (1.2, 1.3, 1.4)
3. ✅ Archive Phase 2.1 completed work (Theme selection)
4. ✅ Update roadmap.md to mark Phase 2.2-2.6 as ⚪ Not Started (correct current state)
5. ✅ Update roadmap.md to mark Phase 3.3 as 🟡 In Progress (Web-Content-Builder-Agent-1)

### Ongoing
6. When agents complete work: Update roadmap status + archive
7. When new batch starts: Update roadmap with agent assignments
8. Weekly: Review roadmap vs NATS queue for consistency

---

## Conclusion

**Key Finding:** I've added NATS coordination capabilities (good!) but stopped maintaining the roadmap as source of truth (bad!).

**Recommendation:** Adopt **Hybrid Approach** - use NATS for execution, but keep roadmap.md updated with batch-level status and archive completed work.

**Next Action:** User should decide which approach to use, then I'll implement it consistently.

---

**Analysis Complete:** 2026-01-30
**Analyst:** Project-Manager-Claude
**Status:** Ready for user decision on approach
