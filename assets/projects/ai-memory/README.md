# RT-Assistant: AI Knowledge Management System

**Version**: 2.0  
**Established**: 2025-01-17  
**Standardized**: 2025-09-25  
**Owner**: Mike Jones

---

## 📚 Overview

RT-Assistant is a comprehensive knowledge management system designed for **dual-AI workflows**, supporting both online (Claude) and offline (OpenWebUI + Ollama) AI systems with complete cross-AI compatibility.

### Key Features
- ✅ **Cross-AI Memory System** - Shared memory ledger across all AI systems
- ✅ **Project Management** - Structured project workspaces and documentation
- ✅ **Content Archive** - ResilientTomorrow articles and published content
- ✅ **Sprint Planning** - Integrated backlog management with Notion sync
- ✅ **Naming Standards** - Consistent conventions across all systems
- ✅ **RAG Integration** - Vector search via OpenWebUI collections

---

## 🗂️ Directory Structure

```
/rt-assistant/
│
├── knowledge/              # 📚 Main knowledge base
│   ├── _system/           # ⚙️ System configuration & docs
│   ├── _memories/         # 🧠 Global & project memories
│   ├── articles/          # 📝 Published content archive
│   ├── backlogs/          # 📋 Sprint planning & tasks
│   ├── memory/            # 💾 Memory ledger (JSONL)
│   ├── projects/          # 🎯 Active project workspaces
│   ├── conversations/     # 💬 Archived AI conversations
│   ├── research/          # 🔬 Research materials
│   └── templates/         # 📄 Document templates
│
├── README.md              # 👈 You are here
└── [Additional system files]
```

---

## 🚀 Quick Start

### For New Users (Human)

1. **Read This File** - Understand the system overview
2. **Explore `/knowledge/`** - Main knowledge base directory
3. **Check `/knowledge/_system/`** - System documentation
4. **Review Active Projects** - See what's currently in progress

### For AI Systems

1. **Read Setup Guide**: `/knowledge/_system/SETUP_GUIDE.md`
2. **Learn Naming Standards**: `/knowledge/_system/NAMING_CONVENTIONS.md` ⭐
3. **Load Memory**: `/knowledge/memory/memory.jsonl`
4. **Check Projects**: `/knowledge/_system/project_registry.json`

---

## 🎯 Active Projects

### OfflineAI
**Local AI infrastructure and dual-AI system setup**  
📁 `/knowledge/projects/OfflineAI/`  
🏷️ Tags: `offline_ai`, `system_admin`, `infrastructure`

### ResilientTomorrow
**Content platform for community resilience and organizing**  
📁 `/knowledge/projects/ResilientTomorrow/` (planned)  
🏷️ Tags: `resilient_tomorrow`, `content_creation`, `community_organizing`

### NeighborhoodShare
**Community coordination and resource sharing platform**  
📁 `/knowledge/projects/NeighborhoodShare/`  
🏷️ Tags: `neighborhood_share`, `community_coordination`, `platform`

---

## 🤖 AI System Integration

### Supported Systems

**Claude (Online)**
- Web research & analysis
- Documentation & strategy
- Memory ledger management
- Primary AI for complex work

**OpenWebUI + Ollama (Offline - Mac Mini)**
- Private document processing
- RAG with vector search
- Local model inference (Qwen2.5:14B)
- Persistent memory system

**ChatGPT (Supplementary)**
- Alternative analysis
- Cross-validation
- Format compatibility

### Shared Resources

All AI systems access:
- 💾 Memory Ledger: `/knowledge/memory/memory.jsonl`
- 📋 Project Registry: `/knowledge/_system/project_registry.json`
- 🏷️ Naming Standards: `/knowledge/_system/NAMING_CONVENTIONS.md`
- 📝 Article Archive: `/knowledge/articles/`

---

## 📋 Essential Documentation

### 🌟 Start Here
1. **[Knowledge Base README](/knowledge/README.md)** - Knowledge base overview
2. **[Naming Conventions](/knowledge/_system/NAMING_CONVENTIONS.md)** - **MUST READ**
3. **[Setup Guide](/knowledge/_system/SETUP_GUIDE.md)** - AI system configuration
4. **[Project Registry Guide](/knowledge/_system/PROJECT_REGISTRY_GUIDE.md)** - Project management

### 📚 System Configuration
- `project_registry.json` - Active projects database
- `master_index.json` - Content search index
- `multi_ai_compatibility.md` - Cross-AI design
- `openwebui_integration.md` - OpenWebUI setup

### 🤖 AI-Specific Guides
- **For Claude**: Read SETUP_GUIDE.md, follow all standards
- **For ChatGPT**: Read CHATGPT_INTEGRATION_GUIDE.md
- **For OpenWebUI**: See openwebui_integration.md

### 📊 Current Work
- **[Master Backlog](/knowledge/backlogs/master_backlog.md)** - All priorities
- **[Current Sprint](/knowledge/backlogs/current_sprint.md)** - This week's focus

---

## 🏷️ Naming Conventions Quick Reference

**CRITICAL**: All systems must follow official naming standards

| Element | Format | Example |
|---------|--------|---------|
| Projects (structured) | **PascalCase** | `OfflineAI`, `ResilientTomorrow` |
| Tags (metadata) | **snake_case** | `offline_ai`, `resilient_tomorrow` |
| Files (general) | **snake_case** | `meeting_notes.md` |
| Files (dated) | **ISO + snake_case** | `2025-09-25_notes.md` |
| Folders (project) | **PascalCase** | `/NeighborhoodShare/` |
| Folders (system) | **snake_case** | `/_system/` |
| Collections | **snake_case + prefix** | `rt_memories` |

