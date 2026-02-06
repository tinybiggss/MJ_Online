# mikejones.online Configuration

**Platform:** Ghost Pro
**Theme:** Kyoto v1.11.1
**Color Preset:** Onyx (dark mode)
**Accent Color:** #4F46E5 (Indigo)

## Quick Access

| Resource | URL |
|----------|-----|
| Live Site | https://mikejones.online |
| Ghost Admin | https://mikejones-online.ghost.io/ghost/ |
| Analytics | https://mikejones-online.ghost.io/ghost/#/analytics |
| Design Settings | https://mikejones-online.ghost.io/ghost/#/settings/design |
| Code Injection | https://mikejones-online.ghost.io/ghost/#/settings/code-injection |

## Site Purpose

Career portfolio and federated personal publishing platform for Mike Jones.

**Primary Goals:**
1. Demonstrate AI implementation and LLM integration expertise to employers/clients
2. Aggregate content from Substack publications
3. Enable audience building through ActivityPub federation
4. Showcase web development and technical capabilities

**Target Audiences:**
- Employers & Professional Contacts (60%) - hiring managers, recruiters, clients
- Content Followers (30%) - Substack readers, Fediverse users
- Technical Peers (10%) - developers, technical professionals

## Navigation Structure

**Primary Menu:**
1. Home (/)
2. Projects (/tag/projects/)
3. Writing (/tag/writing/)
4. About (/about/)
5. Resume (/resume/)

**Secondary Menu (Footer):**
1. Contact (/contact/)
2. RSS Feed (/rss/)

## Custom Features Installed

### AI/ML Project Badges

Available badge classes:
- `badge-ai` - AI Agent (purple gradient)
- `badge-ml` - Machine Learning (pink gradient)
- `badge-llm` - LLM (blue gradient)
- `badge-python` - Python (green gradient)
- `badge-langchain` - LangChain (pink-yellow gradient)
- `badge-openai` - OpenAI (blue-purple gradient)
- `badge-claude` - Claude (light gradient)
- `badge-production` - Production (red gradient)
- `badge-experimental` - Experimental (yellow gradient)
- `badge-automation` - Automation (blue gradient)
- `badge-rag` - RAG (purple gradient)

**Usage:**
```html
<div class="project-badges">
    <span class="badge badge-ai">AI Agent</span>
    <span class="badge badge-python">Python</span>
</div>
```

### Resume Download Button

```html
<a href="/content/files/resume.pdf" class="resume-download-btn" download>
    Download Resume (PDF)
</a>
```

### Enhanced Code Blocks

- Dark theme with syntax highlighting
- Automatic copy buttons on hover
- No special configuration needed

## ActivityPub Configuration

**Fediverse Handle:** @index@mikejones.online
**Profile URL:** https://www.mikejones.online/.ghost/activitypub/users/index
**Management:** Settings → Membership → Network

## Content Guidelines

### Priority Projects to Feature

1. **AI Memory System** - CRITICAL: Demonstrates AI implementation skills
2. **Local LLM Setup** - CRITICAL: Demonstrates AI infrastructure expertise
3. Resilient Tomorrow publication
4. NeighborhoodShare
5. Home Management System
6. Burning Man projects

### Content Types

- **Project Case Studies** - In-depth, polished writeups with badges
- **Activity Feed Posts** - Short updates, milestones, announcements
- **Static Pages** - About, Resume, Contact

### Homepage Hero Content

```
Title: AI Implementation Expert and LLM Integration Specialist
Subtitle: Building intelligent systems that solve real problems
Primary CTA: View Projects
Secondary CTA: Download Resume
```

## Backup Information

**Ghost Pro:** Automatic backups handled by Ghost
**Manual Export:** Settings → Import/Export → Export
**Custom Code Backup:** `/devlog/phase-2-6-code-injection-evaluation.md`

## Theme Updates

**Kyoto Theme:** https://themex.studio/kyoto/
**Update Process:**
1. Download new version
2. Settings → Theme → Upload theme
3. Test on preview before activating
