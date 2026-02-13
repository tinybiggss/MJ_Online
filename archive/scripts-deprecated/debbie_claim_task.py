#!/usr/bin/env python3
"""
Debbie claims a task from NATS queue
"""

import asyncio
import sys
import json
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient

async def get_and_claim_task():
    """Get available tasks and claim one appropriate for Debbie."""
    print("="*80)
    print("DEBBIE - CHECKING NATS TASK QUEUE")
    print("="*80)

    async with WorkerClient("debbie") as worker:
        # Get available tasks
        print("\nFetching available tasks...")
        tasks = await worker.get_available_tasks(limit=10)

        print(f"\n✅ Found {len(tasks)} available tasks\n")

        # Display all tasks with details
        for i, task in enumerate(tasks, 1):
            print(f"{i}. Task ID: {task.get('task_id')}")
            print(f"   Title: {task.get('title')}")
            print(f"   Description: {task.get('description', 'N/A')[:150]}...")
            print(f"   Priority: {task.get('priority', 'medium')}")
            print(f"   Status: {task.get('status')}")
            print()

        # Identify tasks suitable for Debbie
        print("\n" + "="*80)
        print("ANALYZING TASKS FOR DEBBIE'S CAPABILITIES")
        print("="*80)

        suitable_tasks = []

        for task in tasks:
            task_id = task.get('task_id')
            title = task.get('title', '')
            desc = task.get('description', '')

            # Debbie can handle: design, UX, page updates, navigation fixes
            if any(keyword in (title + desc).lower() for keyword in [
                'design', 'page', 'navigation', 'button', 'resume',
                'social links', 'contact', 'layout', 'ux'
            ]):
                suitable_tasks.append(task)
                print(f"\n✅ SUITABLE: {task_id}")
                print(f"   Reason: Design/UX/Page modification work")

        if suitable_tasks:
            # Claim the highest priority suitable task
            task_to_claim = suitable_tasks[0]
            task_id = task_to_claim.get('task_id')
            title = task_to_claim.get('title')

            print(f"\n{'='*80}")
            print(f"CLAIMING TASK: {task_id}")
            print(f"{'='*80}")
            print(f"Title: {title}")

            # Claim the task
            result = await worker.claim_task(task_id)

            print(f"\n✅ Task claimed successfully!")
            print(f"   Task ID: {task_id}")
            print(f"   Claimed by: debbie")

            # Update heartbeat with current task
            await worker.heartbeat(
                status="busy",
                current_task=task_id,
                current_task_title=title
            )

            print(f"\n💓 Heartbeat updated with current task")

            # Send coordination message
            await worker.send_coordination_message(
                f"Debbie claimed task '{task_id}': {title}. Starting autonomous execution now."
            )

            print(f"\n📣 Coordination message sent")

            print(f"\n{'='*80}")
            print(f"✅ READY TO WORK ON TASK")
            print(f"{'='*80}")
            print(f"Next: Debbie will autonomously execute this task")

            # Return task details for execution
            return task_to_claim

        else:
            print(f"\n⚠️  No suitable tasks found for Debbie's capabilities")
            print(f"    Debbie specializes in: Design, UX, Page updates, Navigation")
            return None

if __name__ == "__main__":
    task = asyncio.run(get_and_claim_task())
    if task:
        # Save task details for next step
        with open('/Users/michaeljones/Dev/MJ_Online/debbie_current_task.json', 'w') as f:
            json.dump(task, f, indent=2, default=str)
        print(f"\n📝 Task details saved to debbie_current_task.json")
