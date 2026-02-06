"""Web Content Builder Agent #2 - Interactive instance via Claude Code."""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for proper imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_coordination.client import WorkerClient


async def register_and_check_work():
    """Register as Web Content Builder #2 and check for available work."""
    print("🌐 Starting Web Content Builder Agent #2")

    async with WorkerClient("Web-Content-Builder-2") as client:
        # Register with the system
        await client.register(
            description="Web content creation and Ghost Pro publishing specialist - Secondary instance",
            capabilities=[
                "web-page-creation",
                "ghost-pro-publishing",
                "content-strategy",
                "seo-optimization",
                "case-studies",
                "portfolio-content",
                "rag-validation"
            ]
        )
        print("✅ Registered as Web-Content-Builder-2")

        # Send heartbeat
        await client.heartbeat(status="active")
        print("✅ Sent heartbeat")

        # Send coordination message to PM
        await client.send_coordination_message(
            "Web-Content-Builder-2 online and ready for work. "
            "I'm the second web content builder instance. "
            "Expertise: creating/editing web pages, Ghost Pro publishing, SEO optimization, "
            "content strategy, case studies, and portfolio content. "
            "All content will be validated against RAG knowledge base. "
            "Ready for task assignment."
        )
        print("✅ Sent status to Project Manager")

        # Check for available tasks
        print("\n📋 Checking for available tasks...")
        tasks = await client.get_available_tasks(limit=10)

        if not tasks:
            print("\n⏳ No available tasks found.")
            print("   Awaiting task assignment from Project Manager.")
            return

        print(f"\n🎯 Found {len(tasks)} available tasks:")
        for i, task in enumerate(tasks, 1):
            print(f"\n  {i}. Task ID: {task['task_id']}")
            print(f"     Title: {task['title']}")
            print(f"     Description: {task.get('description', 'N/A')}")
            print(f"     Priority: {task.get('priority', 'normal')}")

        print("\n✨ Web-Content-Builder-2 registration complete!")
        print("   Ready to claim and execute tasks.")


if __name__ == "__main__":
    asyncio.run(register_and_check_work())
