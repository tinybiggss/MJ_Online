"""Simple script to publish tasks for testing."""

import asyncio
import sys
from client import TaskPublisher
from models import Task


async def publish_test_task(task_id: str, title: str, description: str):
    """Publish a test task to the queue."""
    print(f"📤 Publishing task: {title}")

    task = Task(
        task_id=task_id,
        title=title,
        description=description,
        status="available",
        blocked_by=[],
        priority="high"
    )

    async with TaskPublisher() as publisher:
        result = await publisher.publish_task(task.model_dump(mode='json'))
        print(f"✓ Task published successfully!")
        print(f"  Task ID: {task_id}")
        print(f"  Sequence: {result['sequence']}")

    print("\n✨ Task is now available for agents to claim!")
    print(f"   View at: http://localhost:8001")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python publish_task.py <task_id> <title> <description>")
        print('Example: python publish_task.py "1" "Research Ghost themes" "Research and document..."')
        sys.exit(1)

    task_id = sys.argv[1]
    title = sys.argv[2]
    description = sys.argv[3]

    asyncio.run(publish_test_task(task_id, title, description))
