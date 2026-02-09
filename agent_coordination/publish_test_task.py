#!/usr/bin/env python3
"""
Publish a test task to the NATS queue.

Useful for testing autonomous agents.

Usage:
    python3 publish_test_task.py --type design --title "Design About page"
    python3 publish_test_task.py --type mobiledoc --title "Convert design to Mobiledoc"
    python3 publish_test_task.py --type publishing --title "Publish to Ghost"
"""

import asyncio
import argparse
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import TaskPublisher


async def publish_task(task_type: str, title: str, description: str = None):
    """
    Publish a task to the NATS queue.

    Args:
        task_type: Type of task (design, mobiledoc, publishing, etc.)
        title: Task title
        description: Optional task description
    """
    if not description:
        description = f"Test task: {title}"

    task_id = f"test-{task_type}-{int(datetime.now().timestamp())}"

    print(f"📤 Publishing task to NATS queue...")
    print(f"   ID: {task_id}")
    print(f"   Type: {task_type}")
    print(f"   Title: {title}")
    print(f"   Description: {description}")
    print()

    async with TaskPublisher() as publisher:
        result = await publisher.publish_task({
            "task_id": task_id,
            "title": title,
            "description": description,
            "type": task_type,
            "status": "available",
            "priority": "high",
            "owner": None,
            "blocked_by": [],
            "created_at": datetime.now().isoformat()
        })

    print(f"✅ Task published successfully!")
    print(f"   Response: {result}")
    print()
    print(f"Agents watching for '{task_type}' tasks should pick this up automatically.")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Publish a test task to NATS queue for autonomous agents"
    )
    parser.add_argument(
        "--type",
        type=str,
        required=True,
        help="Task type (design, mobiledoc, publishing, etc.)"
    )
    parser.add_argument(
        "--title",
        type=str,
        required=True,
        help="Task title"
    )
    parser.add_argument(
        "--description",
        type=str,
        default=None,
        help="Task description (optional)"
    )

    args = parser.parse_args()

    asyncio.run(publish_task(args.type, args.title, args.description))


if __name__ == "__main__":
    main()
