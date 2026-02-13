#!/usr/bin/env python3
"""Create Phase 4 parallel tasks for Debbie and Doc Brown."""

import asyncio
import sys
import httpx
from datetime import datetime
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")


async def create_parallel_tasks():
    """Create Phase 4 integration tasks to run in parallel with Alice's QA work."""

    print("📋 Creating Phase 4 parallel tasks for Debbie & Doc Brown...\n")

    tasks = [
        # DEBBIE TASKS
        {
            "task_id": "phase4-seo",
            "title": "Phase 4.3: SEO Audit & Schema.org Implementation",
            "description": (
                "Comprehensive SEO audit and Schema.org structured data implementation.\n\n"
                "**Assignee:** Debbie (Design/UX expertise for metadata)\n\n"
                "**Tasks:**\n"
                "1. Audit all pages for SEO completeness (meta descriptions, Open Graph, Twitter Cards)\n"
                "2. Implement Person schema for Mike Jones (site-wide)\n"
                "3. Implement WebSite schema (site-wide)\n"
                "4. Add Article schema to case study pages\n"
                "5. Verify all images have og:image tags (1200x630px)\n"
                "6. Ensure meta descriptions are unique and compelling (150-160 chars)\n\n"
                "**Pages to audit:**\n"
                "- Homepage, About, Resume, Projects\n"
                "- AI Memory System case study\n"
                "- Local LLM case study\n"
                "- NeighborhoodShare case study\n\n"
                "**Implementation:**\n"
                "- Add schemas via Ghost Settings → Code Injection\n"
                "- Test with Google Rich Results Test\n"
                "- Validate all structured data\n\n"
                "**Deliverables:**\n"
                "- SEO audit report\n"
                "- Schema.org implementation complete\n"
                "- All pages SEO optimized\n\n"
                "**Can run in parallel with:** Alice's QA fixes, Substack integration\n\n"
                "**Estimated time:** 3-4 hours"
            ),
            "status": "available",
            "priority": "high",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": []
        },
        {
            "task_id": "phase4-substack-resilient",
            "title": "Phase 4.1: Substack Integration - Resilient Tomorrow",
            "description": (
                "Integrate Resilient Tomorrow Substack publication with MikeJones.online.\n\n"
                "**Assignee:** Debbie (PAGE_SPEC) → Doc Brown (HTML) → Alice (Publish)\n\n"
                "**Mike's requirement:** This should replace the broken 'Writing' navigation link\n\n"
                "**Approach:** Ghost Native Embeds (Option 1 - simplest for launch)\n\n"
                "**Debbie's tasks:**\n"
                "1. Create PAGE_SPEC for /resilient-tomorrow page\n"
                "2. Include: Publication description, recent posts section, Subscribe CTA\n"
                "3. Design for visual appeal (use brand colors, good typography)\n"
                "4. Specify bookmark cards for 5-7 most recent Substack posts\n"
                "5. Add SEO metadata (title, description, canonical links)\n\n"
                "**Doc Brown's tasks:**\n"
                "1. Convert PAGE_SPEC to semantic HTML\n"
                "2. Use Ghost bookmark cards markup for Substack embeds\n"
                "3. Ensure clean, semantic structure\n\n"
                "**Alice's tasks:**\n"
                "1. Get Substack URLs for recent posts (from Mike or Substack feed)\n"
                "2. Publish page via Ghost Admin API\n"
                "3. Update navigation to point 'Writing' → /resilient-tomorrow\n\n"
                "**Deliverables:**\n"
                "- /resilient-tomorrow page published\n"
                "- Navigation link fixed (no more 404!)\n"
                "- Recent Substack posts embedded\n"
                "- SEO optimized\n\n"
                "**Can run in parallel with:** Alice's other QA fixes, SEO audit\n\n"
                "**Estimated time:** 2-3 hours (Debbie: 1hr, Doc: 30min, Alice: 30min)"
            ),
            "status": "available",
            "priority": "high",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": []
        },
        {
            "task_id": "phase4-substack-opint",
            "title": "Phase 4.2: Substack Integration - Operational Intelligence",
            "description": (
                "Integrate Operational Intelligence Substack publication (if active).\n\n"
                "**Assignee:** Debbie (PAGE_SPEC) → Doc Brown (HTML) → Alice (Publish)\n\n"
                "**NOTE:** Verify with Mike if Operational Intelligence is active/should be included\n\n"
                "**Approach:** Same as Resilient Tomorrow (Ghost Native Embeds)\n\n"
                "**Tasks:**\n"
                "1. **Debbie:** Create PAGE_SPEC for /operational-intelligence page\n"
                "   - Distinct branding from Resilient Tomorrow\n"
                "   - Publication description\n"
                "   - Recent posts section\n"
                "   - Subscribe CTA\n"
                "2. **Doc Brown:** Convert PAGE_SPEC to semantic HTML\n"
                "3. **Alice:** Publish page via Ghost Admin API\n"
                "4. Add to navigation (if not in dropdown with Resilient Tomorrow)\n\n"
                "**Deliverables:**\n"
                "- /operational-intelligence page published\n"
                "- Distinct branding from Resilient Tomorrow\n"
                "- Recent posts embedded\n"
                "- SEO optimized\n\n"
                "**Can run in parallel with:** All Phase 4 tasks\n\n"
                "**Estimated time:** 2-3 hours (reuse Resilient Tomorrow approach)"
            ),
            "status": "available",
            "priority": "medium",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": []
        },
        {
            "task_id": "phase4-social-links",
            "title": "Phase 4.4: Social Media Links & Contact Enhancement",
            "description": (
                "Add social media links and enhance contact information.\n\n"
                "**Assignee:** Debbie (design) → Alice (implementation)\n\n"
                "**Tasks:**\n"
                "1. Add social media icons to footer (if not already present)\n"
                "   - LinkedIn (primary)\n"
                "   - GitHub (if appropriate)\n"
                "   - Mastodon/ActivityPub (@mike@MikeJones.online)\n"
                "   - Substack publications\n"
                "2. Ensure contact page has all methods:\n"
                "   - Email (primary)\n"
                "   - LinkedIn\n"
                "   - ActivityPub mention\n"
                "3. Add 'Follow me' section to About page (if not present)\n"
                "4. Verify all social links work and open in new tabs\n\n"
                "**Debbie's tasks:**\n"
                "- Design social media icon layout\n"
                "- Specify placement (footer, contact page, about page)\n"
                "- Choose icon style (matches design system)\n\n"
                "**Alice's tasks:**\n"
                "- Get correct URLs from Mike/RAG\n"
                "- Add icons/links via Ghost theme settings or code injection\n"
                "- Test all links\n\n"
                "**Deliverables:**\n"
                "- Social media links in footer\n"
                "- Contact page enhanced\n"
                "- All links verified working\n\n"
                "**Can run in parallel with:** All Phase 4 tasks\n\n"
                "**Estimated time:** 1-2 hours"
            ),
            "status": "available",
            "priority": "medium",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": []
        },
    ]

    async with httpx.AsyncClient() as client:
        for task in tasks:
            try:
                response = await client.post(
                    "http://localhost:8001/api/tasks",
                    json=task,
                    timeout=10.0
                )
                response.raise_for_status()
                print(f"✅ {task['task_id']}")
                print(f"   Title: {task['title']}")
                print(f"   Priority: {task['priority']}")
                print(f"   Assignee: {task['description'].split('Assignee:**')[1].split('\\n')[0].strip() if 'Assignee:**' in task['description'] else 'TBD'}")
                print()
            except Exception as e:
                print(f"❌ Error: {task['task_id']}: {e}\n")

    print("=" * 60)
    print("📊 PHASE 4 PARALLEL TASKS CREATED")
    print("=" * 60)
    print()
    print("🔴 HIGH PRIORITY (Should start while Alice works):")
    print("   • phase4-seo: SEO audit & Schema.org (Debbie) - 3-4 hrs")
    print("   • phase4-substack-resilient: Resilient Tomorrow page (Debbie→Doc→Alice) - 2-3 hrs")
    print()
    print("🟡 MEDIUM PRIORITY (Can wait or do in parallel):")
    print("   • phase4-substack-opint: Operational Intelligence page - 2-3 hrs")
    print("   • phase4-social-links: Social media links - 1-2 hrs")
    print()
    print("📈 Total Phase 4 work: ~8-12 hours (can be parallelized)")
    print()
    print("✅ These tasks are INDEPENDENT of Alice's QA work!")
    print("✅ Debbie and Doc Brown can start immediately!")
    print()
    print("📊 Dashboard: http://localhost:8001")


if __name__ == "__main__":
    asyncio.run(create_parallel_tasks())
