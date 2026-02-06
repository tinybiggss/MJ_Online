# Knowledge Base - RT Assistant System

**Version**: 2.0  
**Established**: 2025-01-17  
**Standardized**: 2025-09-25

## 📚 Welcome to the Knowledge Base

This directory contains all documentation, project files, memory systems, and content for the RT-Assistant AI knowledge management system.

---

## 🗂️ Directory Overview

### **`/_system/`** - System Documentation & Configuration
Contains all system configuration files, templates, and official documentation.

**Key Files**:
- `NAMING_CONVENTIONS.md` - Official naming standards (READ FIRST!)
- `PROJECT_REGISTRY_GUIDE.md` - How to manage projects
- `SETUP_GUIDE.md` - AI system setup instructions
- `project_registry.json` - Active projects database
- `master_index.json` - Content search index
- `multi_ai_compatibility.md` - Cross-AI design principles
- `openwebui_integration.md` - OpenWebUI configuration
- `commands.md` - Quick command reference

### **`/_memories/`** - Memory Files
Global and project-specific context and decisions.

**Structure**:
- `global_memory.md` - Cross-project context
- `projects/` - Individual project memory files
- `conversations/` - Archived conversation references

### **`/articles/`** - Published Content Archive
All ResilientTomorrow articles and published content.

**Format**: `YYYY-MM-DD_Article_Title.md`

### **`/backlogs/`** - Sprint Planning & Task Management
Current sprint and master backlog synchronized with Notion.

**Files**:
- `master_backlog.md` - All projects and priorities
- `current_sprint.md` - Current week focus
- `backlog_template.md` - Template for new backlogs

### **`/memory/`** - Memory Ledger System
JSONL-based memory persistence system.

**Key File**: `memory.jsonl` - Main memory ledger

**Tools**:
- `dedupe_memory_pacific.py` - Deduplication script
- `ledger_tool.py` - Memory management utilities
- `normalize_ledger.js` - Format normalization

### **`/projects/`** - Active Project Workspaces
Individual folders for each active project.

**Current Projects**:
- `OfflineAI/` - AI infrastructure
- `ResilientTomorrow/` - (planned)
- `NeighborhoodShare/` - Community platform

### **`/conversations/`** - Archived AI Conversations
Historical conversation references and exports.

### **`/research/`** - Research Materials
Research notes, findings, and reference materials.

### **`/templates/`** - Document Templates
Reusable templates for various document types.

---

## 🚀 Quick Start

### For New AI Instances

1. **Read System Documentation**:
   ```
   1. /_system/NAMING_CONVENTIONS.md
   2. /_system/PROJECT_REGISTRY_GUIDE.md
   3. /_system/SETUP_GUIDE.md
   ```

2. **Load Current Context**:
   ```
   1. Read /memory/memory.jsonl
   2. Check /backlogs/current_sprint.md
   3. Review relevant project memory files
   ```

3. **Understand Structure**:
   ```
   1. Check /_system/project_registry.json
   2. Review /_system/master_index.json
   3. Explore /projects/ directory
   ```

### For Regular Sessions

**Starting Work**:
- Load memory.jsonl for context
- Check current sprint for priorities
- Review project-specific memory files

**During Work**:
- Follow naming conventions strictly
- Update project documentation
- Track decisions in memory

**Ending Work**:
- Create memory entries for decisions
- Update sprint status
- Document major changes

---

## 🏷️ Naming Standards

**CRITICAL**: All files, folders, and references must follow official naming conventions.

See **`/_system/NAMING_CONVENTIONS.md`** for complete standards.

### Quick Reference

| Element | Format | Example |
|---------|--------|---------|
| Projects (structured) | PascalCase | `OfflineAI` |
| Tags (metadata) | snake_case | `offline_ai` |
| Files (general) | snake_case | `meeting_notes.md` |
| Files (dated) | ISO + snake_case | `2025-09-25_notes.md` |
| Folders (project) | PascalCase | `/NeighborhoodShare/` |
| Folders (system) | snake_case | `/_system/` |
| Collections | snake_case + prefix | `rt_memories` |

---

## 💾 Memory System

### Memory Ledger (`/memory/memory.jsonl`)

Each line is a JSON object:

```json
{
  "id": "mem-YYYY-MM-DD-###",
  "timestamp": "YYYY-MM-DDTHH:MM:SS-07:00",
  "projects": ["ProjectName"],
  "author": "Mike",
  "type": "decision|milestone|insight|resource|context|note|todo|rationale",
  "summary": "Brief summary",
  "details": "Full details",
  "tags": ["snake_case", "tags"],
  "related_files": ["paths/to/files"],
  "links": [],
  "source_convo": "YYYYMMDD-reference",
  "source": "claude|chatgpt|openwebui"
}
```

### Memory Entry Types

- `decision` - Important decisions with rationale
- `milestone` - Project achievements
- `insight` - Key learnings
- `resource` - Important tools/resources
- `context` - Background information
- `note` - General observations
- `todo` - Action items
- `rationale` - Reasoning documentation

---

## 📋 Active Projects

### OfflineAI
**Description**: Local AI infrastructure and dual-AI system  
**Status**: Active  
**Memory**: `_memories/projects/OfflineAI.md` (to be created)  
**Workspace**: `projects/OfflineAI/`

