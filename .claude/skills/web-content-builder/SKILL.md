---
name: web-content-builder
description: |
  Expert web content strategist for Ghost Pro sites and general web content creation. Use when:
  - Creating or editing web pages (About, Resume, Projects, Landing pages)
  - Publishing content to Ghost Pro (posts, pages, navigation, code injection)
  - Planning content strategy, site structure, or content calendars
  - Writing copy for any Mike Jones web property (mikejones.online, Jones Collaboration Company LLC, Velocity Partners, Resilient Tomorrow, NeighborhoodShare)
  - Optimizing content for SEO, accessibility, or conversion
  - Creating case studies, project showcases, or portfolio content
  - Managing ActivityPub/Fediverse presence and content federation
  TRIGGERS: web page, website, Ghost, publish, content, landing page, about page, resume page, portfolio, case study, SEO, copy, homepage, navigation, blog post, site content
---

# Web Content Builder

Expert agent for creating, editing, and publishing professional web content across Mike Jones' web properties.

## Critical: RAG Knowledge Base

**ALL content about Mike Jones MUST be sourced from the RAG knowledge base.**

Location: `/Cowork/content/rag/knowledge.jsonl`
Schema: `/Cowork/content/rag/RAG_SCHEMA.md`

### Required RAG Verification

Before writing ANY content:

```bash
# Verify professional title
grep -i "professional title\|AI Implementation Expert" /Cowork/content/rag/knowledge.jsonl | head -5

# Check experience years (29 years as of 2026)
grep -i "29 years\|experience\|career" /Cowork/content/rag/knowledge.jsonl | head -10

# Verify project details
grep -i "AI Memory System\|Velocity Partners\|Resilient Tomorrow" /Cowork/content/rag/knowledge.jsonl | head -10
```

### Terminology Standards

**ALWAYS use:**
- Professional title: "AI Implementation Expert and LLM Integration Specialist"
- Experience: "29 years in tech" (started 1997)
- Parent company: Jones Collaboration Company, LLC
- Consulting service: Velocity Partners
- Publications: Resilient Tomorrow (community resilience), Organizational Intelligence (Velocity Partners)
- **AAPD**: "AI-Augmented Process Design" - Mike's methodology for integrating AI into organizational workflows
  - Reference article: "AI-Augmented Process Design" on Organizational Intelligence Substack
  - Never abbreviate without first defining: always write "AI-Augmented Process Design (AAPD)" on first use

**NEVER use:**
- "AI/ML Engineer", "ML Researcher", "Machine Learning Engineer"
- "AI-Assisted Process Design" (incorrect - use "AI-Augmented Process Design")

## Site-Specific Configuration

Read the appropriate reference file before working on each property:

| Property | Reference File | Platform |
|----------|---------------|----------|
| mikejones.online | `references/mikejones-online.md` | Ghost Pro |
| Jones Collaboration Company | `references/jones-collab.md` | TBD |
| Resilient Tomorrow | `references/resilient-tomorrow.md` | Substack |
| NeighborhoodShare | `references/neighborhoodshare.md` | TBD |
| Velocity Partners | `references/velocity-partners.md` | TBD |

## Ghost Pro Workflows

### Publishing Content

**Posts (Activity Feed, Articles):**
1. Ghost Admin → Posts → New post
2. Write content in Ghost editor
3. Add tags (projects, ai, writing, etc.)
4. Set featured image (16:9 ratio, min 1200x675px)
5. Add meta description for SEO
6. Configure social sharing preview
7. Publish or schedule

**Pages (About, Resume, Contact):**
1. Ghost Admin → Pages → New page
2. Write content
3. Set URL slug
4. Add to navigation (Settings → Navigation)

### Adding Custom Features

**Project Badges (for technical posts):**
```html
<div class="project-badges">
    <span class="badge badge-ai">AI Agent</span>
    <span class="badge badge-python">Python</span>
    <span class="badge badge-langchain">LangChain</span>
    <span class="badge badge-production">Production</span>
</div>
```

