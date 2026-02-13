#!/usr/bin/env python3
"""Claim task 3.7 for TED."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent_coordination.client import WorkerClient


async def main():
    async with WorkerClient("TED") as worker:
        # Claim task 3.7
        print("🎯 Claiming Task 3.7: Local LLM Setup Case Study...")
        result = await worker.claim_task("3.7")
        print(f"✅ Task claimed successfully!")
        print(f"   Task ID: {result.get('task_id', 'N/A')}")
        print(f"   Status: {result.get('status', 'N/A')}")

        # Send heartbeat with current task
        await worker.heartbeat(
            status="busy",
            current_task="3.7",
            current_task_title="Local LLM Setup Case Study - Technical Documentation"
        )
        print("💓 Heartbeat sent with task status")

        # Send coordination message
        await worker.send_coordination_message(
            "TED has claimed Task 3.7 (Local LLM Setup Case Study). "
            "Beginning technical documentation process. "
            "Will interview Mike about project architecture, performance metrics, and implementation details."
        )
        print("📢 Coordination message sent to team")
        print()
        print("🚀 Ready to begin Task 3.7 work!")


if __name__ == "__main__":
    asyncio.run(main())
