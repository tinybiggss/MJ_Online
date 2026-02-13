#!/usr/bin/env python3
"""Debbie startup script - register with NATS and check for tasks."""

import asyncio
import sys
import os

# Add agent_coordination to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'agent_coordination'))

from agent_coordination.client import WorkerClient


async def startup():
    """Register Debbie and check for tasks."""
    async with WorkerClient("Debbie") as worker:
        # Register with the coordination system
        print("Registering Debbie with NATS coordination system...")
        registration = await worker.register(
            description="Expert visual designer, information architect, and Ghost/Kyoto theme specialist",
            capabilities=[
                "visual_design",
                "information_architecture",
                "ghost_platform",
                "kyoto_theme",
                "rag_verification",
                "image_placement",
                "web_design_trends",
                "portfolio_websites"
            ]
        )
        print(f"✅ Registered: {registration}")

        # Send initial heartbeat
        print("\nSending initial heartbeat...")
        await worker.heartbeat(status="active", current_task=None)
        print("✅ Heartbeat sent")

        # Check for available tasks
        print("\nChecking for available tasks...")
        tasks = await worker.get_available_tasks(limit=10)

        if tasks:
            print(f"\n📋 Found {len(tasks)} available task(s):")
            for i, task in enumerate(tasks, 1):
                print(f"\n  Task {i}:")
                print(f"    ID: {task.get('task_id')}")
                print(f"    Title: {task.get('title')}")
                print(f"    Description: {task.get('description', '')[:100]}...")
                print(f"    Status: {task.get('status')}")
        else:
            print("\n📋 No tasks currently available in queue")

        # Check all agents
        print("\n\nChecking registered agents...")
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get("http://localhost:8001/api/agents")
                agents = response.json()
                print(f"✅ {len(agents)} agent(s) registered:")
                for agent in agents:
                    print(f"  - {agent.get('agent_id')}: {agent.get('description', 'No description')}")
        except Exception as e:
            print(f"⚠️ Could not fetch agents: {e}")

        return len(tasks) if tasks else 0


if __name__ == "__main__":
    task_count = asyncio.run(startup())
    print(f"\n{'='*60}")
    print(f"Debbie is ready! {task_count} task(s) waiting.")
    print(f"{'='*60}\n")
