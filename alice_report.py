#!/usr/bin/env python3
"""Alice (Web Content Builder) reporting to NATS system."""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from agent_coordination.client import WorkerClient, MonitorClient


async def report_status():
    """Register Alice and report current status."""

    # Register as Alice
    async with WorkerClient("Alice-Web-Content-Builder") as alice:
        print("🤖 Alice (Web Content Builder) connecting to NATS system...")

        # Register with the system
        registration = await alice.register(
            description="Expert web content strategist for Ghost Pro sites and general web content creation",
            capabilities=[
                "ghost_pro_publishing",
                "image_upload_via_api",
                "mobiledoc_json_publishing",
                "seo_optimization",
                "content_strategy",
                "rag_verification"
            ]
        )
        print(f"✅ Registered: {registration}")

        # Send initial heartbeat
        await alice.heartbeat(
            status="active",
            current_task=None
        )
        print("💓 Heartbeat sent - status: active")

        # Send coordination message
        await alice.send_coordination_message(
            "Alice (Web Content Builder) online and ready. Capabilities: Ghost Pro publishing, image upload via API, Mobiledoc JSON assembly, RAG-verified content creation."
        )
        print("📢 Coordination message sent")

        # Check for available tasks
        tasks = await alice.get_available_tasks(limit=10)
        print(f"\n📋 Available tasks: {len(tasks)}")
        if tasks:
            for task in tasks:
                print(f"  - {task.get('task_id')}: {task.get('title', 'No title')}")
        else:
            print("  (No tasks currently available)")

    # Monitor system status
    async with MonitorClient() as monitor:
        print("\n🔍 System Status:")

        # Get all agents
        try:
            agents = await monitor.get_agents()
            print(f"  Registered agents: {len(agents)}")
            for agent in agents:
                print(f"    - {agent.get('agent_id')}: {agent.get('status', 'unknown')}")
        except Exception as e:
            print(f"  Could not retrieve agents: {e}")

        # Get all tasks
        all_tasks = await monitor.get_all_tasks()
        print(f"\n  Total tasks in system: {len(all_tasks)}")

        # Get recent coordination messages
        try:
            coord_msgs = await monitor.get_messages("coordination", limit=5)
            print(f"\n💬 Recent coordination messages: {len(coord_msgs)}")
            for msg in coord_msgs[-3:]:  # Last 3 messages
                print(f"  - [{msg.get('agent_id')}]: {msg.get('content', '')[:80]}")
        except Exception as e:
            print(f"  Could not retrieve messages: {e}")


if __name__ == "__main__":
    print("=" * 60)
    print("Alice - Web Content Builder Agent")
    print("Reporting to NATS Coordination System")
    print("=" * 60)
    print()

    asyncio.run(report_status())

    print("\n✅ Report complete!")
    print("=" * 60)