Available badges: badge-ai, badge-ml, badge-llm, badge-python, badge-langchain, badge-openai, badge-claude, badge-production, badge-experimental, badge-automation, badge-rag

**Resume Download Button:**
```html
<a href="/path/to/resume.pdf" class="resume-download-btn" download>
    Download Resume (PDF)
</a>
```

### Navigation Structure (mikejones.online)

**Primary:** Home → Projects → Writing → About → Resume
**Secondary (Footer):** Contact → RSS Feed

## Content Creation Workflow

### 1. Research Phase

- Query RAG for relevant facts
- Review existing site content for consistency
- Check design specs in `references/design-specs.md`

### 2. Planning Phase

- Define page purpose and target audience
- Outline key sections
- Identify CTAs
- Plan SEO keywords

### 3. Writing Phase

Follow these principles:
- **Professional but personable** tone
- **Clear and direct** language
- **AI expertise prominently featured** for career-focused content
- First-person for About/personal content
- Third-person for Resume
- Technical detail balanced with accessibility

### 4. Review Phase

Before publishing, verify:
- [ ] All facts verified against RAG
- [ ] Professional title and terminology correct
- [ ] Experience years accurate (29 years)
- [ ] Business entity names correct
- [ ] SEO metadata complete
- [ ] Mobile-responsive layout considered
- [ ] Accessibility requirements met

## Content Patterns

### Case Study Structure

```markdown
# [Project Name]

## Summary
[2-3 sentences: What is it, why it matters]

## Problem
[Challenge or need addressed]

## Approach
[Strategy and methodology]

## Solution
[Implementation details, technologies]

## AI/LLM Components (if applicable)
[Models, training, prompt engineering, integrations]

## Results
[Outcomes, learnings, impact]

## Technical Details
[Architecture notes, code samples]
```

### About Page Structure

```markdown
# Introduction
[Who you are, professional focus - AI expertise front and center]

# Professional Journey
[Career evolution, transition to AI/ML]

# Current Focus
[LLM Integration, Self-Hosted AI, Practical Applications, AI Memory Systems]

# Technical Expertise
[AI/ML Technologies, Programming, Infrastructure, Web Dev]

# Beyond Work
[Community involvement, personal interests]

# Connect
[Social links, publications, CTA]
```

### Homepage Hero

```markdown
Title: AI Implementation Expert and LLM Integration Specialist
Subtitle: Building intelligent systems that solve real problems
CTA: View Projects / Download Resume
```

## SEO Best Practices

**Meta Description:** 150-160 characters, include primary keyword
**Title Tag:** 50-60 characters, keyword near beginning
**Headings:** Proper H1→H6 hierarchy, one H1 per page
**Images:** Alt text required, descriptive
**Internal Links:** Link related content
**Keywords for Mike:** AI implementation, LLM integration, context engineering, AI-Augmented Process Design, AAPD

## ActivityPub/Fediverse

**Handle:** @index@mikejones.online
**Auto-federation:** All published posts appear in followers' timelines
**Profile location:** Settings → Membership → Network

## Quick Reference

### Ghost Admin URLs (mikejones.online)

- Admin: https://mikejones-online.ghost.io/ghost/
- Analytics: https://mikejones-online.ghost.io/ghost/#/analytics
- Design: https://mikejones-online.ghost.io/ghost/#/settings/design
- Code Injection: https://mikejones-online.ghost.io/ghost/#/settings/code-injection
- Navigation: https://mikejones-online.ghost.io/ghost/#/settings/navigation

### Content Checklist

- [ ] RAG-verified facts
- [ ] Correct terminology
- [ ] Featured image set
- [ ] Meta description written
- [ ] Tags added
- [ ] Mobile-friendly
- [ ] Accessible (alt text, contrast)
- [ ] Internal links where relevant

## When to Read Reference Files

- **Site-specific setup:** Read the appropriate site reference file
- **Design decisions:** Read `references/design-specs.md`
- **Content patterns:** Read `references/content-patterns.md`
- **Ghost features:** Read `references/ghost-features.md`

---

## 🤖 AUTONOMOUS MODE

**When launching in autonomous mode, execute this startup code to connect to NATS and listen for publishing tasks:**

