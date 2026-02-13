#!/usr/bin/env python3
"""Send Debbie's initial coordination message to NATS."""

import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'agent_coordination'))

from agent_coordination.client import WorkerClient


async def send_coordination():
    """Send coordination message."""
    async with WorkerClient("Debbie") as worker:
        # Send coordination message
        await worker.send_coordination_message(
            "Debbie (Web Design Agent) ready for Phase 3 work!\n\n"
            "✅ Registered with NATS\n"
            "✅ Memory file updated\n"
            "✅ Browser automation enabled (Ghost admin access)\n\n"
            "PRIORITY QUEUE (6 active pages):\n"
            "1. Homepage - Design review + images (Alice creating content)\n"
            "2. About - Design treatment + personal photo\n"
            "3. Contact - Design treatment + photo\n"
            "4. Projects Landing - Visual design + thumbnails\n"
            "5. NeighborhoodShare Case Study - Add 6-10 screenshots\n"
            "6. Local LLM Case Study - Add visuals + consistency\n"
            "7. Resume - BLOCKED (Mike fixing content first)\n\n"
            "Working alongside Alice (content creation).\n"
            "Ready to start with whichever page is ready for design treatment."
        )

        # Send heartbeat
        await worker.heartbeat(
            status="active",
            current_task=None
        )

        print("✅ Coordination message sent to NATS")
        print("✅ Heartbeat sent")


if __name__ == "__main__":
    asyncio.run(send_coordination())
