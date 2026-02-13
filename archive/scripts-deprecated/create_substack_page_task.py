#!/usr/bin/env python3
"""Create Substack landing page design task for Debbie."""

import asyncio
import sys
import httpx
from datetime import datetime

sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")


async def create_substack_page_task():
    """Create comprehensive Substack page design and implementation task."""

    print("📋 Creating Substack landing page task...\n")

    task = {
        "task_id": "substack-landing-page",
        "title": "Design & Implement Substack Landing Page (Two Publications)",
        "description": (
            "Create a dedicated page showcasing Mike's two Substack publications with RSS feeds.\n\n"
            "**USER REQUIREMENTS:**\n"
            "- Two-column layout (Resilient Tomorrow + Org Intelligence/Velocity Partners)\n"
            "- Header text explaining Mike's writing/Substacks\n"
            "- Each column contains:\n"
            "  * Publication logo/branding\n"
            "  * Screenshot of the Substack site\n"
            "  * Link to actual Substack site\n"
            "  * RSS feed showing recent articles\n\n"
            "**PUBLICATION DETAILS:**\n\n"
            "**Column 1: Resilient Tomorrow**\n"
            "- Topic: Community resilience, 7 Pillars framework\n"
            "- URL: https://resilienttomorrow.substack.com\n"
            "- RSS Feed: https://resilienttomorrow.substack.com/feed\n"
            "- Brand: Use existing Resilient Tomorrow logo/colors\n"
            "- RAG verification: Check /Cowork/content/rag/knowledge.jsonl for details\n\n"
            "**Column 2: Org Intelligence (Velocity Partners)**\n"
            "- Topic: Organizational intelligence, AI implementation, product management\n"
            "- URL: https://orgintelligence.substack.com (or similar - verify)\n"
            "- RSS Feed: https://orgintelligence.substack.com/feed (verify)\n"
            "- Brand: Velocity Partners branding\n"
            "- RAG verification: Check /Cowork/content/rag/knowledge.jsonl for VP details\n\n"
            "**WORKFLOW:**\n\n"
            "**Phase 1: Design (Debbie)**\n"
            "1. Create PAGE_SPEC for Substack landing page\n"
            "2. Design two-column responsive layout\n"
            "3. Specify header copy explaining Mike's writing\n"
            "4. Design publication cards with:\n"
            "   - Logo placement\n"
            "   - Screenshot mockup positioning\n"
            "   - CTA button to visit Substack\n"
            "   - RSS feed article list styling\n"
            "5. Ensure mobile-responsive stacking (columns stack on mobile)\n"
            "6. Apply design system (DESIGN-SYSTEM.md)\n"
            "7. Verify all facts against RAG\n"
            "8. Save to: /design/PAGE_SPEC-Substack-Landing.md\n\n"
            "**Phase 2: Content Assembly (Doc Brown + Mobiledoc Assembler)**\n"
            "1. Write header copy (Doc Brown)\n"
            "2. Generate HTML from PAGE_SPEC\n"
            "3. Include RSS feed integration code\n"
            "4. Convert to Mobiledoc JSON\n\n"
            "**Phase 3: Asset Collection (Alice)**\n"
            "1. Get/create screenshots of both Substack sites\n"
            "2. Upload logos to Ghost CDN\n"
            "3. Upload screenshots to Ghost CDN\n"
            "4. Provide URLs to Mobiledoc Assembler\n\n"
            "**Phase 4: Implementation (Alice)**\n"
            "1. Create new Ghost page via Admin API\n"
            "2. Slug: /writing or /substacks\n"
            "3. Publish Mobiledoc JSON\n"
            "4. Configure RSS feed fetching (JavaScript or Ghost custom code)\n"
            "5. Test RSS feed display\n"
            "6. Verify mobile responsive\n\n"
            "**Phase 5: Navigation Update (Alice)**\n"
            "1. Update 'Substack' navigation link to point to this new page\n"
            "2. Or keep as dropdown with both Substacks + landing page option\n\n"
            "**TECHNICAL NOTES:**\n"
            "- RSS feed parsing: Use JavaScript fetch() or Ghost code injection\n"
            "- Feed format: Standard RSS 2.0 from Substack\n"
            "- Display: Show title, date, excerpt for each article (last 5-10 articles)\n"
            "- Caching: Consider caching feed results (Ghost or CDN)\n\n"
            "**ASSETS NEEDED:**\n"
            "- Resilient Tomorrow logo (check /assets/brand/)\n"
            "- Velocity Partners logo (check /assets/brand/)\n"
            "- Screenshot of Resilient Tomorrow Substack (create new)\n"
            "- Screenshot of Org Intelligence Substack (create new)\n\n"
            "**QUALITY CHECKS:**\n"
            "- ✅ All facts RAG-verified\n"
            "- ✅ Design system consistency\n"
            "- ✅ RSS feeds loading correctly\n"
            "- ✅ Links working to both Substacks\n"
            "- ✅ Mobile responsive (columns stack)\n"
            "- ✅ Fast page load (optimized images)\n"
            "- ✅ Analytics tracking on CTA clicks\n\n"
            "**USER FEEDBACK:**\n"
            "Mike said: 'That needs to have better design, I think' - so prioritize visual polish.\n"
            "Make it professional, clean, and clearly showcase both publications.\n\n"
            "**DELIVERABLES:**\n"
            "1. /design/PAGE_SPEC-Substack-Landing.md (Debbie)\n"
            "2. Live page at mikejones.online/writing or /substacks (Alice)\n"
            "3. Updated navigation pointing to new page (Alice)\n"
            "4. Working RSS feeds for both publications (Alice)\n\n"
            "**START WITH:** Debbie creates PAGE_SPEC first, then coordinate with Doc and Alice."
        ),
        "status": "available",
        "priority": "high",
        "created_at": datetime.now().isoformat(),
        "owner": None,
        "blocked_by": []
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8001/api/tasks",
                json=task,
                timeout=10.0
            )
            response.raise_for_status()
            print(f"✅ Published: {task['task_id']}")
            print(f"   Title: {task['title']}")
            print(f"   Priority: {task['priority']}")
            print(f"   Status: Available for Debbie to claim")
            print()
            print("📊 Dashboard: http://localhost:8001")
            print()
            print("✅ Debbie can claim this task and start with PAGE_SPEC design!")
            return True
        except Exception as e:
            print(f"❌ Error publishing task: {e}")
            return False


