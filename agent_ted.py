#!/usr/bin/env python3
"""
TED - Technical Research Agent
Handles technical research, documentation, and analysis tasks for MJ_Online project.
"""
import asyncio
import sys
import os

# Add parent directory to path to import agent_coordination
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent_coordination.client import WorkerClient


async def main():
    """Main agent loop for TED."""
    async with WorkerClient("TED") as worker:
        # Register with descriptive role
        await worker.register(description="Technical Research Agent - handles research, documentation, and technical analysis")

        # Send initial heartbeat
        await worker.heartbeat(status="active", current_task=None)

        print("✅ TED registered successfully with NATS coordination system")
        print(f"📡 Connected to NATS at localhost:4222")
        print(f"🎯 Agent ID: TED")
        print(f"📋 Role: Technical Research Agent")
        print()

        # Check for available tasks
        print("🔍 Checking for available tasks...")
        available_tasks = await worker.get_available_tasks()

        if available_tasks:
            print(f"\n✨ Found {len(available_tasks)} available tasks:")
            for task in available_tasks:
                print(f"  - Task ID: {task.get('task_id', 'N/A')}")
                print(f"    Description: {task.get('description', 'N/A')}")
                print()
        else:
            print("ℹ️  No tasks currently available in the queue")
            print()

        # Send status update to coordination channel
        await worker.send_coordination_message(
            "TED online and ready for technical research tasks. "
            "Available for documentation, analysis, and research work."
        )

        print("✅ TED initialization complete!")
        print("💬 Sent status update to coordination channel")
        print()
        print("🎯 Summary:")
        print(f"   - Agent: TED (Technical Research Agent)")
        print(f"   - Status: Active and ready")
        print(f"   - Available tasks: {len(available_tasks)}")
        print(f"   - Coordination system: Connected")
        print()
        print("📖 Next steps:")
        print("   1. Review roadmap.md for detailed task assignments")
        print("   2. Claim available tasks using worker.claim_task(task_id)")
        print("   3. Report progress with worker.heartbeat() every 30 seconds")
        print("   4. Complete tasks with worker.complete_task(task_id, result)")


if __name__ == "__main__":
    asyncio.run(main())
