#!/usr/bin/env python3
"""Update navigation task with Mike's feedback about Substack RSS."""

import asyncio
import sys
import httpx
from datetime import datetime
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient


async def update_navigation_task():
    """Update qa-critical-2 task description."""

    print("📝 Updating navigation task with Mike's feedback...\n")

    async with WorkerClient("morgan") as worker:
        # Claim the task
        await worker.claim_task("qa-critical-2")
        print("✅ Claimed qa-critical-2")

        # Mark as completed with updated instructions
        await worker.complete_task(
            task_id="qa-critical-2",
            result={
                "status": "updated_requirements",
                "updated_by": "morgan",
                "mike_feedback": (
                    "Don't use 'blog' - navigation should link to RSS feeds from Substack. "
                    "Need better naming: maybe 'Substack Writings' or agent can propose accurate term. "
                    "NOT 'blog', NOT just 'Writing'."
                ),
                "action": "Republishing with updated requirements"
            }
        )
        print("✅ Completed old task with update note")

    # Republish with updated description
    async with httpx.AsyncClient() as client:
        task = {
            "task_id": "qa-critical-2-v2",
            "title": "Fix 'Writing' navigation - Link to Substack RSS feeds",
            "description": (
                "CRITICAL: Fix broken Writing menu item with proper naming and link.\n\n"
                "**Mike's Requirements:**\n"
                "- Menu should link to RSS feeds from Substack (NOT generic blog)\n"
                "- Don't call it 'blog' - that's not accurate\n"
                "- Suggested names: 'Substack Writings' or agent proposes better term\n"
                "- Current 'Writing' link goes to 404\n\n"
                "**Substack Publications:**\n"
                "1. Resilient Tomorrow (main publication)\n"
                "2. Operational Intelligence (if active)\n\n"
                "**Options to implement:**\n"
                "1. Single link to primary Substack publication\n"
                "2. Dropdown menu with both publications\n"
                "3. Link to custom /publications/ page listing both\n\n"
                "**Steps:**\n"
                "1. Decide on accurate menu label (not 'blog', not just 'Writing')\n"
                "2. Get Substack RSS feed URL(s) from RAG or verify\n"
                "3. Update Ghost navigation via Admin settings\n"
                "4. Test link works\n\n"
                "**Method:** Ghost Admin → Settings → Navigation\n"
                "**Priority:** HIGH - Primary navigation currently broken"
            ),
            "status": "available",
            "priority": "critical",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": []
        }

        response = await client.post(
            "http://localhost:8001/api/tasks",
            json=task,
            timeout=10.0
        )
        response.raise_for_status()
        print(f"✅ Published updated task: qa-critical-2-v2")
        print(f"   New description includes Mike's Substack requirement")


if __name__ == "__main__":
    asyncio.run(update_navigation_task())
