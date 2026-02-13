#!/usr/bin/env python3
"""Register Morgan (PM agent) with NATS coordination system."""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient


async def register_morgan():
    """Register Morgan as active PM agent."""
    async with WorkerClient("morgan") as worker:
        # Register with coordination system
        result = await worker.register(
            description="Project Manager - Roadmap coordination, agent orchestration, PROJECT-MEMORY.json maintenance",
            capabilities=[
                "roadmap_management",
                "agent_coordination",
                "project_memory_updates",
                "rag_verification",
                "task_orchestration",
                "milestone_tracking"
            ]
        )
        print(f"✅ Registered: {result}")

        # Send initial heartbeat
        await worker.heartbeat(
            status="active",
            current_task=None
        )
        print("✅ Heartbeat sent")

        # Send coordination message
        await worker.send_coordination_message(
            "Morgan (PM) online - ready to coordinate workflows and maintain project memory. "
            "QA fixes in queue. What's our priority today?"
        )
        print("✅ Coordination message sent")

        # Check for available tasks
        tasks = await worker.get_available_tasks(limit=10)
        print(f"\n📋 Available tasks: {len(tasks)}")
        for task in tasks:
            print(f"   - {task.get('task_id')}: {task.get('title', 'Untitled')}")

        return result


if __name__ == "__main__":
    result = asyncio.run(register_morgan())
    print("\n🟢 Morgan is now registered with NATS coordination system!")
