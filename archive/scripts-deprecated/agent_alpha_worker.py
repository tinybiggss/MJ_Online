#!/usr/bin/env python3
"""Agent Alpha - Browser automation worker for Ghost Pro configuration."""

import sys
sys.path.append('/Users/michaeljones/Dev/MJ_Online')

from agent_coordination.client import WorkerClient
import asyncio
import json


async def execute_task_2(client: WorkerClient):
    """Configure custom domain (MikeJones.online) for Ghost Pro."""
    await client.send_coordination_message("Starting Task 2: Configure custom domain")

    # This task requires browser automation
    # Steps:
    # 1. Navigate to Ghost Pro admin -> Settings -> General
    # 2. Update domain to MikeJones.online
    # 3. Get DNS records from Ghost
    # 4. Navigate to GoDaddy DNS management
    # 5. Add required DNS records

    return {
        "status": "requires_browser",
        "message": "Browser automation not available. Need Claude browser extension."
    }


async def execute_task_3(client: WorkerClient):
    """Configure email delivery for Ghost Pro."""
    await client.send_coordination_message("Starting Task 3: Configure email delivery")

    # This task requires browser automation
    # Steps:
    # 1. Navigate to Ghost Pro admin -> Settings -> Email
    # 2. Configure email service (Mailgun or Ghost's built-in)
    # 3. Verify email configuration

    return {
        "status": "requires_browser",
        "message": "Browser automation not available. Need Claude browser extension."
    }


async def execute_task_4(client: WorkerClient):
    """Configure initial Ghost Pro settings."""
    await client.send_coordination_message("Starting Task 4: Configure Ghost Pro settings")

    # This task requires browser automation
    # Steps:
    # 1. Navigate to Ghost Pro admin -> Settings
    # 2. Update site title, description, timezone
    # 3. Configure navigation menu
    # 4. Set up social accounts

    return {
        "status": "requires_browser",
        "message": "Browser automation not available. Need Claude browser extension."
    }


async def main():
    """Main worker loop."""
    async with WorkerClient('Agent-Alpha', 'http://localhost:8001') as client:
        # Register
        await client.register(
            description='Browser automation specialist for Ghost Pro configuration',
            capabilities=['browser-automation', 'ghost-admin', 'dns-configuration']
        )

        print("Agent Alpha registered successfully")

        # Send heartbeat
        await client.heartbeat(status='active')

        # Get available tasks
        tasks = await client.get_available_tasks()

        print(f"\nFound {len(tasks)} total tasks")

        # Filter for browser automation tasks (2, 3, 4)
        my_tasks = [t for t in tasks if t['task_id'] in ['2', '3', '4'] and t['status'] == 'available']

        if not my_tasks:
            print("No tasks available for Agent Alpha")
            return

        print(f"\nFound {len(my_tasks)} tasks for Agent Alpha:")
        for task in my_tasks:
            print(f"  - Task {task['task_id']}: {task['title']}")

        # Process each task
        for task in my_tasks:
            task_id = task['task_id']
            print(f"\n{'='*60}")
            print(f"Processing Task {task_id}: {task['title']}")
            print(f"{'='*60}")

            # Claim the task
            await client.send_coordination_message(f"Claiming task {task_id}: {task['title']}")
            await client.claim_task(task_id)
            print(f"✓ Claimed task {task_id}")

            # Execute the task based on task_id
            try:
                if task_id == '2':
                    result = await execute_task_2(client)
                elif task_id == '3':
                    result = await execute_task_3(client)
                elif task_id == '4':
                    result = await execute_task_4(client)
                else:
                    result = {"status": "unknown", "error": f"Unknown task ID: {task_id}"}

                print(f"Task result: {json.dumps(result, indent=2)}")

                # Report error if browser not available
                if result.get('status') == 'requires_browser':
                    await client.report_error(
                        f"Task {task_id} requires browser automation but Claude browser extension is not connected"
                    )
                    print(f"✗ Task {task_id} failed: Browser not available")
                else:
                    # Complete the task
                    await client.complete_task(task_id, result=result)
                    await client.send_coordination_message(f"Completed task {task_id}")
                    print(f"✓ Completed task {task_id}")

            except Exception as e:
                error_msg = f"Error executing task {task_id}: {str(e)}"
                print(f"✗ {error_msg}")
                await client.report_error(error_msg)
                await client.complete_task(task_id, error=error_msg)

        # Final heartbeat
        await client.heartbeat(status='idle')
        print("\n" + "="*60)
        print("Agent Alpha finished processing all available tasks")
        print("="*60)


if __name__ == "__main__":
    asyncio.run(main())
