#!/usr/bin/env python3
"""
Debbie claims SEO audit task from NATS queue
"""

import asyncio
import sys
import json
sys.path.insert(0, "/Users/michaeljones/Dev/MJ_Online")

from agent_coordination.client import WorkerClient

async def claim_seo_task():
    """Find and claim the SEO audit task."""
    print("="*80)
    print("DEBBIE - CLAIMING SEO AUDIT TASK")
    print("="*80)

    async with WorkerClient("debbie") as worker:
        # Get available tasks
        print("\nFetching available tasks from NATS queue...")
        tasks = await worker.get_available_tasks(limit=10)

        # Find SEO audit task
        seo_task = None
        for task in tasks:
            if 'seo' in task.get('task_id', '').lower() or 'seo' in task.get('title', '').lower():
                seo_task = task
                break

        if not seo_task:
            print("❌ SEO audit task not found in queue")
            print(f"Available tasks: {len(tasks)}")
            for t in tasks:
                print(f"  - {t.get('task_id')}: {t.get('title')}")
            return None

        task_id = seo_task.get('task_id')
        title = seo_task.get('title')

        print(f"\n✅ Found SEO audit task!")
        print(f"   Task ID: {task_id}")
        print(f"   Title: {title}")

        # Claim the task
        print(f"\nClaiming task...")
        await worker.claim_task(task_id)
        print(f"✅ Task claimed successfully!")

        # Update heartbeat
        await worker.heartbeat(
            status="busy",
            current_task=task_id,
            current_task_title=title
        )
        print(f"💓 Heartbeat updated")

        # Send coordination message
        await worker.send_coordination_message(
            f"🎨 Debbie claimed SEO audit task (phase4-seo). Starting comprehensive SEO audit and Schema.org implementation analysis. Working autonomously now!"
        )
        print(f"📣 Coordination message sent")

        # Save task details
        with open('/Users/michaeljones/Dev/MJ_Online/debbie_seo_task.json', 'w') as f:
            json.dump(seo_task, f, indent=2, default=str)

        print(f"\n{'='*80}")
        print(f"✅ SEO TASK CLAIMED - READY TO START AUDIT")
        print(f"{'='*80}")

        return seo_task

if __name__ == "__main__":
    task = asyncio.run(claim_seo_task())
    if task:
        print(f"\n🎯 Starting SEO audit autonomously...")
        print(f"📝 Task details saved to debbie_seo_task.json")
