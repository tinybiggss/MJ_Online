# Content Patterns

Templates and examples for common content types across Mike Jones' web properties.

## Table of Contents

1. [Case Study Template](#case-study-template)
2. [About Page Template](#about-page-template)
3. [Resume Structure](#resume-structure)
4. [Homepage Sections](#homepage-sections)
5. [Blog Post Patterns](#blog-post-patterns)
6. [CTAs and Conversion](#ctas-and-conversion)
7. [SEO Metadata](#seo-metadata)

---

## Case Study Template

### Standard Structure

```markdown
# [Project Name]

<div class="project-badges">
    [Appropriate badges here]
</div>

## Summary

[2-3 sentences: What it is, why it matters, key outcome]

## The Problem

[What challenge or need was addressed? Why did this matter?]

## The Approach

[Strategy, methodology, key decisions made]

## The Solution

### Technical Implementation
[Architecture, key technologies, how it works]

### AI/LLM Components (if applicable)
- Models used
- Prompt engineering approach
- Integration patterns
- Context management

## Results & Impact

- [Quantified outcome 1]
- [Quantified outcome 2]
- [Qualitative outcome]

## Key Learnings

[What was learned, what would be done differently]

## Technical Details

[Architecture diagrams, code samples, deeper dive for technical readers]

## Links

- [GitHub Repository](#)
- [Live Demo](#)
- [Related Blog Post](#)
```

### AI Project Emphasis

For AI-focused projects, add prominent callouts:

```markdown
> **AI Implementation Highlight:** This project demonstrates [specific AI skill]
> using [technologies], achieving [measurable outcome].
```

---

## About Page Template

### Mike Jones Standard

```markdown
# About Mike Jones

## Introduction

[Opening hook - who you are, professional identity]
[AI expertise front and center]
[What you're focused on building/solving]

## Professional Journey

[Career evolution narrative]
[Transition to AI/ML work]
[Key milestones]

## Current Focus

### [Focus Area 1: LLM Integration & Workflow Automation]
[Description]

### [Focus Area 2: Self-Hosted AI Infrastructure]
[Description]

### [Focus Area 3: Practical AI Application Development]
[Description]

### [Focus Area 4: AI Memory Systems]
[Description]

## Technical Expertise

### AI/ML Technologies
- [Bulleted list of AI-specific skills]

### Programming & Development
- [Languages, frameworks]

### Infrastructure
- [DevOps, hosting, tools]

## Beyond Work

[Personal interests, community involvement, Burning Man, etc.]

## Connect

**Find me online:**
- Fediverse: @index@mikejones.online
- LinkedIn: [link]
- GitHub: [link]

**Publications:**
- Resilient Tomorrow
- Operational Intelligence

---

[CTA: Ready to discuss? Contact link]
```

---

## Resume Structure

### Web Resume Format

```markdown
# Mike Jones
**AI Implementation Expert and LLM Integration Specialist**

[Contact info line]

## Professional Summary

[3-4 sentences emphasizing AI expertise and 29 years of experience]

## Core Competencies

### AI & LLM Integration
- [Skill 1]
- [Skill 2]

### [Other Category]
- [Skills]

## Professional Experience

### [Title] | [Company] | [Dates]

**Achievements:**
- [Quantified achievement]
- [Impact statement]

## Featured Projects

### AI Memory System
[Brief description with outcomes]

### Local LLM Setup
[Brief description with outcomes]

## Education & Certifications

[Degrees, relevant certifications]

---

<a href="/resume.pdf" class="resume-download-btn" download>
    Download Resume (PDF)
</a>
```

---

## Homepage Sections

### Hero Section

```markdown
# AI Implementation Expert and LLM Integration Specialist

Building intelligent systems that solve real problems.

[View Projects Button] [Download Resume Button]
```

### Featured Projects Grid

Display 3-4 cards:
1. **AI Memory System** - Always first (demonstrates AI skills)
2. **Local LLM Setup** - Second (demonstrates infrastructure)
3. [Third project]
4. [Fourth project - optional]

### Recent Writing

List format with:
- Title (linked)
- Publication date
- Brief excerpt (1-2 lines)
- Reading time

### Professional Summary Block

> With 29 years in tech, I specialize in AI implementation and LLM integration.
> My focus is building practical AI solutions that deliver measurable results.

---

## Blog Post Patterns

### Technical Post

```markdown
# [Title]

<div class="project-badges">
    [Relevant badges]
</div>

[Opening hook - the problem or question]

## The Challenge

[Context and problem statement]

## The Approach

[How you tackled it]

## Implementation

[Code examples, technical details]

## Results

[What happened, metrics]

## Key Takeaways

[Bulleted learnings]

---

*[CTA related to topic]*
```

### Insight/Opinion Post

```markdown
# [Title]

[Opening observation or thesis]

## [Section 1]

[Argument with examples]

## [Section 2]

[Further development]

## Implications

[What this means]

## Conclusion

[Wrap-up and call to action]
```

---

## CTAs and Conversion

### Primary CTAs

| Context | CTA Text | Link |
|---------|----------|------|
| Portfolio | View Projects | /tag/projects/ |
| Career | Download Resume | /resume.pdf |
| Contact | Get in Touch | /contact/ |
| Follow | Follow on Fediverse | fediverse handle |

### CTA Placement

- **Hero:** 1-2 CTAs max
- **End of posts:** Relevant next action
- **About page:** Contact CTA at bottom
- **Resume page:** PDF download prominent

### CTA Copy Guidelines

- Action-oriented verbs: View, Download, Get, Connect
- Clear outcome: "View Projects" not "Learn More"
- Brief: 2-4 words
- Contrast with surrounding content

---

## SEO Metadata

### Meta Description Formula

```
[Who] + [What they do] + [Key differentiator] + [Call to action]
```

**Example:**
```
Mike Jones is an AI Implementation Expert specializing in LLM integration and practical AI solutions. View projects and connect.
```

### Title Tag Formula

```
[Primary Keyword] | [Secondary Info] | [Brand]
```

**Examples:**
- About Mike Jones | AI Implementation Expert | mikejones.online
- AI Memory System Case Study | Mike Jones Portfolio
- Resume | Mike Jones | AI Implementation Expert

### Open Graph

Always include:
- og:title
- og:description
- og:image (1200x630 recommended)
- og:type (website, article)
- og:url

### Schema.org

Key schemas for this site:
- Person (Mike Jones)
- Article (blog posts)
- CreativeWork (projects)
- WebSite (homepage)
