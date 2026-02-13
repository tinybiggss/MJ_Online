#!/usr/bin/env python3
"""Check available tasks in NATS system."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))

from agent_coordination.client import WorkerClient, MonitorClient


async def check_tasks():
    """Check all available tasks."""

    async with MonitorClient() as monitor:
        print("\n" + "="*80)
        print("📋 CHECKING NATS TASK QUEUE")
        print("="*80 + "\n")

        # Get all tasks
        all_tasks = await monitor.get_all_tasks()

        if not all_tasks:
            print("❌ No tasks found in system\n")
            return

        print(f"Found {len(all_tasks)} tasks:\n")

        # Group by status
        by_status = {}
        for task in all_tasks:
            status = task.get('status', 'unknown')
            if status not in by_status:
                by_status[status] = []
            by_status[status].append(task)

        for status, tasks in sorted(by_status.items()):
            print(f"{'='*40}")
            print(f"Status: {status.upper()}")
            print(f"{'='*40}")

            for task in tasks:
                task_id = task.get('task_id', 'N/A')
                title = task.get('title', task.get('description', 'No title'))[:60]
                claimed_by = task.get('claimed_by', 'None')

                print(f"  Task ID: {task_id}")
                print(f"  Title: {title}")
                if claimed_by != 'None':
                    print(f"  Claimed by: {claimed_by}")
                print()


if __name__ == "__main__":
    asyncio.run(check_tasks())
