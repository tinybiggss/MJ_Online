#!/usr/bin/env python3
"""Send coordination update about current status."""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient


async def send_coordination_update():
    """Send update to coordination channel."""
    async with WorkerClient("morgan") as worker:
        await worker.send_coordination_message(
            "🤖 Morgan: Autonomous orchestration mode active.\n\n"
            "STATUS UPDATE:\n"
            "✅ Debbie: Completed autonomous session - 2 case studies enhanced with 6 images\n"
            "✅ Alice: Active and ready - standing by for resume button task\n"
            "📋 Published: resume-button-final task (critical priority)\n"
            "⏳ Pending: Navigation fix (manual - Mike needs to update Ghost Admin UI)\n\n"
            "Alice should claim resume-button-final task automatically.\n"
            "Estimated completion: 20-30 minutes.\n\n"
            "Dashboard: http://localhost:8001"
        )
        print("✅ Coordination update sent to team")


if __name__ == "__main__":
    asyncio.run(send_coordination_update())
