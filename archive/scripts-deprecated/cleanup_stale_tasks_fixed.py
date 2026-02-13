#!/usr/bin/env python3
"""Clean up stale test tasks - properly claim then complete them."""

import asyncio
import sys
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient


async def cleanup_stale_tasks():
    """Remove stale test tasks by claiming and completing them."""

    print("🧹 Cleaning up stale tasks from NATS coordination system...\n")

    async with WorkerClient("morgan-cleanup") as worker:
        # Get available tasks
        available_tasks = await worker.get_available_tasks(limit=100)

        print(f"📋 Found {len(available_tasks)} available tasks\n")

        # Identify stale test tasks
        stale_tasks = []
        for task in available_tasks:
            task_id = task.get('task_id', '')
            title = task.get('title', 'Untitled')

            if task_id.startswith('test-'):
                stale_tasks.append(task)
                print(f"   🗑️  STALE: {task_id}")
                print(f"       Title: {title}\n")

        if not stale_tasks:
            print("✅ No stale test tasks found - queue is clean!")
            return

        print(f"\n🗑️  Found {len(stale_tasks)} stale test tasks to remove\n")

        # Claim and complete each stale task
        for task in stale_tasks:
            task_id = task.get('task_id')
            title = task.get('title', 'Untitled')

            try:
                # Step 1: Claim the task
                print(f"   Claiming {task_id}...")
                await worker.claim_task(task_id)

                # Step 2: Mark as completed
                print(f"   Completing {task_id}...")
                await worker.complete_task(
                    task_id=task_id,
                    result={
                        "cleanup": True,
                        "reason": "Stale test task from earlier development (Phase 3.0 testing)",
                        "cleaned_by": "morgan",
                        "cleanup_date": "2026-02-11",
                        "original_title": title
                    }
                )
                print(f"   ✅ Removed: {task_id}\n")

            except Exception as e:
                print(f"   ❌ Error removing {task_id}: {e}\n")

        print(f"\n✅ Cleanup complete!")

        # Show final available tasks
        remaining = await worker.get_available_tasks(limit=100)
        print(f"\n📋 Available tasks after cleanup: {len(remaining)}")
        if remaining:
            for task in remaining:
                print(f"   - {task.get('task_id')}: {task.get('title')}")
        else:
            print(f"   (empty - ready for fresh QA tasks)")


if __name__ == "__main__":
    asyncio.run(cleanup_stale_tasks())
