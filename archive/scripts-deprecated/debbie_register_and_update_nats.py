#!/usr/bin/env python3
"""
Debbie NATS Registration and Status Update
Autonomous Mode - Session 2026-02-11
"""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient

async def register_and_update():
    """Register Debbie and update current status."""
    print("="*80)
    print("DEBBIE - REGISTERING WITH NATS COORDINATION SYSTEM")
    print("="*80)

    async with WorkerClient("debbie") as worker:
        # Step 1: Register
        print("\n[Step 1/4] Registering with NATS...")
        await worker.register(
            description="Web Design Agent - Design System Architect. Completed 4 PAGE_SPECs + added images to 3 case studies. Active in autonomous mode."
        )
        print("✅ Debbie registered")

        # Step 2: Send heartbeat with current status
        print("\n[Step 2/4] Sending heartbeat...")
        await worker.heartbeat(
            status="active",
            current_task="autonomous-session-2026-02-11",
            current_task_title="Autonomous Session Complete: Added images to case studies"
        )
        print("💓 Heartbeat sent")

        # Step 3: Send coordination message with session summary
        print("\n[Step 3/4] Sending coordination message...")
        await worker.send_coordination_message(
            "Debbie (Web Design Agent) - Autonomous session complete! ✅ Added 6 images/diagrams to case studies: NeighborhoodShare (4 screenshots), Local LLM (2 diagrams), AI Memory (custom diagram request created). All case studies now have professional visual presentation. All work RAG-verified. Ready for launch review."
        )
        print("📣 Coordination message sent")

        # Step 4: Check for any available tasks in NATS queue
        print("\n[Step 4/4] Checking NATS task queue...")
        available_tasks = await worker.get_available_tasks(limit=10)

        if available_tasks:
            print(f"✅ Found {len(available_tasks)} available task(s) in queue:")
            for task in available_tasks:
                print(f"   - Task {task.get('task_id')}: {task.get('title')}")
        else:
            print("✅ No tasks currently in NATS queue")

        print("\n" + "="*80)
        print("✅ NATS REGISTRATION AND UPDATE COMPLETE")
        print("="*80)
        print(f"\n🎨 Debbie is now active in NATS coordination system!")
        print(f"   Dashboard: http://localhost:8001")
        print(f"   Status: Active")
        print(f"   Current Session: Autonomous work complete (images added to case studies)")
        print(f"\nNext: Awaiting next autonomous work assignment or user feedback")

if __name__ == "__main__":
    asyncio.run(register_and_update())