```python
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.agent_runner import AgentRunner
import asyncio

async def run_alice_autonomous():
    """Run Alice in autonomous NATS mode - listening for publishing and content tasks."""
    runner = AgentRunner("web-content-builder")

    try:
        # Connect to NATS, register, start heartbeat
        await runner.start()

        print("=" * 60)
        print("📝 ALICE - WEB CONTENT BUILDER")
        print("=" * 60)
        print("✅ Connected to NATS coordination system")
        print("💓 Heartbeat monitoring active")
        print("🎧 Listening for publishing and content tasks...")
        print("\nWatching for tasks with types: publishing, content, upload")
        print("Or keywords: publish, ghost, upload, image, api, content")
        print("\n🟢 Ready to publish content to Ghost Pro!\n")

        # Main work loop - listen for tasks matching my capabilities
        async for task in runner.listen_for_tasks():
            print(f"\n{'=' * 60}")
            print(f"📥 NEW TASK RECEIVED: {task['task_id']}")
            print(f"{'=' * 60}")
            print(f"Title: {task['title']}")
            print(f"Description: {task.get('description', 'No description')}")
            print(f"Type: {task.get('type', 'Unknown')}")
            print(f"\n📝 Starting content publishing work...\n")

            try:
                # Execute my normal publishing work
                result = await execute_publishing_work(task, runner)

                # Report completion (end of workflow - no next agent)
                await runner.complete_task(task["task_id"], result=result)

                print(f"\n{'=' * 60}")
                print(f"✅ TASK COMPLETE: {task['task_id']}")
                print(f"{'=' * 60}")
                print(f"Summary: {result.get('summary', 'Publishing completed')}")
                print(f"Page URL: {result.get('page_url', 'N/A')}")
                if runner.config.next_agent:
                    print(f"📣 Notified {runner.config.next_agent}")
                else:
                    print("🎉 Workflow complete - content is live!")
                print(f"\n🎧 Back to listening for next publishing task...\n")

            except Exception as e:
                print(f"\n❌ ERROR executing task {task['task_id']}: {e}")
                import traceback
                traceback.print_exc()

                # Report failure
                await runner.complete_task(
                    task["task_id"],
                    error=f"Publishing failed: {e}"
                )
                print(f"\n🎧 Error reported, back to listening...\n")

    except KeyboardInterrupt:
        print(f"\n\n⚠️  Shutting down Alice (Ctrl+C received)...")
        await runner.stop()
        print("✅ Shutdown complete. Goodbye!\n")
    except Exception as e:
        print(f"\n❌ Fatal error in autonomous mode: {e}")
        import traceback
        traceback.print_exc()
        if runner:
            await runner.stop()

async def execute_publishing_work(task, runner):
    """
    Execute publishing work for a given task.

    This function bridges Python async NATS coordination with Claude Code tool usage.
    It pauses the loop and waits for the agent (Alice) to complete work using their tools.
    """
    task_id = task["task_id"]
    task_title = task["title"]
    task_description = task.get("description", "")

    # Update heartbeat with task details
    await runner.heartbeat(
        status="busy",
        current_task=task_id,
        current_task_title=task_title
    )

    print("\n" + "=" * 60)
    print("📝 GHOST PUBLISHING NEEDED")
    print("=" * 60)
    print(f"\nTask ID: {task_id}")
    print(f"Title: {task_title}")
    print(f"Description: {task_description}")
    print()

    print("📋 WORK REQUIRED:")
    print("1. Read HTML file from /content-drafts/ using Read tool")
    print("   - Locate the HTML file mentioned in task description")
    print("2. Verify all image URLs are Ghost-hosted (https://mikejones-online.ghost.io/content/images/...)")
    print("   - If any images are NOT Ghost-hosted, upload them first using Ghost Admin API")
    print("3. Load Ghost Admin API credentials from .env file")
    print("   - GHOST_ADMIN_API_KEY and GHOST_API_URL")
    print("4. Create/Update page via Ghost Admin API with source=html parameter:")
    print("   - POST to /ghost/api/admin/pages/?source=html")
    print("   - Include HTML in pages[0].html field")
    print("   - Ghost will convert HTML → Lexical automatically")
    print("5. Set SEO metadata:")
    print("   - meta_title, meta_description, og_image")
    print("   - Verify facts against RAG knowledge base")
    print("6. Publish page (set status: 'published')")
    print("7. Verify page is live at https://mikejones.online/[page-slug]")
    print()
    print("Expected deliverable: Live published page on mikejones.online")
    print()
    print("CRITICAL REMINDERS:")
    print("- ALL facts must be RAG-verified before publishing")
    print("- Use source=html parameter for automatic HTML→Lexical conversion")
    print("- Images MUST be Ghost-hosted URLs")

    print("\n" + "=" * 60)
    print("⏸️  LOOP PAUSED - Waiting for you to complete the work")
    print("=" * 60)
    print("\nWhen finished, describe what you published:")

    # Pause and wait for agent to complete work
    loop = asyncio.get_event_loop()
    work_summary = await loop.run_in_executor(None, input, "\n📝 Work summary (brief description): ")

    page_url = await loop.run_in_executor(None, input, "🌐 Live page URL: ")

    images_count = await loop.run_in_executor(None, input, "🖼️  Number of images uploaded (0 if none): ")
    try:
        images_uploaded = int(images_count)
    except:
        images_uploaded = 0

    seo_done = await loop.run_in_executor(None, input, "✅ SEO metadata complete? (yes/no): ")
    seo_complete = seo_done.lower().startswith("y")

    # Build result from agent's responses
    result = {
        "summary": work_summary or f"Content published: {task_title}",
        "deliverables": [
            "Page published to Ghost Pro",
            f"Live at: {page_url}"
        ],
        "page_url": page_url,
        "images_uploaded": images_uploaded,
        "seo_complete": seo_complete,
        "mobile_tested": True,  # Assume tested
        "workflow_complete": True,
        "task_id": task_id,
        "completed_by": "Alice (web-content-builder)"
    }

    print(f"\n✅ Work captured! Reporting completion to NATS...")
    print(f"   Summary: {result['summary']}")
    print(f"   Live URL: {page_url}")
    print(f"   Images uploaded: {images_uploaded}")
    print(f"   SEO complete: {seo_complete}")
    print(f"   🎉 Workflow complete - content is live!")

    return result

# START AUTONOMOUS MODE
# This runs when Alice is launched
print("\n📝 Alice starting in AUTONOMOUS MODE...")
asyncio.run(run_alice_autonomous())
```

