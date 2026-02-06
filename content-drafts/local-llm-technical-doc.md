# Local LLM Setup: Technical Documentation

*Documentation Date: 2026-02-03*
*Updated: 2026-02-03 (Added mcpo/MCP infrastructure details)*
*Documented by: TED (Technical-Research-Agent)*
*For Case Study: Task 3.7 - Self-Hosted LLM Infrastructure*
*Interview Conducted: 2026-02-03 with Mike Jones*

**Update Note:** After initial interview documentation, additional technical details were discovered in project documentation (`/assets/projects/local-LLM/`). This version includes comprehensive coverage of:
- mcpo (MCP-to-OpenAPI bridge) as third critical service
- Model Context Protocol (MCP) integration for filesystem access
- RAG implementation with nomic-embed-text embeddings
- Complete auto-start infrastructure (3 LaunchAgents + rtai CLI)
- Knowledge collections and semantic search architecture

---

## Executive Summary

Mike Jones's Local LLM Setup is a sophisticated self-hosted AI infrastructure running on an Apple Mac Mini M4 Pro. The system features **three core services**: Ollama (model serving), Open WebUI (browser interface), and mcpo (Model Context Protocol bridge), working together to provide a privacy-preserving AI platform with advanced filesystem access and RAG capabilities.

**Architecture Highlights:**
- **Qwen 2.5:14B** as primary inference model with tool support
- **mcpo bridge** enabling Model Context Protocol (MCP) integration
- **Filesystem MCP** providing direct read/write access to knowledge base
- **RT-Assistant** cross-platform memory system (JSONL ledger)
- **RAG integration** with nomic-embed-text embeddings and knowledge collections
- **Complete auto-start** infrastructure with LaunchAgents and management CLI

**Primary Achievement:** Built complete understanding of LLM deployment, configuration, and operations while creating foundation for AI prototype development without expensive API costs.

**Key Value:** The project delivered significant learning and capability-building rather than immediate productivity gains. Mike gained deep technical knowledge of LLM operations, Model Context Protocol, RAG implementation, chunking, and infrastructure deployment—skills that position him for enterprise AI implementation work.

**Technical Sophistication:** This isn't just "installed Ollama"—it's a production-grade three-service architecture with filesystem integration, automated memory management, RAG collections, and complete auto-start infrastructure.

**Current Status:** Active experimental system. While daily work has returned to cloud APIs (Claude Code, ChatGPT) due to better performance, the local setup remains available for privacy-sensitive work and continues to serve as a learning platform for emerging AI technologies like agentic systems (OpenClawd, ClawdBot).

---

## Problem & Motivation

### The Privacy Problem

**Primary Driver:** Data sovereignty and privacy protection for valuable work.

Mike wanted to work on important projects without exposing sensitive data to commercial AI providers. His concern wasn't theoretical—he was actively using ChatGPT and Claude for multiple projects and spending significant money on various AI tools (Replit, Lovable, Napkin, Gamma, N8n automation). The question arose: "What happens to my project data when I feed it to these systems?"

### The Context Loss Problem

**Secondary Driver:** Memory persistence across AI platforms.

A critical pain point emerged: moving between AI tools meant losing all context. Each new conversation started fresh, requiring constant re-explanation of project background, decisions, and architecture. Mike needed an integrated memory system where context could follow him across Claude, ChatGPT, and any other AI tool.

### The Learning Challenge

**Tertiary Driver:** Technical understanding and capability building.

Mike wanted to understand how to actually deploy and operate LLM infrastructure. Could he set up a production-grade system? What would it take? The only way to find out was to build it.

### Trigger Event

The combination of **privacy concerns + wanting to understand the technical challenge** led Mike to pull the trigger. He purchased a Mac Mini M4 Pro specifically with LLM deployment in mind.

**Timing Context:** About 2 months after Mike built this system, Claude launched native memory features, reducing reliance on the local setup. However, the learning value and infrastructure knowledge gained made the effort worthwhile regardless of timing.

---

## Hardware Infrastructure

### Specifications

| Component | Details |
|-----------|---------|
| **Model** | Apple Mac Mini M4 Pro (2024) |
| **CPU** | Apple M4 Pro chip (Apple Silicon) |
| **RAM** | 24 GB unified memory |
| **Storage** | 4 TB external/extended storage (MacMini_Extended volume) |
| **Deployment** | Personal daily-use machine (concurrent LLM + regular work) |
| **Availability** | Always running, available on-demand |
| **Access** | Local only (no remote access currently) |
| **Year** | 2024 (current generation hardware) |

### Hardware Rationale

**Selection Driver:** Purchased specifically for LLM deployment.

The Mac Mini M4 Pro was selected because:
1. **Cutting-edge Silicon:** M4 Pro with 24GB unified memory ideal for running 14B parameter models
2. **Concurrent Usage:** Could serve LLM while being used for regular daily work
3. **Recent Purchase:** Bought in 2024 with LLM deployment as a key consideration
4. **Cost-Effective:** Compared to dedicated servers, the Mac Mini serves dual purpose

**Alternatives Considered:**
- Dedicated server (still considering)
- Cloud instance (still considering, blocked by security research)

### Hardware Performance Notes

**Concurrent Usage:** System runs LLM continuously in background while Mike uses the Mac Mini for regular work (web browsing, development, etc.).

**Performance Impact:** No noticeable performance degradation during concurrent usage. The M4 Pro has never maxed out during LLM operations.

**RAM Utilization:** Plenty of headroom with 24GB. Only RAM pressure experienced from Claude Code usage, not from local LLM.

**Storage:** Minimal footprint—model files plus all context/memory files use nowhere near 1TB of the 4TB available.

### Cost Analysis

**Hardware Investment:**
- Mac Mini M4 Pro (2024): ~$1,799-2,299 (varies by config)
- 4TB External Storage: ~$100-300

**Cloud Cost Reality:**
- **Goal:** Reduce cloud AI spending
- **Outcome:** Cloud expenses actually increased (heavy Claude Code usage)
- **ChatGPT usage:** Decreased significantly
- **Net effect:** Local LLM did not reduce overall AI spending

**Long-term Value:**
- Capability building for client deployments
- Foundation for AI prototype development
- Avoided expensive API costs for prototype testing
- Skills to deploy production alternatives to ChatGPT API

---

## Software Stack

### LLM Models

**Primary Inference Model:**
- **Name:** Qwen 2.5:14b-instruct
- **Size:** 14 billion parameters (14B)
- **Variant:** Instruct-tuned with tool support
- **Quantization:** Unknown/full precision (user unfamiliar with quantization)
- **Selection Rationale:** Community recommendations
- **Capabilities:** Tool invocation support (critical for MCP integration)

**Active Embeddings Model:**
- **Name:** nomic-embed-text
- **Purpose:** RAG (Retrieval-Augmented Generation) document embeddings
- **Use case:** Knowledge base vector search in Open WebUI

**Additional Models Installed (Experimental):**
- Qwen 2.5 (variations)
- Qwen 2.5 Coder
- Qwen 3
- Llama 3.1
- Gemma 3
- TinyLlama
- MXBai Embed Large (alternative embeddings model)

**Model Management:** Ollama handles model management automatically. Mike occasionally swaps models to test different options, primarily experimenting with larger models for writing quality improvements.

### Serving Infrastructure

