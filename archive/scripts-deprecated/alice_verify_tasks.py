#!/usr/bin/env python3
"""Alice - Verify all task completions in NATS."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import MonitorClient


async def verify_tasks():
    """Check all tasks and Alice's completion status."""

    print("\n" + "="*80)
    print("📋 VERIFYING ALICE'S NATS TASK STATUS")
    print("="*80 + "\n")

    async with MonitorClient() as monitor:
        # Get all tasks
        all_tasks = await monitor.get_all_tasks()

        # Filter for tasks I claimed or completed
        alice_tasks = []
        available_tasks = []

        for task in all_tasks:
            task_id = task.get('task_id', '')
            status = task.get('status', '')
            owner = task.get('claimed_by', '')

            if owner == 'Alice' or 'alice' in owner.lower():
                alice_tasks.append(task)
            elif status == 'available':
                available_tasks.append(task)

        # Report Alice's tasks
        print(f"{'='*80}")
        print(f"ALICE'S CLAIMED/COMPLETED TASKS")
        print(f"{'='*80}\n")

        if alice_tasks:
            for task in alice_tasks:
                task_id = task.get('task_id', 'N/A')
                title = task.get('title', 'No title')
                status = task.get('status', 'unknown')
                claimed_by = task.get('claimed_by', 'None')

                status_icon = "✅" if status == "completed" else "🔴" if status == "claimed" else "⚪"

                print(f"{status_icon} Task: {task_id}")
                print(f"   Title: {title}")
                print(f"   Status: {status.upper()}")
                print(f"   Claimed by: {claimed_by}")
                if task.get('result'):
                    print(f"   Result: {task['result'].get('summary', 'N/A')[:80]}")
                if task.get('error'):
                    print(f"   Error: {task['error'][:80]}")
                print()
        else:
            print("❌ No tasks found claimed by Alice\n")

        # Check for specific QA tasks
        print(f"{'='*80}")
        print(f"QA CRITICAL TASKS STATUS")
        print(f"{'='*80}\n")

        qa_critical_tasks = [
            'qa-critical-1',
            'qa-critical-2',
            'qa-critical-2-v2'
        ]

        for qa_id in qa_critical_tasks:
            task = next((t for t in all_tasks if t.get('task_id') == qa_id), None)
            if task:
                status = task.get('status', 'unknown')
                status_icon = "✅" if status == "completed" else "🔴" if status == "claimed" else "⚪"
                print(f"{status_icon} {qa_id}: {status.upper()}")
                if task.get('result'):
                    print(f"   Result: {task['result'].get('summary', 'N/A')[:80]}")
            else:
                print(f"❓ {qa_id}: NOT FOUND IN SYSTEM")
            print()

        # Show available tasks
        print(f"{'='*80}")
        print(f"AVAILABLE TASKS IN QUEUE")
        print(f"{'='*80}\n")

        if available_tasks:
            print(f"Found {len(available_tasks)} available tasks:\n")
            for task in available_tasks:
                task_id = task.get('task_id', 'N/A')
                title = task.get('title', 'No title')[:60]
                priority = task.get('priority', 'normal')
                print(f"⚪ {task_id} [{priority.upper()}]")
                print(f"   {title}")
                print()
        else:
            print("✅ No available tasks in queue\n")

        # Summary
        print(f"{'='*80}")
        print(f"SUMMARY")
        print(f"{'='*80}\n")

        total_tasks = len(all_tasks)
        completed = len([t for t in all_tasks if t.get('status') == 'completed'])
        claimed = len([t for t in all_tasks if t.get('status') == 'claimed'])
        available = len(available_tasks)

        print(f"Total tasks in system: {total_tasks}")
        print(f"Completed: {completed}")
        print(f"Claimed (in progress): {claimed}")
        print(f"Available: {available}")
        print(f"\nAlice's tasks: {len(alice_tasks)}")


if __name__ == "__main__":
    asyncio.run(verify_tasks())
