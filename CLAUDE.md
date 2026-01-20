<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MJ_Online** is a personal web publishing platform - a "personal web view" that allows publishing content that others can subscribe to. Think of it as owning your own corner of the internet with built-in subscription/syndication capabilities.

**Status**: New project - architecture and tech stack to be determined.

## Project Vision

- Personal website as the canonical source for published content
- Subscription mechanism for followers (RSS, email newsletter, ActivityPub, or similar)
- Content publishing tools integrated into the site
- Modern, clean interface

## Potential Architecture Patterns

These are options to consider, not decisions yet made:

**Static Site + Headless CMS**: Astro/Hugo/11ty + subscription service
**Full-Stack**: Next.js/SvelteKit with database
**IndieWeb Stack**: Microformats + Webmentions + RSS
**Fediverse Integration**: ActivityPub for decentralized social

## Development Commands

*To be filled in once tech stack is chosen*

```bash
# Install dependencies
# npm install / pip install -r requirements.txt

# Run development server
# npm run dev / python manage.py runserver

# Build for production
# npm run build

# Run tests
# npm test / pytest
```

## Project Conventions

### Code Style
- Always use Python when possible (unless frontend requires JS)
- Never use single-letter variable names
- Always use a virtual environment (./venv or ./env)
- Never use Conda

### Testing
- Prioritize integration testing over heavily mocked unit tests
- Only mock external dependencies when necessary
- Test at boundaries (external services), not internal components

### Planning & Documentation
- Requirements and plans go in `/plans`
- Save devlog entries in `/devlog` under feature name

### Git Workflow
- Don't summarize at the end; wait for user review before commit
- Background long-running processes (like dev servers)

### Code Preservation
- NEVER comment out existing features to "simplify for now"
- Create separate test files for isolated testing
- Maintain all existing features while adding new ones
