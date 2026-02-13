#!/usr/bin/env python3
"""
Alice - Web Content Builder Agent
Register with NATS coordination system
"""

import asyncio
import sys
from pathlib import Path

# Add agent_coordination to path
sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))

from agent_coordination.client import WorkerClient, MonitorClient


async def register_alice():
    """Register Alice with NATS and send initial status."""

    async with WorkerClient("Alice") as worker:
        # Register with description
        await worker.register(
            description="Web Content Builder - Ghost Pro publishing, image uploads, content creation, SEO optimization"
        )
        print("✅ Alice registered with NATS coordination system")

        # Send initial heartbeat
        await worker.heartbeat(status="active", current_task=None)
        print("✅ Initial heartbeat sent - status: active")

        # Announce availability on coordination channel
        await worker.send_coordination_message(
            "Alice (Web Content Builder) online and ready for duty. "
            "Available for: Ghost publishing, image uploads, content strategy, SEO optimization. "
            "Awaiting Phase 3.0.6 Homepage assignment or other content work."
        )
        print("✅ Availability announced on coordination channel")

        # Check for any available tasks
        tasks = await worker.get_available_tasks()
        if tasks:
            print(f"\n📋 Found {len(tasks)} available task(s):")
            for task in tasks:
                print(f"   - Task {task.get('task_id')}: {task.get('description', 'No description')}")
        else:
            print("\n📋 No tasks currently in queue")

    # Use MonitorClient to check messages
    async with MonitorClient() as monitor:
        # Check coordination messages
        messages = await monitor.get_messages(channel="coordination", limit=5)
        if messages:
            print(f"\n💬 Recent coordination messages ({len(messages)}):")
            for msg in messages[-3:]:  # Show last 3
                print(f"   - {msg.get('content', '')[:80]}...")

    print("\n✨ Alice registration complete - standing by for instructions")


if __name__ == "__main__":
    asyncio.run(register_alice())