async def send_coordination_message():
    """Notify team about new Substack page task."""
    from agent_coordination.client import WorkerClient

    async with WorkerClient("morgan") as worker:
        await worker.send_coordination_message(
            "📋 NEW TASK: Substack Landing Page\n\n"
            "Mike has clarified the Substack navigation requirement:\n\n"
            "**Two Substacks to showcase:**\n"
            "1. Resilient Tomorrow - Community resilience\n"
            "2. Org Intelligence - Velocity Partners publication\n\n"
            "**Page Design:**\n"
            "- Two-column layout (responsive)\n"
            "- Each column: logo, screenshot, link, RSS feed\n"
            "- Header explaining Mike's writing\n"
            "- Professional, polished design\n\n"
            "**Task ID:** substack-landing-page\n"
            "**First step:** Debbie creates PAGE_SPEC design\n"
            "**Then:** Doc/Alice implement with RSS feeds\n\n"
            "Task available in dashboard: http://localhost:8001\n\n"
            "Debbie - this is ready for you to claim! 🎨"
        )
        print("✅ Coordination message sent to team")


if __name__ == "__main__":
    success = asyncio.run(create_substack_page_task())
    if success:
        asyncio.run(send_coordination_message())
        print("\n🎯 Task created and team notified!")
        print("📱 Debbie should see this in her queue now")
    else:
        print("\n⚠️ Task creation failed")
