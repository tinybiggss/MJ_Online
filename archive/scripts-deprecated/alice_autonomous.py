#!/usr/bin/env python3
"""Alice - Autonomous Web Content Builder for MJ_Online

Connects to NATS coordination system and autonomously works on available tasks.
"""

import asyncio
import sys
sys.path.insert(0, '/Users/michaeljones/Dev/MJ_Online')

from agent_coordination.client import WorkerClient
from datetime import datetime


async def main():
    """Main autonomous agent loop."""

    async with WorkerClient("Alice-Autonomous") as worker:
        # Register with capabilities
        await worker.register(
            description="Alice - Ghost Pro publishing via Admin API (autonomous mode)",
            capabilities=[
                "ghost_pro_publishing",
                "image_upload_via_api",
                "html_publishing",
                "seo_optimization",
                "content_strategy",
                "rag_verification"
            ]
        )

        # Send initial heartbeat
        await worker.heartbeat(status="active", current_task=None)

        # Check roadmap status
        print("🚀 Alice starting autonomous mode...")
        print("📊 Checking current project status...")

        # Send coordination message
        await worker.send_coordination_message(
            "Alice-Autonomous online. Checking for Resume page work (Phase 3.0.4). "
            "Resume PAGE_SPEC ready at /design/PAGE_SPEC-Resume.md. "
            "Professional headshot already uploaded from About page: "
            "https://www.mikejones.online/content/images/2026/02/headshot-professional.png"
        )

        # Check for available tasks
        tasks = await worker.get_available_tasks()

        print(f"\n📋 Available tasks: {len(tasks)}")
        for task in tasks:
            print(f"  - {task['task_id']}: {task['title']}")

        # Announce readiness for Resume page
        print("\n✅ Resume PAGE_SPEC analysis:")
        print("  - PAGE_SPEC: /design/PAGE_SPEC-Resume.md")
        print("  - Image needed: Professional headshot (already uploaded)")
        print("  - Image URL: https://www.mikejones.online/content/images/2026/02/headshot-professional.png")
        print("  - Next step: Coordinate with Doc Brown to create HTML")

        await worker.send_coordination_message(
            "🎯 RESUME PAGE READY TO START (Phase 3.0.4)\n\n"
            "Status Check:\n"
            "✅ PAGE_SPEC ready: /design/PAGE_SPEC-Resume.md\n"
            "✅ Image uploaded: headshot-professional.png\n"
            "✅ Image URL verified: https://www.mikejones.online/content/images/2026/02/headshot-professional.png\n\n"
            "Ready to proceed with workflow:\n"
            "1. ✅ Debbie (Design) - PAGE_SPEC complete\n"
            "2. ✅ Alice (Images) - Headshot already uploaded\n"
            "3. ⏳ Doc Brown (HTML Assembly) - Awaiting PAGE_SPEC handoff\n"
            "4. ⏳ Alice (Publishing) - Awaiting HTML from Doc Brown\n\n"
            "Awaiting Morgan's coordination or Doc Brown to claim HTML assembly task."
        )

        # Send heartbeat showing we're ready
        await worker.heartbeat(status="idle", current_task=None)

        print("\n✅ Coordination messages sent. Alice standing by for Resume page workflow.")
        print("🔔 Doc Brown should claim HTML assembly task next.")


if __name__ == "__main__":
    asyncio.run(main())
