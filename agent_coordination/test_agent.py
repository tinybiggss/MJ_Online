"""Test agent to demonstrate the coordination system."""

import asyncio
import sys
from client import WorkerClient


async def main(agent_id: str):
    """Run a test agent that picks up and completes tasks."""
    print(f"🤖 Starting test agent: {agent_id}")

    async with WorkerClient(agent_id) as client:
        # Register
        await client.register(
            description="Test worker agent",
            capabilities=["research", "documentation", "testing"]
        )
        print(f"✓ Registered as {agent_id}")

        # Send heartbeat
        await client.heartbeat(status="active")
        print("✓ Sent heartbeat")

        # Get available tasks
        print("\n📋 Checking for available tasks...")
        tasks = await client.get_available_tasks(limit=10)

        if not tasks:
            print("No available tasks found.")
            print("\nTo test the system:")
            print("1. Publish a task using publish_task.py")
            print("2. Or use the API: curl -X POST http://localhost:8001/api/tasks ...")
            return

        print(f"Found {len(tasks)} available tasks:")
        for task in tasks:
            print(f"  - Task {task['task_id']}: {task['title']}")

        # Claim first task
        task = tasks[0]
        print(f"\n🎯 Claiming task: {task['task_id']}")

        try:
            claim_result = await client.claim_task(task['task_id'])
            print(f"✓ Task claimed: {claim_result['task']['title']}")

            # Simulate doing work
            await client.send_coordination_message(
                f"Working on task: {task['title']}"
            )
            print("💼 Working on task...")
            await asyncio.sleep(2)  # Simulate work

            # Complete task
            print("✅ Completing task...")
            completion_result = await client.complete_task(
                task['task_id'],
                result={"status": "success", "message": "Task completed by test agent"}
            )
            print(f"✓ Task completed: {completion_result['task']['title']}")

            await client.send_coordination_message(
                f"Completed task: {task['title']}"
            )

        except Exception as e:
            print(f"❌ Error: {e}")
            await client.report_error(f"Failed to complete task {task['task_id']}: {e}")

        print("\n✨ Test agent finished!")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_agent.py <agent_id>")
        print("Example: python test_agent.py Agent-Alpha")
        sys.exit(1)

    agent_id = sys.argv[1]
    asyncio.run(main(agent_id))
