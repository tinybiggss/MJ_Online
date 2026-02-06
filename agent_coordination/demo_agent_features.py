"""
Demo Agent - Testing Dashboard Features

This agent demonstrates:
1. Current Task Medallion (updates when task changes)
2. Approval/Attention Flag (when agent needs user input)
"""

import asyncio
import sys
from datetime import datetime
from pathlib import Path

# Import coordination client
sys.path.insert(0, str(Path(__file__).parent.parent))
from agent_coordination.client import WorkerClient


async def demo_features():
    """Demonstrate the new dashboard features."""

    agent_id = "Demo-Feature-Agent"

    print(f"\n{'='*80}")
    print(f"  DASHBOARD FEATURES DEMO")
    print(f"  Open http://localhost:8001 to see the updates in real-time!")
    print(f"{'='*80}\n")

    async with WorkerClient(agent_id, "http://localhost:8001") as worker:
        # 1. Register
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Registering agent...")
        await worker.register(
            description="Demo agent showing dashboard features",
            capabilities=["task-medallion", "approval-flags"]
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Registered\n")

        # 2. Send initial heartbeat (idle state)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Sending idle heartbeat...")
        await worker.heartbeat(
            status="idle",
            current_task=None,
            current_task_title=None
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Idle state - Check dashboard (no task medallion)\n")
        await asyncio.sleep(5)

        # 3. Start working on Task 1 (show medallion)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting work on Task 1...")
        await worker.heartbeat(
            status="busy",
            current_task="task-1",
            current_task_title="Research Ghost Themes"
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Working on task - Check dashboard (purple medallion appears!)\n")
        await asyncio.sleep(10)

        # 4. Switch to Task 2 (medallion updates)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Switching to Task 2...")
        await worker.heartbeat(
            status="busy",
            current_task="task-2",
            current_task_title="Draft About Page Content"
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Task changed - Check dashboard (medallion updates!)\n")
        await asyncio.sleep(10)

        # 5. Request user approval (show approval flag)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Requesting user approval...")
        await worker.heartbeat(
            status="busy",
            current_task="task-2",
            current_task_title="Draft About Page Content",
            needs_approval=True,
            approval_message="Please review About page content before publishing"
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Approval needed - Check dashboard (🚨 flag appears and blinks!)\n")
        await asyncio.sleep(15)

        # 6. Clear approval flag (simulate user approved)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] User approved - continuing work...")
        await worker.heartbeat(
            status="busy",
            current_task="task-2",
            current_task_title="Draft About Page Content",
            needs_approval=False,
            approval_message=None
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Approval flag cleared - Check dashboard (flag disappears!)\n")
        await asyncio.sleep(10)

        # 7. Complete task (medallion disappears)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Task complete - going idle...")
        await worker.heartbeat(
            status="active",
            current_task=None,
            current_task_title=None
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Task complete - Check dashboard (medallion disappears!)\n")
        await asyncio.sleep(10)

        # 8. Another approval scenario (no current task)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Requesting approval while idle...")
        await worker.heartbeat(
            status="idle",
            current_task=None,
            current_task_title=None,
            needs_approval=True,
            approval_message="Need permission to claim next high-priority task"
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Approval needed while idle - Check dashboard!\n")
        await asyncio.sleep(15)

        # 9. Clear and shutdown
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Demo complete - shutting down...")
        await worker.heartbeat(
            status="offline",
            current_task=None,
            needs_approval=False
        )
        await worker.send_coordination_message(
            f"{agent_id} demo complete. Dashboard features tested successfully!"
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Demo finished!\n")

        print(f"{'='*80}")
        print(f"  DEMO SUMMARY")
        print(f"  Features Demonstrated:")
        print(f"  ✅ Current Task Medallion (purple, pulsing)")
        print(f"  ✅ Task Title Updates (real-time)")
        print(f"  ✅ Medallion Appears/Disappears")
        print(f"  ✅ Approval Flag (🚨, blinking, clickable)")
        print(f"  ✅ Approval Message Display")
        print(f"  ✅ Auto-refresh (every 5 seconds)")
        print(f"{'='*80}\n")


if __name__ == "__main__":
    asyncio.run(demo_features())