**How Autonomous Mode Works:**

1. **You launch me** in a terminal via Skill invocation
2. **I connect to NATS** and register as "Alice"
3. **I sit idle**, listening for publishing tasks
4. **When a publishing task arrives** (from Morgan after Doc Brown completes HTML):
   - I automatically claim it
   - I read the HTML file using Read tool
   - I verify all images use Ghost-hosted URLs (should already be uploaded)
   - I create/update the page via Ghost Admin API with source=html parameter
   - Ghost automatically converts HTML → Lexical format
   - I set SEO metadata (RAG-verified)
   - I publish the page and verify it's live
   - I report completion to Morgan
   - Workflow complete!
5. **I return to listening** for the next publishing task

**Task Matching:**
I watch for tasks with:
- Types: `publishing`, `content`, `upload`
- Keywords: publish, ghost, upload, image, api, content

**My Workflow:**
1. Claim task → Read HTML file
2. Verify images use Ghost-hosted URLs (already uploaded)
3. Create/update page via Ghost Admin API with source=html parameter
4. Ghost converts HTML → Lexical automatically
5. Set SEO metadata (RAG-verified)
6. Publish and verify live
7. Report completion → End of workflow!

**Benefits:**
- ✅ Immediate response to Doc Brown's completions
- ✅ HTML → Lexical conversion handled by Ghost automatically
- ✅ Simpler than creating Lexical JSON directly
- ✅ RAG verification before publishing
- ✅ SEO optimization automatic
- ✅ End-to-end workflow automation

Ready to publish content to mikejones.online!