**Platform:** Ollama
**Version:** Current (as of 2024)
**Port:** 11434
**Selection Reason:** First tool investigated when researching LLM deployment; easiest to understand and get started with
**Deployment:** Running natively on macOS desktop environment
**API:** Provides OpenAI-compatible API at `http://localhost:11434`

### Model Context Protocol (MCP) Integration

**Critical Component:** mcpo (MCP-to-OpenAPI Bridge)

**What is mcpo?**
mcpo is a bridge service that translates Model Context Protocol (MCP) to OpenAPI, enabling Open WebUI to access filesystem tools that communicate via STDIO.

**Configuration:**
- **Port:** 11620
- **Host:** 127.0.0.1 (localhost binding for security)
- **Transport:** STDIO-based MCP communication (not TCP)
- **Root Directory:** `/Volumes/MacMini_Extended/rt-assistant`

**Command:**
```bash
uvx mcpo --host 127.0.0.1 --port 11620 -- \
  npx -y @modelcontextprotocol/server-filesystem \
  /Volumes/MacMini_Extended/rt-assistant
```

**Purpose:**
- Bridges Filesystem MCP server to OpenAPI format
- Enables Open WebUI to access filesystem via MCP tools
- Provides read/write capabilities to knowledge base
- Allows LLM to directly interact with memory ledger and documents

**Integration with Open WebUI:**
- Configured as External Tool: `http://host.docker.internal:11620`
- Enables tool invocation from containerized Open WebUI
- Relative path convention: e.g., `memory/memory.jsonl`, `_scratch/hello.txt`

**Significance:**
This is THE mechanism that enables the local LLM to actually read and write to the memory system. Without mcpo, the memory integration would be read-only via Docker mounts. With mcpo + MCP, the LLM has active filesystem access for true read/write memory persistence.

### Three-Service Architecture

The complete system consists of **three critical services**:

1. **Ollama** (Port 11434) - Model inference backend
2. **Open WebUI** (Port 3000) - Browser interface
3. **mcpo** (Port 11620) - MCP bridge for filesystem access

All three services must be running for full functionality.

### Architecture

**Operating System:** macOS Sequoia (latest as of 2024)

**Containerization:** Docker Desktop for Mac
- Docker used exclusively for Open WebUI
- Ollama runs natively on macOS

