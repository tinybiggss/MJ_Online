# OfflineAI

**Status**: Active  
**Start Date**: 2025-09-12

## Description

OfflineAI is the local AI infrastructure project that enables offline, privacy-first AI workflows. It combines Ollama for local model hosting, OpenWebUI for user interface, mcpo for MCP bridging, and Filesystem MCP for direct knowledge base integration.

## Objectives

- **Privacy-First**: All AI processing happens locally on Mac mini
- **Cross-AI Compatibility**: Unified knowledge base accessible to Claude, ChatGPT, and OpenWebUI
- **Persistent Memory**: JSONL-based memory ledger survives across sessions and AI systems
- **RAG Integration**: Automatic document indexing and semantic search
- **Tool Integration**: Filesystem read/write capabilities via Model Context Protocol

## Current Status

**Active Development** - Core infrastructure operational, automation tasks in progress.

### What's Working ✅
- Ollama + OpenWebUI + mcpo stack fully operational
- Filesystem MCP providing read/write access to knowledge base
- RAG collections configured (rt_articles, rt_memories, rt_projects, rt_backlogs)
- Memory ledger normalized and cross-AI compatible
- Comprehensive documentation suite established

### In Progress 🔄
- Autostart scripts and LaunchAgents for service persistence
- Docker compose configuration
- Auto-refresh watcher for document collections
- Health check and monitoring system

### Planned 📋
- Status helper CLI tool (`rtai`)
- Log rotation policies
- Complete system README with recovery procedures

## Technical Architecture

### Core Components
- **Ollama**: Local LLM hosting (port 11434)
- **OpenWebUI**: Web UI (port 3000, Docker)
- **mcpo**: MCP-to-OpenAPI bridge (port 11620)
- **Filesystem MCP**: Knowledge base access
- **Qwen2.5:14b-instruct**: Primary model with tool support
- **nomic-embed-text**: Embeddings for RAG

### Key Design Decisions
- STDIO-based MCP communication via mcpo bridge (no TCP)
- Relative path convention for tool requests
- Standardized on `/rt` container path for RT tree
- Bind-mounted memory ledger for cross-AI access
- PascalCase for projects, snake_case for tags

## Key Resources

- [Project Memory](../../_memories/projects/OfflineAI.md) - Detailed context and decisions
- [Setup Checklist](../articles/offline_ai_setup_rag_checklist.md) - Implementation roadmap
- [Naming Conventions](../_system/NAMING_CONVENTIONS.md) - Official standards
- [Project Registry Guide](../_system/PROJECT_REGISTRY_GUIDE.md) - Management procedures

## Folder Structure

- `/documents/` - Finalized documentation and guides
- `/working/` - Work in progress, notes, experiments
- `/archive/` - Historical content and deprecated files

## Quick Reference

### Starting mcpo (manual)
```bash
uvx mcpo --host 127.0.0.1 --port 11620 --cors "*" --verbose -- \
  npx -y @modelcontextprotocol/server-filesystem \
  /Volumes/MacMini_Extended/rt-assistant
```

### Service Ports
- 3000: OpenWebUI
- 11434: Ollama
- 11620: mcpo

### Container Paths
- `/rt` → knowledge base root
- `/rt/knowledge/memory` → memory ledger
- `/app/backend/data` → OpenWebUI persistence

## Related Projects

While OfflineAI provides infrastructure that benefits other projects, it operates independently:
- Serves as foundation for ResilientTomorrow content workflows
- Enables NeighborhoodShare development tooling
- Powers cross-project knowledge management

---

*Maintained by: Mike + AI Systems*  
*Last Updated: 2025-09-26*
