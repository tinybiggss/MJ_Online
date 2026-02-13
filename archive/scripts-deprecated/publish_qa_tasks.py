#!/usr/bin/env python3
"""Publish QA image tasks to NATS coordination system."""

import asyncio
import sys
from datetime import datetime
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import TaskPublisher
from agent_coordination.models import Task


async def publish_qa_tasks():
    """Publish image and QA fix tasks to NATS."""

    print("📋 Publishing QA and image tasks to NATS coordination system...\n")

    tasks = [
        Task(
                "task_id": "qa-img-1",
                "title": "Upload OfflineAI-Session-Workflow.png to Ghost CDN",
                "description": (
                "Upload the missing Local LLM workflow diagram to Ghost media library.\n\n"
                "**Source file:** /Users/michaeljones/Dev/MJ_Online/assets/projects/local-llm/OfflineAI-Session-Workflow.png\n"
                "**Size:** 841KB\n"
                "**Purpose:** Technical diagram showing session workflow for Local LLM article\n\n"
                "**Steps:**\n"
                "1. Upload to Ghost Admin → Settings → Labs → Upload image\n"
                "2. Record Ghost CDN URL\n"
                "3. Report URL for insertion task"
            ),
            status="available",
            priority="high",
            created_at=datetime.now(),
            owner=None,
            blocked_by=[]
        ),
        Task(
            task_id="qa-img-2",
            title="Insert Local LLM diagrams into technical article",
            description=(
                "Insert both architecture and workflow diagrams into the Local LLM Infrastructure article.\n\n"
                "**Article URL:** https://www.mikejones.online/local-llm-infrastructure/\n\n"
                "**Images to insert:**\n"
                "1. Offline-AI-Architecture.png (already uploaded)\n"
                "   - Ghost URL: https://www.mikejones.online/content/images/2026/02/Offline-AI-Architecture.png\n"
                "2. OfflineAI-Session-Workflow.png (from task qa-img-1)\n\n"
                "**Method:** Edit article via Ghost Admin API (source=html parameter)"
            ),
            status="available",
            priority="high",
            created_at=datetime.now(),
            owner=None,
            blocked_by=["qa-img-1"]  # Blocked by workflow diagram upload
        ),
        Task(
            task_id="qa-img-3",
            title="Upload NeighborhoodShare screenshots to Ghost CDN",
            description=(
                "Upload key NeighborhoodShare screenshots to Ghost media library.\n\n"
                "**Priority screenshots:**\n"
                "1. Home-Tool-Selection.png - Main interface\n"
                "2. Add-Tool-AI-2.png - AI-powered cataloging\n"
                "3. Admin-Prod-4-AIMonitoring.png - AI monitoring\n"
                "4. Tool-Detail-Owner.png - Tool detail page\n"
                "5. LandingPage.png - Landing page\n\n"
                "**Source:** /Users/michaeljones/Dev/MJ_Online/assets/projects/neighborhoodshare/\n\n"
                "**Output:** List of Ghost CDN URLs with descriptions"
            ),
            status="available",
            priority="high",
            created_at=datetime.now(),
            owner=None,
            blocked_by=[]
        ),
        Task(
            task_id="qa-img-4",
            title="Insert NeighborhoodShare screenshots into articles",
            description=(
                "Insert NeighborhoodShare screenshots into project article.\n\n"
                "**Article URL:** https://www.mikejones.online/neighborhoodshare/\n\n"
                "**Goal:** Transform text-heavy article into visual case study with 4-5 screenshots\n\n"
                "**Method:** Edit article via Ghost Admin API (source=html parameter)\n\n"
                "**Quality:** Each image needs descriptive alt text and proper sizing"
            ),
            status="available",
            priority="high",
            created_at=datetime.now(),
            owner=None,
            blocked_by=["qa-img-3"]  # Blocked by screenshot uploads
        ),
        Task(
            task_id="qa-critical-1",
            title="Add resume download button to Resume page",
            description=(
                "CRITICAL: Add missing resume download button.\n\n"
                "**Issue:** Analytics track 'Track Resume Downloads' but button doesn't exist!\n\n"
                "**Page URL:** https://www.mikejones.online/resume/\n\n"
                "**Requirements:**\n"
                "1. Create downloadable PDF version of resume\n"
                "2. Upload PDF to Ghost media library\n"
                "3. Add prominent download button\n"
                "4. Ensure button triggers analytics event\n\n"
                "**Method:** Edit Resume page via Ghost Admin API (source=html parameter)"
            ),
            status="available",
            priority="critical",
            created_at=datetime.now(),
            owner=None,
            blocked_by=[]
        ),
        Task(
            task_id="qa-critical-2",
            title="Fix broken 'Writing' navigation link",
            description=(
                "CRITICAL: Fix broken Writing menu item (404 error).\n\n"
                "**Current URL:** https://www.mikejones.online/writing/ → 404\n\n"
                "**Options:**\n"
                "1. Create /writing/ page as blog index\n"
                "2. Update navigation to point to /blog/\n"
                "3. Remove Writing menu item\n\n"
                "**Recommended:** Option 1 (create page)\n\n"
                "**Method:** Create page via Ghost Admin API or update navigation settings\n\n"
                "**Priority:** HIGH - Primary navigation currently broken"
            ),
            status="available",
            priority="critical",
            created_at=datetime.now(),
            owner=None,
            blocked_by=[]
        ),
    ]

    async with TaskPublisher() as publisher:
        for task in tasks:
            try:
                result = await publisher.publish_task(task)
                print(f"✅ Published: {task.task_id} - {task.title}")
                print(f"   Priority: {task.priority}")
                if task.blocked_by:
                    print(f"   Blocked by: {', '.join(task.blocked_by)}")
                print()
            except Exception as e:
                print(f"❌ Error publishing {task.task_id}: {e}\n")

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