**Interface:** Open WebUI (browser-based)
- **Deployment:** Docker container
- **Port:** 3000 (browser access at http://localhost:3000)
- **Image:** ghcr.io/open-webui/open-webui:main

**API Layer:** Ollama provides OpenAI-compatible API (not yet utilized programmatically)

**Primary Access:** Open WebUI web interface in browser

### Docker Configuration

**Docker Compose Details** (from `start_openwebui.sh`):

```bash
docker run -d \
    --name openwebui \
    -p 3000:8080 \
    -v /Volumes/MacMini_Extended/openwebui_data:/app/backend/data \
    -v /Volumes/MacMini_Extended/rt-assistant:/rt:rw \
    -v /Volumes/MacMini_Extended/rt-assistant/knowledge/memory:/app/backend/data/memory:rw \
    --add-host=host.docker.internal:host-gateway \
    --restart unless-stopped \
    ghcr.io/open-webui/open-webui:main
```

**Key Mounts:**
- `openwebui_data` → `/app/backend/data` (persistent Open WebUI data)
- `rt-assistant` → `/rt:rw` (full knowledge base access, read-write)
- `knowledge/memory` → `/app/backend/data/memory:rw` (memory ledger integration, read-write)

**Environment Variables:**
- `DOCS_DIR=/rt/knowledge/articles` (RAG document source directory)

**Network Access:**
- `--add-host=host.docker.internal:host-gateway` (enables container to reach host services)
- Allows Open WebUI to connect to Ollama at `http://host.docker.internal:11434`
- Allows Open WebUI to connect to mcpo at `http://host.docker.internal:11620`

**Auto-Restart:**
- `--restart unless-stopped` ensures container restarts on Docker daemon restart

**Configuration Complexity:**
- Initial setup took ~1 week to fully understand
- Biggest challenge: Understanding Open WebUI configuration settings
- Profiles/skills setup required significant learning
- Model tuning for desired output required iterative refinement
- MCP tool configuration and relative path conventions added complexity

---

## Memory System Integration (RT-Assistant)

### Overview

The Local LLM integrates with **RT-Assistant**, a comprehensive cross-platform knowledge management system that maintains persistent context across all AI tools (Claude, ChatGPT, local LLMs).

**System Version:** v2.0 (major standardization: 2025-09-25)
**Established:** 2025-01-17

### Architecture

**Knowledge Base Location:**
`/Volumes/MacMini_Extended/rt-assistant/knowledge/`

**Directory Structure:**
```
/rt-assistant/knowledge/
├── _system/          # System configuration & docs
├── _memories/        # Global & project memories
├── articles/         # Published content archive (ResilientTomorrow, etc.)
├── backlogs/         # Sprint planning & tasks
├── memory/           # Memory ledger (JSONL)
├── projects/         # Active project workspaces
├── conversations/    # Archived AI conversations
├── research/         # Research materials
└── templates/        # Document templates
```

### Memory Ledger System

**Core File:** `/knowledge/memory/memory.jsonl`

**Format:** JSONL (JSON Lines) - each line is a complete JSON object

**Example Entry:**
```json
{
  "id": "mem-2025-09-25-001",
  "timestamp": "2025-09-25T14:30:00-07:00",
  "projects": ["OfflineAI"],
  "author": "Mike",
  "type": "decision",
  "summary": "Brief summary",
  "details": "Full explanation",
  "tags": ["offline_ai", "system_admin"],
  "related_files": [],
  "links": [],
  "source_convo": "20250925-reference",
  "source": "claude"
}
```

**Memory Types:**
- `decision` - Important decisions with rationale
- `milestone` - Project achievements
- `insight` - Key learnings
- `resource` - Tools and resources
- `context` - Background information
- `note` - General observations
- `todo` - Action items
- `rationale` - Reasoning documentation

### Cross-Platform Integration

**Claude (Primary Documentation):**
- Uses MCP (Model Context Protocol) for filesystem access
- Reads `memory.jsonl` directly during conversations
- Writes new entries via structured prompts
- Direct access to ledger and all memory files

**ChatGPT (Alternative Analysis):**
- Manual process
- Ask ChatGPT to create memory entries
- Manually move created entries to ledger
- Requires post-processing (format inconsistencies)

**OpenWebUI/Ollama (Local Processing):**
- Memory file mounted in Docker container via bind mount
- **MCP integration via mcpo:** Provides active read/write filesystem access
- LLM automatically loads some memories
- Manual trigger to access full ledger via MCP tools
- Can access individual JSON files below ledger level using relative paths
- **Maintenance:** Monthly compacting/archiving of ledger

### Docker Mount Integration

From Docker configuration:
```bash
-v /Volumes/MacMini_Extended/rt-assistant/knowledge/memory:/app/backend/data/memory:rw
```

The memory system is bind-mounted into the Open WebUI container, providing read-write access to the memory ledger from within the containerized environment.

**MCP Enhancement:**
Beyond passive Docker mounts, mcpo + Filesystem MCP provides **active tool-based access**:
- LLM can invoke MCP tools to read/write files
- Supports relative path convention (e.g., `memory/memory.jsonl`)
- Enables true persistent memory with LLM-driven updates
- Allows dynamic knowledge base modification

### RAG (Retrieval-Augmented Generation) Integration

**Purpose:** Semantic search over published articles and knowledge base documents

**Embeddings Model:** nomic-embed-text (via Ollama)

**Document Source:** `/rt/knowledge/articles` (DOCS_DIR environment variable)

**Knowledge Collections (Open WebUI):**
- **rt_articles** - Published ResilientTomorrow and Velocity Partners content
- **rt_memories** - Structured memory entries
- **rt_projects** - Project documentation
- **rt_backlogs** - Sprint planning and task information

**Collection ID (rt_articles):** `2d5ac00f-faa0-4a20-8297-36e657f78c2d`

**Auto-Sync Workflow:**
Continuous watcher script (`rt_watch_poll.sh`) monitors article directory:
1. Detects new/modified files in `/knowledge/articles`
2. Uploads to Open WebUI via `/api/v1/files/`
3. Adds to RT_Articles collection
4. Makes content available for RAG semantic search

**RAG Usage:**
When LLM receives queries, it can:
- Perform semantic search across indexed documents
- Retrieve relevant article excerpts
- Augment responses with published content context
- Reference specific articles in answers

### Performance Impact

**No noticeable performance difference** when memory context is loaded vs. without memory context.

**RAG query performance:** Not formally measured, but semantic search operates fast enough for interactive use.

---

## Automated Workflows

### 1. Nightly Memory Compaction

**Purpose:** Maintain manageable memory ledger by compacting old entries

**Implementation:** Python script + macOS LaunchAgent
**Location:** `~/Library/Application Support/offlineai/compact_memory.py`
**Schedule:** Daily at 02:05 AM + on system load

**Process:**
1. Reads `memory.jsonl` (full ledger)
2. Keeps last N entries per topic + recent items
3. Writes `memory_compact.json` (compressed version)
4. Logs to `/tmp/memory_compact_v2.log`

**Configuration:**
```python
MAX_PER_TOPIC = 8      # Keep 8 most recent per topic
RECENT_COUNT  = 20     # Keep 20 most recent overall
```

**LaunchAgent:** `com.offlineai.memorycompact.v2.plist`

**Management:**
```bash
# Reload and run
launchctl bootout gui/$(id -u)/com.offlineai.memorycompact.v2 2>/dev/null || true
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.offlineai.memorycompact.v2.plist
launchctl enable gui/$(id -u)/com.offlineai.memorycompact.v2
launchctl kickstart -k gui/$(id -u)/com.offlineai.memorycompact.v2
```

### 2. Session Context Rendering

**Purpose:** Convert compact memory to human-readable format for Open WebUI system prompts

**Implementation:** Python script
**Location:** `~/Library/Application Support/offlineai/render_memory.py`
**Trigger:** Manual (per session)

**Process:**
1. Reads `memory_compact.json`
2. Renders human-readable context block
3. Outputs to `session_context.txt`
4. User pastes into Open WebUI System Prompt

**Usage:**
```bash
/usr/bin/python3 "$HOME/Library/Application Support/offlineai/render_memory.py"
pbcopy < "$HOME/Library/Application Support/offlineai/memory/session_context.txt"
# Paste into Open WebUI → Settings → General → System Prompt
```

### 3. Continuous Article Sync (RT_Articles Collection)

**Purpose:** Monitor article folder and auto-upload new/changed content to Open WebUI knowledge base

**Implementation:** Bash script with polling
**Location:** `~/Library/Application Support/offlineai/rt_watch_poll.sh`
**Watched Folder:** `/Volumes/MacMini_Extended/rt-assistant/knowledge/articles`
**Target Collection:** RT_Articles (ID: `2d5ac00f-faa0-4a20-8297-36e657f78c2d`)

**Process:**
1. Polls article directory for changes
2. On new/modified file:
   - Upload to `/api/v1/files/` (Open WebUI)
   - Add to RT_Articles collection
3. Logs to `/tmp/rt_watch_poll.log`
4. Uses token from `~/.offlineai/token`

**Start (foreground):**
```bash
/bin/bash "$HOME/Library/Application Support/offlineai/rt_watch_poll.sh"
```

**Background mode:**
```bash
/usr/bin/nohup /bin/bash "$HOME/Library/Application Support/offlineai/rt_watch_poll.sh" >/tmp/rt_watch_poll.log 2>&1 &
echo $! > /tmp/rt_watch_poll.pid
```

**Ignore Patterns:** `.ragignore` file defines excluded patterns:
```
*.private.md
draft_*
*.tmp
.DS_Store
```

### 4. Content Atomization Pipeline

**Purpose:** Break published articles into smaller content pieces for multi-platform distribution

**Status:** Configured automation (some "set and forget" - requires review)

**Process:**
1. Monitors for new published articles
2. Takes completed article
3. Breaks down into smaller content pieces
4. Atomizes for multi-platform distribution

**Use Case:** Repurpose long-form content (ResilientTomorrow, Velocity Partners) for other channels

**Future Enhancement:** Automate deployment of atomized content to social media streams

### Python Technology Stack

**Core Libraries:**
- Standard library: `json`, `os`, `datetime`, `collections`
- File system operations: `pathlib`
- HTTP requests: `curl` (via shell) for API interactions
- Process automation: LaunchAgents (macOS native scheduling)

---

## Architecture Diagram Description

### System Components

```
┌───────────────────────────────────────────────────────────────┐
│                    Mac Mini M4 Pro                             │
│                 (macOS Sequoia, 24GB RAM)                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              macOS Native Services                        │ │
│  │                                                            │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │  Ollama (Port 11434)                                │  │ │
│  │  │  • Qwen 2.5:14B-instruct (primary)                  │  │ │
│  │  │  • nomic-embed-text (RAG embeddings)                │  │ │
│  │  │  • Multiple experimental models                     │  │ │
│  │  │  • OpenAI-compatible API                            │  │ │
│  │  └─────────────────────┬──────────────────────────────┘  │ │
│  │                        │                                   │ │
│  │  ┌─────────────────────┴──────────────────────────────┐  │ │
│  │  │  mcpo (Port 11620) - MCP Bridge                     │  │ │
│  │  │  • MCP-to-OpenAPI translation                       │  │ │
│  │  │  • Filesystem MCP server (STDIO)                    │  │ │
│  │  │  • Root: /Volumes/MacMini_Extended/rt-assistant     │  │ │
│  │  │  • Enables LLM filesystem read/write access         │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │   Docker Environment                                      │ │
│  │                                                            │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │         Open WebUI Container (Port 3000)            │  │ │
│  │  │         (ghcr.io/open-webui/open-webui:main)        │  │ │
│  │  │                                                      │  │ │
│  │  │  Services Connected:                                │  │ │
│  │  │  • Ollama: http://host.docker.internal:11434       │  │ │
│  │  │  • mcpo: http://host.docker.internal:11620         │  │ │
│  │  │                                                      │  │ │
│  │  │  Volume Mounts:                                     │  │ │
│  │  │  • /openwebui_data → persistent data               │  │ │
│  │  │  • /rt:rw → full knowledge base                    │  │ │
│  │  │  • /memory:rw → memory ledger                      │  │ │
│  │  │                                                      │  │ │
│  │  │  Environment:                                       │  │ │
│  │  │  • DOCS_DIR=/rt/knowledge/articles (RAG)           │  │ │
│  │  │                                                      │  │ │
│  │  │  RAG Collections:                                   │  │ │
│  │  │  • rt_articles (nomic-embed-text)                  │  │ │
│  │  │  • rt_memories, rt_projects, rt_backlogs          │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  External Volume: MacMini_Extended (4TB)                       │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  /Volumes/MacMini_Extended/                             │   │
│  │  ├── openwebui_data/        (Open WebUI persistence)   │   │
│  │  └── rt-assistant/           (Knowledge Base)           │   │
│  │      ├── knowledge/                                     │   │
│  │      │   ├── memory/memory.jsonl  (JSONL ledger)       │   │
│  │      │   ├── articles/            (RAG documents)       │   │
│  │      │   ├── projects/            (workspaces)          │   │
│  │      │   └── _system/             (config)              │   │
│  │      └── offlineai-macmini/  (automation scripts)       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Auto-Start (LaunchAgents + rtai CLI):                         │
│  ├── local.rt.ollama.plist      → Ollama service              │
│  ├── local.rt.openwebui.plist   → Open WebUI container        │
│  ├── local.rt.mcpo.plist         → mcpo MCP bridge            │
│  └── ~/rt-offlineai/bin/rtai    → Management CLI tool         │
│                                                                 │
│  Automation (Python scripts):                                  │
│  ├── Nightly memory compaction (02:05 AM)                     │
│  ├── Session context rendering (manual)                        │
│  └── Article sync watcher (continuous RAG updates)             │
└─────────────────────────────────────────────────────────────────┘

        User Access
            │
            ▼
   ┌────────────────────┐
   │   Web Browser      │
   │   localhost:3000   │
   └────────────────────┘
```

### Data Flow: User Prompt to Response (with MCP Tools)

1. **User opens browser** → `http://localhost:3000` (Open WebUI)
2. **User enters prompt** in Open WebUI interface
3. **Open WebUI** reads memory context from bind-mounted `/app/backend/data/memory/`
4. **Open WebUI** sends prompt + context to Ollama API at `http://host.docker.internal:11434`
5. **Ollama** loads Qwen 2.5:14B model (if not already loaded)
6. **Model determines if MCP tools needed** (e.g., read/write files)
7. **If tools required:**
   - Model invokes MCP tools via Open WebUI
   - Open WebUI calls mcpo at `http://host.docker.internal:11620`
   - mcpo translates to Filesystem MCP (STDIO)
   - Filesystem MCP reads/writes files (relative paths)
   - Results returned through mcpo → Open WebUI → Model
8. **Model inference** processes prompt with context + tool results, generates response
9. **Ollama** returns response to Open WebUI via API
10. **Open WebUI** displays response in browser interface
11. **If RAG needed:**
    - Open WebUI performs semantic search on rt_articles collection
    - Retrieves relevant document excerpts using nomic-embed-text embeddings
    - Augments context with retrieved content
12. **Session memories** (decisions/insights) captured by user or automation
13. **Nightly compaction** processes new entries into compact memory

**Key Insight:** The mcpo bridge enables the LLM to actively read and write files, not just passively access mounted volumes. This allows true persistent memory updates driven by the LLM itself.

### Cross-Platform Memory Flow

```
┌──────────────┐      ┌──────────────┐      ┌────────────────────────┐
│    Claude    │      │   ChatGPT    │      │    OpenWebUI (Local)    │
│  (Desktop)   │      │   (Web)      │      │   + mcpo + MCP         │
└──────┬───────┘      └──────┬───────┘      └──────┬─────────────────┘
       │                     │                     │
       │ MCP direct          │ Manual copy         │ Docker mount
       │ filesystem          │ paste entries       │ + mcpo bridge
       │ access              │                     │ + MCP tools
       │                     │                     │ (active R/W)
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────────────────────────────────────────────────────────┐
│          /rt-assistant/knowledge/memory/memory.jsonl              │
│                    (Shared Memory Ledger - JSONL)                 │
│                                                                    │
│  All platforms can READ and WRITE to this shared ledger:          │
│  • Claude: Native MCP filesystem access                           │
│  • ChatGPT: Manual entry creation + paste                         │
│  • OpenWebUI: mcpo bridge + Filesystem MCP + Docker mounts        │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ Nightly compaction (Python + LaunchAgent)
                            ▼
              ┌──────────────────────────┐
              │  memory_compact.json     │
              │  (8 per topic, 20 recent)│
              └──────────────────────────┘
                            │
                            │ Manual render (Python script)
                            ▼
              ┌──────────────────────────┐
              │  session_context.txt     │
              │  (Paste into Open WebUI  │
              │   system prompt)         │
              └──────────────────────────┘
```

**Key Components:**
- **Claude:** Direct MCP filesystem access (native)
- **ChatGPT:** Manual workflow (create entries → paste to ledger)
- **OpenWebUI:** Three-layer integration:
  1. Docker bind mounts (passive read access)
  2. mcpo bridge (MCP-to-OpenAPI translation)
  3. Filesystem MCP (active read/write via tools)

---

## Performance Metrics

### Inference Speed

**Subjective Assessment:** Medium-slow compared to cloud APIs

- **Tokens per second:** Not formally measured
- **Response latency:** Medium to slow - noticeably slower than Claude/ChatGPT
- **Real-world impact:** Text generation not as fast as cloud services
- **User experience:** Perceptibly slower than ChatGPT or Claude

### Resource Utilization

**CPU/GPU:**
- M4 Pro handles LLM + regular work comfortably
- Never maxed out during LLM operations
- Can click between LLM and light web browsing without performance issues

**RAM:**
- **Total:** 24GB unified memory
- **Headroom:** Plenty of free RAM
- **Only RAM pressure:** From Claude Code usage (not local LLM)
- **14B model:** Runs comfortably without memory constraints

**Storage:**
- **Total available:** 4TB external
- **LLM usage:** Minimal (nowhere near 1TB)
- **Includes:** Model files + all context/memory files + Docker volumes
- **Headroom:** Massive amount of unused storage

**Concurrency:**
- **Status:** Always running in background
- **Impact:** No noticeable system slowdown during regular work
- **Usage pattern:** LLM available on-demand while performing other tasks

### Multiple Models

**Status:** Not tested
Mike has not attempted to run multiple models simultaneously, so concurrent model serving performance is unknown.

### Comparison to Cloud APIs

| Metric | Local (Qwen 2.5:14B) | Cloud (Claude/ChatGPT) |
|--------|---------------------|------------------------|
| **Speed** | Medium-slow | Fast |
| **Quality** | Required significant tuning | Better (knows user's style) |
| **Latency** | Medium to slow | Low |
| **Cost** | Low (hardware owned) | Increased (Claude Code) |
| **Privacy** | Complete (local only) | Data sent to providers |
| **Always Available** | Yes | Requires internet |
| **Learning Curve** | 1 week for Qwen tuning | Immediate productivity |
| **User Experience** | Working, but slower | Optimized |

**Quality Notes:**
- Cloud APIs (Claude/ChatGPT) had more experience with Mike's writing style and preferences
- Local LLM required extensive prompt engineering and configuration
- Quality gap primarily due to less training data on personal style, not model capability

---

## Use Cases & Applications

### Primary Use Cases

**1. Content Writing for Publications**
- **ResilientTomorrow:** Articles for Substack publication on community resilience
- **Velocity Partners:** Case studies for Organizational Intelligence Substack
- **Requirement:** Trustworthy writing assistant for published content
- **Status:** Initially used local LLM; currently uses cloud for final verification

**2. Privacy-Sensitive Projects**
- **Goal:** Work on valuable projects without exposing data to commercial AI providers
- **Use case:** Projects where IP protection or confidentiality matters
- **Status:** Local LLM available when needed; cloud APIs improved privacy policies

**3. Decision Tracking & Project Memory**
- **Problem:** Tracking why decisions were made across multiple projects
- **Solution:** Memory system captures decision rationale, tool choices, tech stack selections
- **Value:** Can review past decision-making processes months later
- **Particularly useful:** AI-related decisions and prototype development choices

### Automated Workflows

**1. Memory System Management**
- **Automation:** Python scripts triggered daily (LaunchAgent)
- **Process:**
  - Takes provided memories
  - Checks for new files
  - Parses data
  - LLM examines and structures content
  - Writes formatted entries to memory ledger
- **Benefit:** Automated context maintenance across sessions

**2. Content Atomization for Distribution**
- **Trigger:** Monitors for new published articles
- **Process:**
  - Takes completed article
  - Breaks down into smaller content pieces
  - Atomizes for multi-platform distribution
- **Current status:** Some automations "set and forget" (requires review)
- **Future enhancement:** Automated deployment to social media streams

**3. Article Knowledge Base Sync**
- **Automation:** Continuous watcher (rt_watch_poll.sh)
- **Process:**
  - Monitors `/knowledge/articles/` for changes
  - Uploads new/modified articles to Open WebUI
  - Adds to RT_Articles collection for RAG
- **Benefit:** Published content automatically available for LLM context

### Prototype Development

**Key Capability Unlocked:** Can build AI prototypes without expensive cloud API costs

**Example Project:**
- Built prototype using OpenAI API
- Never reached production, stayed in prototyping phase
- **If it had scaled:** Would have been very expensive on ChatGPT API
- **Now:** Has confidence to deploy self-hosted alternative for production

**Value Proposition:**
- Prototype AI applications without API cost concerns
- Test ideas locally before committing to cloud infrastructure
- Foundation for client deployments

### Enterprise Vision

**Smaller Company Use Case:**
Mike identified potential enterprise application:

**Problem:** Companies need to track information, data, and decision-making across employees and projects

**Solution:** Deploy memory system for organizational knowledge management
- Each employee has personalized memory
- Individual memories consolidate to executive/management view
- Track organizational decisions, rationale, and outcomes
- Maintain context across projects and personnel changes

**Status:** Concept/vision; not implemented for clients yet

---

## Local vs. Cloud Decision Criteria

### Workflow Evolution

**Phase 1: Privacy-First (Initial deployment)**
- **Driver:** Privacy concerns paramount
- **Approach:** Use local LLM for all sensitive content
- **Goal:** Avoid sharing data with Anthropic/OpenAI

**Phase 2: Hybrid Workflow (Current)**
- **Recognition:** Cloud APIs (Claude/ChatGPT) significantly improved
- **Workflow:**
  1. **Draft:** Create content locally OR in cloud
  2. **Final verification:** Polish with Claude/ChatGPT
  3. **Experimentation:** Translating cloud workflows to local LLM
- **Goal:** Replicate cloud quality locally while maintaining privacy option

### When to Use Local LLM

**Current usage:**
- Privacy-sensitive projects
- Prototype development and testing
- Experimenting with AI workflows
- Learning and capability building

**Decreased usage:** Daily work has returned primarily to cloud APIs

### When to Use Cloud APIs

**Current preference:**
- Final content verification and polish
- Daily development work (Claude Code)
- Tasks requiring best available performance
- Work where speed matters more than privacy

### Decision Factors

- **Privacy:** Local
- **Speed:** Cloud
- **Quality:** Cloud (currently)
- **Cost at scale:** Local (for prototypes)
- **Learning:** Local
- **Production work:** Cloud (currently)

---

## Deployment Process

### Installation Steps (Approximate)

**1. Install Ollama**
- Download Ollama for macOS
- Install natively on macOS (not containerized)
- Ollama runs as background service

**2. Pull Models from Ollama**
```bash
# Pull primary inference model
ollama pull qwen2.5:14b-instruct

# Pull embeddings model for RAG
ollama pull nomic-embed-text
```

**3. Install mcpo (MCP Bridge)**
```bash
# mcpo is installed via uvx (requires Python/uv)
# Test mcpo installation:
uvx mcpo --version
```

**4. Set Up Docker**
- Install Docker Desktop for Mac
- Configure Docker to start on login (Settings → General)

**5. Deploy Open WebUI**
```bash
docker run -d \
    --name openwebui \
    -p 3000:8080 \
    -v /Volumes/MacMini_Extended/openwebui_data:/app/backend/data \
    -v /Volumes/MacMini_Extended/rt-assistant:/rt:rw \
    -v /Volumes/MacMini_Extended/rt-assistant/knowledge/memory:/app/backend/data/memory:rw \
    --add-host=host.docker.internal:host-gateway \
    --restart unless-stopped \
    ghcr.io/open-webui/open-webui:main
```

**6. Start mcpo MCP Bridge**
```bash
# Start mcpo manually for testing
uvx mcpo --host 127.0.0.1 --port 11620 -- \
  npx -y @modelcontextprotocol/server-filesystem \
  /Volumes/MacMini_Extended/rt-assistant
```

**7. Configure Open WebUI**
- Access http://localhost:3000
- Configure Ollama connection (should auto-detect at `host.docker.internal:11434`)
- **Add MCP External Tool:**
  - Settings → External Tools
  - Add tool: `http://host.docker.internal:11620`
- Create model preset: **QWEN2.5:14b-instruct-RW**
  - Enable tool invocation (Auto)
  - Attach MCP external tool
- Configure profiles/skills
- Set up system prompts
- Tune model parameters
- Test MCP filesystem access (read/write to `memory/memory.jsonl`)
- Test responses and iterate

**8. Set Up RAG Collections**
- Open WebUI → Knowledge
- Create collections:
  - `rt_articles` (documents from `/rt/knowledge/articles`)
  - `rt_memories`, `rt_projects`, `rt_backlogs`
- Configure embeddings model: `nomic-embed-text`

**9. Set Up Automation & Auto-Start**
- Copy Python scripts to `~/Library/Application Support/offlineai/`
- Copy management scripts to `~/rt-offlineai/bin/`
- Create LaunchAgents for all three services:
  - `local.rt.ollama.plist`
  - `local.rt.openwebui.plist`
  - `local.rt.mcpo.plist`
- Configure article watcher script
- Create `~/.offlineai/token` with Open WebUI API token
- **Install auto-start system:** Run `install_autostart.sh` script

### Timeline

**Total setup time:** ~1 week to fully operational

**Breakdown:**
- Ollama + model install: Hours
- Docker + Open WebUI: Hours
- **Configuration and tuning:** 1 week (biggest challenge)
- Automation setup: Additional time (incremental)

### Configuration Challenges

**Biggest hurdle:** Understanding Open WebUI configuration settings

**Specific challenges:**
- Configuration settings: Unclear documentation, trial-and-error required
- Profiles/skills setup: Learning curve for creating custom behaviors
- Model tuning: Iterative refinement to get desired output quality
- System prompts: Understanding how to structure effective prompts
- **MCP tool integration:** Understanding mcpo bridge, relative path conventions
- **RAG configuration:** Setting up collections, embeddings, document sources

**Learning Required:**
- How Open WebUI works internally
- What configuration changes are needed
- How to tune Qwen for specific writing styles
- Profile/skill system architecture
- **Model Context Protocol (MCP) concepts and configuration**
- **mcpo bridge setup and STDIO vs. OpenAPI translation**
- **Relative path conventions for MCP filesystem access**
- **RAG collection management and embeddings models**

### Challenges Encountered

**1. Configuration Complexity**
- Expected: Quick setup
- Reality: Week-long learning process for Open WebUI

**2. Model Output Quality**
- Required significant tweaking to match desired writing style
- Cloud APIs had advantage of prior interaction history
- Local LLM needed extensive prompt engineering

**3. MCP Integration Complexity**
- Understanding Model Context Protocol concepts (new technology)
- Configuring mcpo bridge (STDIO to OpenAPI translation)
- Learning relative path conventions for filesystem access
- Debugging tool invocation failures
- Ensuring mcpo stays running and auto-restarts

**4. Documentation Gaps**
- Open WebUI documentation unclear for advanced configs
- MCP/mcpo bridge documentation limited (newer technology)
- Had to experiment to understand effects of settings
- RAG collection setup not well documented

**5. Backup/Restore**
- Recent incident required complete reinstall
- Solution: Used Claude to backup configurations, workspaces, projects
- Learned importance of backing up Open WebUI configs separately from data
- Need to backup mcpo configuration and LaunchAgents too

---

## Operations & Maintenance

### Auto-Start Infrastructure (LaunchAgents)

**Complete Three-Service Auto-Start System**

The system uses macOS LaunchAgents to automatically start all three services on boot:

**1. Ollama Service**
- **LaunchAgent:** `~/Library/LaunchAgents/local.rt.ollama.plist`
- **Port:** 11434
- **Logs:** `~/rt-offlineai/logs/ollama.log`
- **Auto-restart:** Yes (KeepAlive)

**2. Open WebUI Service**
- **LaunchAgent:** `~/Library/LaunchAgents/local.rt.openwebui.plist`
- **Port:** 3000
- **Logs:** `~/rt-offlineai/logs/openwebui.log`
- **Waits for:** Docker Desktop to be ready
- **Auto-creates container** if it doesn't exist
- **Auto-restart:** Yes (KeepAlive)

**3. mcpo MCP Bridge Service**
- **LaunchAgent:** `~/Library/LaunchAgents/local.rt.mcpo.plist`
- **Port:** 11620
- **Logs:** `~/rt-offlineai/logs/mcpo.log`
- **Command:** `uvx mcpo --host 127.0.0.1 --port 11620 -- npx @modelcontextprotocol/server-filesystem /Volumes/MacMini_Extended/rt-assistant`
- **Auto-restart:** Yes (KeepAlive)

**Boot Sequence:**
1. User logs in
2. Docker Desktop starts (if auto-start enabled in Docker settings)
3. Ollama starts via LaunchAgent
4. Open WebUI waits for Docker, then starts/creates container
5. mcpo starts MCP bridge
6. All services ready in ~30-60 seconds

**Management CLI: rtai**

Location: `~/rt-offlineai/bin/rtai`

A unified management tool for all services:

```bash
# Check status of all services
rtai status

# Start all services
rtai start

# Stop all services
rtai stop

# Restart all services
rtai restart

# View recent logs
rtai logs
```

**Optional PATH setup:**
```bash
echo 'export PATH="$HOME/rt-offlineai/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Daily Management

**Service Management:**
- All three services run automatically on boot
- No manual intervention needed for daily operation
- Use `rtai status` to check health
- Use `rtai restart` if any service needs restarting

**Model Management:**
- Ollama handles models automatically
- Occasional model swapping to test alternatives
- Primary use: Qwen 2.5:14B-instruct
- Embeddings: nomic-embed-text (for RAG)
- Experimentation: Testing larger models for writing improvements

### Automation Monitoring

**Nightly Memory Compaction:**
- Runs automatically at 02:05 AM
- Logs to `/tmp/memory_compact_v2.log`
- Check logs: `tail /tmp/memory_compact_v2.log`

**Article Sync Watcher:**
- Runs in background or foreground
- Logs to `/tmp/rt_watch_poll.log`
- Check logs: `tail -f /tmp/rt_watch_poll.log`

**Status:** Some automations "set and forget" - Mike doesn't always recall what's configured

### Model Updates

**Process:** Ollama handles model updates

**Approach:**
```bash
ollama pull qwen2.5:14b  # Update to latest version
```

**Frequency:** As needed when new model versions released

### Monitoring

**Current approach:** Minimal monitoring
- No active log monitoring
- No performance metrics collection
- No resource utilization dashboards
- Reactive troubleshooting when issues arise

### Backups

**System Backups:**
- Time Machine (macOS): Full system backup (nightly automatic)
- Backs up everything including Open WebUI configs and memory files

**Memory System:**
- Monthly compacting of memory ledger
- Nightly compact version creation
- Source memory.jsonl preserved

**Configuration Backups:**
- After recent incident: Now backing up Open WebUI workspaces/projects separately
- Used Claude to automate backup of configuration files
- Lesson learned: Importance of separating config backups from data backups

### Operational Challenges

**Recent Issue: Configuration Loss**

**Problem:** Something broke requiring complete reinstall

**Solution:**
1. Used Claude to backup all configuration files
2. Saved workspaces/projects (Open WebUI terminology)
3. Created fresh backup
4. Reinstalled everything from scratch
5. Restored configurations

**Lesson:** Importance of backing up Open WebUI configurations separately from container data

**Challenge:** Some automations forgotten
- Multiple Python scripts configured months ago
- Don't always recall what each automation does
- Need to review scripts to understand current state

---

## Results & Outcomes

### Cost Savings

**Initial Goal:** Reduce cloud API spending

**Reality:** No immediate cost savings achieved
- Cloud API costs actually increased (heavy Claude Code usage)
- ChatGPT usage decreased significantly
- Local LLM didn't reduce overall AI spending

**Future Value:**
- Avoided expensive API costs for prototype development
- Foundation to deploy cost-effective production alternatives
- Capability to set up systems for clients without recurring API costs

### Capabilities Unlocked

**1. Infrastructure Deployment Skills**

Can now confidently:
- Set up LLM systems locally or in cloud
- Deploy for personal use or client projects
- Configure and tune model serving infrastructure

**2. Prototype Development Without API Costs**

**Example:** Built prototype using OpenAI API that would have been expensive at scale

**New capability:** Can deploy self-hosted alternative for production workloads

**Value:** Test AI ideas without worrying about API billing

**3. Decision Tracking & Organizational Memory**

Memory system provides:
- Capture of decision rationale across projects
- Ability to review past choices months later
- Particularly valuable for AI implementation decisions
- Foundation for potential enterprise knowledge management

**4. Foundation for Enterprise Implementation**

Skills gained position Mike for:
- Client deployments of AI infrastructure
- Enterprise knowledge management solutions
- Organizational decision tracking systems
- Privacy-preserving AI implementations

### Time Impact

**Productivity:** Returned to cloud APIs for most daily work
- Claude Code: Primary development tool
- ChatGPT: Decreased usage but still utilized
- Local LLM: Decreased usage from initial period

**Net effect:** Learning value and capability building outweighs immediate productivity gains

### New Capabilities Enabled

**What self-hosting enables that cloud doesn't:**

1. **Complete data sovereignty:** All processing happens locally
2. **Unlimited experimentation:** No API rate limits or costs for testing
3. **Prototype development:** Build AI features without scaling costs
4. **Learning platform:** Hands-on understanding of LLM operations
5. **Foundation for agentic systems:** Experience needed for OpenClawd, ClawdBot, etc.

---

## Learnings & Insights

### Technical Knowledge Gained

**1. LLM Operations**
- **Deep understanding:** How LLMs actually work under the hood
- **Beyond theory:** Practical hands-on experience with deployment
- **Model serving:** Understanding inference, context windows, batch processing

**2. Chunking**
- **Initial state:** Basic conceptual understanding
- **Outcome:** Deep practical understanding of chunking strategies
- **Impact:** Critical for RAG implementations and context management

**3. Configuration & Tuning**
- **Model parameters:** Understanding what settings affect output
- **System prompts:** How to structure effective prompts
- **Performance tuning:** Balancing speed, quality, and resource usage

**4. Open Source Alternatives**
- **Discovery:** Viable open source replacements for paid tools
- **Adoption:** Started using open source for prototypes
- **Value:** Significant cost savings for development/testing

**5. Comfort with AI**
- **Increased confidence:** Daily AI usage and infrastructure management
- **Technical depth:** Beyond surface-level API usage
- **Foundation:** Prepared for emerging AI technologies

### What Worked Well

**1. Learning Experience**
- Exceeded expectations for educational value
- Hands-on knowledge more valuable than theoretical study
- Foundation for future AI implementation work

**2. Open Source Ecosystem**
- Ollama: Easy to get started, powerful capabilities
- Open WebUI: Feature-rich interface once configured
- Community support: Active development and documentation

**3. Hardware Choice**
- M4 Pro perfectly suited for 14B models
- 24GB RAM provides comfortable headroom
- Concurrent usage works seamlessly

**4. Memory System Integration**
- Cross-platform ledger valuable despite Claude native memory
- JSONL format: Human-readable and AI-compatible
- Automation: Nightly compaction works reliably

### What Was Challenging

**1. Open WebUI Configuration**
- **Timeline:** 1 week learning curve
- **Challenge:** Unclear documentation for advanced settings
- **Approach:** Trial-and-error experimentation
- **Outcome:** Eventually mastered, but time-intensive

**2. Model Tuning for Quality**
- Cloud APIs advantage: Prior interaction history
- Local LLM required: Extensive prompt engineering
- Quality gap: Noticeable compared to Claude/ChatGPT
- Ongoing: Still iterating on configuration

**3. Configuration Management**
- **Issue:** Easy to lose configurations on reinstall
- **Solution:** Backup workspaces/projects separately
- **Lesson:** Separate config backups from container data

**4. Performance vs. Cloud**
- **Speed:** Noticeably slower than cloud APIs
- **Quality:** Required tuning to approach cloud level
- **Trade-off:** Privacy and learning vs. productivity

### What Would Be Done Differently

**If starting over knowing current knowledge:**

**Still valuable:** Educational experience and capability building worth the effort

**Considerations:**
- Maybe start with lighter model for faster iteration
- Document configurations more thoroughly from day one
- Set up automated config backups immediately
- Plan for performance trade-offs upfront

### Would You Do This Again?

**Answer:** Yes

**Reasons:**
1. **Tremendous learning value:** Deep technical knowledge gained
2. **Technical skills:** Significantly improved AI infrastructure capabilities
3. **Confidence:** Can now deploy production AI systems
4. **Foundation:** Prepared for emerging agentic AI technologies
5. **Fun:** Engaging and intellectually rewarding process

**Value beyond productivity:** Capability building for future work more important than immediate efficiency gains

---

## Future Plans

### 1. Cloud Deployment

**Goal:** Set up cloud-hosted LLM instance for remote access

**Use cases:**
- Prototype testing without exposing local system
- Remote access to private LLM
- Production-ready deployment testing

**Blocker:** Security concerns
- Not a security specialist
- Researching secure deployment practices
- Don't want to expose data through misconfiguration
- Will implement when confident in security approach

**Timeline:** When security research complete

### 2. Enhanced Content Automation

**Current state:** Article atomization for content repurposing

**Next steps:**
- **Multi-platform distribution:** Automate content deployment
- **Social media automation:** Post atomized content automatically
- **Streamlined publishing:** End-to-end workflow from article → distributed content

**Goal:** Fully automated content distribution pipeline

### 3. Agentic AI Systems

**New emerging technology:** OpenClawd (ClawdBot, Moltbot), independent AI agents

**Preparation value:** Local LLM experience provides foundation for:
- Understanding agentic system implementation
- Configuring agents securely
- Ensuring proper operation and constraints
- Managing autonomous AI workflows

**Current exploration:**
- Claude Code (actively using)
- OpenAI Codex (investigating)
- Google Galaxy (investigating)
- Other agentic coding tools

**Confidence level:** Well-prepared for this work based on local LLM experience

### 4. Enterprise Applications

**Vision:** Organizational knowledge management

**Potential offering:**
- Deploy memory systems for small companies
- Employee-specific knowledge bases
- Consolidated executive/management views
- Decision tracking and rationale preservation
- Organizational context maintenance

**Status:** Conceptual; not yet offered to clients

### 5. Continued Experimentation

**Ongoing:**
- Testing different models for specific use cases
- Refining automation workflows
- Exploring RAG implementations
- Building prototype AI features

---

## Technical Appendix

### GitHub Repository

**Organization:** Jones-Co
**Repository:** offlineai-macmini
**Location:** `/Volumes/MacMini_Extended/rt-assistant/offlineai-macmini`

**Contents:**
- `scripts/` - Automation Python scripts and shell scripts
- `launchagents/` - macOS LaunchAgent plists
- `docs/` - Documentation including operations cheat sheet

**Latest tag:** v0.2.2 (suggested)

**Key scripts:**
- `compact_memory.py` - Nightly memory compaction
- `render_memory.py` - Session context rendering
- `rt_watch_poll.template.sh` - Article sync watcher
- `start_openwebui.sh` - Docker container startup
- `install_autostart.sh` - Automation installation

### Configuration Examples

**Open WebUI Docker Configuration:**

See "Docker Configuration" section above for complete `docker run` command

**Key volumes mounted:**
- Persistent data: `openwebui_data:/app/backend/data`
- Full knowledge base: `rt-assistant:/rt:rw`
- Memory integration: `knowledge/memory:/app/backend/data/memory:rw`

**Memory Compaction LaunchAgent:**

`~/Library/LaunchAgents/com.offlineai.memorycompact.v2.plist`

**Schedule:** Daily at 02:05 AM + on system load

**Logs:**
- Output: `/tmp/memory_compact_v2.log`
- Errors: `/tmp/memory_compact_v2.err`

### API Examples

**Ollama API (OpenAI-compatible):**

```bash
# List models
curl http://localhost:11434/api/tags

# Generate completion
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:14b",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

**Open WebUI API:**

```bash
# Upload file to knowledge base
curl -X POST \
  -H "Authorization: Bearer $OWUI_TOKEN" \
  -F "file=@article.md;type=text/markdown" \
  http://localhost:3000/api/v1/files/

# Add file to collection
curl -X POST \
  -H "Authorization: Bearer $OWUI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"file_id":"<FILE_ID>"}' \
  http://localhost:3000/api/v1/knowledge/2d5ac00f-faa0-4a20-8297-36e657f78c2d/file/add
```

### Directory Paths Reference

**External Volume:** `/Volumes/MacMini_Extended/`

**Knowledge Base:** `/Volumes/MacMini_Extended/rt-assistant/knowledge/`

**Memory Ledger:** `/Volumes/MacMini_Extended/rt-assistant/knowledge/memory/memory.jsonl`

**Open WebUI Data:** `/Volumes/MacMini_Extended/openwebui_data/`

**Automation Scripts:** `/Volumes/MacMini_Extended/rt-assistant/offlineai-macmini/scripts/`

**Deployed Scripts:** `~/Library/Application Support/offlineai/`

**Token Storage:** `~/.offlineai/token`

### Collection IDs

**RT_Articles:** `2d5ac00f-faa0-4a20-8297-36e657f78c2d`

---

## Assets Needed for Case Study

### Screenshots

- [ ] **Architecture diagram:** System components and data flow
- [ ] **Open WebUI interface:** Browser showing conversation
- [ ] **Ollama model list:** Terminal showing installed models
- [ ] **Memory ledger excerpt:** Example memory.jsonl entries (formatted)
- [ ] **Docker container status:** Running containers
- [ ] **Monitoring dashboard:** (if created) Resource utilization

### Diagrams

- [ ] **System architecture:** Hardware + software stack visual
- [ ] **Data flow diagram:** User prompt → Ollama → response path
- [ ] **Memory integration:** Cross-platform memory sharing
- [ ] **Automation workflow:** Nightly compaction + article sync flow
- [ ] **Docker volumes:** Mount structure visualization

### Hardware

- [ ] **Mac Mini photo:** Optional but compelling visual of hardware
- [ ] **Setup photo:** Workspace showing Mac Mini in use

### Performance Data

- [ ] **Model sizes:** Storage usage by model
- [ ] **Response times:** Sample latency measurements (if available)
- [ ] **Resource graphs:** CPU/RAM usage during inference (if available)

### Configuration Files

- [ ] **Docker compose example:** Sanitized Open WebUI configuration
- [ ] **LaunchAgent plist:** Memory compaction automation
- [ ] **Memory entry examples:** Sanitized actual memory.jsonl entries
- [ ] **System prompt example:** How memory context is loaded

---

## Notes for Web Content Builder (Alice)

### Key Points to Emphasize

**1. Capability Building Over Immediate ROI**
- This project is about learning and skill development, not cost savings
- Positions Mike as someone who understands AI infrastructure deeply
- Foundation for enterprise implementations and client work

**2. Technical Depth & Sophistication**
- **Three-service architecture:** Ollama + Open WebUI + mcpo (not just "installed Ollama")
- **Model Context Protocol integration:** Active filesystem R/W via MCP bridge
- **RAG implementation:** Semantic search with embeddings and knowledge collections
- **Complete auto-start infrastructure:** Three LaunchAgents + management CLI
- **Python automation:** Nightly compaction, session rendering, continuous sync
- **Cross-platform memory system:** JSONL ledger with active MCP tool access
- **Advanced configuration:** Tool invocation, relative paths, Docker networking

**3. Honest Assessment**
- Acknowledges cloud APIs are currently better for daily work
- Transparent about challenges and learning curve
- Shows maturity and real-world understanding vs. hype

**4. Enterprise Vision**
- Sees beyond personal use to organizational applications
- Decision tracking and knowledge management at scale
- Prepared for emerging agentic AI technologies

**5. Privacy & Sovereignty**
- Data sovereignty as core motivation
- Complete control over processing and storage
- Alternative to cloud dependency for sensitive work

### SEO Keywords

**Primary:**
- self-hosted LLM
- local AI infrastructure
- LLM deployment
- Ollama setup
- Open WebUI configuration
- Model Context Protocol (MCP)
- mcpo MCP bridge

**Secondary:**
- Qwen model deployment
- Mac Mini AI setup
- privacy-preserving AI
- AI memory system
- cross-platform AI context
- AI prototype development
- enterprise knowledge management
- RAG implementation
- LLM filesystem access
- MCP integration
- nomic-embed-text embeddings

**Long-tail:**
- "how to deploy LLM on Mac Mini"
- "self-hosted AI alternative to ChatGPT"
- "Ollama OpenWebUI setup guide"
- "local LLM for privacy"
- "AI infrastructure for small business"
- "Model Context Protocol MCP setup"
- "mcpo OpenWebUI integration"
- "LLM RAG knowledge base"
- "self-hosted AI with filesystem access"
- "three-service AI architecture"

### Target Audience

**Primary:**
- Employers looking for AI infrastructure expertise
- CTOs/Engineering leaders evaluating AI deployment options
- Companies considering self-hosted AI alternatives

**Secondary:**
- Engineers interested in self-hosted AI
- Privacy-conscious developers
- Startups evaluating AI infrastructure costs

**Tertiary:**
- Technical decision-makers at small companies
- AI implementation consultants
- DevOps engineers exploring AI deployment

### Tone & Messaging

**Emphasize:**
- ✅ Technical competence and hands-on experience
- ✅ Honest assessment of trade-offs
- ✅ Learning mindset and continuous improvement
- ✅ Enterprise thinking beyond personal projects
- ✅ Foundation for emerging AI technologies

**Avoid:**
- ❌ Overselling performance vs. cloud (be honest)
- ❌ Making it sound like cost savings (wasn't achieved)
- ❌ Positioning as "production-ready replacement" (it's a learning platform)
- ❌ Claiming expertise beyond what was actually built

### Case Study Structure Recommendations

**1. Hook with Privacy + Learning**
"What if you could run ChatGPT-level AI on your desk, completely private, while learning exactly how LLM infrastructure works?"

**2. Problem: Privacy + Context + Learning**
- Data sovereignty concerns
- Context loss across AI tools
- Need to understand deployment for future client work

**3. Approach: Mac Mini + Ollama + OpenWebUI + RT-Assistant**
- Hardware selection rationale
- Software stack choices
- Integration with memory system

**4. Technical Implementation**
- Architecture overview
- Configuration challenges overcome
- Automation workflows built

**5. Results: Capability Building**
- Deep technical knowledge gained
- Foundation for prototype development
- Prepared for enterprise deployments
- Ready for agentic AI systems

**6. Honest Assessment**
- Cloud still better for daily work (currently)
- Learning value exceeded immediate productivity
- Foundation for future implementations

**7. Call to Action**
- Interested in AI infrastructure for your company?
- Need privacy-preserving AI deployment?
- Want to avoid expensive API scaling costs?

---

**STATUS:** DOCUMENTATION COMPLETE ✅

**Next Step:** Hand off to Alice (Web-Content-Builder) for case study creation

**Target URL:** /projects/local-llm-setup or /projects/local-llm-infrastructure

**Completion Date:** 2026-02-03

**Interview Duration:** ~45 minutes

**Documentation Time:** 2 hours

---

*End of Technical Documentation*
