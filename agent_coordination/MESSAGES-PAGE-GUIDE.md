# Messages Page Guide

**Access at:** http://localhost:8001/messages.html

---

## 📋 Overview

The Messages page provides a centralized view of all agent communication, errors, and task history in the MJ_Online coordination system.

---

## 🎯 Features

### 1. Three Message Sections

**💬 Coordination Messages**
- Agent-to-agent communication
- Status updates and progress reports
- Agent announcements
- Coordination requests

**🚨 Error Messages**
- Error reports from agents
- Task failures
- System issues
- Problems that need attention

**📋 Task History**
- All tasks published to the system
- Task status changes (available → claimed → completed)
- Task assignments and completions
- Who worked on what and when

### 2. Powerful Filtering

**Filter by Agent:**
- See messages from a specific agent only
- Dropdown populated with all agents that have sent messages

**Filter by Channel:**
- Show only Coordination, Errors, or Tasks
- Or view all channels together

**Filter by Limit:**
- Show last 50, 100, 200, or 500 messages
- Useful for viewing recent activity or deep history

### 3. Auto-Refresh

- Page automatically refreshes every 10 seconds
- Always shows the latest messages
- No manual refresh needed

### 4. Export Functionality

- Click "📥 Export" to download messages as a text file
- Respects current filters
- Filename includes current date
- Easy to share or archive

---

## 🚀 How to Use

### Viewing All Messages

1. Open http://localhost:8001
2. Click the **💬 Messages** tab at the top
3. View all three message sections

### Filtering Messages

1. Use the filter dropdowns at the top:
   - **Filter by Agent** - Select specific agent or "All Agents"
   - **Filter by Channel** - Select Coordination, Errors, Tasks, or "All Channels"
   - **Show Last** - Choose how many messages to display

2. Click **Apply Filters** to update the view

### Reading Messages

Each message shows:
- **Agent name** (who sent it)
- **Channel badge** (COORD, ERROR, or TASK)
- **Timestamp** (when it was sent)
- **Message content** (what was said)

Messages are color-coded:
- **Blue** - Coordination messages
- **Red** - Error messages
- **Green** - Task messages

### Exporting Messages

1. Apply any filters you want
2. Click **📥 Export** button
3. Text file downloads automatically
4. Open in any text editor

---

## 💡 Common Use Cases

### Check What Work Has Been Assigned

1. Go to Messages page
2. Scroll to **Task History** section
3. See all tasks published, claimed, and completed

**What you'll see:**
```
Task claimed: "Research Ghost Themes" (ID: task-5)
Task completed: "Draft About Page" (ID: task-6)
```

### See Who's Been Communicating

1. Go to Messages page
2. View **Coordination Messages** section
3. See all agent status updates and announcements

**What you'll see:**
```
[4:05 PM] Agent-Alpha
"Starting work on Task 5: Research Ghost Themes"

[4:15 PM] Agent-Beta
"Task 3 completed successfully - ready for review"
```

### Find Communication Problems

1. Go to Messages page
2. Check **Error Messages** section
3. Look for repeated errors or stuck agents

**What you'll see:**
```
[3:30 PM] Agent-Gamma
"Error in task task-7: Connection timeout"

[3:35 PM] Agent-Gamma
"Error in task task-7: Connection timeout"
```

If you see the same error multiple times, there's likely a problem to investigate.

### Review Specific Agent Activity

1. Go to Messages page
2. Select agent from **Filter by Agent** dropdown
3. Click **Apply Filters**
4. See only that agent's messages

**Use this to:**
- Track progress of a specific agent
- Debug issues with one agent
- Review what an agent has accomplished

### Export Communication Log

1. Go to Messages page
2. Apply any filters you want
3. Click **📥 Export**
4. Save the file

**Use this to:**
- Archive communication history
- Share updates with team
- Review past conversations
- Debug issues offline

---

## 🎨 Visual Guide

