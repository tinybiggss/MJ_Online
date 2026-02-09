#!/usr/bin/env python3
"""
Register Doc Brown (Mobiledoc Assembler) with NATS coordination system.
"""

import asyncio
import httpx


async def register_docbrown():
    """Register Doc Brown and send initial heartbeat."""
    base_url = "http://localhost:8001"

    async with httpx.AsyncClient(base_url=base_url, timeout=30.0) as client:
        # Register with NATS
        print("Registering Doc Brown...")
        response = await client.post(
            "/api/agents/register",
            json={
                "agent_id": "Doc-Brown",
                "description": "Mobiledoc JSON assembler - converts design specs to Ghost-compatible format",
                "capabilities": [
                    "mobiledoc_assembly",
                    "json_generation",
                    "ghost_api",
                    "content_structure"
                ]
            }
        )
        response.raise_for_status()
        print("✅ Doc Brown registered with NATS")

        # Send initial heartbeat
        response = await client.post(
            "/api/agents/heartbeat",
            json={
                "agent_id": "Doc-Brown",
                "status": "active",
                "current_task": None
            }
        )
        response.raise_for_status()
        print("✅ Initial heartbeat sent")

        # Check for available tasks
        print("\n📋 Checking for available tasks...")
        response = await client.get("/api/tasks/available")
        response.raise_for_status()
        tasks = response.json()

        if tasks:
            print(f"Found {len(tasks)} available tasks:")
            for task in tasks:
                print(f"  - {task.get('task_id')}: {task.get('title')}")

                # Check if this is a mobiledoc-related task
                keywords = ["mobiledoc", "PAGE_SPEC", "convert", "assembly", "json", "about"]
                title = task.get('title', '').lower()
                desc = task.get('description', '').lower()

                is_my_task = any(kw.lower() in title or kw.lower() in desc for kw in keywords)
                if is_my_task:
                    print(f"    ⚡ This looks like a task for me!")
        else:
            print("No available tasks found")

        # Coordinate with team
        response = await client.post(
            "/api/messages",
            json={
                "agent_id": "Doc-Brown",
                "channel": "coordination",
                "content": (
                    "Doc Brown online and ready! Monitoring for PAGE_SPEC conversions and Mobiledoc assembly tasks. "
                    "Currently no tasks assigned - waiting for handoff from Debbie after PAGE_SPEC approval. "
                    "Status: Active and monitoring NATS coordination channel."
                )
            }
        )
        response.raise_for_status()
        print("✅ Coordination message sent")

        print("\n🎯 Doc Brown is now registered and monitoring NATS!")
        print("   Status: Active")
        print("   Waiting for: PAGE_SPEC approval → Image URLs from Alice → Conversion work")


if __name__ == "__main__":
    asyncio.run(register_docbrown())
