#!/usr/bin/env python3
"""Register Debbie (Web Design Agent) with NATS coordination system."""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient

async def register_debbie():
    """Register Debbie and send initial heartbeat."""
    async with WorkerClient("debbie") as worker:
        # Register with description
        await worker.register(
            description="Expert web designer with 20+ years experience. Design System Architect for MJ_Online. Currently working on About page pilot test (Phase 3.0.3)."
        )

        print("✅ Debbie registered with NATS")

        # Send initial heartbeat
        await worker.heartbeat(
            status="active",
            current_task="Waiting for Alice to upload professional headshot for About page"
        )

        print("💓 Initial heartbeat sent")

        # Send coordination message
        await worker.send_coordination_message(
            "Debbie (Web Design Agent) online and ready. Currently in Phase 3.0.3 pilot test - waiting for Alice to upload headshot, then will hand PAGE_SPEC to Doc Brown for Mobiledoc conversion."
        )

        print("📣 Coordination message sent")
        print("\n🎨 Debbie is now registered and active in NATS coordination system!")
        print("Dashboard: http://localhost:8001")

if __name__ == "__main__":
    asyncio.run(register_debbie())
