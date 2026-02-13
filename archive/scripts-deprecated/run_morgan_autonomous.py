#!/usr/bin/env python3
"""Run Morgan in autonomous orchestrator mode - monitoring task completions."""

import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient, MonitorClient
import asyncio
from datetime import datetime


async def run_morgan_autonomous():
    """Run Morgan as autonomous orchestrator - monitor completions and coordinate."""

    print("=" * 60)
    print("📊 MORGAN - PROJECT MANAGER (AUTONOMOUS ORCHESTRATOR)")
    print("=" * 60)
    print("Starting autonomous coordination mode...")
    print()

    async with WorkerClient("morgan-orchestrator") as worker:
        # Register
        await worker.register(
            description="Project Manager - Autonomous orchestrator monitoring Alice's task queue",
            capabilities=["orchestration", "task_monitoring", "dependency_management"]
        )
        print("✅ Morgan registered as orchestrator")

        # Send startup message
        await worker.send_coordination_message(
            "📊 Morgan: Autonomous orchestrator mode active. Monitoring Alice's task queue. "
            "Will track completions and coordinate workflow dependencies."
        )
        print("✅ Coordination message sent")
        print()

        print("💓 Heartbeat active")
        print("🎧 Monitoring task completions...")
        print()
        print("Role: Monitor Alice's progress, track dependencies, report status")
        print("Watching: Task completions, blocking dependencies")
        print()
        print("🟢 Ready to orchestrate!\n")
        print("=" * 60)
        print()

        # Track processed tasks
        processed_tasks = set()
        last_status_report = datetime.now()

        async with MonitorClient() as monitor:
            while True:
                try:
                    # Send heartbeat
                    await worker.heartbeat(
                        status="active",
                        current_task=f"Monitoring queue ({len(processed_tasks)} completed)"
                    )

                    # Check for completed tasks
                    completed = await monitor.get_all_tasks(status="completed")

                    # Process new completions
                    for task in completed:
                        task_id = task["task_id"]

                        # Skip if already processed
                        if task_id in processed_tasks:
                            continue

                        # Mark as processed
                        processed_tasks.add(task_id)

                        print(f"\n📥 TASK COMPLETED: {task_id}")
                        print(f"   Title: {task.get('title', 'Untitled')}")
                        print(f"   By: {task.get('owner', 'Unknown')}")

                        result = task.get('result', {})
                        if result:
                            print(f"   Status: {result.get('status', 'N/A')}")
                            if result.get('summary'):
                                print(f"   Summary: {result.get('summary')}")

                        # Check what this unblocks
                        available = await monitor.get_all_tasks(status="available")
                        newly_available = []

                        for avail_task in available:
                            if avail_task['task_id'] not in processed_tasks:
                                blocked_by = avail_task.get('blocked_by', [])
                                if task_id in blocked_by:
                                    newly_available.append(avail_task)

                        if newly_available:
                            print(f"\n   🔓 This completion unblocked {len(newly_available)} task(s):")
                            for unblocked in newly_available:
                                print(f"      - {unblocked['task_id']}: {unblocked['title'][:50]}...")

                        # Send coordination update
                        await worker.send_coordination_message(
                            f"Morgan: Task {task_id} completed by {task.get('owner', 'Unknown')}. "
                            f"{len(newly_available)} task(s) now available."
                        )
                        print()

                    # Periodic status report (every 5 minutes)
                    now = datetime.now()
                    if (now - last_status_report).seconds > 300:
                        available = await monitor.get_all_tasks(status="available")
                        available_count = len([t for t in available if not t.get('blocked_by')])
                        blocked_count = len([t for t in available if t.get('blocked_by')])

                        print(f"\n📊 STATUS UPDATE ({now.strftime('%H:%M:%S')})")
                        print(f"   Completed: {len(processed_tasks)} tasks")
                        print(f"   Available: {available_count} tasks")
                        print(f"   Blocked: {blocked_count} tasks")
                        print()

                        last_status_report = now

                    # Poll every 10 seconds
                    await asyncio.sleep(10)

                except KeyboardInterrupt:
                    print(f"\n\n⚠️  Shutting down Morgan orchestrator (Ctrl+C)...")
                    break
                except Exception as e:
                    print(f"\n❌ Error in orchestration loop: {e}")
                    await worker.report_error(str(e))
                    await asyncio.sleep(10)

            print("\n✅ Morgan orchestrator shutdown complete.\n")


if __name__ == "__main__":
    try:
        asyncio.run(run_morgan_autonomous())
    except KeyboardInterrupt:
        print("\n\n👋 Morgan orchestrator stopped by user.\n")
