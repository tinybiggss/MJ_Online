#!/usr/bin/env python3
"""Send coordination message about QA tasks."""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient


async def announce_tasks():
    """Send coordination message about new QA tasks."""
    async with WorkerClient("morgan") as worker:
        await worker.send_coordination_message(
            "📋 Morgan: Published 6 QA & image tasks to queue based on Doc Brown's status "
            "and QA audit findings:\n\n"
            "**CRITICAL (2 tasks - quick wins):**\n"
            "• qa-critical-1: Add resume download button (analytics track it but missing!)\n"
            "• qa-critical-2: Fix broken 'Writing' navigation (404 error)\n\n"
            "**HIGH PRIORITY (4 tasks - visual content):**\n"
            "• qa-img-1: Upload OfflineAI-Session-Workflow.png\n"
            "• qa-img-2: Insert Local LLM diagrams into article (blocked by qa-img-1)\n"
            "• qa-img-3: Upload NeighborhoodShare screenshots\n"
            "• qa-img-4: Insert NS screenshots into article (blocked by qa-img-3)\n\n"
            "🎯 Recommended: Start with critical tasks for quick wins, then image workflow.\n"
            "Dashboard: http://localhost:8001"
        )
        print("✅ Coordination message sent to team")


if __name__ == "__main__":
    asyncio.run(announce_tasks())
