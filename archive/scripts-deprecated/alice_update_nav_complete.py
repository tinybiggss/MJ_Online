#!/usr/bin/env python3
"""Update navigation task - manual step completed by Mike."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "agent_coordination"))
from agent_coordination.client import WorkerClient


async def update_nav_task():
    """Update navigation task status."""

    async with WorkerClient("Alice") as worker:
        # Update the task to reflect Mike completed the manual step
        await worker.send_coordination_message(
            "✅ Writing Navigation Update - COMPLETE!\n\n"
            "Mike has manually updated Ghost Admin:\n"
            "  - Changed label from 'Writing' to 'Substack'\n"
            "  - Ready for full Substack landing page\n\n"
            "🎨 Debbie is now designing /substack landing page with:\n"
            "  - Resilient Tomorrow section\n"
            "  - Org Intelligence (Velocity Partners) section\n"
            "  - Two-column layout with logos\n"
            "  - Descriptions of each publication\n"
            "  - RSS feed previews\n\n"
            "Alice standing by to publish once Debbie's PAGE_SPEC is ready!"
        )
        
        print("✅ Navigation task updated in NATS")
        print("🎨 Debbie is designing the Substack landing page")
        print("✨ Alice ready to publish when PAGE_SPEC is ready")


if __name__ == "__main__":
    asyncio.run(update_nav_task())
