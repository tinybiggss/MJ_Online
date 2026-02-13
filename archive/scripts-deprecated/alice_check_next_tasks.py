#!/usr/bin/env python3
"""
Alice - Check for SEO and social media tasks
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import WorkerClient


async def check_tasks():
    """Check for SEO and social media tasks."""

    async with WorkerClient("Alice") as worker:
        await worker.heartbeat(status="active", current_task=None)

        # Get available tasks
        tasks = await worker.get_available_tasks()

        print("\n" + "="*80)
        print("📋 AVAILABLE TASKS")
        print("="*80)

        if not tasks:
            print("\n⚠️ No tasks found in queue")
            return

        # Filter for SEO and social media tasks
        seo_tasks = []
        social_tasks = []
        other_tasks = []

        for task in tasks:
            task_id = task.get('task_id', '')
            title = task.get('title', '')
            description = task.get('description', '')

            combined_text = f"{task_id} {title} {description}".lower()

            if 'seo' in combined_text or 'schema' in combined_text or 'meta' in combined_text:
                seo_tasks.append(task)
            elif 'social' in combined_text or 'linkedin' in combined_text or 'twitter' in combined_text or 'github' in combined_text:
                social_tasks.append(task)
            else:
                other_tasks.append(task)

        # Display SEO tasks
        if seo_tasks:
            print(f"\n🔍 SEO TASKS ({len(seo_tasks)}):")
            for task in seo_tasks:
                print(f"\n   Task ID: {task.get('task_id')}")
                print(f"   Title: {task.get('title', 'N/A')}")
                print(f"   Status: {task.get('status', 'N/A')}")
                print(f"   Description: {task.get('description', 'N/A')[:200]}")

        # Display social media tasks
        if social_tasks:
            print(f"\n📱 SOCIAL MEDIA TASKS ({len(social_tasks)}):")
            for task in social_tasks:
                print(f"\n   Task ID: {task.get('task_id')}")
                print(f"   Title: {task.get('title', 'N/A')}")
                print(f"   Status: {task.get('status', 'N/A')}")
                print(f"   Description: {task.get('description', 'N/A')[:200]}")

        # Display other tasks
        if other_tasks:
            print(f"\n📌 OTHER TASKS ({len(other_tasks)}):")
            for task in other_tasks[:5]:  # Show first 5
                print(f"\n   Task ID: {task.get('task_id')}")
                print(f"   Title: {task.get('title', 'N/A')}")
                print(f"   Status: {task.get('status', 'N/A')}")

        print("\n" + "="*80)


if __name__ == "__main__":
    asyncio.run(check_tasks())
