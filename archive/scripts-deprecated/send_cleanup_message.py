#!/usr/bin/env python3
"""Send coordination message about cleanup completion."""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient


async def send_cleanup_message():
    """Send coordination message about cleanup."""
    async with WorkerClient("morgan") as worker:
        await worker.send_coordination_message(
            "🧹 Morgan: Dashboard cleanup complete! Purged 5 stale test tasks from "
            "mjwork.tasks.available queue. Available queue is now empty and ready for "
            "fresh QA tasks. Phase 3+ QA fixes ready to begin."
        )
        print("✅ Coordination message sent")


if __name__ == "__main__":
    asyncio.run(send_cleanup_message())
