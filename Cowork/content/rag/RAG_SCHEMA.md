# MJ_Online RAG Knowledge Base Schema

This schema defines the format for RAG-ready content that powers the MikeJones.online chatbot.

## Design Principles

1. **Self-contained chunks** - Each entry should make sense without surrounding context
2. **Rich metadata** - Enable filtering and retrieval by topic, project, type
3. **Consistent with RT-Assistant** - Uses similar patterns to memory ledger
4. **Chatbot-optimized** - Supports fit assessment, technical queries, and background info

---

## Entry Types

### fact
Atomic, verifiable pieces of information.

```json
{
  "id": "rag-2026-01-27-001",
  "type": "fact",
  "topic": "career_history",
  "project": null,
  "content": "Mike has 24+ years of experience in program/project management across gaming, media, and technology companies.",
  "confidence": "verified",
  "source": "mike_career_prompt.md",
  "tags": ["career", "experience", "verified"]
}
```

### narrative
Longer explanations with context (2-4 paragraphs). Used for "tell me about..." queries.

```json
{
  "id": "rag-2026-01-27-010",
  "type": "narrative",
  "topic": "project_ai_memory",
  "project": "OfflineAI",
  "title": "Why Mike Built the AI Memory System",
  "content": "The AI Memory System emerged from a specific frustration: context loss across AI conversations. Every new session meant re-explaining projects, decisions, and context...",
  "confidence": "verified",
  "source": "interview_session_ai_memory",
  "tags": ["ai_memory", "motivation", "architecture"]
}
```

### qa_pair
Pre-formatted question and answer. Optimized for common queries.

```json
{
  "id": "rag-2026-01-27-020",
  "type": "qa_pair",
  "topic": "services",
  "project": "MikeCareer",
  "question": "What does Mike charge for consulting?",
  "answer": "Mike offers three service tiers: Workflow Assessment ($4k-$12k one-time), Embedded Execution ($8k-$18k/month retainer), and Full PMO Build ($15k-$25k+/month). Pricing depends on scope, team size, and engagement length.",
  "confidence": "verified",
  "source": "mike_career_prompt.md",
  "tags": ["pricing", "services", "consulting"]
}
```

### fit_assessment
Guidance for the chatbot to assess visitor fit.

```json
{
  "id": "rag-2026-01-27-030",
  "type": "fit_assessment",
  "topic": "services",
  "project": "MikeCareer",
  "fit_type": "good_fit",
  "criteria": "Teams of 50-500 people in gaming, entertainment, or media struggling with delivery visibility",
  "explanation": "Mike's expertise is optimized for mid-sized teams where process improvements have measurable impact. He specializes in making work visible, reducing meeting overhead, and implementing automation.",
  "tags": ["fit", "icp", "consulting"]
}
```

### technical
Technical details about projects, architecture, implementation.

```json
{
  "id": "rag-2026-01-27-040",
  "type": "technical",
  "topic": "project_ai_memory",
  "project": "OfflineAI",
  "title": "Memory Ledger Architecture",
  "content": "The memory system uses JSONL (JSON Lines) format with each entry containing: id, timestamp, projects array, author, type, summary, details, tags, related_files, links, source_convo, and source. This format enables cross-AI compatibility between Claude, ChatGPT, and OpenWebUI.",
  "confidence": "verified",
  "source": "chatgpt-memory-template.md",
  "tags": ["architecture", "jsonl", "memory_system"]
}
```

---

## Field Specifications

### id (required)
- Format: `rag-YYYY-MM-DD-###`
- Sequential numbering within each day
- Example: `rag-2026-01-27-001`

### type (required)
- Valid values: `fact`, `narrative`, `qa_pair`, `fit_assessment`, `technical`
- Lowercase

### topic (required)
- Broad category for retrieval
- Valid values:
  - `career_history` - Past roles, achievements, experience
  - `services` - Consulting offerings, pricing, engagement models
  - `skills` - Technical skills, tools, methodologies
  - `project_ai_memory` - AI Memory System specifics
  - `project_local_llm` - Local LLM Setup specifics
  - `project_neighborhood_share` - NeighborhoodShare specifics
  - `project_resilient_tomorrow` - Resilient Tomorrow specifics
  - `project_home_management` - Home Management System specifics
  - `philosophy` - Work approach, values, methodology
  - `personal` - Background, journey, non-work info
  - `fit` - Ideal client profile, engagement fit

### project (optional)
- PascalCase project name when applicable
- Valid values: `OfflineAI`, `MikeCareer`, `NeighborhoodShare`, `ResilientTomorrow`, `HomeManagement`
- Use `null` for general content

### content / answer (required)
- The actual retrievable text
- For `qa_pair`: use `question` and `answer` fields instead of `content`
- Should be self-contained (include necessary context)

### confidence (required)
- `verified` - Confirmed by Mike, documented source
- `inferred` - Reasonable assumption from context
- `approximate` - Dates or numbers are estimates

### source (required)
- Document or session that sourced this entry
- Examples: `mike_career_prompt.md`, `interview_session_about`, `OfflineAI_Ops_CheatSheet.md`

### tags (required, array)
- snake_case keywords
- Alphabetically sorted
- Include topic and project as tags

---

## Chatbot Behavior Guidelines

The chatbot should use this knowledge base to:

1. **Answer factual questions** - Pull from `fact` and `technical` entries
2. **Explain projects** - Use `narrative` entries for context
3. **Handle common queries** - Match against `qa_pair` entries
4. **Assess fit** - Use `fit_assessment` entries to guide visitors
5. **Be honest about limits** - If information isn't in the knowledge base, say so

### Fit Assessment Logic

When visitors ask about working with Mike:

```
IF visitor_need matches good_fit criteria:
  → Encourage contact, explain why it's a good fit

IF visitor_need matches not_ideal criteria:
  → Be honest, suggest alternatives or caveats

IF unclear:
  → Ask clarifying questions about team size, industry, problem
```

### Confidence Handling

```
IF confidence == "verified":
  → State directly

IF confidence == "inferred":
  → Add softening ("Based on available information...")

IF confidence == "approximate":
  → Note the approximation ("approximately", "around")
```

---

## File Locations

**Primary knowledge base:**
`/content/rag/knowledge.jsonl`

**Topic-specific files (for chunked retrieval):**
`/content/rag/topics/{topic}.jsonl`

**Q&A pairs (optimized for common queries):**
`/content/rag/qa_pairs.jsonl`

---

## Example Retrieval Scenarios

**Query:** "What has Mike worked on?"
**Retrieval:** Filter `type=fact OR type=narrative` WHERE `topic=career_history`

**Query:** "How does the AI Memory System work?"
**Retrieval:** Filter `topic=project_ai_memory` WHERE `type=technical OR type=narrative`

**Query:** "Is Mike a good fit for my startup?"
**Retrieval:** Filter `type=fit_assessment`, then use criteria matching

**Query:** "What does Mike charge?"
**Retrieval:** Filter `type=qa_pair` WHERE `tags CONTAINS pricing`

---

*Schema version: 1.0*
*Compatible with: RT-Assistant memory ledger format*
