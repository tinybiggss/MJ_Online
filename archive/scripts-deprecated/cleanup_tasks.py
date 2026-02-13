#!/usr/bin/env python3
"""Clean up stale test tasks from NATS coordination system."""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient, MonitorClient


async def cleanup_stale_tasks():
    """Remove stale test tasks from the coordination system."""

    print("🧹 Cleaning up stale tasks from NATS coordination system...\n")

    async with MonitorClient() as monitor:
        # Get all tasks
        all_tasks = await monitor.get_all_tasks()

        print(f"📋 Found {len(all_tasks)} total tasks\n")

        # Identify stale tasks (test tasks from earlier development)
        stale_tasks = []
        current_tasks = []

        for task in all_tasks:
            task_id = task.get('task_id', '')
            title = task.get('title', 'Untitled')
            status = task.get('status', 'unknown')

            # Mark test tasks as stale
            if task_id.startswith('test-'):
                stale_tasks.append(task)
                print(f"   🗑️  STALE: {task_id}")
                print(f"       Title: {title}")
                print(f"       Status: {status}\n")
            else:
                current_tasks.append(task)
                print(f"   ✅ KEEP: {task_id}")
                print(f"       Title: {title}")
                print(f"       Status: {status}\n")

        print(f"\n📊 Summary:")
        print(f"   Stale tasks to remove: {len(stale_tasks)}")
        print(f"   Current tasks to keep: {len(current_tasks)}")

        if stale_tasks:
            print(f"\n🗑️  Removing {len(stale_tasks)} stale tasks...")

            async with WorkerClient("morgan-cleanup") as worker:
                for task in stale_tasks:
                    task_id = task.get('task_id')
                    try:
                        # Mark as completed with cleanup note
                        await worker.complete_task(
                            task_id=task_id,
                            result={
                                "cleanup": True,
                                "reason": "Stale test task from earlier development",
                                "cleaned_by": "morgan",
                                "cleanup_date": "2026-02-11"
                            }
                        )
                        print(f"   ✅ Removed: {task_id}")
                    except Exception as e:
                        print(f"   ❌ Error removing {task_id}: {e}")

            print(f"\n✅ Cleanup complete!")
        else:
            print(f"\n✅ No stale tasks found - queue is clean!")

        # Show final state
        print(f"\n📋 Final task queue:")
        if current_tasks:
            for task in current_tasks:
                print(f"   - {task.get('task_id')}: {task.get('title')}")
        else:
            print(f"   (empty - ready for fresh QA tasks)")


if __name__ == "__main__":
    asyncio.run(cleanup_stale_tasks())