### ResilientTomorrow
**Description**: Content platform for community resilience  
**Status**: Active  
**Memory**: `_memories/projects/ResilientTomorrow.md` (to be created)  
**Workspace**: `projects/ResilientTomorrow/` (to be created)

### NeighborhoodShare
**Description**: Community coordination platform  
**Status**: Active  
**Memory**: `_memories/projects/NeighborhoodShare.md`  
**Workspace**: `projects/NeighborhoodShare/`

---

## 🤖 Cross-AI Integration

### Supported Systems

1. **Claude** (Online)
   - Primary documentation and strategy
   - Web research capabilities
   - Memory ledger management
   - Complex analysis

2. **OpenWebUI** (Offline - Mac Mini)
   - Private document processing
   - Vector search (RAG)
   - Local inference
   - Persistent memory

3. **ChatGPT** (Supplementary)
   - Alternative analysis
   - Cross-validation
   - Format compatibility

### Shared Resources

All AI systems access:
- Memory ledger (`/memory/memory.jsonl`)
- Project registry (`/_system/project_registry.json`)
- Naming standards (`/_system/NAMING_CONVENTIONS.md`)
- Article archive (`/articles/`)

---

## 🔧 Common Operations

### Create New Project

```
1. Choose PascalCase name
2. Update /_system/project_registry.json
3. Update /_system/master_index.json
4. Create /_memories/projects/ProjectName.md
5. Create /projects/ProjectName/ structure
6. Add memory entry
```

See: `/_system/PROJECT_REGISTRY_GUIDE.md`

### Save Document

```
1. Choose appropriate location
2. Use snake_case filename
3. Update project memory if relevant
4. Create memory entry if significant
```

### Update Memory

```
1. Open /memory/memory.jsonl
2. Add new JSON line
3. Follow naming conventions
4. Include all required fields
```

---

## 📊 File Organization Best Practices

### DO:
✅ Follow naming conventions strictly  
✅ Update memory.jsonl for decisions  
✅ Keep project documentation current  
✅ Use proper folder structure  
✅ Create README files in new folders  
✅ Archive completed work properly

### DON'T:
❌ Mix naming conventions  
❌ Skip memory entries for decisions  
❌ Leave folders without documentation  
❌ Create orphaned files  
❌ Duplicate content without reason  
❌ Ignore the registry system

---

## 🔍 Finding Information

### Search Methods

**By Project**:
- Check `/_system/project_registry.json`
- Review project memory files
- Search `memory.jsonl` by project tag

**By Topic**:
- Search `memory.jsonl` by tags
- Query OpenWebUI collections
- Check `/_system/master_index.json`

**By Date**:
- Sort `memory.jsonl` by timestamp
- Check dated files in `/articles/`
- Review sprint backlogs

**By Type**:
- Filter `memory.jsonl` by type field
- Browse specific directories
- Use index tags

---

## 📝 Documentation Files

### Essential Reading
1. `/_system/NAMING_CONVENTIONS.md` - **Start here**
2. `/_system/PROJECT_REGISTRY_GUIDE.md` - Project management
3. `/_system/SETUP_GUIDE.md` - AI configuration
4. `/_system/multi_ai_compatibility.md` - Cross-AI design

### Reference
- `/_system/commands.md` - Quick commands
- `/_system/openwebui_integration.md` - OpenWebUI setup
- `/_system/memory_templates/` - Templates for memory entries

### Current Work
- `/backlogs/master_backlog.md` - All priorities
- `/backlogs/current_sprint.md` - Current focus

---

## 🔐 Access Control

### Filesystem Access

AI systems can access:
- ✅ `/Volumes/MacMini_Extended/rt-assistant/knowledge/`
- ✅ `/Volumes/MacMini_Extended/openwebui_data/`

### OpenWebUI Integration

Container configuration:
- Data: `/app/backend/data` → `/openwebui_data/`
- Memory: Bind-mounted from `/knowledge/memory/`
- Collections: `rt_articles`, `rt_memories`, `rt_projects`, `rt_backlogs`

---

## 🎯 System Principles

1. **Consistency** - Uniform naming and structure
2. **Persistence** - Context across sessions
3. **Compatibility** - Works across AI systems
4. **Searchability** - Easy information retrieval
5. **Documentation** - Everything is documented
6. **Maintainability** - Clear and organized

---

## 🔄 Maintenance Schedule

### Weekly
- Sync Notion → current_sprint.md
- Update project statuses
- Review memory entries
- Archive completed work

### Monthly
- Cleanup old/duplicate files
- Update master_index.json
- Backup memory.jsonl
- Review documentation

### Quarterly
- Audit naming compliance
- Review project registry
- Update system docs
- Optimize structure

---

## 🔗 Quick Links

- [Naming Conventions](/_system/NAMING_CONVENTIONS.md) ⭐
- [Project Registry Guide](/_system/PROJECT_REGISTRY_GUIDE.md)
- [Setup Guide](/_system/SETUP_GUIDE.md)
- [Master Backlog](/backlogs/master_backlog.md)
- [Current Sprint](/backlogs/current_sprint.md)
- [Memory Ledger](/memory/memory.jsonl)

---

**System Owner**: Mike Jones  
**Maintained By**: Claude, ChatGPT, OpenWebUI  
**Last Update**: 2025-09-25

*For questions, consult the documentation in `/_system/` or review `memory.jsonl` for context.*
