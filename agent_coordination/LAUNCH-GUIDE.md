# Autonomous Agents - Quick Launch Guide

## ✅ Setup Complete!

All agents now have autonomous mode built into their definitions. No separate Python scripts needed!

---

## 🚀 How to Launch Agents in Autonomous Mode

### Terminal 1: Debbie (Design Agent)

```
Launch Debbie via Task tool or chat, then tell her:

"Run autonomous mode"
```

**What happens:**
- Debbie reads her agent definition
- Finds the autonomous mode Python code
- Executes it to connect to NATS
- Starts listening for design tasks
- You can still talk to her while she listens!

---

### Terminal 2: Doc Brown (Mobiledoc Assembler)

```
Launch Doc Brown via Task tool, then:

"Run autonomous mode"
```

**What happens:**
- Connects to NATS
- Listens for mobiledoc conversion tasks
- Converts PAGE_SPEC to Mobiledoc JSON when tasks arrive
- Automatically hands off to Alice

---

### Terminal 3: Alice (Web Content Builder)

```
Launch Alice via Skill invocation, then:

"Run autonomous mode"
```

**What happens:**
- Connects to NATS
- Listens for publishing tasks
- Publishes Mobiledoc JSON to Ghost Pro
- Final step in workflow!

---

### Terminal 4: Morgan (Project Manager/Orchestrator)

```
Launch Morgan via Task tool, then:

"Run autonomous mode"
```

**What happens:**
- Connects to NATS
- Monitors all task completions
- Automatically publishes next task in workflow
- Orchestrates: Design → Mobiledoc → Publishing

---

## 🎯 Test the Full Workflow

### Step 1: Launch All Agents

Open 4 terminals and launch each agent in autonomous mode (see above).

### Step 2: Publish a Test Task

```bash
cd /Users/michaeljones/Dev/MJ_Online/agent_coordination
python3 publish_test_task.py \
  --type design \
  --title "Design About page" \
  --description "Create visual design for About page with RAG-verified content"
```

### Step 3: Watch the Magic!

**Terminal 1 (Debbie):**
```
📥 NEW TASK RECEIVED: test-design-XXXXX
🚀 Starting design work...
✅ TASK COMPLETE
📣 Notified mobiledoc-assembler
```

**Terminal 4 (Morgan):**
```
📥 TASK COMPLETED: test-design-XXXXX
🤔 Orchestrating next step...
✅ Published: mobiledoc-test-design-XXXXX
```

**Terminal 2 (Doc Brown):**
```
📥 NEW TASK RECEIVED: mobiledoc-test-design-XXXXX
⚗️  Converting to Mobiledoc JSON...
✅ TASK COMPLETE
📣 Notified web-content-builder
```

**Terminal 4 (Morgan):**
```
📥 TASK COMPLETED: mobiledoc-test-design-XXXXX
🤔 Orchestrating next step...
✅ Published: publish-mobiledoc-test-design-XXXXX
```

**Terminal 3 (Alice):**
```
📥 NEW TASK RECEIVED: publish-mobiledoc-test-design-XXXXX
📝 Publishing to Ghost Pro...
✅ TASK COMPLETE
🎉 Workflow complete - content is live!
```

---

## 💬 Interacting with Autonomous Agents

**While agents are listening, you can still talk to them!**

```
You: "Hey Debbie, what task are you working on?"

Debbie: "I just completed the About page design and am now
         listening for the next design task."

You: "Can you explain why you chose that color palette?"

Debbie: "I chose teal and navy because [explanation from her work]..."
```

**Each agent has ONE session that handles both:**
- ✅ NATS coordination (automatic)
- ✅ Direct interaction (when you talk to them)

---

## 🔄 The Complete Workflow

```
You → Publish design task
  ↓
Debbie → Claims task → Does design work → Reports completion
  ↓
Morgan → Sees completion → Publishes mobiledoc task
  ↓
Doc Brown → Claims task → Converts to Mobiledoc → Reports completion
  ↓
Morgan → Sees completion → Publishes publishing task
  ↓
Alice → Claims task → Publishes to Ghost → Reports completion
  ↓
Morgan → Sees completion → Updates roadmap
  ↓
Done! ✅
```

**All automatic after the initial task is published!**

---

## 🛠️ What Works vs. What Needs Implementation

### ✅ What Works RIGHT NOW:

- **Workflow coordination**: Fully automatic
- **Task claiming**: Agents automatically grab matching tasks
- **Agent handoffs**: Debbie → Doc Brown → Alice
- **Heartbeat monitoring**: Every 30 seconds
- **Morgan orchestration**: Publishes next tasks automatically
- **Dashboard visibility**: http://localhost:8001

### ⚠️ What Still Has Placeholder Logic:

**Real work execution** - The actual work (design, conversion, publishing) uses placeholder logic currently. Each agent needs their execute functions implemented with real Read/Write/API calls.

**Current state:**
```python
# Placeholder - simulates work
await asyncio.sleep(2)
result = {"summary": "Work completed", ...}
```

**What's needed:**
```python
# Real work - uses Claude Code tools
design_spec = await read_file(PAGE_SPEC)
mobiledoc = convert_to_mobiledoc(design_spec)
await write_file(output_path, mobiledoc)
result = {"summary": "Real work completed", ...}
```

**The infrastructure is complete. The work execution needs real implementation.**

---

## 📊 Monitoring

**Dashboard:** http://localhost:8001
- See all agents and their status
- View task queue
- Monitor heartbeats
- Check coordination messages

**Messages Page:** http://localhost:8001/messages.html
- See agent communication
- View error logs
- Track task history

---

## 🎉 You're Ready!

1. Launch all 4 agents in autonomous mode
2. Publish a test task
3. Watch the workflow execute automatically
4. Talk to agents anytime for questions

**The autonomous coordination system is operational!** 🚀