📖 **Full Details**: `/knowledge/_system/NAMING_CONVENTIONS.md`

---

## 💾 Memory System

### Memory Ledger: `/knowledge/memory/memory.jsonl`

Each line is a complete JSON object:

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

### Memory Types
- `decision` - Important decisions with rationale
- `milestone` - Project achievements
- `insight` - Key learnings
- `resource` - Tools and resources
- `context` - Background information
- `note` - General observations
- `todo` - Action items
- `rationale` - Reasoning documentation

---

## 🔄 Typical Workflows

### Starting Work (AI Systems)
1. Read `/knowledge/memory/memory.jsonl` for context
2. Check `/knowledge/backlogs/current_sprint.md` for priorities
3. Review relevant project memory files
4. Follow naming conventions strictly

### Creating Content
1. Follow naming conventions
2. Update project documentation
3. Create memory entries for decisions
4. Update sprint status if needed

### Ending Session
1. Document all decisions in memory.jsonl
2. Update project memory files
3. Refresh sprint/backlog status
4. Leave clear handoff notes

---

## 🔐 Access & Permissions

### Filesystem Access (AI Systems)
- ✅ `/Volumes/MacMini_Extended/rt-assistant/knowledge/`
- ✅ `/Volumes/MacMini_Extended/openwebui_data/`
- ✅ `/Volumes/MacMini_Extended/rt-assistant/` (this directory)

### OpenWebUI Integration
- **Data Directory**: `/app/backend/data` → `openwebui_data/`
- **Memory Bind-Mount**: From `knowledge/memory/memory.jsonl`
- **Collections**: `rt_articles`, `rt_memories`, `rt_projects`, `rt_backlogs`

---

## 🎯 System Goals

1. **Persistence** - Context maintained across AI sessions
2. **Consistency** - Uniform naming and structure everywhere
3. **Compatibility** - Works seamlessly across multiple AI systems
4. **Searchability** - Easy to find any information quickly
5. **Maintainability** - Clear documentation and organization
6. **Reliability** - Backup and version control built-in

---

## 🔧 Maintenance

### Weekly Tasks
- Sync Notion backlog → current_sprint.md
- Review and update project statuses
- Archive completed work
- Update memory entries

### Monthly Tasks
- Cleanup old/duplicate files
- Update master_index.json
- Backup memory.jsonl
- Review documentation

### Quarterly Tasks
- Audit naming convention compliance
- Review project registry
- Optimize file structure
- Update system documentation

---

## 📞 Support & Resources

### For AI Systems
- 📖 Read `/knowledge/_system/SETUP_GUIDE.md`
- 🏷️ Follow `/knowledge/_system/NAMING_CONVENTIONS.md`
- 🔍 Search `/knowledge/memory/memory.jsonl` for context
- 📋 Check `/knowledge/_system/project_registry.json`

### For Humans
- All documentation in `/knowledge/_system/`
- README files explain each directory
- Memory ledger has full history at `/knowledge/memory/memory.jsonl`
- Project memories at `/knowledge/_memories/projects/`

---

## 🔗 Quick Links

### Essential Documentation
- [Knowledge Base README](/knowledge/README.md)
- [Naming Conventions](/knowledge/_system/NAMING_CONVENTIONS.md) ⭐
- [Setup Guide](/knowledge/_system/SETUP_GUIDE.md)
- [Project Registry Guide](/knowledge/_system/PROJECT_REGISTRY_GUIDE.md)
- [ChatGPT Integration](/knowledge/_system/CHATGPT_INTEGRATION_GUIDE.md)

### Current Work
- [Master Backlog](/knowledge/backlogs/master_backlog.md)
- [Current Sprint](/knowledge/backlogs/current_sprint.md)
- [Memory Ledger](/knowledge/memory/memory.jsonl)

### System Files
- [Project Registry](/knowledge/_system/project_registry.json)
- [Master Index](/knowledge/_system/master_index.json)

---

## 📝 Version History

**v2.0** - 2025-09-25 (Major Standardization)
- ✅ Established comprehensive naming conventions
- ✅ Created complete documentation suite
- ✅ Standardized cross-AI communication
- ✅ Reorganized file structure
- ✅ Archived legacy files
- ✅ Added AI-specific integration guides

**v1.0** - 2025-01-17 (Initial Release)
- Initial knowledge management system
- Basic project structure
- Memory ledger implementation
- OpenWebUI integration

---

## 🏆 Best Practices

### DO:
- ✅ Follow naming conventions strictly
- ✅ Update memory.jsonl for all decisions
- ✅ Keep project documentation current
- ✅ Use proper folder structure
- ✅ Create README files in new folders
- ✅ Archive completed work properly

### DON'T:
- ❌ Mix naming conventions
- ❌ Skip memory entries for decisions
- ❌ Leave folders without documentation
- ❌ Create orphaned files
- ❌ Duplicate content unnecessarily
- ❌ Ignore the registry system

---

## 🚨 Important Notes

**For All AI Systems**:
1. **ALWAYS** read `/knowledge/_system/NAMING_CONVENTIONS.md` before creating content
2. **ALWAYS** follow PascalCase for projects, snake_case for tags
3. **ALWAYS** document decisions in memory.jsonl
4. **ALWAYS** coordinate with other AI systems via shared files

---

**System Owner**: Mike Jones  
**Primary AI**: Claude  
**Supported AIs**: ChatGPT, OpenWebUI  
**Last Major Update**: 2025-09-25

*For questions, consult documentation in `/knowledge/_system/` or review memory ledger at `/knowledge/memory/memory.jsonl`*
