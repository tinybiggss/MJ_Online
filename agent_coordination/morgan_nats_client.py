#!/usr/bin/env python3
"""Morgan (Project Manager) NATS client - registers and sends heartbeats."""

import asyncio
import sys
import os
from datetime import datetime

# Add parent directory to path to import client
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent_coordination.client import WorkerClient


async def run_morgan():
    """Register Morgan and maintain connection with heartbeats."""

    async with WorkerClient('Morgan') as worker:
        # Register
        await worker.register(
            description="Project Manager - Roadmap management, agent orchestration, institutional knowledge capture",
            capabilities=[
                "roadmap_management",
                "agent_coordination",
                "task_tracking",
                "project_memory",
                "workflow_orchestration",
                "status_reporting"
            ]
        )
        print("✅ Morgan registered with NATS")

        # Send initial heartbeat
        await worker.heartbeat(status="active", current_task="Coordinating Phase 3.0.3 pilot test")
        print("✅ Initial heartbeat sent")

        # Send registration announcement
        await worker.send_coordination_message(
            "Morgan (Project Manager) now online. "
            "Phase 3.0.3 About page pilot test in progress: Debbie✅ → Alice✅ → Doc Brown⏳ → Alice⏳"
        )
        print("✅ Registration announced to team")

        print("\n📡 Morgan active - sending heartbeats every 30s (Ctrl+C to stop)...")
        print("=" * 80)

        # Heartbeat loop
        last_heartbeat = asyncio.get_event_loop().time()

        try:
            while True:
                # Send heartbeat every 30 seconds
                now = asyncio.get_event_loop().time()
                if now - last_heartbeat >= 30:
                    await worker.heartbeat(
                        status="active",
                        current_task="Coordinating Phase 3.0.3 pilot test"
                    )
                    last_heartbeat = now
                    print(f"💓 Heartbeat sent at {datetime.now().strftime('%H:%M:%S')}")

                # Sleep before next check
                await asyncio.sleep(5)

        except KeyboardInterrupt:
            print("\n\n🛑 Stopping Morgan NATS client...")
            await worker.heartbeat(status="offline", current_task=None)
            await worker.send_coordination_message("Morgan signing off")
            print("✅ Morgan signed off from NATS")


if __name__ == '__main__':
    print("🚀 Starting Morgan NATS client...")
    print("")
    asyncio.run(run_morgan())