### Messages Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  💬 Agent Messages                                          │
│  View agent communication, errors, and task history         │
│                                                              │
│  [📊 Dashboard] [💬 Messages] ← Navigation Tabs            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Filter by Agent: [All Agents ▼]                      │  │
│  │ Filter by Channel: [All Channels ▼]                  │  │
│  │ Show Last: [100 messages ▼]                          │  │
│  │ [Apply Filters] [📥 Export]                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  💬 Coordination Messages                            (50)   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🤖 Agent-Alpha [COORD]        1/30/2026, 4:05 PM    │  │
│  │ Starting work on Task 5: Research Ghost Themes       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  🚨 Error Messages                                     (2)   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🤖 Agent-Beta [ERROR]         1/30/2026, 3:30 PM    │  │
│  │ Connection timeout while fetching data               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  📋 Task History                                      (100)  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🤖 Agent-Alpha [TASK]         1/30/2026, 4:00 PM    │  │
│  │ Task completed: "Research Ghost Themes" (ID: task-5) │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Message Flow

### How Messages Appear

1. **Agent sends message** via coordination channel
   ```python
   await worker.send_coordination_message("Starting task 5")
   ```

2. **Message stored** in NATS JetStream
   - Persisted for 7 days
   - Available to all system components

3. **Dashboard fetches** messages via API
   - `/api/messages/coordination`
   - `/api/messages/errors`
   - `/api/tasks`

4. **Page displays** messages
   - Auto-refresh every 10 seconds
   - Filtered and sorted
   - Color-coded by type

---

## 📊 API Endpoints Used

The Messages page uses these API endpoints:

```
GET /api/messages/coordination?limit=500
GET /api/messages/errors?limit=500
GET /api/tasks
```

You can also access these directly:
```bash
# Get coordination messages
curl http://localhost:8001/api/messages/coordination

# Get error messages
curl http://localhost:8001/api/messages/errors

# Get task history
curl http://localhost:8001/api/tasks
```

---

## 🎯 Tips & Best Practices

### For Reviewing Activity

1. **Start with Coordination** - See what agents are doing
2. **Check Errors** - Identify any problems
3. **Review Tasks** - Verify work was completed

### For Debugging

1. **Filter by agent** that's having issues
2. **Look for error patterns** - Same error repeated?
3. **Check task history** - Did task complete?
4. **Export for analysis** - Share with troubleshooter

### For Monitoring

1. **Bookmark the Messages page**
2. **Check errors section daily**
3. **Review coordination for updates**
4. **Export weekly for records**

### For Performance

- Use **smaller limits** (50 messages) for faster loading
- Use **agent filter** to reduce data
- **Export** if you need to review large amounts of data

---

## 🚨 Warning Signs to Look For

### Communication Problems

**Look for:**
- Same error message repeated multiple times
- Agent claiming tasks but never completing them
- Long gaps between messages from an agent
- Tasks stuck in "claimed" status for hours

**What to do:**
- Check agent heartbeat status on Dashboard
- Review error messages for clues
- Check if agent is still running
- Contact NATS-Troubleshooter-Agent for help

### Task Assignment Issues

**Look for:**
- Tasks with no claims (no one working on them)
- Multiple agents claiming the same task
- Tasks blocked for long periods
- Completed tasks not marked as complete

**What to do:**
- Review task dependencies (blocked_by)
- Check agent availability
- Verify task priority is set correctly
- Coordinate with Project Manager agent

---

## 🔗 Quick Links

**Navigation:**
- **Dashboard:** http://localhost:8001/
- **Messages:** http://localhost:8001/messages.html
- **API Docs:** http://localhost:8001/docs
- **Health Check:** http://localhost:8001/health

**Related Docs:**
- `/agent_coordination/DASHBOARD-FEATURES-GUIDE.md` - Dashboard features
- `/agent_coordination/TROUBLESHOOTER-FINDINGS-2026-01-30.md` - System status
- `/CLAUDE.md` - Agent coordination guide

---

## ✅ Summary

The Messages page gives you complete visibility into:

- ✅ **What work** has been assigned (Task History)
- ✅ **Who's been communicating** (Coordination Messages)
- ✅ **Where problems exist** (Error Messages)
- ✅ **Real-time updates** (Auto-refresh every 10s)
- ✅ **Powerful filtering** (By agent, channel, limit)
- ✅ **Easy export** (Download as text file)

**Access it now:** http://localhost:8001/messages.html

---

**Last Updated:** 2026-01-30
**Created By:** NATS-Troubleshooter-Agent
