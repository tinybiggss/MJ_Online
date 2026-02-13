#!/usr/bin/env python3
"""Update task dependencies so critical fixes happen before image work."""

import asyncio
import sys
import httpx
from datetime import datetime
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient


async def update_task_priorities():
    """Update task dependencies for correct priority order."""

    print("📋 Updating task priorities and dependencies...\n")
    print("Goal: Critical fixes FIRST, then image work\n")

    async with WorkerClient("morgan") as worker:
        # Step 1: Get all current tasks
        all_tasks = await worker.get_available_tasks(limit=100)

        print(f"Current available tasks: {len(all_tasks)}")
        for task in all_tasks:
            print(f"  - {task['task_id']}: {task['title'][:50]}...")
            print(f"    Blocked by: {task['blocked_by']}")
        print()

        # Step 2: Mark old image tasks as completed (we'll republish with new dependencies)
        old_image_tasks = ['qa-img-1', 'qa-img-3']

        for task_id in old_image_tasks:
            try:
                await worker.claim_task(task_id)
                await worker.complete_task(
                    task_id=task_id,
                    result={
                        "status": "republished_with_dependencies",
                        "reason": "Updating dependencies - critical fixes must complete first",
                        "updated_by": "morgan"
                    }
                )
                print(f"✅ Removed old version: {task_id}")
            except Exception as e:
                print(f"⚠️  Could not remove {task_id}: {e}")

    # Step 3: Republish image tasks with dependencies on critical fixes
    async with httpx.AsyncClient() as client:
        new_tasks = [
            {
                "task_id": "qa-img-1-v2",
                "title": "Upload OfflineAI-Session-Workflow.png to Ghost CDN",
                "description": (
                    "Upload the missing Local LLM workflow diagram to Ghost media library.\n\n"
                    "**DEPENDENCY:** Only start after critical fixes complete (qa-critical-1, qa-critical-2-v2)\n\n"
                    "**Source file:** /Users/michaeljones/Dev/MJ_Online/assets/projects/local-llm/OfflineAI-Session-Workflow.png\n"
                    "**Size:** 841KB\n"
                    "**Purpose:** Technical diagram showing session workflow for Local LLM article\n\n"
                    "**Steps:**\n"
                    "1. Upload via Ghost Admin API /images/upload endpoint\n"
                    "2. Record Ghost CDN URL\n"
                    "3. Report URL in completion result for insertion task"
                ),
                "status": "available",
                "priority": "high",
                "created_at": datetime.now().isoformat(),
                "owner": None,
                "blocked_by": ["qa-critical-1", "qa-critical-2-v2"]
            },
            {
                "task_id": "qa-img-2-v2",
                "title": "Insert Local LLM diagrams into technical article",
                "description": (
                    "Insert both architecture and workflow diagrams into the Local LLM Infrastructure article.\n\n"
                    "**Article URL:** https://www.mikejones.online/local-llm-infrastructure/\n\n"
                    "**Images to insert:**\n"
                    "1. Offline-AI-Architecture.png (already uploaded)\n"
                    "   - Ghost URL: https://www.mikejones.online/content/images/2026/02/Offline-AI-Architecture.png\n"
                    "   - Insert after architecture overview paragraph\n"
                    "2. OfflineAI-Session-Workflow.png (from qa-img-1-v2)\n"
                    "   - Insert after session workflow explanation\n\n"
                    "**Method:** Edit article via Ghost Admin API with source=html parameter\n"
                    "**Quality:** Each image needs descriptive alt text"
                ),
                "status": "available",
                "priority": "high",
                "created_at": datetime.now().isoformat(),
                "owner": None,
                "blocked_by": ["qa-img-1-v2"]
            },
            {
                "task_id": "qa-img-3-v2",
                "title": "Upload NeighborhoodShare screenshots to Ghost CDN",
                "description": (
                    "Upload key NeighborhoodShare screenshots to Ghost media library.\n\n"
                    "**DEPENDENCY:** Only start after critical fixes complete (qa-critical-1, qa-critical-2-v2)\n\n"
                    "**Priority screenshots:**\n"
                    "1. Home-Tool-Selection.png - Main interface showing tool browsing\n"
                    "2. Add-Tool-AI-2.png - AI-powered cataloging (check if Add-Tool-AI-2-1.png exists)\n"
                    "3. Admin-Prod-4-AIMonitoring.png - AI monitoring dashboard\n"
                    "4. Tool-Detail-Owner.png - Tool detail page (owner view)\n"
                    "5. LandingPage.png - Landing page design\n\n"
                    "**Source folder:** /Users/michaeljones/Dev/MJ_Online/assets/projects/neighborhoodshare/\n\n"
                    "**Steps:**\n"
                    "1. Upload each via Ghost Admin API /images/upload endpoint\n"
                    "2. Record all Ghost CDN URLs\n"
                    "3. Document which screenshot shows which feature\n"
                    "4. Report URLs in completion result"
                ),
                "status": "available",
                "priority": "high",
                "created_at": datetime.now().isoformat(),
                "owner": None,
                "blocked_by": ["qa-critical-1", "qa-critical-2-v2"]
            },
            {
                "task_id": "qa-img-4-v2",
                "title": "Insert NeighborhoodShare screenshots into articles",
                "description": (
                    "Insert NeighborhoodShare screenshots into project article to transform it into visual case study.\n\n"
                    "**Article URL:** https://www.mikejones.online/neighborhoodshare/\n\n"
                    "**Images to insert:** (URLs from qa-img-3-v2 result)\n"
                    "- Home-Tool-Selection.png → After 'Tool Discovery' section\n"
                    "- AI-powered cataloging screenshot → After 'AI Features' section\n"
                    "- Admin monitoring dashboard → After 'Administrative Features' section\n"
                    "- Tool detail page → After 'User Experience' section\n\n"
                    "**Goal:** Transform text-heavy article into visual case study with 4-5 strategically placed screenshots\n\n"
                    "**Method:** Edit article via Ghost Admin API with source=html parameter\n"
                    "**Quality:** Each image needs descriptive alt text and proper sizing"
                ),
                "status": "available",
                "priority": "high",
                "created_at": datetime.now().isoformat(),
                "owner": None,
                "blocked_by": ["qa-img-3-v2"]
            },
        ]

        for task in new_tasks:
            try:
                response = await client.post(
                    "http://localhost:8001/api/tasks",
                    json=task,
                    timeout=10.0
                )
                response.raise_for_status()
                print(f"✅ Published: {task['task_id']}")
                print(f"   Title: {task['title'][:60]}...")
                print(f"   Blocked by: {task['blocked_by']}")
                print()
            except Exception as e:
                print(f"❌ Error publishing {task['task_id']}: {e}\n")

    print("\n" + "="*60)
    print("📊 FINAL TASK PRIORITY ORDER FOR ALICE")
    print("="*60)
    print("\n🔴 CRITICAL - Do These First (Available Now):")
    print("   1. qa-critical-2-v2: Fix Substack navigation link")
    print("   2. qa-critical-1: Add resume download button")
    print("\n🟡 HIGH PRIORITY - Image Uploads (Blocked Until Critical Done):")
    print("   3. qa-img-1-v2: Upload Local LLM workflow diagram")
    print("   4. qa-img-3-v2: Upload NeighborhoodShare screenshots")
    print("\n🟡 HIGH PRIORITY - Image Insertions (Blocked by Uploads):")
    print("   5. qa-img-2-v2: Insert Local LLM diagrams")
    print("   6. qa-img-4-v2: Insert NeighborhoodShare screenshots")
    print("\n" + "="*60)
    print("\n✅ Alice will see only critical tasks first!")
    print("✅ Image tasks will appear after critical fixes complete!")
    print("\n📊 Dashboard: http://localhost:8001")


if __name__ == "__main__":
    asyncio.run(update_task_priorities())
