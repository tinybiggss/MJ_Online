#!/usr/bin/env python3
"""Publish QA image tasks to NATS coordination system."""

import asyncio
import sys
import httpx
from datetime import datetime
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")


async def publish_qa_tasks():
    """Publish QA image tasks via API."""

    print("📋 Publishing QA and image tasks to NATS coordination system...\n")

    tasks = [
        {
            "task_id": "qa-img-1",
            "title": "Upload OfflineAI-Session-Workflow.png to Ghost CDN",
            "description": "Upload the missing Local LLM workflow diagram to Ghost media library.\n\n**Source file:** /Users/michaeljones/Dev/MJ_Online/assets/projects/local-llm/OfflineAI-Session-Workflow.png\n**Size:** 841KB\n**Purpose:** Technical diagram showing session workflow for Local LLM article\n\n**Steps:**\n1. Upload to Ghost Admin → Settings → Labs → Upload image\n2. Record Ghost CDN URL\n3. Report URL for insertion task",
            "status": "available",
            "priority": "high",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": []
        },
        {
            "task_id": "qa-img-2",
            "title": "Insert Local LLM diagrams into technical article",
            "description": "Insert both architecture and workflow diagrams into the Local LLM Infrastructure article.\n\n**Article URL:** https://www.mikejones.online/local-llm-infrastructure/\n\n**Images to insert:**\n1. Offline-AI-Architecture.png (already uploaded)\n   - Ghost URL: https://www.mikejones.online/content/images/2026/02/Offline-AI-Architecture.png\n2. OfflineAI-Session-Workflow.png (from task qa-img-1)\n\n**Method:** Edit article via Ghost Admin API (source=html parameter)",
            "status": "available",
            "priority": "high",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": ["qa-img-1"]
        },
        {
            "task_id": "qa-img-3",
            "title": "Upload NeighborhoodShare screenshots to Ghost CDN",
            "description": "Upload key NeighborhoodShare screenshots to Ghost media library.\n\n**Priority screenshots:**\n1. Home-Tool-Selection.png - Main interface\n2. Add-Tool-AI-2.png - AI-powered cataloging\n3. Admin-Prod-4-AIMonitoring.png - AI monitoring\n4. Tool-Detail-Owner.png - Tool detail page\n5. LandingPage.png - Landing page\n\n**Source:** /Users/michaeljones/Dev/MJ_Online/assets/projects/neighborhoodshare/\n\n**Output:** List of Ghost CDN URLs with descriptions",
            "status": "available",
            "priority": "high",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": []
        },
        {
            "task_id": "qa-img-4",
            "title": "Insert NeighborhoodShare screenshots into articles",
            "description": "Insert NeighborhoodShare screenshots into project article.\n\n**Article URL:** https://www.mikejones.online/neighborhoodshare/\n\n**Goal:** Transform text-heavy article into visual case study with 4-5 screenshots\n\n**Method:** Edit article via Ghost Admin API (source=html parameter)\n\n**Quality:** Each image needs descriptive alt text and proper sizing",
            "status": "available",
            "priority": "high",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": ["qa-img-3"]
        },
        {
            "task_id": "qa-critical-1",
            "title": "Add resume download button to Resume page",
            "description": "CRITICAL: Add missing resume download button.\n\n**Issue:** Analytics track 'Track Resume Downloads' but button doesn't exist!\n\n**Page URL:** https://www.mikejones.online/resume/\n\n**Requirements:**\n1. Create downloadable PDF version of resume\n2. Upload PDF to Ghost media library\n3. Add prominent download button\n4. Ensure button triggers analytics event\n\n**Method:** Edit Resume page via Ghost Admin API (source=html parameter)",
            "status": "available",
            "priority": "critical",
            "created_at": datetime.now().isoformat(),
            "owner": None,
            "blocked_by": []
        },
        {
            "task_id": "qa-critical-2",
            "title": "Fix broken 'Writing' navigation link",
            "description": "CRITICAL: Fix broken Writing menu item (404 error).\n\n**Current URL:** https://www.mikejones.online/writing/ → 404\n\n**Options:**\n1. Create /writing/ page as blog index\n2. Update navigation to point to /blog/\n3. Remove Writing menu item\n\n**Recommended:** Option 1 (create page)\n\n**Method:** Create page via Ghost Admin API or update navigation settings\n\n**Priority:** HIGH - Primary navigation currently broken",
            "status": "available",
            "priority": "critical",
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
                print(f"✅ Published: {task['task_id']} - {task['title']}")
                print(f"   Priority: {task['priority']}")
                if task['blocked_by']:
                    print(f"   Blocked by: {', '.join(task['blocked_by'])}")
                print()
            except Exception as e:
                print(f"❌ Error publishing {task['task_id']}: {e}\n")

    print(f"✅ Published {len(tasks)} tasks to NATS coordination system!")
    print(f"\n📊 Dashboard: http://localhost:8001")
    print(f"📋 Task breakdown:")
    print(f"   - Critical fixes: 2 (resume button, navigation)")
    print(f"   - Image uploads: 2 (Local LLM workflow, NeighborhoodShare)")
    print(f"   - Image insertions: 2 (blocked by uploads)")
    print(f"\n🎯 Recommended work order:")
    print(f"   1. qa-critical-1 (resume button) - Quick win")
    print(f"   2. qa-critical-2 (fix navigation) - Quick win")
    print(f"   3. qa-img-1 (upload workflow diagram)")
    print(f"   4. qa-img-2 (insert Local LLM diagrams) - unblocks after #3")
    print(f"   5. qa-img-3 (upload NS screenshots)")
    print(f"   6. qa-img-4 (insert NS screenshots) - unblocks after #5")


if __name__ == "__main__":
    asyncio.run(publish_qa_tasks())
